import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, AlertTriangle, ShieldCheck, Wrench, Clock } from 'lucide-react';
import { usePredictions } from '../hooks/usePredictions';
import PageTransition from '../components/PageTransition';
import { cn } from '../utils/cn';

const CircularProgress = ({ percentage, colorClass }) => {
  const strokeDasharray = `${(percentage * 251.2) / 100} 251.2`;
  return (
    <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
      <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
        <motion.circle 
          initial={{ strokeDasharray: "0 251.2" }}
          animate={{ strokeDasharray }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="6" fill="transparent"
          strokeLinecap="round"
          className={colorClass}
        />
      </svg>
      <div className="text-center">
        <div className={cn("text-2xl font-black tracking-tighter leading-none", colorClass)}>{percentage}%</div>
      </div>
    </div>
  );
};

const Predictions = () => {
  const { data: predictions, isLoading } = usePredictions();
  const navigate = useNavigate();

  if (isLoading && !predictions) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  const getRiskDetails = (status) => {
    switch (status?.toLowerCase()) {
      case 'critical':
        return {
          level: 'High',
          color: 'text-rose-400',
          bg: 'bg-rose-500',
          bgLight: 'bg-rose-500/10 border-rose-500/20',
          icon: AlertTriangle,
          border: 'border-rose-500/30',
          shadow: 'shadow-[0_0_30px_rgba(244,63,94,0.1)]',
          barColor: 'bg-rose-500'
        };
      case 'warning':
        return {
          level: 'Medium',
          color: 'text-amber-400',
          bg: 'bg-amber-500',
          bgLight: 'bg-amber-500/10 border-amber-500/20',
          icon: TrendingUp,
          border: 'border-amber-500/30',
          shadow: 'shadow-[0_0_30px_rgba(245,158,11,0.1)]',
          barColor: 'bg-amber-500'
        };
      case 'healthy':
      default:
        return {
          level: 'Low',
          color: 'text-emerald-400',
          bg: 'bg-emerald-500',
          bgLight: 'bg-emerald-500/10 border-emerald-400/20',
          icon: ShieldCheck,
          border: 'border-emerald-500/30',
          shadow: 'shadow-[0_0_30px_rgba(16,185,129,0.1)]',
          barColor: 'bg-emerald-500'
        };
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <PageTransition className="space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-xl border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            Predictive Maintenance
          </h1>
          <p className="text-white/50 mt-2">AI-driven failure probability indices and dynamic Remaining Useful Life (RUL) estimates</p>
        </div>
      </header>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6"
      >
        {predictions?.map((pred) => {
          const risk = getRiskDetails(pred.healthStatus);
          const RiskIcon = risk.icon;
          const rulValue = pred.remainingUsefulLife || 2000;
          const maxRUL = 4000;
          const rulPercentage = Math.min((rulValue / maxRUL) * 100, 100);

          return (
            <motion.div 
              key={pred.machineId} 
              variants={item}
              className={cn("group relative rounded-3xl bg-[#09090b]/55 border p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between", risk.border, risk.shadow)}
            >
              <div className={cn("absolute top-0 right-0 w-64 h-64 opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl transition-opacity group-hover:opacity-10", risk.bg)} />
              
              <div>
                <div className="flex justify-between items-start mb-5 relative z-10">
                  <div>
                    <h3 className="text-xl font-extrabold text-white mb-2">Machine {pred.machineId}</h3>
                    <div className={cn("flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border w-max", risk.color, risk.bgLight)}>
                      <RiskIcon className="w-3.5 h-3.5" />
                      {risk.level} Risk
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 py-4 relative z-10">
                  <CircularProgress percentage={Number(pred.failureProbability || 0)} colorClass={risk.color} />
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 text-white/50 text-xs font-semibold">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      Remaining Useful Life
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-white">{rulValue.toLocaleString()}</span>
                        <span className="text-xs font-bold text-white/40">Hours</span>
                      </div>
                      
                      {/* RUL Progress Bar */}
                      <div className="w-full bg-white/5 rounded-full h-1.5 mt-2">
                        <div
                          className={cn("h-1.5 rounded-full", risk.barColor)}
                          style={{ width: `${rulPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/[0.05] relative z-10">
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Wrench className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">AI Insight & Diagnostics</span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed">
                      {pred.recommendation || "Operating optimally. Normal maintenance cycles apply."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 relative z-10 flex items-center justify-between border-t border-white/5">
                <span className="text-[10px] text-white/30 font-mono">Last analysis: {pred.timestamp ? new Date(pred.timestamp).toLocaleTimeString() : 'Just now'}</span>
                {(pred.healthStatus === 'Critical' || pred.healthStatus === 'Warning') && (
                  <button
                    onClick={() => navigate('/maintenance')}
                    className="px-3.5 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all shadow-[0_0_10px_rgba(99,102,241,0.2)]"
                  >
                    Schedule PM
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}

        {(!predictions || predictions.length === 0) && !isLoading && (
          <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
            <Brain className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-1">No Predictions Available</h3>
            <p className="text-white/40">The AI core requires more baseline telemetry to produce risk statistics.</p>
          </div>
        )}
      </motion.div>
    </PageTransition>
  );
};

export default Predictions;
