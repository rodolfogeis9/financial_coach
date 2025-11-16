import { useMemo, useState } from 'react';
import { Card } from '../components/common/Card';
import { useFinancialProfile } from '../hooks/useFinancialProfile';
import { construirDiagnostico } from '../utils/financialLogic';
import { PerfilFinanciero, TipoAgrupador } from '../types/financial';

const clamp = (value: number) => Math.max(0, value);

const applyDelta = (perfil: PerfilFinanciero, deltaEV: number, deltaAI: number, deltaDM: number): PerfilFinanciero => {
  const factorEV = 1 + deltaEV / 100;
  const factorAI = 1 + deltaAI / 100;
  const factorDM = 1 + deltaDM / 100;

  const gastosAjustados = perfil.gastos.lista_items.map((gasto) => {
    let factor = 1;
    if (gasto.tipo_agrupador === TipoAgrupador.EV) factor = factorEV;
    if (gasto.tipo_agrupador === TipoAgrupador.DM) factor = factorDM;
    return { ...gasto, monto_mensual: clamp(gasto.monto_mensual * factor) };
  });

  const deudasAjustadas = perfil.deudas.lista_deudas.map((deuda) => {
    const factor = deuda.tipo_agrupador === TipoAgrupador.DM ? factorDM : 1;
    return { ...deuda, cuota_mensual: clamp(deuda.cuota_mensual * factor) };
  });

  const ahorroAjustado = {
    ...perfil.ahorro,
    ahorro_mensual_liquido: clamp(perfil.ahorro.ahorro_mensual_liquido * factorAI),
    ahorro_mensual_largo_plazo: clamp(perfil.ahorro.ahorro_mensual_largo_plazo * factorAI),
    ahorro_mensual_cripto: clamp(perfil.ahorro.ahorro_mensual_cripto * factorAI)
  };
  ahorroAjustado.ahorro_mensual_total =
    ahorroAjustado.ahorro_mensual_liquido + ahorroAjustado.ahorro_mensual_largo_plazo + ahorroAjustado.ahorro_mensual_cripto;

  return {
    ...perfil,
    gastos: { lista_items: gastosAjustados },
    deudas: { lista_deudas: deudasAjustadas },
    ahorro: ahorroAjustado
  };
};

export const SimulatorSection = () => {
  const { perfil, setPerfil } = useFinancialProfile();
  const [deltaEV, setDeltaEV] = useState(0);
  const [deltaAI, setDeltaAI] = useState(0);
  const [deltaDM, setDeltaDM] = useState(0);

  const simulatedProfile = useMemo(() => applyDelta(perfil, deltaEV, deltaAI, deltaDM), [perfil, deltaEV, deltaAI, deltaDM]);
  const actual = construirDiagnostico(perfil);
  const simulado = construirDiagnostico(simulatedProfile);

  const aplicarCambios = () => {
    setPerfil(simulatedProfile);
    setDeltaEV(0);
    setDeltaAI(0);
    setDeltaDM(0);
  };

  return (
    <div className="space-y-6">
      <Card title="Ajusta tu escenario">
        <div className="grid gap-6 md:grid-cols-3">
          <Slider label="Estilo de vida (EV)" value={deltaEV} onChange={setDeltaEV} tooltip="Ajusta gastos de estilo" />
          <Slider label="Ahorro e inversión (AI)" value={deltaAI} onChange={setDeltaAI} tooltip="Cambia el esfuerzo de ahorro" />
          <Slider label="Deuda mala (DM)" value={deltaDM} onChange={setDeltaDM} tooltip="Simula pagos o nuevas deudas" />
        </div>
        <button
          className="mt-6 rounded-2xl bg-brand-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
          onClick={aplicarCambios}
          disabled={deltaEV === 0 && deltaAI === 0 && deltaDM === 0}
        >
          Aplicar cambios al escenario actual
        </button>
      </Card>
      <div className="grid gap-6 md:grid-cols-2">
        <ScenarioCard title="Datos actuales" resultado={actual} />
        <ScenarioCard title="Simulación" resultado={simulado} highlight />
      </div>
    </div>
  );
};

const Slider = ({ label, value, onChange, tooltip }: { label: string; value: number; onChange: (v: number) => void; tooltip?: string }) => (
  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-600">
    <span title={tooltip}>{label}</span>
    <input
      type="range"
      min={-50}
      max={50}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="accent-brand-600"
    />
    <span className="text-xs text-slate-500">{value > 0 ? `+${value}` : value}%</span>
  </label>
);

const ScenarioCard = ({ title, resultado, highlight = false }: { title: string; resultado: ReturnType<typeof construirDiagnostico>; highlight?: boolean }) => {
  if (resultado.error || !resultado.ratios) {
    return (
      <Card title={title}>
        <p className="text-sm text-slate-500">{resultado.error ?? 'Ingresa tus datos para simular.'}</p>
      </Card>
    );
  }

  return (
    <Card title={title}>
      <p className={`text-5xl font-black ${highlight ? 'text-brand-600' : 'text-slate-900'}`}>{resultado.diagnostico.nota_global}</p>
      <p className="text-sm text-slate-500">Nota de salud financiera</p>
      <div className="mt-4 grid gap-2 text-sm text-slate-600">
        <div className="flex justify-between">
          <span>Ahorro</span>
          <span>{(resultado.ratios.ra * 100).toFixed(1)} %</span>
        </div>
        <div className="flex justify-between">
          <span>Deuda consumo</span>
          <span>{(resultado.ratios.cf_dm * 100).toFixed(1)} %</span>
        </div>
        <div className="flex justify-between">
          <span>Estilo de vida</span>
          <span>{(resultado.ratios.p_EV * 100).toFixed(1)} %</span>
        </div>
      </div>
    </Card>
  );
};
