import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Server, Activity, Brain, BellRing, Settings as SettingsIcon, LogOut, ChevronLeft, BarChart2, Bell, User as UserIcon } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

const menuItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Machines', path: '/machines', icon: Server },
  { name: 'Live Sensors', path: '/sensors', icon: Activity },
  { name: 'Predictions', path: '/predictions', icon: Brain },
  { name: 'Alerts', path: '/alerts', icon: BellRing },
  { name: 'Analytics', path: '/analytics', icon: BarChart2 },
  { name: 'Notifications', path: '/notifications', icon: Bell },
  { name: 'Profile', path: '/profile', icon: UserIcon },
  { name: 'Settings', path: '/settings', icon: SettingsIcon },
];

const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

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
        <div className="flex items-center justify-between h-20 px-6 border-b border-white/[0.05]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              SteelSense<span className="text-indigo-400">AI</span>
            </span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-2 text-white/50 hover:text-white lg:hidden rounded-lg hover:bg-white/5 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 px-4 py-6 overflow-y-auto custom-scrollbar">
          <p className="px-3 text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">
            Platform Menu
          </p>
          <nav className="space-y-1.5">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-indigo-500/10 text-indigo-400 font-medium" 
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full"
                      />
                    )}
                    <item.icon className={cn("w-5 h-5 transition-transform duration-200", isActive ? "scale-110" : "group-hover:scale-110")} />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-white/[0.05]">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 shadow-lg">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-400 flex items-center justify-center border-2 border-[#09090b] overflow-hidden shrink-0">
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-[#09090b]">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-white/50 truncate">{user?.role || 'Operator'}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="mt-4 flex w-full items-center justify-center space-x-2 p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
