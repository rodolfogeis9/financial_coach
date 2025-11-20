import clsx from 'clsx';
import { SectionStatusBadge } from '../common/SectionStatusBadge';
import { SeccionClave } from '../../types/financial';

interface NavSection {
  key: SeccionClave;
  label: string;
  complete: boolean;
  disabled?: boolean;
}

interface SidebarProps {
  sections: NavSection[];
  current: SeccionClave;
  onSelect: (key: SeccionClave) => void;
}

export const Sidebar = ({ sections, current, onSelect }: SidebarProps) => (
  <>
    <aside className="hidden w-full max-w-xs border-r border-slate-200 bg-white/80 px-4 py-6 backdrop-blur lg:block">
      <nav className="space-y-1">
        {sections.map((section) => (
          <button
            key={section.key}
            disabled={section.disabled}
            onClick={() => onSelect(section.key)}
            className={clsx(
              'flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold transition',
              section.key === current
                ? 'bg-brand-50 text-brand-700'
                : 'text-slate-600 hover:bg-slate-50',
              section.disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            <span>{section.label}</span>
            <SectionStatusBadge complete={section.complete} />
          </button>
        ))}
      </nav>
    </aside>
    <div className="sticky top-16 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        <span>Menú</span>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold text-brand-600">
          {sections.find((section) => section.key === current)?.label}
        </span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {sections.map((section) => (
          <button
            key={section.key}
            disabled={section.disabled}
            onClick={() => onSelect(section.key)}
            className={clsx(
              'flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-2 text-xs font-semibold transition',
              section.key === current
                ? 'border-brand-200 bg-brand-50 text-brand-700'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
              section.disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            <span>{section.label}</span>
            <SectionStatusBadge complete={section.complete} />
          </button>
        ))}
      </div>
    </div>
  </>
);
