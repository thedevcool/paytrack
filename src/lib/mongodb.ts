import mongoose from "mongoose";

const connection: { isConnected?: number } = {};

export const connectDB = async (): Promise<void> => {
  if (connection.isConnected) {
    return;
  }

  try {
    const mongoUri = process.env.MONGODB_URI!;
    
    const db = await mongoose.connect(mongoUri, {
      ssl: true,
      tlsInsecure: false,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority',
    });
    
    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
