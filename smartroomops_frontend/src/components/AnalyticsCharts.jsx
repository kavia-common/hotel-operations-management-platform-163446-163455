import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";

/**
 * PUBLIC_INTERFACE
 * AnalyticsCharts renders multiple charts for KPIs.
 */
export default function AnalyticsCharts({ efficiency = [], completion = [], quality = [] }) {
  const pieData = [
    { name: "Clean", value: completion.find(d => d.name === "Clean")?.value || 0 },
    { name: "In Progress", value: completion.find(d => d.name === "In Progress")?.value || 0 },
    { name: "Dirty", value: completion.find(d => d.name === "Dirty")?.value || 0 },
  ];
  const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="card p-4">
        <div className="font-semibold mb-3">Efficiency Over Time</div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={efficiency}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line type="monotone" dataKey="efficiency" stroke="#60a5fa" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="card p-4">
        <div className="font-semibold mb-3">Completion Rate (Rooms)</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={completion}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Bar dataKey="value" fill="#38bdf8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="card p-4 md:col-span-2">
        <div className="font-semibold mb-3">Quality Scores</div>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} label>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
