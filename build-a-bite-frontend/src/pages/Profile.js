import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { Loader2, User, Edit3 } from "lucide-react";

function Profile() {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosClient.get("/auth/me");
        setPlayer(res.data);
      } catch (err) {
        setError("Failed to load operator profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">⚙️</div>
          <p className="text-cyan-400 font-mono text-xl">LOADING OPERATOR PROFILE...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 text-red-400">⚠️</div>
          <p className="text-red-400 font-mono text-xl">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-6 font-mono relative overflow-hidden flex justify-center items-start">
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

      <div className="relative z-10 w-full max-w-md bg-gray-800/80 backdrop-blur-xl border border-cyan-400/40 rounded-2xl shadow-2xl p-8 mt-12">
        {/* Profile header with futuristic accent */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-5 py-2 rounded-full shadow-lg uppercase tracking-wider font-bold text-sm">
          OPERATOR PROFILE
        </div>

        <div className="flex flex-col items-center mt-6">
          {/* Avatar with futuristic glow */}
          {player?.avatar ? (
            <div className="relative mb-5">
              <img
                src={player.avatar}
                alt="avatar"
                className="w-32 h-32 rounded-full border-4 border-cyan-400/50 shadow-lg object-cover"
              />
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-75"></div>
            </div>
          ) : (
            <div className="w-32 h-32 flex items-center justify-center rounded-full border-4 border-cyan-400/50 bg-gray-700 text-cyan-400 mb-5 shadow-lg relative">
              <User className="w-16 h-16" />
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-75"></div>
            </div>
          )}

          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-1">
            {player?.name}
          </h2>
          <p className="text-gray-400 text-sm mb-6">{player?.email}</p>

          {/* Stats panel with futuristic design */}
          <div className="w-full bg-gray-700/50 backdrop-blur-md rounded-xl p-5 border border-purple-400/30 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-600/40 rounded-lg border border-cyan-400/20">
                <div className="text-cyan-400 text-sm mb-1">OPERATOR ID</div>
                <div className="text-white font-bold">{player?._id?.slice(-8) || 'N/A'}</div>
              </div>
              <div className="text-center p-3 bg-gray-600/40 rounded-lg border border-purple-400/20">
                <div className="text-purple-400 text-sm mb-1">JOINED</div>
                <div className="text-white font-bold">
                  {new Date(player?.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            {/* Additional stats can be added here */}
            <div className="mt-4 text-center">
              <div className="text-gray-400 text-xs">SYNTHESIS PROTOCOLS COMPLETED: 0</div>
              <div className="h-1 w-full bg-gray-600 rounded-full mt-1">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full w-0"></div>
              </div>
            </div>
          </div>

          {/* Edit button with futuristic style */}
          <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold shadow-lg hover:from-cyan-400 hover:to-purple-400 hover:shadow-cyan-400/30 transition-all duration-300 flex items-center gap-2 group">
            <Edit3 className="w-4 h-4" />
            <span>EDIT PROFILE</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
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

export default Profile;