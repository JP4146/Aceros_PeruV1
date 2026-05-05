import { useState, useEffect } from 'react';
import { Search, Plus, FileText, LayoutGrid, List, ShoppingCart } from 'lucide-react';
import { ProductCard } from './ProductCard';

interface Product {
    id: number;
    nombre: string;
    precio: number;
    stockFisico: number;
    enCola: number;
    imagenUrl?: string;
}

interface Sale {
    id: string;
    client: string;
    document: string;
    products: { name: string; quantity: number; price: number }[];
    total: number;
    date: string;
    status: 'pendiente' | 'completado' | 'cancelado';
}

export function VentasModule() {
    const [showForm, setShowForm] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [mounted, setMounted] = useState(false);
    const [isConsulting, setIsConsulting] = useState(false);
    const [clientData, setClientData] = useState({
        documento: '',
        nombre: '',
        tipo: ''
    });

    useEffect(() => {
        setMounted(true);
        fetch('/api/products')
            .then(res => {
                if (!res.ok) throw new Error('Error al cargar productos');
                return res.json();
            })
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleConsultDocument = async () => {
        const doc = clientData.documento;
        const type = doc.length === 8 ? 'dni' : doc.length === 11 ? 'ruc' : null;

        if (!type) {
            alert('El documento debe tener 8 (DNI) o 11 (RUC) dígitos');
            return;
        }

        setIsConsulting(true);
        try {
            const res = await fetch(`/api/consult/document?type=${type}&number=${doc}`);
            const result = await res.json();

            if (result.success) {
                setClientData(prev => ({
                    ...prev,
                    nombre: result.data.nombre || result.data.razonSocial || '',
                    tipo: type === 'dni' ? 'Natural' : 'Jurídico'
                }));
            } else {
                alert('No se encontró información para el documento proporcionado');
            }
        } catch (err) {
            alert('Error en la consulta');
        } finally {
            setIsConsulting(false);
        }
    };

    if (!mounted) return null;

    const handleVenta = (product: Product) => {
        setShowForm(true);
        alert(`Iniciando venta para: ${product.nombre}`);
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Cabecera del Módulo */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Catálogo de Ventas</h2>
                    <p className="text-[var(--muted-foreground)] mt-1">Consulta disponibilidad y gestiona pedidos de clientes</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white border border-slate-200 rounded-2xl p-1 flex shadow-sm">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2 rounded-xl transition-all ${viewMode === 'table' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-6 py-3 bg-[var(--primary)] text-white font-bold rounded-2xl hover:opacity-90 flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Nueva Venta
                    </button>
                </div>
            </div>

            {/* Sección de Productos */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        Array(3).fill(0).map((_, i) => (
                            <div key={i} className="h-80 bg-slate-100 animate-pulse rounded-3xl"></div>
                        ))
                    ) : (
                        products.map(product => (
                            <ProductCard
                                key={product.id}
                                nombre={product.nombre}
                                precio={product.precio}
                                stockFisico={product.stockFisico}
                                enCola={product.enCola}
                                imagenUrl={product.imagenUrl}
                                onVenta={() => handleVenta(product)}
                            />
                        ))
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Producto</th>
                                    <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Físico</th>
                                    <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">En Cola</th>
                                    <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Precio</th>
                                    <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {products.map(product => (
                                    <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-8 py-5 font-bold text-slate-900">{product.nombre}</td>
                                        <td className="px-8 py-5 text-center">
                                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black">{product.stockFisico}</span>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-black">{product.enCola}</span>
                                        </td>
                                        <td className="px-8 py-5 text-right font-black text-slate-900">S/ {product.precio.toFixed(2)}</td>
                                        <td className="px-8 py-5 text-right">
                                            <button onClick={() => handleVenta(product)} className="text-blue-600 font-bold text-sm hover:underline">Vender</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Formulario (Oculto o Modal) */}
            {showForm && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                        <div className="p-8 border-b border-slate-100">
                            <h3 className="text-2xl font-bold">Registrar Nueva Venta</h3>
                            <p className="text-slate-500">Complete los datos para generar la nota de pedido</p>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">RUC / DNI del Cliente</label>
                                    <div className="flex gap-2">
                                        <div className="relative group flex-1">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type="text"
                                                value={clientData.documento}
                                                onChange={(e) => setClientData({ ...clientData, documento: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                                                placeholder="Buscar por documento..."
                                            />
                                        </div>
                                        <button
                                            onClick={handleConsultDocument}
                                            disabled={isConsulting}
                                            className="px-4 py-2 bg-blue-50 text-blue-600 font-bold rounded-2xl hover:bg-blue-100 transition-colors disabled:opacity-50"
                                        >
                                            {isConsulting ? (
                                                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
                                            ) : (
                                                'Validar'
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Nombre / Razón Social</label>
                                    <input
                                        type="text"
                                        value={clientData.nombre}
                                        readOnly
                                        className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-slate-600"
                                        placeholder="Se llenará automáticamente"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Tipo de Comprobante</label>
                                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all">
                                        <option>Factura</option>
                                        <option>Boleta de Venta</option>
                                        <option>Nota de Pedido</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Método de Pago</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {['Tarjeta', 'Yape', 'Plim'].map((method) => (
                                        <button
                                            key={method}
                                            type="button"
                                            className="p-4 border border-slate-200 rounded-2xl flex flex-col items-center gap-2 hover:border-blue-500 hover:bg-blue-50 transition-all focus:ring-4 focus:ring-blue-500/10"
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${method === 'Yape' ? 'bg-[#742284]' : method === 'Plim' ? 'bg-[#00d1ce]' : 'bg-slate-900'
                                                }`}>
                                                {method === 'Tarjeta' ? <ShoppingCart className="w-5 h-5 text-white" /> : <div className="text-white font-black text-xs">{method[0]}</div>}
                                            </div>
                                            <span className="text-xs font-bold text-slate-700">{method}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-blue-900">Total Estimado</span>
                                    <span className="text-2xl font-black text-blue-900">S/ 0.00</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-slate-50 flex gap-4">
                            <button className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-900/10 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                                <FileText className="w-5 h-5" />
                                Confirmar Venta
                            </button>
                            <button
                                onClick={() => setShowForm(false)}
                                className="px-8 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-white transition-all"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}