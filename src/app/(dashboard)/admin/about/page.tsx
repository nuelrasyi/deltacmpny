import React from 'react';
import { Save, Info } from 'lucide-react';
import { getCompanyProfile } from '@/app/(dashboard)/superadmin/actions';
import { updateAboutUs } from './actions';
import ClientAboutForm from '@/app/(dashboard)/admin/about/ClientAboutForm';

export const metadata = {
  title: 'Kelola Tentang Kami - DIL CMS',
};

export default async function AboutAdminPage() {
  const profile = await getCompanyProfile();
  const currentAboutUs = profile?.about_us || '';

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Tentang Kami</h1>
        <p className="text-slate-500">
          Kelola konten halaman "Tentang Kami" yang akan ditampilkan di website publik.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex gap-4 items-start bg-blue-50/50">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <strong>Tips Penulisan:</strong> Anda dapat menggunakan format teks biasa, atau jika Anda paham HTML, Anda bisa menggunakan tag HTML dasar seperti <code>&lt;b&gt;</code> untuk tebal, <code>&lt;br&gt;</code> untuk baris baru, dsb.
          </div>
        </div>

        <ClientAboutForm initialContent={currentAboutUs} />
      </div>
    </div>
  );
}
