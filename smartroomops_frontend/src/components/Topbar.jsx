import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import useNotifications from "../hooks/useNotifications";

/**
 * PUBLIC_INTERFACE
 * Topbar shows notifications, quick search, and user actions.
 */
export default function Topbar() {
  const { user, logout } = useAuth();
  const { items, unread, markRead } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-900/80 backdrop-blur">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="text-lg font-semibold">Dashboard</div>
          <span className="badge badge-blue">Real-time</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button className="btn btn-secondary relative" onClick={() => setOpen((s) => !s)} aria-label="Notifications">
              🔔
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 rounded-full bg-red-500 text-white text-xs px-1">{unread}</span>
              )}
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-80 card p-2 max-h-96 overflow-auto">
                <div className="px-2 py-1 text-sm text-slate-400">Notifications</div>
                {items.length === 0 && <div className="p-3 text-sm text-slate-400">No notifications</div>}
                {items.map((n) => (
                  <div key={n.id} className="p-2 rounded hover:bg-slate-700/50">
                    <div className="text-sm">{n.message}</div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-xs text-slate-400">{new Date(n.created_at).toLocaleString()}</div>
                      {!n.read && (
                        <button className="text-xs text-blue-400 hover:underline" onClick={() => markRead(n.id)}>
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="text-sm text-slate-300">{user?.name}</div>
          <button className="btn btn-secondary" onClick={logout}>Logout</button>
        </div>
      </div>
    </header>
  );
}
