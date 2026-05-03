import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Package, Factory } from 'lucide-react';

import { useState, useEffect } from 'react';

export function ReportesModule() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const salesData = [
    { month: 'Ene', ventas: 12500, costos: 8200 },
    { month: 'Feb', ventas: 15800, costos: 9500 },
    { month: 'Mar', ventas: 18200, costos: 11200 },
    { month: 'Abr', ventas: 22400, costos: 13800 },
    { month: 'May', ventas: 19500, costos: 12100 },
  ];

  const productionData = [
    { producto: 'Pico', cantidad: 245 },
    { producto: 'Azadón', cantidad: 198 },
    { producto: 'Rastrillo', cantidad: 312 },
    { producto: 'Barreta', cantidad: 156 },
    { producto: 'Pala', cantidad: 223 },
  ];

  const inventoryDistribution = [
    { name: 'Materia Prima', value: 45 },
    { name: 'Insumos', value: 30 },
    { name: 'Componentes', value: 15 },
    { name: 'Prod. Terminados', value: 10 },
  ];

  const COLORS = ['#1e3a8a', '#3b82f6', '#f97316', '#fbbf24'];

  const kpis = [
    {
      title: 'Ventas del Mes',
      value: 'S/ 19,500',
      change: '+12.3%',
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Eficiencia (OEE)',
      value: '87.5%',
      change: '+5.2%',
      icon: Factory,
      color: 'bg-blue-500',
    },
    {
      title: 'Costo por Unidad',
      value: 'S/ 62.08',
      change: '-3.1%',
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
    {
      title: 'Stock Valorizado',
      value: 'S/ 45,230',
      change: '+8.7%',
      icon: Package,
      color: 'bg-amber-500',
    },
  ];

  if (!mounted) return null;

  return (
    <div className="space-y-6">

      <div>
        <h2>Reportes y Analítica</h2>
        <p className="text-[var(--muted-foreground)] mt-1">Indicadores clave de desempeño (KPIs)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-lg border border-[var(--border)] shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className={`${kpi.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm px-2 py-1 rounded ${
                  kpi.change.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {kpi.change}
                </span>
              </div>
              <h3 className="text-[var(--foreground)]">{kpi.value}</h3>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">{kpi.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-[var(--border)] shadow-sm">
          <h3 className="mb-4">Ventas vs Costos (2026)</h3>
          <ResponsiveContainer width="100%" height={300} minHeight={300}>

            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ventas" fill="#1e3a8a" name="Ventas" />
              <Bar dataKey="costos" fill="#f97316" name="Costos" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg border border-[var(--border)] shadow-sm">
          <h3 className="mb-4">Producción por Producto (Último Mes)</h3>
          <ResponsiveContainer width="100%" height={300} minHeight={300}>

            <BarChart data={productionData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="producto" type="category" />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#3b82f6" name="Unidades Producidas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-[var(--border)] shadow-sm">
          <h3 className="mb-4">Distribución de Inventario</h3>
          <ResponsiveContainer width="100%" height={300} minHeight={300}>

            <PieChart>
              <Pie
                data={inventoryDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {inventoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg border border-[var(--border)] shadow-sm">
          <h3 className="mb-4">Rentabilidad Mensual</h3>
          <ResponsiveContainer width="100%" height={300} minHeight={300}>

            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="ventas"
                stroke="#10b981"
                strokeWidth={2}
                name="Ingresos"
              />
              <Line
                type="monotone"
                dataKey="costos"
                stroke="#dc2626"
                strokeWidth={2}
                name="Egresos"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-[var(--border)] shadow-sm">
        <h3 className="mb-4">Resumen Financiero</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700 mb-1">Ingresos Totales</p>
            <p className="text-green-900">S/ 88,400</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-red-700 mb-1">Costos Totales</p>
            <p className="text-red-900">S/ 54,800</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 mb-1">Utilidad Neta</p>
            <p className="text-blue-900">S/ 33,600</p>
          </div>
        </div>
      </div>
    </div>
  );
}
