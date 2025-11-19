import { Card } from '../components/common/Card';
import { NumericInput } from '../components/common/NumericInput';
import { useFinancialProfile } from '../hooks/useFinancialProfile';
import { CategoriaGasto, Gasto, TipoAgrupador } from '../types/financial';
import { ProgressSummary } from '../components/common/ProgressSummary';
import { v4 as uuidv4 } from 'uuid';
import { formatCurrency } from '../utils/numberFormat';

interface FixedBlock {
  id: string;
  title: string;
  items: string[];
  description: string;
}

const blocks: FixedBlock[] = [
  {
    id: 'vivienda',
    title: 'Vivienda',
    description: 'Arriendo, dividendo y gastos asociados al hogar.',
    items: ['arriendo', 'dividendo', 'gastos_comunes', 'contribuciones', 'seguro_hogar']
  },
  {
    id: 'servicios',
    title: 'Servicios básicos',
    description: 'Luz, agua, gas e internet del hogar.',
    items: ['luz', 'agua', 'gas', 'internet', 'celular', 'tv_cable']
  },
  {
    id: 'salud',
    title: 'Salud',
    description: 'Planes complementarios, seguros y medicamentos crónicos.',
    items: ['salud_complementaria', 'seguro_escolar', 'medicamentos']
  },
  {
    id: 'transporte',
    title: 'Transporte fijo',
    description: 'Cuotas de auto, seguros y costos mensuales asociados.',
    items: ['credito_auto', 'seguro_auto', 'bencina', 'tag']
  },
  {
    id: 'educacion',
    title: 'Educación',
    description: 'Colegiatura, preuniversitarios y otros pagos educativos.',
    items: ['colegios', 'preuniversitario', 'matriculas', 'otros_educacion']
  }
];

export const FixedExpensesSection = () => {
  const { perfil, upsertGasto, removeGasto } = useFinancialProfile();
  const { ingreso } = perfil;

  const getGasto = (id: string): Gasto | undefined => perfil.gastos.lista_items.find((g) => g.id === id);
  const updateAmount = (gasto: Gasto | undefined, value: number) => {
    if (!gasto) return;
    upsertGasto({ ...gasto, monto_mensual: value });
  };

  const transporteExtras = perfil.gastos.lista_items.filter((g) => g.id.startsWith('transporte_otro'));

  const blockSubtotal = (block: FixedBlock) => {
    const base = block.items.reduce((sum, id) => sum + (getGasto(id)?.monto_mensual || 0), 0);
    if (block.id === 'transporte') {
      return base + transporteExtras.reduce((sum, gasto) => sum + (gasto.monto_mensual || 0), 0);
    }
    return base;
  };

  const totalFijos = blocks.reduce((sum, block) => sum + blockSubtotal(block), 0);
  const summaryDetails = blocks.map((block) => ({
    label: block.title,
    value: formatCurrency(blockSubtotal(block))
  }));

  const addTransporteExtra = () => {
    upsertGasto({
      id: `transporte_otro_${uuidv4()}`,
      nombre: 'Otro transporte',
      monto_mensual: 0,
      categoria_principal: CategoriaGasto.TRANSPORTE,
      tipo_agrupador: TipoAgrupador.NV,
      fijo: true
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="space-y-6">
        {blocks.map((block) => (
          <Card
            key={block.title}
            title={block.title}
            actions={
              <span className="text-sm font-semibold text-slate-500">
                Subtotal: {formatCurrency(blockSubtotal(block))}
              </span>
            }
          >
            <p className="text-sm text-slate-500">{block.description}</p>
            <div className="grid gap-4 md:grid-cols-2">
              {block.items.map((id) => {
                const gasto = getGasto(id);
                if (!gasto) return null;
                return (
                  <NumericInput
                    key={id}
                    label={gasto.nombre}
                    value={gasto.monto_mensual}
                    onValueChange={(value) => updateAmount(gasto, value)}
                    tooltip="Monto mensual"
                  />
                );
              })}
              {block.id === 'transporte' && (
                <div className="md:col-span-2 space-y-3">
                  {transporteExtras.length === 0 && (
                    <p className="text-sm text-slate-500">Agrega tus otros gastos de transporte fijo (estacionamientos, mantenciones, etc.).</p>
                  )}
                  {transporteExtras.map((gasto) => (
                    <div key={gasto.id} className="grid gap-3 md:grid-cols-[1fr,1fr,auto]">
                      <label className="text-sm font-medium text-slate-700">
                        Nombre
                        <input
                          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                          value={gasto.nombre}
                          onChange={(e) => upsertGasto({ ...gasto, nombre: e.target.value })}
                        />
                      </label>
                      <NumericInput
                        label="Monto mensual"
                        value={gasto.monto_mensual}
                        onValueChange={(value) => upsertGasto({ ...gasto, monto_mensual: value })}
                      />
                      <button
                        type="button"
                        className="self-end text-xs font-semibold text-red-500"
                        onClick={() => removeGasto(gasto.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="rounded-xl border border-dashed border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600"
                    onClick={addTransporteExtra}
                  >
                    + Agregar otro transporte
                  </button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
      <ProgressSummary
        title="Gastos fijos vs. ingreso"
        amount={totalFijos}
        income={ingreso.ingreso_total}
        description="Así se distribuyen tus pagos obligatorios cada mes."
        details={summaryDetails}
      />
    </div>
  );
};
