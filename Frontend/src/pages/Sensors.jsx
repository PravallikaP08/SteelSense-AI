import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Thermometer, Gauge, Clock, Radio, Zap, RotateCw, RefreshCw } from 'lucide-react';
import { useSensors } from '../hooks/useSensors';
import PageTransition from '../components/PageTransition';
import { cn } from '../utils/cn';

const GaugeRing = ({ value, max, color, label, icon: Icon, unit }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const strokeDasharray = `${(percentage * 188.4) / 100} 188.4`; // r=30 circle -> 2 * PI * 30 = 188.4

  return (
    <div className="relative flex flex-col items-center justify-center p-3 bg-white/[0.02] rounded-2xl border border-white/[0.05] hover:bg-white/[0.04] transition-all hover:scale-[1.02]">
      <svg className="w-18 h-18 transform -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="30" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
        <motion.circle 
          initial={{ strokeDasharray: "0 188.4" }}
          animate={{ strokeDasharray }}
          transition={{ duration: 1, ease: "easeOut" }}
          cx="40" cy="40" r="30" stroke="currentColor" strokeWidth="6" fill="transparent"
          strokeLinecap="round"
          className={color}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-1.5">
        <Icon className={cn("w-3.5 h-3.5 mb-0.5", color)} />
        <span className="text-sm font-black text-white leading-none">{value}</span>
      </div>
      <div className="mt-2.5 flex items-center justify-between w-full px-1">
        <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{label}</span>
        <span className="text-[9px] font-semibold text-white/30">{unit}</span>
      </div>
    </div>
  );
};

const Sensors = () => {
  const { data: sensors, isLoading, refetch } = useSensors();

  if (isLoading && !sensors) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <PageTransition className="space-y-8 pb-10">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-xl border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Activity className="w-6 h-6 text-cyan-400" />
            </div>
            Live Telemetry
          </h1>
          <p className="text-white/50 mt-2">Real-time sensor logs streaming continuously from all 8 machine units</p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => refetch()}
            className="p-2.5 bg-[#09090b]/50 border border-white/10 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all active:scale-95"
            title="Refresh feeds"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400 text-sm font-semibold shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <Radio className="w-4 h-4 animate-pulse" />
            Streaming Live
          </div>
        </div>
      </header>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6"
      >
        {sensors?.map((sensor) => {
          // Adjust max levels depending on machine characteristics
          const isFurnace = sensor.machineId === 'STE-H02';
          const isRobotic = sensor.machineId === 'ROB-G05';
          const maxTemp = isFurnace ? 1500 : 150;
          const maxVolt = isFurnace ? 600 : isRobotic ? 40 : 450;
          const maxPower = isFurnace ? 120 : 25;
          const maxRpm = 3500;

          return (
            <motion.div 
              key={sensor.machineId} 
              variants={item}
              className="group rounded-3xl bg-[#09090b]/55 border border-white/[0.05] p-6 hover:border-cyan-500/30 transition-all hover:shadow-[0_0_35px_rgba(6,182,212,0.06)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl border border-cyan-500/25 bg-cyan-500/10 text-cyan-400">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">Machine {sensor.machineId}</h3>
                    <span className="text-[10px] text-white/40 font-mono tracking-widest uppercase font-bold">Telemetry Node</span>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE
                </span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 relative z-10">
                <GaugeRing value={Number(sensor.temperature || 0)} max={maxTemp} color="text-orange-500" label="Temp" icon={Thermometer} unit="°C" />
                <GaugeRing value={Number(sensor.pressure || 0)} max={100} color="text-cyan-500" label="Pressure" icon={Gauge} unit="PSI" />
                <GaugeRing value={Number(sensor.vibration || 0)} max={25} color="text-purple-500" label="Vibration" icon={Activity} unit="mm/s" />
                <GaugeRing value={Number(sensor.voltage || 220)} max={maxVolt} color="text-yellow-500" label="Voltage" icon={Zap} unit="V" />
                <GaugeRing value={Number(sensor.rpm || 0)} max={maxRpm} color="text-emerald-500" label="Speed" icon={RotateCw} unit="RPM" />
                <GaugeRing value={Number(sensor.powerConsumption || 0)} max={maxPower} color="text-red-500" label="Power" icon={Zap} unit="kW" />
              </div>

              <div className="mt-4 p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Total Runtime</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-white">{Number(sensor.runtimeHours || 0).toLocaleString()}</span>
                  <span className="text-[9px] font-semibold text-white/30 ml-1">Hours</span>
                </div>
              </div>
            </motion.div>
          );
        })}
        {(!sensors || sensors.length === 0) && !isLoading && (
          <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
            <Radio className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-1">No Active Feeds</h3>
            <p className="text-white/40">Connect machine diagnostic sensors to activate live monitoring.</p>
          </div>
        )}
      </motion.div>
    </PageTransition>
  );
};

export default Sensors;
