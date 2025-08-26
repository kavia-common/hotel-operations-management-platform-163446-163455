import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TaskChecklist from "../components/TaskChecklist";
import { apiFetch } from "../services/api";

/**
 * PUBLIC_INTERFACE
 * RoomDetails shows room metadata, current status, tasks/checklist, and actions.
 */
export default function RoomDetails() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    apiFetch(`/rooms/${id}`).then(setRoom).catch(() => setRoom(null));
    apiFetch(`/rooms/${id}/tasks`).then(setTasks).catch(() => setTasks([]));
  }, [id]);

  const setStatus = async (status) => {
    try {
      await apiFetch(`/rooms/${id}/status`, { method: "POST", body: JSON.stringify({ status }) });
      setRoom((r) => ({ ...(r || {}), status }));
    } catch {}
  };

  if (!room) return <div className="text-sm text-slate-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-semibold">Room {room.number}</div>
            <div className="text-sm text-slate-300">Type: {room.type} • Floor {room.floor}</div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-secondary" onClick={() => setStatus("In Progress")}>Start</button>
            <button className="btn btn-primary" onClick={() => setStatus("Clean")}>Mark Clean</button>
          </div>
        </div>
      </div>

      <div>
        <div className="font-semibold mb-2">Checklist</div>
        <TaskChecklist roomId={id} tasks={tasks} onChange={setTasks} />
      </div>
    </div>
  );
}
