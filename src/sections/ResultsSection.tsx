import { Card } from '../components/common/Card';
import { useFinancialProfile } from '../hooks/useFinancialProfile';
import { construirDiagnostico, Totales } from '../utils/financialLogic';

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
  const statusAhorro = ratios.ra >= 0.2 ? 'good' : ratios.ra >= 0.1 ? 'warn' : 'bad';
  const statusCF = ratios.cf <= 0.3 ? 'good' : ratios.cf <= 0.4 ? 'warn' : 'bad';
  const statusCFDM = ratios.cf_dm <= 0.2 ? 'good' : ratios.cf_dm <= 0.3 ? 'warn' : 'bad';
  const distanciaNV = Math.abs(ratios.nv_ratio - 0.5);
  const statusNV = distanciaNV <= 0.05 ? 'good' : distanciaNV <= 0.15 ? 'warn' : 'bad';
  const statusEV = ratios.p_EV <= 0.2 ? 'good' : ratios.p_EV <= 0.3 ? 'warn' : 'bad';
  const statusFondo =
    ratios.meses_fondo_emergencia >= ratios.meses_objetivo
      ? 'good'
      : ratios.meses_fondo_emergencia >= ratios.meses_objetivo / 2
      ? 'warn'
      : 'bad';
  const distribucion = [
    { label: 'Necesidades (NV)', valor: ratios.p_NV, color: '#0ea5e9' },
    { label: 'Deuda mala (DM)', valor: ratios.p_DM, color: '#f87171' },
    { label: 'Deuda buena (DB)', valor: ratios.p_DB, color: '#22c55e' },
    { label: 'Ahorro (AI)', valor: ratios.p_AI, color: '#14b8a6' },
    { label: 'Estilo de vida (EV)', valor: ratios.p_EV, color: '#fbbf24' },
    { label: 'Imprevistos (IM)', valor: ratios.p_IM, color: '#94a3b8' }
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
          <div className="flex flex-col items-start gap-4">
            <span className={`rounded-3xl px-6 py-3 text-4xl font-black ${gradeColor(diagnostico.nota_global)}`}>
              {diagnostico.nota_global}
            </span>
            <div className="grid w-full gap-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Ahorro</span>
                <span>{diagnostico.subnotas.sub_ahorro.toFixed(1)} / 30</span>
              </div>
              <div className="flex justify-between">
                <span>Deuda</span>
                <span>{diagnostico.subnotas.sub_deuda.toFixed(1)} / 30</span>
              </div>
              <div className="flex justify-between">
                <span>Necesidades</span>
                <span>{diagnostico.subnotas.sub_necesidades.toFixed(1)} / 20</span>
              </div>
              <div className="flex justify-between">
                <span>Estilo</span>
                <span>{diagnostico.subnotas.sub_estilo.toFixed(1)} / 10</span>
              </div>
              <div className="flex justify-between">
                <span>Fondo</span>
                <span>{diagnostico.subnotas.sub_fondo.toFixed(1)} / 10</span>
              </div>
            </div>
          </div>
        </Card>
        <Card title="Distribución del ingreso">
          <div className="space-y-3">
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
            <ul className="space-y-1 text-sm text-slate-600">
              {distribucion.map((item) => (
                <li key={item.label} className="flex justify-between">
                  <span>{item.label}</span>
                  <span>{(item.valor * 100).toFixed(1)} %</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
      <Card title="Ratios clave">
        <div className="grid gap-4 md:grid-cols-3">
          <RatioBox label="Ratio de ahorro" value={ratios.ra} tooltip="Ahorro mensual / ingreso" status={statusAhorro} />
          <RatioBox label="Carga financiera total" value={ratios.cf} tooltip="Cuotas totales / ingreso" status={statusCF} />
          <RatioBox label="Deuda de consumo" value={ratios.cf_dm} tooltip="Deuda mala / ingreso" status={statusCFDM} />
          <RatioBox label="Peso necesidades" value={ratios.nv_ratio} tooltip="Necesidades / ingreso" status={statusNV} />
          <RatioBox label="Estilo de vida" value={ratios.p_EV} tooltip="EV / ingreso" status={statusEV} />
          <RatioBox
            label="Fondo emergencia (meses)"
            value={ratios.meses_fondo_emergencia}
            tooltip={`Objetivo: ${ratios.meses_objetivo} meses`}
            format="meses"
            status={statusFondo}
          />
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
        </>
      )}
    </div>
  );
};

type RatioStatus = 'good' | 'warn' | 'bad';

const ratioColors: Record<RatioStatus, string> = {
  good: 'border-green-100 bg-green-50 text-green-700',
  warn: 'border-yellow-100 bg-yellow-50 text-yellow-700',
  bad: 'border-red-100 bg-red-50 text-red-700'
};

const RatioBox = ({
  label,
  value,
  tooltip,
  format = 'porcentaje',
  status = 'good'
}: {
  label: string;
  value: number;
  tooltip?: string;
  format?: 'porcentaje' | 'meses';
  status?: RatioStatus;
}) => (
  <div className={`rounded-2xl border p-4 ${ratioColors[status]}`}>
    <p className="text-sm" title={tooltip}>
      {label}
    </p>
    <p className="text-2xl font-bold">
      {format === 'porcentaje' ? `${(value * 100).toFixed(1)} %` : `${value.toFixed(1)} meses`}
    </p>
  </div>
);

const BalanceCard = ({ totales, error }: { totales: Totales; error?: string }) => {
  const deficit = totales.diferencia < 0;
  const sinAsignar = totales.diferencia > 0;
  let message = '';
  if (error) {
    message = error;
  } else if (totales.ingreso <= 0) {
    message = 'Ingresa tu ingreso mensual para obtener tu diagnóstico.';
  } else if (deficit) {
    message = `Tus gastos + inversiones superan tus ingresos en $${Math.abs(totales.diferencia).toLocaleString('es-CL')}.`;
  } else if (sinAsignar) {
    message = `Aún tienes $${totales.diferencia.toLocaleString('es-CL')} sin asignar. Decide si serán ahorro o gastos.`;
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
          <span>Ingreso: ${totales.ingreso.toLocaleString('es-CL')}</span>
          <span>Asignado: ${totales.total_gasto_ahorro.toLocaleString('es-CL')}</span>
        </div>
        <p className={`text-sm font-semibold ${deficit ? 'text-red-600' : sinAsignar ? 'text-amber-600' : 'text-emerald-600'}`}>
          {message}
        </p>
      </div>
      <ul className="grid gap-3 md:grid-cols-2">
        {breakdown.map((item) => (
          <li key={item.label} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 text-sm">
            <span className="text-slate-500">{item.label}</span>
            <span className="font-semibold text-slate-900">${item.value.toLocaleString('es-CL')}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
};
