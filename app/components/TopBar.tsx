import { Search, Bell, User, Menu, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface TopBarProps {
  userRole: 'admin' | 'operario' | 'vendedor';
  userName: string;
  notifications: number;
  onMenuToggle?: () => void;
  onLogout: () => void;
}

export function TopBar({ userRole, userName, notifications, onMenuToggle, onLogout }: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const roleLabels = {
    admin: 'Administrador',
    operario: 'Operario',
    vendedor: 'Vendedor'
  };

  const roleColors = {
    admin: 'bg-indigo-600',
    operario: 'bg-emerald-600',
    vendedor: 'bg-blue-600'
  };

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-[var(--border)] fixed top-0 right-0 left-64 z-30 flex items-center justify-between px-10 transition-all">
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg mr-4"
      >
        <Menu className="w-5 h-5 text-slate-600" />
      </button>

      <div className="flex-1 max-w-2xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[var(--primary)] transition-colors" />
          <input
            type="text"
            placeholder="Buscar en el sistema..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all text-sm"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1">
             <kbd className="px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-white border border-slate-200 rounded-md shadow-sm">Ctrl</kbd>
             <kbd className="px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-white border border-slate-200 rounded-md shadow-sm">K</kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1">
            <button className="relative p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-[var(--destructive)] text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white ring-1 ring-red-200">
                {notifications}
                </span>
            )}
            </button>
        </div>

        <div className="h-8 w-[1px] bg-slate-200"></div>

        <button 
            onClick={onLogout}
            className="flex items-center gap-3 p-1.5 hover:bg-red-50 rounded-2xl transition-all group border border-transparent hover:border-red-100"
            title="Cerrar Sesión"
        >
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 group-hover:border-red-200 group-hover:bg-red-50 transition-all">
            <User className="w-5 h-5 text-slate-600 group-hover:text-red-600" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-bold text-slate-900 flex items-center gap-1 group-hover:text-red-700">
                {userName}
                <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-red-400" />
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
                <div className={`w-1.5 h-1.5 rounded-full ${roleColors[userRole]}`}></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {roleLabels[userRole]}
                </span>
            </div>
          </div>
        </button>
      </div>
    </header>
  );
}


