import React from 'react';
import { motion } from 'framer-motion';
import { Info, Code, Server, Cpu } from 'lucide-react';

const About = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">About Project</h1>
          <p className="text-slate-400">Final Year & Internship Project - Vizag Steel Plant</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-8 space-y-8"
      >
        <div className="flex items-start space-x-4">
           <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
               <Info className="w-8 h-8 text-blue-400" />
           </div>
           <div>
               <h2 className="text-2xl font-bold text-white mb-2">SteelSense AI</h2>
               <p className="text-slate-300 leading-relaxed">
                   SteelSense AI is an enterprise-grade industrial monitoring and predictive maintenance software.
                   Built specifically for the rigorous demands of steel manufacturing, it monitors critical 
                   machinery like Blast Furnaces, Cooling Pumps, and Hydraulic Presses in real-time.
               </p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
                <div className="flex items-center mb-4 text-purple-400">
                    <Code className="w-6 h-6 mr-3" />
                    <h3 className="text-lg font-semibold text-white">Frontend Architecture</h3>
                </div>
                <ul className="space-y-2 text-slate-400 text-sm">
                    <li>• React 19 + Vite</li>
                    <li>• Tailwind CSS + Glassmorphism UI</li>
                    <li>• Framer Motion Animations</li>
                    <li>• Recharts Data Visualization</li>
                    <li>• Zustand State Management</li>
                </ul>
            </div>
            
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
                <div className="flex items-center mb-4 text-emerald-400">
                    <Server className="w-6 h-6 mr-3" />
                    <h3 className="text-lg font-semibold text-white">Backend Architecture</h3>
                </div>
                <ul className="space-y-2 text-slate-400 text-sm">
                    <li>• Node.js & Express</li>
                    <li>• MongoDB & Mongoose</li>
                    <li>• JWT Authentication</li>
                    <li>• Real-time Data Generation API</li>
                    <li>• Predictive Maintenance Engine</li>
                </ul>
            </div>
        </div>

        <div className="bg-blue-900/20 p-6 rounded-xl border border-blue-500/20 mt-8">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Project Goal</h3>
            <p className="text-slate-300 text-sm">
                To reduce machine downtime by predicting failures before they occur. 
                This system eliminates manual log checking and provides a centralized, 
                intelligent dashboard for the entire engineering department.
            </p>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
