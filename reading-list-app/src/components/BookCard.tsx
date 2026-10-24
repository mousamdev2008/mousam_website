import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Trash2, X, Check, Clock, Bookmark } from 'lucide-react';
import { Book, BookStatus, STATUS_META, STATUS_ORDER } from '@/lib/books';

interface BookCardProps {
  book: Book;
  onStatusChange: (id: string, status: BookStatus) => void;
  onRemove: (id: string) => void;
}

const STATUS_ICON = {
  'want-to-read': Bookmark,
  reading: Clock,
  finished: Check,
} as const;

export function BookCard({ book, onStatusChange, onRemove }: BookCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [statusMenu, setStatusMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen && !statusMenu) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setStatusMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen, statusMenu]);

  const meta = STATUS_META[book.status];
  const StatusIcon = STATUS_ICON[book.status];

  return (
    <div className="group flex items-start gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:border-stone-300 hover:shadow-md">
      <div className="flex h-11 w-9 shrink-0 items-end justify-center rounded-md bg-gradient-to-br from-amber-100 to-orange-200 shadow-inner">
        <div className="mb-1.5 h-4 w-5 rounded-[2px] bg-amber-500/80" />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold leading-snug text-stone-900" title={book.title}>
          {book.title}
        </h3>
        <div className="mt-2 flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${meta.badge}`}
          >
            <StatusIcon className="h-3 w-3" />
            {meta.label}
          </span>
        </div>
      </div>

      <button
        onClick={() => onRemove(book.id)}
        className="shrink-0 rounded-lg p-1.5 text-stone-400 transition hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-300"
        aria-label="Delete book"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="relative shrink-0" ref={menuRef}>
        <button
          onClick={() => {
            setMenuOpen((v) => !v);
            setStatusMenu(false);
          }}
          className="rounded-lg p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300"
          aria-label="Book actions"
        >
          <MoreVertical className="h-4 w-4" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full z-10 mt-1 w-40 overflow-hidden rounded-xl border border-stone-200 bg-white py-1 shadow-lg">
            {STATUS_ORDER.map((s) => {
              const Icon = STATUS_ICON[s];
              return (
                <button
                  key={s}
                  onClick={() => {
                    onStatusChange(book.id, s);
                    setMenuOpen(false);
                    setStatusMenu(false);
                  }}
                  disabled={s === book.status}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs font-medium text-stone-600 transition hover:bg-stone-50 disabled:cursor-default disabled:text-stone-300"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {STATUS_META[s].label}
                  {s === book.status && (
                    <Check className="ml-auto h-3.5 w-3.5 text-emerald-500" />
                  )}
                </button>
              );
            })}
            <div className="my-1 border-t border-stone-100" />
            <button
              onClick={() => {
                onRemove(book.id);
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs font-medium text-red-500 transition hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
