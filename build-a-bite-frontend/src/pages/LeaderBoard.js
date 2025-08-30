// src/pages/Leaderboard.js
import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScores() {
      try {
        const res = await axiosClient.get("/leaderboard");
        setScores(res.data);
      } catch (err) {
        console.error("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    }
    fetchScores();
  }, []);

  if (loading) return <p className="p-6">Loading leaderboard...</p>;

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <h1 className="text-3xl font-bold text-green-700 text-center mb-6">
        🌾 Global Leaderboard
      </h1>
      <div className="overflow-x-auto">
        <table className="w-full border-2 border-green-600 rounded-xl shadow-md bg-white">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Player</th>
              <th className="p-3">Score</th>
              <th className="p-3">Difficulty</th>
              <th className="p-3">Product</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((s, i) => (
              <tr key={s._id} className="odd:bg-green-50 even:bg-white">
                <td className="p-3 text-center">{i + 1}</td>
                <td className="p-3">{s.player?.name || "Unknown"}</td>
                <td className="p-3 font-bold text-green-700">{s.score}</td>
                <td className="p-3 capitalize">{s.difficulty}</td>
                <td className="p-3">{s.product}</td>
                <td className="p-3">{new Date(s.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;
