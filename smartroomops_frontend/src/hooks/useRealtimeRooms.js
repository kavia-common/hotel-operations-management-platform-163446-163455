import { useEffect, useRef, useState } from "react";
import { getWSUrl } from "../services/api";

/**
 * PUBLIC_INTERFACE
 * useRealtimeRooms subscribes to real-time room status updates over WebSocket.
 * Falls back to polling if WS is not available.
 */
export default function useRealtimeRooms() {
  const [rooms, setRooms] = useState([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    let ws;
    try {
      ws = new WebSocket(`${getWSUrl().replace(/^http/, "ws")}/ws/rooms`);
      wsRef.current = ws;
      ws.onopen = () => setConnected(true);
      ws.onclose = () => setConnected(false);
      ws.onerror = () => setConnected(false);
      ws.onmessage = (evt) => {
        try {
          const data = JSON.parse(evt.data);
          if (Array.isArray(data?.rooms)) {
            setRooms(data.rooms);
          } else if (data?.type === "room_update") {
            setRooms((prev) => {
              const idx = prev.findIndex((r) => r.id === data.room.id);
              if (idx >= 0) {
                const copy = prev.slice();
                copy[idx] = data.room;
                return copy;
              }
              return [data.room, ...prev];
            });
          }
        } catch {
          // ignore malformed
        }
      };
    } catch {
      // ignored, fallback to polling
    }

    let poll;
    if (!ws) {
      poll = setInterval(async () => {
        try {
          const resp = await fetch("/rooms"); // likely proxied in dev; otherwise use api.js
          const json = await resp.json();
          setRooms(json);
        } catch {
          // ignore
        }
      }, 5000);
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (poll) clearInterval(poll);
    };
  }, []);

  return { rooms, connected };
}
