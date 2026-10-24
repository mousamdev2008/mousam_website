import { useState } from 'react';
import { Plus, BookOpen, AlertCircle } from 'lucide-react';
import { BookStatus, STATUS_META, STATUS_ORDER } from '@/lib/books';

const MAX_TITLE_LENGTH = 60;

interface AddBookFormProps {
  onAdd: (title: string, status: BookStatus) => void;
  existingTitles: string[];
}

export function AddBookForm({ onAdd, existingTitles }: AddBookFormProps) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<BookStatus>('want-to-read');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  const normalize = (s: string) => s.trim().replace(/\s+/g, ' ').toLowerCase();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    if (trimmed.length > MAX_TITLE_LENGTH) {
      setError('Book title must be 60 characters or fewer.');
      return;
    }

    const normalized = normalize(trimmed);
    if (existingTitles.some((t) => normalize(t) === normalized)) {
      setError('This book is already in your reading list.');
      return;
    }

    onAdd(trimmed, status);
    setTitle('');
    setStatus('want-to-read');
    setError('');
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="group flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-300 bg-white/60 px-4 py-4 text-sm font-semibold text-stone-500 transition hover:border-amber-400 hover:bg-amber-50/60 hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
      >
        <Plus className="h-4 w-4 transition group-hover:rotate-90" />
        Add a book
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="flex items-center gap-2 text-stone-800">
        <BookOpen className="h-5 w-5 text-amber-500" />
        <h2 className="text-sm font-bold tracking-tight">Add a new book</h2>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <input
          type="text"
          value={title}
          autoFocus
          maxLength={MAX_TITLE_LENGTH}
          onChange={(e) => {
            setTitle(e.target.value);
            setError('');
          }}
          placeholder="Book title..."
          className={`w-full rounded-lg border bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 transition focus:bg-white focus:outline-none focus:ring-2 ${
            error
              ? 'border-red-300 focus:border-red-400 focus:ring-red-400/30'
              : 'border-stone-300 focus:border-amber-400 focus:ring-amber-400/30'
          }`}
        />

        {error && (
          <p className="flex items-center gap-1.5 text-xs font-medium text-red-500">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {STATUS_ORDER.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition ${
                status === s
                  ? STATUS_META[s].badge
                  : 'bg-stone-50 text-stone-500 ring-stone-200 hover:bg-stone-100'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${STATUS_META[s].dot}`} />
              {STATUS_META[s].label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            setTitle('');
            setOpen(false);
            setError('');
          }}
          className="rounded-lg px-3.5 py-2 text-sm font-semibold text-stone-500 transition hover:bg-stone-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!title.trim()}
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Add book
        </button>
      </div>
    </form>
  );
}
