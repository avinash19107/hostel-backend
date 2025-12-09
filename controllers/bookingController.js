// backend/controllers/bookingController.js
import { BookingRequestModel } from "../models/BookingRequest.js";

// GET /api/booking-requests
export async function getBookingRequests(req, res) {
  try {
    const requests = await BookingRequestModel.find().lean();
    res.json(requests);
  } catch (err) {
    console.error("Error fetching booking requests:", err);
    res.status(500).json({ message: "Failed to fetch booking requests" });
  }
}

// POST /api/booking-requests
export async function createBookingRequest(req, res) {
  try {
    const data = req.body;
    const request = new BookingRequestModel(data);
    const saved = await request.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error creating booking request:", err);
    res.status(500).json({ message: "Failed to create booking request" });
  }
}

// DELETE /api/booking-requests/:id  (id = "req_123...")
export async function deleteBookingRequest(req, res) {
  try {
    const { id } = req.params;
    const deleted = await BookingRequestModel.findOneAndDelete({ id });

    if (!deleted) {
      return res.status(404).json({ message: "Booking request not found" });
    }

    res.json({ message: "Booking request deleted" });
  } catch (err) {
    console.error("Error deleting booking request:", err);
    res.status(500).json({ message: "Failed to delete booking request" });
  }
}
