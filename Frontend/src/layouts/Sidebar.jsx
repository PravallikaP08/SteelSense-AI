import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Server, Activity, Brain, BellRing,
  Settings as SettingsIcon, LogOut, ChevronLeft, BarChart2,
  Wrench, Info, HeartPulse
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import { useAppStore } from '../store/useAppStore';
import { useAlerts } from '../hooks/useAlerts';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

const menuItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Machines', path: '/machines', icon: Server },
  { name: 'Live Sensors', path: '/sensors', icon: Activity },
  { name: 'Predictions', path: '/predictions', icon: Brain },
  { name: 'Alerts', path: '/alerts', icon: BellRing },
  { name: 'Maintenance', path: '/maintenance', icon: Wrench },
  { name: 'Analytics', path: '/analytics', icon: BarChart2 },
];

const bottomItems = [
  { name: 'System Health', path: '/system-health', icon: HeartPulse },
  { name: 'About', path: '/about', icon: Info },
  { name: 'Settings', path: '/settings', icon: SettingsIcon },
];

const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  const { user, logout } = useAuthStore();
  const { data: alerts } = useAlerts();
  const navigate = useNavigate();

  const unreadCount = alerts?.filter(a => !a.read).length || 0;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-[#09090b] border-r border-white/[0.05] flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 shadow-2xl",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-20 px-5 border-b border-white/[0.05]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.45)]">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[15px] font-black tracking-tight text-white">
                SteelSense<span className="text-indigo-400">AI</span>
              </span>
              <p className="text-[9px] text-white/30 font-semibold uppercase tracking-widest">Industrial IoT Platform</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 text-white/40 hover:text-white lg:hidden rounded-lg hover:bg-white/5 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Main Nav */}
        <div className="flex-1 px-3 py-5 overflow-y-auto custom-scrollbar">
          <p className="px-3 text-[10px] font-black text-white/25 uppercase tracking-[0.15em] mb-3">
            Plant Monitoring
          </p>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/'}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                  isActive
                    ? "bg-indigo-500/10 text-indigo-300 font-semibold"
                    : "text-white/55 hover:text-white hover:bg-white/5"
                )}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-indigo-500 rounded-r-full shadow-[0_0_8px_#6366f1]"
                      />
                    )}
                    <item.icon className={cn("w-[18px] h-[18px] transition-transform duration-200 shrink-0", isActive ? "scale-110" : "group-hover:scale-110")} />
                    <span className="text-sm">{item.name}</span>
                    {item.name === 'Alerts' && unreadCount > 0 && (
                      <span className="ml-auto bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.6)]">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <p className="px-3 text-[10px] font-black text-white/25 uppercase tracking-[0.15em] mb-3 mt-6">
            System
          </p>
          <nav className="space-y-1">
            {bottomItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                  isActive
                    ? "bg-indigo-500/10 text-indigo-300 font-semibold"
                    : "text-white/55 hover:text-white hover:bg-white/5"
                )}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-indigo-500 rounded-r-full shadow-[0_0_8px_#6366f1]"
                      />
                    )}
                    <item.icon className={cn("w-[18px] h-[18px] transition-transform duration-200 shrink-0", isActive ? "scale-110" : "group-hover:scale-110")} />
                    <span className="text-sm">{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-white/[0.05]">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] shadow-lg mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-400 to-purple-500 flex items-center justify-center border-2 border-[#09090b] overflow-hidden shrink-0">
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-black text-white">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-white/40 truncate">{user?.email || user?.role || 'Operator'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 p-2.5 rounded-xl bg-rose-500/8 text-rose-400/80 hover:bg-rose-500/15 hover:text-rose-400 transition-colors border border-rose-500/10 hover:border-rose-500/20"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-semibold">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
