import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export const Card = ({ title, children, actions, className }: CardProps) => (
  <section className={clsx('rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100', className)}>
    {title && (
      <header className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {actions}
      </header>
    )}
    <div className="space-y-4 text-sm text-slate-600">{children}</div>
  </section>
);
