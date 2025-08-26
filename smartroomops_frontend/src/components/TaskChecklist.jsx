import React, { useState } from "react";
import { apiFetch, uploadFile } from "../services/api";
import { useAuth } from "../context/AuthContext";

/**
 * PUBLIC_INTERFACE
 * TaskChecklist renders tasks for a room with completion toggles, photo uploads,
 * and supervisor verification (approve/reject with comment).
 */
export default function TaskChecklist({ roomId, tasks = [], onChange }) {
  const [localTasks, setLocalTasks] = useState(tasks);
  const { user } = useAuth();
  const [comment, setComment] = useState("");

  const toggle = async (task) => {
    const updated = { ...task, completed: !task.completed };
    try {
      await apiFetch(`/rooms/${roomId}/tasks/${task.id}`, {
        method: "PUT",
        body: JSON.stringify({ completed: updated.completed }),
      });
      const next = localTasks.map((t) => (t.id === task.id ? updated : t));
      setLocalTasks(next);
      onChange && onChange(next);
    } catch (e) {
      // handle error UI if needed
    }
  };

  const onUpload = async (task, file) => {
    try {
      const res = await uploadFile(`/rooms/${roomId}/tasks/${task.id}/photo`, file, {});
      const next = localTasks.map((t) => (t.id === task.id ? { ...t, photos: [...(t.photos || []), res] } : t));
      setLocalTasks(next);
      onChange && onChange(next);
    } catch {
      // ignore for prototype
    }
  };

  const approve = async (task) => {
    try {
      await apiFetch(`/tasks/${task.id}/verify`, {
        method: "POST",
        body: JSON.stringify({ action: "approve", comment }),
      });
      const next = localTasks.map((t) => (t.id === task.id ? { ...t, verified: "approved", supervisor_comment: comment } : t));
      setLocalTasks(next);
      setComment("");
    } catch {}
  };

  const reject = async (task) => {
    try {
      await apiFetch(`/tasks/${task.id}/verify`, {
        method: "POST",
        body: JSON.stringify({ action: "reject", comment }),
      });
      const next = localTasks.map((t) => (t.id === task.id ? { ...t, verified: "rejected", supervisor_comment: comment } : t));
      setLocalTasks(next);
      setComment("");
    } catch {}
  };

  return (
    <div className="space-y-3">
      {localTasks.map((task) => (
        <div key={task.id} className="card p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{task.title}</div>
              <div className="text-xs text-slate-400">{task.description}</div>
            </div>
            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!task.completed}
                  onChange={() => toggle(task)}
                />
                Completed
              </label>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && onUpload(task, e.target.files[0])}
              className="text-sm"
            />
            {task.photos?.length > 0 && (
              <div className="text-xs text-slate-400">{task.photos.length} photo(s) uploaded</div>
            )}
          </div>

          {user?.role === "Supervisor" && (
            <div className="mt-3 border-t border-slate-700 pt-3">
              <div className="flex items-center gap-2">
                <input
                  className="input"
                  placeholder="Supervisor comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button className="btn btn-primary" onClick={() => approve(task)}>Approve</button>
                <button className="btn btn-secondary" onClick={() => reject(task)}>Reject</button>
              </div>
              {task.verified && (
                <div className="mt-2 text-xs">
                  Status: {task.verified} {task.supervisor_comment ? `• "${task.supervisor_comment}"` : ""}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
      {localTasks.length === 0 && (
        <div className="text-sm text-slate-400">No tasks assigned.</div>
      )}
    </div>
  );
}
