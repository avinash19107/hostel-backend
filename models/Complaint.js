import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, default: "Pending" },
    timestamp: { type: Number, required: true }
  },
  { timestamps: true }
);

export const ComplaintModel = mongoose.model("Complaint", complaintSchema);
