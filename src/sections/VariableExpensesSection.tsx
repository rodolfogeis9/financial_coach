import { useState } from 'react';
import { Card } from '../components/common/Card';
import { NumericInput } from '../components/common/NumericInput';
import { useFinancialProfile } from '../hooks/useFinancialProfile';
import { CategoriaGasto, Gasto, TipoAgrupador } from '../types/financial';
import { v4 as uuidv4 } from 'uuid';
import { ProgressSummary } from '../components/common/ProgressSummary';
import { formatCurrency } from '../utils/numberFormat';

const variableBlocks = [
  { id: 'alimentacion', title: 'Alimentación', description: 'Supermercado, feria, carnes y delivery.', items: ['supermercado', 'verduleria', 'carnes', 'delivery'] },
  { id: 'transporte_var', title: 'Transporte variable', description: 'Transporte público y apps.', items: ['transporte_publico', 'uber'] },
  { id: 'hogar', title: 'Gastos del hogar', description: 'Aseo externo, mantenciones e imprevistos menores.', items: ['aseo', 'mantencion', 'reparaciones'] },
  {
    id: 'diversion',
    title: 'Diversión y estilo de vida',
    description: 'Restaurantes, panoramas, streaming y viajes.',
    items: ['restaurantes', 'cine', 'streaming', 'gimnasio', 'viajes', 'mesada']
  },
  { id: 'hijos', title: 'Hijos', description: 'Actividades, ropa y extras para hijos.', items: ['actividades_hijos', 'ropa_hijos'] },
  {
    id: 'mascotas',
    title: 'Mascotas',
    description: 'Alimento, veterinario, grooming y paseos.',
    items: ['alimento_mascotas', 'veterinario', 'aseo_mascotas', 'paseo_mascotas']
  }
];

const categoriaOptions = Object.values(CategoriaGasto);
const tipoOptions = [TipoAgrupador.NV, TipoAgrupador.EV, TipoAgrupador.IM, TipoAgrupador.DM];

