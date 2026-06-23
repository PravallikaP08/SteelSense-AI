import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Server, Database, Cpu, Activity, Wifi, RefreshCw, CheckCircle, XCircle, AlertTriangle, Terminal, Zap } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import api from '../services/api';

const StatusBadge = ({ status }) => {
  const isUp = status === 'up';
  const isWarning = status === 'warning';
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
      isUp ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' :
      isWarning ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' :
      'text-rose-400 bg-rose-400/10 border-rose-400/20'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isUp ? 'bg-emerald-400 animate-pulse' : isWarning ? 'bg-amber-400 animate-pulse' : 'bg-rose-400'}`} />
      {isUp ? 'Online' : isWarning ? 'Degraded' : 'Offline'}
    </span>
  );
};

const logEntries = [
  { time: '12:00:03', level: 'SUCCESS', msg: 'Connection established with primary MongoDB cluster' },
  { time: '12:00:06', level: 'INFO', msg: 'Prediction engine initialized — 8 machine models loaded' },
  { time: '12:00:09', level: 'DATA', msg: 'Polled 8 machines via IoT gateway — 12ms latency' },
  { time: '12:00:12', level: 'WARN', msg: 'Vibration threshold exceeded on ROB-G05 — alert emitted' },
  { time: '12:00:15', level: 'SUCCESS', msg: 'JWT authentication tokens verified successfully' },
  { time: '12:00:18', level: 'DATA', msg: 'Sensor data batch written to MongoDB — 8 documents' },
  { time: '12:00:21', level: 'INFO', msg: 'Worker thread pool: 4/4 threads active and healthy' },
  { time: '12:00:24', level: 'DATA', msg: 'Generated 2 predictive maintenance alerts (medium risk)' },
  { time: '12:00:27', level: 'SUCCESS', msg: 'Automatic telemetry backup completed at 12:00 AM' },
  { time: '12:00:30', level: 'DATA', msg: 'Fleet analytics recomputed — OEE: 92.4%' },
];

const levelColor = { SUCCESS: 'text-emerald-400', INFO: 'text-indigo-400', WARN: 'text-amber-400', DATA: 'text-slate-400', ERROR: 'text-rose-400' };

const SystemHealth = () => {
  const [ping, setPing] = useState(null);
  const [pingStatus, setPingStatus] = useState('checking');
  const [lastChecked, setLastChecked] = useState(new Date());
  const [liveLog, setLiveLog] = useState(logEntries.slice(0, 5));

  const checkServer = async () => {
    setPingStatus('checking');
    const start = Date.now();
    try {
      await api.get('/machines');
      const elapsed = Date.now() - start;
      setPing(elapsed);
      setPingStatus('up');
    } catch {
      setPingStatus('down');
      setPing(null);
    }
    setLastChecked(new Date());
  };

  useEffect(() => {
    checkServer();
    // Animate log entries
    let i = 5;
    const interval = setInterval(() => {
      if (i < logEntries.length) {
        setLiveLog(prev => [...prev, logEntries[i]]);
        i++;
      }
    }, 900);
    return () => clearInterval(interval);
  }, []);

  const services = [
    { name: 'API Server', desc: 'Node.js / Express', icon: Server, status: pingStatus === 'up' ? 'up' : pingStatus === 'down' ? 'down' : 'warning', metric: ping ? `${ping}ms` : 'N/A', color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20' },
    { name: 'MongoDB', desc: 'Primary cluster', icon: Database, status: pingStatus === 'up' ? 'up' : 'warning', metric: 'Connected', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
    { name: 'Prediction Engine', desc: 'AI inference layer', icon: Cpu, status: 'up', metric: '8 models', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
    { name: 'IoT Gateway', desc: 'Telemetry stream', icon: Wifi, status: 'up', metric: '3s intervals', color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20' },
    { name: 'Alert Engine', desc: 'Real-time monitoring', icon: Zap, status: 'up', metric: 'Active', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
    { name: 'Avg Latency', desc: 'API response time', icon: Activity, status: ping && ping < 200 ? 'up' : ping ? 'warning' : 'warning', metric: ping ? `${ping}ms` : '—', color: 'text-rose-400 bg-rose-400/10 border-rose-400/20' },
  ];

  return (
    <PageTransition className="space-y-8 pb-10">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Activity className="w-6 h-6 text-emerald-400" />
            </div>
            System Health
          </h1>
          <p className="text-white/50 mt-2">Real-time status of backend services and infrastructure components</p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <p className="text-[10px] text-white/30 font-mono">Last checked: {lastChecked.toLocaleTimeString()}</p>
          <button
            onClick={checkServer}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm font-semibold"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </header>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((svc, i) => (
          <motion.div
            key={svc.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="rounded-2xl bg-[#09090b]/50 border border-white/[0.05] p-5 flex items-center gap-4 hover:bg-white/[0.02] transition-all shadow-lg"
          >
            <div className={`p-3 rounded-xl border shrink-0 ${svc.color}`}>
              <svc.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-white">{svc.name}</p>
                <StatusBadge status={svc.status} />
              </div>
              <div className="flex items-center justify-between gap-2 mt-1">
                <p className="text-xs text-white/40">{svc.desc}</p>
                <span className="text-xs font-mono font-bold text-white/60">{svc.metric}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Live Log Terminal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl bg-[#09090b]/70 border border-white/[0.05] p-6 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-slate-500/10 border border-slate-500/20 rounded-xl">
            <Terminal className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">System Log Feed</h3>
            <p className="text-xs text-white/40">Live infrastructure event stream</p>
          </div>
          <span className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
        </div>
        <div className="bg-black/40 border border-white/5 rounded-xl p-4 font-mono text-xs space-y-2 h-60 overflow-y-auto custom-scrollbar">
          {liveLog.map((entry, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-3"
            >
              <span className="text-white/30 shrink-0">{entry.time}</span>
              <span className={`font-bold w-14 shrink-0 ${levelColor[entry.level] || 'text-white/50'}`}>[{entry.level}]</span>
              <span className="text-slate-300 leading-relaxed">{entry.msg}</span>
            </motion.div>
          ))}
          <motion.div
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="flex items-center gap-2 text-white/40"
          >
            <span>▋</span>
          </motion.div>
        </div>
      </motion.div>
    </PageTransition>
  );
};

export default SystemHealth;
