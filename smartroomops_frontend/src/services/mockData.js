//
// PUBLIC_INTERFACE
// Mock data and lightweight fake API used when backend is unavailable.
// Provides sample rooms, tasks, notifications, analytics, and forecast,
// plus simple mutation helpers and an event emitter for realtime-like updates.
//

// Simple event emitter for realtime updates
class Emitter {
  constructor() { this.listeners = {}; }
  on(event, cb) {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event].push(cb);
    return () => this.off(event, cb);
  }
  off(event, cb) {
    this.listeners[event] = (this.listeners[event] || []).filter(fn => fn !== cb);
  }
  emit(event, payload) {
    (this.listeners[event] || []).forEach(fn => fn(payload));
  }
}

export const mockEmitter = new Emitter();

// Seed random but consistent sample data
function randChoice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function id() { return Math.random().toString(36).slice(2, 10); }

const ROOM_TYPES = ["Standard", "Deluxe", "Suite", "Family"];
const STATUS = ["Clean", "Dirty", "In Progress"];
const NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Davis", "Miller", "Wilson"];

function generateRooms(n = 36) {
  const rooms = [];
  for (let i = 1; i <= n; i++) {
    const number = (100 + i).toString();
    const status = randChoice(STATUS);
    const occupied = Math.random() > 0.4;
    const guest = occupied ? `${randChoice(["Mr.", "Ms.", "Dr."])} ${randChoice(NAMES)}` : null;
    rooms.push({
      id: i,
      number,
      type: randChoice(ROOM_TYPES),
      floor: Math.ceil(i / 8),
      status,
      guest_name: guest,
      priority: status === "Dirty" && Math.random() > 0.7
    });
  }
  return rooms;
}

export let mockRooms = generateRooms();

function generateTasksForRoom(roomId) {
  const base = [
    { title: "Change linens", description: "Replace sheets, pillowcases, and duvet cover." },
    { title: "Sanitize bathroom", description: "Clean sink, shower, toilet; restock towels." },
    { title: "Dust and vacuum", description: "Dust surfaces and vacuum floors and carpet." },
    { title: "Restock minibar", description: "Check drinks and snacks; restock as needed." },
  ];
  return base.map((b, idx) => ({
    id: `${roomId}-${idx + 1}`,
    room_id: roomId,
    title: b.title,
    description: b.description,
    completed: Math.random() > 0.5 ? true : false,
    photos: [],
    verified: null,
    supervisor_comment: ""
  }));
}

export let mockRoomTasks = Object.fromEntries(
  mockRooms.map(r => [String(r.id), generateTasksForRoom(r.id)])
);

export let mockNotifications = [
  {
    id: id(),
    message: "Room 204 guest requested extra towels",
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    read: false
  },
  {
    id: id(),
    message: "Priority clean required for Room 312",
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    read: false
  },
  {
    id: id(),
    message: "Maintenance scheduled on Floor 5 at 3 PM",
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    read: true
  }
];

export const mockAssignedTasks = [
  { id: id(), title: "Replace toiletries", room_number: "217", due_at: new Date(Date.now() + 1000 * 60 * 60).toISOString() },
  { id: id(), title: "Deep clean balcony", room_number: "305", due_at: new Date(Date.now() + 1000 * 60 * 120).toISOString() }
];

export const mockSupervisorQueue = [
  { id: id(), room_number: "411", task_title: "Sanitize bathroom", created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString() },
  { id: id(), room_number: "118", task_title: "Change linens", created_at: new Date(Date.now() - 1000 * 60 * 50).toISOString() }
];

export function generateEfficiency() {
  const days = 10;
  const out = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 3600 * 1000);
    out.push({
      date: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      efficiency: Math.round(60 + Math.random() * 40)
    });
  }
  return out;
}

export function generateCompletion() {
  const clean = mockRooms.filter(r => r.status === "Clean").length;
  const dirty = mockRooms.filter(r => r.status === "Dirty").length;
  const inprog = mockRooms.filter(r => r.status === "In Progress").length;
  return [
    { name: "Clean", value: clean },
    { name: "In Progress", value: inprog },
    { name: "Dirty", value: dirty }
  ];
}

export function generateQuality() {
  // Placeholder structure to match prop but not used by current charts directly
  return [
    { metric: "Audit Score", value: Math.round(85 + Math.random() * 10) },
  ];
}

export const mockForecast = {
  expected_vacancies: Math.round(mockRooms.length * 0.35),
  staff_needed: Math.round(8 + Math.random() * 5),
  notes: "Peak arrivals expected 4-6 PM; prioritize floors 2 and 3."
};

