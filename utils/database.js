import mongoose from "mongoose";

let isConnected = false;
let connectionPromise = null;
let listenersInitialized = false;

// Initialize event listeners only once
const initializeEventListeners = () => {
    if (listenersInitialized) {
        return;
    }
    
    // Set max listeners to prevent warnings
    mongoose.connection.setMaxListeners(15);
    
    mongoose.connection.on("connected", () => {
        isConnected = true;
        console.log("MongoDB connected successfully");
    });

    mongoose.connection.on("error", (err) => {
        isConnected = false;
        console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
        isConnected = false;
        console.log("MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
        isConnected = true;
        console.log("MongoDB reconnected");
    });
    
    listenersInitialized = true;
};

export const connectToDB = async () => {
    mongoose.set("strictQuery", true);
    
    // Initialize event listeners only once
    initializeEventListeners();

    // If already connected, return immediately
    if (isConnected && mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    // If connection is in progress, wait for it
    if (connectionPromise) {
        return connectionPromise;
    }

    // If connecting or reconnecting, wait for the connection
    if (mongoose.connection.readyState === 2) {
        return new Promise((resolve, reject) => {
            mongoose.connection.once("connected", () => resolve(mongoose.connection));
            mongoose.connection.once("error", reject);
        });
    }

    try {
        console.log("Connecting to MongoDB...");
        
        connectionPromise = mongoose.connect(process.env.MONGODB_URI, {
            dbName: "share_post",
            serverSelectionTimeoutMS: 10000, // Reduced timeout for faster failure detection
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000,
            maxPoolSize: 10,
            minPoolSize: 2, // Maintain minimum connections
            maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
            retryWrites: true,
            retryReads: true,
        });

        await connectionPromise;
        connectionPromise = null;
        isConnected = true;
        
        return mongoose.connection;
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        connectionPromise = null;
        isConnected = false;
        throw error;
    }
};

// Health check function
export const checkConnection = () => {
    return {
        isConnected,
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        name: mongoose.connection.name,
    };
};
