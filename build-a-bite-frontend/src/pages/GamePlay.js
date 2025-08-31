import React, { useEffect, useState, useRef } from "react";
import axiosClient from "../api/axiosClient";
import FarmGuide from "../components/FarmGuid";
import ScoreCard from "../components/ScoreCard";
import { useNavigate, useParams } from "react-router-dom";
import { clickSound, successSound } from "../utils/soundEffects";

function GamePlay() {
  const navigate = useNavigate();
  const { productId, difficulty } = useParams();

  const [sessionId, setSessionId] = useState(null);
  const [steps, setSteps] = useState([]);
  const [correctOrder, setCorrectOrder] = useState([]);
  const [productName, setProductName] = useState("");
  const [message, setMessage] = useState("Get ready! Previewing steps...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [previewing, setPreviewing] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(null);

  const timerId = useRef(null);

  // Sectioned available steps
  const [ingredients, setIngredients] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [equipment, setEquipment] = useState([]);

  // Difficulty settings
  const previewDurations = {
    beginner: 5,
    intermediate: 10,
    expert: 15,
  };
  const gameDurations = {
    beginner: 45,
    intermediate: 70,
    expert: 95,
  };

  // Fetch product + setup game
  useEffect(() => {
    async function startSession() {
      try {
        setLoading(true);
        const prodRes = await axiosClient.get(`/products/${productId}`);
        const product = prodRes.data;
        setProductName(product.name);

        // Server-provided correct order
        setCorrectOrder(product.correctOrder || []);

        // Section pools based on difficulty
        if (difficulty === "beginner") {
          setIngredients(product.availableIngredients || []);
          setProcesses([]);
          setEquipment([]);
          setCorrectOrder(product.availableIngredients || []);
        } else if (difficulty === "intermediate") {
          setIngredients(product.availableIngredients || []);
          setProcesses(product.availableProcesses || []);
          const correct = product.availableIngredients.concat(
            product.availableProcesses
          );
          setCorrectOrder(correct);
          setEquipment([]);
        } else {
          setIngredients(product.availableIngredients || []);
          setProcesses(product.availableProcesses || []);
          setEquipment(product.availableEquipment || []);
          const correct = product.availableIngredients.concat(
            product.availableProcesses,
            product.availableEquipment
          );
          setCorrectOrder(correct);
        }

        // Start preview phase
        setPreviewing(true);
        setTimeLeft(previewDurations[difficulty]);
        setMessage(`Preview the correct synthesis sequence for ${product.name}...`);

        // Create session on server
        const response = await axiosClient.post("/game/start", {
          difficulty,
          product: productId,
        });
        setSessionId(response.data.sessionId);
      } catch (err) {
        setError("Failed to initialize game protocol.");
      } finally {
        setLoading(false);
      }
    }
    startSession();
  }, [productId, difficulty]);

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0) {
      clearInterval(timerId.current);

      if (previewing) {
        // End preview → shuffle categories and start game
        setPreviewing(false);
        setSteps([]);

        setIngredients((prev) => [...prev].sort(() => Math.random() - 0.5));
        setProcesses((prev) => [...prev].sort(() => Math.random() - 0.5));
        setEquipment((prev) => [...prev].sort(() => Math.random() - 0.5));

        setTimeLeft(gameDurations[difficulty]);
        setMessage(`Initialize synthesis of ${productName}! Execute commands in correct sequence.`);
      } else {
        evaluateGame();
      }
      return;
    }

    timerId.current = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timerId.current);
  }, [timeLeft, previewing]);

  // Step selection
  const handleAddStep = (step) => {
    if (steps.includes(step)) {
      setMessage(`Command already executed: ${step}`);
      return;
    }
    clickSound.play();
    setSteps((prev) => [...prev, step]);
    setMessage(`Executed: ${step}`);
  };

  // Evaluate game and show ScoreCard
  const evaluateGame = async () => {
    clearInterval(timerId.current);

    let score = 0;
    const minLen = Math.min(steps.length, correctOrder.length);
    for (let i = 0; i < minLen; i++) {
      if (steps[i] === correctOrder[i]) score++;
    }

    const accuracy = Math.round((score / correctOrder.length) * 100);
    const timeTaken = gameDurations[difficulty] - timeLeft;

    const result = {
      score,
      accuracy,
      difficulty,
      product: productId,
      sessionId,
      timeToFinish: timeTaken,
    };

    setFinalScore(result);
    setGameFinished(true);
    console.log(`score data = ${JSON.stringify(result)}`);
    try {
      await axiosClient.post("/leaderboard", result);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }

    successSound.play();
    setMessage(
      `🎉 Mission Complete! Synthesis accuracy: ${score}/${correctOrder.length}`
    );
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-spin">⚙️</div>
        <p className="text-cyan-400 font-mono text-xl">INITIALIZING GAME ...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-purple-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 text-red-400">⚠️</div>
        <p className="text-red-400 font-mono text-xl">{error}</p>
      </div>
    </div>
  );

  // Show ScoreCard after game ends
  if (gameFinished && finalScore) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-6">
        <ScoreCard
          score={finalScore.score}
          total={correctOrder.length}
          difficulty={finalScore.difficulty}
          productId={finalScore.product}
          sessionId={finalScore.sessionId}
          timeToFinish={finalScore.timeToFinish}
          accuracy={finalScore.accuracy}
        />
      </div>
    );
  }

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

      <div className="relative z-10">
        {/* Header with HUD styling */}
        <div className="flex justify-between items-center mb-6 bg-gray-800/60 backdrop-blur-xl border border-cyan-400/30 rounded-2xl p-4">
          <div>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-1">
              TARGET: {productName}
            </h2>
            <div className="text-sm text-gray-400 uppercase tracking-wider">Mission Active</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400 mb-1">TIME REMAINING</div>
            <div className={`text-3xl font-bold font-mono ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}>
              ⏱️ {timeLeft}s
            </div>
          </div>
        </div>

        {/* Farm Guide with AI styling */}
        <FarmGuide message={message} />

        {previewing ? (
          <div className="bg-gray-800/70 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 animate-preview-glow"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl animate-spin-slow">📋</span>
                <h3 className="text-xl font-bold text-yellow-400 uppercase tracking-wider">order (Preview)</h3>
              </div>
              <div className="grid gap-3">
                {correctOrder.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-gray-700/50 rounded-lg p-3 border border-yellow-400/20">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center font-bold text-gray-900">
                      {idx + 1}
                    </div>
                    <div className="text-white font-semibold">{step}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {ingredients.length > 0 && (
              <Section
                title="Ingredients"
                steps={ingredients}
                stepsChosen={steps}
                handleAddStep={handleAddStep}
                timeLeft={timeLeft}
                color="cyan"
                icon="🧬"
              />
            )}

            {processes.length > 0 && (
              <Section
                title="Processes"
                steps={processes}
                stepsChosen={steps}
                handleAddStep={handleAddStep}
                timeLeft={timeLeft}
                color="purple"
                icon="⚙️"
              />
            )}

            {equipment.length > 0 && (
              <Section
                title="Equipments"
                steps={equipment}
                stepsChosen={steps}
                handleAddStep={handleAddStep}
                timeLeft={timeLeft}
                color="pink"
                icon="🔬"
              />
            )}

            {/* Execution sequence display */}
            <div className="bg-gray-800/70 backdrop-blur-xl border border-green-400/40 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-cyan-400/10 animate-sequence-glow"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl animate-pulse">📊</span>
                  <h3 className="text-xl font-bold text-green-400 uppercase tracking-wider">Execution Sequence</h3>
                </div>
                <div className="grid gap-2">
                  {steps.length === 0 ? (
                    <div className="text-gray-400 italic">No commands executed yet...</div>
                  ) : (
                    steps.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-gray-700/50 rounded-lg p-3 border border-green-400/20 animate-step-appear">
                        <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full flex items-center justify-center font-bold text-gray-900 text-sm">
                          {idx + 1}
                        </div>
                        <div className="text-white font-semibold">{step}</div>
                        <div className="ml-auto text-green-400">✓</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={evaluateGame}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-red-400/30 active:scale-95 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20 blur-lg"></div>
                <div className="relative flex items-center gap-2">
                  <span>🏁</span>
                  <span>COMPLETE MISSION</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced futuristic animations */}
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
        @keyframes preview-glow {
          0%, 100% { 
            opacity: 0.4; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.8; 
            transform: scale(1.02);
          }
        }
        @keyframes sequence-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes step-appear {
          0% { 
            opacity: 0; 
            transform: translateX(-20px) scale(0.8); 
          }
          100% { 
            opacity: 1; 
            transform: translateX(0) scale(1); 
          }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .animate-scan-top { animation: scan-top 8s linear infinite; }
        .animate-scan-bottom { animation: scan-bottom 12s linear infinite 2s; }
        .animate-float-1 { animation: float-1 4s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 5s ease-in-out infinite 1s; }
        .animate-float-3 { animation: float-3 6s ease-in-out infinite 2s; }
        .animate-preview-glow { animation: preview-glow 3s ease-in-out infinite; }
        .animate-sequence-glow { animation: sequence-glow 4s ease-in-out infinite; }
        .animate-step-appear { animation: step-appear 0.5s ease-out forwards; }
        .animate-spin-slow { animation: spin-slow 10s linear infinite; }
      `}</style>
    </div>
  );
}

