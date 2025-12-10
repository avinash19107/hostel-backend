// backend/models/GatePass.js
import mongoose from "mongoose";

const GatePassSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // "gp_..."
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },

    departureDate: { type: String, required: true },
    returnDate: { type: String, required: true },
    reason: { type: String, required: true },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    timestamp: { type: Number, required: true },
  },
  { timestamps: true }
);

export const GatePassModel = mongoose.model("GatePass", GatePassSchema);
export default GatePassModel;
