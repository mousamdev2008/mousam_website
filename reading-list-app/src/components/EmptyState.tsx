import { Library } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 bg-white/40 px-6 py-14 text-center sm:py-20">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 ring-1 ring-amber-100">
        <Library className="h-7 w-7 text-amber-400" />
      </div>
      <p className="mt-4 text-base font-semibold text-stone-700">
        Your reading list is empty.
      </p>
      <p className="mt-1 text-sm text-stone-400">Add your first book.</p>
    </div>
  );
}
