// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./db.js";

import { HOSTELS } from "./data.js";

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

// ---------- HEALTH CHECK ----------
app.get("/", (req, res) => {
  res.send("Hostel backend API running with MongoDB");
});

// ---------- HOSTELS ----------
app.get("/api/hostels", (req, res) => {
  res.json(HOSTELS);
});

// --------- HELPER ----------
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

// UPDATE ROOM (Needed for approve/reject booking)
app.put("/api/rooms/:id", async (req, res) => {
  try {
    const updatedRoom = await RoomModel.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    ).lean();

    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(updatedRoom);
  } catch (err) {
    console.error("Error updating room:", err);
    res.status(500).json({ message: "Error updating room" });
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

// CREATE USER
app.post("/api/users", async (req, res) => {
  try {
    const data = req.body;

    if (!data.id || !data.name || !data.email || !data.role) {
      return res.status(400).json({ message: "id, name, email, role required" });
    }

    const exists = await UserModel.findOne({
      $or: [{ id: data.id }, { email: data.email }],
    });

    if (exists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = await UserModel.create({
      ...data,
      email: data.email.toLowerCase(),
    });

    res.status(201).json(newUser);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Error creating user" });
  }
});

// UPDATE USER (Needed for approving booking)
app.put("/api/users/:id", async (req, res) => {
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    ).lean();

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Error updating user" });
  }
});

// ---------- LOGIN ----------
app.post("/api/login", async (req, res) => {
  try {
    const identifier = (req.body.email || "").trim().toLowerCase();

    const user = await UserModel.findOne({
      $or: [{ email: identifier }, { id: identifier }],
    }).lean();

    if (!user) return res.status(401).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal error" });
  }
});

// ---------- BOOKING REQUESTS ----------
app.get("/api/booking-requests", async (req, res) => {
  try {
    const list = await BookingRequestModel.find().lean();
    res.json(list);
  } catch (err) {
    console.error("Error fetching:", err);
    res.status(500).json({ message: "Error fetching booking requests" });
  }
});

app.post("/api/booking-requests", async (req, res) => {
  try {
    const { roomId, bedId, studentId, studentName } = req.body;

    const room = await RoomModel.findOne({ id: roomId }).lean();
    const user = await UserModel.findOne({ id: studentId }).lean();

    if (!room || !user) {
      return res.status(400).json({ message: "Invalid user or room" });
    }

    const hostel = HOSTELS.find((h) => h.id === room.hostelId);
    if (!isGenderAllowedInHostel(user, hostel)) {
      return res.status(400).json({ message: "Gender not allowed" });
    }

    const created = await BookingRequestModel.create({
      id: `req_${Date.now()}`,
      roomId,
      bedId,
      studentId,
      studentName,
      timestamp: Date.now(),
    });

    res.status(201).json(created);
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ message: "Error creating booking" });
  }
});

// DELETE BOOKING REQUEST
app.delete("/api/booking-requests/:id", async (req, res) => {
  try {
    const result = await BookingRequestModel.findOneAndDelete({
      id: req.params.id,
    });

    if (!result) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json({ message: "Request deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Error deleting request" });
  }
});

// ---------- COMPLAINTS ----------
app.get("/api/complaints", async (req, res) => {
  try {
    res.json(await ComplaintModel.find().lean());
  } catch {
    res.status(500).json({ message: "Error fetching complaints" });
  }
});

app.post("/api/complaints", async (req, res) => {
  try {
    const newComplaint = await ComplaintModel.create({
      id: `cmp_${Date.now()}`,
      ...req.body,
      status: "Pending",
      timestamp: Date.now(),
    });

    res.status(201).json(newComplaint);
  } catch {
    res.status(500).json({ message: "Error creating complaint" });
  }
});

// ---------- GATE PASS ----------
app.get("/api/gatepass", async (req, res) =>
  res.json(await GatePassModel.find().lean())
);

app.post("/api/gatepass", async (req, res) => {
  try {
    const reqItem = await GatePassModel.create({
      id: `gp_${Date.now()}`,
      ...req.body,
      status: "Pending",
      timestamp: Date.now(),
    });

    res.status(201).json(reqItem);
  } catch {
    res.status(500).json({ message: "Error creating gatepass" });
  }
});

app.post("/api/gatepass/:id/approve", async (req, res) => {
  const updated = await GatePassModel.findOneAndUpdate(
    { id: req.params.id },
    { status: "Approved" },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Not found" });
  res.json(updated);
});

// ---------- BROADCAST ----------
app.get("/api/broadcasts", async (req, res) =>
  res.json(await BroadcastModel.find().sort({ timestamp: -1 }).lean())
);

app.post("/api/broadcasts", async (req, res) => {
  const saved = await BroadcastModel.create({
    id: `broadcast_${Date.now()}`,
    timestamp: Date.now(),
    ...req.body,
  });
  res.status(201).json(saved);
});

// ---------- ATTENDANCE ----------
app.get("/api/attendance", async (req, res) =>
  res.json(await AttendanceModel.find().lean())
);

app.post("/api/attendance", async (req, res) => {
  const newRecord = await AttendanceModel.create(req.body);
  res.status(201).json(newRecord);
});

// ---------- SEED DEFAULT ADMIN ----------
async function ensureDefaultAdmin() {
  const admin = await UserModel.findOne({ role: "ADMIN" });
  if (!admin) {
    await UserModel.create({
      id: "admin",
      name: "Hostel Admin",
      email: "admin@hostel.com",
      role: "ADMIN",
    });
    console.log("Default admin created");
  }
}

await connectDB();
await ensureDefaultAdmin();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
