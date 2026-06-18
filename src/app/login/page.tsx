'use client'

import { useState, Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { login } from './actions'
import { Lock, Mail, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { getCompanyProfile } from '@/app/(dashboard)/superadmin/actions'

function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [companyName, setCompanyName] = useState<string>("PT Delta Integrated")

  const searchParams = useSearchParams()
  const nextUrl = searchParams.get('next')

  useEffect(() => {
    getCompanyProfile().then(data => {
      if (data?.logo?.url) setLogoUrl(data.logo.url)
      if (data?.name) setCompanyName(data.name)
    })
  }, [])

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    
    const result = await login(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-white font-sans text-slate-900">
      {/* Left Panel - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary-900 overflow-hidden flex-col justify-between p-12 lg:p-20">
        {/* Dynamic Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary-600/30 blur-3xl" />
          <div className="absolute bottom-[10%] -right-[20%] w-[60%] h-[60%] rounded-full bg-indigo-500/20 blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-12 w-auto max-w-[240px] object-contain bg-white rounded-xl shadow-xl px-3 py-1.5" />
            ) : (
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-xl">
                <span className="text-primary-900 font-bold text-xl">D</span>
              </div>
            )}
            <span className="text-white text-xl font-bold tracking-wider">{companyName}</span>
          </div>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
            Sistem Manajemen Pembelajaran Terintegrasi
          </h1>
          <p className="text-lg text-primary-100 font-light">
            Kelola program pelatihan, pantau perkembangan peserta, dan evaluasi hasil belajar dalam satu platform yang komprehensif.
          </p>
        </div>

        <div className="relative z-10 text-primary-100/60 text-sm">
          &copy; {new Date().getFullYear()} PT Delta Integrated Learning. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo (Visible only on mobile) */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-12 w-auto max-w-[240px] object-contain shadow-lg" />
            ) : (
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">D</span>
              </div>
            )}
            <span className="text-slate-900 text-xl font-bold tracking-wider">{companyName}</span>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Selamat Datang Kembali
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Silakan masuk ke panel administrasi Anda
            </p>
          </div>
          
          <form className="mt-8 space-y-6" action={handleSubmit}>
            <input type="hidden" name="next" value={nextUrl || ''} />
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100 flex items-start">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email / ID Card / NIK
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-600">
                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="text"
                    required
                    className="appearance-none block w-full pl-11 px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all sm:text-sm"
                    placeholder="DIL-002 atau cukup ketik 002"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Kata Sandi
                  </label>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-600">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="appearance-none block w-full pl-11 pr-11 px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all sm:text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex items-center justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/30 overflow-hidden"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                    Memproses Autentikasi...
                  </>
                ) : (
                  <>
                    Masuk ke Dashboard
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin h-8 w-8 text-primary-600" /></div>}>
      <LoginForm />
    </Suspense>
  )
}
