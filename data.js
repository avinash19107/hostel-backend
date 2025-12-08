// backend/data.js

// ---------- HOSTELS ----------
// IDs must match frontend HOSTELS ids.
export const HOSTELS = [
  {
    id: "krishna",
    name: "Krishna Hostel",
    type: "Boys",
    description: "Standard Boys Hostel",
    gridCols: 10,
    floors: 5
  },
  {
    id: "vaigai",
    name: "Vaigai Hostel",
    type: "Girls",
    description: "Premium Girls Hostel",
    gridCols: 10,
    floors: 5
  },
  {
    id: "bhargav",
    name: "Bhargav Hostel",
    type: "Boys",
    description: "Post-Graduate Boys Block",
    gridCols: 10,
    floors: 5
  },
  {
    id: "sanjay",
    name: "Sanjay Hostel",
    type: "Boys",
    description: "International Students Block",
    gridCols: 10,
    floors: 5
  },
  {
    id: "noyal",
    name: "Noyal Hostel",
    type: "Girls",
    description: "Freshers Girls Block",
    gridCols: 10,
    floors: 5
  }
];

// ---------- HELPERS ----------

// Decide room type & capacity based on index (1..10)
function getRoomTypeAndCapacity(index) {
  if (index % 3 === 1) {
    return { type: "2-in-1 (Double)", capacity: 2 };
  } else if (index % 3 === 2) {
    return { type: "3-in-1 (Triple)", capacity: 3 };
  } else {
    return { type: "4-in-1 (Quad)", capacity: 4 };
  }
}

// Create rooms for one hostel: 5 floors × 10 rooms
function createRoomsForHostel(hostelId, basePrice) {
  const rooms = [];

  for (let floor = 1; floor <= 5; floor++) {
    for (let i = 1; i <= 10; i++) {
      const roomNumber = floor * 100 + i; // 101..110, 201..210, ...
      const roomId = `${hostelId}-${roomNumber}`;
      const { type, capacity } = getRoomTypeAndCapacity(i);

      const beds = [];
      for (let bedNum = 1; bedNum <= capacity; bedNum++) {
        beds.push({
          id: `${roomId}-${bedNum}`,
          number: bedNum,
          status: "Available",
          occupantId: null
        });
      }

      rooms.push({
        id: roomId,
        hostelId,
        number: String(roomNumber),
        floor,
        type,
        price: basePrice,
        status: "Available",
        capacity,
        occupants: [],
        beds,
        features: ["Wi-Fi", "Study Desk", "Ceiling Fan"],
        maintenanceLog: [],
        assets: []
      });
    }
  }

  return rooms;
}

const BASE_PRICE = 70000;

// ---------- ROOMS: initially all available ----------
export const ROOMS = HOSTELS.flatMap((hostel) =>
  createRoomsForHostel(hostel.id, BASE_PRICE)
);

// Helper to mark a bed occupied
function setBedOccupied(roomId, bedNumber, userId) {
  const room = ROOMS.find((r) => r.id === roomId);
  if (!room) return;
  const bed = room.beds.find((b) => b.number === bedNumber);
  if (!bed) return;

  bed.status = "Occupied";
  bed.occupantId = userId;

  if (!room.occupants.includes(userId)) {
    room.occupants.push(userId);
  }

  const allBlocked = room.beds.every(
    (b) => b.status === "Occupied" || b.status === "Maintenance"
  );
  room.status = allBlocked ? "Occupied" : "Available";
}

// Helper to mark whole room maintenance
function setRoomMaintenance(roomId) {
  const room = ROOMS.find((r) => r.id === roomId);
  if (!room) return;
  room.status = "Maintenance";
  room.beds = room.beds.map((b) => ({
    ...b,
    status: "Maintenance"
  }));
}

// ---------- USERS ----------
export const USERS = [
  {
    id: "admin1",
    name: "Hostel Admin",
    email: "admin@hostel.com",
    role: "ADMIN",
    gender: "Male",
    avatarUrl: "https://picsum.photos/200/200",
    tags: []
  },

  // Boys hostels (Krishna / Bhargav / Sanjay)
  {
    id: "student1",
    name: "Sanjay Ram Chowdary",
    email: "sanjay@student.com",
    role: "STUDENT",
    gender: "Male",
    assignedRoomId: "krishna-101",
    assignedBedId: "krishna-101-1",
    avatarUrl: "https://picsum.photos/201/201",
    tags: ["Gamer", "Night Owl"]
  },
  {
    id: "student3",
    name: "Arjun Mehta",
    email: "arjun@student.com",
    role: "STUDENT",
    gender: "Male",
    assignedRoomId: "bhargav-101",
    assignedBedId: "bhargav-101-1",
    avatarUrl: "https://picsum.photos/203/203",
    tags: ["Cricket", "Hostel Rep"]
  },
  {
    id: "student4",
    name: "Rahul Verma",
    email: "rahul@student.com",
    role: "STUDENT",
    gender: "Male",
    assignedRoomId: "sanjay-101",
    assignedBedId: "sanjay-101-1",
    avatarUrl: "https://picsum.photos/204/204",
    tags: ["International Student"]
  },

  // Girls hostels (Vaigai / Noyal)
  {
    id: "student2",
    name: "Priya Sharma",
    email: "priya@student.com",
    role: "STUDENT",
    gender: "Female",
    assignedRoomId: "vaigai-101",
    assignedBedId: "vaigai-101-1",
    avatarUrl: "https://picsum.photos/202/202",
    tags: ["Reader", "Studious"]
  },
  {
    id: "student5",
    name: "Anita Rao",
    email: "anita@student.com",
    role: "STUDENT",
    gender: "Female",
    assignedRoomId: "noyal-101",
    assignedBedId: "noyal-101-1",
    avatarUrl: "https://picsum.photos/205/205",
    tags: ["First Year", "Class Topper"]
  }
];

// ---------- APPLY INITIAL OCCUPANCY & MAINTENANCE ----------

// Occupied beds (some rooms partly filled)
[
  { roomId: "krishna-101", bedNumber: 1, userId: "student1" },
  { roomId: "bhargav-101", bedNumber: 1, userId: "student3" },
  { roomId: "sanjay-101", bedNumber: 1, userId: "student4" },
  { roomId: "vaigai-101", bedNumber: 1, userId: "student2" },
  { roomId: "noyal-101", bedNumber: 1, userId: "student5" },

  // partly filled examples
  { roomId: "krishna-102", bedNumber: 1, userId: "student1" },
  { roomId: "vaigai-102", bedNumber: 1, userId: "student2" }
].forEach(({ roomId, bedNumber, userId }) =>
  setBedOccupied(roomId, bedNumber, userId)
);

// Some rooms under maintenance
[
  "krishna-103",
  "vaigai-202",
  "bhargav-204",
  "sanjay-301",
  "noyal-105"
].forEach((roomId) => setRoomMaintenance(roomId));

// ---------- IN-MEMORY COLLECTIONS ----------
export const bookingRequests = [];
export const complaints = [];
export const gatePassRequests = [];
export const attendanceRecords = [];
export const broadcastMessages = [];
