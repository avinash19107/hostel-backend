// backend/db.js
import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("❌ MONGODB_URI not set in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      // These options help with some Windows + Atlas TLS issues
      serverSelectionTimeoutMS: 10000,
      tls: true,
      tlsAllowInvalidCertificates: true, // ok for college project, not for banking apps 😄
    });

    console.log("✅ Connected to MongoDB from server.js");
  } catch (err) {
    console.error("❌ MongoDB connection failed in server.js:", err);
    process.exit(1);
  }
}
