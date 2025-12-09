// backend/models/Broadcast.js
import mongoose from "mongoose";

const BroadcastSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // e.g. "broadcast_123"
    message: { type: String, required: true },
    priority: { type: String, default: "Normal" }, // "High", "Urgent", etc.
    sender: { type: String, default: "Admin" },
    timestamp: { type: Number, required: true }
  },
  {
    timestamps: false
  }
);

// ✅ Named export that matches server.js
export const BroadcastModel = mongoose.model("Broadcast", BroadcastSchema);
