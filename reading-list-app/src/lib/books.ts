export type BookStatus = 'want-to-read' | 'reading' | 'finished';

export interface Book {
  id: string;
  title: string;
  status: BookStatus;
  addedAt: number;
}

export const STATUS_META: Record<
  BookStatus,
  { label: string; badge: string; dot: string }
> = {
  'want-to-read': {
    label: 'Want to Read',
    badge: 'bg-amber-50 text-amber-700 ring-amber-200',
    dot: 'bg-amber-400',
  },
  reading: {
    label: 'Reading',
    badge: 'bg-sky-50 text-sky-700 ring-sky-200',
    dot: 'bg-sky-400',
  },
  finished: {
    label: 'Finished',
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    dot: 'bg-emerald-400',
  },
};

export const STATUS_ORDER: BookStatus[] = [
  'want-to-read',
  'reading',
  'finished',
];

export type FilterOption = 'all' | BookStatus;

export const FILTER_LABELS: Record<FilterOption, string> = {
  all: 'All',
  'want-to-read': 'Want to Read',
  reading: 'Reading',
  finished: 'Finished',
};
