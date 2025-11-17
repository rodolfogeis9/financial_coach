import { useEffect, useMemo, useState } from 'react';
import { Card } from '../common/Card';
import { useFinancialProfile } from '../../hooks/useFinancialProfile';
import { HorizonteInversion } from '../../types/financial';

const HORIZON_LABELS: Record<HorizonteInversion, { label: string; color: string; retorno: number }> = {
  corto: { label: 'Corto plazo', color: '#0ea5e9', retorno: 0.04 },
  mediano: { label: 'Mediano plazo', color: '#6366f1', retorno: 0.06 },
  largo: { label: 'Largo plazo', color: '#f97316', retorno: 0.1 }
};

interface SeriePunto {
  year: number;
  value: number;
}

interface HorizonteProjection {
  series: SeriePunto[];
  final: number;
  aportesFuturos: number;
  stockInicial: number;
  rentabilidad: number;
}

const proyectarHorizonte = (
  key: HorizonteInversion,
  anos: number,
  edadActual: number,
  stockInicial: number,
  aporteMensual: number
): HorizonteProjection => {
  const meses = Math.max(1, Math.round(anos * 12));
  const tasaMensual = Math.pow(1 + HORIZON_LABELS[key].retorno, 1 / 12) - 1;
  let saldo = stockInicial;
  const series: SeriePunto[] = [{ year: edadActual, value: saldo }];
  for (let mes = 1; mes <= meses; mes++) {
    saldo = saldo * (1 + tasaMensual) + aporteMensual;
    if (mes % 12 === 0) {
      series.push({ year: edadActual + mes / 12, value: saldo });
    }
  }
  if (series[series.length - 1]?.year !== edadActual + anos) {
    series.push({ year: edadActual + anos, value: saldo });
  }
  const aportesFuturos = aporteMensual * meses;
  const rentabilidad = saldo - stockInicial - aportesFuturos;
  return { series, final: saldo, aportesFuturos, stockInicial, rentabilidad };
};

