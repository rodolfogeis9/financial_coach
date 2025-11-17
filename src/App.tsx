import { useMemo, useState } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { HomeSection } from './sections/HomeSection';
import { IncomeSection } from './sections/IncomeSection';
import { FixedExpensesSection } from './sections/FixedExpensesSection';
import { VariableExpensesSection } from './sections/VariableExpensesSection';
import { DebtSection } from './sections/DebtSection';
import { SavingsSection } from './sections/SavingsSection';
import { ResultsSection } from './sections/ResultsSection';
import { SimulatorSection } from './sections/SimulatorSection';
import { useFinancialProfile } from './hooks/useFinancialProfile';
import { SeccionClave } from './types/financial';
import { calcularTotales } from './utils/financialLogic';

const sectionLabels: Record<SeccionClave, string> = {
  inicio: 'Inicio',
  ingresos: 'Ingresos y datos personales',
  gastos_fijos: 'Gastos fijos',
  gastos_variables: 'Gastos variables',
  deudas: 'Deudas',
  ahorro: 'Ahorros e inversiones',
  resultado: 'Resultado y salud financiera',
  simulador: 'Simulador'
};

export default function App() {
  const { perfil } = useFinancialProfile();
  const [currentSection, setCurrentSection] = useState<SeccionClave>('inicio');
  const totales = useMemo(() => calcularTotales(perfil), [perfil]);
  const hasIncome = perfil.ingreso.ingreso_total > 0;

  const completion = useMemo(() => ({
    inicio: true,
    ingresos: perfil.ingreso.ingreso_total > 0,
    gastos_fijos: perfil.gastos.lista_items.some((g) => g.fijo && g.monto_mensual > 0),
    gastos_variables: perfil.gastos.lista_items.some((g) => !g.fijo && g.monto_mensual > 0),
    deudas: perfil.deudas.lista_deudas.some((d) => d.cuota_mensual > 0),
    ahorro: perfil.ahorro.ahorro_mensual_total > 0,
    resultado: hasIncome && totales.valido,
    simulador: hasIncome
  }), [perfil, hasIncome, totales.valido]);

  const sectionsOrder: SeccionClave[] = [
    'inicio',
    'ingresos',
    'gastos_fijos',
    'gastos_variables',
    'deudas',
    'ahorro',
    'resultado',
    'simulador'
  ];

  const renderSection = () => {
    switch (currentSection) {
      case 'inicio':
        return <HomeSection onStart={() => setCurrentSection('ingresos')} />;
      case 'ingresos':
        return <IncomeSection />;
      case 'gastos_fijos':
        return <FixedExpensesSection />;
      case 'gastos_variables':
        return <VariableExpensesSection />;
      case 'deudas':
        return <DebtSection />;
      case 'ahorro':
        return <SavingsSection />;
      case 'resultado':
        return <ResultsSection />;
      case 'simulador':
        return <SimulatorSection />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <Header />
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row">
        <Sidebar
          sections={sectionsOrder.map((key) => ({
            key,
            label: sectionLabels[key],
            complete: completion[key],
            disabled: key === 'resultado' ? !hasIncome : key === 'simulador' ? !hasIncome : false
          }))}
          current={currentSection}
          onSelect={(key) => {
            if ((key === 'resultado' || key === 'simulador') && !hasIncome) return;
            setCurrentSection(key);
          }}
        />
        <main className="flex-1 space-y-6">{renderSection()}</main>
      </div>
      {hasIncome && !totales.valido && currentSection === 'resultado' && (
        <div className="mx-auto max-w-4xl px-4 pb-10">
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-center text-sm text-red-600">
            Para ver tu resultado necesitas ingresar tu ingreso mensual total y asignar el 100 % entre gastos y ahorro
            (tolerancia ±1 %).
          </p>
        </div>
      )}
    </div>
  );
}
