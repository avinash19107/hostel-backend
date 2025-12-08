// backend/seed.js
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./db.js";
import { HOSTELS } from "./data.js";

import { UserModel } from "./models/User.js";
import { RoomModel } from "./models/Room.js";
import { BookingRequestModel } from "./models/BookingRequest.js";
import { ComplaintModel } from "./models/Complaint.js";
import { GatePassModel } from "./models/GatePass.js";
import { BroadcastModel } from "./models/Broadcast.js";
import { AttendanceModel } from "./models/Attendance.js";

function makeRoomId(hostelId, floor, roomNo) {
  // e.g. krishna-101, vaigai-205
  const roomNumber = floor * 100 + roomNo;
  return `${hostelId}-${roomNumber}`;
}

function pickRoomType(index) {
  const mod = index % 3;
  if (mod === 0) return { type: "2-in-1 (Double)", capacity: 2, price: 75000 };
  if (mod === 1) return { type: "3-in-1 (Triple)", capacity: 3, price: 70000 };
  return { type: "4-in-1 (Quad)", capacity: 4, price: 60000 };
}

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

async function seed() {
  await connectDB();

  console.log("🧹 Clearing old data...");
  await Promise.all([
    UserModel.deleteMany({}),
    RoomModel.deleteMany({}),
    BookingRequestModel.deleteMany({}),
    ComplaintModel.deleteMany({}),
    GatePassModel.deleteMany({}),
    BroadcastModel.deleteMany({}),
    AttendanceModel.deleteMany({})
  ]);

  console.log("👤 Seeding users...");

  const users = [];

  // Admin
  users.push({
    id: "admin1",
    name: "Hostel Admin",
    email: "admin@hostel.com",
    role: "ADMIN",
    gender: "Male",
    assignedRoomId: null,
    assignedBedId: null,
    avatarUrl: "https://picsum.photos/200/200",
    tags: ["Warden", "Admin"]
  });

  // Some sample male & female students
  const maleNames = [
    "Sanjay Ram Chowdary",
    "Arjun Kumar",
    "Rahul Verma",
    "Vikram Singh",
    "Karthik Iyer",
    "Rohan Mehta",
    "Ankit Sharma",
    "Manish Gupta"
  ];

  const femaleNames = [
    "Priya Sharma",
    "Ananya Rao",
    "Sneha Nair",
    "Kavya Reddy",
    "Ishita Patel",
    "Ritu Singh",
    "Meera Menon",
    "Divya Kapoor"
  ];

  let studentIndex = 1;

  maleNames.forEach((name, idx) => {
    users.push({
      id: `mstudent${idx + 1}`,
      name,
      email: `mstudent${idx + 1}@student.com`,
      role: "STUDENT",
      gender: "Male",
      assignedRoomId: null,
      assignedBedId: null,
      avatarUrl: `https://picsum.photos/20${idx}/200`,
      tags: ["Gamer", "Night Owl"].slice(0, (idx % 2) + 1)
    });
    studentIndex++;
  });

  femaleNames.forEach((name, idx) => {
    users.push({
      id: `fstudent${idx + 1}`,
      name,
      email: `fstudent${idx + 1}@student.com`,
      role: "STUDENT",
      gender: "Female",
      assignedRoomId: null,
      assignedBedId: null,
      avatarUrl: `https://picsum.photos/21${idx}/200`,
      tags: ["Reader", "Studious"].slice(0, (idx % 2) + 1)
    });
    studentIndex++;
  });

  await UserModel.insertMany(users);
  const savedUsers = await UserModel.find().lean();
  const maleStudents = savedUsers.filter(u => u.role === "STUDENT" && u.gender === "Male");
  const femaleStudents = savedUsers.filter(u => u.role === "STUDENT" && u.gender === "Female");

  console.log("🏠 Seeding rooms for all hostels...");

  const roomsToInsert = [];
  const userAssignments = {}; // userId -> { roomId, bedId }

  HOSTELS.forEach((hostel, hIndex) => {
    const floors = hostel.floors || 5;
    const roomsPerFloor = 10;

    for (let floor = 1; floor <= floors; floor++) {
      for (let roomNo = 1; roomNo <= roomsPerFloor; roomNo++) {
        const globalIndex = hIndex * floors * roomsPerFloor + (floor - 1) * roomsPerFloor + (roomNo - 1);
        const { type, capacity, price } = pickRoomType(globalIndex);
        const roomId = makeRoomId(hostel.id, floor, roomNo);

        // Decide occupancy style (D: mix)
        // 0-4: empty, 5-7: partially filled, 8: full, 9: maintenance
        const pattern = globalIndex % 10;

        // build beds
        const beds = [];
        let occupants = [];
        let status = "Available";

        for (let b = 1; b <= capacity; b++) {
          const bedId = `${roomId}-${b}`;
          let bedStatus = "Available";
          let occupantId = null;

          // choose candidate pool based on hostel type
          const pool = hostel.type === "Girls" ? femaleStudents : hostel.type === "Boys" ? maleStudents : savedUsers;

          const shouldOccupy =
            (pattern >= 5 && pattern <= 7 && b <= Math.max(1, Math.floor(capacity / 2))) || // partly filled
            (pattern === 8); // full

          const isMaintenance = pattern === 9;

          if (isMaintenance) {
            bedStatus = "Maintenance";
            status = "Maintenance";
          } else if (shouldOccupy && pool.length > 0) {
            const chosen = randomFrom(pool);
            if (chosen) {
              bedStatus = "Occupied";
              occupantId = chosen.id;
              occupants.push(chosen.id);

              // remember for assigning back to user
              userAssignments[chosen.id] = {
                roomId: roomId,
                bedId: bedId
              };
            }
          }

          beds.push({
            id: bedId,
            number: b,
            status: bedStatus,
            occupantId
          });
        }

        // if no special pattern set maintenance, set status based on occupancy
        if (status !== "Maintenance") {
          if (occupants.length === 0) status = "Available";
          else if (occupants.length === capacity) status = "Occupied";
          else status = "Available";
        }

        roomsToInsert.push({
          id: roomId,
          hostelId: hostel.id,
          number: String(floor * 100 + roomNo),
          floor,
          type,
          price,
          status,
          capacity,
          occupants,
          beds,
          features: ["Wi-Fi", "Study Desk"],
          maintenanceLog: [],
          assets: []
        });
      }
    }
  });

  await RoomModel.insertMany(roomsToInsert);

  console.log("🔁 Updating users with assigned rooms/beds...");

  const bulkOps = [];
  Object.entries(userAssignments).forEach(([userId, assign]) => {
    bulkOps.push({
      updateOne: {
        filter: { id: userId },
        update: {
          $set: {
            assignedRoomId: assign.roomId,
            assignedBedId: assign.bedId
          }
        }
      }
    });
  });

  if (bulkOps.length > 0) {
    await UserModel.bulkWrite(bulkOps);
  }

  console.log("✅ Seeding complete!");
  process.exit(0);
}

seed().catch(err => {
  console.error("❌ Seeding error:", err);
  process.exit(1);
});
