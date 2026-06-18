'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { createArticle } from '../actions'
import MediaLibraryModal from '@/components/MediaLibraryModal'
import { MediaAsset } from '@/types/database.types'
import toast from 'react-hot-toast'

export default function NewArticlePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Media selection
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<MediaAsset | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    
    if (selectedMedia) {
      formData.append('media_asset_id', selectedMedia.id)
    }

    const result = await createArticle(formData)
    
    if (result.error) {
      setError(result.error)
      toast.error(result.error)
      setLoading(false)
    } else {
      toast.success('Artikel berhasil ditambahkan!')
      router.push('/admin/articles')
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Link href="/admin/articles" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tulis Artikel Baru</h1>
          <p className="text-sm text-slate-500 mt-1">Bagikan berita, wawasan, atau informasi program terbaru.</p>
        </div>
      </div>

      <form action={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-6">
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Judul Artikel <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="title"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-medium focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                  placeholder="Masukkan judul yang menarik..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Konten Artikel <span className="text-red-500">*</span></label>
                <textarea 
                  name="content"
                  required
                  rows={15}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none resize-y leading-relaxed"
                  placeholder="Tulis isi artikel di sini..."
                ></textarea>
              </div>

            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
              
              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Gambar Sampul</label>
                {selectedMedia ? (
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-200 group">
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
                    className="w-full aspect-video border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:border-primary-500 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  >
                    <ImageIcon className="w-8 h-8 mb-3 opacity-50" />
                    <span className="text-sm font-medium">Pilih Media</span>
                  </button>
                )}
              </div>

              <div className="pt-6 border-t border-slate-100">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    id="is_published" 
                    name="is_published" 
                    value="true"
                    defaultChecked
                    className="w-5 h-5 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
                  />
                  <div>
                    <span className="block text-sm font-medium text-slate-900">Publikasikan Langsung</span>
                    <span className="block text-xs text-slate-500 mt-0.5">Artikel akan langsung tampil di halaman publik</span>
                  </div>
                </label>
              </div>

              <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center px-6 py-3 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 focus:ring-4 focus:ring-primary-500/20 transition-all disabled:opacity-70"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</>
                  ) : (
                    <><Save className="w-4 h-4 mr-2" /> Simpan Artikel</>
                  )}
                </button>
                <Link href="/admin/articles" className="w-full text-center px-6 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors border border-slate-200">
                  Batal
                </Link>
              </div>

            </div>
          </div>

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
