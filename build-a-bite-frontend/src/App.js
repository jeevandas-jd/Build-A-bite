import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Navbar from './components/ Navbar';
import Register from './components/Register';
import Products from './pages/Products';
import GamePlay  from './pages/GamePlay';
import Profile from './pages/Profile';
import Leaderboard from './pages/LeaderBoard';
import AdminDashboard from './pages/AdminDashBoard';// add your products page
import CreateGuest from './components/CreateGuest';
import NotFound from './pages/NotFound';
import SoundDebugger from './utils/debugger';
import MyButton from './pages/debugger';
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

  const srverClosed = false; // Change to true to simulate server closed

  if (srverClosed) {
    return <NotFound />;
  }

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

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AdminDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-guest"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CreateGuest />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch-all → could go to dashboard instead of login */}
        <Route path="*" element={<Navigate to="/Login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
