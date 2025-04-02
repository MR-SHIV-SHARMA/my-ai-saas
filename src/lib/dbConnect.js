import mongoose from "mongoose";

const MONGODB_URI = process.env.DATABASE_URL;

if (!MONGODB_URI) {
  throw new Error("Please define the DATABASE_URL environment variable");
}

// Use a global cached connection to prevent multiple connections in development
let cached = global.mongoose || { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI); // ✅ Removed deprecated options
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Store the cached connection globally to avoid multiple DB connections
global.mongoose = cached;

export default dbConnect;
