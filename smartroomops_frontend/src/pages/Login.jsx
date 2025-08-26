import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * PUBLIC_INTERFACE
 * Login page for role-based access; uses backend auth.
 */
export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("demo@hotel.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      nav("/housekeeping");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form onSubmit={onSubmit} className="card p-6 w-full max-w-sm">
        <div className="text-xl font-semibold mb-4">SmartRoomOps Login</div>
        {error && <div className="mb-3 text-sm text-red-400">{error}</div>}
        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-400">Email</label>
            <input className="input mt-1" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-slate-400">Password</label>
            <input type="password" className="input mt-1" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button className="btn btn-primary w-full mt-2" type="submit">Sign In</button>
        </div>
      </form>
    </div>
  );
}
