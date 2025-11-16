import { Card } from '../components/common/Card';
import { NumericInput } from '../components/common/NumericInput';
import { useFinancialProfile } from '../hooks/useFinancialProfile';

export const SavingsSection = () => {
  const { perfil, updateAhorro } = useFinancialProfile();
  const { ahorro, ingreso } = perfil;

  const ahorroMensualTotal = ahorro.ahorro_mensual_total;
  const porcentaje = ingreso.ingreso_total ? (ahorroMensualTotal / ingreso.ingreso_total) * 100 : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="space-y-6">
        <Card title="Ahorro líquido">
          <p className="text-sm text-slate-500">Incluye cuenta corriente/vista, depósitos a plazo y fondos mutuos de corto plazo.</p>
          <NumericInput
            label="Aporte mensual líquido"
            value={ahorro.ahorro_mensual_liquido || ''}
            onChange={(e) => updateAhorro({ ahorro_mensual_liquido: Number(e.target.value) || 0 })}
          />
        </Card>
        <Card title="Ahorro largo plazo e inversiones">
          <p className="text-sm text-slate-500">Fondos mutuos largos, acciones, APV y otros vehículos.
          </p>
          <NumericInput
            label="Aporte mensual a largo plazo"
            value={ahorro.ahorro_mensual_largo_plazo || ''}
            onChange={(e) => updateAhorro({ ahorro_mensual_largo_plazo: Number(e.target.value) || 0 })}
          />
        </Card>
        <Card title="Criptomonedas">
          <NumericInput
            label="Aporte mensual en cripto"
            value={ahorro.ahorro_mensual_cripto || ''}
            onChange={(e) => updateAhorro({ ahorro_mensual_cripto: Number(e.target.value) || 0 })}
          />
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
      <Card title="Resumen de ahorro" className="h-fit">
        <p className="text-sm text-slate-500">Ahorro mensual total</p>
        <p className="text-4xl font-bold text-slate-900">${ahorroMensualTotal.toLocaleString('es-CL')}</p>
        <p className="text-sm text-slate-500">{porcentaje.toFixed(1)} % del ingreso</p>
      </Card>
    </div>
  );
};
