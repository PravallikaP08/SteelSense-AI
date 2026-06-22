import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import Machines from './pages/Machines';
import Sensors from './pages/Sensors';
import Predictions from './pages/Predictions';
import Alerts from './pages/Alerts';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Settings from './pages/Settings';
import About from './pages/About';
import SystemHealth from './pages/SystemHealth';
import Analytics from './pages/Analytics';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import useAuthStore from './store/authStore';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStore();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="machines" element={<Machines />} />
          <Route path="sensors" element={<Sensors />} />
          <Route path="predictions" element={<Predictions />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="about" element={<About />} />
          <Route path="system-health" element={<SystemHealth />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;
