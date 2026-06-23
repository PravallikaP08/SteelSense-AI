import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, Info, AlertTriangle, Clock, ShieldCheck, Calendar, X } from 'lucide-react';
import { useAlerts } from '../hooks/useAlerts';
import PageTransition from '../components/PageTransition';
import { cn } from '../utils/cn';

const FILTERS = ['All', 'Critical', 'Warning', 'Info'];

const Alerts = () => {
  const { data: alerts, isLoading } = useAlerts();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');

  if (isLoading && !alerts) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="w-12 h-12 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
      </div>
    );
  }

  const filteredAlerts = alerts?.filter((alert) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Critical') return alert.alertType === 'Critical' || alert.alertType === 'Overheating' || alert.severity === 'High' || alert.severity === 'Critical';
    if (activeFilter === 'Warning') return alert.alertType === 'Warning' || alert.severity === 'Medium';
    if (activeFilter === 'Info') return alert.alertType === 'Info' || alert.severity === 'Low';
    return true;
  }) || [];

  const alertCounts = {
    All: alerts?.length || 0,
    Critical: alerts?.filter(a => a.alertType === 'Critical' || a.alertType === 'Overheating' || a.severity === 'High' || a.severity === 'Critical').length || 0,
    Warning: alerts?.filter(a => a.alertType === 'Warning' || a.severity === 'Medium').length || 0,
    Info: alerts?.filter(a => a.alertType === 'Info' || a.severity === 'Low').length || 0,
  };

  return (
    <PageTransition className="space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <div className="p-2 bg-rose-500/20 rounded-xl border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
              <AlertOctagon className="w-6 h-6 text-rose-400" />
            </div>
            System Alerts
          </h1>
          <p className="text-white/50 mt-2">Real-time alarm timeline with severity classification</p>
        </div>
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] p-1 rounded-xl self-start md:self-auto">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                activeFilter === filter
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-white/40 hover:text-white/70"
              )}
            >
              {filter}
              {alertCounts[filter] > 0 && (
                <span className={cn(
                  "text-[9px] font-black px-1.5 py-0.5 rounded-full",
                  filter === 'Critical' ? "bg-rose-500/20 text-rose-400" :
                  filter === 'Warning' ? "bg-amber-500/20 text-amber-400" :
                  "bg-white/10 text-white/60"
                )}>
                  {alertCounts[filter]}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Summary Stat Bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Critical', count: alertCounts.Critical, color: 'text-rose-400', bg: 'bg-rose-500/5 border-rose-500/15' },
          { label: 'Warning', count: alertCounts.Warning, color: 'text-amber-400', bg: 'bg-amber-500/5 border-amber-500/15' },
          { label: 'Info', count: alertCounts.Info, color: 'text-indigo-400', bg: 'bg-indigo-500/5 border-indigo-500/15' },
        ].map(({ label, count, color, bg }) => (
          <div key={label} className={cn("rounded-xl border p-4 text-center cursor-pointer transition-all hover:opacity-80", bg)} onClick={() => setActiveFilter(label)}>
            <p className={cn("text-3xl font-black", color)}>{count}</p>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mt-1">{label} Alarms</p>
          </div>
        ))}
      </div>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-white/5 hidden md:block" />

        <div className="space-y-5">
          <AnimatePresence mode="popLayout">
            {filteredAlerts.map((alert, idx) => {
              const isCritical = alert.alertType === 'Critical' || alert.alertType === 'Overheating' || alert.severity === 'High' || alert.severity === 'Critical';
              const isWarning = alert.alertType === 'Warning' || alert.severity === 'Medium';

              return (
                <motion.div
                  key={alert._id || idx}
                  layout
                  initial={{ opacity: 0, x: -20, scale: 0.97 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.3) }}
                  className="relative flex items-start gap-6 md:gap-8"
                >
                  <div className="hidden md:flex w-16 shrink-0 flex-col items-center pt-2 relative z-10">
                    <div className={cn("w-4 h-4 rounded-full ring-4 ring-[#09090b] mb-2",
                      isCritical ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]" :
                      isWarning ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]" :
                      "bg-indigo-500"
                    )} />
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest bg-[#09090b] py-1">
                      {alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'NOW'}
                    </span>
                  </div>

                  <div className={cn(
                    "flex-1 relative rounded-2xl p-5 border overflow-hidden group transition-all duration-300 hover:shadow-2xl",
                    isCritical ? "bg-rose-500/5 border-rose-500/20 hover:bg-rose-500/8 hover:border-rose-500/35 shadow-[0_4px_20px_rgba(244,63,94,0.04)]" :
                    isWarning ? "bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/8 hover:border-amber-500/35" :
                    "bg-indigo-500/5 border-indigo-500/20 hover:bg-indigo-500/8 hover:border-indigo-500/35"
                  )}>
                    {isCritical && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-400 to-rose-600 shadow-[0_0_12px_rgba(244,63,94,0.7)]" />
                    )}

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                      <div className="flex items-start gap-4">
                        <div className={cn("p-3 rounded-xl flex-shrink-0 border transition-transform group-hover:scale-105",
                          isCritical ? "bg-rose-500/15 text-rose-400 border-rose-500/25" :
                          isWarning ? "bg-amber-500/15 text-amber-400 border-amber-500/25" :
                          "bg-indigo-500/15 text-indigo-400 border-indigo-500/25"
                        )}>
                          {isCritical ? <AlertOctagon className="w-5 h-5 animate-pulse" /> :
                           isWarning ? <AlertTriangle className="w-5 h-5" /> :
                           <Info className="w-5 h-5" />}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2.5 mb-2">
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-[#09090b]/60 border border-white/10 text-white/60 font-mono">
                              {alert.machineId}
                            </span>
                            <span className={cn("text-[10px] font-black tracking-widest uppercase",
                              isCritical ? "text-rose-400" : isWarning ? "text-amber-400" : "text-indigo-400"
                            )}>
                              {alert.alertType || alert.severity}
                            </span>
                            <div className="flex items-center gap-1 text-xs font-medium text-white/30 md:hidden">
                              <Clock className="w-3.5 h-3.5" />
                              {alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString() : 'Just now'}
                            </div>
                          </div>
                          <h3 className="text-white text-base font-semibold leading-snug">{alert.message}</h3>
                        </div>
                      </div>

                      {isCritical && (
                        <button
                          onClick={() => navigate('/maintenance')}
                          className="w-full sm:w-auto px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)] hover:shadow-[0_0_25px_rgba(244,63,94,0.5)] active:scale-95 shrink-0 text-sm"
                        >
                          Schedule Repair
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredAlerts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl p-16 text-center border border-dashed border-white/10 bg-white/[0.01] ml-0 md:ml-24"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-400 mb-6 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">All Clear</h3>
              <p className="text-white/50 max-w-sm mx-auto">
                {activeFilter === 'All'
                  ? 'No active alerts in the timeline. All systems are operating normally.'
                  : `No ${activeFilter.toLowerCase()} alerts found. Try a different filter.`}
              </p>
              {activeFilter !== 'All' && (
                <button
                  onClick={() => setActiveFilter('All')}
                  className="mt-6 px-5 py-2 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm font-semibold flex items-center gap-2 mx-auto"
                >
                  <X className="w-4 h-4" />
                  Clear Filter
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Alerts;
