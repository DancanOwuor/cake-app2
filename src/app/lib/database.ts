import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn("MONGODB_URI is missing");
}


let cached = global.mongoose as any;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectdb = async () => {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  if (cached.conn) return cached.conn;

  cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
    dbName: "CakeShop",
  });

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectdb;