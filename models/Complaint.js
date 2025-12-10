// backend/models/Complaint.js
import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // "cmp_..."
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },

    type: { type: String, required: true },        // "Maintenance", "Discipline", etc.
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Resolved"],
      default: "Pending",
    },

    timestamp: { type: Number, required: true },
  },
  { timestamps: true }
);

export const ComplaintModel = mongoose.model("Complaint", ComplaintSchema);
export default ComplaintModel;
