import { AlertTriangle, Package, Zap } from 'lucide-react';

export interface StockAlertProps {
  productName: string;
  currentStock: number;
  minStock: number;
  unit: string;
  severity: 'critical' | 'warning' | 'normal';
}

export function StockAlert({ productName, currentStock, minStock, unit, severity }: StockAlertProps) {
  const severityStyles = {
    critical: 'bg-red-50/50 border-red-100 text-red-900',
    warning: 'bg-amber-50/50 border-amber-100 text-amber-900',
    normal: 'bg-emerald-50/50 border-emerald-100 text-emerald-900'
  };

  const badgeStyles = {
    critical: 'bg-red-100 text-red-700',
    warning: 'bg-amber-100 text-amber-700',
    normal: 'bg-emerald-100 text-emerald-700'
  };

  return (
    <div className={`p-4 rounded-xl border ${severityStyles[severity]} flex items-center gap-4 transition-all hover:shadow-sm`}>
      <div className={`p-2.5 rounded-lg ${badgeStyles[severity]}`}>
        {severity === 'critical' ? (
          <Zap className="w-5 h-5 animate-pulse" />
        ) : severity === 'warning' ? (
          <AlertTriangle className="w-5 h-5" />
        ) : (
          <Package className="w-5 h-5" />
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center justify-between">
            <p className="font-bold text-sm tracking-tight">{productName}</p>
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${badgeStyles[severity]}`}>
                {severity === 'critical' ? 'Crítico' : severity === 'warning' ? 'Bajo' : 'Normal'}
            </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full ${severity === 'critical' ? 'bg-red-500' : severity === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min((currentStock / minStock) * 100, 100)}%` }}
                ></div>
            </div>
            <p className="text-[11px] font-medium text-slate-500 whitespace-nowrap">
                <span className="font-bold text-slate-900">{currentStock}</span> / {minStock} {unit}
            </p>
        </div>
      </div>
      
      {severity === 'critical' && (
        <button className="px-3 py-1.5 bg-white border border-red-200 text-red-600 text-xs font-bold rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm">
          Pedir
        </button>
      )}
    </div>
  );
}

