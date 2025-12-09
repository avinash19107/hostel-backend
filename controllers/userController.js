// backend/controllers/userController.js
import { UserModel } from "../models/User.js";

// GET /api/users
export async function getUsers(req, res) {
  try {
    const users = await UserModel.find().lean();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
}

// POST /api/users
export async function createUser(req, res) {
  try {
    const data = req.body;

    // Basic safety check: id + email must be unique
    const existing = await UserModel.findOne({
      $or: [{ id: data.id }, { email: data.email }]
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "User with same ID or email already exists" });
    }

    const user = new UserModel(data);
    const saved = await user.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Failed to create user" });
  }
}

// PUT /api/users/:id  (id = college/system ID, e.g. student1)
export async function updateUser(req, res) {
  try {
    const { id } = req.params;

    const updated = await UserModel.findOneAndUpdate(
      { id },          // IMPORTANT: use business ID, not _id
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Failed to update user" });
  }
}
