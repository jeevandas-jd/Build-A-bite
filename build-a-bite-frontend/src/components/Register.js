import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await axiosClient.post('/auth/register', { name, email, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex justify-center items-center p-4 relative overflow-hidden font-mono">
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

      <form 
        onSubmit={handleSubmit} 
        className="bg-gray-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden border border-cyan-400/40"
      >
        {/* Glowing border effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/10 via-purple-400/10 to-pink-400/10 animate-border-glow -z-10"></div>
        
        {/* Header with holographic effect */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-hologram">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">👤</span>
          </div>
          <h2 className="text-3xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-bold">
            CREATE ACCOUNT
          </h2>
          <div className="text-sm text-cyan-400/70">Join our farming community</div>
        </div>
        
        {error && (
          <div className="bg-red-500/20 border border-red-400 text-red-300 p-4 mb-6 rounded-xl animate-glitch backdrop-blur-sm" role="alert">
            <div className="flex items-center">
              <span className="text-red-400 mr-2">⚠</span>
              <p className="font-bold">{error}</p>
            </div>
          </div>
        )}
        
        <div className="relative mb-6">
          <input
            className="w-full p-4 rounded-xl border border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-gray-700/50 backdrop-blur-sm transition-all duration-300 placeholder-gray-400 text-white font-mono"
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            autoComplete="name"
            required
          />
          <div className="absolute right-4 top-4 text-cyan-400">👤</div>
        </div>
        
        <div className="relative mb-6">
          <input
            className="w-full p-4 rounded-xl border border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-gray-700/50 backdrop-blur-sm transition-all duration-300 placeholder-gray-400 text-white font-mono"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <div className="absolute right-4 top-4 text-cyan-400">📧</div>
        </div>
        
        <div className="relative mb-8">
          <input
            className="w-full p-4 rounded-xl border border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-gray-700/50 backdrop-blur-sm transition-all duration-300 placeholder-gray-400 text-white font-mono"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <div className="absolute right-4 top-4 text-cyan-400">🔒</div>
        </div>
        
        <button 
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-cyan-400/30 active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
        >
          {/* Button glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 blur-xl"></div>
          
          {isLoading ? (
            <>
              <span className="mr-2 animate-spin">⟳</span>
              CREATING ACCOUNT...
            </>
          ) : (
            <>
              <span className="mr-2">🌱</span>
              REGISTER
            </>
          )}
        </button>
        
        <div className="text-center mt-6 text-gray-300">
          <p className="mb-2">
            ALREADY HAVE AN ACCOUNT? 
            <a href="/login" className="text-cyan-400 font-bold hover:text-purple-400 transition-colors duration-300 ml-2">
              LOGIN HERE
            </a>
          </p>
        </div>
        
        {/* Status indicator */}
        <div className="absolute top-4 right-4 flex items-center">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1"></div>
          <span className="text-xs text-gray-400 font-mono">SYSTEM ONLINE</span>
        </div>
      </form>
      
      {/* Animation styles */}
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
        @keyframes hologram {
          0%, 100% { 
            filter: hue-rotate(0deg) brightness(1);
            transform: scale(1);
          }
          50% { 
            filter: hue-rotate(90deg) brightness(1.2);
            transform: scale(1.05);
          }
        }
        @keyframes border-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        @keyframes glitch {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-2px); }
          40% { transform: translateX(2px); }
          60% { transform: translateX(-1px); }
          80% { transform: translateX(1px); }
        }
        
        .animate-scan-top { animation: scan-top 8s linear infinite; }
        .animate-scan-bottom { animation: scan-bottom 12s linear infinite 2s; }
        .animate-float-1 { animation: float-1 4s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 5s ease-in-out infinite 1s; }
        .animate-float-3 { animation: float-3 6s ease-in-out infinite 2s; }
        .animate-hologram { animation: hologram 3s ease-in-out infinite; }
        .animate-border-glow { animation: border-glow 2s ease-in-out infinite; }
        .animate-glitch { animation: glitch 0.6s ease-in-out; }
      `}</style>
    </div>
  );
}

export default Register;