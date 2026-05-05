"use client";
import { useState, useEffect } from 'react';
import { Sidebar} from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardModule } from './components/DashboardModule';
import { InventarioModule} from './components/InventarioModule';
import { ProduccionModule } from './components/ProduccionModule';
import { VentasModule } from './components/VentasModule';
import { ReportesModule} from './components/ReportesModule';
import { AsistenciaModule} from './components/AsistenciaModule';
import { ProveedoresModule } from './components/ProveedoresModule';
import { ClientesModule } from './components/ClientesModule';
import { LoginView } from './components/LoginView';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [user, setUser] = useState<{ name: string; role: 'admin' | 'operario' | 'vendedor' } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('aceros_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
        // Set initial module based on role
        if (userData.role === 'operario') {
          setActiveModule('produccion');
        } else if (userData.role === 'vendedor') {
          setActiveModule('ventas');
        } else {
          setActiveModule('dashboard');
        }
      } catch (e) {
        console.error("Error parsing saved user", e);
        localStorage.removeItem('aceros_user');
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = (userData: { name: string; role: 'admin' | 'operario' | 'vendedor' }) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('aceros_user', JSON.stringify(userData));
    
    // Set initial module based on role
    if (userData.role === 'operario') {
      setActiveModule('produccion');
    } else if (userData.role === 'vendedor') {
      setActiveModule('ventas');
    } else {
      setActiveModule('dashboard');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('aceros_user');
  };

  // Prevent flash of login screen while checking session
  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (!isAuthenticated || !user) {
    return <LoginView onLogin={handleLogin} />;
  }

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardModule />;
      case 'inventario':
        return <InventarioModule />;
      case 'produccion':
        return <ProduccionModule />;
      case 'ventas':
        return <VentasModule />;
      case 'reportes':
        return <ReportesModule />;
      case 'clientes':
        return <ClientesModule />;
      case 'proveedores':
        return <ProveedoresModule />;
      case 'asistencia':
        return <AsistenciaModule />;
      default:
        return <DashboardModule />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 transform lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar
          activeModule={activeModule}
          onModuleChange={(m) => {
            setActiveModule(m);
            setIsSidebarOpen(false);
          }}
          userRole={user.role}
          onLogout={handleLogout}
        />
      </div>

      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col transition-all">
        <TopBar
            userRole={user.role}
            userName={user.name}
            notifications={3}
            onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            onLogout={handleLogout}
        />

        <main className="flex-1 mt-20 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {renderModule()}
            </div>
        </main>
      </div>
    </div>
  );
}