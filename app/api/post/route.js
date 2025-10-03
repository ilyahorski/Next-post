import Post from "~/models/post";
import "~/models/user";
import { connectToDB } from "~/utils/database";

export const GET = async (request) => {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 4;

    try {
        await connectToDB();

        const totalPosts = await Post.countDocuments({});

        const posts = await Post.find({})
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate("creator");

        return new Response(JSON.stringify({ totalPosts, posts }), { status: 200 });
    } catch (error) {
        console.error("API Error in /api/post:", error.name, error.message);

        const errorResponse = process.env.NODE_ENV === "development" ? { error: error.message, type: error.name } : { error: "Failed to fetch posts" };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};
