// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./db.js";

import { HOSTELS } from "./data.js"; // only hostels stay static

import { UserModel } from "./models/User.js";
import { RoomModel } from "./models/Room.js";
import { BookingRequestModel } from "./models/BookingRequest.js";
import { ComplaintModel } from "./models/Complaint.js";
import { GatePassModel } from "./models/GatePass.js";
import { BroadcastModel } from "./models/Broadcast.js";
import { AttendanceModel } from "./models/Attendance.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Hostel backend API is running with MongoDB");
});

// ---------- HOSTELS ----------
app.get("/api/hostels", (req, res) => {
  res.json(HOSTELS);
});

// Helper: gender vs hostel type (HOSTELS still from data.js)
function isGenderAllowedInHostel(user, hostel) {
  if (!user || !hostel) return false;
  if (hostel.type === "Girls" && user.gender === "Male") return false;
  if (hostel.type === "Boys" && user.gender === "Female") return false;
  return true;
}

// ---------- ROOMS ----------
app.get("/api/rooms", async (req, res) => {
  try {
    const { hostelId, floor } = req.query;
    const filter = {};
    if (hostelId) filter.hostelId = hostelId;
    if (floor) filter.floor = Number(floor);

    const rooms = await RoomModel.find(filter).lean();
    res.json(rooms);
  } catch (err) {
    console.error("Error fetching rooms:", err);
    res.status(500).json({ message: "Error fetching rooms" });
  }
});

