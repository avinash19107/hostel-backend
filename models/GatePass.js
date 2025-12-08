import mongoose from "mongoose";

const gatePassSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    departureDate: { type: String, required: true },
    returnDate: { type: String, required: true },
    reason: { type: String, required: true },
    status: { type: String, default: "Pending" },
    timestamp: { type: Number, required: true }
  },
  { timestamps: true }
);

export const GatePassModel = mongoose.model("GatePass", gatePassSchema);
