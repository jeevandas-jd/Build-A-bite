// src/pages/AdminDashboard.js
import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import FarmGuide from "../components/FarmGuid";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  // States
  const [players, setPlayers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchPlayers(), fetchLeaderboard()]).finally(() =>
      setLoading(false)
    );
  }, []);

  const fetchPlayers = async () => {
    try {
      const res = await axiosClient.get("/player/all/");
      setPlayers(res.data);
    } catch (err) {
      console.error("Error fetching players:", err);
    }
  };

  const deletePlayer = async (id) => {
    try {
      await axiosClient.delete(`/players/${id}`);
      setPlayers(players.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting player:", err);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await axiosClient.get("/leaderboard");
      setLeaderboard(res.data);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    }
  };

  const clearLeaderboard = async () => {
    try {
      await axiosClient.delete("/leaderboard/clear");
      setLeaderboard([]);
      alert("Leaderboard cleared!");
    } catch (err) {
      console.error("Error clearing leaderboard:", err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">⚙️</div>
          <p className="text-cyan-400 font-mono text-xl">
            LOADING ADMIN DATA...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-6 font-mono relative overflow-hidden">
      {/* Futuristic background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-8"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        ></div>

        <div className="absolute top-10 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-scan-top"></div>
        <div className="absolute bottom-10 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent animate-scan-bottom"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
            ADMIN DASHBOARD
          </h1>
          <p className="text-gray-400 uppercase tracking-wider">
            Manage Operators & Scores
          </p>
        </div>

        {/* Players Section */}
        <div className="bg-gray-800/70 backdrop-blur-xl border border-cyan-400/40 rounded-2xl p-6 shadow-2xl mb-10">
          <h2 className="text-xl text-cyan-400 font-bold mb-4">Players</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cyan-400/30">
                  <th className="p-4 text-cyan-400 text-left">NAME</th>
                  <th className="p-4 text-cyan-400 text-left">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                  <tr
                    key={player.id}
                    className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-all duration-200"
                  >
                    <td className="p-4 text-white font-semibold">
                      {player.name}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => deletePlayer(player.id)}
                        className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full hover:bg-red-500/40 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {players.length === 0 && (
              <p className="text-center text-gray-400 mt-4">
                No players available.
              </p>
            )}
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="bg-gray-800/70 backdrop-blur-xl border border-purple-400/40 rounded-2xl p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-purple-400 font-bold">Leaderboard</h2>
            <button
              onClick={clearLeaderboard}
              className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full hover:bg-yellow-500/40 transition"
            >
              Clear Leaderboard
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-400/30">
                  <th className="p-4 text-purple-400 text-left">RANK</th>
                  <th className="p-4 text-purple-400 text-left">PLAYER</th>
                  <th className="p-4 text-purple-400 text-center">SCORE</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr
                    key={entry._id || index}
                    className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-all duration-200"
                  >
                    <td className="p-4 text-cyan-400 font-bold">{index + 1}</td>
                    <td className="p-4 text-white font-semibold">
                      {entry.playerName}
                    </td>
                    <td className="p-4 text-center text-green-400 font-bold">
                      {entry.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {leaderboard.length === 0 && (
              <p className="text-center text-gray-400 mt-4">
                No leaderboard data available.
              </p>
            )}
          </div>
        </div>

        {/* Optional FarmGuide */}
        
      </div>

      {/* Animations */}
      <style>{`
        @keyframes scan-top {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        @keyframes scan-bottom {
          0% { transform: translateX(100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(-100%); opacity: 0; }
        }
        .animate-scan-top { animation: scan-top 8s linear infinite; }
        .animate-scan-bottom { animation: scan-bottom 12s linear infinite 2s; }
      `}</style>
    </div>
  );
}

export default AdminDashboard;
