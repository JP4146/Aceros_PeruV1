import { Hammer, ShoppingCart, Package, Factory, TrendingUp } from 'lucide-react';

interface ProductCardProps {
  nombre: string;
  precio: number;
  stockFisico: number;
  enCola: number;
  imagenUrl?: string;
  onVenta: () => void;
}

export function ProductCard({ nombre, precio, stockFisico, enCola, imagenUrl, onVenta }: ProductCardProps) {
  return (
    <div className="group bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Imagen del Producto */}
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        {imagenUrl ? (
          <img 
            src={imagenUrl} 
            alt={nombre}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <Hammer className="w-12 h-12 text-slate-300" />
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/20 shadow-sm">
            <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${stockFisico > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">
                    {stockFisico > 0 ? 'En Stock' : 'Sin Stock'}
                </span>
            </div>
        </div>
      </div>

      {/* Cabecera */}
      <div className="p-6 pb-2">
        <h3 className="text-xl font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{nombre}</h3>
      </div>

      {/* Cuerpo */}
      <div className="p-6 space-y-6 flex-1">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-600">
                <Package className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Stock Físico</span>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100/50">
                <p className="text-3xl font-black text-emerald-700">{stockFisico}</p>
                <p className="text-[10px] font-medium text-emerald-600 mt-1 uppercase">Disponibles</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-blue-600">
                <Factory className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">En Cola</span>
            </div>
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100/50">
                <p className="text-3xl font-black text-blue-700">{enCola}</p>
                <p className="text-[10px] font-medium text-blue-600 mt-1 uppercase">Fabricando</p>
            </div>
          </div>
        </div>

        {/* Mini Gráfico o Indicador de Demanda (Estética Extra) */}
        <div className="flex items-center justify-between px-2 py-2 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px] font-medium text-slate-500">Demanda Alta</span>
            </div>
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={`w-1 h-3 rounded-full ${i <= 4 ? 'bg-blue-400' : 'bg-slate-200'}`}></div>
                ))}
            </div>
        </div>
      </div>

      {/* Pie */}
      <div className="p-6 pt-0 mt-auto">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Precio Unitario</p>
            <p className="text-2xl font-black text-slate-900">S/ {precio.toFixed(2)}</p>
          </div>
          <button 
            onClick={onVenta}
            className="flex-1 bg-slate-900 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-slate-900/10 transition-all flex items-center justify-center gap-2 group/btn"
          >
            <ShoppingCart className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
            <span>Vender</span>
          </button>
        </div>
      </div>
    </div>
  );
}
