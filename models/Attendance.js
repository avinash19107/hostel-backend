import mongoose from "mongoose";

const attendanceRecordSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    hostelId: { type: String, required: true },
    records: [
      {
        studentId: { type: String, required: true },
        roomId: { type: String, required: true },
        status: { type: String, enum: ["Present", "Absent"], required: true }
      }
    ]
  },
  { timestamps: true }
);

export const AttendanceModel = mongoose.model(
  "AttendanceRecord",
  attendanceRecordSchema
);
