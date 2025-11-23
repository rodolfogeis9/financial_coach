export const Header = () => (
  <header className="flex flex-col gap-3 border-b border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-wider text-slate-400 sm:text-sm">Financial Health Coach</p>
      <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Tu entrenador financiero personal</h1>
    </div>
    <span className="self-start rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600 sm:self-auto sm:px-4 sm:text-sm">
      Beta
    </span>
  </header>
);
