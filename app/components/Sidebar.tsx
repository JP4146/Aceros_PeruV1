import { Package, Factory, ShoppingCart, Users, Truck, ClipboardCheck, BarChart3, Settings, ShieldCheck } from 'lucide-react';

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
  userRole: 'admin' | 'operario' | 'vendedor';
  onLogout: () => void;
}

export function Sidebar({ activeModule, onModuleChange, userRole, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, roles: ['admin', 'vendedor', 'operario'] },
    { id: 'inventario', label: 'Inventario', icon: Package, roles: ['admin', 'vendedor'] },
    { id: 'produccion', label: 'Producción', icon: Factory, roles: ['admin', 'operario'] },
    { id: 'ventas', label: 'Ventas', icon: ShoppingCart, roles: ['admin', 'vendedor'] },
    { id: 'clientes', label: 'Clientes', icon: Users, roles: ['admin', 'vendedor'] },
    { id: 'proveedores', label: 'Proveedores', icon: Truck, roles: ['admin'] },
    { id: 'asistencia', label: 'Asistencia', icon: ClipboardCheck, roles: ['admin', 'operario'] },
    { id: 'reportes', label: 'Reportes', icon: BarChart3, roles: ['admin'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="w-64 bg-[var(--sidebar)] flex flex-col h-screen fixed left-0 top-0 z-40 shadow-2xl">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[var(--sidebar-foreground)] tracking-tighter leading-tight uppercase">Aceros <span className="text-blue-400">Perú</span></h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SISTEMA ERP v2.0</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Menú Principal</p>
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onModuleChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)] shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-auto space-y-2">
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Usuario</p>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">CM</div>
                <div>
                    <p className="text-xs font-bold text-white">C. Mendoza</p>
                    <p className="text-[10px] text-slate-500 capitalize">{userRole}</p>
                </div>
            </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all group"
        >
          <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          <span className="text-sm font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}

