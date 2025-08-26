import React, { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../services/api";

const AuthContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * useAuth exposes auth state, role, login, logout
 */
export function useAuth() {
  return useContext(AuthContext);
}

/**
 * PUBLIC_INTERFACE
 * AuthProvider manages login state and role-based access.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // {name, role}
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // try to hydrate user from token
    const token = localStorage.getItem("sro_token");
    if (!token) {
      setLoading(false);
      return;
    }
    apiFetch("/auth/me")
      .then((me) => setUser(me))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("sro_token", data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("sro_token");
    setUser(null);
  };

  const value = { user, loading, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
