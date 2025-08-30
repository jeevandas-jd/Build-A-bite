import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Check screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // Close menu when switching to desktop view
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

  return (
    <nav className="bg-gradient-to-r from-farmGreen to-farmGreenDark text-softWhite p-4 font-kidsFont shadow-lg relative">
      {/* Animated decorative elements */}
      <div className="absolute -top-2 left-4 text-xl text-yellow-300 animate-spin-slow">
        <i className="fas fa-sun"></i>
      </div>
      <div className="absolute -bottom-2 right-6 text-lg text-pink-400 animate-float">
        <i className="fas fa-butterfly"></i>
      </div>
      
      <div className="flex justify-between items-center">
        <div 
          className="text-2xl md:text-3xl font-bold cursor-pointer flex items-center gap-2 hover:scale-105 transition-transform duration-300"
          onClick={() => navigate('/dashboard')}
        >
          <i className="fas fa-tractor text-yellow-300"></i>
          <span className="text-shadow">Build A Bite</span>
          <i className="fas fa-seedling text-yellow-300"></i>
        </div>

        {/* Desktop Navigation - Always visible on desktop */}
        {!isMobile && (
          <div className="flex space-x-4 md:space-x-6 items-center">
            <Link 
              className="hover:text-yellow-300 transition-all duration-300 transform hover:scale-110 flex items-center gap-1" 
              to="/dashboard"
            >
              <i className="fas fa-home"></i>
              <span className="hidden md:inline">Dashboard</span>
            </Link>
            <Link 
              className="hover:text-yellow-300 transition-all duration-300 transform hover:scale-110 flex items-center gap-1" 
              to="/leaderboard"
            >
              <i className="fas fa-trophy"></i>
              <span className="hidden md:inline">Leaderboard</span>
            </Link>
            <Link 
              className="hover:text-yellow-300 transition-all duration-300 transform hover:scale-110 flex items-center gap-1" 
              to="/products"
            >
              <i className="fas fa-apple-alt"></i>
              <span className="hidden md:inline">Products</span>
            </Link>
            <Link 
              className="hover:text-yellow-300 transition-all duration-300 transform hover:scale-110 flex items-center gap-1" 
              to="/profile"
            >
              <i className="fas fa-user"></i>
              <span className="hidden md:inline">Profile</span>
            </Link>

            <button
              onClick={handleLogout}
              className="bg-gradient-to-b from-sunnyYellow to-yellow-500 text-farmGreenDark font-bold px-3 py-1 md:px-4 md:py-2 rounded-xl hover:from-yellow-400 hover:to-yellow-600 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 shadow-md flex items-center gap-2"
            >
              <i className="fas fa-sign-out-alt"></i>
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        )}

        {/* Mobile menu button - Only shows on mobile */}
        {isMobile && (
          <button 
            className="text-2xl focus:outline-none relative z-50 bg-farmGreenDark p-2 rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {/* Three dots icon */}
            {!isMenuOpen ? (
              <div className="flex flex-col gap-1">
                <div className="w-2 h-2 rounded-full bg-yellow-300"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-300"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-300"></div>
              </div>
            ) : (
              <i className="fas fa-times text-yellow-300 text-xl"></i>
            )}
          </button>
        )}
      </div>

      {/* Mobile Navigation Menu - Animated dropdown */}
      {isMobile && isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-farmGreenDark mt-2 flex flex-col items-center py-4 space-y-4 z-40 shadow-xl rounded-b-2xl animate-menuSlide">
          <Link 
            className="hover:text-yellow-300 transition-all duration-300 w-full text-center py-3 flex items-center justify-center gap-3 text-xl border-b border-farmGreen border-dashed" 
            to="/dashboard"
            onClick={() => setIsMenuOpen(false)}
          >
            <i className="fas fa-home text-yellow-300"></i>
            <span>Dashboard</span>
          </Link>
          <Link 
            className="hover:text-yellow-300 transition-all duration-300 w-full text-center py-3 flex items-center justify-center gap-3 text-xl border-b border-farmGreen border-dashed" 
            to="/leaderboard"
            onClick={() => setIsMenuOpen(false)}
          >
            <i className="fas fa-trophy text-yellow-300"></i>
            <span>Leaderboard</span>
          </Link>
          <Link 
            className="hover:text-yellow-300 transition-all duration-300 w-full text-center py-3 flex items-center justify-center gap-3 text-xl border-b border-farmGreen border-dashed" 
            to="/products"
            onClick={() => setIsMenuOpen(false)}
          >
            <i className="fas fa-apple-alt text-yellow-300"></i>
            <span>Products</span>
          </Link>
          <Link 
            className="hover:text-yellow-300 transition-all duration-300 w-full text-center py-3 flex items-center justify-center gap-3 text-xl border-b border-farmGreen border-dashed" 
            to="/profile"
            onClick={() => setIsMenuOpen(false)}
          >
            <i className="fas fa-user text-yellow-300"></i>
            <span>Profile</span>
          </Link>

          <button
            onClick={() => {
              handleLogout();
              setIsMenuOpen(false);
            }}
            className="bg-gradient-to-b from-sunnyYellow to-yellow-500 text-farmGreenDark font-bold px-4 py-3 rounded-xl hover:from-yellow-400 hover:to-yellow-600 transition-all duration-300 w-3/4 flex items-center justify-center gap-2 text-xl mt-2 shadow-md"
          >
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      )}
      
      {/* Add these styles for the animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes menuSlide {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-menuSlide {
          animation: menuSlide 0.3s ease-out forwards;
        }
        .text-shadow {
          text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </nav>
  );
}

export default Navbar;