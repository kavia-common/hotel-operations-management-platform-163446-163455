import React, { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import AnalyticsCharts from "../components/AnalyticsCharts";
import ForecastWidget from "../components/ForecastWidget";

/**
 * PUBLIC_INTERFACE
 * ManagementDashboard shows analytics KPIs, staffing/forecast, and quick actions.
 */
export default function ManagementDashboard() {
  const [efficiency, setEfficiency] = useState([]);
  const [completion, setCompletion] = useState([]);
  const [quality, setQuality] = useState([]);
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    apiFetch("/analytics/efficiency").then(setEfficiency).catch(() => setEfficiency([]));
    apiFetch("/analytics/completion").then(setCompletion).catch(() => setCompletion([]));
    apiFetch("/analytics/quality").then(setQuality).catch(() => setQuality([]));
    apiFetch("/forecast").then(setForecast).catch(() => setForecast(null));
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="text-xs text-slate-400">Avg. Turnover Time</div>
          <div className="text-2xl font-bold">34m</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-slate-400">Completion Today</div>
          <div className="text-2xl font-bold">78%</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-slate-400">Quality Score</div>
          <div className="text-2xl font-bold">92</div>
        </div>
      </div>

      <AnalyticsCharts efficiency={efficiency} completion={completion} quality={quality} />

      <ForecastWidget forecast={forecast} />

      <div className="card p-4">
        <div className="font-semibold mb-2">Supervisor Queue</div>
        <SupervisorQueue />
      </div>
    </div>
  );
}

function SupervisorQueue() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    apiFetch("/supervisor/pending").then(setItems).catch(() => setItems([]));
  }, []);

  return (
    <div className="space-y-2">
      {items.map((it) => (
        <div key={it.id} className="flex items-center justify-between">
          <div className="text-sm">Room {it.room_number} • {it.task_title}</div>
          <div className="text-xs text-slate-400">{new Date(it.created_at).toLocaleString()}</div>
        </div>
      ))}
      {items.length === 0 && <div className="text-sm text-slate-400">No pending verifications.</div>}
    </div>
  );
}
