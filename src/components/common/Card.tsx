import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export const Card = ({ title, children, actions, className }: CardProps) => (
  <section className={clsx('rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-6', className)}>
    {title && (
      <header className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base font-semibold text-slate-900 sm:text-lg">{title}</h3>
        {actions}
      </header>
    )}
    <div className="space-y-4 text-sm text-slate-600 sm:text-base">{children}</div>
  </section>
);
