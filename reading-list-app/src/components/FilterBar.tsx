import { FilterOption, FILTER_LABELS, BookStatus } from '@/lib/books';

const FILTERS: FilterOption[] = ['all', 'want-to-read', 'reading', 'finished'];

interface FilterBarProps {
  active: FilterOption;
  counts: Record<FilterOption, number>;
  onChange: (f: FilterOption) => void;
}

const DOT: Record<BookStatus, string> = {
  'want-to-read': 'bg-amber-400',
  reading: 'bg-sky-400',
  finished: 'bg-emerald-400',
};

export function FilterBar({ active, counts, onChange }: FilterBarProps) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 sm:flex-wrap sm:pb-0">
      {FILTERS.map((f) => {
        const isActive = active === f;
        return (
          <button
            key={f}
            onClick={() => onChange(f)}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold ring-1 transition ${
              isActive
                ? 'bg-stone-800 text-white ring-stone-800'
                : 'bg-white text-stone-600 ring-stone-200 hover:bg-stone-50'
            }`}
          >
            {f !== 'all' && <span className={`h-1.5 w-1.5 rounded-full ${DOT[f]}`} />}
            {FILTER_LABELS[f]}
            <span
              className={`rounded-full px-1.5 text-[10px] font-bold leading-4 ${
                isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
              }`}
            >
              {counts[f] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}
