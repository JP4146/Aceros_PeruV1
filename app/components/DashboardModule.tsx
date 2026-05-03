import { useState, useEffect } from 'react';
import { Package, Factory, ShoppingCart, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { StockAlert } from './StockAlert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardData {
  stats: {
    products: number;
    orders: number;
    salesToday: number;
    alerts: number;
  };
  criticalAlerts: Array<{
    productName: string;
    currentStock: number;
    minStock: number;
    unit: string;
    severity: 'critical' | 'warning';
  }>;
  recentOrders: Array<{
    id: string;
    product: string;
    status: string;
    progress: number;
  }>;
  weeklySales: Array<{
    fecha: string;
    monto: number;
  }>;
}

export function DashboardModule() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
 
  useEffect(() => {
    setMounted(true);
    fetch('/api/dashboard/stats')
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar datos');
        return res.json();
      })
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  const stats = [
    { 
      title: 'Productos en Stock', 
      value: data?.stats.products.toString() || '0', 
      icon: Package, 
      color: 'bg-blue-500', 
      gradient: 'from-blue-500 to-blue-600',
      change: '+12' 
    },
    { 
      title: 'Órdenes Activas', 
      value: data?.stats.orders.toString() || '0', 
      icon: Factory, 
      color: 'bg-purple-500', 
      gradient: 'from-purple-500 to-purple-600',
      change: '+3' 
    },
    { 
      title: 'Ventas del Día', 
      value: `S/ ${data?.stats.salesToday.toLocaleString() || '0'}`, 
      icon: ShoppingCart, 
      color: 'bg-green-500', 
      gradient: 'from-green-500 to-green-600',
      change: '+18%' 
    },
    { 
      title: 'Alertas Críticas', 
      value: data?.stats.alerts.toString() || '0', 
      icon: AlertTriangle, 
      color: 'bg-red-500', 
      gradient: 'from-red-500 to-red-600',
      change: '' 
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard General</h2>
          <p className="text-[var(--muted-foreground)] mt-1">Monitoreo en tiempo real de operaciones - Aceros Perú</p>
        </div>
        <div className="flex gap-2">
           <button 
            onClick={() => alert('Generando reporte PDF...')}
            className="px-4 py-2 bg-white border border-[var(--border)] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
           >
            Descargar Reporte
           </button>
           <button 
            onClick={() => alert('Abriendo formulario de nueva orden...')}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-sm shadow-blue-900/10"
           >
            Nueva Orden
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="group relative bg-white p-6 rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity rounded-full"></div>
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.color} p-4 rounded-xl shadow-lg shadow-${stat.color.split('-')[1]}-500/20`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {stat.change && (
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    stat.color === 'bg-red-500' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {stat.change}
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold text-[var(--foreground)]">{stat.value}</h3>
              <p className="text-sm font-medium text-[var(--muted-foreground)] mt-1 uppercase tracking-wider">{stat.title}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white p-8 rounded-2xl border border-[var(--border)] shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold">Rendimiento de Ventas (7 días)</h3>
            <p className="text-sm text-[var(--muted-foreground)]">Evolución de ingresos semanales</p>
          </div>
          <div className="bg-green-50 p-2 rounded-lg">
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data?.weeklySales || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="fecha" 
                tickFormatter={(str) => new Date(str).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `S/ ${val}`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [`S/ ${value}`, 'Monto']}
                labelFormatter={(label) => new Date(label).toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })}
              />
              <Line 
                type="monotone" 
                dataKey="monto" 
                stroke="#3b82f6" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold">Alertas de Stock</h3>
              <p className="text-sm text-[var(--muted-foreground)]">Insumos por debajo del mínimo</p>
            </div>
            <div className="bg-red-50 p-2 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          </div>
          <div className="space-y-4">
            {data?.criticalAlerts && data.criticalAlerts.length > 0 ? (
              data.criticalAlerts.map((alert, index) => (
                <StockAlert
                  key={index}
                  productName={alert.productName}
                  currentStock={alert.currentStock}
                  minStock={alert.minStock}
                  unit={alert.unit}
                  severity={alert.severity}
                />
              ))
            ) : (
              <div className="text-center py-8 text-[var(--muted-foreground)]">
                <p>No hay alertas críticas en este momento</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold">Órdenes en Proceso</h3>
              <p className="text-sm text-[var(--muted-foreground)]">Estado de fabricación actual</p>
            </div>
            <div className="bg-blue-50 p-2 rounded-lg">
                <Clock className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div className="space-y-6">
            {data?.recentOrders && data.recentOrders.length > 0 ? (
              data.recentOrders.map((order) => (
                <div key={order.id} className="relative">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-xs font-bold text-[var(--primary)] uppercase tracking-tighter">{order.id}</p>
                      <p className="font-semibold text-[var(--foreground)]">{order.product}</p>
                      <p className="text-sm text-[var(--muted-foreground)]">{order.status}</p>
                    </div>
                    <span className="text-sm font-bold text-[var(--primary)]">{order.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${order.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
               <div className="text-center py-8 text-[var(--muted-foreground)]">
                <p>No hay órdenes activas</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

