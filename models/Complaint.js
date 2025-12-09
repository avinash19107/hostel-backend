// models/Complaint.js
import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },

    type: { type: String, required: true },     // "Electricity", "Water", etc.
    description: { type: String, required: true },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },

    timestamp: { type: Number, required: true },
  },
  { timestamps: true }
);

const Complaint = mongoose.model("Complaint", ComplaintSchema);
export default Complaint;
