import { useState } from 'react';
import { Card } from '../components/common/Card';
import { NumericInput } from '../components/common/NumericInput';
import { useFinancialProfile } from '../hooks/useFinancialProfile';
import { CategoriaGasto, Gasto, TipoAgrupador } from '../types/financial';
import { v4 as uuidv4 } from 'uuid';
import { ProgressSummary } from '../components/common/ProgressSummary';

const variableBlocks = [
  { title: 'Alimentación', description: 'Compras del mes, verduras, carnes y delivery.', items: ['supermercado', 'verduleria', 'carnes', 'delivery'] },
  { title: 'Transporte variable', description: 'Gastos ajustables de movilidad.', items: ['bencina', 'transporte_publico', 'uber'] },
  { title: 'Gastos del hogar', description: 'Aseo, mantenciones e imprevistos.', items: ['aseo', 'mantencion', 'reparaciones'] },
  { title: 'Diversión y estilo de vida', description: 'Ocio, hobbies y viajes.', items: ['restaurantes', 'cine', 'gimnasio', 'viajes', 'mesada'] },
  { title: 'Hijos', description: 'Actividades y ropa extra.', items: ['actividades_hijos', 'ropa_hijos'] },
  { title: 'Mascotas', description: 'Cuidado animal.', items: ['alimento_mascotas', 'veterinario', 'aseo_mascotas'] }
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

  const blockSubtotal = (ids: string[]) =>
    ids.reduce((sum, id) => sum + (getGasto(id)?.monto_mensual || 0), 0);

  const otrosGastos = perfil.gastos.lista_items.filter((g) => !variableBlocks.some((block) => block.items.includes(g.id)) && !g.fijo);
  const totalOtros = otrosGastos.reduce((sum, gasto) => sum + gasto.monto_mensual, 0);

  const totalVariables = variableBlocks.reduce((sum, block) => sum + blockSubtotal(block.items), 0) + totalOtros;
  const summaryDetails = [
    ...variableBlocks.map((block) => ({
      label: block.title,
      value: `$${blockSubtotal(block.items).toLocaleString('es-CL')}`
    })),
    {
      label: 'Otros flexibles',
      value: `$${totalOtros.toLocaleString('es-CL')}`
    }
  ];

  const addOtroGasto = () => {
    if (!nuevoNombre || nuevoMonto <= 0) return;
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
          <Card key={block.title} title={block.title} actions={<span className="text-sm font-semibold text-slate-500">Subtotal: ${blockSubtotal(block.items).toLocaleString('es-CL')}</span>}>
            <p className="text-sm text-slate-500">{block.description}</p>
            <div className="grid gap-4 md:grid-cols-2">
              {block.items.map((id) => {
                const gasto = getGasto(id);
              if (!gasto) return null;
              return (
                <NumericInput
                  key={id}
                  label={gasto.nombre}
                  value={gasto.monto_mensual || ''}
                  onChange={(e) => updateAmount(gasto, Number(e.target.value) || 0)}
                />
              );
            })}
          </div>
        </Card>
      ))}
        <Card title="Otros gastos variables" actions={<span className="text-sm font-semibold text-slate-500">Subtotal: ${totalOtros.toLocaleString('es-CL')}</span>}>
          <div className="space-y-4">
            {otrosGastos.length === 0 && <p className="text-sm text-slate-500">Agrega tus otros gastos flexibles.</p>}
            {otrosGastos.map((gasto) => (
              <div key={gasto.id} className="flex items-center gap-3">
                <NumericInput
                  label={gasto.nombre}
                  value={gasto.monto_mensual || ''}
                  onChange={(e) => upsertGasto({ ...gasto, monto_mensual: Number(e.target.value) || 0 })}
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
              <NumericInput label="Monto" value={nuevoMonto || ''} onChange={(e) => setNuevoMonto(Number(e.target.value) || 0)} />
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
