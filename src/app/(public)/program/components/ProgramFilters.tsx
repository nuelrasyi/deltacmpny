"use client";

import React, { useState, useTransition, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function Filters({ categories }: { categories: { id: string; name: string }[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const [selected, setSelected] = useState(initialCategory);
  const [isPending, startTransition] = useTransition();

  const handleClick = (categoryId: string) => {
    setSelected(categoryId); // instant UI update
    startTransition(() => {
      if (categoryId) {
        router.push(`/program?category=${categoryId}`);
      } else {
        router.push(`/program`);
      }
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-12 relative">
      <button
        onClick={() => handleClick('')}
        disabled={isPending}
        className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 active:scale-95 ${
          selected === ''
            ? 'bg-slate-900 text-white shadow-lg'
            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:border-slate-300'
        }`}
      >
        Semua Program
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleClick(cat.id)}
          disabled={isPending}
          className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 active:scale-95 ${
            selected === cat.id
              ? 'bg-slate-900 text-white shadow-lg'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:border-slate-300'
          }`}
        >
          {cat.name}
        </button>
      ))}

      {isPending && (
        <div className="flex items-center text-primary-600 text-sm font-medium ml-2">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Memuat...
        </div>
      )}
    </div>
  );
}

export default function ProgramFilters({ categories }: { categories: { id: string; name: string }[] }) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-wrap items-center gap-3 mb-12">
          <div className="px-6 py-2.5 rounded-full text-sm font-bold bg-slate-900 text-white shadow-lg">
            Semua Program
          </div>
          {categories.map((cat) => (
            <div key={cat.id} className="px-6 py-2.5 rounded-full text-sm font-bold bg-white text-slate-700 border border-slate-200">
              {cat.name}
            </div>
          ))}
        </div>
      }
    >
      <Filters categories={categories} />
    </Suspense>
  );
}
