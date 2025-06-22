import mongoose from "mongoose";

let connection = null;

// let isConnected = false; // track the connection

// mongoose.connection.setMaxListeners(15);

// mongoose.connection.on('connected', () => {
//   isConnected = true;
//   console.log('Mongoose is connected');
// });

// mongoose.connection.on('error', (err) => {
//   isConnected = false;
//   console.log(`Mongoose connection error: ${err}`);
// });

// mongoose.connection.on('disconnected', () => {
//   isConnected = false;
//   console.log('Mongoose is disconnected');
// });

export const connectToDB = async () => {
    mongoose.set("strictQuery", true);

    if (connection && mongoose.connection.readyState === 1) {
        console.log("MongoDB is already connected");
        return connection;
    }

    try {
        connection = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "share_post",
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000, // Увеличиваем таймаут до 30 секунд
            socketTimeoutMS: 45000, // Таймаут сокета
            connectTimeoutMS: 30000, // Таймаут подключения
            maxPoolSize: 10, // Максимальное количество соединений в пуле
            retryWrites: true,
            retryReads: true,
        });

        console.log("MongoDB connected successfully");
        return connection;
    } catch (error) {
        console.error("MongoDB connection error:", error.message);

        // Сбрасываем connection при ошибке
        connection = null;

        // Повторная попытка через 5 секунд
        setTimeout(() => {
            console.log("Retrying MongoDB connection...");
            connectToDB();
        }, 5000);

        throw error;
    }
};
