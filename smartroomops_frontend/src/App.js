import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import HousekeepingDashboard from "./pages/HousekeepingDashboard";
import ManagementDashboard from "./pages/ManagementDashboard";
import RoomDetails from "./pages/RoomDetails";
import NotFound from "./pages/NotFound";

/**
 * PUBLIC_INTERFACE
 * App is the root component which wires routing and global layout.
 * Authentication has been removed; users can access all routes directly.
 */
function App() {
  return (
    <BrowserRouter>
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
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
