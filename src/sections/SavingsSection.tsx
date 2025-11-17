import { Card } from '../components/common/Card';
import { NumericInput } from '../components/common/NumericInput';
import { useFinancialProfile } from '../hooks/useFinancialProfile';
import { ProgressSummary } from '../components/common/ProgressSummary';
import { HorizonteDetalle, HorizonteInversion, InstrumentoFinanciero } from '../types/financial';
import { v4 as uuidv4 } from 'uuid';

const horizonConfig: Record<HorizonteInversion, { label: string; description: string; tasa: number }> = {
  corto: { label: 'Corto plazo', description: 'Objetivos de 0 a 12 meses (colchón, vacaciones, etc.).', tasa: 0.04 },
  mediano: { label: 'Mediano plazo', description: 'Metas entre 1 y 5 años.', tasa: 0.06 },
  largo: { label: 'Largo plazo', description: 'Metas de más de 5 años y jubilación.', tasa: 0.1 }
};

const instrumentoOptions = [
  'Cuenta de ahorro',
  'Depósito a plazo',
  'Fondo mutuo',
  'APV',
  'Acciones',
  'ETF',
  'Inmobiliario',
  'Otro'
];

export const SavingsSection = () => {
  const { perfil, updateAhorro } = useFinancialProfile();
  const { ahorro, ingreso } = perfil;
  const { horizontes } = ahorro;

  const ahorroMensualTotal = ahorro.ahorro_mensual_total;
  const summaryDetails = (Object.keys(horizonConfig) as HorizonteInversion[]).map((key) => ({
    label: horizonConfig[key].label,
    value: `$${horizontes[key].monto_mensual.toLocaleString('es-CL')}`
  }));

  const updateHorizonte = (key: HorizonteInversion, updates: Partial<HorizonteDetalle>) => {
    updateAhorro({
      horizontes: {
        ...horizontes,
        [key]: {
          ...horizontes[key],
          ...updates
        }
      }
    });
  };

  const handleInstrumentChange = (
    key: HorizonteInversion,
    scope: 'instrumentos_mensuales' | 'instrumentos_stock',
    instrumentoId: string,
    updates: Partial<InstrumentoFinanciero>
  ) => {
    const lista = horizontes[key][scope].map((inst) => (inst.id === instrumentoId ? { ...inst, ...updates } : inst));
    updateHorizonte(key, { [scope]: lista } as Partial<HorizonteDetalle>);
  };

  const removeInstrument = (key: HorizonteInversion, scope: 'instrumentos_mensuales' | 'instrumentos_stock', instrumentoId: string) => {
    const lista = horizontes[key][scope].filter((inst) => inst.id !== instrumentoId);
    updateHorizonte(key, { [scope]: lista } as Partial<HorizonteDetalle>);
  };

  const addInstrument = (key: HorizonteInversion, scope: 'instrumentos_mensuales' | 'instrumentos_stock') => {
    const lista = horizontes[key][scope];
    updateHorizonte(key, {
      [scope]: [
        ...lista,
        {
          id: `${scope}_${uuidv4()}`,
          tipo: 'Otro',
          monto: 0
        }
      ]
    } as Partial<HorizonteDetalle>);
  };

  const sumInstrumentos = (lista: InstrumentoFinanciero[]) => lista.reduce((sum, inst) => sum + (inst.monto || 0), 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="space-y-6">
        <Card title="Ahorro mensual por horizonte">
          <p className="text-sm text-slate-500">Completa tu aporte mensual total y cómo se distribuye entre instrumentos.</p>
          <div className="space-y-8">
            {(Object.keys(horizonConfig) as HorizonteInversion[]).map((key) => {
              const data = horizontes[key];
              const instrumentosTotal = sumInstrumentos(data.instrumentos_mensuales);
              const excede = instrumentosTotal > data.monto_mensual && data.monto_mensual > 0;
              return (
                <div key={key} className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex flex-col gap-1">
                    <h4 className="text-base font-semibold text-slate-800">{horizonConfig[key].label}</h4>
                    <p className="text-sm text-slate-500">{horizonConfig[key].description}</p>
                  </div>
                  <div className="mt-3 grid gap-4 md:grid-cols-2">
                    <NumericInput
                      label="Ahorro mensual"
                      value={data.monto_mensual || ''}
                      onChange={(e) => updateHorizonte(key, { monto_mensual: Number(e.target.value) || 0 })}
                    />
                    <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                      Tasa de referencia anual: {(horizonConfig[key].tasa * 100).toFixed(1)} %
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-700">Instrumentos asociados</p>
                      <button
                        type="button"
                        className="text-sm font-semibold text-brand-600"
                        onClick={() => addInstrument(key, 'instrumentos_mensuales')}
                      >
                        + Agregar instrumento
                      </button>
                    </div>
                    {data.instrumentos_mensuales.length === 0 && (
                      <p className="text-sm text-slate-500">Detalla si este ahorro va a cuentas, fondos u otros vehículos.</p>
                    )}
                    {data.instrumentos_mensuales.map((inst) => (
                      <div key={inst.id} className="grid gap-3 md:grid-cols-[1fr,1fr,auto]">
                        <label className="text-sm font-medium text-slate-700">
                          Tipo
                          <select
                            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                            value={inst.tipo}
                            onChange={(e) => handleInstrumentChange(key, 'instrumentos_mensuales', inst.id, { tipo: e.target.value })}
                          >
                            {instrumentoOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </label>
                        <NumericInput
                          label="Monto mensual"
                          value={inst.monto || ''}
                          onChange={(e) => handleInstrumentChange(key, 'instrumentos_mensuales', inst.id, { monto: Number(e.target.value) || 0 })}
                        />
                        <button
                          type="button"
                          className="self-end text-xs font-semibold text-red-500"
                          onClick={() => removeInstrument(key, 'instrumentos_mensuales', inst.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                    {excede && (
                      <p className="text-xs text-red-500">Estás asignando más de lo que ahorras en este horizonte. Ajusta los montos de instrumentos.</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card title="Stock actual de inversiones">
          <p className="text-sm text-slate-500">Cuánto tienes acumulado hoy y en qué instrumentos está invertido.</p>
          <div className="space-y-8">
            {(Object.keys(horizonConfig) as HorizonteInversion[]).map((key) => {
              const data = horizontes[key];
              const instrumentosTotal = sumInstrumentos(data.instrumentos_stock);
              const excede = instrumentosTotal > data.stock_actual && data.stock_actual > 0;
              return (
                <div key={key} className="rounded-2xl border border-slate-100 p-4">
                  <h4 className="text-base font-semibold text-slate-800">{horizonConfig[key].label}</h4>
                  <div className="mt-3 grid gap-4 md:grid-cols-2">
                    <NumericInput
                      label="Stock actual"
                      value={data.stock_actual || ''}
                      onChange={(e) => updateHorizonte(key, { stock_actual: Number(e.target.value) || 0 })}
                    />
                    <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                      Este monto alimenta el simulador de proyección.
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-700">Instrumentos actuales</p>
                      <button
                        type="button"
                        className="text-sm font-semibold text-brand-600"
                        onClick={() => addInstrument(key, 'instrumentos_stock')}
                      >
                        + Agregar instrumento
                      </button>
                    </div>
                    {data.instrumentos_stock.length === 0 && (
                      <p className="text-sm text-slate-500">Describe dónde está invertido el stock de este horizonte.</p>
                    )}
                    {data.instrumentos_stock.map((inst) => (
                      <div key={inst.id} className="grid gap-3 md:grid-cols-[1fr,1fr,auto]">
                        <label className="text-sm font-medium text-slate-700">
                          Tipo
                          <select
                            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                            value={inst.tipo}
                            onChange={(e) => handleInstrumentChange(key, 'instrumentos_stock', inst.id, { tipo: e.target.value })}
                          >
                            {instrumentoOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </label>
                        <NumericInput
                          label="Monto actual"
                          value={inst.monto || ''}
                          onChange={(e) => handleInstrumentChange(key, 'instrumentos_stock', inst.id, { monto: Number(e.target.value) || 0 })}
                        />
                        <button
                          type="button"
                          className="self-end text-xs font-semibold text-red-500"
                          onClick={() => removeInstrument(key, 'instrumentos_stock', inst.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                    {excede && (
                      <p className="text-xs text-red-500">La suma de instrumentos supera el stock declarado. Ajusta los montos.</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
      <ProgressSummary
        title="Ahorro e inversión mensual"
        amount={ahorroMensualTotal}
        income={ingreso.ingreso_total}
        description="El objetivo recomendado es destinar al menos 20 % de tu ingreso al ahorro."
        details={summaryDetails}
      />
    </div>
  );
};
