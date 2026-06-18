'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { registerNewAdmin } from '@/actions/auth'
import toast from 'react-hot-toast'

export default function NewAdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const result = await registerNewAdmin(null, formData)
    
    if (result?.error) {
      setError(result.error)
      toast.error(result.error)
      setLoading(false)
    } else {
      toast.success('Admin baru berhasil didaftarkan!')
      router.push('/superadmin/admins')
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Link href="/superadmin/admins" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Daftarkan Admin Baru</h1>
          <p className="text-sm text-slate-500 mt-1">Berikan akses dasbor kepada rekan tim Anda.</p>
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
            <UserPlus className="w-8 h-8" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Lengkap <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              name="name"
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
              placeholder="Misal: Budi Santoso"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">ID Karyawan <span className="text-red-500">*</span></label>
            <div className="flex rounded-xl shadow-sm border border-slate-200 overflow-hidden bg-slate-50 focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 focus-within:bg-white transition-all">
              <span className="flex items-center px-4 bg-slate-100 text-slate-600 border-r border-slate-200 text-sm font-medium">
                DIL-
              </span>
              <input 
                type="text" 
                name="idCard"
                required
                className="w-full px-4 py-2.5 bg-transparent text-sm focus:outline-none text-slate-900"
                placeholder="Misal: 002"
              />
            </div>
            <p className="mt-1.5 text-xs text-slate-500">ID karyawan (misal: DIL-002) akan ditambahkan dengan `@dil.internal` dan digunakan sebagai email untuk login.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Kata Sandi Akses <span className="text-red-500">*</span></label>
            <input 
              type="password" 
              name="password"
              required
              minLength={6}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
              placeholder="Masukkan kata sandi (min. 6 karakter)"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/superadmin/admins" className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
            Batal
          </Link>
          <button 
            type="submit"
            disabled={loading}
            className="flex items-center px-6 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 focus:ring-4 focus:ring-primary-500/20 transition-all disabled:opacity-70"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Mendaftarkan...</>
            ) : (
              <><Save className="w-4 h-4 mr-2" /> Daftarkan Admin</>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
