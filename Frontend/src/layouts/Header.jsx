import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, BellRing, Settings, Check, AlertTriangle, AlertOctagon, Info } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import useAuthStore from '../store/authStore';
import { useAlerts } from '../hooks/useAlerts';
import { useQueryClient } from '@tanstack/react-query';
import { markAlertRead, markAllAlertsRead } from '../services/alertService';
import { cn } from '../utils/cn';

const Header = () => {
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  const { user } = useAuthStore();
  const { data: alerts } = useAlerts();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const unreadAlerts = alerts ? alerts.filter((a) => !a.read) : [];
  const unreadCount = unreadAlerts.length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAlertClick = async (e, alertItem) => {
    e.stopPropagation();
    try {
      if (!alertItem.read) {
        await markAlertRead(alertItem._id);
        queryClient.invalidateQueries({ queryKey: ['alerts'] });
      }
      setShowDropdown(false);
      navigate('/alerts');
    } catch (err) {
      console.error('Error marking alert as read:', err);
    }
  };

  const handleMarkAllRead = async (e) => {
    e.stopPropagation();
    try {
      await markAllAlertsRead();
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    } catch (err) {
      console.error('Error marking all alerts read:', err);
    }
  };

  return (
    <header className="h-20 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/[0.05] sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 text-white/60 hover:text-white lg:hidden rounded-lg hover:bg-white/5 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/[0.05] rounded-lg text-white/50 hover:bg-white/[0.06] hover:border-white/10 transition-colors w-64 focus-within:w-80 focus-within:bg-white/[0.06] focus-within:border-indigo-500/50">
          <Search className="w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search resources..."
            className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-white/30"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 relative" ref={dropdownRef}>
        {/* Notification Bell with Badge and Dropdown */}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className={cn(
            "relative p-2.5 text-white/60 hover:text-white rounded-xl hover:bg-white/5 transition-colors group",
            showDropdown && "bg-white/5 text-white"
          )}
        >
          <BellRing className="w-5 h-5 group-hover:scale-110 transition-transform" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-[0_0_10px_rgba(244,63,94,0.8)]">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {showDropdown && (
          <div className="absolute right-0 top-14 w-80 sm:w-96 rounded-2xl border border-white/10 bg-[#09090b]/95 backdrop-blur-2xl shadow-2xl p-4 z-50 text-slate-100 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-sm font-bold text-white">System Alarms</span>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto flex flex-col gap-2.5 custom-scrollbar pr-1">
              {alerts && alerts.slice(0, 5).map((alert) => {
                const isCritical = alert.severity === 'High' || alert.severity === 'Critical';
                const isWarning = alert.severity === 'Medium';
                
                return (
                  <div
                    key={alert._id}
                    onClick={(e) => handleAlertClick(e, alert)}
                    className={cn(
                      "flex items-start gap-3 p-2.5 rounded-xl border cursor-pointer transition-all hover:bg-white/5",
                      alert.read ? "bg-transparent border-transparent opacity-60" : "bg-white/[0.03] border-white/5"
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-lg shrink-0 border",
                      isCritical ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                      isWarning ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                      "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                    )}>
                      {isCritical ? <AlertOctagon className="w-4 h-4" /> :
                       isWarning ? <AlertTriangle className="w-4 h-4" /> :
                       <Info className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-mono font-bold text-white/50">{alert.machineId}</span>
                        <span className="text-[10px] text-white/30">{alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}</span>
                      </div>
                      <p className="text-xs font-semibold text-white truncate mt-0.5">{alert.message}</p>
                    </div>
                  </div>
                );
              })}
              {(!alerts || alerts.length === 0) && (
                <div className="text-center py-8 text-white/30 text-sm">
                  No active system alarms.
                </div>
              )}
            </div>

            <Link
              to="/alerts"
              onClick={() => setShowDropdown(false)}
              className="text-center text-xs font-bold text-white/50 hover:text-white py-2 border-t border-white/5 hover:bg-white/5 rounded-xl transition-all"
            >
              View All Alerts
            </Link>
          </div>
        )}

        <Link
          to="/settings"
          className="p-2.5 text-white/60 hover:text-white rounded-xl hover:bg-white/5 transition-colors group hidden sm:block"
        >
          <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
        </Link>

        <Link
          to="/profile"
          className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center border-2 border-white/10 hover:border-indigo-400 transition-all overflow-hidden shrink-0 shadow-lg ml-1"
          title={user?.name || 'My Profile'}
        >
          {user?.imageUrl ? (
            <img src={user.imageUrl} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs font-bold text-white">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
          )}
        </Link>
      </div>
    </header>
  );
};

export default Header;
