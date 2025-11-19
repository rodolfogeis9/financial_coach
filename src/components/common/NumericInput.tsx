import { InputHTMLAttributes, useEffect, useState } from 'react';
import clsx from 'clsx';
import { formatNumber, parseNumericString } from '../../utils/numberFormat';

interface NumericInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  label: string;
  tooltip?: string;
  error?: string;
  prefix?: string;
  value?: number;
  onValueChange?: (value: number) => void;
}

export const NumericInput = ({
  label,
  tooltip,
  error,
  className,
  prefix = '$',
  value = 0,
  onValueChange,
  ...props
}: NumericInputProps) => {
  const getFormattedValue = (val?: number | null) => {
    if (val === undefined || val === null || Number.isNaN(val)) {
      return '';
    }
    return formatNumber(val);
  };

  const [displayValue, setDisplayValue] = useState(() => getFormattedValue(value));

  useEffect(() => {
    const formatted = getFormattedValue(value);
    setDisplayValue((current) => (current !== formatted ? formatted : current));
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    if (rawValue === '') {
      setDisplayValue('');
      onValueChange?.(0);
      return;
    }
    const numericValue = parseNumericString(rawValue);
    const formatted = numericValue === 0 ? '0' : formatNumber(numericValue);
    setDisplayValue(formatted);
    onValueChange?.(numericValue);
  };

  return (
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
          type="text"
          inputMode="numeric"
          pattern="[0-9\.]*"
          value={displayValue}
          onChange={handleChange}
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
};
