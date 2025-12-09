// backend/models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },  // "student1", "admin"
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    role: {
      type: String,
      enum: ["ADMIN", "STUDENT"],
      required: true,
    },

    gender: { type: String, default: "" }, // "Male", "Female", etc.

    assignedRoomId: { type: String, default: null },
    assignedBedId: { type: String, default: null },

    avatarUrl: { type: String, default: "" },
    tags: { type: [String], default: [] },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export const UserModel = mongoose.model("User", UserSchema);
