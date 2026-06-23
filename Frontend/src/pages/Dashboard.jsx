import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Server, Activity, AlertTriangle, Thermometer, Gauge, Zap,
  CheckCircle2, ShieldAlert, TrendingUp, Clock, Wrench, BarChart2,
  Brain, ArrowUpRight, Radio, ChevronRight
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useAnalytics } from '../hooks/useAnalytics';
import { useAlerts } from '../hooks/useAlerts';
import { usePredictions } from '../hooks/usePredictions';
import { useMachines } from '../hooks/useMachines';
import PageTransition from '../components/PageTransition';
import { cn } from '../utils/cn';

const StatCard = ({ title, value, icon: Icon, trend, colorClass, delay = 0, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    onClick={onClick}
    className={cn(
      "group relative overflow-hidden rounded-2xl bg-[#09090b]/50 border border-white/[0.05] p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)] transition-all duration-300",
      onClick ? "hover:bg-white/[0.03] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.6)] hover:-translate-y-0.5 cursor-pointer" : ""
    )}
  >
    <div className={cn("absolute top-0 right-0 w-40 h-40 blur-3xl opacity-15 transition-opacity group-hover:opacity-30 rounded-full translate-x-1/2 -translate-y-1/2", colorClass)} />
    <div className="relative z-10 flex justify-between items-start">
      <div>
        <p className="text-xs font-semibold text-white/40 mb-2 tracking-widest uppercase">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-4xl font-black tracking-tight text-white">{value}</h3>
          {trend && (
            <span className={cn("text-xs font-bold", trend.startsWith('+') ? "text-emerald-400" : "text-rose-400")}>
              {trend}
            </span>
          )}
        </div>
      </div>
      <div className={cn("p-3.5 rounded-xl border border-white/5 shadow-inner", colorClass.replace('bg-', 'text-'))}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
    {onClick && (
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowUpRight className="w-4 h-4 text-white/40" />
      </div>
    )}
  </motion.div>
);

const NavCard = ({ title, description, icon: Icon, path, color, delay = 0 }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      onClick={() => navigate(path)}
      className="group relative rounded-2xl bg-[#09090b]/50 border border-white/[0.05] p-5 cursor-pointer hover:bg-white/[0.03] hover:border-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl overflow-hidden"
    >
      <div className={cn("absolute top-0 right-0 w-28 h-28 blur-3xl opacity-10 group-hover:opacity-20 transition-opacity rounded-full translate-x-1/2 -translate-y-1/2", color)} />
      <div className="flex items-start gap-4 relative z-10">
        <div className={cn("p-2.5 rounded-xl border border-white/5", color.replace('bg-', 'bg-').replace('500', '500/15'), "text-white/80")}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white">{title}</p>
          <p className="text-xs text-white/40 mt-0.5 leading-relaxed">{description}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 group-hover:translate-x-1 transition-all shrink-0 mt-0.5" />
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();
  const { data: alerts } = useAlerts();
  const { data: predictions } = usePredictions();
  const { data: machines } = useMachines();
  const navigate = useNavigate();

  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (analytics && analytics.averageTemperature !== undefined) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setTimeSeriesData(prev => {
        const newData = [...prev, {
          time: timeStr,
          temp: Number(analytics.averageTemperature).toFixed(1),
          pressure: Number(analytics.averagePressure).toFixed(1)
        }];
        return newData.length > 15 ? newData.slice(newData.length - 15) : newData;
      });
    }
  }, [analytics]);

  if (analyticsLoading && !analytics && timeSeriesData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40 text-sm">Loading plant data...</p>
        </div>
      </div>
    );
  }

  const stats = analytics || { totalMachines: 0, totalAlerts: 0, averageTemperature: 0, averagePressure: 0, averageVibration: 0, machineHealthScore: 0, efficiencyPercentage: 0 };

  // Compute fleet status from machines
  const criticalCount = machines?.filter(m => m.status === 'Critical').length || 0;
  const warningCount = machines?.filter(m => m.status === 'Warning').length || 0;
  const healthyCount = machines?.filter(m => m.status === 'Operational' || m.status === 'Healthy').length || 0;

  // High risk predictions
  const highRiskPredictions = predictions?.filter(p => p.healthStatus === 'Critical' || p.failureProbability >= 70).slice(0, 4) || [];

  const navCards = [
    { title: 'Live Telemetry', description: 'Real-time sensor feeds from all machines', icon: Activity, path: '/sensors', color: 'bg-cyan-500' },
    { title: 'Predictive AI', description: 'Failure probabilities & RUL estimates', icon: Brain, path: '/predictions', color: 'bg-purple-500' },
    { title: 'Maintenance', description: 'Schedule and track service tasks', icon: Wrench, path: '/maintenance', color: 'bg-indigo-500' },
    { title: 'Fleet Analytics', description: 'OEE, downtime, and performance trends', icon: BarChart2, path: '/analytics', color: 'bg-emerald-500' },
  ];

  return (
    <PageTransition className="space-y-8 pb-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-1">Vizag Steel Plant • Industrial IoT Platform</p>
          <h1 className="text-3xl font-black text-white tracking-tight">System Overview</h1>
          <p className="text-white/50 mt-1 text-sm">Real-time telemetry, predictive insights &amp; fleet monitoring</p>
        </div>
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-white/30 font-medium">Plant Clock</p>
            <p className="text-sm font-mono font-bold text-white/70">{currentTime.toLocaleTimeString()}</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-semibold shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <Radio className="w-4 h-4 animate-pulse" />
            All Systems Live
          </div>
        </div>
      </header>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-5">
        <StatCard delay={0.05} title="Total Machines" value={stats.totalMachines || 0} icon={Server} colorClass="bg-indigo-500" onClick={() => navigate('/machines')} />
        <StatCard delay={0.1} title="Active Alerts" value={stats.totalAlerts || alerts?.length || 0} icon={AlertTriangle} trend={criticalCount > 0 ? `${criticalCount} Critical` : ""} colorClass={criticalCount > 0 ? "bg-rose-500" : "bg-emerald-500"} onClick={() => navigate('/alerts')} />
        <StatCard delay={0.15} title="Fleet Health" value={`${stats.machineHealthScore || 94}%`} icon={TrendingUp} trend="+2.1%" colorClass="bg-emerald-500" onClick={() => navigate('/analytics')} />
        <StatCard delay={0.2} title="Avg Temperature" value={`${Number(stats?.averageTemperature || 0).toFixed(1)}°`} icon={Thermometer} colorClass="bg-orange-500" onClick={() => navigate('/sensors')} />
        <StatCard delay={0.25} title="Plant OEE" value={`${stats.efficiencyPercentage || 92}%`} icon={Zap} trend="+1.4%" colorClass="bg-cyan-500" onClick={() => navigate('/analytics')} />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Left - Telemetry Chart (spans 3 cols) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="xl:col-span-3 rounded-2xl bg-[#09090b]/50 border border-white/[0.05] p-6 shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Live Telemetry Trends</h3>
              <p className="text-xs text-white/40 mt-0.5">Temperature &amp; Pressure — 3s intervals</p>
            </div>
            <div className="flex gap-4">
              <span className="flex items-center gap-2 text-xs font-semibold text-white/50">
                <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]" />Temperature
              </span>
              <span className="flex items-center gap-2 text-xs font-semibold text-white/50">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />Pressure
              </span>
            </div>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.15)" fontSize={10} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis stroke="rgba(255,255,255,0.15)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d0d10', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', fontSize: '12px' }}
                  labelStyle={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700, marginBottom: 4 }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="temp" name="Temp (°C)" stroke="#818cf8" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTemp)" dot={false} />
                <Area type="monotone" dataKey="pressure" name="Pressure" stroke="#22d3ee" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPress)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Right - Machine Fleet Status (spans 2 cols) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="xl:col-span-2 rounded-2xl bg-[#09090b]/50 border border-white/[0.05] p-6 shadow-xl flex flex-col"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-white">Machine Fleet</h3>
              <p className="text-xs text-white/40 mt-0.5">Live operational status</p>
            </div>
            <button onClick={() => navigate('/machines')} className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Status Summary */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: 'Critical', count: criticalCount, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
              { label: 'Warning', count: warningCount, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
              { label: 'Healthy', count: healthyCount, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
            ].map(({ label, count, color, bg }) => (
              <div key={label} className={cn("rounded-xl border p-3 text-center", bg)}>
                <p className={cn("text-2xl font-black", color)}>{count}</p>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Machine list */}
          <div className="flex-1 space-y-2 overflow-hidden">
            {machines?.slice(0, 6).map((machine, idx) => {
              const isCritical = machine.status === 'Critical';
              const isWarning = machine.status === 'Warning';
              return (
                <div
                  key={machine._id || idx}
                  onClick={() => navigate('/machines')}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] hover:border-white/10 transition-all cursor-pointer"
                >
                  <div className={cn("w-2 h-2 rounded-full shrink-0", isCritical ? 'bg-rose-500 animate-pulse' : isWarning ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500')} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{machine.machineName || machine.machineId}</p>
                    <p className="text-[10px] text-white/30 font-mono">{machine.machineId}</p>
                  </div>
                  <span className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                    isCritical ? "text-rose-400 bg-rose-400/10 border-rose-400/20" :
                    isWarning ? "text-amber-400 bg-amber-400/10 border-amber-400/20" :
                    "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                  )}>
                    {machine.status}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Second row: Alerts + High Risk Predictions + Quick Nav */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="rounded-2xl bg-[#09090b]/50 border border-white/[0.05] p-5 shadow-xl flex flex-col gap-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Recent Alerts</h3>
                <p className="text-[10px] text-white/40">{alerts?.length || 0} active system alarms</p>
              </div>
            </div>
            <button onClick={() => navigate('/alerts')} className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors">
              View <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {alerts?.slice(0, 4).map((alert, idx) => (
              <div
                key={idx}
                onClick={() => navigate('/alerts')}
                className="bg-white/[0.02] border border-white/[0.05] p-3 rounded-xl flex items-center gap-3 hover:bg-white/[0.05] transition-colors cursor-pointer"
              >
                <div className={cn("w-2 h-2 rounded-full shrink-0",
                  (alert.severity === 'Critical' || alert.severity === 'High') ? 'bg-rose-500 animate-pulse' :
                  alert.severity === 'Medium' ? 'bg-amber-500' : 'bg-indigo-400'
                )} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{alert.message}</p>
                  <p className="text-[10px] text-white/30 font-mono mt-0.5">{alert.machineId}</p>
                </div>
              </div>
            ))}
            {(!alerts || alerts.length === 0) && (
              <div className="flex-1 py-8 border border-dashed border-emerald-500/20 bg-emerald-500/5 rounded-xl flex flex-col items-center justify-center text-emerald-400/60 gap-2">
                <CheckCircle2 className="w-6 h-6" />
                <span className="text-xs font-semibold">All systems nominal</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* High Risk Predictions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="rounded-2xl bg-[#09090b]/50 border border-white/[0.05] p-5 shadow-xl flex flex-col gap-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                <Brain className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">High Risk Units</h3>
                <p className="text-[10px] text-white/40">AI failure probability analysis</p>
              </div>
            </div>
            <button onClick={() => navigate('/predictions')} className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors">
              View <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {highRiskPredictions.map((pred, idx) => {
              const pct = Number(pred.failureProbability || 0);
              return (
                <div
                  key={idx}
                  onClick={() => navigate('/predictions')}
                  className="bg-rose-500/5 border border-rose-500/15 p-3 rounded-xl flex items-center justify-between hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="text-xs font-bold text-white">Machine {pred.machineId}</p>
                    <div className="w-32 bg-white/5 rounded-full h-1.5 mt-1.5">
                      <div
                        className={cn("h-1.5 rounded-full", pct >= 80 ? "bg-rose-500" : pct >= 50 ? "bg-amber-500" : "bg-emerald-500")}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-xl font-black", pct >= 80 ? "text-rose-400" : "text-amber-400")}>{pct}%</p>
                    <p className="text-[9px] text-white/30 uppercase tracking-wider">Failure Risk</p>
                  </div>
                </div>
              );
            })}
            {highRiskPredictions.length === 0 && (
              <div className="flex-1 py-8 border border-dashed border-emerald-500/20 bg-emerald-500/5 rounded-xl flex flex-col items-center justify-center text-emerald-400/60 gap-2">
                <CheckCircle2 className="w-6 h-6" />
                <span className="text-xs font-semibold">No high-risk units detected</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="rounded-2xl bg-[#09090b]/50 border border-white/[0.05] p-5 shadow-xl flex flex-col gap-3"
        >
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
              <Clock className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Quick Access</h3>
              <p className="text-[10px] text-white/40">Navigate to key modules</p>
            </div>
          </div>
          {navCards.map((card, idx) => (
            <NavCard key={card.path} {...card} delay={0.55 + idx * 0.05} />
          ))}
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
