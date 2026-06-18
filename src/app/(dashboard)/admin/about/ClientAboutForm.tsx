'use client';

import React, { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateAboutUs } from './actions';

export default function ClientAboutForm({ initialContent }: { initialContent: string }) {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await updateAboutUs(formData);
    
    setIsSaving(false);
    
    if (result?.error) {
      toast.error('Gagal menyimpan: ' + result.error);
    } else {
      toast.success('Berhasil menyimpan halaman Tentang Kami!');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 md:p-8">
      <div className="mb-6">
        <label htmlFor="about_us" className="block text-sm font-semibold text-slate-700 mb-2">
          Konten Tentang Kami
        </label>
        <textarea
          id="about_us"
          name="about_us"
          rows={15}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-y"
          placeholder="Tuliskan profil perusahaan, visi misi, atau sejarah singkat di sini..."
          required
        />
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-100">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Save className="w-5 h-5 mr-2" />
          )}
          {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>
    </form>
  );
}


