import mongoose from "mongoose";

const BedSchema = new mongoose.Schema(
  {
    id: String,
    label: String,
    status: {
      type: String,
      enum: ["Available", "Requested", "Occupied", "Maintenance"],
      default: "Available",
    },
    occupantId: { type: String, default: null },
  },
  { _id: false }
);

const RoomSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    hostelId: { type: String, required: true },
    floor: { type: Number, required: true },
    capacity: { type: Number, required: true },
    price: { type: Number, required: true },

    status: {
      type: String,
      enum: ["AVAILABLE", "OCCUPIED", "MAINTENANCE"],
      default: "AVAILABLE",
    },

    occupants: [String],
    beds: [BedSchema],
    features: [String],
  },
  { timestamps: true }
);

export const RoomModel = mongoose.model("Room", RoomSchema);
