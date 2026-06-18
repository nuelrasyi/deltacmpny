'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { updateProgram, getProgramById } from '../../actions'
import MediaLibraryModal from '@/components/MediaLibraryModal'
import { MediaAsset } from '@/types/database.types'
import toast from 'react-hot-toast'

export default function EditProgramPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [program, setProgram] = useState<any>(null)

  // Media selection
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<MediaAsset | null>(null)

  useEffect(() => {
    async function loadData() {
      const data = await getProgramById(params.id)
      if (data) {
        setProgram(data)
        if (data.media) {
          setSelectedMedia(data.media as MediaAsset)
        }
      } else {
        setError("Program tidak ditemukan")
      }
      setInitialLoading(false)
    }
    loadData()
  }, [params.id])

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    
    // Append media asset ID if selected
    if (selectedMedia) {
      formData.append('media_asset_id', selectedMedia.id)
    }

    // Call server action
    const result = await updateProgram(params.id, formData)
    
    if (result.error) {
      setError(result.error)
      toast.error(result.error)
      setLoading(false)
    } else {
      toast.success('Program berhasil diperbarui!')
      router.push('/admin/programs')
    }
  }

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/programs" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Edit Program</h1>
          <p className="text-sm text-slate-500 mt-1">Ubah rincian program sertifikasi atau pelatihan.</p>
        </div>
      </div>

      <form action={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-8">
          
          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Cover Program</label>
            {selectedMedia ? (
              <div className="relative aspect-[21/9] w-full max-w-2xl rounded-xl overflow-hidden border border-slate-200 group">
                <img src={selectedMedia.url} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    type="button"
                    onClick={() => setIsMediaModalOpen(true)}
                    className="px-4 py-2 bg-white text-slate-900 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-50"
                  >
                    Ganti Gambar
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsMediaModalOpen(true)}
                className="w-full max-w-2xl aspect-[21/9] border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:border-primary-500 hover:bg-primary-50 hover:text-primary-600 transition-colors"
              >
                <ImageIcon className="w-8 h-8 mb-3 opacity-50" />
                <span className="text-sm font-medium">Pilih dari Media Library</span>
                <span className="text-xs mt-1 opacity-75">Format: JPG, PNG (Max 2MB)</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Program <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="title"
                required
                defaultValue={program?.title}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                placeholder="Misal: Sertifikasi Ahli K3 Umum"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Kategori ID <span className="text-red-500">*</span></label>
              <input 
                type="number" 
                name="category_id"
                required
                defaultValue={program?.category_id}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                placeholder="ID Kategori (Contoh: 1)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Harga (Rp)</label>
              <input 
                type="number" 
                name="price"
                defaultValue={program?.price || 0}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                placeholder="Misal: 5000000"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Deskripsi Program</label>
              <textarea 
                name="description"
                rows={5}
                defaultValue={program?.description || ''}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none resize-y"
                placeholder="Tuliskan deskripsi lengkap mengenai program ini..."
              ></textarea>
            </div>

            <div className="md:col-span-2 flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <input 
                type="checkbox" 
                id="is_active" 
                name="is_active" 
                value="true"
                defaultChecked={program?.is_active}
                className="w-5 h-5 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-slate-700 cursor-pointer">
                Program Aktif
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/admin/programs" className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
            Batal
          </Link>
          <button 
            type="submit"
            disabled={loading}
            className="flex items-center px-6 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 focus:ring-4 focus:ring-primary-500/20 transition-all disabled:opacity-70"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</>
            ) : (
              <><Save className="w-4 h-4 mr-2" /> Simpan Perubahan</>
            )}
          </button>
        </div>
      </form>

      {/* Render Modal */}
      <MediaLibraryModal 
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={(media) => {
          setSelectedMedia(media)
          setIsMediaModalOpen(false)
        }}
      />
    </div>
  )
}
