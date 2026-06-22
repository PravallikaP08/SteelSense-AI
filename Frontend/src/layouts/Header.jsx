import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search, BellRing, Settings } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import useAuthStore from '../store/authStore';

const Header = () => {
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  const { user } = useAuthStore();

  return (
    <header className="h-20 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/[0.05] sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 text-white/60 hover:text-white lg:hidden rounded-lg hover:bg-white/5 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/[0.05] rounded-lg text-white/50 hover:bg-white/[0.06] hover:border-white/10 transition-colors w-64 focus-within:w-80 focus-within:bg-white/[0.06] focus-within:border-indigo-500/50">
          <Search className="w-4 h-4 text-white/40" />
          <input 
            type="text" 
            placeholder="Search resources..." 
            className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-white/30"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/notifications" className="relative p-2.5 text-white/60 hover:text-white rounded-xl hover:bg-white/5 transition-colors group">
          <BellRing className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.8)]"></span>
        </Link>
        <Link to="/settings" className="p-2.5 text-white/60 hover:text-white rounded-xl hover:bg-white/5 transition-colors group hidden sm:block">
          <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
        </Link>
        <Link to="/profile" className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center border-2 border-white/10 hover:border-indigo-400 transition-all overflow-hidden shrink-0 shadow-lg ml-1">
          {user?.imageUrl ? (
            <img src={user.imageUrl} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs font-bold text-white">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
          )}
        </Link>
      </div>
    </header>
  );
};

export default Header;
