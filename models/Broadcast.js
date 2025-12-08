import mongoose from "mongoose";

const broadcastSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    message: { type: String, required: true },
    priority: { type: String, default: "Normal" },
    sender: { type: String, default: "Admin" },
    timestamp: { type: Number, required: true }
  },
  { timestamps: true }
);

export const BroadcastModel = mongoose.model("Broadcast", broadcastSchema);
