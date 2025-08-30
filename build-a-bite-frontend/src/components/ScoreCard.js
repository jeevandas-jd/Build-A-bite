function ScoreCard({ score, total, difficulty, productId, sessionId, timeToFinish, accuracy }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-6 font-mono relative overflow-hidden">
      {/* Celebration background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-cyan-400 rounded-full animate-celebration-1"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-400 rounded-full animate-celebration-2"></div>
        <div className="absolute bottom-1/4 left-1/3 w-5 h-5 bg-pink-400 rounded-full animate-celebration-3"></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-green-400 rounded-full animate-celebration-4"></div>
      </div>

      <div className="max-w-2xl mx-auto bg-gray-800/80 backdrop-blur-xl border border-cyan-400/40 rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-purple-400/10 to-pink-400/10 animate-score-glow"></div>
        
        <div className="relative z-10 text-center">
          <div className="text-6xl mb-4 animate-bounce">🏆</div>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
            MISSION ANALYSIS
          </h2>
          
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
          
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            <span className="mr-2">🏠</span>
            RETURN TO BASE
          </button>
        </div>
      </div>

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