"use client";
import { useState, useEffect } from 'react';
import { Clock, Users, DollarSign, Calendar, LogIn, LogOut, Plus, Search, Calculator } from 'lucide-react';

interface Worker {
  id: string;
  name: string;
  dni: string;
  position: string;
  salaryType: 'mensual' | 'diario';
  monthlySalary?: number;
  dailySalary?: number;
  workDays: number;
  startDate: string;
}

interface Attendance {
  id: string;
  workerId: string;
  workerName: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  lunchOut?: string;
  lunchIn?: string;
  status: 'presente' | 'ausente' | 'medio-dia' | 'tardanza';
  hoursWorked?: number;
}

export function AsistenciaModule() {
  const [activeTab, setActiveTab] = useState<'registro' | 'trabajadores' | 'calculos'>('registro');
  const [showWorkerForm, setShowWorkerForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('2026-05');
  const [mounted, setMounted] = useState(false);
  const [isConsulting, setIsConsulting] = useState(false);

  const [newWorker, setNewWorker] = useState({
    name: '',
    dni: '',
    position: 'Soldador',
    salaryType: 'mensual' as const,
    monthlySalary: 1500,
    dailySalary: 60,
    workDays: 26,
    startDate: ''
  });

  useEffect(() => {
    setMounted(true);
    setNewWorker(prev => ({
      ...prev,
      startDate: new Date().toISOString().split('T')[0]
    }));
  }, []);

  if (!mounted) return null;


  const handleConsultDNI = async () => {
    if (newWorker.dni.length !== 8) {
      alert('El DNI debe tener 8 dígitos');
      return;
    }
    setIsConsulting(true);
    try {
      const res = await fetch(`/api/consult/document?type=dni&number=${newWorker.dni}`);
      const result = await res.json();
      if (result.success) {
        setNewWorker(prev => ({
          ...prev,
          name: result.data.nombre || ''
        }));
      } else {
        alert('No se encontró información para el DNI proporcionado');
      }
    } catch (err) {
      console.error(err);
      alert('Error al conectar con el servicio de consulta');
    } finally {
      setIsConsulting(false);
    }
  };


  const workers: Worker[] = [
    { id: 'W001', name: 'Juan Pérez', dni: '12345678', position: 'Soldador', salaryType: 'mensual', monthlySalary: 1500, workDays: 26, startDate: '2025-01-15' },
    { id: 'W002', name: 'María García', dni: '23456789', position: 'Operario de Corte', salaryType: 'mensual', monthlySalary: 1300, workDays: 26, startDate: '2025-03-20' },
    { id: 'W003', name: 'Carlos López', dni: '34567890', position: 'Pintor', salaryType: 'diario', dailySalary: 60, workDays: 0, startDate: '2026-04-01' },
    { id: 'W004', name: 'Ana Torres', dni: '45678901', position: 'Operario de Acabado', salaryType: 'mensual', monthlySalary: 1200, workDays: 26, startDate: '2025-06-10' },
  ];

  const attendances: Attendance[] = [
    { id: 'A001', workerId: 'W001', workerName: 'Juan Pérez', date: '2026-05-01', checkIn: '08:00', checkOut: '18:00', status: 'presente', hoursWorked: 9 },
    { id: 'A002', workerId: 'W002', workerName: 'María García', date: '2026-05-01', checkIn: '08:15', checkOut: '18:00', status: 'tardanza', hoursWorked: 8.75 },
    { id: 'A003', workerId: 'W003', workerName: 'Carlos López', date: '2026-05-01', checkIn: '08:00', lunchOut: '12:30', status: 'medio-dia', hoursWorked: 4.5 },
    { id: 'A004', workerId: 'W004', workerName: 'Ana Torres', date: '2026-05-01', checkIn: '08:00', checkOut: '18:00', status: 'presente', hoursWorked: 9 },
  ];

  const calculateSalary = (worker: Worker, daysWorked: number) => {
    if (worker.salaryType === 'mensual' && worker.monthlySalary) {
      const dailyRate = worker.monthlySalary / worker.workDays;
      return dailyRate * daysWorked;
    } else if (worker.salaryType === 'diario' && worker.dailySalary) {
      return worker.dailySalary * daysWorked;
    }
    return 0;
  };

  const getWorkerAttendance = (workerId: string) => {
    return attendances.filter(a => a.workerId === workerId && a.date.startsWith(selectedMonth));
  };

  const statusColors = {
    presente: 'bg-green-100 text-green-800',
    ausente: 'bg-red-100 text-red-800',
    'medio-dia': 'bg-amber-100 text-amber-800',
    tardanza: 'bg-orange-100 text-orange-800',
  };

  const statusLabels = {
    presente: 'Presente',
    ausente: 'Ausente',
    'medio-dia': 'Medio Día',
    tardanza: 'Tardanza',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Control de Asistencia y Planilla</h2>
          <p className="text-[var(--muted-foreground)] mt-1">Registro de personal y cálculo de sueldos</p>
        </div>
        <div className="flex gap-2 items-center">
          <Clock className="w-5 h-5 text-[var(--primary)]" />
          <span className="text-[var(--foreground)]">{new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      <div className="flex gap-2 border-b border-[var(--border)]">
        <button
          onClick={() => setActiveTab('registro')}
          className={`px-6 py-3 transition-all ${
            activeTab === 'registro'
              ? 'border-b-2 border-[var(--primary)] text-[var(--primary)]'
              : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
          }`}
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Registro de Asistencia
          </div>
        </button>
        <button
          onClick={() => setActiveTab('trabajadores')}
          className={`px-6 py-3 transition-all ${
            activeTab === 'trabajadores'
              ? 'border-b-2 border-[var(--primary)] text-[var(--primary)]'
              : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
          }`}
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Trabajadores
          </div>
        </button>
        <button
          onClick={() => setActiveTab('calculos')}
          className={`px-6 py-3 transition-all ${
            activeTab === 'calculos'
              ? 'border-b-2 border-[var(--primary)] text-[var(--primary)]'
              : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
          }`}
        >
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Cálculo de Sueldos
          </div>
        </button>
      </div>

      {activeTab === 'registro' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {workers.map(worker => (
              <div key={worker.id} className="bg-white p-4 rounded-lg border border-[var(--border)] shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[var(--primary)] rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[var(--foreground)]">{worker.name}</h4>
                    <p className="text-xs text-[var(--muted-foreground)]">{worker.position}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors">
                    <LogIn className="w-4 h-4" />
                    Entrada
                  </button>
                  <button className="w-full px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors">
                    <Clock className="w-4 h-4" />
                    Salida Almuerzo
                  </button>
                  <button className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors">
                    <LogIn className="w-4 h-4" />
                    Retorno Almuerzo
                  </button>
                  <button className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors">
                    <LogOut className="w-4 h-4" />
                    Salida Final
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg border border-[var(--border)]">
            <div className="p-4 border-b border-[var(--border)]">
              <h3>Registro del Día - {new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-[var(--foreground)]">Trabajador</th>
                    <th className="px-6 py-3 text-left text-[var(--foreground)]">Entrada</th>
                    <th className="px-6 py-3 text-left text-[var(--foreground)]">Salida Almuerzo</th>
                    <th className="px-6 py-3 text-left text-[var(--foreground)]">Retorno Almuerzo</th>
                    <th className="px-6 py-3 text-left text-[var(--foreground)]">Salida Final</th>
                    <th className="px-6 py-3 text-left text-[var(--foreground)]">Horas</th>
                    <th className="px-6 py-3 text-left text-[var(--foreground)]">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {attendances.map(attendance => (
                    <tr key={attendance.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-[var(--foreground)]">{attendance.workerName}</td>
                      <td className="px-6 py-4 text-[var(--foreground)]">{attendance.checkIn || '-'}</td>
                      <td className="px-6 py-4 text-[var(--muted-foreground)]">{attendance.lunchOut || '-'}</td>
                      <td className="px-6 py-4 text-[var(--muted-foreground)]">{attendance.lunchIn || '-'}</td>
                      <td className="px-6 py-4 text-[var(--foreground)]">{attendance.checkOut || '-'}</td>
                      <td className="px-6 py-4 text-[var(--foreground)]">{attendance.hoursWorked?.toFixed(1) || '-'}h</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${statusColors[attendance.status]}`}>
                          {statusLabels[attendance.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'trabajadores' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
              <input
                type="text"
                placeholder="Buscar por nombre o DNI..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[var(--border)] rounded-lg"
              />
            </div>
            <button
              onClick={() => setShowWorkerForm(!showWorkerForm)}
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-blue-800 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nuevo Trabajador
            </button>
          </div>

          {showWorkerForm && (
            <div className="bg-white p-6 rounded-lg border border-[var(--border)] shadow-sm">
              <h3 className="mb-4">Registrar Nuevo Trabajador</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-bold">DNI</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newWorker.dni}
                      onChange={(e) => setNewWorker({...newWorker, dni: e.target.value})}
                      placeholder="Ej: 12345678"
                      className="flex-1 px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button 
                      onClick={handleConsultDNI}
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
                  <label className="block mb-2 text-sm font-bold">Nombre Completo</label>
                  <input
                    type="text"
                    value={newWorker.name}
                    onChange={(e) => setNewWorker({...newWorker, name: e.target.value})}
                    placeholder="Nombre recuperado de RENIEC"
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-bold">Cargo/Posición</label>
                  <select 
                    value={newWorker.position}
                    onChange={(e) => setNewWorker({...newWorker, position: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                  >
                    <option>Soldador</option>
                    <option>Operario de Corte</option>
                    <option>Pintor</option>
                    <option>Operario de Acabado</option>
                    <option>Ayudante</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-bold">Tipo de Salario</label>
                  <select 
                    value={newWorker.salaryType}
                    onChange={(e) => setNewWorker({...newWorker, salaryType: e.target.value as any})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                  >
                    <option value="mensual">Mensual</option>
                    <option value="diario">Por Día</option>
                  </select>
                </div>
                {newWorker.salaryType === 'mensual' ? (
                  <div>
                    <label className="block mb-2 text-sm font-bold">Salario Mensual (S/)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newWorker.monthlySalary}
                      onChange={(e) => setNewWorker({...newWorker, monthlySalary: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                      placeholder="1500.00"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block mb-2 text-sm font-bold">Salario Diario (S/)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newWorker.dailySalary}
                      onChange={(e) => setNewWorker({...newWorker, dailySalary: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                      placeholder="60.00"
                    />
                  </div>
                )}
                <div>
                  <label className="block mb-2 text-sm font-bold">Días Laborables al Mes</label>
                  <input
                    type="number"
                    value={newWorker.workDays}
                    onChange={(e) => setNewWorker({...newWorker, workDays: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                    placeholder="26"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-bold">Fecha de Inicio</label>
                  <input
                    type="date"
                    value={newWorker.startDate}
                    onChange={(e) => setNewWorker({...newWorker, startDate: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-blue-800">
                  Guardar Trabajador
                </button>
                <button
                  onClick={() => setShowWorkerForm(false)}
                  className="px-6 py-2 border border-[var(--border)] rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg border border-[var(--border)]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-[var(--foreground)]">ID</th>
                    <th className="px-6 py-3 text-left text-[var(--foreground)]">Nombre</th>
                    <th className="px-6 py-3 text-left text-[var(--foreground)]">DNI</th>
                    <th className="px-6 py-3 text-left text-[var(--foreground)]">Cargo</th>
                    <th className="px-6 py-3 text-left text-[var(--foreground)]">Tipo Salario</th>
                    <th className="px-6 py-3 text-left text-[var(--foreground)]">Monto</th>
                    <th className="px-6 py-3 text-left text-[var(--foreground)]">Días/Mes</th>
                    <th className="px-6 py-3 text-left text-[var(--foreground)]">Inicio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {workers.map(worker => (
                    <tr key={worker.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-[var(--foreground)]">{worker.id}</td>
                      <td className="px-6 py-4 text-[var(--foreground)]">{worker.name}</td>
                      <td className="px-6 py-4 text-[var(--muted-foreground)]">{worker.dni}</td>
                      <td className="px-6 py-4 text-[var(--foreground)]">{worker.position}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          worker.salaryType === 'mensual' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {worker.salaryType === 'mensual' ? 'Mensual' : 'Diario'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[var(--foreground)]">
                        S/ {worker.salaryType === 'mensual' ? worker.monthlySalary?.toFixed(2) : worker.dailySalary?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-[var(--muted-foreground)]">{worker.workDays}</td>
                      <td className="px-6 py-4 text-[var(--muted-foreground)]">
                        {new Date(worker.startDate).toLocaleDateString('es-PE')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'calculos' && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-[var(--primary)]" />
            <div>
              <label className="block mb-2">Seleccionar Período</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 border border-[var(--border)] rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg text-white shadow-lg">
              <DollarSign className="w-8 h-8 mb-3 opacity-80" />
              <h3 className="text-white mb-1">Total Planilla</h3>
              <p className="text-white opacity-90">
                S/ {workers.reduce((acc, w) => {
                  const days = getWorkerAttendance(w.id).filter(a => a.status !== 'ausente').length;
                  return acc + calculateSalary(w, days);
                }, 0).toFixed(2)}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg text-white shadow-lg">
              <Users className="w-8 h-8 mb-3 opacity-80" />
              <h3 className="text-white mb-1">Trabajadores Activos</h3>
              <p className="text-white opacity-90">{workers.length}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg text-white shadow-lg">
              <Calendar className="w-8 h-8 mb-3 opacity-80" />
              <h3 className="text-white mb-1">Días Laborables</h3>
              <p className="text-white opacity-90">26 días</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[var(--border)]">
            <div className="p-4 border-b border-[var(--border)]">
              <h3>Cálculo de Sueldos - {new Date(selectedMonth).toLocaleDateString('es-PE', { year: 'numeric', month: 'long' })}</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-[var(--foreground)]">Trabajador</th>
                    <th className="px-6 py-3 text-left text-[var(--foreground)]">Cargo</th>
                    <th className="px-6 py-3 text-left text-[var(--foreground)]">Tipo</th>
                    <th className="px-6 py-3 text-left text-[var(--foreground)]">Salario Base</th>
                    <th className="px-6 py-3 text-left text-[var(--foreground)]">Días Trabajados</th>
                    <th className="px-6 py-3 text-left text-[var(--foreground)]">Tarifa Diaria</th>
                    <th className="px-6 py-3 text-left text-[var(--foreground)]">Sueldo Calculado</th>
                    <th className="px-6 py-3 text-left text-[var(--foreground)]">% Avance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {workers.map(worker => {
                    const attendanceRecords = getWorkerAttendance(worker.id);
                    const daysWorked = attendanceRecords.filter(a => a.status !== 'ausente').length;
                    const halfDays = attendanceRecords.filter(a => a.status === 'medio-dia').length;
                    const effectiveDays = daysWorked - (halfDays * 0.5);
                    const calculatedSalary = calculateSalary(worker, effectiveDays);
                    const dailyRate = worker.salaryType === 'mensual' && worker.monthlySalary
                      ? worker.monthlySalary / worker.workDays
                      : worker.dailySalary || 0;
                    const baseSalary = worker.salaryType === 'mensual' ? worker.monthlySalary : (worker.dailySalary || 0) * 26;
                    const progress = baseSalary ? (calculatedSalary / baseSalary) * 100 : 0;

                    return (
                      <tr key={worker.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-[var(--foreground)]">{worker.name}</td>
                        <td className="px-6 py-4 text-[var(--muted-foreground)]">{worker.position}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            worker.salaryType === 'mensual' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {worker.salaryType === 'mensual' ? 'Mensual' : 'Diario'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[var(--foreground)]">S/ {baseSalary?.toFixed(2)}</td>
                        <td className="px-6 py-4 text-[var(--foreground)]">
                          {effectiveDays.toFixed(1)} / {worker.workDays}
                        </td>
                        <td className="px-6 py-4 text-[var(--muted-foreground)]">S/ {dailyRate.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className="text-[var(--primary)]">S/ {calculatedSalary.toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                              <div
                                className="bg-[var(--primary)] h-2 rounded-full"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-[var(--muted-foreground)]">{progress.toFixed(0)}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Calculator className="w-6 h-6 text-blue-600 mt-1" />
              <div className="flex-1">
                <h3 className="text-blue-900 mb-2">Cálculo Automático de Sueldos</h3>
                <p className="text-sm text-blue-800 mb-3">
                  El sistema calcula automáticamente el sueldo de cada trabajador según:
                </p>
                <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                  <li>Días efectivamente trabajados en el período seleccionado</li>
                  <li>Salidas a medio día se cuentan como 0.5 días</li>
                  <li>Tarifa diaria = Salario Mensual ÷ Días Laborables</li>
                  <li>Sueldo Calculado = Tarifa Diaria × Días Trabajados</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
