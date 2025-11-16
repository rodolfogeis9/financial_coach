import { NumericInput } from '../components/common/NumericInput';
import { Card } from '../components/common/Card';
import { TipoVivienda, TipoOtroIngreso } from '../types/financial';
import { useFinancialProfile } from '../hooks/useFinancialProfile';

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
                onChange={(e) => setPerfil((prev) => ({
                  ...prev,
                  usuario: { ...prev.usuario, nombre: e.target.value }
                }))}
              />
            </label>
            <NumericInput
              label="Edad"
              value={usuario.edad || ''}
              onChange={(e) =>
                setPerfil((prev) => ({ ...prev, usuario: { ...prev.usuario, edad: Number(e.target.value) || 0 } }))
              }
              tooltip="Edad en años"
              prefix=""
            />
            <label className="text-sm font-medium text-slate-700">
              Ciudad
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                value={usuario.ciudad}
                onChange={(e) => setPerfil((prev) => ({
                  ...prev,
                  usuario: { ...prev.usuario, ciudad: e.target.value }
                }))}
              />
            </label>
            <NumericInput
              label="Adultos en el hogar"
              value={usuario.adultos || ''}
              onChange={(e) =>
                setPerfil((prev) => ({ ...prev, usuario: { ...prev.usuario, adultos: Number(e.target.value) || 0 } }))
              }
              tooltip="Inclúyete a ti"
              prefix=""
            />
            <NumericInput
              label="Niños"
              value={usuario.ninos || ''}
              onChange={(e) =>
                setPerfil((prev) => ({ ...prev, usuario: { ...prev.usuario, ninos: Number(e.target.value) || 0 } }))
              }
              prefix=""
            />
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
              value={ingreso.sueldo_neto || ''}
              onChange={(e) => updateIngreso({ sueldo_neto: Number(e.target.value) || 0 })}
              tooltip="Ingreso líquido después de descuentos"
            />
            <NumericInput
              label="Bonos mensualizados"
              value={ingreso.bonos_mensualizados || ''}
              onChange={(e) => updateIngreso({ bonos_mensualizados: Number(e.target.value) || 0 })}
            />
            <NumericInput
              label="Otros ingresos"
              value={ingreso.otros_ingresos || ''}
              onChange={(e) => updateIngreso({ otros_ingresos: Number(e.target.value) || 0 })}
            />
            <label className="text-sm font-medium text-slate-700">
              Tipo de otros ingresos
              <select
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                value={ingreso.otros_ingresos_tipo}
                onChange={(e) => updateIngreso({ otros_ingresos_tipo: e.target.value as TipoOtroIngreso })}
              >
                {otrosOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="text-sm text-slate-600">
            ingreso_total = sueldo neto + bonos mensualizados + otros ingresos
          </p>
        </Card>
      </div>
      <Card title="Resumen de ingreso" className="h-fit">
        <p className="text-sm text-slate-500">Ingreso mensual total</p>
        <p className="text-4xl font-bold text-slate-900">${ingreso.ingreso_total.toLocaleString('es-CL')}</p>
        {ingreso.ingreso_total <= 0 && (
          <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            Debes ingresar al menos un ingreso mensual para avanzar.
          </p>
        )}
      </Card>
    </div>
  );
};
