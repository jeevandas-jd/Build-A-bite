import React, { useState } from "react";
import { playClickSound } from "../utils/debugger";

const SarcasticGame = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    playClickSound();
    setCount(count + 1);
  };

  const getMessage = () => {
    if (count === 0) return "🙄 Oh great, another button. Please don’t click it.";
    if (count < 3) return "😑 Really? You clicked it. Wow. Groundbreaking.";
    if (count < 5) return "😏 Oh, so you think you’re funny, huh?";
    if (count < 8) return "🤦 Stop. This button isn’t a fidget toy.";
    if (count < 12) return "🥱 Congrats, you officially have nothing better to do.";
    return "🎉 Fine, you win. The world record for pointless clicks is yours.";
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-6">The Sarcastic Button Game</h1>
      <button
        onClick={handleClick}
        className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-red-500 hover:to-pink-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
      >
        Click Me 🙃
      </button>
      <p className="mt-6 text-lg text-gray-300">{getMessage()}</p>
      <p className="mt-2 text-sm text-gray-500">Clicks: {count}</p>
    </div>
  );
};

export default SarcasticGame;
