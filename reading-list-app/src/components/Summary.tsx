import { BookOpen, Clock, Check } from 'lucide-react';

interface SummaryProps {
  total: number;
  reading: number;
  finished: number;
}

export function Summary({ total, reading, finished }: SummaryProps) {
  const stats = [
    {
      label: 'Total Books',
      value: total,
      icon: BookOpen,
      iconBg: 'bg-amber-50 text-amber-500 ring-amber-100',
    },
    {
      label: 'Reading',
      value: reading,
      icon: Clock,
      iconBg: 'bg-sky-50 text-sky-500 ring-sky-100',
    },
    {
      label: 'Finished',
      value: finished,
      icon: Check,
      iconBg: 'bg-emerald-50 text-emerald-500 ring-emerald-100',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.label}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-stone-200 bg-white p-3 shadow-sm sm:flex-row sm:gap-2.5 sm:px-4 sm:py-3.5"
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ${s.iconBg}`}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-lg font-bold leading-none tabular-nums text-stone-900 sm:text-xl">
                {s.value}
              </p>
              <p className="mt-0.5 text-[10px] font-medium text-stone-400 sm:text-[11px]">
                {s.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
