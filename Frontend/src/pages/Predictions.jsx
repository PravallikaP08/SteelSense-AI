import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, AlertTriangle, ShieldCheck, Wrench } from 'lucide-react';
import { usePredictions } from '../hooks/usePredictions';
import PageTransition from '../components/PageTransition';
import { cn } from '../utils/cn';

const CircularProgress = ({ percentage, colorClass }) => {
  const strokeDasharray = `${(percentage * 251.2) / 100} 251.2`;
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
        <motion.circle 
          initial={{ strokeDasharray: "0 251.2" }}
          animate={{ strokeDasharray }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="6" fill="transparent"
          strokeLinecap="round"
          className={colorClass}
        />
      </svg>
      <div className="text-center">
        <div className={cn("text-3xl font-black tracking-tighter leading-none", colorClass)}>{percentage}%</div>
      </div>
    </div>
  );
};

const Predictions = () => {
  const { data: predictions, isLoading } = usePredictions();

  if (isLoading && !predictions) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  const getRiskDetails = (level) => {
    switch(level?.toLowerCase()) {
      case 'high': return { color: 'rose', bg: 'bg-rose-500', text: 'text-rose-400', icon: AlertTriangle, border: 'border-rose-500/30', shadow: 'shadow-[0_0_30px_rgba(244,63,94,0.15)]' };
      case 'medium': return { color: 'amber', bg: 'bg-amber-500', text: 'text-amber-400', icon: TrendingUp, border: 'border-amber-500/30', shadow: 'shadow-[0_0_30px_rgba(245,158,11,0.15)]' };
      case 'low': return { color: 'emerald', bg: 'bg-emerald-500', text: 'text-emerald-400', icon: ShieldCheck, border: 'border-emerald-500/30', shadow: 'shadow-[0_0_30px_rgba(16,185,129,0.15)]' };
      default: return { color: 'slate', bg: 'bg-slate-500', text: 'text-slate-400', icon: Brain, border: 'border-white/10', shadow: '' };
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
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
          <p className="text-white/50 mt-2">AI-driven failure probability and risk assessment</p>
        </div>
      </header>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {predictions?.map((pred) => {
          const risk = getRiskDetails(pred.riskLevel);
          const RiskIcon = risk.icon;

          return (
            <motion.div 
              key={pred.machineId} 
              variants={item}
              className={cn("group relative rounded-2xl bg-[#09090b]/50 border p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl", risk.border, risk.shadow)}
            >
              <div className={cn(`absolute top-0 right-0 w-64 h-64 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl transition-opacity group-hover:opacity-20`, risk.bg)} />
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Machine {pred.machineId}</h3>
                  <div className={cn("flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border w-max", risk.text, risk.border.replace('border-', 'bg-').replace('/30', '/10'))}>
                    <RiskIcon className="w-3.5 h-3.5" />
                    {pred.riskLevel} Risk
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center py-4 relative z-10">
                <CircularProgress percentage={Number(pred.failureProbability || 0)} colorClass={risk.text} />
                <span className="text-xs font-bold text-white/40 uppercase tracking-widest mt-4">Failure Probability</span>
              </div>

              <div className="mt-6 pt-5 border-t border-white/[0.05] relative z-10">
                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Wrench className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-semibold text-white">AI Recommendation</span>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {pred.riskLevel === 'High' ? "Critical maintenance required within 24 hours. Immediate inspection advised." :
                     pred.riskLevel === 'Medium' ? "Schedule preventative maintenance within 7 days. Monitor closely." :
                     "Operating optimally. Regular maintenance schedule applies."}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}

        {(!predictions || predictions.length === 0) && !isLoading && (
          <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
            <Brain className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-1">No Predictions Available</h3>
            <p className="text-white/40">The AI model requires more data to generate insights.</p>
          </div>
        )}
      </motion.div>
    </PageTransition>
  );
};

export default Predictions;
