import mongoose from 'mongoose';

let isConnected = false; // track the connection

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  if (isConnected) {
    console.log('MongoDB is already connected');
    return;
  }

  mongoose.connection.on('connected', () => {
    isConnected = true;
    console.log('Mongoose is connected');
  });

  mongoose.connection.on('error', (err) => {
    isConnected = false;
    console.log(`Mongoose connection error: ${err}`);
  });

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    console.log('Mongoose is disconnected');
  });

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'share_prompt',
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s of trying to connect
    });

    console.log('MongoDB connected');
  } catch (error) {
    console.log(error);
  }
};