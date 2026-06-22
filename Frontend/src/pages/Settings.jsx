import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Bell, Moon, Sun, Shield, Activity, Save, LogOut, AlertCircle, CheckCircle2 } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, updateProfile, logout } = useAuthStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile settings state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [department, setDepartment] = useState('Predictive Maintenance');
  
  // Security settings state
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Preferences settings state
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [apiEndpoint, setApiEndpoint] = useState('http://localhost:5000/api');

  // Messages state
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      await updateProfile({ name, email });
      setSuccessMsg('Profile information updated successfully.');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!password) {
      setErrorMsg('Please enter a password.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await updateProfile({ password });
      setSuccessMsg('Password updated successfully.');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'security', label: 'Security & Access', icon: Lock },
    { id: 'notifications', label: 'Notification Config', icon: Bell },
    { id: 'api', label: 'API Connection', icon: Activity },
  ];

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Manage your account credentials, notifications, and platform parameters</p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-3 text-sm">
          <CheckCircle2 className="w-5 h-5" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Navigation list */}
        <div className="space-y-4">
          <div className="bg-[#09090b]/50 border border-white/[0.05] rounded-2xl p-4 flex flex-col space-y-2">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className={`flex items-center space-x-3 w-full p-3.5 rounded-xl font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400' 
                      : 'hover:bg-white/5 border border-transparent text-white/50 hover:text-white'
                  }`}
                >
                  <TabIcon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center justify-center space-x-2 w-full p-4 rounded-2xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 font-bold transition-all border border-rose-500/20 hover:shadow-[0_0_15px_rgba(244,63,94,0.1)]"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>

        {/* Content detail panels */}
        <div className="lg:col-span-2">
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#09090b]/50 border border-white/[0.05] rounded-3xl p-6 shadow-2xl space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-400" />
                Profile Information
              </h2>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-white/50">Full Name</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-white/50">Email Address</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-white/50">Role</label>
                    <input 
                      type="text" 
                      value={user?.role || 'Operator'}
                      disabled 
                      className="w-full bg-white/[0.01] border border-white/5 rounded-xl px-4 py-3 text-white/30 cursor-not-allowed text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-white/50">Department</label>
                    <input 
                      type="text" 
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors text-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button type="submit" disabled={loading} className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-semibold transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] flex items-center gap-2 text-sm">
                    <Save className="w-4 h-4" />
                    {loading ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#09090b]/50 border border-white/[0.05] rounded-3xl p-6 shadow-2xl space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-400" />
                Change Password
              </h2>
              {user?.googleId ? (
                <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 text-white/70 text-sm rounded-xl">
                  Your account uses Google Authentication. Password changes are managed via Google accounts directly.
                </div>
              ) : (
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-white/50">New Password</label>
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-white/50">Confirm New Password</label>
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <button type="submit" disabled={loading} className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-semibold transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] flex items-center gap-2 text-sm">
                      <Save className="w-4 h-4" />
                      {loading ? 'Changing...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#09090b]/50 border border-white/[0.05] rounded-3xl p-6 shadow-2xl space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-rose-400" />
                Notification Configuration
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/5">
                  <div>
                    <h3 className="text-white font-semibold">Push Telemetry Alerts</h3>
                    <p className="text-white/40 text-xs mt-0.5">Receive immediate dashboard alerts for critical failure anomalies.</p>
                  </div>
                  <button 
                    onClick={() => setNotifications(!notifications)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-indigo-500' : 'bg-white/10'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${notifications ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/5">
                  <div>
                    <h3 className="text-white font-semibold">Dark Theme</h3>
                    <p className="text-white/40 text-xs mt-0.5">Toggles responsive dark theme settings across screens.</p>
                  </div>
                  <button 
                    onClick={() => setDarkMode(!darkMode)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-indigo-500' : 'bg-white/10'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${darkMode ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'api' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#09090b]/50 border border-white/[0.05] rounded-3xl p-6 shadow-2xl space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                API Connection Details
              </h2>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-white/50">Express Endpoint URL</label>
                  <input 
                    type="text" 
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors text-sm font-mono"
                  />
                </div>
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between">
                  <span className="text-sm font-semibold text-white/60">Verification Status</span>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    ONLINE
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
