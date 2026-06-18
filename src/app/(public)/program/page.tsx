import React from 'react';
import Link from 'next/link';
import { ArrowRight, Search, Award, BookOpen, Clock, Users } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';

export default async function ProgramPage() {
  const supabase = await createClient();
  
  const { data: programsData, error } = await supabase
    .from('programs')
    .select(`
      *,
      category:categories(name),
      media:media_assets(url)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  const programs = programsData || [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section Program (Moved from old Beranda Hero) */}
      <section className="bg-slate-900 pt-20 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-900/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/30 rounded-full blur-[128px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
              Akselerasi Karir Anda Bersama <span className="text-primary-400">DIL</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 font-light mb-10 leading-relaxed">
              Eksplorasi program sertifikasi berstandar industri dan berlisensi BNSP. Tingkatkan kompetensi akademis bersama FMIPA UM dan jadilah profesional unggul di bidang Anda.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input 
                type="text" 
                className="block w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white/20 backdrop-blur-md transition-all" 
                placeholder="Cari program sertifikasi..." 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Program Catalog */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Filters (Mock) */}
          <div className="flex flex-wrap items-center gap-4 mb-12">
            <button className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-sm font-bold shadow-md">Semua Program</button>
            <button className="px-6 py-2.5 rounded-full bg-white text-slate-700 border border-slate-200 text-sm font-bold hover:bg-slate-100 transition-colors">Keselamatan Kerja</button>
            <button className="px-6 py-2.5 rounded-full bg-white text-slate-700 border border-slate-200 text-sm font-bold hover:bg-slate-100 transition-colors">Teknologi Informasi</button>
            <button className="px-6 py-2.5 rounded-full bg-white text-slate-700 border border-slate-200 text-sm font-bold hover:bg-slate-100 transition-colors">Manajemen</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Belum Ada Program</h3>
                <p className="text-slate-500">Saat ini belum ada program pelatihan yang tersedia.</p>
              </div>
            ) : (
              programs.map((program: any) => (
                <div key={program.id} className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-2 transition-all duration-300 flex flex-col">
                  <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors z-10" />
                    {program.media ? (
                      <img src={program.media.url} alt={program.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <BookOpen className="w-16 h-16 text-slate-300" />
                    )}
                    <div className="absolute top-4 left-4 z-20">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-white text-slate-900 shadow-md">
                        {program.category?.name || 'Umum'}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">{program.title}</h3>
                    <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">{program.description || 'Tidak ada deskripsi'}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                        <Clock className="w-4 h-4 text-primary-500" /> Fleksibel
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                        <Users className="w-4 h-4 text-primary-500" /> Semua Level
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-auto">
                      <Link href={`/program/${program.slug}`} className="text-primary-600 font-bold hover:text-primary-700 flex items-center text-sm group-hover:translate-x-1 transition-transform w-full justify-between">
                        Pelajari Detail Program <ArrowRight className="ml-1 w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16 text-white text-center px-4">
        <h2 className="text-3xl font-extrabold mb-4">Belum menemukan program yang tepat?</h2>
        <p className="mb-8 text-primary-100 max-w-2xl mx-auto">Tim akademik kami siap membantu Anda menyusun kurikulum pelatihan kustom yang paling sesuai dengan kebutuhan perusahaan Anda.</p>
        <button className="px-8 py-4 bg-white text-primary-700 font-bold rounded-full shadow-lg hover:bg-slate-50 hover:scale-105 transition-all">
          Konsultasi Gratis Sekarang
        </button>
      </section>
    </div>
  );
}