export const ProjectionSimulator = ({ embedded = false }: { embedded?: boolean }) => {
  const { perfil } = useFinancialProfile();
  const { ahorro, usuario } = perfil;
  const edadActual = usuario.edad || 30;
  const anosHasta65 = Math.max(0, 65 - edadActual);
  const defaultYears = anosHasta65 > 0 ? anosHasta65 : 5;
  const sliderMax = Math.max(defaultYears, 5);
  const [anos, setAnos] = useState(defaultYears);
  const sliderMin = 1;

  useEffect(() => {
    setAnos((prev) => {
      const clamped = Math.min(Math.max(prev, sliderMin), sliderMax);
      return clamped;
    });
  }, [sliderMax]);

  useEffect(() => {
    setAnos(defaultYears);
  }, [defaultYears]);
  const horizontes = ahorro.horizontes;
  const hasData = Object.values(horizontes).some((h) => h.monto_mensual > 0 || h.stock_actual > 0);

  const projections = useMemo(() => {
    const resultado: Record<HorizonteInversion, HorizonteProjection> = {
      corto: proyectarHorizonte('corto', anos, edadActual, horizontes.corto.stock_actual, horizontes.corto.monto_mensual),
      mediano: proyectarHorizonte('mediano', anos, edadActual, horizontes.mediano.stock_actual, horizontes.mediano.monto_mensual),
      largo: proyectarHorizonte('largo', anos, edadActual, horizontes.largo.stock_actual, horizontes.largo.monto_mensual)
    };
    const puntos = resultado.corto.series.length;
    const maxValor = Math.max(
      1,
      ...(['corto', 'mediano', 'largo'] as HorizonteInversion[]).flatMap((key) => resultado[key].series.map((p) => p.value))
    );
    const polylines = (['corto', 'mediano', 'largo'] as HorizonteInversion[]).map((key) => {
      const serie = resultado[key].series;
      return {
        key,
        color: HORIZON_LABELS[key].color,
        points: serie
          .map((punto, index) => {
            const x = (index / Math.max(1, puntos - 1)) * 100;
            const y = 100 - (punto.value / maxValor) * 100;
            return `${x},${y}`;
          })
          .join(' ')
      };
    });
    return { resultado, polylines, maxValor };
  }, [anos, edadActual, horizontes.corto, horizontes.mediano, horizontes.largo]);

  const cardTitle = embedded ? 'Simulador de proyección' : 'Simulador de proyección de ahorro e inversión';

  return (
    <Card title={cardTitle}>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-semibold text-slate-800">Edad actual</p>
          <p className="text-2xl font-bold text-slate-900">{edadActual || '—'} años</p>
          <p className="mt-2 text-xs text-slate-500">Los cálculos se proyectan hasta la edad objetivo.</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-semibold text-slate-800">Años a simular</p>
          <input
            type="range"
            min={sliderMin}
            max={sliderMax}
            value={anos}
            onChange={(e) => setAnos(Number(e.target.value))}
            className="mt-2 w-full accent-brand-600"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{sliderMin} año{sliderMin !== 1 ? 's' : ''}</span>
            <span>
              {edadActual < 65
                ? `Hasta los 65 años (${sliderMax} años)`
                : `${sliderMax} años`}
            </span>
          </div>
          <p className="mt-2 text-base font-semibold text-slate-900">{anos} años</p>
          {edadActual < 65 && (
            <p className="text-xs text-slate-500">Por defecto simulamos hasta tu edad de 65 años.</p>
          )}
        </div>
        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-semibold text-slate-800">Edad objetivo</p>
          <p className="text-2xl font-bold text-slate-900">{(edadActual + anos).toFixed(0)} años</p>
          <p className="mt-2 text-xs text-slate-500">Rentabilidades asumidas: 4 % (corto), 6 % (mediano), 10 % (largo).</p>
        </div>
      </div>
      {!hasData ? (
        <p className="mt-6 rounded-2xl bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          Ingresa un monto de ahorro mensual o stock actual en la sección de Ahorro para simular tu proyección.
        </p>
      ) : (
        <div className="mt-6 space-y-6">
          <div>
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>Evolución proyectada</span>
              <span>Valores en $</span>
            </div>
            <div className="mt-2 rounded-2xl border border-slate-100 bg-white p-4">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-48 w-full">
                {projections.polylines.map((line) => (
                  <polyline
                    key={line.key}
                    fill="none"
                    stroke={line.color}
                    strokeWidth={2.5}
                    strokeLinejoin="round"
                    points={line.points}
                  />
                ))}
              </svg>
              <div className="mt-3 flex flex-wrap gap-4 text-xs">
                {(Object.keys(HORIZON_LABELS) as HorizonteInversion[]).map((key) => (
                  <span key={key} className="flex items-center gap-2 text-slate-600">
                    <span className="h-2 w-6 rounded-full" style={{ backgroundColor: HORIZON_LABELS[key].color }}></span>
                    {HORIZON_LABELS[key].label}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="overflow-auto">
            <table className="w-full min-w-[500px] text-sm">
              <thead className="text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="py-2">Horizonte</th>
                  <th>Stock actual</th>
                  <th>Aportes futuros</th>
                  <th>Valor proyectado</th>
                  <th>Rentabilidad generada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(Object.keys(HORIZON_LABELS) as HorizonteInversion[]).map((key) => {
                  const resumen = projections.resultado[key];
                  return (
                    <tr key={key}>
                      <td className="py-3 font-semibold text-slate-700">{HORIZON_LABELS[key].label}</td>
                      <td>${resumen.stockInicial.toFixed(0)}</td>
                      <td>${resumen.aportesFuturos.toFixed(0)}</td>
                      <td className="font-semibold text-slate-900">${resumen.final.toFixed(0)}</td>
                      <td className={resumen.rentabilidad >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                        ${resumen.rentabilidad.toFixed(0)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-slate-600">
            Si mantienes tus aportes actuales durante {anos} años, podrías acumular ${
              projections.resultado.largo.final.toFixed(0)
            } en el horizonte de largo plazo, donde ${projections.resultado.largo.aportesFuturos.toFixed(0)} provienen de tus aportes y ${
              projections.resultado.largo.rentabilidad.toFixed(0)
            } de la rentabilidad compuesta.
          </p>
        </div>
      )}
    </Card>
  );
};
