"use client";

import React, { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X, Loader2 } from 'lucide-react';

export default function ProgramSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (query.trim()) {
      params.set('q', query.trim());
    } else {
      params.delete('q');
    }
    // Reset category when searching
    params.delete('category');

    startTransition(() => {
      router.push(`/program${params.toString() ? `?${params.toString()}` : ''}`);
    });
  };

  const handleClear = () => {
    setQuery('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');
    startTransition(() => {
      router.push(`/program${params.toString() ? `?${params.toString()}` : ''}`);
    });
  };

  return (
    <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        {isPending ? (
          <Loader2 className="h-5 w-5 text-primary-400 animate-spin" />
        ) : (
          <Search className="h-5 w-5 text-slate-400" />
        )}
      </div>
      <input 
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="block w-full pl-12 pr-14 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white/20 backdrop-blur-md transition-all" 
        placeholder="Cari program sertifikasi..." 
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-14 flex items-center px-2 text-slate-400 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <button
        type="submit"
        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors"
      >
        <Search className="h-5 w-5" />
      </button>
    </form>
  );
}
