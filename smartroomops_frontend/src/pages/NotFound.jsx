import React from "react";
import { Link } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * NotFound page shown for unknown routes.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="card p-6">
        <div className="text-xl font-semibold mb-2">404 - Not Found</div>
        <div className="text-sm text-slate-400 mb-4">The page you are looking for does not exist.</div>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    </div>
  );
}
