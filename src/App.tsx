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
import { BudgetBanner } from './components/layout/BudgetBanner';
import { SectionNavigator } from './components/layout/SectionNavigator';

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

const overlayPattern = encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'>
    <rect width='600' height='600' fill='none'/>
    <g stroke='%230ea5e9' stroke-opacity='0.15' stroke-width='1.5' fill='none'>
      <path d='M40 520 L140 360 L220 410 L320 250 L420 300 L520 180'/>
    </g>
    <g stroke='%23f97316' stroke-opacity='0.15' stroke-width='2' fill='none'>
      <path d='M60 440 C140 360 260 460 340 360 420 280 520 360 560 320'/>
    </g>
    <g fill='%23ffffff' fill-opacity='0.08' font-family='Inter,Arial,sans-serif' font-size='72'>
      <text x='420' y='140'>$</text>
      <text x='80' y='260'>₿</text>
      <text x='300' y='500'>₿</text>
      <text x='200' y='160'>₱</text>
    </g>
    <g stroke='%23facc15' stroke-opacity='0.2' stroke-width='12' stroke-linecap='round'>
      <path d='M120 520 L120 380' />
      <path d='M200 520 L200 320' />
      <path d='M280 520 L280 400' />
      <path d='M360 520 L360 300' />
      <path d='M440 520 L440 420' />
    </g>
    <g fill='%23a855f7' fill-opacity='0.15'>
      <circle cx='520' cy='80' r='30' />
      <circle cx='90' cy='460' r='24' />
    </g>
  </svg>
`);

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

  const canAccessSection = (section: SeccionClave) => {
    if ((section === 'resultado' || section === 'simulador') && !hasIncome) return false;
    return true;
  };

  const navSections = sectionsOrder.map((key) => ({
    key,
    label: sectionLabels[key],
    complete: completion[key],
    disabled: !canAccessSection(key)
  }));

  const currentIndex = sectionsOrder.indexOf(currentSection);
  const previousSection = currentIndex > 0 ? sectionsOrder[currentIndex - 1] : null;
  const nextSection = currentIndex >= 0 && currentIndex < sectionsOrder.length - 1 ? sectionsOrder[currentIndex + 1] : null;
  const nextDisabled = !nextSection || !canAccessSection(nextSection);

  const handleSelectSection = (key: SeccionClave) => {
    if (!canAccessSection(key)) return;
    setCurrentSection(key);
  };

  const nextDisabledReason = !hasIncome && nextSection && (nextSection === 'resultado' || nextSection === 'simulador')
    ? 'Debes ingresar tu ingreso mensual total para avanzar a esta sección.'
    : undefined;

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
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          backgroundImage: `radial-gradient(circle at 15% 20%, rgba(14, 165, 233, 0.25), transparent 55%), radial-gradient(circle at 85% 10%, rgba(249, 115, 22, 0.2), transparent 55%), url("data:image/svg+xml,${overlayPattern}")`,
          backgroundSize: '1200px 1200px, 900px 900px, 480px 480px',
          backgroundRepeat: 'no-repeat, no-repeat, repeat'
        }}
      ></div>
      <div className="relative z-10 flex min-h-screen flex-col bg-gradient-to-b from-white/95 via-white/90 to-white/95 bg-opacity-90">
        <Header />
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 lg:flex-row">
          <Sidebar
            sections={navSections}
            current={currentSection}
            onSelect={handleSelectSection}
            onNext={nextSection ? () => handleSelectSection(nextSection) : undefined}
            nextSectionLabel={nextSection ? sectionLabels[nextSection] : undefined}
            nextDisabled={nextDisabled}
            nextDisabledReason={nextDisabledReason}
          />
          <main className="flex-1 space-y-6">
            {currentSection !== 'inicio' && (
              <BudgetBanner income={totales.ingreso} assigned={totales.total_gasto_ahorro} />
            )}
            {renderSection()}
            {currentSection !== 'inicio' && (
              <SectionNavigator
                sections={navSections}
                current={currentSection}
                onSelect={handleSelectSection}
                nextDisabledReason={nextDisabledReason}
              />
            )}
          </main>
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
    </div>
  );
}
