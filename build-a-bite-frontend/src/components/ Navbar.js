import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  useEffect(() => {
    checkAdmin()
  }, [])
  const checkAdmin = () => {
    axiosClient.get('auth/me').then(res=>setIsAdmin(res.data.isAdmin)).catch(err=>console.log(err))
  }
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && isMobile) {
        const menu = document.querySelector('.mobile-menu');
        const menuButton = document.querySelector('.menu-button');
        
        if (menu && !menu.contains(event.target) && 
            menuButton && !menuButton.contains(event.target)) {
          setIsMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, isMobile]);

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-purple-900 to-indigo-900 text-white p-4 font-mono shadow-2xl relative overflow-hidden border-b border-cyan-400/30">
      {/* Overlay when mobile menu is open */}
      {isMobile && isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
      
      {/* Futuristic background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan-line"></div>
        <div className="absolute top-2 left-20 w-1 h-1 bg-cyan-400 rounded-full animate-particle-1"></div>
        <div className="absolute top-4 right-32 w-1 h-1 bg-purple-400 rounded-full animate-particle-2"></div>
        <div className="absolute bottom-2 left-1/2 w-1 h-1 bg-pink-400 rounded-full animate-particle-3"></div>
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px',
          }}
        ></div>
      </div>
      
      <div className="flex justify-between items-center relative z-10">
        {/* Logo */}
        <Link 
          to="/dashboard" 
          className="text-2xl md:text-3xl font-bold flex items-center gap-3 hover:scale-105 transition-transform duration-300"
        >
          <div className="relative">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 animate-logo-glow">🎮</span>
            <div className="absolute inset-0 text-cyan-400/50 animate-pulse">🎮</div>
          </div>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 font-bold tracking-wider">
            BUILD A BITE
          </span>
          <div className="relative">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 animate-logo-glow">⚡</span>
            <div className="absolute inset-0 text-purple-400/50 animate-pulse">⚡</div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <div className="flex space-x-6 items-center">
            <Link 
              to="/dashboard" 
              className="hover:text-cyan-400 transition-all duration-300 transform hover:scale-110 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-cyan-400/10 border border-transparent hover:border-cyan-400/30"
            >
              <span className="text-cyan-400">🏠</span>
              <span className="hidden md:inline font-semibold">DASHBOARD</span>
            </Link>
            <Link 
              to="/leaderboard"
              className="hover:text-purple-400 transition-all duration-300 transform hover:scale-110 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-400/10 border border-transparent hover:border-purple-400/30"
            >
              <span className="text-purple-400">🏆</span>
              <span className="hidden md:inline font-semibold">LEADERBOARD</span>
            </Link>
            <Link 
              to="/products"
              className="hover:text-pink-400 transition-all duration-300 transform hover:scale-110 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-pink-400/10 border border-transparent hover:border-pink-400/30"
            >
              <span className="text-pink-400">🍎</span>
              <span className="hidden md:inline font-semibold">PRODUCTS</span>
            </Link>
            <Link 
              to="/profile"
              className="hover:text-green-400 transition-all duration-300 transform hover:scale-110 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-400/10 border border-transparent hover:border-green-400/30"
            >
              <span className="text-green-400">👤</span>
              <span className="hidden md:inline font-semibold">PROFILE</span>
            </Link>

            {isAdmin && (
              <Link 
                to="/admin"
                className="hover:text-yellow-400 transition-all duration-300 transform hover:scale-110 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-yellow-400/10 border border-transparent hover:border-yellow-400/30"
              >
                              <span className="text-green-400">👩🏻‍💻</span>
              <span className="hidden md:inline font-semibold">Manager</span>
              </Link>
            )

          }

            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white font-bold px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-red-400/30 active:scale-95 flex items-center gap-2 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20 blur-lg"></div>
              <span className="relative">🚪</span>
              <span className="hidden md:inline relative font-semibold">LOGOUT</span>
            </button>
          </div>
        )}

        {/* Mobile menu button */}
        {isMobile && (
          <button 
            className="menu-button text-2xl focus:outline-none relative z-40 bg-gray-800/50 backdrop-blur-sm p-3 rounded-xl border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {!isMenuOpen ? (
              <div className="flex flex-col gap-1.5 w-6">
                <div className="w-full h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 rounded transition-all duration-300"></div>
                <div className="w-full h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded transition-all duration-300"></div>
                <div className="w-full h-0.5 bg-gradient-to-r from-pink-400 to-cyan-400 rounded transition-all duration-300"></div>
              </div>
            ) : (
              <div className="relative w-6 h-6">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 rounded transform rotate-45 transition-all duration-300"></div>
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded transform -rotate-45 transition-all duration-300"></div>
              </div>
            )}
          </button>
        )}
      </div>

      {/* Mobile Navigation Menu */}
      {isMobile && isMenuOpen && (
        <div className="mobile-menu fixed top-0 left-0 right-0 h-full bg-gray-900/95 backdrop-blur-xl flex flex-col items-center py-6 space-y-4 z-40 shadow-2xl overflow-y-auto">
          <div className="w-full flex justify-end p-4">
            <button 
              className="text-2xl text-cyan-400 hover:text-cyan-300 transition-colors"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
          
          <Link 
            to="/dashboard"
            className="hover:text-cyan-400 transition-all duration-300 w-full text-center py-4 flex items-center justify-center gap-4 text-xl border-b border-gray-700/50 hover:bg-cyan-400/10" 
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="text-cyan-400">🏠</span>
            <span className="font-semibold">DASHBOARD</span>
          </Link>
          <Link 
            to="/leaderboard"
            className="hover:text-purple-400 transition-all duration-300 w-full text-center py-4 flex items-center justify-center gap-4 text-xl border-b border-gray-700/50 hover:bg-purple-400/10" 
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="text-purple-400">🏆</span>
            <span className="font-semibold">LEADERBOARD</span>
          </Link>
          <Link 
            to="/products"
            className="hover:text-pink-400 transition-all duration-300 w-full text-center py-4 flex items-center justify-center gap-4 text-xl border-b border-gray-700/50 hover:bg-pink-400/10" 
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="text-pink-400">🍎</span>
            <span className="font-semibold">PRODUCTS</span>
          </Link>
          <Link 
            to="/profile"
            className="hover:text-green-400 transition-all duration-300 w-full text-center py-4 flex items-center justify-center gap-4 text-xl border-b border-gray-700/50 hover:bg-green-400/10" 
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="text-green-400">👤</span>
            <span className="font-semibold">PROFILE</span>
          </Link>
          <Link 
            to="/admin"
            className="hover:text-green-400 transition-all duration-300 w-full text-center py-4 flex items-center justify-center gap-4 text-xl border-b border-gray-700/50 hover:bg-green-400/10" 
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="text-green-400">👩🏻‍💻</span>
            <span className="font-semibold">Manager</span>
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setIsMenuOpen(false);
            }}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white font-bold px-6 py-4 rounded-xl transition-all duration-300 w-3/4 flex items-center justify-center gap-3 text-xl mt-4 shadow-lg relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20 blur-lg"></div>
            <span className="relative">🚪</span>
            <span className="relative font-semibold">LOGOUT</span>
          </button>
          
          <div className="text-xs text-gray-400 mt-4 flex items-center">
            <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse mr-2"></div>
            MENU_ACTIVE
          </div>
        </div>
      )}
      
      {/* Animations */}
      <style>{`
        @keyframes scan-line {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        @keyframes particle-1 {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.7; }
          50% { transform: translateY(-8px) scale(1.5); opacity: 1; }
        }
        @keyframes particle-2 {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.6; }
          50% { transform: translateY(-6px) translateX(4px) scale(1.3); opacity: 1; }
        }
        @keyframes particle-3 {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.8; }
          50% { transform: translateY(-10px) scale(1.2); opacity: 0.4; }
        }
        @keyframes logo-glow {
          0%, 100% { filter: brightness(1) hue-rotate(0deg); transform: scale(1); }
          50% { filter: brightness(1.3) hue-rotate(90deg); transform: scale(1.1); }
        }
        @keyframes menu-slide {
          0% { opacity: 0; transform: translateY(-30px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spin-fast {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-scan-line { animation: scan-line 6s linear infinite; }
        .animate-particle-1 { animation: particle-1 3s ease-in-out infinite; }
        .animate-particle-2 { animation: particle-2 4s ease-in-out infinite 1s; }
        .animate-particle-3 { animation: particle-3 5s ease-in-out infinite 2s; }
        .animate-logo-glow { animation: logo-glow 4s ease-in-out infinite; }
        .animate-menu-slide { animation: menu-slide 0.4s ease-out forwards; }
        .animate-spin-fast { animation: spin-fast 0.5s linear infinite; }
      `}</style>
    </nav>
  );
}

export default Navbar;