import { useState } from 'react';
import { Plus, ArrowRight } from 'lucide-react';

interface ProductionOrder {
  id: string;
  product: string;
  quantity: number;
  stage: 'corte' | 'soldadura' | 'pintura' | 'acabado' | 'completado';
  priority: 'alta' | 'media' | 'baja';
  operator: string;
  startDate: string;
  dueDate: string;
}

export function ProduccionModule() {
  const [showForm, setShowForm] = useState(false);

  const orders: ProductionOrder[] = [
    { id: 'OP-001', product: 'Pico Agrícola', quantity: 50, stage: 'soldadura', priority: 'alta', operator: 'Juan Pérez', startDate: '2026-04-28', dueDate: '2026-05-05' },
    { id: 'OP-002', product: 'Azadón Reforzado', quantity: 30, stage: 'corte', priority: 'media', operator: 'María García', startDate: '2026-04-29', dueDate: '2026-05-08' },
    { id: 'OP-003', product: 'Rastrillo Metálico', quantity: 100, stage: 'pintura', priority: 'alta', operator: 'Carlos López', startDate: '2026-04-27', dueDate: '2026-05-03' },
    { id: 'OP-004', product: 'Barreta Hexagonal', quantity: 25, stage: 'acabado', priority: 'baja', operator: 'Ana Torres', startDate: '2026-04-26', dueDate: '2026-05-02' },
  ];

  const stages = [
    { id: 'corte', label: 'Corte', color: 'bg-blue-500' },
    { id: 'soldadura', label: 'Soldadura', color: 'bg-purple-500' },
    { id: 'pintura', label: 'Pintura', color: 'bg-amber-500' },
    { id: 'acabado', label: 'Acabado', color: 'bg-green-500' },
    { id: 'completado', label: 'Completado', color: 'bg-gray-500' },
  ];

  const getOrdersByStage = (stageId: string) => {
    return orders.filter(order => order.stage === stageId);
  };

  const priorityColors = {
    alta: 'border-l-4 border-l-red-500',
    media: 'border-l-4 border-l-amber-500',
    baja: 'border-l-4 border-l-green-500',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Control de Producción</h2>
          <p className="text-[var(--muted-foreground)] mt-1">Seguimiento de órdenes de fabricación</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-blue-800 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nueva Orden de Fabricación
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg border border-[var(--border)] shadow-sm">
          <h3 className="mb-4">Crear Orden de Fabricación</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Producto</label>
              <select className="w-full px-3 py-2 border border-[var(--border)] rounded-lg">
                <option>Pico Agrícola</option>
                <option>Azadón Reforzado</option>
                <option>Rastrillo Metálico</option>
                <option>Barreta Hexagonal</option>
                <option>Pala Cuadrada</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">Cantidad a Producir</label>
              <input type="number" className="w-full px-3 py-2 border border-[var(--border)] rounded-lg" />
            </div>
            <div>
              <label className="block mb-2">Prioridad</label>
              <select className="w-full px-3 py-2 border border-[var(--border)] rounded-lg">
                <option>Alta</option>
                <option>Media</option>
                <option>Baja</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">Operario Asignado</label>
              <select className="w-full px-3 py-2 border border-[var(--border)] rounded-lg">
                <option>Juan Pérez</option>
                <option>María García</option>
                <option>Carlos López</option>
                <option>Ana Torres</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">Fecha de Inicio</label>
              <input type="date" className="w-full px-3 py-2 border border-[var(--border)] rounded-lg" />
            </div>
            <div>
              <label className="block mb-2">Fecha de Entrega</label>
              <input type="date" className="w-full px-3 py-2 border border-[var(--border)] rounded-lg" />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-blue-800">
              Crear Orden
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

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {stages.map((stage, index) => (
          <div key={stage.id} className="flex flex-col gap-4">
            <div className={`${stage.color} text-white p-3 rounded-lg flex items-center justify-between`}>
              <h3 className="text-white">{stage.label}</h3>
              <span className="bg-white/20 px-2 py-1 rounded text-sm">
                {getOrdersByStage(stage.id).length}
              </span>
            </div>

            <div className="space-y-3 min-h-[400px]">
              {getOrdersByStage(stage.id).map(order => (
                <div
                  key={order.id}
                  className={`bg-white p-4 rounded-lg border border-[var(--border)] ${priorityColors[order.priority]} shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-xs text-[var(--muted-foreground)]">{order.id}</p>
                      <h4 className="text-[var(--foreground)] mt-1">{order.product}</h4>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      order.priority === 'alta' ? 'bg-red-100 text-red-800' :
                      order.priority === 'media' ? 'bg-amber-100 text-amber-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {order.priority}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm text-[var(--muted-foreground)]">
                    <p>Cantidad: <span className="text-[var(--foreground)]">{order.quantity} unidades</span></p>
                    <p>Operario: <span className="text-[var(--foreground)]">{order.operator}</span></p>
                    <p>Entrega: <span className="text-[var(--foreground)]">{new Date(order.dueDate).toLocaleDateString('es-PE')}</span></p>
                  </div>

                  {index < stages.length - 1 && (
                    <button className="w-full mt-3 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center gap-2 text-sm">
                      Siguiente Etapa
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
