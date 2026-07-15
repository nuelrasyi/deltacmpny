'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2, Calendar } from 'lucide-react'
import Link from 'next/link'
import { getBatchById, updateBatch } from '../../actions'
import { getPrograms } from '../../../programs/actions'
import toast from 'react-hot-toast'

export default function EditBatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [programs, setPrograms] = useState<any[]>([])
  const [batch, setBatch] = useState<any>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [programsData, batchData] = await Promise.all([
          getPrograms(),
          getBatchById(id)
        ])
        
        if (!batchData) {
          toast.error('Batch tidak ditemukan')
          router.push('/superadmin/batches')
          return
        }

        setPrograms(programsData)
        setBatch(batchData)
      } catch (err) {
        toast.error('Gagal mengambil data')
      } finally {
        setInitialLoading(false)
      }
    }
    fetchData()
  }, [id, router])

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    
    const result = await updateBatch(id, formData)
    
    if (result.error) {
      setError(result.error)
      toast.error(result.error)
      setLoading(false)
    } else {
      toast.success('Batch berhasil diperbarui!')
      router.push('/superadmin/batches')
    }
  }

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  if (!batch) return null

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Link href="/superadmin/batches" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Edit Batch</h1>
          <p className="text-sm text-slate-500 mt-1">Ubah informasi jadwal atau status batch.</p>
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
              defaultValue={batch.program_id}
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
              name="name"
              required
              defaultValue={batch.name}
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
                defaultValue={batch.start_date ? new Date(batch.start_date).toISOString().split('T')[0] : ''}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Tanggal Selesai</label>
              <input 
                type="date" 
                name="end_date"
                defaultValue={batch.end_date ? new Date(batch.end_date).toISOString().split('T')[0] : ''}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Status <span className="text-red-500">*</span></label>
            <select 
              name="status"
              required
              defaultValue={batch.status}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
            >
              <option value="upcoming">Pendaftaran (Terbuka)</option>
              <option value="ongoing">Aktif (Sedang Berjalan)</option>
              <option value="completed">Selesai / Ditutup</option>
            </select>
            <p className="mt-2 text-xs text-slate-500">Ubah status ke "Selesai" jika jadwal telah selesai atau pendaftaran ditutup.</p>
          </div>

        </div>

        <div className="flex justify-end gap-3">
          <Link href="/superadmin/batches" className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
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
    </div>
  )
}
