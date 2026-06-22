import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Server, Settings, Activity, ShieldCheck, ShieldAlert, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMachines } from '../hooks/useMachines';
import PageTransition from '../components/PageTransition';
import { cn } from '../utils/cn';

const Machines = () => {
  const { data: machines, isLoading } = useMachines();
  const [searchTerm, setSearchTerm] = useState('');

  if (isLoading && !machines) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  const filteredMachines = machines?.filter(m => 
    m.machineName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.machineId?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <PageTransition className="space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Machine Fleet</h1>
          <p className="text-white/50 mt-1">Manage and monitor all industrial units</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-[#09090b]/50 border border-white/10 rounded-xl w-64 focus-within:border-indigo-500/50 transition-colors">
            <Search className="w-4 h-4 text-white/40" />
            <input 
              type="text" 
              placeholder="Search machines..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-white/30"
            />
          </div>
          <button className="p-2.5 bg-[#09090b]/50 border border-white/10 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
          <button onClick={() => alert("Machine addition is restricted to admin users.")} className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            Add Machine
          </button>
        </div>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-[#09090b]/50 border border-white/[0.05] overflow-hidden shadow-2xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.05] bg-white/[0.02]">
                <th className="px-6 py-4 text-xs font-semibold text-white/50 uppercase tracking-wider">Machine</th>
                <th className="px-6 py-4 text-xs font-semibold text-white/50 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-white/50 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-white/50 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {filteredMachines.map((machine) => {
                const isCritical = machine.status === 'Critical';
                const isWarning = machine.status === 'Warning';
                const statusColor = isCritical ? 'text-rose-400 bg-rose-400/10 border-rose-400/20' : 
                                    isWarning ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' : 
                                    'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';

                return (
                  <tr key={machine._id || machine.machineId} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={cn("p-2.5 rounded-lg border", isCritical ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400")}>
                          <Server className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{machine.machineName}</div>
                          <div className="text-xs text-white/40 font-mono mt-0.5">{machine.machineId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-medium text-white/70">
                        {machine.machineType}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border", statusColor)}>
                        {isCritical ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                        {machine.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors ml-auto">
                        <Settings className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredMachines.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <Server className="w-10 h-10 text-white/20 mx-auto mb-3" />
                    <p className="text-white/50 text-sm">No machines found matching your criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-white/[0.05] bg-white/[0.01] flex items-center justify-between">
          <p className="text-xs text-white/40 font-medium">Showing <span className="text-white">{filteredMachines.length}</span> machines</p>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-50" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-50" disabled>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </PageTransition>
  );
};

export default Machines;
