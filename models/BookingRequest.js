import mongoose from "mongoose";

const BookingRequestSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // "req_17336..."
    roomId: { type: String, required: true },
    bedId: { type: String, required: true },

    studentId: { type: String, required: true },
    studentName: { type: String, required: true },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    timestamp: { type: Number, required: true },
  },
  { timestamps: true }
);

const BookingRequest = mongoose.model(
  "BookingRequest",
  BookingRequestSchema
);

export default BookingRequest;