// Enhanced futuristic Section component
const Section = ({ title, steps, stepsChosen, handleAddStep, timeLeft, color, icon }) => {
  const colorClasses = {
    cyan: {
      border: 'border-cyan-400/40',
      bg: 'from-cyan-400/10 to-cyan-400/5',
      text: 'text-cyan-400',
      button: 'from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500',
      buttonDisabled: 'bg-gray-600/50 border-gray-500/30'
    },
    purple: {
      border: 'border-purple-400/40',
      bg: 'from-purple-400/10 to-purple-400/5',
      text: 'text-purple-400',
      button: 'from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500',
      buttonDisabled: 'bg-gray-600/50 border-gray-500/30'
    },
    pink: {
      border: 'border-pink-400/40',
      bg: 'from-pink-400/10 to-pink-400/5',
      text: 'text-pink-400',
      button: 'from-pink-500 to-pink-600 hover:from-pink-400 hover:to-pink-500',
      buttonDisabled: 'bg-gray-600/50 border-gray-500/30'
    }
  };

  const theme = colorClasses[color];

  return (
    <div className={`bg-gray-800/60 backdrop-blur-xl border ${theme.border} rounded-2xl p-6 mb-6 relative overflow-hidden`}>
      <div className={`absolute inset-0 bg-gradient-to-r ${theme.bg} animate-section-glow`}></div>
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl animate-bounce">{icon}</span>
          <h3 className={`text-xl font-bold ${theme.text} uppercase tracking-wider`}>{title}</h3>
          <div className="ml-auto text-xs text-gray-400 uppercase">
            [{steps.length} Available]
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {steps.map((step, index) => {
            const isDisabled = stepsChosen.includes(step) || timeLeft <= 0;
            return (
              <button
                key={step}
                onClick={() => handleAddStep(step)}
                disabled={isDisabled}
                className={`p-3 rounded-xl shadow-lg transition-all duration-300 transform border font-bold text-sm relative overflow-hidden ${
                  isDisabled
                    ? `${theme.buttonDisabled} text-gray-400 cursor-not-allowed`
                    : `bg-gradient-to-r ${theme.button} text-white hover:scale-105 border-transparent hover:shadow-lg`
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {!isDisabled && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${theme.bg} blur-lg`}></div>
                )}
                <div className="relative flex items-center justify-center">
                  {isDisabled && <span className="mr-1">✓</span>}
                  <span>{step}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      <style>{`
        @keyframes section-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .animate-section-glow { animation: section-glow 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default GamePlay;