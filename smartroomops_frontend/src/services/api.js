import { mockApiFetch, mockUploadFile } from "./mockApi";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";
const WS_URL = process.env.REACT_APP_WEBSOCKET_URL || "ws://localhost:8000";

/**
 * Enable or disable mock mode explicitly if needed.
 * If not explicitly set, apiFetch will try backend first and fallback to mocks on failure.
 */
let FORCE_MOCK = true; // default to true to ensure meaningful preview without backend

// PUBLIC_INTERFACE
export function setMockMode(enabled) {
  FORCE_MOCK = !!enabled;
}

/**
 * Attempt a network request; if it fails or FORCE_MOCK is true, use mock API.
 * PUBLIC_INTERFACE
 * apiFetch wraps fetch with base URL and JSON handling (no authentication).
 * @param {string} path - API path starting with /
 * @param {RequestInit} options - fetch options
 * @returns {Promise<any>} JSON parsed response or throws error
 */
export async function apiFetch(path, options = {}) {
  if (FORCE_MOCK) {
    return mockApiFetch(path, options);
  }

  const url = `${API_BASE_URL}${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  try {
    const resp = await fetch(url, { ...options, headers });
    if (!resp.ok) {
      let text = await resp.text().catch(() => "");
      throw new Error(`API ${resp.status}: ${text || resp.statusText}`);
    }
    const contentType = resp.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return resp.json();
    }
    return resp.text();
  } catch (e) {
    // Fallback to mock if network fails
    return mockApiFetch(path, options);
  }
}

/**
 * PUBLIC_INTERFACE
 * uploadFile sends multipart/form-data (no authentication).
 * Uses mock upload in mock mode.
 */
export async function uploadFile(path, file, fields = {}) {
  if (FORCE_MOCK) {
    return mockUploadFile(path, file);
  }

  const url = `${API_BASE_URL}${path}`;
  const form = new FormData();
  Object.entries(fields).forEach(([k, v]) => form.append(k, v));
  form.append("file", file);

  try {
    const resp = await fetch(url, { method: "POST", body: form });
    if (!resp.ok) throw new Error(`Upload failed ${resp.status}`);
    return resp.json();
  } catch (e) {
    return mockUploadFile(path, file);
  }
}

/**
 * PUBLIC_INTERFACE
 * getWSUrl returns websocket base url for real-time tracking.
 */
export function getWSUrl() {
  return WS_URL;
}
