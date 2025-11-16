import { Card } from '../components/common/Card';
import { NumericInput } from '../components/common/NumericInput';
import { useFinancialProfile } from '../hooks/useFinancialProfile';
import { ProgressSummary } from '../components/common/ProgressSummary';

export const SavingsSection = () => {
  const { perfil, updateAhorro } = useFinancialProfile();
  const { ahorro, ingreso } = perfil;

  const ahorroMensualTotal = ahorro.ahorro_mensual_total;
  const summaryDetails = [
    { label: 'Corto plazo', value: `$${ahorro.ahorro_mensual_corto_plazo.toLocaleString('es-CL')}` },
    { label: 'Mediano plazo', value: `$${ahorro.ahorro_mensual_mediano_plazo.toLocaleString('es-CL')}` },
    { label: 'Largo plazo', value: `$${ahorro.ahorro_mensual_largo_plazo.toLocaleString('es-CL')}` },
    { label: 'Fondos mutuos', value: `$${ahorro.ahorro_mensual_fondos_mutuos.toLocaleString('es-CL')}` },
    { label: 'ETF', value: `$${ahorro.ahorro_mensual_etf.toLocaleString('es-CL')}` },
    { label: 'Cripto', value: `$${ahorro.ahorro_mensual_cripto.toLocaleString('es-CL')}` }
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="space-y-6">
        <Card title="Ahorro mensual por horizonte">
          <p className="text-sm text-slate-500">Todo lo que apartas cada mes en cada plazo.</p>
          <div className="grid gap-4 md:grid-cols-2">
            <NumericInput
              label="Corto plazo"
              value={ahorro.ahorro_mensual_corto_plazo || ''}
              onChange={(e) => updateAhorro({ ahorro_mensual_corto_plazo: Number(e.target.value) || 0 })}
            />
            <NumericInput
              label="Mediano plazo"
              value={ahorro.ahorro_mensual_mediano_plazo || ''}
              onChange={(e) => updateAhorro({ ahorro_mensual_mediano_plazo: Number(e.target.value) || 0 })}
            />
            <NumericInput
              label="Largo plazo"
              value={ahorro.ahorro_mensual_largo_plazo || ''}
              onChange={(e) => updateAhorro({ ahorro_mensual_largo_plazo: Number(e.target.value) || 0 })}
            />
          </div>
        </Card>
        <Card title="Vehículos de inversión (mensual)">
          <p className="text-sm text-slate-500">Detalla cuánto destinas cada mes en instrumentos específicos.</p>
          <div className="grid gap-4 md:grid-cols-2">
            <NumericInput
              label="Fondos mutuos"
              value={ahorro.ahorro_mensual_fondos_mutuos || ''}
              onChange={(e) => updateAhorro({ ahorro_mensual_fondos_mutuos: Number(e.target.value) || 0 })}
            />
            <NumericInput
              label="ETF"
              value={ahorro.ahorro_mensual_etf || ''}
              onChange={(e) => updateAhorro({ ahorro_mensual_etf: Number(e.target.value) || 0 })}
            />
            <NumericInput
              label="Criptomonedas"
              value={ahorro.ahorro_mensual_cripto || ''}
              onChange={(e) => updateAhorro({ ahorro_mensual_cripto: Number(e.target.value) || 0 })}
            />
          </div>
        </Card>
        <Card title="Stock actual">
          <div className="grid gap-4 md:grid-cols-2">
            <NumericInput
              label="Ahorros líquidos actuales"
              value={ahorro.fondo_emergencia_actual || ''}
              onChange={(e) => updateAhorro({ fondo_emergencia_actual: Number(e.target.value) || 0 })}
            />
            <NumericInput
              label="Inversiones largo plazo actuales"
              value={ahorro.inversiones_largo_plazo_actuales || ''}
              onChange={(e) => updateAhorro({ inversiones_largo_plazo_actuales: Number(e.target.value) || 0 })}
            />
          </div>
        </Card>
      </div>
      <ProgressSummary
        title="Ahorro e inversión mensual"
        amount={ahorroMensualTotal}
        income={ingreso.ingreso_total}
        description="El objetivo recomendado es destinar al menos 20 % de tu ingreso al ahorro."
        details={summaryDetails}
      />
    </div>
  );
};
