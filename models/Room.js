// backend/models/Room.js
import mongoose from "mongoose";

const BedSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    number: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Available", "Occupied", "Maintenance", "Requested"],
      default: "Available",
    },
    occupantId: { type: String, default: null },
  },
  { _id: false }
);

const MaintenanceEntrySchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    note: String,
    status: String,
  },
  { _id: false }
);

const AssetSchema = new mongoose.Schema(
  {
    name: String,
    quantity: Number,
    condition: String,
  },
  { _id: false }
);

const RoomSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // eg: krishna-101
    hostelId: { type: String, required: true }, // eg: krishna
    number: { type: String, required: true },   // "101"
    floor: { type: Number, required: true },

    type: { type: String, required: true },     // "2-in-1 (Double)" etc
    price: { type: Number, required: true },

    status: {
      type: String,
      enum: ["Available", "Occupied", "Maintenance"],
      default: "Available",
    },

    capacity: { type: Number, required: true },
    occupants: { type: [String], default: [] }, // user ids

    beds: { type: [BedSchema], default: [] },

    features: { type: [String], default: [] },
    maintenanceLog: { type: [MaintenanceEntrySchema], default: [] },
    assets: { type: [AssetSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

export const RoomModel = mongoose.model("Room", RoomSchema);
