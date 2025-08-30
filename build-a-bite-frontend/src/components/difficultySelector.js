import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

const DifficultySelector = ({ productId, onClose }) => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSelect = async (level) => {
    setSelectedLevel(level);
    setLoading(true);
    try {
      console.log(`Fetching instructions for productId: ${productId} at level: ${level}`);
      const response = await axiosClient.get(`/products/instructions/${level}/`);
      console.log("Instructions fetched:", response.data);
      setInstructions(response.data.instructions);
    } catch (err) {
      console.error("Error fetching instructions:", err);
      setInstructions("⚠️ Failed to fetch instructions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = () => {
    navigate(`/game/${productId}/${selectedLevel}`);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-50">
      {/* Futuristic modal card */}
      <div className="relative p-8 rounded-2xl w-96 bg-gray-900/90 border border-cyan-400/40 shadow-2xl animate-fade-in">
        {/* Glow border effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20 opacity-40 blur-2xl"></div>

        <div className="relative flex flex-col gap-6">
          {/* Header */}
          <h2 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 animate-title-glow">
            Select Difficulty
          </h2>

          {/* Buttons if no difficulty selected */}
          {!selectedLevel && (
            <div className="flex flex-col gap-4">
              <button
                onClick={() => handleSelect("beginner")}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-bold text-cyan-200 border border-cyan-400/40 bg-gray-800/60 hover:bg-cyan-400/20 hover:text-cyan-100 transition-all duration-300 shadow-lg"
              >
                🟢 Beginner <span className="text-xs">(Ingredients only)</span>
              </button>

              <button
                onClick={() => handleSelect("intermediate")}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-bold text-yellow-200 border border-yellow-400/40 bg-gray-800/60 hover:bg-yellow-400/20 hover:text-yellow-100 transition-all duration-300 shadow-lg"
              >
                🟡 Intermediate <span className="text-xs">(Ingredients + Process)</span>
              </button>

              <button
                onClick={() => handleSelect("expert")}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-bold text-red-200 border border-red-400/40 bg-gray-800/60 hover:bg-red-400/20 hover:text-red-100 transition-all duration-300 shadow-lg"
              >
                🔴 Expert <span className="text-xs">(Ingredients + Process + Equipment)</span>
              </button>
            </div>
          )}

          {/* Instructions if difficulty selected */}
          {selectedLevel && (
            <div className="text-center">
              <h3 className="font-semibold text-lg text-cyan-300 mb-3">
                Instructions ({selectedLevel})
              </h3>
              {loading ? (
                <p className="text-gray-400 animate-pulse">Loading...</p>
              ) : (
                <p className="mb-6 text-gray-200">{instructions}</p>
              )}

              <button
                onClick={handleStartGame}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                🚀 Start Game
              </button>
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
          >
            ✖
          </button>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: scale(0.95);} to { opacity: 1; transform: scale(1);} }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        @keyframes title-glow {0%,100%{text-shadow:0 0 10px rgba(0,255,255,0.4);}50%{text-shadow:0 0 20px rgba(147,51,234,0.6);}}
        .animate-title-glow { animation: title-glow 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default DifficultySelector;
  