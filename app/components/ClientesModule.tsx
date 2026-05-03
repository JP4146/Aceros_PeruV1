"use client";
import { useState, useEffect } from 'react';
import { Plus, Search, User, Briefcase, MapPin, Phone, Mail, Filter } from 'lucide-react';

interface Cliente {
  id: string;
  nombre: string;
  documento: string;
  tipo: 'Natural' | 'Jurídico';
  direccion: string;
  telefono: string;
  email: string;
  estado: 'Activo' | 'Inactivo';
}

export function ClientesModule() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isConsulting, setIsConsulting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);



  
  const [formData, setFormData] = useState({
    documento: '',
    nombre: '',
    tipo: 'Natural',
    direccion: '',
    telefono: '',
    email: ''
  });

  const [clientes, setClientes] = useState<Cliente[]>([
    {
      id: 'CLI-001',
      nombre: 'Ferretería El Progreso SAC',
      documento: '20123456789',
      tipo: 'Jurídico',
      direccion: 'Av. Industrial 450, Lima',
      telefono: '987654321',
      email: 'ventas@elprogreso.com',
      estado: 'Activo'
    },
    {
      id: 'CLI-002',
      nombre: 'Roberto Sánchez',
      documento: '10456789123',
      tipo: 'Natural',
      direccion: 'Calle Los Cedros 123, Arequipa',
      telefono: '912345678',
      email: 'rsanchez@email.com',
      estado: 'Activo'
    }
  ]);

  const handleConsultDocument = async () => {
    const type = formData.documento.length === 8 ? 'dni' : formData.documento.length === 11 ? 'ruc' : null;
    
    if (!type) {
      alert('El documento debe tener 8 (DNI) o 11 (RUC) dígitos');
      return;
    }

    setIsConsulting(true);
    try {
      const res = await fetch(`/api/consult/document?type=${type}&number=${formData.documento}`);
      const result = await res.json();
      
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          nombre: result.data.nombre || result.data.razonSocial || '',
          direccion: result.data.direccion || '',
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

  const filteredClientes = clientes.filter(c => 
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.documento.includes(searchTerm)
  );

  if (!mounted) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión de Clientes</h2>
          <p className="text-[var(--muted-foreground)] mt-1">Base de datos de clientes naturales y jurídicos</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-[var(--primary)] text-white rounded-xl hover:opacity-90 flex items-center gap-2 shadow-lg shadow-blue-900/10 transition-all"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Cerrar Formulario' : 'Nuevo Cliente'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-2xl border border-[var(--border)] shadow-xl animate-in slide-in-from-top duration-300">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-[var(--primary)]" />
            Registro de Cliente
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Documento (DNI/RUC)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ej: 20123456789"
                  value={formData.documento}
                  onChange={(e) => setFormData({...formData, documento: e.target.value})}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                />
                <button 
                  onClick={handleConsultDocument}
                  disabled={isConsulting}
                  className="px-6 py-3 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isConsulting ? (
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                  <span>VALIDAR</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Nombre / Razón Social</label>
              <input
                type="text"
                placeholder="Nombre completo"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Tipo de Cliente</label>
              <select 
                value={formData.tipo}
                onChange={(e) => setFormData({...formData, tipo: e.target.value as any})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              >
                <option value="Natural">Persona Natural</option>
                <option value="Jurídico">Persona Jurídica</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Teléfono</label>
              <input
                type="tel"
                placeholder="987 654 321"
                value={formData.telefono}
                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Dirección</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Av. Principal 123..."
                  value={formData.direccion}
                  onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  placeholder="cliente@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
             <button 
                onClick={() => setShowForm(false)}
                className="px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
             >
                Cancelar
             </button>
             <button 
                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all"
             >
                Guardar Cliente
             </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o documento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
           </div>
           <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-600 font-medium">
              <Filter className="w-4 h-4" />
              Filtros
           </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4 text-left">Documento</th>
                <th className="px-6 py-4 text-left">Nombre / Empresa</th>
                <th className="px-6 py-4 text-left">Tipo</th>
                <th className="px-6 py-4 text-left">Contacto</th>
                <th className="px-6 py-4 text-left">Ubicación</th>
                <th className="px-6 py-4 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4 font-mono text-sm font-bold text-blue-600">{cliente.documento}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{cliente.nombre}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-tighter">{cliente.id}</p>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                       cliente.tipo === 'Natural' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
                     }`}>
                        {cliente.tipo}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                       <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <Phone className="w-3.5 h-3.5" />
                          {cliente.telefono}
                       </div>
                       <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Mail className="w-3.5 h-3.5" />
                          {cliente.email}
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate max-w-[200px]">{cliente.direccion}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold">
                       {cliente.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
