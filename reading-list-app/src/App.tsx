import { useMemo } from 'react';
import { BookOpen } from 'lucide-react';
import { useLocalStorage } from '@/lib/storage';
import { Book, BookStatus, FilterOption, STATUS_ORDER } from '@/lib/books';
import { AddBookForm } from '@/components/AddBookForm';
import { Summary } from '@/components/Summary';
import { FilterBar } from '@/components/FilterBar';
import { BookCard } from '@/components/BookCard';
import { EmptyState } from '@/components/EmptyState';

function App() {
  const [books, setBooks] = useLocalStorage<Book[]>('reading-list:books', []);
  const [filter, setFilter] = useLocalStorage<FilterOption>('reading-list:filter', 'all');

  const addBook = (title: string, status: BookStatus) => {
    setBooks((prev) => [
      { id: crypto.randomUUID(), title, status, addedAt: Date.now() },
      ...prev,
    ]);
  };

  const changeStatus = (id: string, status: BookStatus) => {
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const removeBook = (id: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  const counts = useMemo(() => {
    const base: Record<FilterOption, number> = {
      all: books.length,
      'want-to-read': 0,
      reading: 0,
      finished: 0,
    };
    for (const b of books) base[b.status]++;
    return base;
  }, [books]);

  const visible = useMemo(() => {
    const filtered = filter === 'all' ? books : books.filter((b) => b.status === filter);
    return [...filtered].sort((a, b) => {
      const ai = STATUS_ORDER.indexOf(a.status);
      const bi = STATUS_ORDER.indexOf(b.status);
      if (ai !== bi) return ai - bi;
      return b.addedAt - a.addedAt;
    });
  }, [books, filter]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 text-stone-900">
      {/* Header */}
      <header className="border-b border-stone-200/70 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center gap-2.5 px-4 py-4 sm:px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 shadow-sm">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight tracking-tight sm:text-lg">
              Reading List
            </h1>
            <p className="text-[11px] text-stone-400">Track books you want to read</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
        <AddBookForm onAdd={addBook} existingTitles={books.map((b) => b.title)} />

        {books.length > 0 && (
          <div className="mt-6">
            <Summary
              total={books.length}
              reading={counts['reading']}
              finished={counts['finished']}
            />
          </div>
        )}

        {books.length > 0 && (
          <div className="mt-5">
            <FilterBar active={filter} counts={counts} onChange={setFilter} />
          </div>
        )}

        <section className="mt-5">
          {books.length === 0 ? (
            <EmptyState />
          ) : visible.length === 0 ? (
            <p className="py-10 text-center text-sm text-stone-400">
              No books match this filter.
            </p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {visible.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onStatusChange={changeStatus}
                  onRemove={removeBook}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="mx-auto max-w-2xl px-4 pb-8 text-center sm:px-6">
        <p className="text-[11px] text-stone-300">
          Saved on this device
        </p>
      </footer>
    </div>
  );
}

export default App;