// ---------- USERS ----------
app.get("/api/users", async (req, res) => {
  try {
    const { role } = req.query;
    const filter = {};
    if (role) filter.role = role;
    const users = await UserModel.find(filter).lean();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// ---------- LOGIN ----------
app.post("/api/login", async (req, res) => {
  try {
    const { email } = req.body;
    const identifier = (email || "").trim().toLowerCase();
    if (!identifier) {
      return res.status(400).json({ message: "Email or ID is required" });
    }

    const user = await UserModel.findOne({
      $or: [
        { email: identifier },
        { id: identifier }
      ]
    }).lean();

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ---------- BOOKING REQUESTS ----------
app.get("/api/booking-requests", async (req, res) => {
  try {
    const list = await BookingRequestModel.find().lean();
    res.json(list);
  } catch (err) {
    console.error("Error fetching booking requests:", err);
    res.status(500).json({ message: "Error fetching booking requests" });
  }
});

app.post("/api/booking-requests", async (req, res) => {
  try {
    const { roomId, bedId, studentId, studentName } = req.body;
    if (!roomId || !bedId || !studentId || !studentName) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const room = await RoomModel.findOne({ id: roomId }).lean();
    const user = await UserModel.findOne({ id: studentId }).lean();

    if (!room || !user) {
      return res.status(400).json({ message: "Invalid room or user" });
    }

    const hostel = HOSTELS.find((h) => h.id === room.hostelId);
    if (!isGenderAllowedInHostel(user, hostel)) {
      return res
        .status(400)
        .json({ message: "This student's gender is not allowed in this hostel." });
    }

    const newReq = await BookingRequestModel.create({
      id: String(Date.now()),
      roomId,
      bedId,
      studentId,
      studentName,
      timestamp: Date.now()
    });

    res.status(201).json(newReq);
  } catch (err) {
    console.error("Error creating booking request:", err);
    res.status(500).json({ message: "Error creating booking request" });
  }
});

// ---------- COMPLAINTS ----------
app.get("/api/complaints", async (req, res) => {
  try {
    const list = await ComplaintModel.find().lean();
    res.json(list);
  } catch (err) {
    console.error("Error fetching complaints:", err);
    res.status(500).json({ message: "Error fetching complaints" });
  }
});

app.post("/api/complaints", async (req, res) => {
  try {
    const { studentId, studentName, type, description } = req.body;
    if (!studentId || !studentName || !type || !description) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const newComplaint = await ComplaintModel.create({
      id: `cmp_${Date.now()}`,
      studentId,
      studentName,
      type,
      description,
      status: "Pending",
      timestamp: Date.now()
    });

    res.status(201).json(newComplaint);
  } catch (err) {
    console.error("Error creating complaint:", err);
    res.status(500).json({ message: "Error creating complaint" });
  }
});

app.put("/api/complaints/:id/resolve", async (req, res) => {
  try {
    const complaint = await ComplaintModel.findOneAndUpdate(
      { id: req.params.id },
      { status: "Resolved" },
      { new: true }
    ).lean();

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(complaint);
  } catch (err) {
    console.error("Error resolving complaint:", err);
    res.status(500).json({ message: "Error resolving complaint" });
  }
});

// ---------- GATE PASS ----------
app.get("/api/gatepass", async (req, res) => {
  try {
    const list = await GatePassModel.find().lean();
    res.json(list);
  } catch (err) {
    console.error("Error fetching gatepass:", err);
    res.status(500).json({ message: "Error fetching gatepass" });
  }
});

app.post("/api/gatepass", async (req, res) => {
  try {
    const { studentId, studentName, departureDate, returnDate, reason } = req.body;
    if (!studentId || !studentName || !departureDate || !returnDate || !reason) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const newReq = await GatePassModel.create({
      id: `gp_${Date.now()}`,
      studentId,
      studentName,
      departureDate,
      returnDate,
      reason,
      status: "Pending",
      timestamp: Date.now()
    });

    res.status(201).json(newReq);
  } catch (err) {
    console.error("Error creating gatepass:", err);
    res.status(500).json({ message: "Error creating gatepass" });
  }
});

app.post("/api/gatepass/:id/approve", async (req, res) => {
  try {
    const reqItem = await GatePassModel.findOneAndUpdate(
      { id: req.params.id },
      { status: "Approved" },
      { new: true }
    ).lean();

    if (!reqItem) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json(reqItem);
  } catch (err) {
    console.error("Error approving gatepass:", err);
    res.status(500).json({ message: "Error approving gatepass" });
  }
});

app.post("/api/gatepass/:id/reject", async (req, res) => {
  try {
    const reqItem = await GatePassModel.findOneAndUpdate(
      { id: req.params.id },
      { status: "Rejected" },
      { new: true }
    ).lean();

    if (!reqItem) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json(reqItem);
  } catch (err) {
    console.error("Error rejecting gatepass:", err);
    res.status(500).json({ message: "Error rejecting gatepass" });
  }
});

// ---------- BROADCASTS ----------
app.get("/api/broadcasts", async (req, res) => {
  try {
    const list = await BroadcastModel.find().sort({ timestamp: -1 }).lean();
    res.json(list);
  } catch (err) {
    console.error("Error fetching broadcasts:", err);
    res.status(500).json({ message: "Error fetching broadcasts" });
  }
});

app.post("/api/broadcasts", async (req, res) => {
  try {
    const { message, priority, sender } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const newBroadcast = await BroadcastModel.create({
      id: `broadcast_${Date.now()}`,
      message,
      priority: priority || "Normal",
      sender: sender || "Admin",
      timestamp: Date.now()
    });

    res.status(201).json(newBroadcast);
  } catch (err) {
    console.error("Error creating broadcast:", err);
    res.status(500).json({ message: "Error creating broadcast" });
  }
});

// ---------- ATTENDANCE ----------
app.get("/api/attendance", async (req, res) => {
  try {
    const list = await AttendanceModel.find().lean();
    res.json(list);
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ message: "Error fetching attendance" });
  }
});

app.post("/api/attendance", async (req, res) => {
  try {
    const { date, hostelId, records } = req.body;
    if (!date || !hostelId || !Array.isArray(records)) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const newRecord = await AttendanceModel.create({
      date,
      hostelId,
      records
    });

    res.status(201).json(newRecord);
  } catch (err) {
    console.error("Error creating attendance record:", err);
    res.status(500).json({ message: "Error creating attendance record" });
  }
});

// ---------- START SERVER ----------
const PORT = process.env.PORT || 5000;

await connectDB();

app.listen(PORT, () => {
  console.log(`Backend API running on port ${PORT}`);
});
