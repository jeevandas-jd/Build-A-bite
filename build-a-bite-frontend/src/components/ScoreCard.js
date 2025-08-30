// src/components/ScoreCard.js
import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

function ScoreCard({ score, total, difficulty, productId, sessionId, timeToFinish }) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const postScore = async () => {
      try {
        if (!sessionId || !difficulty || !productId ) {
          setError("⚠️ Missing session ID. Cannot submit score.");
          return;
        }
        setSubmitting(true);
        await axiosClient.post("/leaderboard", {
          score,
          difficulty,
          product: productId,
          sessionId,
          timeToFinish,
        });
      } catch (err) {
        setError("⚠️ Failed to submit score");
      } finally {
        setSubmitting(false);
      }
    };
    postScore();
  }, [score, difficulty, productId, sessionId, timeToFinish]);

  return (
    <div className="bg-white border-4 border-green-500 rounded-3xl shadow-xl p-6 text-center max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold text-green-700 mb-4">🎉 Game Over!</h2>

      <p className="text-lg mb-2">
        You got <span className="font-bold text-green-700">{score}</span> / {total} correct
      </p>
      <p className="text-gray-600">Difficulty: {difficulty}</p>
      <p className="text-gray-600">⏳ Time Taken: {timeToFinish}s</p>

      {error && <p className="text-red-600 mt-2">{error}</p>}
      {submitting && <p className="text-gray-500 mt-2">Submitting score...</p>}

      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={() => navigate("/leaderboard")}
          className="px-5 py-2 bg-green-600 text-white font-semibold rounded-xl shadow-md hover:bg-green-700 transition"
        >
          🌱 View Leaderboard
        </button>
        <button
          onClick={() => navigate("/")}
          className="px-5 py-2 bg-gray-300 rounded-xl shadow hover:bg-gray-400"
        >
          🏠 Home
        </button>
      </div>
    </div>
  );
}

export default ScoreCard;
