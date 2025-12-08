import mongoose from "mongoose";

const bookingRequestSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    roomId: { type: String, required: true },
    bedId: { type: String, required: true },
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    timestamp: { type: Number, required: true }
  },
  { timestamps: true }
);

export const BookingRequestModel = mongoose.model(
  "BookingRequest",
  bookingRequestSchema
);
