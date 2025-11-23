import { Card } from '../components/common/Card';

interface HomeProps {
  onStart: () => void;
}

export const HomeSection = ({ onStart }: HomeProps) => (
  <div className="space-y-6">
    <Card title="Financial Health Coach">
      <p>
        Completa tu información financiera mensual y obtén una fotografía clara de tu salud financiera. Te pediremos tus gastos,
        deudas, ahorros y hábitos de consumo para construir una nota del 1 al 100 con recomendaciones accionables.
      </p>
      <ul className="list-disc pl-5 text-slate-600">
        <li>Trabajamos solo con los datos que ingresas en este navegador.</li>
        <li>No guardamos nada en servidores.</li>
        <li>Todos los cálculos se ejecutan en el front-end con lógica auditable.</li>
      </ul>
      <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
        Tus datos no se guardan, se usan solo en tu navegador.
      </p>
      <button
        onClick={onStart}
        className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-2xl bg-brand-600 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-brand-200 transition hover:bg-brand-700 sm:px-6 sm:text-lg"
      >
        Comenzar diagnóstico
      </button>
    </Card>
  </div>
);
