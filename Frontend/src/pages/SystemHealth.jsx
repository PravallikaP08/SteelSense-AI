import React from 'react';
import { motion } from 'framer-motion';
import { Server, Cpu, Database, Activity, Wifi } from 'lucide-react';

const SystemHealth = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">System Health</h1>
          <p className="text-slate-400">Real-time status of backend services and infrastructure</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex items-center space-x-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <Server className="w-6 h-6" />
            </div>
            <div>
                <p className="text-slate-400 text-sm">API Server</p>
                <p className="text-white font-semibold">Online (99.9%)</p>
            </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex items-center space-x-4">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
                <Database className="w-6 h-6" />
            </div>
            <div>
                <p className="text-slate-400 text-sm">Database</p>
                <p className="text-white font-semibold">Connected</p>
            </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex items-center space-x-4">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg">
                <Cpu className="w-6 h-6" />
            </div>
            <div>
                <p className="text-slate-400 text-sm">Prediction Engine</p>
                <p className="text-white font-semibold">Active</p>
            </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex items-center space-x-4">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg">
                <Activity className="w-6 h-6" />
            </div>
            <div>
                <p className="text-slate-400 text-sm">Response Time</p>
                <p className="text-white font-semibold">42ms</p>
            </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Service Logs</h2>
        <div className="bg-black/50 rounded-lg p-4 border border-slate-800 font-mono text-sm space-y-2 h-64 overflow-y-auto">
            <div className="text-emerald-400">[SYSTEM] Connection established with primary database cluster</div>
            <div className="text-blue-400">[INFO] Prediction engine updated weights successfully</div>
            <div className="text-slate-400">[DATA] Polled 8 machines successfully in 12ms</div>
            <div className="text-slate-400">[DATA] Generated 1 new warning alert for CON-C21</div>
            <div className="text-emerald-400">[SYSTEM] API Authentication token verified</div>
            <div className="text-slate-400">[DATA] Polled 8 machines successfully in 15ms</div>
            <div className="text-blue-400">[INFO] Worker thread 2 restarted automatically</div>
            <div className="text-slate-400">[DATA] Polled 8 machines successfully in 11ms</div>
            <div className="text-emerald-400">[SYSTEM] Automatic backup completed at 12:00 PM</div>
        </div>
      </motion.div>
    </div>
  );
};

export default SystemHealth;
