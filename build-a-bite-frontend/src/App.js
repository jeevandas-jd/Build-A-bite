import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Navbar from './components/ Navbar';
import Register from './components/Register';
import Products from './pages/Products';
import GamePlay  from './pages/GamePlay';
import Profile from './pages/Profile';
import Leaderboard from './pages/LeaderBoard'; // add your products page

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  console.log(`token in ProtectedRoute is ${token}`);
  return token ? children : <Navigate to="/login" replace />;
};

function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Products />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Leaderboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route 
        path="/game/:productId/:difficulty" 
        element={
          
            <MainLayout>
              <GamePlay />
            </MainLayout>
          
        } 
      />

        {/* Catch-all → could go to dashboard instead of login */}
        <Route path="*" element={<Navigate to="/Login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
