import mongoose from "mongoose";

const BroadcastSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // "broadcast_..."
    message: { type: String, required: true },
    priority: { type: String, enum: ["low", "normal", "high"], default: "normal" },
    sender: { type: String, required: true },           // admin name
    timestamp: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Broadcast", BroadcastSchema);
