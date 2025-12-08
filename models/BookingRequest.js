// backend/models/BookingRequest.js
import mongoose from "mongoose";

const BookingRequestSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // req_...
    roomId: { type: String, required: true },
    bedId: { type: String, required: true },

    studentId: { type: String, required: true },
    studentName: { type: String, required: true },

    timestamp: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export const BookingRequestModel = mongoose.model(
  "BookingRequest",
  BookingRequestSchema
);
