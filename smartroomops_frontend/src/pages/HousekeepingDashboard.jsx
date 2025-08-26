import React, { useEffect, useState } from "react";
import useRealtimeRooms from "../hooks/useRealtimeRooms";
import RoomCard from "../components/RoomCard";
import { apiFetch } from "../services/api";

/**
 * PUBLIC_INTERFACE
 * HousekeepingDashboard lists rooms grid, quick filters, and assigned tasks summary.
 */
export default function HousekeepingDashboard() {
  const { rooms } = useRealtimeRooms();
  const [filter, setFilter] = useState("All");
  const [assigned, setAssigned] = useState([]);

  useEffect(() => {
    apiFetch("/tasks/assigned")
      .then(setAssigned)
      .catch(() => setAssigned([]));
  }, []);

  const filtered = rooms.filter((r) => filter === "All" || r.status === filter);

  const counts = rooms.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card p-4">
          <div className="text-xs text-slate-400">Total</div>
          <div className="text-2xl font-bold">{rooms.length}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-slate-400">Clean</div>
          <div className="text-2xl font-bold">{counts["Clean"] || 0}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-slate-400">In Progress</div>
          <div className="text-2xl font-bold">{counts["In Progress"] || 0}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-slate-400">Dirty</div>
          <div className="text-2xl font-bold">{counts["Dirty"] || 0}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {["All", "Clean", "In Progress", "Dirty"].map((f) => (
          <button
            key={f}
            className={`btn ${filter === f ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>

      <div className="card p-4">
        <div className="font-semibold mb-2">My Assigned Tasks</div>
        <div className="space-y-2">
          {assigned.map((t) => (
            <div key={t.id} className="flex items-center justify-between">
              <div className="text-sm">{t.title} • Room {t.room_number}</div>
              <div className="text-xs text-slate-400">{t.due_at ? new Date(t.due_at).toLocaleString() : ""}</div>
            </div>
          ))}
          {assigned.length === 0 && <div className="text-sm text-slate-400">No tasks assigned.</div>}
        </div>
      </div>
    </div>
  );
}
