// backend/routes/bookingRoutes.js
import express from "express";
import {
  getBookingRequests,
  createBookingRequest,
  deleteBookingRequest,
} from "../controllers/bookingController.js";

const router = express.Router();

router.get("/", getBookingRequests);
router.post("/", createBookingRequest);
router.delete("/:id", deleteBookingRequest); // id = "req_..."

export default router;
