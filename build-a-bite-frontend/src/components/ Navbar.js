import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-farmGreen text-softWhite flex justify-between items-center p-4 font-kidsFont shadow-md">
      <div 
        className="text-2xl font-bold cursor-pointer"
        onClick={() => navigate('/dashboard')}
      >
        Build a Bite
      </div>
      <div className="space-x-6">
        <Link className="hover:text-yellow-300" to="/dashboard">Dashboard</Link>
        <Link className="hover:text-yellow-300" to="/leaderboard">Leaderboard</Link>
        <Link className="hover:text-yellow-300" to="/products">Products</Link>
        <Link className="hover:text-yellow-300" to="/profile">Profile</Link>

        <button
          onClick={handleLogout}
          className="bg-sunnyYellow text-farmGreenDark font-bold px-3 py-1 rounded-lg hover:bg-yellow-400 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
