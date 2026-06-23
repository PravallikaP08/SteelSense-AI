import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Lock, Mail, ArrowRight, AlertCircle, Factory, Shield, Activity } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { signInWithGooglePopup } from '../utils/firebase';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [localError, setLocalError] = useState('');

  const { email, password } = formData;
  const navigate = useNavigate();
  const { login, googleLogin, isSuccess, isLoading, isError, message, reset, user } = useAuthStore();

  useEffect(() => {
    if (isSuccess || user) {
      navigate('/');
    }
    if (isError && message) {
      setLocalError(message);
    }
    reset();
  }, [user, isError, isSuccess, message, navigate, reset]);

  const onChange = (e) => {
    setLocalError('');
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setLocalError('');
    login({ email, password });
  };

  const handleGoogleSignIn = async () => {
    setLocalError('');
    try {
      const googleUser = await signInWithGooglePopup();
      await googleLogin(googleUser);
    } catch (err) {
      if (err.message !== 'Sign-in popup was closed before completing.' && err.message !== 'Google Sign-In was cancelled.') {
        setLocalError(err.message || 'Google authentication failed.');
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-[#09090b] relative overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-[-20%] left-[-15%] w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-15%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Left Panel — Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 border-r border-white/[0.05]">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg font-black text-white">SteelSense<span className="text-indigo-400">AI</span></span>
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-5xl font-black text-white leading-tight">
            Industrial AI<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Monitoring</span><br />
            Platform
          </h1>
          <p className="text-white/50 text-lg leading-relaxed max-w-md">
            Real-time predictive maintenance, machine telemetry, and AI-driven failure prevention for steel manufacturing.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Activity, label: 'Real-time IoT', desc: 'Live sensor data' },
              { icon: Brain, label: 'Predictive AI', desc: 'Failure prevention' },
              { icon: Shield, label: 'Enterprise Grade', desc: 'Secure platform' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <Icon className="w-5 h-5 text-indigo-400 mb-2" />
                <p className="text-xs font-bold text-white">{label}</p>
                <p className="text-[10px] text-white/40 mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 text-white/30 text-xs">
          <Factory className="w-4 h-4" />
          <span>Vizag Steel Plant — Industrial Operations Division</span>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black text-white">SteelSense<span className="text-indigo-400">AI</span></span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-black text-white mb-1">Welcome back</h2>
            <p className="text-white/50 text-sm">Sign in to access your plant dashboard</p>
          </div>

          {localError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/25 rounded-xl flex items-start gap-2.5 text-rose-400 text-sm"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{localError}</span>
            </motion.div>
          )}

          {/* Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-xl font-semibold transition-all border border-gray-200 shadow-sm text-sm mb-5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-white/[0.08]" />
            <span className="flex-shrink mx-4 text-white/30 text-xs uppercase font-semibold tracking-wider">or use email</span>
            <div className="flex-grow border-t border-white/[0.08]" />
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-white/30" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  className="block w-full pl-10 pr-3 py-3 border border-white/[0.08] rounded-xl bg-white/[0.03] text-white placeholder-white/25 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm"
                  placeholder="engineer@steelsense.ai"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-white/30" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  className="block w-full pl-10 pr-3 py-3 border border-white/[0.08] rounded-xl bg-white/[0.03] text-white placeholder-white/25 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2.5 bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.45)] disabled:opacity-60 text-sm mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Access Dashboard
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/40">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 transition-colors font-semibold">
              Request access
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
