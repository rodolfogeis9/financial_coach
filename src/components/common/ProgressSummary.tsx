import clsx from 'clsx';
import { Card } from './Card';
import { formatCurrency } from '../../utils/numberFormat';

interface DetailItem {
  label: string;
  value: string;
}

interface ProgressSummaryProps {
  title: string;
  amount: number;
  income: number;
  description?: string;
  details?: DetailItem[];
}

export const ProgressSummary = ({ title, amount, income, description, details = [] }: ProgressSummaryProps) => {
  const ingresoValido = income > 0;
  const porcentaje = ingresoValido ? (amount / income) * 100 : 0;
  const porcentajeRestante = ingresoValido ? 100 - porcentaje : 100;
  const diferencia = ingresoValido ? income - amount : 0;
  const excedido = ingresoValido && porcentaje > 100;
  const message = !ingresoValido
    ? 'Ingresa tu sueldo mensual para medir tu avance.'
    : excedido
    ? `Te estás excediendo en ${formatCurrency(Math.abs(diferencia))} (${Math.abs(porcentajeRestante).toFixed(1)} %).`
    : `Te quedan ${formatCurrency(Math.max(0, diferencia))} por asignar (${Math.max(0, porcentajeRestante).toFixed(1)} %).`;

  return (
    <Card title={title} className="h-fit space-y-5">
      {description && <p className="text-sm text-slate-500">{description}</p>}
      <div className="space-y-2">
        <p className="text-4xl font-bold text-slate-900">{formatCurrency(amount)}</p>
        <p className="text-sm text-slate-500">
          {ingresoValido ? `${porcentaje.toFixed(1)} % del ingreso mensual` : '0 % del ingreso mensual'}
        </p>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={clsx('h-full rounded-full transition-all', excedido ? 'bg-red-500' : 'bg-brand-500')}
            style={{ width: `${Math.min(120, Math.abs(porcentaje))}%` }}
          ></div>
        </div>
        <p className={clsx('text-sm font-semibold', excedido ? 'text-red-600' : 'text-slate-700')}>{message}</p>
      </div>
      {details.length > 0 && (
        <ul className="divide-y divide-slate-100 text-sm text-slate-600">
          {details.map((detail) => (
            <li key={detail.label} className="flex justify-between py-1">
              <span>{detail.label}</span>
              <span className="font-semibold text-slate-900">{detail.value}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};
