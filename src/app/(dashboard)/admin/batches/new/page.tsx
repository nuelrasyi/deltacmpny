'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2, Calendar } from 'lucide-react'
import Link from 'next/link'
import { createBatch } from '../actions'
import { getPrograms } from '../../programs/actions'
import toast from 'react-hot-toast'

export default function NewBatchPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [programs, setPrograms] = useState<any[]>([])

  useEffect(() => {
    async function fetchPrograms() {
      const data = await getPrograms()
      setPrograms(data)
      setInitialLoading(false)
    }
    fetchPrograms()
  }, [])

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    
    const result = await createBatch(formData)
    
    if (result.error) {
      setError(result.error)
      toast.error(result.error)
      setLoading(false)
    } else {
      toast.success('Batch berhasil ditambahkan!')
      router.push('/admin/batches')
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
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Link href="/admin/batches" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Buat Batch Baru</h1>
          <p className="text-sm text-slate-500 mt-1">Tambahkan jadwal baru untuk program pelatihan.</p>
        </div>
      </div>

      <form action={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mb-2">
            <Calendar className="w-8 h-8" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Program Pelatihan <span className="text-red-500">*</span></label>
            <select 
              name="program_id"
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
            >
              <option value="">-- Pilih Program --</option>
              {programs.map((prog) => (
                <option key={prog.id} value={prog.id}>{prog.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Batch <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              name="batch_number"
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
              placeholder="Misal: Batch Agustus 2026"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Tanggal Mulai <span className="text-red-500">*</span></label>
              <input 
                type="date" 
                name="start_date"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Tanggal Selesai</label>
              <input 
                type="date" 
                name="end_date"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Status <span className="text-red-500">*</span></label>
            <select 
              name="status"
              required
              defaultValue="Pendaftaran"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
            >
              <option value="Pendaftaran">Pendaftaran (Terbuka)</option>
              <option value="Aktif">Aktif (Sedang Berjalan)</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>

        </div>

        <div className="flex justify-end gap-3">
          <Link href="/admin/batches" className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
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
              <><Save className="w-4 h-4 mr-2" /> Simpan Batch</>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
