import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

function ScoreCard({ score, total, difficulty, productId, sessionId, timeToFinish, accuracy, correctOrder, playerOrder }) {
  const navigate = useNavigate();
  const [showReview, setShowReview] = useState(false);
  const [userReview, setUserReview] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate stars based on accuracy
  const calculateStars = () => {
    if (accuracy >= 90) return 5;
    if (accuracy >= 75) return 4;
    if (accuracy >= 60) return 3;
    if (accuracy >= 40) return 2;
    return 1;
  };

  const stars = calculateStars();

  useEffect(() => {
    const submitScore = async () => {
      try {
        await axiosClient.post("/leaderboard", {
          product: productId,
          score,
          difficulty,
          accuracy,
          timeToFinish,
          gameSession: sessionId,
        });
        console.log("✅ Score submitted successfully");
      } catch (err) {
        console.error("❌ Error submitting score:", err);
      }
    };

    submitScore();
  }, [score, difficulty, productId, sessionId, timeToFinish, accuracy]);

  const handleSubmitReview = async () => {
    setIsSubmitting(true);
    try {
      await axiosClient.post("/reviews", {
        product: productId,
        sessionId,
        rating: userRating,
        review: userReview,
        difficulty,
        accuracy
      });
      console.log("✅ Review submitted successfully");
      navigate("/leaderboard");
    } catch (err) {
      console.error("❌ Error submitting review:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (count, filled = true) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-2xl ${i < count ? (filled ? 'text-yellow-400' : 'text-yellow-400 opacity-40') : 'text-gray-400'}`}
      >
        ⭐
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-6 font-mono relative overflow-hidden">
      {/* Celebration background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-cyan-400 rounded-full animate-celebration-1"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-400 rounded-full animate-celebration-2"></div>
        <div className="absolute bottom-1/4 left-1/3 w-5 h-5 bg-pink-400 rounded-full animate-celebration-3"></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-green-400 rounded-full animate-celebration-4"></div>
      </div>

      {!showReview ? (
        // Score Summary View
        <div className="max-w-2xl mx-auto bg-gray-800/80 backdrop-blur-xl border border-cyan-400/40 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-purple-400/10 to-pink-400/10 animate-score-glow"></div>
          
          <div className="relative z-10 text-center">
            <div className="text-6xl mb-4 animate-bounce">🏆</div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
              MISSION ANALYSIS
            </h2>
            
            {/* Star Rating */}
            <div className="mb-6">
              <div className="text-yellow-400 text-lg mb-2">PERFORMANCE RATING</div>
              <div className="flex justify-center mb-2">
                {renderStars(stars)}
              </div>
              <div className="text-gray-300 text-sm">
                {stars === 5 ? "Outstanding! Perfect execution!" : 
                 stars === 4 ? "Great job! Almost perfect!" :
                 stars === 3 ? "Good effort! Room for improvement." :
                 stars === 2 ? "Fair attempt. Keep practicing!" :
                 "Beginner level. Try again!"}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-700/50 rounded-xl p-4 border border-cyan-400/30">
                <div className="text-cyan-400 text-sm mb-1">ACCURACY</div>
                <div className="text-3xl font-bold text-white">{accuracy}%</div>
              </div>
              <div className="bg-gray-700/50 rounded-xl p-4 border border-purple-400/30">
                <div className="text-purple-400 text-sm mb-1">SCORE</div>
                <div className="text-3xl font-bold text-white">{score}/{total}</div>
              </div>
              <div className="bg-gray-700/50 rounded-xl p-4 border border-pink-400/30">
                <div className="text-pink-400 text-sm mb-1">DIFFICULTY</div>
                <div className="text-xl font-bold text-white uppercase">{difficulty}</div>
              </div>
              <div className="bg-gray-700/50 rounded-xl p-4 border border-green-400/30">
                <div className="text-green-400 text-sm mb-1">TIME</div>
                <div className="text-xl font-bold text-white">{timeToFinish}s</div>
              </div>
            </div>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate("/leaderboard")}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <span className="mr-2">🏆</span>
                LEADERBOARD
              </button>
              
              <button
                onClick={() => setShowReview(true)}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <span className="mr-2">📝</span>
                REVIEW ANSWERS
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Review View
        <div className="max-w-4xl mx-auto bg-gray-800/80 backdrop-blur-xl border border-cyan-400/40 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 via-pink-400/10 to-cyan-400/10 animate-score-glow"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 mb-6 text-center">
              PERFORMANCE REVIEW
            </h2>
            
            {/* Step-by-step comparison */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-cyan-300 mb-4">Step-by-Step Analysis</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {correctOrder.map((step, index) => {
                  const playerStep = playerOrder[index] || { name: "Not attempted" };
                  const isCorrect = playerStep.name === step.name;
                  
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border ${
                        isCorrect
                          ? 'border-green-400/30 bg-green-900/20'
                          : 'border-red-400/30 bg-red-900/20'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-bold text-cyan-400 mb-1">Step {index + 1}</div>
                          <div className="text-white">{step.name}</div>
                          {step.description && (
                            <div className="text-gray-400 text-sm mt-1">{step.description}</div>
                          )}
                        </div>
                        <div className="ml-4">
                          {isCorrect ? (
                            <span className="text-green-400 text-2xl">✓</span>
                          ) : (
                            <span className="text-red-400 text-2xl">✗</span>
                          )}
                        </div>
                      </div>
                      
                      {!isCorrect && playerStep.name && (
                        <div className="mt-2 p-2 bg-gray-700/50 rounded-lg">
                          <div className="text-red-300 text-sm">Your answer:</div>
                          <div className="text-white">{playerStep.name}</div>
                          {playerStep.description && (
                            <div className="text-gray-400 text-sm mt-1">{playerStep.description}</div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* User Feedback Form */}
            <div className="bg-gray-700/50 rounded-xl p-6 border border-purple-400/30">
              <h3 className="text-xl font-bold text-purple-300 mb-4">Share Your Experience</h3>
              
              <div className="mb-4">
                <label className="block text-cyan-300 mb-2">Rate this challenge:</label>
                <div className="flex space-x-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      className={`text-3xl ${userRating >= star ? 'text-yellow-400' : 'text-gray-400'} transition-transform hover:scale-110`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
                <div className="text-gray-400 text-sm">
                  {userRating === 0 ? "Select your rating" :
                   userRating === 1 ? "Very difficult" :
                   userRating === 2 ? "Difficult" :
                   userRating === 3 ? "Moderate" :
                   userRating === 4 ? "Good" : "Excellent!"}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-cyan-300 mb-2">Your comments (optional):</label>
                <textarea
                  value={userReview}
                  onChange={(e) => setUserReview(e.target.value)}
                  placeholder="What did you think of this challenge? Any suggestions?"
                  className="w-full p-3 rounded-xl border border-cyan-400/30 bg-gray-800/50 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 min-h-[100px]"
                />
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={() => setShowReview(false)}
                  className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-xl transition-colors"
                >
                  Back to Summary
                </button>
                
                <button
                  onClick={handleSubmitReview}
                  disabled={isSubmitting || userRating === 0}
                  className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-400 hover:to-cyan-400 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes celebration-1 {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.7; }
          50% { transform: translateY(-30px) scale(2); opacity: 1; }
        }
        @keyframes celebration-2 {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.6; }
          50% { transform: translateY(-25px) translateX(15px) scale(1.8); opacity: 1; }
        }
        @keyframes celebration-3 {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.8; }
          50% { transform: translateY(-35px) scale(1.5); opacity: 0.3; }
        }
        @keyframes celebration-4 {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.5; }
          50% { transform: translateY(-20px) translateX(-10px) scale(2.2); opacity: 1; }
        }
        @keyframes score-glow {
          0%, 100% { 
            opacity: 0.4; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.8; 
            transform: scale(1.02);
          }
        }
        
        .animate-celebration-1 { animation: celebration-1 2s ease-in-out infinite; }
        .animate-celebration-2 { animation: celebration-2 2.5s ease-in-out infinite 0.5s; }
        .animate-celebration-3 { animation: celebration-3 3s ease-in-out infinite 1s; }
        .animate-celebration-4 { animation: celebration-4 1.8s ease-in-out infinite 1.5s; }
        .animate-score-glow { animation: score-glow 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

export default ScoreCard;