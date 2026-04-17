import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || '';

let cachedConnection: any = null;
let connectionPromise: Promise<any> | null = null;

export const connectDB = async () => {
  if (cachedConnection) return cachedConnection;
  if (connectionPromise) return connectionPromise;
  
  if (!MONGO_URI || (!MONGO_URI.startsWith('mongodb://') && !MONGO_URI.startsWith('mongodb+srv://'))) {
    const errorMsg = 'MONGO_URI is missing or invalid. Please add a valid MongoDB connection string in the "Settings > Secrets" menu.';
    console.error(`[DATABASE ERROR] ${errorMsg}`);
    throw new Error(errorMsg);
  }

  // Set timeout and disable buffering to prevent hanging requests
  mongoose.set('bufferCommands', false);

  connectionPromise = mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
  }).then(conn => {
    cachedConnection = conn;
    console.log('MongoDB connected successfully');
    return cachedConnection;
  }).catch(err => {
    connectionPromise = null; // Reset promise on error so we can retry
    console.error('MongoDB connection error:', err);
    throw err;
  });

  return connectionPromise;
};
