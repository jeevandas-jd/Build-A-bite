import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

function Login() {
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
      const response = await axiosClient.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-farmGreenLight to-farmGreen flex justify-center items-center p-4 relative overflow-hidden">
      {/* Animated decorative elements */}
      <div className="absolute top-10 right-10 text-5xl text-yellow-300 animate-spin-slow">
        <i className="fas fa-sun"></i>
      </div>
      <div className="absolute top-16 left-16 text-4xl text-white animate-float">
        <i className="fas fa-cloud"></i>
      </div>
      <div className="absolute bottom-20 left-24 text-3xl text-pink-400 animate-float-delayed">
        <i className="fas fa-butterfly"></i>
      </div>
      <div className="absolute bottom-32 right-20 text-2xl text-yellow-400 animate-zigzag">
        <i className="fas fa-bee"></i>
      </div>
      
      <form 
        onSubmit={handleSubmit} 
        className="bg-softWhite p-8 rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden border-8 border-farmGreenDark font-kidsFont"
      >
        {/* Field decoration at bottom */}
        <div className="absolute bottom-0 left-0 w-full flex justify-around text-2xl text-farmGreenDark pb-2">
          <i className="fas fa-seedling"></i>
          <i className="fas fa-carrot"></i>
          <i className="fas fa-apple-alt"></i>
          <i className="fas fa-leaf"></i>
        </div>
        
        <div className="text-center mb-2">
          <div className="text-5xl text-farmGreenDark mb-3 animate-bounce">
            <i className="fas fa-tractor"></i>
          </div>
          <h2 className="text-4xl mb-6 text-farmGreenDark font-extrabold text-center">Welcome Back!</h2>
        </div>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg animate-shake" role="alert">
            <p className="text-center font-bold">{error}</p>
          </div>
        )}
        
        <div className="relative mb-5">
          <input
            className="w-full p-4 rounded-2xl border-3 border-farmGreenDark focus:outline-none focus:ring-4 focus:ring-farmGreen focus:border-farmGreen bg-farmCream transition-all duration-300 placeholder-farmGreenLight"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <i className="fas fa-envelope absolute right-4 top-4 text-farmGreenDark"></i>
        </div>
        
        <div className="relative mb-6">
          <input
            className="w-full p-4 rounded-2xl border-3 border-farmGreenDark focus:outline-none focus:ring-4 focus:ring-farmGreen focus:border-farmGreen bg-farmCream transition-all duration-300 placeholder-farmGreenLight"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <i className="fas fa-lock absolute right-4 top-4 text-farmGreenDark"></i>
        </div>
        
        <button 
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-b from-farmGreen to-farmGreenDark hover:from-farmGreenDark hover:to-farmGreenDarker text-softWhite font-extrabold py-4 rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 active:shadow-md flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Logging In...
            </>
          ) : (
            <>
              <i className="fas fa-sign-in-alt mr-2"></i>
              Log In
            </>
          )}
        </button>
        
        <div className="text-center mt-6 text-farmGreenDark">
          <p className="mb-2">New to Green Farm? <a href="/register" className="font-bold hover:underline">Create Account</a></p>
          <p><a href="#" className="font-bold hover:underline">Forgot Password?</a></p>
        </div>
      </form>
      
      {/* Add these styles for the animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-8px) translateX(8px); }
        }
        @keyframes zigzag {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(10px, -8px) rotate(5deg); }
          50% { transform: translate(5px, 8px) rotate(-5deg); }
          75% { transform: translate(-8px, -5px) rotate(3deg); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite;
        }
        .animate-zigzag {
          animation: zigzag 8s linear infinite;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default Login;