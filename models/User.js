import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // college/system ID (same as frontend `id`)
    id: { type: String, required: true, unique: true },

    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    role: {
      type: String,
      enum: ["ADMIN", "STUDENT"],
      default: "STUDENT",
      required: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    phone: String,
    course: String,
    year: String,

    // hostel assignment
    assignedRoomId: { type: String, default: null },
    assignedBedId: { type: String, default: null },

    // UI extras
    avatarUrl: String,
    tags: [String],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
