import { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

interface NumericInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  tooltip?: string;
  error?: string;
  prefix?: string;
}

export const NumericInput = ({
  label,
  tooltip,
  error,
  className,
  prefix = '$',
  ...props
}: NumericInputProps) => (
  <label className={clsx('flex flex-col gap-1 text-sm font-medium text-slate-700', className)}>
    <span className="flex items-center gap-2">
      {label}
      {tooltip && (
        <span className="text-xs font-normal text-slate-400" title={tooltip}>
          ⓘ
        </span>
      )}
    </span>
    <div className="relative">
      {prefix && (
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">{prefix}</span>
      )}
      <input
        type="number"
        min={0}
        step="0.01"
        className={clsx(
          'w-full rounded-xl border border-slate-200 bg-white py-2 text-sm font-semibold text-slate-800 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100',
          prefix ? 'pl-10 pr-4' : 'px-4',
          error && 'border-red-400 focus:ring-red-100'
        )}
        {...props}
      />
    </div>
    {error && <span className="text-xs text-red-500">{error}</span>}
  </label>
);
