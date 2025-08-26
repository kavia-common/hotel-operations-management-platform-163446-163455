const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";
const WS_URL = process.env.REACT_APP_WEBSOCKET_URL || "ws://localhost:8000";

/**
 * PUBLIC_INTERFACE
 * apiFetch wraps fetch with base URL and JSON handling (no authentication).
 * @param {string} path - API path starting with /
 * @param {RequestInit} options - fetch options
 * @returns {Promise<any>} JSON parsed response or throws error
 */
export async function apiFetch(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

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
}

/**
 * PUBLIC_INTERFACE
 * uploadFile sends multipart/form-data (no authentication).
 */
export async function uploadFile(path, file, fields = {}) {
  const url = `${API_BASE_URL}${path}`;
  const form = new FormData();
  Object.entries(fields).forEach(([k, v]) => form.append(k, v));
  form.append("file", file);

  const resp = await fetch(url, { method: "POST", body: form });
  if (!resp.ok) throw new Error(`Upload failed ${resp.status}`);
  return resp.json();
}

/**
 * PUBLIC_INTERFACE
 * getWSUrl returns websocket base url for real-time tracking.
 */
export function getWSUrl() {
  return WS_URL;
}
