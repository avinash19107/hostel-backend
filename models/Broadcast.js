// backend/models/Broadcast.js
import mongoose from "mongoose";

const BroadcastSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // "broadcast_..."
    message: { type: String, required: true },
    priority: { type: String, default: "Normal" },     // "Normal" | "High"
    sender: { type: String, default: "Admin" },
    timestamp: { type: Number, required: true },
  },
  { timestamps: true }
);

export const BroadcastModel = mongoose.model("Broadcast", BroadcastSchema);
export default BroadcastModel;
