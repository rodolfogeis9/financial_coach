import { v4 as uuidv4 } from 'uuid';
import { Card } from '../components/common/Card';
import { NumericInput } from '../components/common/NumericInput';
import { useFinancialProfile } from '../hooks/useFinancialProfile';
import { Deuda, TipoAgrupador, TipoDeuda } from '../types/financial';

const deudaLabels: Record<TipoDeuda, string> = {
  [TipoDeuda.CONSUMO]: 'Consumo',
  [TipoDeuda.AUTO]: 'Auto',
  [TipoDeuda.HIPOTECA]: 'Hipoteca',
  [TipoDeuda.EDUCATIVA]: 'Educativa',
  [TipoDeuda.OTRA]: 'Otra'
};

const agrupadorPorDeuda: Record<TipoDeuda, TipoAgrupador> = {
  [TipoDeuda.CONSUMO]: TipoAgrupador.DM,
  [TipoDeuda.AUTO]: TipoAgrupador.DM,
  [TipoDeuda.HIPOTECA]: TipoAgrupador.DB,
  [TipoDeuda.EDUCATIVA]: TipoAgrupador.DB,
  [TipoDeuda.OTRA]: TipoAgrupador.DM
};

export const DebtSection = () => {
  const { perfil, upsertDeuda, removeDeuda } = useFinancialProfile();
  const { deudas } = perfil;

  const addDeuda = (tipo: TipoDeuda) => {
    const nueva: Deuda = {
      id: `deuda-${uuidv4()}`,
      nombre: `${deudaLabels[tipo]} ${deudas.lista_deudas.length + 1}`,
      cuota_mensual: 0,
      tipo_deuda: tipo,
      tipo_agrupador: agrupadorPorDeuda[tipo]
    };
    upsertDeuda(nueva);
  };

  const totalPorTipo = (tipo: TipoAgrupador) =>
    deudas.lista_deudas.filter((d) => d.tipo_agrupador === tipo).reduce((sum, deuda) => sum + (deuda.cuota_mensual || 0), 0);

  return (
    <div className="space-y-6">
      <Card title="Detalle de deudas">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-slate-500">
              <th className="py-2">Nombre</th>
              <th>Tipo</th>
              <th>Cuota mensual</th>
              <th>Saldo total</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {deudas.lista_deudas.map((deuda) => (
              <tr key={deuda.id} className="align-middle">
                <td className="py-3 font-semibold text-slate-700">
                  <input
                    className="w-full rounded-xl border border-slate-200 px-3 py-2"
                    value={deuda.nombre}
                    onChange={(e) => upsertDeuda({ ...deuda, nombre: e.target.value })}
                  />
                </td>
                <td className="py-3 text-slate-500">
                  <select
                    className="rounded-xl border border-slate-200 px-2 py-1"
                    value={deuda.tipo_deuda}
                    onChange={(e) => {
                      const tipo = e.target.value as TipoDeuda;
                      upsertDeuda({ ...deuda, tipo_deuda: tipo, tipo_agrupador: agrupadorPorDeuda[tipo] });
                    }}
                  >
                    {Object.values(TipoDeuda).map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {deudaLabels[tipo]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-3">
                  <NumericInput
                    label=""
                    value={deuda.cuota_mensual || ''}
                    onChange={(e) => upsertDeuda({ ...deuda, cuota_mensual: Number(e.target.value) || 0 })}
                    className="min-w-[150px]"
                  />
                </td>
                <td className="py-3">
                  <NumericInput
                    label=""
                    value={deuda.saldo_total || ''}
                    onChange={(e) => upsertDeuda({ ...deuda, saldo_total: Number(e.target.value) || 0 })}
                    className="min-w-[150px]"
                  />
                </td>
                <td className="py-3 text-right">
                  <button className="text-xs text-red-500" onClick={() => removeDeuda(deuda.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.values(TipoDeuda).map((tipo) => (
            <button
              key={tipo}
              type="button"
              className="rounded-xl border border-dashed border-slate-300 px-3 py-1 text-sm text-slate-600"
              onClick={() => addDeuda(tipo)}
            >
              + {deudaLabels[tipo]}
            </button>
          ))}
        </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Total deuda de consumo">
          <p className="text-3xl font-bold text-slate-900">${totalPorTipo(TipoAgrupador.DM).toLocaleString('es-CL')}</p>
        </Card>
        <Card title="Total deuda buena">
          <p className="text-3xl font-bold text-slate-900">${totalPorTipo(TipoAgrupador.DB).toLocaleString('es-CL')}</p>
        </Card>
      </div>
    </div>
  );
};
