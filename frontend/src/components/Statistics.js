import React, { useState, useEffect } from "react";
import api from "../api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";

/**
 * Statistics Component
 * Displays:
 * - Summary cards
 * - Bar chart (Min/Avg/Max)
 * - Detailed table
 */
function Statistics({ datasetId }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Fetch statistics from backend
   */
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/statistics", {
          params: { dataset_id: datasetId },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching statistics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [datasetId]);

  if (loading) return <div className="loading">Loading statistics...</div>;
  if (!stats) return null;

  /**
   * Prepare chart data for Recharts
   */
  const chartData = Object.entries(stats.numeric_stats).map(([col, s]) => ({
    name: col,
    Average: s.average,
    Min: s.min,
    Max: s.max,
  }));

  return (
    <div className="stats-section">
      {/* ===== SUMMARY CARDS ===== */}
      <div className="stats-summary">
        <div className="stat-card">
          <div className="stat-number">{stats.total_molecules}</div>
          <div className="stat-label">Total Molecules</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.columns.length}</div>
          <div className="stat-label">Properties</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{Object.keys(stats.numeric_stats).length}</div>
          <div className="stat-label">Numeric Columns</div>
        </div>
      </div>

      {/* ===== BAR CHART ===== */}
      <div className="chart-section">
        <h3>Property Overview (Min / Avg / Max)</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-30} textAnchor="end" interval={0} />
            <YAxis />
            <Tooltip />
            <Legend verticalAlign="top" />
            <Bar dataKey="Min" fill="#93c5fd" />
            <Bar dataKey="Average" fill="#6366f1" />
            <Bar dataKey="Max" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ===== DETAILED TABLE ===== */}
      <div className="stats-table-section">
        <h3>Detailed Statistics</h3>
        <table className="stats-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Min</th>
              <th>Average</th>
              <th>Max</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(stats.numeric_stats).map(([col, s]) => (
              <tr key={col}>
                <td><strong>{col}</strong></td>
                <td>{s.min}</td>
                <td>{s.average}</td>
                <td>{s.max}</td>
                <td>{s.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Statistics;
