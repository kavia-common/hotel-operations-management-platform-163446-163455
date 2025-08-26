import { useEffect, useState } from "react";
import { mockEmitter, mockGetRooms, startMockRealtime, stopMockRealtime } from "../services/mockData";

/**
 * PUBLIC_INTERFACE
 * useRealtimeRooms subscribes to realtime-like room updates from mock emitter.
 * Always provides data even without a backend.
 */
export default function useRealtimeRooms() {
  const [rooms, setRooms] = useState([]);
  const [connected, setConnected] = useState(true); // mock is always "connected"

  useEffect(() => {
    let unsub;
    mockGetRooms().then(setRooms);
    startMockRealtime();
    unsub = mockEmitter.on("room_update", (payload) => {
      if (payload?.room) {
        setRooms((prev) => {
          const idx = prev.findIndex((r) => r.id === payload.room.id);
          if (idx >= 0) {
            const copy = prev.slice();
            copy[idx] = payload.room;
            return copy;
          }
          return [payload.room, ...prev];
        });
      }
    });

    return () => {
      unsub && unsub();
      stopMockRealtime();
    };
  }, []);

  return { rooms, connected };
}
