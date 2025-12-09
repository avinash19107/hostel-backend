// backend/routes/roomRoutes.js
import express from "express";
import {
  getRooms,
  updateRoom,
} from "../controllers/roomController.js";

const router = express.Router();

router.get("/", getRooms);
router.put("/:id", updateRoom); // id = room.id, e.g. "H1-101"

export default router;
