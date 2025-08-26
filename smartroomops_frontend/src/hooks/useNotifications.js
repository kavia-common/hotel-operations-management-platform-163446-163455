import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

/**
 * PUBLIC_INTERFACE
 * useNotifications polls notifications for urgent rooms/guest requests.
 * Uses mock API via apiFetch fallback to ensure offline behavior.
 */
export default function useNotifications() {
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);

  const fetchAll = async () => {
    try {
      const data = await apiFetch("/notifications");
      setItems(data);
      setUnread(data.filter((n) => !n.read).length);
    } catch {
      // ignore errors for UI resilience
    }
  };

  useEffect(() => {
    fetchAll();
    const id = setInterval(fetchAll, 10000);
    return () => clearInterval(id);
  }, []);

  const markRead = async (id) => {
    try {
      await apiFetch(`/notifications/${id}/read`, { method: "POST" });
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      setUnread((u) => Math.max(0, u - 1));
    } catch {
      // no-op
    }
  };

  return { items, unread, markRead, refresh: fetchAll };
}
