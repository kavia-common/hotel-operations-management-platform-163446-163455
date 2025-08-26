import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import HousekeepingDashboard from "./pages/HousekeepingDashboard";
import ManagementDashboard from "./pages/ManagementDashboard";
import RoomDetails from "./pages/RoomDetails";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

/**
 * PUBLIC_INTERFACE
 * App is the root component which wires routing and global providers.
 * It renders the main layout (Sidebar + Topbar + content) for protected routes.
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedLayout />}>
            <Route index element={<Navigate to="/housekeeping" replace />} />
            <Route path="housekeeping" element={<HousekeepingDashboard />} />
            <Route path="management" element={<ManagementDashboard />} />
            <Route path="room/:id" element={<RoomDetails />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

/**
 * Protected layout wrapper. Shows main layout when authenticated.
 */
function ProtectedLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-h-screen">
          <Topbar />
          <div className="p-4 md:p-6 lg:p-8">
            <Routes>
              <Route index element={<Navigate to="/housekeeping" replace />} />
              <Route path="/housekeeping" element={<HousekeepingDashboard />} />
              <Route path="/management" element={<ManagementDashboard />} />
              <Route path="/room/:id" element={<RoomDetails />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
