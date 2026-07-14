'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2, Upload, X } from 'lucide-react'
import Link from 'next/link'
import { upsertOrganizationMember } from './actions'
import toast from 'react-hot-toast'

type MemberProps = {
  id?: string
  name?: string
  position?: string
  role?: string
  avatar_url?: string | null
  order_index?: number
}

export default function OrganizationForm({ initialData }: { initialData?: MemberProps }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.avatar_url || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error('Ukuran file maksimal 2MB')
        if (fileInputRef.current) fileInputRef.current.value = ''
        return
      }
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleRemoveImage = () => {
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    if (initialData?.id) {
      formData.append('id', initialData.id)
    }
    
    // If we have an initial avatar but user removed it, we need to pass a flag or handle it
    // For simplicity, if previewUrl is null and we had an avatar, we shouldn't send the existing one
    if (initialData?.avatar_url && previewUrl === initialData.avatar_url) {
      formData.append('existing_avatar_url', initialData.avatar_url)
    } else if (previewUrl === null) {
      formData.append('existing_avatar_url', '') // Empty means removed
    }

    const result = await upsertOrganizationMember(formData)
    
    if (result.error) {
      setError(result.error)
      toast.error(result.error)
      setLoading(false)
    } else {
      toast.success(initialData ? 'Anggota berhasil diperbarui!' : 'Anggota berhasil ditambahkan!')
      router.push('/superadmin/organization')
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Link href="/superadmin/organization" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {initialData ? 'Edit Anggota' : 'Tambah Anggota Baru'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">Lengkapi informasi profil anggota organisasi.</p>
        </div>
      </div>

      <form action={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            {/* Avatar Upload */}
            <div className="flex-shrink-0">
              <label className="block text-sm font-medium text-slate-700 mb-3">Foto Profil (Avatar)</label>
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-slate-50 transition-colors group-hover:border-primary-500">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-slate-400 flex flex-col items-center">
                      <Upload className="w-6 h-6 mb-1" />
                      <span className="text-[10px] uppercase font-bold tracking-wider">Upload</span>
                    </div>
                  )}
                </div>
                
                {previewUrl && (
                  <button 
                    type="button" 
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors shadow-sm z-10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                
                <input 
                  type="file" 
                  name="avatar" 
                  accept="image/jpeg, image/png, image/webp" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  title="Upload foto profil"
                />
              </div>
              <p className="text-xs text-slate-500 mt-3 text-center max-w-[128px]">Format: JPG, PNG. Maks 2MB. Rasio 1:1.</p>
            </div>

            {/* Fields */}
            <div className="flex-1 space-y-6 w-full">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required
                  defaultValue={initialData?.name}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                  placeholder="Contoh: Prof. Surjani Wonorahardjo, Ph.D"
                />
              </div>

              <div>
                <label htmlFor="position" className="block text-sm font-medium text-slate-700 mb-1">Jabatan *</label>
                <input 
                  type="text" 
                  id="position" 
                  name="position" 
                  required
                  defaultValue={initialData?.position}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                  placeholder="Contoh: Ketua TUK / Manajer Mutu"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-1">Peran Khusus *</label>
                  <input 
                    type="text" 
                    id="role" 
                    name="role" 
                    required
                    defaultValue={initialData?.role}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                    placeholder="Contoh: Pimpinan Utama"
                  />
                  <p className="text-xs text-slate-500 mt-1.5">Akan tampil dalam kotak pill di bawah avatar.</p>
                </div>
                <div>
                  <label htmlFor="order_index" className="block text-sm font-medium text-slate-700 mb-1">Nomor Urut</label>
                  <input 
                    type="number" 
                    id="order_index" 
                    name="order_index" 
                    defaultValue={initialData?.order_index ?? 1}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                    placeholder="0 untuk Ketua, 1+ untuk bawahan"
                  />
                  <p className="text-xs text-slate-500 mt-1.5">0: Pemimpin (Paling atas). 1,2,dst: Anggota di bawahnya.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link 
              href="/superadmin/organization"
              className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
            >
              Batal
            </Link>
            <button 
              type="submit"
              disabled={loading}
              className="flex items-center justify-center px-6 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 focus:ring-4 focus:ring-primary-500/20 transition-all disabled:opacity-70"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</>
              ) : (
                <><Save className="w-4 h-4 mr-2" /> Simpan</>
              )}
            </button>
          </div>

        </div>
      </form>
    </div>
  )
}
