'use client'

import React, { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, Loader2 } from 'lucide-react';
import MediaLibraryModal from '@/components/MediaLibraryModal';
import { MediaAsset } from '@/types/database.types';
import { getCompanyProfile, updateCompanyProfile } from '../actions';
import toast from 'react-hot-toast';

export default function SuperadminPage() {
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaAsset | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function loadProfile() {
      const data = await getCompanyProfile();
      if (data) {
        setProfile(data);
        if (data.logo) {
          setSelectedMedia(data.logo);
        }
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    
    const formData = new FormData(e.currentTarget);
    if (selectedMedia) {
      formData.append('logo_id', selectedMedia.id);
    }
    
    const result = await updateCompanyProfile(formData);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Pengaturan berhasil disimpan!');
    }
    setSaving(false);
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;
  }

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pengaturan Perusahaan (Superadmin)</h1>
        <p className="mt-1 text-sm text-slate-500">Kelola profil perusahaan, logo, dan kontak utama yang akan ditampilkan di website.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 sm:p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Logo Section */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Logo Perusahaan</label>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                {selectedMedia ? (
                  <img src={selectedMedia.url} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-slate-400 font-bold text-xl">DIL</span>
                )}
              </div>
              <button 
                type="button" 
                onClick={() => setIsMediaModalOpen(true)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Pilih dari Media Library
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Nama Perusahaan</label>
              <input type="text" name="name" required className="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none" defaultValue={profile?.name || "PT Delta Integrated Learning"} />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nomor WhatsApp Utama</label>
              <input type="text" name="whatsapp_number" required className="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none" defaultValue={profile?.whatsapp_number || "6281234567890"} placeholder="Mulai dengan kode negara (62)" />
              <p className="mt-1 text-xs text-slate-500">Nomor ini akan digunakan untuk semua tombol pendaftaran.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Kontak</label>
              <input type="email" name="email" required className="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none" defaultValue={profile?.email || "hello@dil.co.id"} />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Alamat Lengkap</label>
              <textarea name="address" rows={3} required className="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none" defaultValue={profile?.address || "Menara DIL, Jl. Jend. Sudirman Kav. 1, Jakarta Pusat, 10220"}></textarea>
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Deskripsi Singkat (Footer)</label>
              <textarea name="description" rows={2} required className="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none" defaultValue={profile?.description || "Meningkatkan kompetensi dan profesionalisme SDM Indonesia melalui program sertifikasi terintegrasi."}></textarea>
            </div>
            
            {/* Social Media Section */}
            <div className="sm:col-span-2 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Tautan Sosial Media</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">LinkedIn URL</label>
                  <input type="url" name="linkedin_url" className="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none" defaultValue={profile?.linkedin_url || ""} placeholder="https://linkedin.com/company/..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Instagram URL</label>
                  <input type="url" name="instagram_url" className="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none" defaultValue={profile?.instagram_url || ""} placeholder="https://instagram.com/..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Facebook URL</label>
                  <input type="url" name="facebook_url" className="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none" defaultValue={profile?.facebook_url || ""} placeholder="https://facebook.com/..." />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" disabled={saving} className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>

      <MediaLibraryModal 
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={(media) => {
          setSelectedMedia(media);
          setIsMediaModalOpen(false);
        }}
      />
    </div>
  );
}
