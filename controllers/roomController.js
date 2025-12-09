// backend/controllers/roomController.js
import { RoomModel } from "../models/Room.js";

// GET /api/rooms
export async function getRooms(req, res) {
  try {
    const rooms = await RoomModel.find().lean();
    res.json(rooms);
  } catch (err) {
    console.error("Error fetching rooms:", err);
    res.status(500).json({ message: "Failed to fetch rooms" });
  }
}

// PUT /api/rooms/:id  (id = room.id like "H1-101")
export async function updateRoom(req, res) {
  try {
    const { id } = req.params;

    const updated = await RoomModel.findOneAndUpdate(
      { id },          // IMPORTANT: use room.id, not _id
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Error updating room:", err);
    res.status(500).json({ message: "Failed to update room" });
  }
}
