import mongoose from "mongoose";

const BookingRequestSchema = new mongoose.Schema(
  {
    studentId: String,
    studentName: String,
    roomId: String,
    bedId: String,
    timestamp: Number,
  },
  { timestamps: true }
);

export const BookingRequestModel = mongoose.model(
  "BookingRequest",
  BookingRequestSchema
);
