import { connectToDB } from "./database.js";

export const testMongoConnection = async () => {
    try {
        console.log("🔄 Testing MongoDB connection...");
        console.log("📍 MongoDB URI:", process.env.MONGODB_URI ? "Set" : "Not set");

        const connection = await connectToDB();

        if (connection) {
            console.log("✅ MongoDB connection successful!");
            console.log("📊 Connection state:", connection.connection.readyState);
            console.log("🏷️  Database name:", connection.connection.name);
            return true;
        }

        return false;
    } catch (error) {
        console.error("❌ MongoDB connection failed:");
        console.error("🔍 Error name:", error.name);
        console.error("💬 Error message:", error.message);

        if (error.name === "MongooseServerSelectionError") {
            console.error("🌐 This is likely a network/IP whitelist issue");
            console.error("💡 Solutions:");
            console.error("   1. Check your IP is whitelisted in MongoDB Atlas");
            console.error("   2. Verify your connection string is correct");
            console.error("   3. Ensure your cluster is not paused");
        }

        return false;
    }
};
