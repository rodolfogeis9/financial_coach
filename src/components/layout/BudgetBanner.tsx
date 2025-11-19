import { formatNumber } from '../../utils/numberFormat';

interface BudgetBannerProps {
  income: number;
  assigned: number;
}

export const BudgetBanner = ({ income, assigned }: BudgetBannerProps) => {
  const difference = income - assigned;
  const hasIncome = income > 0;
  const progress = hasIncome ? Math.min(100, Math.max(0, (assigned / income) * 100)) : 0;

  let title = 'Asigna tu sueldo mensual';
  let subtitle = 'Ingresa tu sueldo neto para comenzar a distribuir tu dinero.';
  let accent = 'text-white';
  let badge = 'bg-white/20 text-white';

  if (hasIncome && difference > 0) {
    title = 'Aún tienes dinero disponible';
    subtitle = `Has asignado $${formatNumber(assigned)} de $${formatNumber(income)}. Te faltan $${formatNumber(difference)} por distribuir en gastos o ahorro.`;
  } else if (hasIncome && difference < 0) {
    title = 'Estás excediendo tu sueldo';
    subtitle = `Tus gastos superan tu ingreso mensual por $${formatNumber(Math.abs(difference))}. Ajusta para volver al equilibrio.`;
  } else if (hasIncome && difference === 0) {
    title = '¡Perfecto!';
    subtitle = 'Asignaste el 100 % de tu ingreso mensual entre gastos e inversiones.';
    accent = 'text-emerald-50';
    badge = 'bg-emerald-400/20 text-emerald-50';
  }

  return (
    <div className="rounded-3xl bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-600 p-[1px] shadow-2xl">
      <div className="flex flex-col gap-6 rounded-[calc(1.5rem-1px)] bg-white/90 p-6 text-slate-900 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${badge}`}>
            Controla tu sueldo
          </span>
          <h2 className={`text-2xl font-bold ${accent}`}>{title}</h2>
          <p className="text-sm text-slate-600">{subtitle}</p>
        </div>
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm font-semibold text-slate-600">
            <span>Ingreso: ${formatNumber(income)}</span>
            <span>Asignado: ${formatNumber(assigned)}</span>
            <span className={difference < 0 ? 'text-red-600' : 'text-emerald-600'}>
              {difference < 0
                ? `Déficit: $${formatNumber(Math.abs(difference))}`
                : `Por asignar: $${formatNumber(Math.max(0, difference))}`}
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${difference < 0 ? 'bg-red-500' : 'bg-emerald-500'}`}
              style={{ width: `${hasIncome ? progress : 0}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
