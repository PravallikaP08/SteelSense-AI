import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Key, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import useAuthStore from '../store/authStore';
import PageTransition from '../components/PageTransition';

const Profile = () => {
  const { user, updateProfile } = useAuthStore();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      await updateProfile({ name, email });
      setSuccessMsg('Profile updated successfully!');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!password) {
      setErrorMsg('Please enter a new password.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await updateProfile({ password });
      setSuccessMsg('Password changed successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition className="space-y-8 pb-10">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <User className="w-6 h-6 text-indigo-400" />
          </div>
          My Profile
        </h1>
        <p className="text-white/50 mt-2">Manage your personal information and security settings</p>
      </header>

      {/* Messages */}
      {errorMsg && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-rose-500/10 border border-rose-500/25 text-rose-400 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{errorMsg}</span>
        </motion.div>
      )}
      {successMsg && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-medium">{successMsg}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl bg-[#09090b]/50 border border-white/[0.05] p-6 relative overflow-hidden flex flex-col items-center justify-center text-center shadow-2xl h-max"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center border-4 border-[#09090b] shadow-2xl overflow-hidden mb-6 relative group">
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-black text-white">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
            )}
          </div>

          <h3 className="text-2xl font-bold text-white mb-1">{user?.name}</h3>
          <p className="text-white/40 text-sm mb-4 font-medium flex items-center gap-1.5 justify-center">
            <Mail className="w-4 h-4" />
            {user?.email}
          </p>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            {user?.role || 'Operator'}
          </div>
        </motion.div>

        {/* Update Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl bg-[#09090b]/50 border border-white/[0.05] p-6 shadow-2xl relative overflow-hidden"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-400" />
              Account Specifications
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-white/50">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-white/50">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-semibold transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] flex items-center gap-2 text-sm disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Security Credentials */}
          {!user?.googleId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-3xl bg-[#09090b]/50 border border-white/[0.05] p-6 shadow-2xl relative overflow-hidden"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Key className="w-5 h-5 text-purple-400" />
                Change Password
              </h3>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-white/50">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-white/50">Confirm Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-semibold transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] flex items-center gap-2 text-sm disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {user?.googleId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-3xl bg-indigo-500/5 border border-indigo-500/20 p-6 shadow-2xl"
            >
              <h3 className="text-base font-bold text-white mb-2">Connected with Google</h3>
              <p className="text-sm text-white/50 leading-relaxed">
                Your profile is linked to your Google Account. Profile changes, email validation, and authentication are managed through Google securely.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Profile;
