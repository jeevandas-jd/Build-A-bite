import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axiosClient.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="h-screen bg-farmGreenLight flex justify-center items-center">
      <form 
        onSubmit={handleSubmit} 
        className="bg-softWhite p-8 rounded-3xl shadow-xl w-80 font-kidsFont"
      >
        <h2 className="text-3xl mb-8 text-farmGreenDark font-extrabold text-center">Welcome Back!</h2>
        {error && <p className="text-red-600 mb-6 text-center">{error}</p>}
        <input
          className="w-full p-3 mb-5 rounded-lg border border-farmGreenDark focus:outline-none focus:ring-4 focus:ring-farmGreen"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <input
          className="w-full p-3 mb-8 rounded-lg border border-farmGreenDark focus:outline-none focus:ring-4 focus:ring-farmGreen"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        <button 
          type="submit"
          className="w-full bg-farmGreen hover:bg-farmGreenDark text-softWhite font-extrabold py-3 rounded-3xl shadow-md transition"
        >
          Log In
        </button>
      </form>
    </div>
  );
}

export default Login;
