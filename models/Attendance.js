// backend/models/Attendance.js
import mongoose from "mongoose";

const AttendanceRecordSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    status: { type: String, enum: ["Present", "Absent"], required: true },
  },
  { _id: false }
);

const AttendanceSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },       // "2025-12-10"
    hostelId: { type: String, required: true },   // "G1", "B2", etc.
    records: { type: [AttendanceRecordSchema], default: [] },
  },
  { timestamps: true }
);

export const AttendanceModel = mongoose.model("Attendance", AttendanceSchema);
export default AttendanceModel;
