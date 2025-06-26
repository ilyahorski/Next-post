import Message from "~/models/message";
import { checkConnection, connectToDB } from "~/utils/database";

export const GET = async (request, { params }) => {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const chatId = request.headers.get("chatId");

    // Validate required parameters
    if (!chatId) {
        console.error("Missing chatId header in message request");
        return new Response("Missing chatId header", { status: 400 });
    }

    // Log request details for debugging
    console.log(`Fetching messages for chatId: ${chatId}, page: ${page}, limit: ${limit}`);

    try {
        // Check connection status before attempting to connect
        const connectionStatus = checkConnection();
        console.log("Connection status before connectToDB:", connectionStatus);

        await connectToDB();

        // Retry logic for database operations
        let retryCount = 0;
        const maxRetries = 2;

        while (retryCount <= maxRetries) {
            try {
                const totalMessages = await Message.countDocuments({ chatId });

                const usersMessages = await Message.find({ chatId })
                    .sort({ createdAt: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate("writerId")
                    .populate("chatId")
                    .populate("deletedBy")
                    .populate({
                        path: "replyTo",
                        populate: { path: "writerId", model: "User" },
                        match: { $exists: true },
                    })
                    .lean(); // Use lean() for better performance

                console.log(`Successfully fetched ${usersMessages.length} messages for chatId: ${chatId}`);

                return new Response(JSON.stringify({ totalMessages, usersMessages }), { 
                    status: 200,
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

            } catch (dbError) {
                retryCount++;
                console.error(`Database operation failed (attempt ${retryCount}/${maxRetries + 1}):`, {
                    error: dbError.message,
                    chatId,
                    page,
                    limit,
                    connectionStatus: checkConnection(),
                });

                if (retryCount > maxRetries) {
                    throw dbError;
                }

                // Wait before retry
                await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
            }
        }

    } catch (error) {
        console.error("Message API Error:", {
            message: error.message,
            stack: error.stack,
            chatId,
            page,
            limit,
            connectionStatus: checkConnection(),
            timestamp: new Date().toISOString(),
        });

        // Return more specific error messages based on error type
        if (error.name === "MongooseError" || error.name === "MongoError") {
            return new Response("Database connection error", { status: 503 });
        }

        if (error.name === "ValidationError") {
            return new Response("Invalid request parameters", { status: 400 });
        }

        return new Response("Internal Server Error", { status: 500 });
    }
};
