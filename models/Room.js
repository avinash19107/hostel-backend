import mongoose from "mongoose";

const bedSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    number: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Available", "Occupied", "Requested", "Maintenance"],
      default: "Available"
    },
    occupantId: { type: String, default: null }
  },
  { _id: false }
);

const roomSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    hostelId: { type: String, required: true },
    number: { type: String, required: true },
    floor: { type: Number, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Available", "Occupied", "Maintenance"],
      default: "Available"
    },
    capacity: { type: Number, required: true },
    occupants: { type: [String], default: [] },
    beds: { type: [bedSchema], default: [] },
    features: { type: [String], default: [] },
    maintenanceLog: { type: [String], default: [] },
    assets: { type: [String], default: [] }
  },
  { timestamps: true }
);

export const RoomModel = mongoose.model("Room", roomSchema);
