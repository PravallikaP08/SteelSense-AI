import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Thermometer, Gauge, Clock, Radio, Zap } from 'lucide-react';
import { useSensors } from '../hooks/useSensors';
import PageTransition from '../components/PageTransition';
import { cn } from '../utils/cn';

const GaugeRing = ({ value, max, color, label, icon: Icon, unit }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const strokeDasharray = `${(percentage * 251.2) / 100} 251.2`;

  return (
    <div className="relative flex flex-col items-center justify-center p-4 bg-white/[0.02] rounded-2xl border border-white/[0.05]">
      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
        <motion.circle 
          initial={{ strokeDasharray: "0 251.2" }}
          animate={{ strokeDasharray }}
          transition={{ duration: 1, ease: "easeOut" }}
          cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent"
          strokeLinecap="round"
          className={color}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
        <Icon className={cn("w-4 h-4 mb-1", color)} />
        <span className="text-xl font-bold text-white leading-none">{value}</span>
      </div>
      <div className="mt-4 flex items-center justify-between w-full px-2">
        <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">{label}</span>
        <span className="text-xs font-medium text-white/30">{unit}</span>
      </div>
    </div>
  );
};

const Sensors = () => {
  const { data: sensors, isLoading } = useSensors();

  if (isLoading && !sensors) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <PageTransition className="space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Live Telemetry</h1>
          <p className="text-white/50 mt-1">Real-time sensor data feeds</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400 text-sm font-medium shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <Radio className="w-4 h-4 animate-pulse" />
          Streaming Live
        </div>
      </header>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6"
      >
        {sensors?.map((sensor) => (
          <motion.div 
            key={sensor.machineId} 
            variants={item}
            className="group rounded-3xl bg-[#09090b]/50 border border-white/[0.05] p-6 hover:border-cyan-500/30 transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Machine {sensor.machineId}</h3>
                  <span className="text-xs text-white/40 font-mono tracking-widest uppercase">ID: {sensor.machineId}</span>
                </div>
              </div>
              <span className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                LIVE
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <GaugeRing value={Number(sensor.temperature || 0)} max={150} color="text-orange-500" label="Temp" icon={Thermometer} unit="°C" />
              <GaugeRing value={Number(sensor.pressure || 0)} max={100} color="text-cyan-500" label="Pressure" icon={Gauge} unit="PSI" />
              <GaugeRing value={Number(sensor.vibration || 0)} max={50} color="text-purple-500" label="Vibration" icon={Activity} unit="mm/s" />
              <div className="relative flex flex-col justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/[0.05]">
                <div className="flex items-center justify-between mb-4">
                  <Clock className="w-5 h-5 text-indigo-400" />
                  <span className="text-xs font-semibold text-white/30 uppercase tracking-widest">Runtime</span>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">{Number(sensor.runtimeHours || 0).toLocaleString()}</div>
                  <div className="text-xs font-medium text-white/40 mt-1">Total Hours</div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {(!sensors || sensors.length === 0) && !isLoading && (
          <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
            <Radio className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-1">No Active Sensors</h3>
            <p className="text-white/40">Connect sensors to view live telemetry.</p>
          </div>
        )}
      </motion.div>
    </PageTransition>
  );
};

export default Sensors;
