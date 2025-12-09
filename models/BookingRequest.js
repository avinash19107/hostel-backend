import mongoose from "mongoose";

const BookingRequestSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // req_17337...
    studentId: String,
    studentName: String,
    roomId: String,
    bedId: String,
    timestamp: Number
  },
  { timestamps: true }
);

export const BookingRequestModel = mongoose.model(
  "BookingRequest",
  BookingRequestSchema
);
