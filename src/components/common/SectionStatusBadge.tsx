import clsx from 'clsx';

export const SectionStatusBadge = ({ complete }: { complete: boolean }) => (
  <span
    className={clsx(
      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
      complete ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
    )}
  >
    {complete ? '✔ Completo' : 'Pendiente'}
  </span>
);
