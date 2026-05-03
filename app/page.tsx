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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [user, setUser] = useState<{ name: string; role: 'admin' | 'operario' | 'vendedor' } | null>(null);

  const handleLogin = (userData: { name: string; role: 'admin' | 'operario' | 'vendedor' }) => {
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
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

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
      <Sidebar
        activeModule={activeModule}
        onModuleChange={setActiveModule}
        userRole={user.role}
        onLogout={handleLogout}
      />

      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        <TopBar
            userRole={user.role}
            userName={user.name}
            notifications={3}
            onLogout={handleLogout}
        />

        <main className="flex-1 mt-20 p-8">
            <div className="max-w-7xl mx-auto">
                {renderModule()}
            </div>
        </main>
      </div>
    </div>
  );
}