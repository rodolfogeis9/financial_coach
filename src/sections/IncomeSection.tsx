import { NumericInput } from '../components/common/NumericInput';
import { Card } from '../components/common/Card';
import { TipoVivienda, TipoOtroIngreso } from '../types/financial';
import { useFinancialProfile } from '../hooks/useFinancialProfile';
import { v4 as uuidv4 } from 'uuid';
import { formatCurrency } from '../utils/numberFormat';

const viviendaOptions = [
  { label: 'Propia con hipoteca', value: TipoVivienda.PROPIA_HIPOTECA },
  { label: 'Propia pagada', value: TipoVivienda.PROPIA_PAGADA },
  { label: 'Arrendada', value: TipoVivienda.ARRENDADA },
  { label: 'Prestada', value: TipoVivienda.PRESTADA }
];

const otrosOptions: { label: string; value: TipoOtroIngreso }[] = [
  { label: 'Arriendos', value: 'ARRIENDOS' },
  { label: 'Freelance', value: 'FREELANCE' },
  { label: 'Pensión', value: 'PENSION' },
  { label: 'Otros', value: 'OTROS' }
];

export const IncomeSection = () => {
  const { perfil, setPerfil, updateIngreso } = useFinancialProfile();
  const { usuario, ingreso } = perfil;

  const normalizePositiveInteger = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    const withoutLeadingZeros = digitsOnly.replace(/^0+(?=\d)/, '');
    const numeric = withoutLeadingZeros === '' ? 0 : parseInt(withoutLeadingZeros, 10);
    return Math.max(1, numeric);
  };

  const handleOtroChange = (id: string, updates: Partial<(typeof ingreso)['otros_ingresos'][number]>) => {
    const updated = ingreso.otros_ingresos.map((item) => (item.id === id ? { ...item, ...updates } : item));
    updateIngreso({ otros_ingresos: updated });
  };

  const addOtroIngreso = () => {
    updateIngreso({
      otros_ingresos: [
        ...ingreso.otros_ingresos,
        {
          id: uuidv4(),
          tipo: 'OTROS' as TipoOtroIngreso,
          monto: 0
        }
      ]
    });
  };

  const removeOtroIngreso = (id: string) => {
    updateIngreso({ otros_ingresos: ingreso.otros_ingresos.filter((item) => item.id !== id) });
  };

  const totalOtros = ingreso.otros_ingresos.reduce((sum, item) => sum + (item.monto || 0), 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="space-y-6">
        <Card title="Datos personales">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Nombre
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                value={usuario.nombre}
                onChange={(e) =>
                  setPerfil((prev) => ({
                    ...prev,
                    usuario: { ...prev.usuario, nombre: e.target.value }
                  }))
                }
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Edad
              <input
                type="number"
                inputMode="numeric"
                min={1}
                step={1}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                value={usuario.edad}
                onChange={(e) =>
                  setPerfil((prev) => ({ ...prev, usuario: { ...prev.usuario, edad: normalizePositiveInteger(e.target.value) } }))
                }
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Adultos en el hogar
              <input
                type="number"
                inputMode="numeric"
                min={1}
                step={1}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                value={usuario.adultos}
                onChange={(e) =>
                  setPerfil((prev) => ({ ...prev, usuario: { ...prev.usuario, adultos: normalizePositiveInteger(e.target.value) } }))
                }
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Niños
              <input
                type="number"
                inputMode="numeric"
                min={1}
                step={1}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                value={usuario.ninos}
                onChange={(e) =>
                  setPerfil((prev) => ({ ...prev, usuario: { ...prev.usuario, ninos: normalizePositiveInteger(e.target.value) } }))
                }
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Tipo de vivienda
              <select
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                value={usuario.tipo_vivienda}
                onChange={(e) =>
                  setPerfil((prev) => ({
                    ...prev,
                    usuario: { ...prev.usuario, tipo_vivienda: e.target.value as TipoVivienda }
                  }))
                }
              >
                {viviendaOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </Card>
        <Card title="Ingresos mensuales">
          <div className="grid gap-4 md:grid-cols-2">
            <NumericInput
              label="Sueldo neto"
              value={ingreso.sueldo_neto}
              onValueChange={(value) => updateIngreso({ sueldo_neto: value })}
              tooltip="Ingreso líquido después de descuentos"
            />
            <NumericInput
              label="Bonos mensualizados"
              value={ingreso.bonos_mensualizados}
              onValueChange={(value) => updateIngreso({ bonos_mensualizados: value })}
            />
          </div>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-semibold text-slate-700">Otros ingresos</h4>
              <button
                type="button"
                onClick={addOtroIngreso}
                className="text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                + Agregar otro ingreso
              </button>
            </div>
            {ingreso.otros_ingresos.length === 0 && (
              <p className="text-sm text-slate-500">Si tienes arriendos, freelance u otros ingresos, regístralos aquí.</p>
            )}
            <div className="space-y-3">
              {ingreso.otros_ingresos.map((item) => (
                <div key={item.id} className="grid gap-3 md:grid-cols-[1fr,1fr,auto]">
                  <label className="text-sm font-medium text-slate-700">
                    Tipo
                    <select
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                      value={item.tipo}
                      onChange={(e) => handleOtroChange(item.id, { tipo: e.target.value as TipoOtroIngreso })}
                    >
                      {otrosOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <NumericInput
                    label="Monto mensual"
                    value={item.monto}
                    onValueChange={(value) => handleOtroChange(item.id, { monto: value })}
                  />
                  <button
                    type="button"
                    className="self-end text-xs font-semibold text-red-500"
                    onClick={() => removeOtroIngreso(item.id)}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-600">
              Total otros ingresos: {formatCurrency(totalOtros)} (se suma automáticamente al ingreso mensual).
            </p>
          </div>
          <p className="mt-4 text-sm text-slate-600">
            ingreso_total = sueldo neto + bonos mensualizados + suma de otros ingresos
          </p>
        </Card>
      </div>
      <Card title="Resumen de ingreso" className="h-fit">
        <p className="text-sm text-slate-500">Ingreso mensual total</p>
        <p className="text-4xl font-bold text-slate-900">{formatCurrency(ingreso.ingreso_total)}</p>
        {ingreso.ingreso_total <= 0 && (
          <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            Debes ingresar al menos un ingreso mensual para avanzar.
          </p>
        )}
      </Card>
    </div>
  );
};
