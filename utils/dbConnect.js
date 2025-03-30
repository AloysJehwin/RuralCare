import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing from .env.local");
}

const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) return;
  mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
};

export default dbConnect;
