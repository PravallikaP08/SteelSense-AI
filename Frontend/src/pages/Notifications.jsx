import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, AlertTriangle, AlertOctagon, Info, Check, Search, Calendar, RefreshCw } from 'lucide-react';
import { useAlerts } from '../hooks/useAlerts';
import PageTransition from '../components/PageTransition';
import { cn } from '../utils/cn';

const Notifications = () => {
  const { data: alerts, isLoading, refetch } = useAlerts();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [readNotifications, setReadNotifications] = useState(new Set());

  const handleMarkAllRead = () => {
    if (alerts) {
      const allIds = new Set(alerts.map((_, idx) => idx));
      setReadNotifications(allIds);
    }
  };

  const handleToggleRead = (id) => {
    const next = new Set(readNotifications);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setReadNotifications(next);
  };

  if (isLoading && !alerts) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  const filteredAlerts = alerts?.filter(a => {
    const matchesSearch = a.message.toLowerCase().includes(searchTerm.toLowerCase()) || a.machineId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'All' || a.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  }) || [];

  return (
    <PageTransition className="space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              <Bell className="w-6 h-6 text-indigo-400" />
            </div>
            Notifications Center
          </h1>
          <p className="text-white/50 mt-2">Manage telemetry alarms and predictive system logs</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="p-2.5 bg-[#09090b]/50 border border-white/10 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all active:scale-95"
            title="Refresh logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleMarkAllRead}
            disabled={filteredAlerts.length === 0}
            className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-semibold transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] flex items-center gap-2 text-sm disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            Mark All as Read
          </button>
        </div>
      </header>

      {/* Filters row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3 flex items-center gap-2 px-4 py-2.5 bg-[#09090b]/50 border border-white/10 rounded-xl focus-within:border-indigo-500/50 transition-colors">
          <Search className="w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-white/30"
          />
        </div>
        <div>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="w-full bg-[#09090b]/50 border border-white/10 rounded-xl px-4 py-2.5 text-white/70 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
          >
            <option value="All">All Severities</option>
            <option value="High">High Severity</option>
            <option value="Medium">Medium Severity</option>
            <option value="Low">Low Severity</option>
          </select>
        </div>
      </div>

      {/* Notifications timeline list */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredAlerts.map((alert, idx) => {
            const isRead = readNotifications.has(idx);
            const isCritical = alert.severity === 'High';
            const isWarning = alert.severity === 'Medium';

            return (
              <motion.div
                key={idx}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleToggleRead(idx)}
                className={cn(
                  "relative rounded-2xl border p-5 flex items-start justify-between gap-4 cursor-pointer hover:border-white/15 transition-all shadow-md",
                  isRead ? "bg-white/[0.01] border-white/[0.03] opacity-60" : "bg-white/[0.03] border-white/[0.07]",
                  !isRead && isCritical && "border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.05)]"
                )}
              >
                {!isRead && (
                  <div className={cn(
                    "absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl",
                    isCritical ? "bg-rose-500 shadow-[0_0_10px_#f43f5e]" : isWarning ? "bg-amber-500" : "bg-blue-500"
                  )} />
                )}

                <div className="flex items-start gap-4">
                  <div className={cn("p-3 rounded-xl border shrink-0",
                    isCritical ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                    isWarning ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                    "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  )}>
                    {isCritical ? <AlertOctagon className="w-5 h-5" /> :
                     isWarning ? <AlertTriangle className="w-5 h-5" /> :
                     <Info className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-xs font-mono font-bold text-white/50 bg-[#09090b] px-2.5 py-1 rounded-md border border-white/5">
                        {alert.machineId}
                      </span>
                      <span className={cn("text-xs font-black tracking-widest uppercase",
                        isCritical ? "text-rose-400" : isWarning ? "text-amber-400" : "text-blue-400"
                      )}>
                        {alert.severity} Severity
                      </span>
                      <span className="text-xs text-white/30 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString() : 'Just now'}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-white leading-relaxed">{alert.message}</p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleRead(idx);
                  }}
                  className={cn("p-2 rounded-lg border transition-all text-xs font-semibold",
                    isRead ? "border-white/5 text-white/30 bg-transparent hover:text-white" : "border-indigo-500/20 text-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10"
                  )}
                >
                  {isRead ? 'Mark Unread' : 'Mark Read'}
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredAlerts.length === 0 && (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
            <Bell className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-1">No notifications matching criteria</h3>
            <p className="text-white/40">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Notifications;