// Mutations and helpers

// PUBLIC_INTERFACE
export function mockGetRooms() {
  return Promise.resolve([...mockRooms]);
}

// PUBLIC_INTERFACE
export function mockGetRoom(idStr) {
  const r = mockRooms.find(r => String(r.id) === String(idStr));
  return Promise.resolve(r ? { ...r } : null);
}

// PUBLIC_INTERFACE
export function mockSetRoomStatus(idStr, status) {
  const idx = mockRooms.findIndex(r => String(r.id) === String(idStr));
  if (idx >= 0) {
    mockRooms[idx] = { ...mockRooms[idx], status };
    mockEmitter.emit("room_update", { room: { ...mockRooms[idx] } });
    return Promise.resolve({ ok: true });
  }
  return Promise.reject(new Error("Room not found"));
}

// PUBLIC_INTERFACE
export function mockGetRoomTasks(idStr) {
  return Promise.resolve([...(mockRoomTasks[idStr] || [])]);
}

// PUBLIC_INTERFACE
export function mockUpdateTaskCompletion(roomId, taskId, completed) {
  const list = mockRoomTasks[roomId] || [];
  const idx = list.findIndex(t => t.id === taskId);
  if (idx >= 0) {
    list[idx] = { ...list[idx], completed };
    mockRoomTasks[roomId] = list;
    return Promise.resolve({ ...list[idx] });
  }
  return Promise.reject(new Error("Task not found"));
}

// PUBLIC_INTERFACE
export function mockUploadTaskPhoto(roomId, taskId, fileInfo) {
  const list = mockRoomTasks[roomId] || [];
  const idx = list.findIndex(t => t.id === taskId);
  if (idx >= 0) {
    const photo = { id: id(), name: fileInfo?.name || "photo.jpg", url: "#", uploaded_at: new Date().toISOString() };
    list[idx] = { ...list[idx], photos: [...(list[idx].photos || []), photo] };
    mockRoomTasks[roomId] = list;
    return Promise.resolve(photo);
  }
  return Promise.reject(new Error("Task not found"));
}

// PUBLIC_INTERFACE
export function mockVerifyTask(taskId, action, comment) {
  for (const [roomId, list] of Object.entries(mockRoomTasks)) {
    const idx = list.findIndex(t => t.id === taskId);
    if (idx >= 0) {
      list[idx] = { ...list[idx], verified: action === "approve" ? "approved" : "rejected", supervisor_comment: comment || "" };
      mockRoomTasks[roomId] = list;
      return Promise.resolve({ ...list[idx] });
    }
  }
  return Promise.reject(new Error("Task not found"));
}

// PUBLIC_INTERFACE
export function mockGetNotifications() {
  return Promise.resolve([...mockNotifications]);
}

// PUBLIC_INTERFACE
export function mockMarkNotificationRead(idToMark) {
  mockNotifications = mockNotifications.map(n => n.id === idToMark ? { ...n, read: true } : n);
  return Promise.resolve({ ok: true });
}

// PUBLIC_INTERFACE
export function mockGetAssignedTasks() {
  return Promise.resolve([...mockAssignedTasks]);
}

// PUBLIC_INTERFACE
export function mockGetSupervisorQueue() {
  return Promise.resolve([...mockSupervisorQueue]);
}

// PUBLIC_INTERFACE
export function mockGetAnalyticsEfficiency() {
  return Promise.resolve(generateEfficiency());
}

// PUBLIC_INTERFACE
export function mockGetAnalyticsCompletion() {
  return Promise.resolve(generateCompletion());
}

// PUBLIC_INTERFACE
export function mockGetAnalyticsQuality() {
  return Promise.resolve(generateQuality());
}

// PUBLIC_INTERFACE
export function mockGetForecast() {
  return Promise.resolve({ ...mockForecast });
}

// Simulate realtime changes every 8 seconds: randomly change a room status.
let intervalId = null;
export function startMockRealtime() {
  if (intervalId) return;
  intervalId = setInterval(() => {
    if (mockRooms.length === 0) return;
    const idx = Math.floor(Math.random() * mockRooms.length);
    const curr = mockRooms[idx];
    const nextStatus = randChoice(STATUS);
    mockRooms[idx] = { ...curr, status: nextStatus };
    mockEmitter.emit("room_update", { room: { ...mockRooms[idx] } });
  }, 8000);
}
export function stopMockRealtime() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