export const VariableExpensesSection = () => {
  const { perfil, upsertGasto, removeGasto } = useFinancialProfile();
  const { ingreso } = perfil;
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoMonto, setNuevoMonto] = useState(0);
  const [nuevaCategoria, setNuevaCategoria] = useState<CategoriaGasto>(CategoriaGasto.OTROS);
  const [nuevoTipo, setNuevoTipo] = useState<TipoAgrupador>(TipoAgrupador.NV);

  const getGasto = (id: string): Gasto | undefined => perfil.gastos.lista_items.find((g) => g.id === id);

  const updateAmount = (gasto: Gasto | undefined, value: number) => {
    if (!gasto) return;
    upsertGasto({ ...gasto, monto_mensual: value });
  };

  const hijosExtras = perfil.gastos.lista_items.filter((g) => g.id.startsWith('hijos_otro'));
  const mascotaExtras = perfil.gastos.lista_items.filter((g) => g.id.startsWith('mascotas_otro'));

  const blockSubtotal = (blockId: string, ids: string[]) => {
    const base = ids.reduce((sum, id) => sum + (getGasto(id)?.monto_mensual || 0), 0);
    if (blockId === 'hijos') {
      return base + hijosExtras.reduce((sum, gasto) => sum + (gasto.monto_mensual || 0), 0);
    }
    if (blockId === 'mascotas') {
      return base + mascotaExtras.reduce((sum, gasto) => sum + (gasto.monto_mensual || 0), 0);
    }
    return base;
  };

  const otrosGastos = perfil.gastos.lista_items.filter((g) => !variableBlocks.some((block) => block.items.includes(g.id)) && !g.fijo);
  const totalOtros = otrosGastos.reduce((sum, gasto) => sum + gasto.monto_mensual, 0);

  const totalVariables = variableBlocks.reduce((sum, block) => sum + blockSubtotal(block.id, block.items), 0) + totalOtros;
  const summaryDetails = [
    ...variableBlocks.map((block) => ({
      label: block.title,
      value: formatCurrency(blockSubtotal(block.id, block.items))
    })),
    {
      label: 'Otros flexibles',
      value: formatCurrency(totalOtros)
    }
  ];

  const addCustomGasto = (scope: 'hijos' | 'mascotas') => {
    const id = `${scope}_otro_${uuidv4()}`;
    const categoria = scope === 'hijos' ? CategoriaGasto.HIJOS : CategoriaGasto.MASCOTAS;
    upsertGasto({
      id,
      nombre: scope === 'hijos' ? 'Otro gasto hijos' : 'Otro gasto mascotas',
      monto_mensual: 0,
      categoria_principal: categoria,
      tipo_agrupador: scope === 'mascotas' ? TipoAgrupador.IM : TipoAgrupador.NV,
      fijo: false
    });
  };

  const addOtroGasto = () => {
    if (!nuevoNombre) return;
    const gasto: Gasto = {
      id: `otro-${uuidv4()}`,
      nombre: nuevoNombre,
      monto_mensual: nuevoMonto,
      categoria_principal: nuevaCategoria,
      tipo_agrupador: nuevoTipo,
      fijo: false
    };
    upsertGasto(gasto);
    setNuevoNombre('');
    setNuevoMonto(0);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="space-y-6">
        {variableBlocks.map((block) => (
          <Card
            key={block.title}
            title={block.title}
            actions={
              <span className="text-sm font-semibold text-slate-500">
                Subtotal: {formatCurrency(blockSubtotal(block.id, block.items))}
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
                  />
                );
              })}
              {block.id === 'hijos' && (
                <div className="md:col-span-2 space-y-3">
                  {hijosExtras.length === 0 && <p className="text-sm text-slate-500">Agrega otras actividades, materiales o salidas asociadas a tus hijos.</p>}
                  {hijosExtras.map((gasto) => (
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
                      <button className="self-end text-xs font-semibold text-red-500" onClick={() => removeGasto(gasto.id)}>
                        Eliminar
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="rounded-xl border border-dashed border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600"
                    onClick={() => addCustomGasto('hijos')}
                  >
                    + Otros hijos
                  </button>
                </div>
              )}
              {block.id === 'mascotas' && (
                <div className="md:col-span-2 space-y-3">
                  {mascotaExtras.length === 0 && <p className="text-sm text-slate-500">Incluye paseos, daycare u otros costos de tus mascotas.</p>}
                  {mascotaExtras.map((gasto) => (
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
                      <button className="self-end text-xs font-semibold text-red-500" onClick={() => removeGasto(gasto.id)}>
                        Eliminar
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="rounded-xl border border-dashed border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600"
                    onClick={() => addCustomGasto('mascotas')}
                  >
                    + Otros mascotas
                  </button>
                </div>
              )}
          </div>
        </Card>
      ))}
        <Card
          title="Otros gastos variables"
          actions={<span className="text-sm font-semibold text-slate-500">Subtotal: {formatCurrency(totalOtros)}</span>}
        >
          <div className="space-y-4">
            {otrosGastos.length === 0 && <p className="text-sm text-slate-500">Agrega tus otros gastos flexibles.</p>}
            {otrosGastos.map((gasto) => (
              <div key={gasto.id} className="flex items-center gap-3">
                <NumericInput
                  label={gasto.nombre}
                  value={gasto.monto_mensual}
                  onValueChange={(value) => upsertGasto({ ...gasto, monto_mensual: value })}
                  className="flex-1"
                />
                <button className="text-xs text-red-500" onClick={() => removeGasto(gasto.id)}>
                  Eliminar
                </button>
              </div>
            ))}
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                Nombre del gasto
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                />
              </label>
              <NumericInput label="Monto" value={nuevoMonto} onValueChange={(value) => setNuevoMonto(value)} />
              <label className="text-sm font-medium text-slate-700">
                Categoría
                <select
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                  value={nuevaCategoria}
                  onChange={(e) => setNuevaCategoria(e.target.value as CategoriaGasto)}
                >
                  {categoriaOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700">
                Tipo agrupador
                <select
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                  value={nuevoTipo}
                  onChange={(e) => setNuevoTipo(e.target.value as TipoAgrupador)}
                >
                  {tipoOptions.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button
              type="button"
              className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white"
              onClick={addOtroGasto}
            >
              Agregar gasto
            </button>
          </div>
        </Card>
      </div>
      <ProgressSummary
        title="Gastos variables vs. ingreso"
        amount={totalVariables}
        income={ingreso.ingreso_total}
        description="Monitorea cuánto de tu sueldo se va en gastos ajustables."
        details={summaryDetails}
      />
    </div>
  );
};
