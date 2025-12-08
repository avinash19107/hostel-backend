// backend/models/Broadcast.js
import mongoose from "mongoose";

const BroadcastSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // broadcast_...
    message: { type: String, required: true },
    priority: {
      type: String,
      enum: ["Normal", "High"],
      default: "Normal",
    },
    sender: { type: String, default: "Admin" },
    timestamp: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export const BroadcastModel = mongoose.model("Broadcast", BroadcastSchema);
