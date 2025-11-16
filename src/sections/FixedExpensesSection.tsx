import { Card } from '../components/common/Card';
import { NumericInput } from '../components/common/NumericInput';
import { useFinancialProfile } from '../hooks/useFinancialProfile';
import { Gasto } from '../types/financial';
import { ProgressSummary } from '../components/common/ProgressSummary';

interface FixedBlock {
  title: string;
  items: string[];
  description: string;
}

const blocks: FixedBlock[] = [
  { title: 'Vivienda', description: 'Arriendo, dividendo y gastos asociados al hogar.', items: ['arriendo', 'dividendo', 'gastos_comunes', 'contribuciones', 'seguro_hogar'] },
  { title: 'Servicios básicos', description: 'Pagos mensuales obligatorios.', items: ['luz', 'agua', 'gas', 'internet', 'celular', 'tv_cable'] },
  { title: 'Salud obligatoria', description: 'Gastos de planes y seguros base.', items: ['isapre', 'seguro_salud', 'medicamentos'] },
  { title: 'Transporte fijo', description: 'Pagos contractuales asociados al vehículo.', items: ['credito_auto', 'seguro_auto', 'seguro_obligatorio', 'tag'] },
  { title: 'Educación obligatoria', description: 'Colegios y matrículas prorrateadas.', items: ['colegios', 'preuniversitario', 'matriculas'] }
];

export const FixedExpensesSection = () => {
  const { perfil, upsertGasto } = useFinancialProfile();
  const { ingreso } = perfil;

  const getGasto = (id: string): Gasto | undefined => perfil.gastos.lista_items.find((g) => g.id === id);
  const updateAmount = (gasto: Gasto | undefined, value: number) => {
    if (!gasto) return;
    upsertGasto({ ...gasto, monto_mensual: value });
  };

  const blockSubtotal = (ids: string[]) =>
    ids.reduce((sum, id) => {
      const gasto = getGasto(id);
      return sum + (gasto?.monto_mensual || 0);
    }, 0);

  const totalFijos = blocks.reduce((sum, block) => sum + blockSubtotal(block.items), 0);
  const summaryDetails = blocks.map((block) => ({
    label: block.title,
    value: `$${blockSubtotal(block.items).toLocaleString('es-CL')}`
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="space-y-6">
        {blocks.map((block) => (
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
                    tooltip="Monto mensual"
                  />
                );
              })}
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
