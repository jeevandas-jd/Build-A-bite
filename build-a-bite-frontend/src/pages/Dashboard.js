import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import FarmGuide from "../components/FarmGuid";
import { useNavigate } from "react-router-dom";
import DifficultySelector from "../components/difficultySelector";
import { playClickSound2,playClickSound} from "../utils/soundEffects";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch User Info
    axiosClient
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));

    // Fetch Products List
    axiosClient
      .get("/products")
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]));
  }, []);

  const handleStartGame = (product) => {
    playClickSound2();
    setSelectedProduct(product);
  };

  const handleDifficultySelect = (difficulty) => {
    if (!selectedProduct) return;
    navigate(`/game/${encodeURIComponent(selectedProduct._id)}/${difficulty}`);
    setSelectedProduct(null); // close modal
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-6 font-mono relative overflow-hidden">
      {/* Futuristic background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        ></div>

        {/* Floating data streams */}
        <div className="absolute top-20 left-10 w-40 h-1 bg-gradient-to-r from-cyan-400/50 to-transparent animate-data-stream-1"></div>
        <div className="absolute top-40 right-20 w-32 h-1 bg-gradient-to-l from-purple-400/50 to-transparent animate-data-stream-2"></div>
        <div className="absolute bottom-32 left-1/4 w-48 h-1 bg-gradient-to-r from-pink-400/50 to-transparent animate-data-stream-3"></div>

        {/* Orbital elements */}
        <div className="absolute top-16 right-16 w-20 h-20 border border-cyan-400/30 rounded-full animate-orbit-1"></div>
        <div className="absolute bottom-20 left-20 w-16 h-16 border border-purple-400/30 rounded-full animate-orbit-2"></div>

        {/* Pulsing dots */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-cyan-400 rounded-full animate-pulse-dot-1"></div>
        <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-purple-400 rounded-full animate-pulse-dot-2"></div>
        <div className="absolute top-2/3 left-1/5 w-1 h-1 bg-pink-400 rounded-full animate-pulse-dot-3"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-2 animate-title-glow">
            
          </h2>
          <div className="text-lg text-gray-300 font-semibold">
            Welcome back,{" "}
            <span className="text-cyan-400 animate-pulse">
              {user ? user.name : "friend"}
            </span>
            ! 🚀
          </div>
        </div>

        {/* Farm Guide styled as briefing */}
=
              <FarmGuide   message={`Hello ${user?.name || "friend"},\n  choose what you want, lets Build A Bite`}
 />


        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
          {products.map((product, index) => (
            <div
              key={product._id || product.name}
              className="rounded-2xl border border-cyan-400/30 p-6 shadow-2xl bg-gray-800/70 backdrop-blur-xl flex flex-col items-center transition-all duration-300 cursor-pointer hover:scale-105 hover:border-cyan-400/60 relative overflow-hidden group"
              style={{
                boxShadow:
                  "0 0 30px rgba(0, 255, 255, 0.1), inset 0 0 30px rgba(0, 0, 0, 0.3)",
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20 animate-border-flow opacity-0 group-hover:opacity-100"></div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="relative mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-full border-2 border-cyan-400/50 shadow-lg transition-all duration-300 group-hover:border-cyan-400 group-hover:shadow-cyan-400/30"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4 text-center">
                  {product.name}
                </h3>

                <button
                  onClick={() => handleStartGame(product)}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white py-3 px-6 rounded-xl shadow-lg font-bold transition-all duration-300 transform hover:scale-110 hover:shadow-cyan-400/30 active:scale-95 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 blur-lg"></div>
                  <div className="relative flex items-center gap-2">
                    <span>⚡</span>
                    <span>START GAME</span>
                  </div>
                </button>
              </div>

              <div className="absolute top-3 right-3 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* DifficultySelector modal */}
        {selectedProduct && (
          <DifficultySelector
            productId={selectedProduct._id}
            onSelectDifficulty={handleDifficultySelect}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes data-stream-1 {0%{transform:translateX(-100%);opacity:0;}50%{opacity:1;}100%{transform:translateX(300%);opacity:0;}}
        @keyframes data-stream-2 {0%{transform:translateX(100%);opacity:0;}50%{opacity:1;}100%{transform:translateX(-300%);opacity:0;}}
        @keyframes data-stream-3 {0%{transform:translateX(-100%);opacity:0;}50%{opacity:1;}100%{transform:translateX(400%);opacity:0;}}
        @keyframes orbit-1 {0%{transform:rotate(0deg) translateX(10px) rotate(0deg);opacity:0.3;}50%{opacity:0.8;}100%{transform:rotate(360deg) translateX(10px) rotate(-360deg);opacity:0.3;}}
        @keyframes orbit-2 {0%{transform:rotate(360deg) translateX(8px) rotate(-360deg);opacity:0.4;}50%{opacity:0.9;}100%{transform:rotate(0deg) translateX(8px) rotate(0deg);opacity:0.4;}}
        @keyframes pulse-dot-1 {0%,100%{transform:scale(1);opacity:0.7;}50%{transform:scale(2);opacity:1;}}
        @keyframes pulse-dot-2 {0%,100%{transform:scale(1);opacity:0.6;}50%{transform:scale(1.8);opacity:1;}}
        @keyframes pulse-dot-3 {0%,100%{transform:scale(1);opacity:0.8;}50%{transform:scale(2.5);opacity:0.3;}}
        @keyframes title-glow {0%,100%{filter:brightness(1) hue-rotate(0deg);text-shadow:0 0 20px rgba(0,255,255,0.3);}50%{filter:brightness(1.2) hue-rotate(30deg);text-shadow:0 0 30px rgba(147,51,234,0.5);}}
        @keyframes guide-glow {0%,100%{opacity:0.3;}50%{opacity:0.8;}}
        @keyframes border-flow {0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}
        .animate-data-stream-1{animation:data-stream-1 8s linear infinite;}
        .animate-data-stream-2{animation:data-stream-2 10s linear infinite 2s;}
        .animate-data-stream-3{animation:data-stream-3 12s linear infinite 4s;}
        .animate-orbit-1{animation:orbit-1 20s linear infinite;}
        .animate-orbit-2{animation:orbit-2 25s linear infinite;}
        .animate-pulse-dot-1{animation:pulse-dot-1 3s ease-in-out infinite;}
        .animate-pulse-dot-2{animation:pulse-dot-2 4s ease-in-out infinite 1s;}
        .animate-pulse-dot-3{animation:pulse-dot-3 5s ease-in-out infinite 2s;}
        .animate-title-glow{animation:title-glow 6s ease-in-out infinite;}
        .animate-guide-glow{animation:guide-glow 3s ease-in-out infinite;}
        .animate-border-flow{animation:border-flow 8s linear infinite;}
      `}</style>
    </div>
  );
}

export default Dashboard;
