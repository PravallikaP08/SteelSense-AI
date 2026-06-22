import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Server, Activity, Brain, BellRing } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Machines', path: '/machines', icon: Server },
    { name: 'Sensors', path: '/sensors', icon: Activity },
    { name: 'Predictions', path: '/predictions', icon: Brain },
    { name: 'Alerts', path: '/alerts', icon: BellRing },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-slate-900 border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex h-16 items-center justify-center border-b border-slate-800 px-6">
        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 flex items-center gap-2">
          <Brain className="w-6 h-6 text-blue-500" />
          SteelSenseAI
        </h1>
      </div>
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
