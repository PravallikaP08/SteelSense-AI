import React from 'react';
import { motion } from 'framer-motion';
import { Info, Code, Server, Brain, Shield, Users, Award, Cpu, Database, Layers } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const techStack = [
  {
    category: 'Frontend Layer',
    icon: Code,
    color: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    glow: 'bg-purple-500',
    items: ['React 19 + Vite 5', 'Tailwind CSS 4 + Glassmorphism', 'Framer Motion Animations', 'Recharts Data Visualization', 'Zustand + TanStack Query', 'Lucide React Icon Library']
  },
  {
    category: 'Backend Layer',
    icon: Server,
    color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    glow: 'bg-emerald-500',
    items: ['Node.js 20 + Express 4', 'MongoDB 7 + Mongoose ODM', 'JWT Authentication Middleware', 'RESTful API Architecture', 'CORS / Rate Limiting', 'Real-time Data Simulation Engine']
  },
  {
    category: 'AI / ML Engine',
    icon: Brain,
    color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
    glow: 'bg-indigo-500',
    items: ['Predictive Failure Probability', 'Remaining Useful Life (RUL)', 'Multi-parameter Telemetry AI', 'NLP-based AI Assistant', 'Anomaly Detection Logic', 'Industrial Simulation Models']
  },
];

const features = [
  { icon: Shield, title: 'Secure Auth', desc: 'JWT-based login with protected routes' },
  { icon: Cpu, title: 'IoT Telemetry', desc: 'Real-time 6-metric sensor feeds' },
  { icon: Brain, title: 'Predictive AI', desc: 'ML-driven failure probability & RUL' },
  { icon: Database, title: 'Maintenance DB', desc: 'Full scheduler and service log history' },
  { icon: Layers, title: 'Fleet Analytics', desc: 'OEE, downtime analysis, trend charts' },
  { icon: Users, title: 'AI Assistant', desc: 'NLP chatbot with live plant access' },
];

const About = () => {
  return (
    <PageTransition className="space-y-8 pb-10 max-w-5xl">
      <header>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <Info className="w-6 h-6 text-blue-400" />
          </div>
          About SteelSense AI
        </h1>
        <p className="text-white/50 mt-2">Enterprise-grade predictive maintenance platform for the steel manufacturing industry</p>
      </header>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative rounded-3xl bg-gradient-to-br from-indigo-500/10 via-[#09090b]/50 to-purple-500/10 border border-white/[0.08] p-8 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.4)] shrink-0">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white mb-3">
              SteelSense<span className="text-indigo-400">AI</span>
            </h2>
            <p className="text-white/60 leading-relaxed max-w-2xl">
              SteelSense AI is a full-stack industrial IoT platform purpose-built for the demanding environment of steel manufacturing.
              It monitors critical machinery — Blast Furnaces, Cooling Pumps, CNC Machines, Hydraulic Presses, Conveyor Motors, and Robotic Arms —
              in real time, then applies AI-driven predictive analytics to flag failures before they occur, dramatically reducing unplanned downtime.
            </p>
            <div className="flex items-center gap-4 mt-5 flex-wrap">
              <div className="flex items-center gap-2 text-xs font-bold text-white/60 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                Final Year + Internship Project
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-white/60 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Vizag Steel Plant
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Features Grid */}
      <div>
        <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Platform Capabilities</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              className="p-5 rounded-2xl bg-[#09090b]/50 border border-white/[0.05] flex items-start gap-4 hover:bg-white/[0.02] transition-all"
            >
              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 shrink-0">
                <f.icon className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{f.title}</p>
                <p className="text-xs text-white/40 mt-0.5 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div>
        <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Technology Architecture</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {techStack.map((stack, i) => (
            <motion.div
              key={stack.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="rounded-2xl bg-[#09090b]/55 border border-white/[0.05] p-6 relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${stack.glow}/10 rounded-full blur-3xl`} />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2.5 rounded-xl border shrink-0 ${stack.color}`}>
                    <stack.icon className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-bold text-white">{stack.category}</p>
                </div>
                <ul className="space-y-2">
                  {stack.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-white/60">
                      <span className="w-1 h-1 rounded-full bg-white/30 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project Goal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/20"
      >
        <h3 className="text-base font-bold text-indigo-400 mb-2">Project Objective</h3>
        <p className="text-sm text-white/60 leading-relaxed">
          To reduce unplanned machine downtime by predicting failures before they occur using AI-driven analytics.
          This system eliminates manual log-checking, provides a centralized intelligent monitoring dashboard for the entire
          engineering department, and generates automated maintenance recommendations to minimize production losses.
        </p>
      </motion.div>
    </PageTransition>
  );
};

export default About;
