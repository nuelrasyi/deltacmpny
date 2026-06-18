import React from 'react';
import Link from 'next/link';
import { MapPin, Mail, Phone } from 'lucide-react';
import PublicNavbar from '@/components/PublicNavbar';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { getCompanyProfile } from '@/app/(dashboard)/superadmin/actions';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCompanyProfile();
  const logoUrl = profile?.logo?.url || null;
  const companyName = profile?.name || 'PT Delta Integrated Learning';

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900">
      {/* Navbar */}
      <PublicNavbar logoUrl={logoUrl} companyName={companyName} />

      {/* Main Content */}
      <main className="flex-1 pt-20">
        {children}
      </main>

      <FloatingWhatsApp />

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-300 pt-20 pb-8 relative overflow-hidden border-t border-slate-900">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-900/10 rounded-full blur-[128px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-900/10 rounded-full blur-[128px] pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

            {/* Brand Identity */}
            <div className="lg:col-span-5">
              <Link href="/" className="flex items-center gap-3 mb-6 inline-flex group">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="h-12 w-auto max-w-[240px] object-contain" />
                ) : (
                  <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <span className="text-white font-extrabold text-2xl">D</span>
                  </div>
                )}
                <div className="flex flex-col leading-tight justify-center">
                  {!logoUrl && <span className="text-2xl font-extrabold text-white tracking-tight">DIL</span>}
                  <span className={`font-semibold ${logoUrl ? 'text-slate-300 text-base' : 'text-primary-400 text-xs'}`}>{companyName}</span>
                </div>
              </Link>
              <p className="text-sm text-slate-400 leading-relaxed max-w-md mb-8 whitespace-pre-wrap">
                {profile?.description || 'Lembaga pelatihan dan sertifikasi kompetensi resmi berlisensi BNSP RI dan mitra strategis FMIPA Universitas Negeri Malang. Kami berdedikasi membangun profesional unggul berstandar global.'}
              </p>

              {/* Social Media */}
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white hover:border-primary-500 transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white hover:border-primary-500 transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white hover:border-primary-500 transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-3">
              <h3 className="text-sm font-bold text-white tracking-widest uppercase mb-6">
                Menu Cepat
              </h3>
              <ul className="space-y-4">
                <li><Link href="/" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all text-sm font-medium">Beranda Utama</Link></li>
                <li><Link href="/program" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all text-sm font-medium">Katalog Program & Sertifikasi</Link></li>
                <li><Link href="/artikel" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all text-sm font-medium">Berita & Insight Industri</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-4">
              <h3 className="text-sm font-bold text-white tracking-widest uppercase mb-6">
                Hubungi Kami
              </h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4 text-sm group">
                  <div className="mt-1 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-600/20 group-hover:text-primary-400 transition-colors">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    <strong className="text-slate-200 block mb-1">Alamat Kantor</strong>
                    <span className="whitespace-pre-wrap">{profile?.address || 'Jakarta Pusat, Indonesia 10220'}</span>
                  </p>
                </div>

                <div className="flex items-start gap-4 text-sm group">
                  <div className="mt-0.5 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-600/20 group-hover:text-primary-400 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    <strong className="text-slate-200 block mb-1">Email Resmi</strong>
                    <a href={`mailto:${profile?.email || 'halo@deltaintegrated.com'}`} className="hover:text-primary-400 transition-colors">{profile?.email || 'halo@deltaintegrated.com'}</a>
                  </p>
                </div>

                <div className="flex items-start gap-4 text-sm group">
                  <div className="mt-0.5 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-600/20 group-hover:text-primary-400 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    <strong className="text-slate-200 block mb-1">WhatsApp / Telepon</strong>
                    <a href={`https://wa.me/${(profile?.whatsapp_number || '').replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">{profile?.whatsapp_number || '+62 21 5550 1234'}</a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-800/60 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-slate-500 font-medium">
              &copy; {new Date().getFullYear()} PT Delta Integrated Learning. Hak Cipta Dilindungi.
            </p>
            <div className="flex space-x-8 text-sm font-medium">
              <a href="#" className="text-slate-500 hover:text-white transition-colors">Syarat & Ketentuan</a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors">Kebijakan Privasi</a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors">Pusat Bantuan</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
