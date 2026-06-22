import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Thermometer, Gauge, AlertTriangle, ShieldCheck, Cpu } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, Legend } from 'recharts';
import { useAnalytics } from '../hooks/useAnalytics';
import { usePredictions } from '../hooks/usePredictions';
import { useAlerts } from '../hooks/useAlerts';
import { useMachines } from '../hooks/useMachines';
import PageTransition from '../components/PageTransition';
import { cn } from '../utils/cn';

const Analytics = () => {
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();
  const { data: predictions, isLoading: predictionsLoading } = usePredictions();
  const { data: alerts, isLoading: alertsLoading } = useAlerts();
  const { data: machines, isLoading: machinesLoading } = useMachines();

  const isLoading = analyticsLoading || predictionsLoading || alertsLoading || machinesLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate status counts
  const statusCounts = machines?.reduce((acc, m) => {
    const status = m.status || 'Active';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, { Active: 0, Warning: 0, Critical: 0, Maintenance: 0 }) || { Active: 0, Warning: 0, Critical: 0, Maintenance: 0 };

  const statusPieData = [
    { name: 'Optimal', value: statusCounts.Active, color: '#10b981' },
    { name: 'Warning', value: statusCounts.Warning, color: '#f59e0b' },
    { name: 'Critical', value: statusCounts.Critical, color: '#f43f5e' },
    { name: 'Maintenance', value: statusCounts.Maintenance, color: '#6366f1' },
  ].filter(d => d.value > 0);

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

  // Averages stat data
  const stats = analytics || {
    averageTemperature: 0,
    averagePressure: 0,
    averageVibration: 0,
    totalAlerts: 0,
    totalMachines: 0,
  };

  const statCards = [
    { title: 'Fleet Average Temperature', value: `${Number(stats.averageTemperature || 0).toFixed(1)} °C`, icon: Thermometer, color: 'text-orange-400 bg-orange-400/10 border-orange-400/20' },
    { title: 'Fleet Average Pressure', value: `${Number(stats.averagePressure || 0).toFixed(1)} PSI`, icon: Gauge, color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20' },
    { title: 'Fleet Average Vibration', value: `${Number(stats.averageVibration || 0).toFixed(1)} mm/s`, icon: Activity, color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
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
        <p className="text-white/50 mt-2">Comprehensive telemetry diagnostics and predictive trends</p>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, i) => (
          <div key={i} className={cn("rounded-2xl border p-6 flex items-center justify-between bg-[#09090b]/50 shadow-xl", card.color.split(' ')[2])}>
            <div>
              <p className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-1">{card.title}</p>
              <h3 className="text-3xl font-black text-white">{card.value}</h3>
            </div>
            <div className={cn("p-4 rounded-xl border", card.color)}>
              <card.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Main charts section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Failure probability chart */}
        <div className="rounded-3xl bg-[#09090b]/50 border border-white/[0.05] p-6 shadow-2xl relative overflow-hidden">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            Failure Probabilities by Machine (%)
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={predictionChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="probability" radius={[8, 8, 0, 0]}>
                  {predictionChartData.map((entry, index) => {
                    const color = entry.probability > 80 ? '#f43f5e' : entry.probability > 50 ? '#f59e0b' : '#10b981';
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Operating status distribution */}
        <div className="rounded-3xl bg-[#09090b]/50 border border-white/[0.05] p-6 shadow-2xl flex flex-col justify-between">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Fleet Status Allocation
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-around gap-6 flex-1">
            {statusPieData.length > 0 ? (
              <>
                <div className="h-[220px] w-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {statusPieData.map((entry, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white/[0.02] border border-white/5 px-4 py-2.5 rounded-xl">
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: entry.color }} />
                      <div>
                        <p className="text-xs font-semibold text-white/50">{entry.name}</p>
                        <p className="text-sm font-bold text-white">{entry.value} Units</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-white/30 text-sm py-12">No data active</div>
            )}
          </div>
        </div>

        {/* Alert frequencies */}
        <div className="rounded-3xl bg-[#09090b]/50 border border-white/[0.05] p-6 shadow-2xl xl:col-span-2">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            Alert Volume by Machine
          </h3>
          {alertChartData.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={alertChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="py-20 text-center text-white/30 text-sm border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
              No alerts logged in the system.
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Analytics;
