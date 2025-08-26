import React from "react";
import { Link } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * RoomCard displays room info with status-based color coding.
 */
export default function RoomCard({ room }) {
  const statusColor =
    room.status === "Clean" ? "badge-green" :
    room.status === "Dirty" ? "badge-red" :
    room.status === "In Progress" ? "badge-yellow" : "badge-blue";

  return (
    <Link to={`/room/${room.id}`} className="block card p-4 hover:bg-slate-700/40 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="text-lg font-semibold">Room {room.number}</div>
        <span className={`badge ${statusColor}`}>{room.status}</span>
      </div>
      <div className="text-sm text-slate-300">
        Type: {room.type} • Floor {room.floor}
      </div>
      <div className="text-xs text-slate-400 mt-2">
        {room.guest_name ? `Occupied by ${room.guest_name}` : "Vacant"}
      </div>
      {room.priority && <div className="mt-2 badge badge-red">Priority</div>}
    </Link>
  );
}
