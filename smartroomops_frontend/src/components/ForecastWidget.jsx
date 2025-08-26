import React from "react";

/**
 * PUBLIC_INTERFACE
 * ForecastWidget shows expected vacancies and staffing recommendations.
 */
export default function ForecastWidget({ forecast }) {
  if (!forecast) return null;
  const { expected_vacancies, staff_needed, notes } = forecast;
  return (
    <div className="card p-4">
      <div className="font-semibold">Forecast</div>
      <div className="text-sm text-slate-300 mt-2">Expected Vacancies: <span className="font-medium">{expected_vacancies}</span></div>
      <div className="text-sm text-slate-300">Recommended Staff: <span className="font-medium">{staff_needed}</span></div>
      {notes && <div className="text-xs text-slate-400 mt-2">{notes}</div>}
    </div>
  );
}
