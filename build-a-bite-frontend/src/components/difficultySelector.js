import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { playClickSound,playClickSound2} from "../utils/soundEffects";
const DifficultySelector = ({ productId, onClose }) => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedDisplayLevel, setSelectedDisplayLevel] = useState(null);
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();

  // Map display names to API values
  const LEVEL_MAPPING = {
    "Flavor Philosopher": "expert",
    "Elite Class": "intermediate", 
    "Recall Rush": "beginner",
  };

  // Hardcoded instructions for each level (using display names as keys)
  const LEVEL_INSTRUCTIONS = {
    "Flavor Philosopher": [
      "🎮 Flavor Philosopher – Let’s Play!",
      "⏳ Preview Time: You’ll get 15 seconds to review the correct order.",
      "⚡ Mission Time: You have 95 seconds to complete the task.",
      "🥗 Your Goal: Arrange the ingredients + process + equipment in the correct sequence.",
      "✅ Final Step: Click the 'Complete Mission' button to submit.",
      "🧠 Keep your memory power turned on and be quick – the faster you finish, the more points you score!",
      "✨ ALL THE BEST! ✨",
    ],
    "Elite Class": [
      "🎮 Elite Class – Let’s Play!",
      "⏳ Preview Time: You'll get 10 seconds to check the correct order.",
      "⚡ Mission Time: You have 70 seconds to complete the task.",
      "🥗 Your Goal: Select the ingredients + process in the right sequence.",
      "✅ Final Step: Click the 'Complete Mission' button to submit.",
      "🧠 Keep your memory power turned on and be quick – the faster you finish, the more points you score!",
      "✨ ALL THE BEST! ✨",
    ],
    "Recall Rush": [
      "🎮 Recall Rush – Let's Play!",
      "🎯 Game's Objective: To correctly identify 5 ingredients from a larger list.",
      "⏳ Preview Time: You'll get 5 seconds initially for memorizing the correct ingredients.",
      "⚡ Mission Time: You have 45 seconds to complete the task.",
      "🥗 Your Goal: Choose 5 correct ingredients from a total of 10 options.",
      "✅ Final Step: Click the 'Complete Mission' button to lock your answer.",
      "🧠 Keep your memory power turned on and be quick – the faster you finish, the more points you score!",
      "✨ ALL THE BEST, CHAMP! ✨",
    ],
  };

  const handleSelect = (displayLevel) => {
    setSelectedLevel(LEVEL_MAPPING[displayLevel]); // Store API value for navigation
    setSelectedDisplayLevel(displayLevel); // Store display name for UI
  };

  const handleStartGame = () => {
    navigate(`/game/${productId}/${selectedLevel}`);
  };

  const handleClose = () => {
    playClickSound2();
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleBack = () => {
    setSelectedLevel(null);
    setSelectedDisplayLevel(null);
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-50 transition-opacity duration-300 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      {/* Enhanced futuristic modal card with depth */}
<div className="relative modal-box rounded-2xl bg-gray-900/95 border border-cyan-400/40 shadow-2xl animate-fade-in overflow-hidden">
        {/* Enhanced glow border effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20 opacity-60 blur-xl animate-pulse-slow"></div>
        
        {/* Subtle grid pattern for depth */}
        <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>

        <div className="relative flex flex-col gap-6">
          {/* Enhanced Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 animate-title-glow">
              Select Difficulty
            </h2>
            <p className="text-sm text-gray-400 mt-1">Choose your challenge level</p>
          </div>

          {/* Buttons if no difficulty selected */}
          {!selectedLevel && (
            <div className="flex flex-col gap-4">
              <button
              onClick={() => {playClickSound(); handleSelect("Recall Rush")}}
                className="group relative w-full py-3 px-4 rounded-xl font-bold text-cyan-200 border border-cyan-400/40 bg-gray-800/60 hover:bg-cyan-400/20 hover:text-cyan-100 transition-all duration-300 shadow-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center">
                  <span className="mr-2">🟢</span> Recall Rush 
                  <span className="text-xs ml-2 opacity-70 group-hover:opacity-100">(Ingredients only)</span>
                </span>
              </button>

              <button
                onClick={() => {playClickSound(); handleSelect("Elite Class")}}
                className="group relative w-full py-3 px-4 rounded-xl font-bold text-yellow-200 border border-yellow-400/40 bg-gray-800/60 hover:bg-yellow-400/20 hover:text-yellow-100 transition-all duration-300 shadow-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center">
                  <span className="mr-2">🟡</span> Elite Class
                  <span className="text-xs ml-2 opacity-70 group-hover:opacity-100">(Ingredients + Process)</span>
                </span>
              </button>

              <button
                onClick={() => {playClickSound(); handleSelect("Flavor Philosopher")}}
                className="group relative w-full py-3 px-4 rounded-xl font-bold text-red-200 border border-red-400/40 bg-gray-800/60 hover:bg-red-400/20 hover:text-red-100 transition-all duration-300 shadow-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center">
                  <span className="mr-2">🔴</span>Flavor Philosopher
                  <span className="text-xs ml-2 opacity-70 group-hover:opacity-100">(Ingredients + Process + Equipment)</span>
                </span>
              </button>
            </div>
          )}

          {/* Instructions if difficulty selected */}
          {selectedLevel && (
            <div className="text-center">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handleBack}
                  className="flex items-center text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  ← Back
                </button>
                <h3 className="font-semibold text-xl text-cyan-300">
                  {selectedDisplayLevel}
                </h3>
                <div className="w-14"></div> {/* Spacer for balance */}
              </div>

              <div className="bg-gray-800/70 rounded-2xl shadow-inner p-6 text-left max-h-72 overflow-y-auto custom-scrollbar">
                <ul className="space-y-3 text-gray-200">
                  {(LEVEL_INSTRUCTIONS[selectedDisplayLevel] || []).map(
                    (line, index) => (
                      <li
                        key={index}
                        className="flex items-start space-x-2 leading-relaxed animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <span className="text-lg mt-0.5 flex-shrink-0">👉</span>
                        <span>{line}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>

              <button
                onClick={handleStartGame}
                className="group relative mt-6 w-full py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center">
                  <span className="mr-2 transform group-hover:scale-110 transition-transform">🚀</span>
                  Start Mission
                </span>
              </button>
            </div>
          )}

          {/* Enhanced Close button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/60 text-gray-400 hover:text-white hover:bg-gray-700/60 transition-all duration-200"
            aria-label="Close"
          >
            ✖
          </button>
        </div>
      </div>

      {/* Animations */}
     <style>{`
  @keyframes fade-in { 
    from { opacity: 0; transform: scale(0.95) translateY(10px); } 
    to { opacity: 1; transform: scale(1) translateY(0); } 
  }
  
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes pulse-slow {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(1.05); }
  }
  
  @keyframes title-glow {
    0%, 100% { 
      text-shadow: 0 0 15px rgba(34, 211, 238, 0.5), 0 0 30px rgba(147, 51, 234, 0.4);
    }
    50% { 
      text-shadow: 0 0 25px rgba(34, 211, 238, 0.8), 0 0 45px rgba(147, 51, 234, 0.6);
    }
  }
  
  @keyframes box-glow {
    0%, 100% { 
      box-shadow: 0 0 20px rgba(34, 211, 238, 0.3),
                  0 0 40px rgba(147, 51, 234, 0.2);
    }
    50% { 
      box-shadow: 0 0 30px rgba(34, 211, 238, 0.5),
                  0 0 60px rgba(147, 51, 234, 0.3);
    }
  }
  
  .animate-fade-in { 
    animation: fade-in 0.4s ease-out forwards; 
  }
  
  .animate-fade-in-up { 
    animation: fade-in-up 0.5s ease-out forwards; 
    opacity: 0; 
  }
  
  .animate-pulse-slow { 
    animation: pulse-slow 4s ease-in-out infinite; 
  }
  
  .animate-title-glow { 
    animation: title-glow 3s ease-in-out infinite; 
  }
  
  .animate-box-glow {
    animation: box-glow 4s ease-in-out infinite;
  }
  
  .bg-grid-pattern {
    background-image: 
      linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
    background-size: 25px 25px;
  }
  
  /* Larger box sizes */
  .modal-box {
    width: 100vw;
    max-width: 500px;
    min-height: 400px;
    padding: 2.5rem;
  }
  
  .content-box {
    padding: 2rem;
    margin: 1.5rem 0;
    border-radius: 1.5rem;
  }
  
  .button-large {
    padding: 1rem 2rem;
    font-size: 1.1rem;
    border-radius: 1rem;
  }
  
  .text-large {
    font-size: 1.25rem;
    line-height: 1.6;
  }
  
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 12px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, rgba(34, 211, 238, 0.5), rgba(147, 51, 234, 0.5));
    border-radius: 12px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(45deg, rgba(34, 211, 238, 0.7), rgba(147, 51, 234, 0.7));
  }
  
  /* Enhanced responsive design */
  @media (min-width: 768px) {
    .modal-box {
      width: 85vw;
      max-width: 600px; 
      min-height: 500px;
      padding: 3rem;
    }
    
    .content-box {
      padding: 2.5rem;
      margin: 2rem 0;
    }
    
    .text-large {
      font-size: 1.35rem;
    }
  }
  
  @media (min-width: 1024px) {
    .modal-box {
      max-width: 700px;
      min-height: 550px;
      padding: 3.5rem;
    }
  }
`}</style>
    </div>
  );
};

export default DifficultySelector;