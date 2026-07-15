import React from 'react';
import Link from 'next/link';
import { BookOpen, Calendar, ChevronRight } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export default async function ArtikelPage() {
  const supabase = supabaseAdmin;
  
  const { data: articlesData } = await supabase
    .from('articles')
    .select(`
      *,
      media:media_assets!media_asset_id(id, url)
    `)
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false });

  const articles = articlesData || [];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header/Hero Section */}
      <section className="bg-slate-950 pt-20 pb-20 relative overflow-hidden text-center px-4">
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-primary-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
            Pusat <span className="text-primary-400">Berita & Edukasi</span>
          </h1>
          <p className="text-lg text-slate-300 font-light max-w-2xl mx-auto">
            Ikuti terus perkembangan terbaru industri, jadwal sertifikasi, tips berkarir, hingga wawasan eksklusif dari instruktur ahli kami.
          </p>
        </div>
      </section>

      {/* Main Layout: Grid Articles */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Belum Ada Artikel</h3>
                <p className="text-slate-500">Saat ini belum ada artikel yang dipublikasikan.</p>
              </div>
            ) : (
              <>
                {/* Featured Post (Spans 2 columns on large screens) */}
                <Link href={`/artikel/${articles[0].slug}`} className="lg:col-span-2 group cursor-pointer bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 block">
                  <div className="aspect-[2/1] relative overflow-hidden bg-slate-200 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent z-10" />
                    {articles[0].media ? (
                      <img src={articles[0].media.url} alt={articles[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <BookOpen className="w-16 h-16 text-slate-400 z-0" />
                    )}
                    <div className="absolute bottom-8 left-8 right-8 z-20">
                      <div className="flex items-center gap-3 text-xs font-bold text-primary-400 mb-3 uppercase tracking-wider">
                        <span className="bg-primary-600/20 text-primary-300 px-3 py-1 rounded-full backdrop-blur-md border border-primary-500/30">
                          Umum
                        </span>
                        <span className="flex items-center text-slate-300">
                          <Calendar className="w-4 h-4 mr-1"/> 
                          {new Date(articles[0].published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2 leading-tight line-clamp-2">
                        {articles[0].title}
                      </h3>
                    </div>
                  </div>
                </Link>

                {/* Normal Posts */}
                {articles.slice(1).map((article: any) => (
                  <Link href={`/artikel/${article.slug}`} key={article.id} className="group cursor-pointer bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col block">
                    <div className="aspect-[16/10] relative overflow-hidden bg-slate-200 flex items-center justify-center">
                      {article.media ? (
                        <img src={article.media.url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <BookOpen className="w-12 h-12 text-slate-400" />
                      )}
                      <div className="absolute top-4 right-4 z-20">
                        <span className="bg-white/90 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                          Umum
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(article.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-primary-600 transition-colors line-clamp-3 leading-snug">
                        {article.title}
                      </h3>
                      
                      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center text-primary-600 text-sm font-bold group-hover:translate-x-1 transition-transform">
                        Baca Selengkapnya <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </Link>
                ))}
              </>
            )}
          </div>

          <div className="mt-16 text-center">
            <button className="px-8 py-3 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
              Muat Lebih Banyak
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
