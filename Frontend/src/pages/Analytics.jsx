import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Cpu, Clock, Zap, TrendingUp, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, Legend } from 'recharts';
import { useAnalytics } from '../hooks/useAnalytics';
import { usePredictions } from '../hooks/usePredictions';
import { useAlerts } from '../hooks/useAlerts';
import PageTransition from '../components/PageTransition';
import { cn } from '../utils/cn';

const Analytics = () => {
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();
  const { data: predictions, isLoading: predictionsLoading } = usePredictions();
  const { data: alerts, isLoading: alertsLoading } = useAlerts();

  const isLoading = analyticsLoading || predictionsLoading || alertsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Get data metrics from backend response
  const stats = analytics || {
    totalMachines: 0,
    totalAlerts: 0,
    machineHealthScore: 100,
    efficiencyPercentage: 92,
    downtimeMinutes: 0,
    averageTemperature: 0,
    averagePressure: 0,
    averageVibration: 0,
    weeklyPerformance: [],
    downtimeCauses: []
  };

  // Map predictions data for BarChart
  const predictionChartData = predictions?.map(p => ({
    name: p.machineId,
    probability: p.failureProbability,
  })) || [];

  // Map alerts data for alert frequencies
  const alertFreq = alerts?.reduce((acc, a) => {
    acc[a.machineId] = (acc[a.machineId] || 0) + 1;
    return acc;
  }, {}) || {};

  const alertChartData = Object.entries(alertFreq).map(([machineId, count]) => ({
    name: machineId,
    count,
  }));

  const statCards = [
    { title: 'Plant OEE / Efficiency', value: `${stats.efficiencyPercentage || 92}%`, subtext: 'Target: >85% OEE', icon: Zap, color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
    { title: 'Overall Fleet Health', value: `${stats.machineHealthScore || 94}%`, subtext: 'Based on machine status', icon: ShieldCheck, color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20' },
    { title: 'Active Downtime', value: `${stats.downtimeMinutes || 0}m`, subtext: 'Critical machine failures', icon: Clock, color: 'text-rose-400 bg-rose-400/10 border-rose-400/20' },
  ];

  return (
    <PageTransition className="space-y-8 pb-10">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <Cpu className="w-6 h-6 text-indigo-400" />
          </div>
          Fleet Analytics
        </h1>
        <p className="text-white/50 mt-2">Comprehensive telemetry diagnostics, downtime analytics, and plant efficiency performance</p>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, i) => (
          <div key={i} className="rounded-3xl border border-white/[0.05] p-6 flex items-center justify-between bg-[#09090b]/55 shadow-xl relative overflow-hidden group hover:bg-white/[0.01] transition-all">
            <div className="space-y-2">
              <p className="text-xs font-bold text-white/40 uppercase tracking-widest">{card.title}</p>
              <h3 className="text-4xl font-black text-white">{card.value}</h3>
              <p className="text-[10px] font-semibold text-white/30">{card.subtext}</p>
            </div>
            <div className={cn("p-4 rounded-2xl border shrink-0", card.color)}>
              <card.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Main charts section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Failure probability chart */}
        <div className="rounded-3xl bg-[#09090b]/55 border border-white/[0.05] p-6 shadow-2xl relative overflow-hidden">
          <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            Impending Machine Failure Probability (%)
          </h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={predictionChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="probability" radius={[6, 6, 0, 0]}>
                  {predictionChartData.map((entry, index) => {
                    const color = entry.probability >= 80 ? '#f43f5e' : entry.probability >= 40 ? '#f59e0b' : '#10b981';
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly plant performance trends */}
        <div className="rounded-3xl bg-[#09090b]/55 border border-white/[0.05] p-6 shadow-2xl flex flex-col justify-between">
          <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            7-Day Historical Performance Trends
          </h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.weeklyPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOEE" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} domain={[60, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="efficiency" name="OEE Efficiency (%)" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorOEE)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alert frequencies */}
        <div className="rounded-3xl bg-[#09090b]/55 border border-white/[0.05] p-6 shadow-2xl">
          <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            Alert Frequency Distribution
          </h3>
          {alertChartData.length > 0 ? (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={alertChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="count" name="Alert Count" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="py-20 text-center text-white/30 text-sm border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
              No alarms recorded in system logs currently.
            </div>
          )}
        </div>

        {/* Downtime Causes distribution */}
        <div className="rounded-3xl bg-[#09090b]/55 border border-white/[0.05] p-6 shadow-2xl flex flex-col justify-between">
          <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-400" />
            Downtime Cause Analysis
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 flex-1">
            {stats.downtimeCauses && stats.downtimeCauses.length > 0 ? (
              <>
                <div className="h-[200px] w-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.downtimeCauses}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {stats.downtimeCauses.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {stats.downtimeCauses.map((entry, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white/[0.02] border border-white/5 px-4 py-2 rounded-2xl">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                      <div>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{entry.name}</p>
                        <p className="text-xs font-extrabold text-white">{entry.value}% of total downtime</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-white/30 text-sm py-12">No downtime causes log found</div>
            )}
          </div>
        </div>

      </div>
    </PageTransition>
  );
};

export default Analytics;
