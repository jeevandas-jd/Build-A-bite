import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import axiosClient from "../api/axiosClient";

const DifficultySelector = ({ productId }) => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSelect = async (level) => {
    setSelectedLevel(level);
    setLoading(true);
    try {
        console.log(`Fetching instructions for productId: ${productId} at level: ${level}`);

        console.log(`API URL: /products/instructions/${level}/`);
      // Call backend with productId + difficulty
      const response = await axiosClient.get(
        `/products/instructions/${level}/`
      );
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
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      {/* Card Replacement */}
      <div className="p-6 rounded-2xl shadow-xl w-96 bg-white">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-center">Select Difficulty</h2>

          {/* Show buttons if no difficulty chosen */}
          {!selectedLevel && (
            <>
              <button
                onClick={() => handleSelect("beginner")}
                disabled={loading}
                className="w-full py-2 px-4 rounded-xl border border-gray-300 bg-green-100 hover:bg-green-200 transition"
              >
                🟢 Beginner (Ingredients only)
              </button>

              <button
                onClick={() => handleSelect("intermediate")}
                disabled={loading}
                className="w-full py-2 px-4 rounded-xl border border-gray-300 bg-yellow-100 hover:bg-yellow-200 transition"
              >
                🟡 Intermediate (Ingredients + Process)
              </button>

              <button
                onClick={() => handleSelect("expert")}
                disabled={loading}
                className="w-full py-2 px-4 rounded-xl border border-gray-300 bg-red-100 hover:bg-red-200 transition"
              >
                🔴 Expert (Ingredients + Process + Equipment)
              </button>
            </>
          )}

          {/* Show instructions if difficulty selected */}
          {selectedLevel && (
            <div className="text-center">
              <h3 className="font-semibold mb-2">
                Instructions ({selectedLevel})
              </h3>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <p className="mb-4">{instructions}</p>
              )}

              <button
                onClick={handleStartGame}
                disabled={loading}
                className="w-full py-2 px-4 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition"
              >
                🚀 Start Game
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DifficultySelector;
