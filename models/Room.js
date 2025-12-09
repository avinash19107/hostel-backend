import mongoose from "mongoose";
import { RoomStatus } from "../constants.js"; // or just hardcode enums

const BedSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },      // e.g. "BH1-101-A"
    label: { type: String, required: true },   // "A", "B", etc.
    status: {
      type: String,
      enum: ["Available", "Occupied", "Maintenance", "Requested"],
      default: "Available",
    },
    occupantId: { type: String, default: null }, // user.id
  },
  { _id: false }
);

const RoomSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // "BH1-101"
    hostelId: { type: String, required: true },         // match HOSTELS ids
    floor: { type: Number, required: true },
    number: { type: String, required: true },           // "101"

    capacity: { type: Number, required: true },
    price: { type: Number, required: true },

    status: {
      type: String,
      enum: ["Available", "Occupied", "Maintenance"],
      default: "Available",
    },

    occupants: [String],        // list of user.id
    beds: [BedSchema],
    features: [String],         // "AC", "Attached Bathroom", etc.

    // optional: for grid positioning on floor map
    gridX: Number,
    gridY: Number,
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", RoomSchema);
export default Room;
