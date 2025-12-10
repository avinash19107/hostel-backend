// backend/models/Room.js
import mongoose from "mongoose";

const BedSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },        // e.g., "G1-101-A"
    label: { type: String, required: true },     // e.g., "Bed A"
    status: {
      type: String,
      enum: ["Available", "Occupied", "Requested", "Maintenance"],
      default: "Available",
    },
    occupantId: { type: String, default: null }, // user.id
  },
  { _id: false }
);

const RoomSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },   // "G1-101"
    hostelId: { type: String, required: true },           // "G1"
    floor: { type: Number, required: true },
    name: { type: String, required: true },               // "Room 101"
    capacity: { type: Number, required: true },
    price: { type: Number, required: true },

    status: {
      type: String,
      enum: ["Available", "Occupied", "Maintenance"],
      default: "Available",
    },

    beds: { type: [BedSchema], default: [] },
    occupants: { type: [String], default: [] },   // array of user.id
    features: { type: [String], default: [] },    // eg ["Balcony", "AC"]
  },
  { timestamps: true }
);

export const RoomModel = mongoose.model("Room", RoomSchema);
export default RoomModel;
