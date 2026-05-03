import { useState, useEffect } from 'react';
import { Plus, Search, Phone, Mail, MapPin, FileText, DollarSign, Package, Calendar } from 'lucide-react';

interface Supplier {
  id: string;
  ruc: string;
  businessName: string;
  tradeName: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  city: string;
  category: string;
  paymentTerm: string;
  bankAccount?: string;
  status: 'activo' | 'inactivo';
  registrationDate: string;
  totalPurchases: number;
  pendingBalance: number;
}

interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  date: string;
  items: { product: string; quantity: number; unitPrice: number }[];
  total: number;
  status: 'pendiente' | 'parcial' | 'pagado';
  dueDate: string;
}

export function ProveedoresModule() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'lista' | 'ordenes'>('lista');
  const [mounted, setMounted] = useState(false);
  const [isConsulting, setIsConsulting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);



  const [formData, setFormData] = useState({
    ruc: '',
    businessName: '',
    tradeName: '',
    category: 'Acero y Metales',
    contact: '',
    phone: '',
    email: '',
    paymentTerm: '30 días',
    address: '',
    district: '',
    city: '',
    bankAccount: ''
  });

  const handleConsultRUC = async () => {
    if (formData.ruc.length !== 11) {
      alert('El RUC debe tener 11 dígitos');
      return;
    }
    setIsConsulting(true);
    try {
      const res = await fetch(`/api/consult/document?type=ruc&number=${formData.ruc}`);
      const result = await res.json();
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          businessName: result.data.razonSocial || result.data.nombre || '',
          tradeName: result.data.nombreComercial || result.data.nombre || result.data.razonSocial || '',
          address: result.data.direccion || '',
          district: result.data.distrito || '',
          city: result.data.provincia || ''
        }));
      } else {
        alert('No se encontró información para el RUC proporcionado');
      }
    } catch (err) {
      console.error(err);
      alert('Error al conectar con el servicio de consulta');
    } finally {
      setIsConsulting(false);
    }
  };


  const suppliers: Supplier[] = [
    {
      id: 'SUP001',
      ruc: '20123456789',
      businessName: 'Aceros del Norte SAC',
      tradeName: 'Aceros del Norte',
      contact: 'Roberto Sánchez',
      phone: '987654321',
      email: 'ventas@acerosnorte.com',
      address: 'Av. Industrial 1234',
      district: 'Los Olivos',
      city: 'Lima',
      category: 'Acero y Metales',
      paymentTerm: '30 días',
      bankAccount: 'BCP - 19412345678901',
      status: 'activo',
      registrationDate: '2024-01-15',
      totalPurchases: 45800,
      pendingBalance: 3200
    },
    {
      id: 'SUP002',
      ruc: '20234567890',
      businessName: 'Pinturas Industriales Perú EIRL',
      tradeName: 'Pinturas IP',
      contact: 'Carmen Flores',
      phone: '965432187',
      email: 'contacto@pinturasip.pe',
      address: 'Jr. Los Pinos 567',
      district: 'San Juan de Lurigancho',
      city: 'Lima',
      category: 'Pinturas y Químicos',
      paymentTerm: '15 días',
      bankAccount: 'BBVA - 00119876543210',
      status: 'activo',
      registrationDate: '2024-03-20',
      totalPurchases: 12400,
      pendingBalance: 850
    },
    {
      id: 'SUP003',
      ruc: '20345678901',
      businessName: 'Maderería El Roble SAC',
      tradeName: 'El Roble',
      contact: 'José Mendoza',
      phone: '912345678',
      email: 'ventas@elroble.com',
      address: 'Carretera Central Km 15',
      district: 'Ate',
      city: 'Lima',
      category: 'Madera y Derivados',
      paymentTerm: '45 días',
      status: 'activo',
      registrationDate: '2024-02-10',
      totalPurchases: 8900,
      pendingBalance: 0
    },
    {
      id: 'SUP004',
      ruc: '20456789012',
      businessName: 'Soldaduras y Consumibles SAC',
      tradeName: 'Solcon',
      contact: 'Pedro Ramírez',
      phone: '923456789',
      email: 'pedidos@solcon.pe',
      address: 'Av. Venezuela 890',
      district: 'Breña',
      city: 'Lima',
      category: 'Insumos de Soldadura',
      paymentTerm: '30 días',
      bankAccount: 'Interbank - 20098765432109',
      status: 'activo',
      registrationDate: '2024-01-05',
      totalPurchases: 23600,
      pendingBalance: 1800
    },
  ];

  const purchaseOrders: PurchaseOrder[] = [
    {
      id: 'OC-001',
      supplierId: 'SUP001',
      supplierName: 'Aceros del Norte SAC',
      date: '2026-04-28',
      items: [
        { product: 'Plancha de Acero 1/8"', quantity: 50, unitPrice: 120 },
        { product: 'Tubo Cuadrado 2"x2"', quantity: 30, unitPrice: 45 }
      ],
      total: 7350,
      status: 'parcial',
      dueDate: '2026-05-28'
    },
    {
      id: 'OC-002',
      supplierId: 'SUP002',
      supplierName: 'Pinturas Industriales Perú EIRL',
      date: '2026-04-25',
      items: [
        { product: 'Pintura Anticorrosiva', quantity: 20, unitPrice: 35 }
      ],
      total: 700,
      status: 'pendiente',
      dueDate: '2026-05-10'
    },
    {
      id: 'OC-003',
      supplierId: 'SUP004',
      supplierName: 'Soldaduras y Consumibles SAC',
      date: '2026-04-20',
      items: [
        { product: 'Soldadura E6011', quantity: 50, unitPrice: 25 },
        { product: 'Disco de Corte', quantity: 100, unitPrice: 15 }
      ],
      total: 2750,
      status: 'pagado',
      dueDate: '2026-05-20'
    },
  ];

  const statusColors = {
    activo: 'bg-green-100 text-green-800',
    inactivo: 'bg-gray-100 text-gray-800',
  };

  const orderStatusColors = {
    pendiente: 'bg-amber-100 text-amber-800',
    parcial: 'bg-blue-100 text-blue-800',
    pagado: 'bg-green-100 text-green-800',
  };

  const orderStatusLabels = {
    pendiente: 'Pendiente',
    parcial: 'Pago Parcial',
    pagado: 'Pagado',
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.ruc.includes(searchTerm) ||
    supplier.tradeName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Gestión de Proveedores</h2>
          <p className="text-[var(--muted-foreground)] mt-1">Registro y control de proveedores</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-blue-800 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo Proveedor
        </button>
      </div>

      <div className="flex gap-2 border-b border-[var(--border)]">
        <button
          onClick={() => setActiveTab('lista')}
          className={`px-6 py-3 transition-all ${
            activeTab === 'lista'
              ? 'border-b-2 border-[var(--primary)] text-[var(--primary)]'
              : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
          }`}
        >
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Lista de Proveedores
          </div>
        </button>
        <button
          onClick={() => setActiveTab('ordenes')}
          className={`px-6 py-3 transition-all ${
            activeTab === 'ordenes'
              ? 'border-b-2 border-[var(--primary)] text-[var(--primary)]'
              : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
          }`}
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Órdenes de Compra
          </div>
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg border border-[var(--border)] shadow-sm">
          <h3 className="mb-4">Registrar Nuevo Proveedor</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-bold">RUC</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="20123456789"
                  value={formData.ruc}
                  onChange={(e) => setFormData({...formData, ruc: e.target.value})}
                  className="flex-1 px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button 
                  onClick={handleConsultRUC}
                  disabled={isConsulting}
                  className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isConsulting ? (
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
                  ) : (
                    <Search className="w-4 h-4 text-blue-600" />
                  )}
                  <span className="text-xs font-bold text-blue-600 uppercase">Validar</span>
                </button>
              </div>
            </div>
            <div>
              <label className="block mb-2 text-sm font-bold">Razón Social</label>
              <input
                type="text"
                placeholder="Empresa SAC"
                value={formData.businessName}
                onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-bold">Nombre Comercial</label>
              <input
                type="text"
                placeholder="Nombre del negocio"
                value={formData.tradeName}
                onChange={(e) => setFormData({...formData, tradeName: e.target.value})}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-bold">Categoría</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
              >
                <option>Acero y Metales</option>
                <option>Pinturas y Químicos</option>
                <option>Madera y Derivados</option>
                <option>Insumos de Soldadura</option>
                <option>Herramientas</option>
                <option>Servicios</option>
                <option>Otros</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-bold">Persona de Contacto</label>
              <input
                type="text"
                placeholder="Nombre del contacto"
                value={formData.contact}
                onChange={(e) => setFormData({...formData, contact: e.target.value})}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-bold">Teléfono</label>
              <input
                type="tel"
                placeholder="987654321"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-bold">Email</label>
              <input
                type="email"
                placeholder="contacto@empresa.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-bold">Condición de Pago</label>
              <select 
                value={formData.paymentTerm}
                onChange={(e) => setFormData({...formData, paymentTerm: e.target.value})}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
              >
                <option>Contado</option>
                <option>15 días</option>
                <option>30 días</option>
                <option>45 días</option>
                <option>60 días</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-bold">Dirección</label>
              <input
                type="text"
                placeholder="Av. Principal 123"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-bold">Distrito</label>
              <input
                type="text"
                placeholder="Ej: Los Olivos"
                value={formData.district}
                onChange={(e) => setFormData({...formData, district: e.target.value})}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-bold">Ciudad</label>
              <input
                type="text"
                placeholder="Ej: Lima"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-bold">Cuenta Bancaria (Opcional)</label>
              <input
                type="text"
                placeholder="Banco - Número de cuenta"
                value={formData.bankAccount}
                onChange={(e) => setFormData({...formData, bankAccount: e.target.value})}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-blue-800">
              Guardar Proveedor
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

      {activeTab === 'lista' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-[var(--border)] shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Proveedores</p>
                  <p className="text-[var(--foreground)]">{suppliers.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-[var(--border)] shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Total Compras</p>
                  <p className="text-[var(--foreground)]">S/ {suppliers.reduce((acc, s) => acc + s.totalPurchases, 0).toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-[var(--border)] shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Saldo Pendiente</p>
                  <p className="text-[var(--foreground)]">S/ {suppliers.reduce((acc, s) => acc + s.pendingBalance, 0).toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-[var(--border)] shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Activos</p>
                  <p className="text-[var(--foreground)]">{suppliers.filter(s => s.status === 'activo').length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[var(--border)]">
            <div className="p-4 border-b border-[var(--border)]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
                <input
                  type="text"
                  placeholder="Buscar por RUC, razón social o nombre comercial..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[var(--border)] rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {filteredSuppliers.map(supplier => (
                <div
                  key={supplier.id}
                  className="border border-[var(--border)] rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedSupplier(selectedSupplier === supplier.id ? null : supplier.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-[var(--foreground)]">{supplier.tradeName}</h4>
                        <span className={`px-2 py-0.5 rounded text-xs ${statusColors[supplier.status]}`}>
                          {supplier.status === 'activo' ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--muted-foreground)]">{supplier.businessName}</p>
                      <p className="text-xs text-[var(--muted-foreground)] mt-1">RUC: {supplier.ruc}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[var(--muted-foreground)]">Total Compras</p>
                      <p className="text-[var(--primary)]">S/ {supplier.totalPurchases.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-2">
                    <Package className="w-4 h-4" />
                    <span>{supplier.category}</span>
                  </div>

                  {selectedSupplier === supplier.id && (
                    <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-3">
                      <div className="flex items-start gap-2">
                        <Phone className="w-4 h-4 text-[var(--muted-foreground)] mt-0.5" />
                        <div>
                          <p className="text-xs text-[var(--muted-foreground)]">Contacto</p>
                          <p className="text-sm text-[var(--foreground)]">{supplier.contact}</p>
                          <p className="text-sm text-[var(--foreground)]">{supplier.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Mail className="w-4 h-4 text-[var(--muted-foreground)] mt-0.5" />
                        <div>
                          <p className="text-xs text-[var(--muted-foreground)]">Email</p>
                          <p className="text-sm text-[var(--foreground)]">{supplier.email}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[var(--muted-foreground)] mt-0.5" />
                        <div>
                          <p className="text-xs text-[var(--muted-foreground)]">Dirección</p>
                          <p className="text-sm text-[var(--foreground)]">{supplier.address}</p>
                          <p className="text-sm text-[var(--foreground)]">{supplier.district}, {supplier.city}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-[var(--muted-foreground)] mt-0.5" />
                        <div>
                          <p className="text-xs text-[var(--muted-foreground)]">Condición de Pago</p>
                          <p className="text-sm text-[var(--foreground)]">{supplier.paymentTerm}</p>
                        </div>
                      </div>

                      {supplier.bankAccount && (
                        <div className="flex items-start gap-2">
                          <DollarSign className="w-4 h-4 text-[var(--muted-foreground)] mt-0.5" />
                          <div>
                            <p className="text-xs text-[var(--muted-foreground)]">Cuenta Bancaria</p>
                            <p className="text-sm text-[var(--foreground)]">{supplier.bankAccount}</p>
                          </div>
                        </div>
                      )}

                      {supplier.pendingBalance > 0 && (
                        <div className="bg-amber-50 border border-amber-200 rounded p-3">
                          <p className="text-xs text-amber-700 mb-1">Saldo Pendiente</p>
                          <p className="text-amber-900">S/ {supplier.pendingBalance.toLocaleString()}</p>
                        </div>
                      )}

                      <div className="flex gap-2 mt-4">
                        <button className="flex-1 px-3 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-blue-800 text-sm">
                          Editar
                        </button>
                        <button className="flex-1 px-3 py-2 border border-[var(--border)] rounded-lg hover:bg-gray-50 text-sm">
                          Ver Historial
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'ordenes' && (
        <div className="bg-white rounded-lg border border-[var(--border)]">
          <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
            <h3>Órdenes de Compra</h3>
            <button className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-blue-800 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nueva Orden
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-[var(--foreground)]">N° Orden</th>
                  <th className="px-6 py-3 text-left text-[var(--foreground)]">Proveedor</th>
                  <th className="px-6 py-3 text-left text-[var(--foreground)]">Fecha</th>
                  <th className="px-6 py-3 text-left text-[var(--foreground)]">Items</th>
                  <th className="px-6 py-3 text-left text-[var(--foreground)]">Total</th>
                  <th className="px-6 py-3 text-left text-[var(--foreground)]">Vencimiento</th>
                  <th className="px-6 py-3 text-left text-[var(--foreground)]">Estado</th>
                  <th className="px-6 py-3 text-left text-[var(--foreground)]">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {purchaseOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-[var(--foreground)]">{order.id}</td>
                    <td className="px-6 py-4 text-[var(--foreground)]">{order.supplierName}</td>
                    <td className="px-6 py-4 text-[var(--muted-foreground)]">
                      {new Date(order.date).toLocaleDateString('es-PE')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {order.items.map((item, i) => (
                          <div key={i} className="text-[var(--muted-foreground)]">
                            {item.quantity}x {item.product}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[var(--foreground)]">S/ {order.total.toLocaleString()}</td>
                    <td className="px-6 py-4 text-[var(--muted-foreground)]">
                      {new Date(order.dueDate).toLocaleDateString('es-PE')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${orderStatusColors[order.status]}`}>
                        {orderStatusLabels[order.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-[var(--primary)] hover:underline text-sm">
                        Ver Detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
