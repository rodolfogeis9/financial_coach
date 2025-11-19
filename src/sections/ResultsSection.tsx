import { Card } from '../components/common/Card';
import { useFinancialProfile } from '../hooks/useFinancialProfile';
import { construirDiagnostico, DISTRIBUCION_IDEAL, Totales } from '../utils/financialLogic';
import { ProjectionSimulator } from '../components/simulator/ProjectionSimulator';
import { formatCurrency, formatNumber } from '../utils/numberFormat';

const gradeColor = (nota: number) => {
  if (nota < 40) return 'bg-red-100 text-red-700';
  if (nota < 70) return 'bg-yellow-100 text-yellow-700';
  return 'bg-green-100 text-green-700';
};

export const ResultsSection = () => {
  const { perfil } = useFinancialProfile();
  const resultado = construirDiagnostico(perfil);
  const { diagnostico, ratios, totales } = resultado;
  const puedeMostrarDiagnostico = Boolean(ratios) && !resultado.error;

  if (!ratios) {
    return (
      <div className="space-y-6">
        <BalanceCard totales={totales} error={resultado.error} />
        <Card title="Salud financiera">
          <p className="rounded-2xl bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
            {resultado.error ?? 'Ingresa tus datos para ver el resultado completo.'}
          </p>
        </Card>
      </div>
    );
  }
  const subnotaPorClave = {
    ahorro: diagnostico.subnotas.sub_ahorro,
    deuda: diagnostico.subnotas.sub_deuda,
    necesidades: diagnostico.subnotas.sub_necesidades,
    estilo: diagnostico.subnotas.sub_estilo,
    fondo: diagnostico.subnotas.sub_fondo
  } as const;

  const distribucion = [
    { key: 'NV', label: 'Necesidades (NV)', valor: ratios.p_NV, color: '#0ea5e9' },
    { key: 'DM', label: 'Deuda mala (DM)', valor: ratios.p_DM, color: '#f87171' },
    { key: 'DB', label: 'Deuda buena (DB)', valor: ratios.p_DB, color: '#22c55e' },
    { key: 'AI', label: 'Ahorro (AI)', valor: ratios.p_AI, color: '#14b8a6' },
    { key: 'EV', label: 'Estilo de vida (EV)', valor: ratios.p_EV, color: '#fbbf24' },
    { key: 'IM', label: 'Imprevistos (IM)', valor: ratios.p_IM, color: '#94a3b8' }
  ] as const;

  const ratioRows = [
    {
      label: 'Ahorro mensual',
      actual: `${(ratios.ra * 100).toFixed(1)} %`,
      ideal: '≥15 %',
      texto:
        ratios.ra >= 0.15
          ? 'Estás dentro del rango recomendado.'
          : `Te falta ${(Math.max(0, 0.15 - ratios.ra) * 100).toFixed(1)} % ($${formatNumber(
              Math.max(0, 0.15 - ratios.ra) * totales.ingreso
            )}) para llegar al mínimo saludable.`
    },
    {
      label: 'Deuda mala',
      actual: `${(ratios.p_DM * 100).toFixed(1)} %`,
      ideal: '≤10 %',
      texto:
        ratios.p_DM <= 0.1
          ? 'Tus cuotas de consumo están controladas.'
          : `Reduce ${(Math.max(0, ratios.p_DM - 0.1) * 100).toFixed(1)} % ($${formatNumber(
              Math.max(0, ratios.p_DM - 0.1) * totales.ingreso
            )}) para estar en rango.`
    },
    {
      label: 'Necesidades vitales',
      actual: `${(ratios.p_NV * 100).toFixed(1)} %`,
      ideal: '50–60 %',
      texto:
        ratios.p_NV <= 0.6
          ? 'Buen equilibrio de gastos básicos.'
          : `Recorta ${(Math.max(0, ratios.p_NV - 0.6) * 100).toFixed(1)} % ($${formatNumber(
              Math.max(0, ratios.p_NV - 0.6) * totales.ingreso
            )}) para volver al rango.`
    },
    {
      label: 'Estilo de vida',
      actual: `${(ratios.p_EV * 100).toFixed(1)} %`,
      ideal: '≤20 %',
      texto:
        ratios.p_EV <= 0.2
          ? 'Estás destinando una porción sana a ocio.'
          : `Reduce ${(Math.max(0, ratios.p_EV - 0.2) * 100).toFixed(1)} % ($${formatNumber(
              Math.max(0, ratios.p_EV - 0.2) * totales.ingreso
            )}) para liberar espacio.`
    },
    {
      label: 'Fondo de emergencia',
      actual: `${ratios.meses_fondo_emergencia.toFixed(1)} meses`,
      ideal: `${ratios.meses_objetivo} meses`,
      texto:
        ratios.meses_fondo_emergencia >= ratios.meses_objetivo
          ? 'Ya alcanzaste el objetivo.'
          : `Te faltan ${(ratios.meses_objetivo - ratios.meses_fondo_emergencia).toFixed(1)} meses ($${formatNumber(
              ratios.gap_fondo_emergencia
            )}).`
    }
  ];

  return (
    <div className="space-y-6">
      <BalanceCard totales={totales} error={resultado.error} />
      {!puedeMostrarDiagnostico && (
        <Card title="Salud financiera">
          <p className="rounded-2xl bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
            {resultado.error ?? 'Ingresa tus datos para ver el resultado completo.'}
          </p>
        </Card>
      )}
      {puedeMostrarDiagnostico && (
        <>
      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Nota global">
          <div className="flex flex-col gap-4">
            <span className={`rounded-3xl px-6 py-3 text-4xl font-black ${gradeColor(diagnostico.nota_global)}`}>
              {diagnostico.nota_global}
            </span>
            <div className="space-y-4">
              {diagnostico.insights.map((insight) => (
                <div key={insight.clave} className="rounded-2xl bg-slate-50 p-3">
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>{insight.titulo}</span>
                    <span className="font-semibold text-slate-700">{subnotaPorClave[insight.clave].toFixed(1)}</span>
                  </div>
                  <p className="text-sm text-slate-700">{insight.descripcion}</p>
                  {insight.brecha && <p className="text-xs text-slate-500">{insight.brecha.mensaje}</p>}
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card title="Distribución del ingreso: actual vs ideal">
          <div className="space-y-4">
            <div className="flex h-8 overflow-hidden rounded-full bg-slate-100">
              {distribucion.map((item) => (
                <div
                  key={item.label}
                  className="h-full"
                  style={{ width: `${(item.valor * 100).toFixed(1)}%`, backgroundColor: item.color }}
                  title={`${item.label}: ${(item.valor * 100).toFixed(1)} %`}
                ></div>
              ))}
            </div>
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="py-1">Categoría</th>
                  <th>Actual</th>
                  <th>Ideal</th>
                  <th>Brecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {distribucion.map((item) => {
                  const ideal = DISTRIBUCION_IDEAL[item.key as keyof typeof DISTRIBUCION_IDEAL];
                  const actualPct = item.valor * 100;
                  let brecha = '';
                  if (item.key !== 'DB' && item.key !== 'DM' && item.key !== 'IM') {
                    if (actualPct > ideal.max * 100) {
                      brecha = `-${(actualPct - ideal.max * 100).toFixed(1)} pts`;
                    } else if (actualPct < ideal.min * 100) {
                      brecha = `+${(ideal.min * 100 - actualPct).toFixed(1)} pts`;
                    }
                  }
                  return (
                    <tr key={item.key}>
                      <td className="py-2 font-semibold text-slate-700">{item.label}</td>
                      <td>{actualPct.toFixed(1)} %</td>
                      <td>
                        {ideal.min * 100}%–{ideal.max * 100}%
                      </td>
                      <td className="text-slate-500">{brecha}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      <Card title="Ratios clave vs recomendación">
        <div className="space-y-2 text-sm text-slate-700">
          {ratioRows.map((row) => (
            <div key={row.label} className="rounded-2xl border border-slate-100 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold">{row.label}</span>
                <span className="text-slate-500">Actual: {row.actual} · Ideal: {row.ideal}</span>
              </div>
              <p className="text-xs text-slate-500">{row.texto}</p>
            </div>
          ))}
        </div>
      </Card>
      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Alertas">
          {diagnostico.alertas.length === 0 ? (
            <p className="text-sm text-slate-500">¡Excelente! No hay alertas críticas.</p>
          ) : (
            <ul className="list-disc space-y-2 pl-5 text-sm text-red-600">
              {diagnostico.alertas.map((alerta, idx) => (
                <li key={idx}>{alerta}</li>
              ))}
            </ul>
          )}
        </Card>
        <Card title="Recomendaciones">
          <ul className="list-decimal space-y-3 pl-5 text-sm text-slate-600">
            {diagnostico.recomendaciones.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </Card>
      </div>
      <ProjectionSimulator embedded />
        </>
      )}
    </div>
  );
};

const BalanceCard = ({ totales, error }: { totales: Totales; error?: string }) => {
  const deficit = totales.diferencia < 0;
  const sinAsignar = totales.diferencia > 0;
  let message = '';
  if (error) {
    message = error;
  } else if (totales.ingreso <= 0) {
    message = 'Ingresa tu ingreso mensual para obtener tu diagnóstico.';
  } else if (deficit) {
    message = `Tus gastos + inversiones superan tus ingresos en ${formatCurrency(Math.abs(totales.diferencia))}.`;
  } else if (sinAsignar) {
    message = `Aún tienes ${formatCurrency(totales.diferencia)} sin asignar. Decide si serán ahorro o gastos.`;
  } else {
    message = '¡Perfecto! Estás asignando el 100 % de tu ingreso mensual.';
  }

  const breakdown = [
    { label: 'Necesidades (NV)', value: totales.total_NV },
    { label: 'Deuda de consumo (DM)', value: totales.total_DM },
    { label: 'Deuda buena (DB)', value: totales.total_DB },
    { label: 'Estilo de vida (EV)', value: totales.total_EV },
    { label: 'Imprevistos (IM)', value: totales.total_IM },
    { label: 'Ahorro / inversión (AI)', value: totales.total_AI }
  ];

  return (
    <Card title="Balance mensual">
      <div className="space-y-2">
        <p className="text-sm text-slate-500">Ingreso vs. dinero asignado</p>
        <div className="flex flex-wrap gap-6 text-2xl font-bold text-slate-900">
          <span>Ingreso: {formatCurrency(totales.ingreso)}</span>
          <span>Asignado: {formatCurrency(totales.total_gasto_ahorro)}</span>
        </div>
        <p className={`text-sm font-semibold ${deficit ? 'text-red-600' : sinAsignar ? 'text-amber-600' : 'text-emerald-600'}`}>
          {message}
        </p>
      </div>
      <ul className="grid gap-3 md:grid-cols-2">
        {breakdown.map((item) => (
          <li key={item.label} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 text-sm">
            <span className="text-slate-500">{item.label}</span>
            <span className="font-semibold text-slate-900">{formatCurrency(item.value)}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
};
