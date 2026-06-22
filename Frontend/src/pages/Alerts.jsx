import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, Info, AlertTriangle, Clock, Filter, ShieldCheck, Calendar } from 'lucide-react';
import { useAlerts } from '../hooks/useAlerts';
import PageTransition from '../components/PageTransition';
import { cn } from '../utils/cn';

const Alerts = () => {
  const { data: alerts, isLoading } = useAlerts();

  if (isLoading && !alerts) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="w-12 h-12 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <PageTransition className="space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <div className="p-2 bg-rose-500/20 rounded-xl border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
              <AlertOctagon className="w-6 h-6 text-rose-400" />
            </div>
            System Alerts
          </h1>
          <p className="text-white/50 mt-2">Real-time notifications and critical warnings</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-medium transition-colors">
            <Filter className="w-4 h-4" />
            Filter Timeline
          </button>
        </div>
      </header>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-white/10 hidden md:block" />
        
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {alerts?.map((alert, idx) => {
              const isCritical = alert.alertType === 'Critical' || alert.alertType === 'Overheating';
              const isWarning = alert.alertType === 'Warning';
              
              return (
                <motion.div 
                  key={idx}
                  layout
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="relative flex items-start gap-6 md:gap-8"
                >
                  <div className={cn("hidden md:flex w-16 shrink-0 flex-col items-center pt-2 relative z-10")}>
                    <div className={cn("w-4 h-4 rounded-full ring-4 ring-[#09090b] mb-2", 
                      isCritical ? "bg-rose-500" : isWarning ? "bg-amber-500" : "bg-indigo-500"
                    )} />
                    <span className="text-xs font-bold text-white/40 uppercase tracking-widest bg-[#09090b] py-1">
                      {alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'NOW'}
                    </span>
                  </div>

                  <div className={cn(
                    "flex-1 relative rounded-2xl p-6 border overflow-hidden group transition-all hover:shadow-2xl",
                    isCritical ? "bg-rose-500/5 border-rose-500/20 hover:bg-rose-500/10 hover:border-rose-500/40 shadow-[0_4px_20px_rgba(244,63,94,0.05)]" : 
                    isWarning ? "bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10 hover:border-amber-500/40" : 
                    "bg-indigo-500/5 border-indigo-500/20 hover:bg-indigo-500/10 hover:border-indigo-500/40"
                  )}>
                    {isCritical && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
                    )}
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between">
                      <div className="flex items-start gap-5">
                        <div className={cn("p-3.5 rounded-xl flex-shrink-0 border",
                          isCritical ? "bg-rose-500/20 text-rose-400 border-rose-500/30" : 
                          isWarning ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : 
                          "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
                        )}>
                          {isCritical ? <AlertOctagon className={cn("w-6 h-6", isCritical && "animate-pulse")} /> : 
                           isWarning ? <AlertTriangle className="w-6 h-6" /> : 
                           <Info className="w-6 h-6" />}
                        </div>
                        
                        <div>
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#09090b] border border-white/10 text-white/70 shadow-sm font-mono">
                              {alert.machineId}
                            </span>
                            <span className={cn("text-xs font-black tracking-widest uppercase",
                              isCritical ? "text-rose-400" : isWarning ? "text-amber-400" : "text-indigo-400"
                            )}>
                              {alert.alertType}
                            </span>
                            <div className="md:hidden flex items-center gap-1.5 text-xs font-medium text-white/40 ml-2">
                              <Clock className="w-3.5 h-3.5" />
                              {alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString() : 'Just now'}
                            </div>
                          </div>
                          <h3 className="text-white text-lg font-medium">{alert.message}</h3>
                        </div>
                      </div>

                      {isCritical && (
                        <button className="w-full sm:w-auto px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)] hover:shadow-[0_0_25px_rgba(244,63,94,0.5)] active:scale-95 shrink-0 mt-4 sm:mt-0">
                          Take Action
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {(!alerts || alerts.length === 0) && !isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl p-16 text-center border border-dashed border-white/10 bg-white/[0.01] ml-0 md:ml-24"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-400 mb-6 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">System Optimal</h3>
              <p className="text-white/50 max-w-sm mx-auto">There are currently no active alerts in the timeline. All systems are functioning securely.</p>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Alerts;
