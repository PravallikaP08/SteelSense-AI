import React from 'react';
import { Menu, Bell, User } from 'lucide-react';

const Header = ({ toggleSidebar }) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40 flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 text-slate-400 hover:text-slate-200 lg:hidden rounded-lg hover:bg-slate-800"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden lg:block text-slate-400 text-sm font-medium tracking-wide">
          OVERVIEW / SYSTEM STATUS
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-400 hover:text-slate-200 rounded-full hover:bg-slate-800 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="flex items-center gap-2 p-1 pr-3 bg-slate-800 rounded-full border border-slate-700 hover:border-slate-600 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-slate-300">Admin</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
