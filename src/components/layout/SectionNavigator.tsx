import { SeccionClave } from '../../types/financial';
import clsx from 'clsx';

interface SectionNavigatorProps {
  sections: { key: SeccionClave; label: string; disabled?: boolean }[];
  current: SeccionClave;
  onSelect: (key: SeccionClave) => void;
  nextDisabledReason?: string;
}

export const SectionNavigator = ({ sections, current, onSelect, nextDisabledReason }: SectionNavigatorProps) => {
  const currentIndex = sections.findIndex((section) => section.key === current);
  const previousSection = currentIndex > 0 ? sections[currentIndex - 1] : null;
  const nextSection = currentIndex >= 0 && currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null;
  const nextDisabled = !nextSection || nextSection.disabled;

  if (!previousSection && !nextSection) return null;

  return (
    <div className="sticky bottom-4 z-20 px-1 sm:px-0">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 px-3 py-3 shadow-lg shadow-slate-200/60 backdrop-blur sm:px-4">
        <div className="flex flex-wrap justify-between gap-3">
          <div className="flex flex-col text-xs font-semibold uppercase tracking-wide text-slate-400">
            <span>Sección actual</span>
            <span className="text-sm text-slate-700">{sections[currentIndex]?.label}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {previousSection && (
              <button
                type="button"
                onClick={() => onSelect(previousSection.key)}
                className="min-h-[44px] rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Anterior
              </button>
            )}
            {nextSection && (
              <button
                type="button"
                disabled={nextDisabled}
                onClick={() => onSelect(nextSection.key)}
                className={clsx(
                  'min-h-[44px] rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition',
                  nextDisabled
                    ? 'cursor-not-allowed bg-slate-200 text-slate-500'
                    : 'bg-brand-600 hover:bg-brand-700 shadow-brand-200'
                )}
              >
                {nextSection ? `Siguiente: ${nextSection.label}` : 'Siguiente'}
              </button>
            )}
          </div>
        </div>
        {nextDisabled && nextDisabledReason && (
          <p className="text-xs text-red-500">{nextDisabledReason}</p>
        )}
      </div>
    </div>
  );
};
