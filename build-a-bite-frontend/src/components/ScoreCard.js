import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { playClickSound2,playScoreCardSound} from "../utils/soundEffects";
function ScoreCard({ score, total, difficulty, productId, sessionId, timeToFinish, accuracy, correctOrder, playerOrder }) {
  const navigate = useNavigate();
  const [showReview, setShowReview] = useState(false);
  const [userReview, setUserReview] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("summary"); // "summary" or "review"

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
    playScoreCardSound();
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

  const renderStars = (count) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-xl md:text-2xl ${i < count ? 'text-yellow-400' : 'text-gray-400'}`}
      >
        ⭐
      </span>
    ));
  };

  // Mobile-friendly performance message
  const getPerformanceMessage = () => {
    if (stars === 5) return "Outstanding! Perfect execution!";
    if (stars === 4) return "Great job! Almost perfect!";
    if (stars === 3) return "Good effort! Room for improvement.";
    if (stars === 2) return "Fair attempt. Keep practicing!";
    return "Beginner level. Try again!";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-4 md:p-6 font-mono relative overflow-hidden">
      {/* Mobile-friendly celebration effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-3 h-3 md:w-4 md:h-4 bg-cyan-400 rounded-full animate-celebration-1"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 md:w-3 md:h-3 bg-purple-400 rounded-full animate-celebration-2"></div>
        <div className="absolute bottom-1/4 left-1/3 w-4 h-4 md:w-5 md:h-5 bg-pink-400 rounded-full animate-celebration-3"></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 md:w-2 md:h-2 bg-green-400 rounded-full animate-celebration-4"></div>
      </div>

      {/* Mobile Navigation Tabs */}
      <div className="flex justify-center mb-4 md:mb-6">
        <div className="bg-gray-800/70 backdrop-blur-md rounded-xl p-1 border border-cyan-400/30">
          <button
            onClick={() => { setActiveTab("summary"); playClickSound2(); }}
            className={`px-4 py-2 rounded-lg text-sm md:text-base transition-colors ${
              activeTab === "summary" 
                ? "bg-cyan-500 text-white" 
                : "bg-transparent text-gray-300 hover:text-white"
            }`}
          >
            Summary
          </button>
          <button
            onClick={() => {setActiveTab("review"); playClickSound2(); }}
            className={`px-4 py-2 rounded-lg text-sm md:text-base transition-colors ${
              activeTab === "review" 
                ? "bg-purple-500 text-white" 
                : "bg-transparent text-gray-300 hover:text-white"
            }`}
          >
            Review
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto bg-gray-800/80 backdrop-blur-xl border border-cyan-400/40 rounded-3xl p-4 md:p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-purple-400/10 to-pink-400/10 animate-score-glow"></div>
        
        {activeTab === "summary" ? (
          // Score Summary View - Mobile Optimized
          <div className="relative z-10 text-center">
            <div className="text-4xl md:text-6xl mb-3 md:mb-4 animate-bounce">🏆</div>
            <h2 className="text-xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-3 md:mb-4">
              MISSION ANALYSIS
            </h2>
            
            {/* Star Rating */}
            <div className="mb-4 md:mb-6">
              <div className="text-yellow-400 text-sm md:text-lg mb-1 md:mb-2">PERFORMANCE RATING</div>
              <div className="flex justify-center mb-1 md:mb-2">
                {renderStars(stars)}
              </div>
              <div className="text-gray-300 text-xs md:text-sm">
                {getPerformanceMessage()}
              </div>
            </div>
            
            {/* Stats Grid - Mobile Optimized */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="bg-gray-700/50 rounded-lg md:rounded-xl p-2 md:p-3 border border-cyan-400/30">
                <div className="text-cyan-400 text-xs md:text-sm mb-1">ACCURACY</div>
                <div className="text-xl md:text-3xl font-bold text-white">{accuracy}%</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg md:rounded-xl p-2 md:p-3 border border-purple-400/30">
                <div className="text-purple-400 text-xs md:text-sm mb-1">SCORE</div>
                <div className="text-xl md:text-3xl font-bold text-white">{score}/{total}</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg md:rounded-xl p-2 md:p-3 border border-pink-400/30">
                <div className="text-pink-400 text-xs md:text-sm mb-1">DIFFICULTY</div>
                <div className="text-base md:text-xl font-bold text-white uppercase">{difficulty}</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg md:rounded-xl p-2 md:p-3 border border-green-400/30">
                <div className="text-green-400 text-xs md:text-sm mb-1">TIME</div>
                <div className="text-base md:text-xl font-bold text-white">{timeToFinish}s</div>
              </div>
            </div>
            
            {/* Action Buttons - Stacked on mobile */}
            <div className="flex flex-col md:flex-row justify-center gap-2 md:gap-4">
              <button
                onClick={() => {  navigate("/leaderboard"); playClickSound2(); }}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-xl transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
              >
                <span className="mr-1 md:mr-2">🏆</span>
                LEADERBOARD
              </button>
              
              <button
                onClick={() => {  setActiveTab("review"); playClickSound2(); }}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-xl transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
              >
                <span className="mr-1 md:mr-2">📝</span>
                REVIEW ANSWERS
              </button>
            </div>
          </div>
        ) : (
          // Review View - Mobile Optimized
          <div className="relative z-10">
            <h2 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 mb-4 md:mb-6 text-center">
              PERFORMANCE REVIEW
            </h2>
            
            {/* Step-by-step comparison */}
            <div className="mb-4 md:mb-6">
              <h3 className="text-lg md:text-xl font-bold text-cyan-300 mb-3 md:mb-4">Step Analysis</h3>
              <div className="space-y-2 max-h-64 md:max-h-96 overflow-y-auto">
                {correctOrder.map((step, index) => {
                  const playerStep = playerOrder[index] || { name: "Not attempted" };
                  const isCorrect = playerStep.name === step.name;
                  
                  return (
                    <div
                      key={index}
                      className={`p-3 md:p-4 rounded-lg md:rounded-xl border ${
                        isCorrect
                          ? 'border-green-400/30 bg-green-900/20'
                          : 'border-red-400/30 bg-red-900/20'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-bold text-cyan-400 text-sm md:text-base mb-1">Step {index + 1}</div>
                          <div className="text-white text-sm md:text-base">{step.name}</div>
                          {step.description && (
                            <div className="text-gray-400 text-xs md:text-sm mt-1">{step.description}</div>
                          )}
                        </div>
                        <div className="ml-2 md:ml-4">
                          {isCorrect ? (
                            <span className="text-green-400 text-xl md:text-2xl">✓</span>
                          ) : (
                            <span className="text-red-400 text-xl md:text-2xl">✗</span>
                          )}
                        </div>
                      </div>
                      
                      {!isCorrect && playerStep.name && (
                        <div className="mt-2 p-2 bg-gray-700/50 rounded">
                          <div className="text-red-300 text-xs md:text-sm">Your answer:</div>
                          <div className="text-white text-sm md:text-base">{playerStep.name}</div>
                          {playerStep.description && (
                            <div className="text-gray-400 text-xs md:text-sm mt-1">{playerStep.description}</div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* User Feedback Form */}
            <div className="bg-gray-700/50 rounded-lg md:rounded-xl p-4 md:p-6 border border-purple-400/30">
              <h3 className="text-lg md:text-xl font-bold text-purple-300 mb-3 md:mb-4">Share Feedback</h3>
              
              <div className="mb-3 md:mb-4">
                <label className="block text-cyan-300 text-sm md:text-base mb-1 md:mb-2">Rate this challenge:</label>
                <div className="flex space-x-1 mb-1 md:mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      className={`text-2xl md:text-3xl ${userRating >= star ? 'text-yellow-400' : 'text-gray-400'} transition-transform hover:scale-110`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
                <div className="text-gray-400 text-xs md:text-sm">
                  {userRating === 0 ? "Select your rating" :
                   userRating === 1 ? "Very difficult" :
                   userRating === 2 ? "Difficult" :
                   userRating === 3 ? "Moderate" :
                   userRating === 4 ? "Good" : "Excellent!"}
                </div>
              </div>
              
              <div className="mb-3 md:mb-4">
                <label className="block text-cyan-300 text-sm md:text-base mb-1 md:mb-2">Comments (optional):</label>
                <textarea
                  value={userReview}
                  onChange={(e) => setUserReview(e.target.value)}
                  placeholder="What did you think of this challenge?"
                  className="w-full p-2 md:p-3 rounded-lg md:rounded-xl border border-cyan-400/30 bg-gray-800/50 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 min-h-[80px] md:min-h-[100px] text-sm md:text-base"
                />
              </div>
              
              <div className="flex flex-col md:flex-row justify-between gap-2 md:gap-0">
                <button
                  onClick={() => setActiveTab("summary")}
                  className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 md:px-6 rounded-xl transition-colors text-sm md:text-base order-2 md:order-1"
                >
                  Back
                </button>
                
                <button
                  onClick={handleSubmitReview}
                  disabled={isSubmitting || userRating === 0}
                  className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-400 hover:to-cyan-400 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 md:px-6 rounded-xl transition-all duration-300 transform hover:scale-105 text-sm md:text-base order-1 md:order-2 mb-2 md:mb-0"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes celebration-1 {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.7; }
          50% { transform: translateY(-20px) scale(1.5); opacity: 1; }
        }
        @keyframes celebration-2 {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.6; }
          50% { transform: translateY(-15px) translateX(10px) scale(1.3); opacity: 1; }
        }
        @keyframes celebration-3 {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.8; }
          50% { transform: translateY(-25px) scale(1.2); opacity: 0.3; }
        }
        @keyframes celebration-4 {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.5; }
          50% { transform: translateY(-15px) translateX(-8px) scale(1.5); opacity: 1; }
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