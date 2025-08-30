import React, { useEffect, useState, useRef } from "react";
import axiosClient from "../api/axiosClient";
import FarmGuide from "../components/FarmGuid";
import { useNavigate, useParams } from "react-router-dom";
import { clickSound, successSound } from "../utils/soundEffects";
import ScoreCard from "../components/ScoreCard";

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
        setMessage(`Preview the correct order for ${product.name}...`);

        // Create session on server
        const response = await axiosClient.post("/game/start", {
          difficulty,
          product: productId,
        });
        setSessionId(response.data.sessionId);
      } catch (err) {
        setError("Failed to start game session.");
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
        setMessage(`Now build ${productName}! Select steps in correct order.`);
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
      setMessage(`You already selected ${step}.`);
      return;
    }
    clickSound.play();
    setSteps((prev) => [...prev, step]);
    setMessage(`Added ${step}.`);
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
      `🎉 Game Over! You got ${score}/${correctOrder.length} correct in order.`
    );
  };

  if (loading) return <p className="p-6 font-kidsFont">Loading game...</p>;
  if (error) return <p className="p-6 text-red-600 font-kidsFont">{error}</p>;

  // ✅ Show ScoreCard after game ends
if (gameFinished && finalScore) {
  return (
    <div className="min-h-screen bg-softWhite p-6 font-kidsFont">
      <ScoreCard
        score={finalScore.score}
        total={correctOrder.length}
        difficulty={finalScore.difficulty}
        productId={finalScore.product}
        sessionId={finalScore.sessionId}
        timeToFinish={finalScore.timeToFinish}
      />
    </div>
  );
}

  return (
    <div className="min-h-screen bg-softWhite p-6 font-kidsFont">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-farmGreenDark">
          Building: {productName}
        </h2>
        <p className="text-xl font-bold text-red-600">⏳ {timeLeft}s</p>
      </div>

      <FarmGuide message={message} />

      {previewing ? (
        <div className="p-4 bg-yellow-100 rounded-lg shadow-md">
          <h3 className="font-semibold mb-2">Correct Order (Preview):</h3>
          <ol className="list-decimal list-inside">
            {correctOrder.map((step, idx) => (
              <li key={idx} className="text-farmGreenDark">
                {step}
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <>
          {ingredients.length > 0 && (
            <Section
              title="Ingredients"
              steps={ingredients}
              stepsChosen={steps}
              handleAddStep={handleAddStep}
              timeLeft={timeLeft}
            />
          )}

          {processes.length > 0 && (
            <Section
              title="Processes"
              steps={processes}
              stepsChosen={steps}
              handleAddStep={handleAddStep}
              timeLeft={timeLeft}
            />
          )}

          {equipment.length > 0 && (
            <Section
              title="Equipment"
              steps={equipment}
              stepsChosen={steps}
              handleAddStep={handleAddStep}
              timeLeft={timeLeft}
            />
          )}

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Chosen Steps:</h3>
            <ul className="list-disc list-inside">
              {steps.map((step, idx) => (
                <li key={idx} className="text-farmGreenDark">
                  {step}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={evaluateGame}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          >
            Finish Early
          </button>
        </>
      )}
    </div>
  );
}

// Small reusable component for sections
const Section = ({ title, steps, stepsChosen, handleAddStep, timeLeft }) => (
  <div className="mb-6">
    <h3 className="font-semibold mb-2">{title}:</h3>
    <div className="flex flex-wrap gap-3">
      {steps.map((step) => (
        <button
          key={step}
          onClick={() => handleAddStep(step)}
          disabled={stepsChosen.includes(step) || timeLeft <= 0}
          className={`px-4 py-2 rounded-lg shadow-md transition ${
            stepsChosen.includes(step) || timeLeft <= 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-farmGreen hover:bg-farmGreenDark text-softWhite"
          }`}
        >
          {step}
        </button>
      ))}
    </div>
  </div>
);

export default GamePlay;
