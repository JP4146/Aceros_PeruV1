import { useState } from 'react';
import { Plus, Search, Download, AlertCircle } from 'lucide-react';
import { StockAlert } from './StockAlert';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  unit: string;
  price: number;
  location: string;
}

export function InventarioModule() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const inventory: InventoryItem[] = [
    { id: '1', name: 'Plancha de Acero 1/8"', category: 'Materia Prima', stock: 25, minStock: 50, unit: 'unidades', price: 120, location: 'Almacén A' },
    { id: '2', name: 'Tubo Cuadrado 2"x2"', category: 'Materia Prima', stock: 15, minStock: 30, unit: 'metros', price: 45, location: 'Almacén A' },
    { id: '3', name: 'Soldadura E6011', category: 'Insumo', stock: 3, minStock: 10, unit: 'kg', price: 25, location: 'Almacén B' },
    { id: '4', name: 'Pintura Anticorrosiva', category: 'Insumo', stock: 8, minStock: 15, unit: 'litros', price: 35, location: 'Almacén B' },
    { id: '5', name: 'Mango de Madera', category: 'Componente', stock: 45, minStock: 20, unit: 'unidades', price: 8, location: 'Almacén C' },
    { id: '6', name: 'Disco de Corte', category: 'Insumo', stock: 12, minStock: 25, unit: 'unidades', price: 15, location: 'Almacén B' },
  ];

  const getSeverity = (stock: number, minStock: number): 'critical' | 'warning' | 'normal' => {
    const percentage = (stock / minStock) * 100;
    if (percentage < 50) return 'critical';
    if (percentage < 100) return 'warning';
    return 'normal';
  };

  const criticalItems = inventory.filter(item => getSeverity(item.stock, item.minStock) === 'critical');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Gestión de Inventario</h2>
          <p className="text-[var(--muted-foreground)] mt-1">Control de materias primas, insumos y productos</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-blue-800 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Ingreso
          </button>
        </div>
      </div>

      {criticalItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h3 className="text-red-800">Alertas de Stock Crítico ({criticalItems.length})</h3>
          </div>
          <div className="space-y-2">
            {criticalItems.map(item => (
              <StockAlert
                key={item.id}
                productName={item.name}
                currentStock={item.stock}
                minStock={item.minStock}
                unit={item.unit}
                severity="critical"
              />
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-lg border border-[var(--border)] shadow-sm">
          <h3 className="mb-4">Registrar Nuevo Material</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Nombre del Material</label>
              <input type="text" className="w-full px-3 py-2 border border-[var(--border)] rounded-lg" />
            </div>
            <div>
              <label className="block mb-2">Categoría</label>
              <select className="w-full px-3 py-2 border border-[var(--border)] rounded-lg">
                <option>Materia Prima</option>
                <option>Insumo</option>
                <option>Componente</option>
                <option>Producto Terminado</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">Cantidad</label>
              <input type="number" className="w-full px-3 py-2 border border-[var(--border)] rounded-lg" />
            </div>
            <div>
              <label className="block mb-2">Unidad</label>
              <select className="w-full px-3 py-2 border border-[var(--border)] rounded-lg">
                <option>Unidades</option>
                <option>Metros</option>
                <option>Kilogramos</option>
                <option>Litros</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">Stock Mínimo</label>
              <input type="number" className="w-full px-3 py-2 border border-[var(--border)] rounded-lg" />
            </div>
            <div>
              <label className="block mb-2">Precio Unitario (S/)</label>
              <input type="number" step="0.01" className="w-full px-3 py-2 border border-[var(--border)] rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-2">Ubicación en Almacén</label>
              <input type="text" className="w-full px-3 py-2 border border-[var(--border)] rounded-lg" />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-blue-800">
              Guardar
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-6 py-2 border border-[var(--border)] rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-[var(--border)]">
        <div className="p-4 border-b border-[var(--border)]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="Buscar por nombre, categoría o ubicación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[var(--border)] rounded-lg"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-[var(--foreground)]">Material</th>
                <th className="px-6 py-3 text-left text-[var(--foreground)]">Categoría</th>
                <th className="px-6 py-3 text-left text-[var(--foreground)]">Stock</th>
                <th className="px-6 py-3 text-left text-[var(--foreground)]">Stock Mín.</th>
                <th className="px-6 py-3 text-left text-[var(--foreground)]">Estado</th>
                <th className="px-6 py-3 text-left text-[var(--foreground)]">Ubicación</th>
                <th className="px-6 py-3 text-left text-[var(--foreground)]">Precio Unit.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {inventory.map(item => {
                const severity = getSeverity(item.stock, item.minStock);
                const statusColors = {
                  critical: 'bg-red-100 text-red-800',
                  warning: 'bg-amber-100 text-amber-800',
                  normal: 'bg-green-100 text-green-800'
                };
                const statusLabels = {
                  critical: 'Crítico',
                  warning: 'Bajo',
                  normal: 'Normal'
                };

                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-[var(--foreground)]">{item.name}</td>
                    <td className="px-6 py-4 text-[var(--muted-foreground)]">{item.category}</td>
                    <td className="px-6 py-4 text-[var(--foreground)]">{item.stock} {item.unit}</td>
                    <td className="px-6 py-4 text-[var(--muted-foreground)]">{item.minStock} {item.unit}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${statusColors[severity]}`}>
                        {statusLabels[severity]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[var(--muted-foreground)]">{item.location}</td>
                    <td className="px-6 py-4 text-[var(--foreground)]">S/ {item.price.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
