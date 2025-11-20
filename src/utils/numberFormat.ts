const numberFormatter = new Intl.NumberFormat('es-CL', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

const currencyFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

export const formatNumber = (value?: number | null) => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return '0';
  }
  return numberFormatter.format(value);
};

export const formatCurrency = (value?: number | null) => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return currencyFormatter.format(0);
  }
  return currencyFormatter.format(value);
};

export const sanitizeNumericString = (value: string) => value.replace(/[^\d]/g, '');

export const parseNumericString = (value: string) => {
  const cleaned = sanitizeNumericString(value);
  if (cleaned === '') {
    return 0;
  }
  const normalized = cleaned.replace(/^0+(?=\d)/, '');
  return Number(normalized || '0');
};
