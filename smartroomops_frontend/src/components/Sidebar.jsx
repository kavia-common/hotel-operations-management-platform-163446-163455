import React from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";

/**
 * PUBLIC_INTERFACE
 * Sidebar renders navigation to main views.
 * Authentication has been removed; all users see all sections.
 */
export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 xl:w-80 flex-col h-screen sticky top-0 border-r border-slate-800 bg-slate-900/60 backdrop-blur">
      <div className="p-4 border-b border-slate-800">
        <div className="text-xl font-bold">SmartRoomOps</div>
        <div className="text-xs text-slate-400">Welcome to SmartRoomOps</div>
      </div>
      <nav className="p-4 space-y-2">
        <Nav to="/housekeeping" label="Housekeeping" />
        <Nav to="/management" label="Management" />
      </nav>
      <div className="mt-auto p-4 text-xs text-slate-500">
        v0.1.0 • Minimal prototype
      </div>
    </aside>
  );
}

function Nav({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          isActive ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
        )
      }
    >
      {label}
    </NavLink>
  );
}
