import { v4 as uuidv4 } from 'uuid';
import { Card } from '../components/common/Card';
import { NumericInput } from '../components/common/NumericInput';
import { useFinancialProfile } from '../hooks/useFinancialProfile';
import { Meta, TipoMeta } from '../types/financial';

const metaLabels: Record<TipoMeta, string> = {
  [TipoMeta.FONDO_EMERGENCIA]: 'Fondo de emergencia',
  [TipoMeta.PAGAR_DEUDAS]: 'Pagar deudas',
  [TipoMeta.COMPRAR_VIVIENDA]: 'Comprar vivienda',
  [TipoMeta.COMPRAR_AUTO]: 'Comprar auto',
  [TipoMeta.VIAJE]: 'Viaje',
  [TipoMeta.JUBILACION]: 'Jubilación'
};

export const GoalsSection = () => {
  const { perfil, upsertMeta, removeMeta } = useFinancialProfile();
  const { metas } = perfil;

  const addMeta = (tipo: TipoMeta) => {
    if (metas.lista_metas.some((meta) => meta.tipo === tipo)) return;
    const nueva: Meta = {
      id: uuidv4(),
      tipo,
      monto_objetivo: 0,
      plazo_meses: 12
    };
    upsertMeta(nueva);
  };

  return (
    <Card title="Metas financieras">
      <p className="text-sm text-slate-500">Selecciona tus objetivos prioritarios para personalizar recomendaciones.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {Object.values(TipoMeta).map((tipo) => (
          <button
            key={tipo}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
            onClick={() => addMeta(tipo)}
            type="button"
          >
            + {metaLabels[tipo]}
          </button>
        ))}
      </div>
      <div className="mt-6 space-y-4">
        {metas.lista_metas.length === 0 && <p className="text-sm text-slate-500">Aún no agregas metas.</p>}
        {metas.lista_metas.map((meta) => (
          <div key={meta.id} className="rounded-2xl border border-slate-100 p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-semibold text-slate-700">{metaLabels[meta.tipo]}</h4>
              <button className="text-xs text-red-500" onClick={() => removeMeta(meta.id)}>
                Eliminar
              </button>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <NumericInput
                label="Monto objetivo"
                value={meta.monto_objetivo || ''}
                onChange={(e) => upsertMeta({ ...meta, monto_objetivo: Number(e.target.value) || 0 })}
              />
              <NumericInput
                label="Plazo (meses)"
                value={meta.plazo_meses || ''}
                onChange={(e) => upsertMeta({ ...meta, plazo_meses: Number(e.target.value) || 0 })}
                tooltip="Puedes estimar"
                prefix=""
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
