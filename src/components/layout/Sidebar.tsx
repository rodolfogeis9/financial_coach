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
  <aside className="w-full max-w-xs border-r border-slate-200 bg-white/80 px-4 py-6 backdrop-blur">
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
);
