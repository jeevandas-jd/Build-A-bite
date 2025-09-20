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

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-spin">⚙️</div>
        <p className="text-cyan-400 font-mono text-xl">LOADING LEADERBOARD DATA...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-6 font-mono relative overflow-hidden">
      {/* Futuristic background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Digital grid */}
        <div className="absolute inset-0 opacity-8" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
        
        {/* Data streams */}
        <div className="absolute top-10 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-scan-top"></div>
        <div className="absolute bottom-10 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent animate-scan-bottom"></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 right-20 w-3 h-3 bg-cyan-400 rounded-full animate-float-1"></div>
        <div className="absolute bottom-32 left-24 w-2 h-2 bg-purple-400 rounded-full animate-float-2"></div>
        <div className="absolute top-1/2 right-12 w-4 h-4 bg-pink-400 rounded-full animate-float-3"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
             LEADERBOARD
          </h1>
          <p className="text-gray-400 uppercase tracking-wider">TopPerformances</p>
        </div>

        <div className="bg-gray-800/70 backdrop-blur-xl border border-cyan-400/40 rounded-2xl p-6 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cyan-400/30">
                  <th className="p-4 text-cyan-400 text-left">RANK</th>
                  <th className="p-4 text-cyan-400 text-left">NAME</th>
                  <th className="p-4 text-cyan-400 text-center">SCORE</th>
                  <th className="p-4 text-cyan-400 text-center">ACCURACY</th>
                  <th className="p-4 text-cyan-400 text-center">DIFFICULTY</th>
                  <th className="p-4 text-cyan-400 text-center">TIME TAKEN</th>
                  <th className="p-4 text-cyan-400 text-center">DATE</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((s, i) => (
                  <tr key={s._id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-all duration-200">
                    <td className="p-4">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        i === 0 ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900" :
                        i === 1 ? "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900" :
                        i === 2 ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white" :
                        "bg-gray-700/50 text-cyan-400"
                      } font-bold`}>
                        {i + 1}
                      </div>
                    </td>
                    <td className="p-4 text-white font-semibold">{s.player?.name || "Unknown Operator"}</td>
                    <td className="p-4 text-center">
                      <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
                        {s.score}
                      </span>
                    </td>
                    <td className="p-4 text-center text-purple-400 font-semibold">
                      {s.accuracy ? `${s.accuracy}%` : "N/A"}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        s.difficulty === "expert" ? "bg-red-500/20 text-red-400" :
                        s.difficulty === "intermediate" ? "bg-purple-500/20 text-purple-400" :
                        "bg-cyan-500/20 text-cyan-400"
                      }`}>
                        {s.difficulty}
                      </span>
                    </td>
                    <td className="p-4 text-center text-green-400 font-semibold">{s.timeToFinish}s</td>
                    <td className="p-4 text-center text-white">{s.product}</td>
                    <td className="p-4 text-center text-gray-400">
                      {new Date(s.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {scores.length === 0 && (
          <div className="text-center mt-8 text-gray-400">
            No data available.
                      </div>
        )}
      </div>

      {/* Animation styles */}
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
        @keyframes float-1 {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.7; }
          50% { transform: translateY(-15px) scale(1.3); opacity: 1; }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.6; }
          50% { transform: translateY(-12px) translateX(8px) scale(1.2); opacity: 1; }
        }
        @keyframes float-3 {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.8; }
          50% { transform: translateY(-18px) scale(1.1); opacity: 0.4; }
        }
        
        .animate-scan-top { animation: scan-top 8s linear infinite; }
        .animate-scan-bottom { animation: scan-bottom 12s linear infinite 2s; }
        .animate-float-1 { animation: float-1 4s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 5s ease-in-out infinite 1s; }
        .animate-float-3 { animation: float-3 6s ease-in-out infinite 2s; }
      `}</style>
    </div>
  );
}

export default Leaderboard;