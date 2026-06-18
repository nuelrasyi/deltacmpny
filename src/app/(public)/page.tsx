import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, BookOpen, Star, Users, Trophy, ChevronRight, Award, ShieldCheck, Clock, Calendar } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch top 3 active programs
  const { data: programsData } = await supabase
    .from('programs')
    .select(`
      *,
      category:categories(name),
      media:media_assets(url)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(3);

  const programs = programsData || [];

  // Fetch top 3 latest articles
  const { data: articlesData } = await supabase
    .from('articles')
    .select(`
      *,
      media:media_assets(url)
    `)
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .limit(3);

  const articles = articlesData || [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* NEW HERO SECTION: Focusing on BNSP & FMIPA UM Partnership */}
      <section className="relative overflow-hidden bg-slate-900 pt-24 pb-32 lg:pt-32 lg:pb-40">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80"
            alt="University Partnership"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-fade-in-up">
              <Award className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-bold text-white tracking-wide">LISENSI RESMI BNSP RI</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-8 leading-tight">
              Lembaga Pelatihan & Sertifikasi Profesional <span className="text-primary-400">Terpercaya</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed font-light">
              PT Delta Integrated Learning (DIL) merupakan mitra strategis <strong className="text-white font-bold">FMIPA Universitas Negeri Malang</strong>. Kami menyediakan program kompetensi tersertifikasi resmi oleh <strong className="text-white font-bold">Badan Nasional Sertifikasi Profesi (BNSP)</strong> untuk menjamin kualitas standar kerja Anda.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#program" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-slate-900 bg-white rounded-full shadow-lg hover:bg-slate-100 hover:scale-105 transition-all">
                Mulai Sertifikasi Anda
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Partners / License Bar */}
      <section className="bg-white border-b border-slate-200 py-10 relative z-20 -mt-8 mx-4 sm:mx-8 lg:mx-auto max-w-7xl rounded-2xl shadow-xl">
        <div className="px-6 flex flex-col md:flex-row flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16 opacity-80 hover:opacity-100 transition-all duration-500">
          {/* Logos from /public */}
          <div className="flex items-center gap-4">
            <img src="/logo-bnsp.svg" alt="Logo BNSP RI" className="w-16 h-auto object-contain" />
            <div>
              <p className="text-sm font-bold text-slate-900 uppercase tracking-widest">Terlisensi Oleh</p>
              <p className="text-xl font-black text-slate-700">BNSP RI</p>
            </div>
          </div>

          <div className="hidden md:block w-px h-12 bg-slate-300"></div>

          <div className="flex items-center gap-4">
            <img src="/logo-um.svg" alt="Logo FMIPA UM" className="w-16 h-auto object-contain" />
            <div>
              <p className="text-sm font-bold text-slate-900 uppercase tracking-widest">Mitra Strategis</p>
              <p className="text-xl font-black text-slate-700">FMIPA UM</p>
            </div>
          </div>

          <div className="hidden md:block w-px h-12 bg-slate-300"></div>

          <div className="flex items-center gap-4">
            <img src="/logo-tuk.svg" alt="Logo TUK FMIPA UM" className="w-16 h-auto object-contain" />
            <div>
              <p className="text-sm font-bold text-slate-900 uppercase tracking-widest">Tempat Uji Kompetensi</p>
              <p className="text-xl font-black text-slate-700">TUK FMIPA UM</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Programs (Now acts as the old Hero/Call to Action for Careers) */}
      <section id="program" className="bg-slate-50 py-24 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-4xl mx-auto mb-20">
            <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
              Akselerasi Karir Anda Bersama <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">DIL</span>
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed font-light">
              Eksplorasi program sertifikasi berstandar industri kami. Tingkatkan kompetensi dan jadilah profesional unggul di bidang Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {programs.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-500">Belum ada program yang ditambahkan.</p>
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
                    <p className="text-slate-600 text-sm mb-8 line-clamp-3 leading-relaxed flex-1">{program.description || 'Tidak ada deskripsi'}</p>

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

          <div className="mt-16 text-center">
            <Link href="/program" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-slate-900 rounded-full shadow-lg hover:bg-primary-600 hover:scale-105 transition-all">
              Lihat Seluruh Program Kami <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Kenapa Memilih DIL Section */}
      <section className="bg-slate-950 py-24 lg:py-32 relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-900/20 blur-[150px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6">
                <Star className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold tracking-wider uppercase">Keunggulan Kami</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">Kualitas Akademis & <span className="text-primary-400">Praktek Industri</span></h2>
              <p className="text-lg text-slate-400 mb-10 leading-relaxed">
                Berkat kolaborasi erat dengan FMIPA UM dan kepatuhan pada standar BNSP, kami menghadirkan kurikulum yang seimbang antara teori akademis kuat dan implementasi langsung di industri nyata.
              </p>

              <div className="space-y-6">
                {[
                  { title: 'Diakui Secara Nasional', desc: 'Sertifikat kompetensi dikeluarkan resmi oleh BNSP yang dapat diverifikasi keabsahannya.' },
                  { title: 'Didukung Institusi Pendidikan', desc: 'Sinergi materi dengan standar akademis FMIPA Universitas Negeri Malang menjamin kualitas metodologi pengajaran.' },
                  { title: 'Instruktur Tersertifikasi Asesor', desc: 'Diajar langsung oleh praktisi yang juga berstatus sebagai Asesor Kompetensi resmi.' }
                ].map((feature, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/5">
                      <CheckCircle2 className="w-6 h-6 text-primary-400" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative bg-white/5 flex items-center justify-center p-8">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent z-10" />
                <img src="/um.svg" alt="CRD UM" className="w-full h-full object-contain relative z-20 drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="bg-slate-50 py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Insight & Berita Terbaru</h2>
            <p className="text-lg text-slate-600">Ikuti perkembangan terbaru mengenai program sertifikasi, jadwal kelas dari FMIPA UM, dan informasi BNSP lainnya.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-500">Belum ada artikel yang dipublikasikan.</p>
              </div>
            ) : (
              articles.map((article: any) => (
                <Link href={`/artikel/${article.slug}`} key={article.id} className="group cursor-pointer bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all p-4 block flex flex-col">
                  <div className="aspect-[16/10] rounded-xl overflow-hidden mb-5 bg-slate-200 flex items-center justify-center">
                    {article.media ? (
                      <img src={article.media.url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <BookOpen className="w-12 h-12 text-slate-400" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-primary-600 mb-3 uppercase tracking-wider px-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(article.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2 px-2 flex-1">
                    {article.title}
                  </h3>
                </Link>
              ))
            )}
          </div>

          <div className="mt-12 text-center">
            <Link href="/artikel" className="inline-flex items-center justify-center px-8 py-3 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors">
              Baca Artikel Lainnya
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
