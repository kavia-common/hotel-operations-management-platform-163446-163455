import {
  mockGetRooms,
  mockGetRoom,
  mockSetRoomStatus,
  mockGetRoomTasks,
  mockUpdateTaskCompletion,
  mockUploadTaskPhoto,
  mockVerifyTask,
  mockGetNotifications,
  mockMarkNotificationRead,
  mockGetAssignedTasks,
  mockGetSupervisorQueue,
  mockGetAnalyticsEfficiency,
  mockGetAnalyticsCompletion,
  mockGetAnalyticsQuality,
  mockGetForecast,
} from "./mockData";

/**
 * PUBLIC_INTERFACE
 * mockApiFetch provides a drop-in replacement for apiFetch using in-memory mocks.
 * Supports the subset of endpoints used by the app.
 * Returns Promises to mimic network behavior.
 */
export async function mockApiFetch(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const parseBody = () => {
    try { return options.body ? JSON.parse(options.body) : {}; } catch { return {}; }
  };

  // Rooms collection
  if (path === "/rooms" && method === "GET") return mockGetRooms();

  // Single room
  const roomMatch = path.match(/^\/rooms\/([^/]+)$/);
  if (roomMatch && method === "GET") {
    return mockGetRoom(roomMatch[1]);
  }

  // Room status update
  const roomStatusMatch = path.match(/^\/rooms\/([^/]+)\/status$/);
  if (roomStatusMatch && method === "POST") {
    const { status } = parseBody();
    return mockSetRoomStatus(roomStatusMatch[1], status);
  }

  // Room tasks
  const roomTasksMatch = path.match(/^\/rooms\/([^/]+)\/tasks$/);
  if (roomTasksMatch && method === "GET") {
    return mockGetRoomTasks(roomTasksMatch[1]);
  }

  // Update task completion
  const roomTaskPut = path.match(/^\/rooms\/([^/]+)\/tasks\/([^/]+)$/);
  if (roomTaskPut && method === "PUT") {
    const { completed } = parseBody();
    return mockUpdateTaskCompletion(roomTaskPut[1], roomTaskPut[2], completed);
  }

  // Verify task
  const verifyTaskMatch = path.match(/^\/tasks\/([^/]+)\/verify$/);
  if (verifyTaskMatch && method === "POST") {
    const { action, comment } = parseBody();
    return mockVerifyTask(verifyTaskMatch[1], action, comment);
  }

  // Notifications
  if (path === "/notifications" && method === "GET") return mockGetNotifications();

  const notifRead = path.match(/^\/notifications\/([^/]+)\/read$/);
  if (notifRead && method === "POST") {
    return mockMarkNotificationRead(notifRead[1]);
  }

  // Assigned tasks
  if (path === "/tasks/assigned" && method === "GET") return mockGetAssignedTasks();

  // Supervisor queue
  if (path === "/supervisor/pending" && method === "GET") return mockGetSupervisorQueue();

  // Analytics
  if (path === "/analytics/efficiency" && method === "GET") return mockGetAnalyticsEfficiency();
  if (path === "/analytics/completion" && method === "GET") return mockGetAnalyticsCompletion();
  if (path === "/analytics/quality" && method === "GET") return mockGetAnalyticsQuality();

  // Forecast
  if (path === "/forecast" && method === "GET") return mockGetForecast();

  // Fallback: unresolved
  return Promise.reject(new Error(`Mock API: unhandled path ${path} (${method})`));
}

/**
 * PUBLIC_INTERFACE
 * mockUploadFile simulates file upload for a given room task.
 */
export async function mockUploadFile(path, file) {
  const m = path.match(/^\/rooms\/([^/]+)\/tasks\/([^/]+)\/photo$/);
  if (m) {
    return mockUploadTaskPhoto(m[1], m[2], { name: file?.name });
  }
  return Promise.reject(new Error(`Mock API: unhandled upload path ${path}`));
}
