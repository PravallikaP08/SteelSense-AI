import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Server, Activity, AlertTriangle, Thermometer, Gauge, Zap, CheckCircle2, ShieldAlert } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { useAnalytics } from '../hooks/useAnalytics';
import { useAlerts } from '../hooks/useAlerts';
import { usePredictions } from '../hooks/usePredictions';
import PageTransition from '../components/PageTransition';
import { cn } from '../utils/cn';

// Time series data will be managed in component state

const StatCard = ({ title, value, icon: Icon, trend, colorClass, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="group relative overflow-hidden rounded-2xl bg-[#09090b]/50 border border-white/[0.05] p-6 hover:bg-white/[0.02] transition-colors shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.6)]"
  >
    <div className={cn("absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 transition-opacity group-hover:opacity-40 rounded-full translate-x-1/2 -translate-y-1/2", colorClass)} />
    
    <div className="relative z-10 flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-white/50 mb-2 tracking-wide uppercase">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-4xl font-bold tracking-tight text-white">{value}</h3>
          {trend && (
            <span className={cn("text-sm font-semibold", trend.startsWith('+') ? "text-emerald-400" : "text-rose-400")}>
              {trend}
            </span>
          )}
        </div>
      </div>
      <div className={cn("p-4 rounded-xl border border-white/5 shadow-inner", colorClass.replace('bg-', 'text-').replace('/10', '/20'))}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();
  const { data: alerts } = useAlerts();
  const { data: predictions } = usePredictions();
  
  const [timeSeriesData, setTimeSeriesData] = useState([]);

  useEffect(() => {
    if (analytics && analytics.averageTemperature) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      setTimeSeriesData(prev => {
        const newData = [...prev, {
          time: timeStr,
          temp: Number(analytics.averageTemperature),
          pressure: Number(analytics.averagePressure)
        }];
        // Keep last 15 data points
        return newData.length > 15 ? newData.slice(newData.length - 15) : newData;
      });
    }
  }, [analytics]);

  if (analyticsLoading && !analytics && timeSeriesData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  const stats = analytics || {
    totalMachines: 0,
    totalAlerts: 0,
    averageTemperature: 0,
    averagePressure: 0,
    averageVibration: 0,
  };

  return (
    <PageTransition className="space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">System Overview</h1>
          <p className="text-white/50 mt-1">Real-time telemetry and predictive insights</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm font-medium shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            System Healthy
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatCard delay={0.1} title="Total Machines" value={stats.totalMachines} icon={Server} colorClass="bg-indigo-500" />
        <StatCard delay={0.2} title="Active Alerts" value={stats.totalAlerts} icon={AlertTriangle} trend={stats.totalAlerts > 5 ? "+2" : ""} colorClass={stats.totalAlerts > 0 ? "bg-rose-500" : "bg-emerald-500"} />
        <StatCard delay={0.3} title="Avg Temperature" value={`${Number(stats?.averageTemperature || 0).toFixed(1)}°`} icon={Thermometer} trend="+1.2%" colorClass="bg-orange-500" />
        <StatCard delay={0.4} title="Avg Pressure" value={`${Number(stats?.averagePressure || 0).toFixed(1)}`} icon={Gauge} colorClass="bg-cyan-500" />
        <StatCard delay={0.5} title="Avg Vibration" value={`${Number(stats?.averageVibration || 0).toFixed(1)}`} icon={Activity} colorClass="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="rounded-2xl bg-[#09090b]/50 border border-white/[0.05] p-6 shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6">
            <div className="flex gap-4">
              <span className="flex items-center gap-2 text-xs font-medium text-white/50"><span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]"></span>Temperature</span>
              <span className="flex items-center gap-2 text-xs font-medium text-white/50"><span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]"></span>Pressure</span>
            </div>
          </div>
          <h3 className="text-lg font-bold text-white mb-8">Telemetry Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="temp" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
                <Area type="monotone" dataKey="pressure" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorPress)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="rounded-2xl bg-[#09090b]/50 border border-white/[0.05] p-6 shadow-xl relative overflow-hidden flex flex-col"
        >
          <div className="absolute top-[-50px] right-[-50px] w-[150px] h-[150px] bg-rose-500/10 rounded-full blur-[60px]" />
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            Recent Alerts & Predictions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-2">Latest Alerts</h4>
              {alerts?.slice(0, 3).map((alert, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center gap-3 hover:bg-white/10 transition-colors">
                  <div className={cn("w-2 h-2 rounded-full", alert.alertType === 'Critical' ? 'bg-rose-500 animate-pulse' : alert.alertType === 'Warning' ? 'bg-amber-500' : 'bg-indigo-500')} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{alert.message}</p>
                    <p className="text-xs text-white/40">{alert.machineId}</p>
                  </div>
                </div>
              ))}
              {(!alerts || alerts.length === 0) && (
                <div className="flex-1 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-white/30 text-sm">
                  No active alerts
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-2">High Risk Predictions</h4>
              {predictions?.filter(p => p.riskLevel === 'High').slice(0, 3).map((pred, idx) => (
                <div key={idx} className="bg-rose-500/5 border border-rose-500/20 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">Machine {pred.machineId}</p>
                    <p className="text-xs text-rose-400">High Risk</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-rose-500">{pred.failureProbability}%</p>
                  </div>
                </div>
              ))}
              {(!predictions || predictions.filter(p => p.riskLevel === 'High').length === 0) && (
                <div className="flex-1 border border-dashed border-emerald-500/20 bg-emerald-500/5 rounded-xl flex items-center justify-center text-emerald-400/50 text-sm flex-col gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  No high risk units
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
