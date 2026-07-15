import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Users, CheckCircle, MessageCircle, BookOpen } from 'lucide-react';
import { BrandIcon } from '@/components/ui/BrandIcon';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getBatchesByProgramId } from '@/app/(dashboard)/superadmin/batches/actions';
import { getCompanyProfile } from '@/app/(dashboard)/superadmin/actions';

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = supabaseAdmin;

  const profile = await getCompanyProfile();
  const whatsappNumber = profile?.whatsapp_number || '6281234567890';

  const { data: program } = await supabase
    .from('programs')
    .select(`
      *,
      category:categories(name),
      media:media_assets!media_asset_id(id, url)
    `)
    .eq('slug', slug)
    .single();

  if (!program) {
    notFound();
  }

  // Fetch real batches for this program
  const batches = await getBatchesByProgramId(program.id);

  // Fetch other active programs
  const { data: otherPrograms } = await supabase
    .from('programs')
    .select(`
      *,
      category:categories(name),
      media:media_assets!media_asset_id(id, url)
    `)
    .eq('is_active', true)
    .neq('id', program.id)
    .limit(4)
    .order('created_at', { ascending: false });

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        <Link href="/program" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Daftar Program
        </Link>

        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-8">
          <div className="aspect-[21/9] w-full relative bg-slate-200 flex items-center justify-center">
            {program.media ? (
              <img src={program.media.url} alt={program.title} className="w-full h-full object-cover" />
            ) : (
              <BrandIcon icon={BookOpen} variant="navy" size="xl" className="opacity-50" />
            )}
          </div>
          <div className="p-8 md:p-12">
            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 mb-4">
              {program.category?.name || 'Umum'}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">
              {program.title}
            </h1>
            <div className="text-lg text-slate-600 leading-relaxed whitespace-pre-wrap mb-8">
              {program.description}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100 pt-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Biaya Investasi</h3>
                  <div className="flex flex-col">
                    {program.original_price && (
                      <span className="text-lg text-slate-400 line-through">
                        Rp {program.original_price.toLocaleString('id-ID')}
                      </span>
                    )}
                    <span className="text-3xl font-extrabold text-blue-600">
                      Rp {program.price ? program.price.toLocaleString('id-ID') : '0'}
                    </span>
                  </div>
                </div>
                
                {program.location && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Lokasi Pelaksanaan</h3>
                    <p className="text-slate-700 font-medium flex items-center">
                      {program.location}
                    </p>
                  </div>
                )}
              </div>

              {program.facilities && program.facilities.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Fasilitas yang Didapat</h3>
                  <ul className="space-y-3">
                    {program.facilities.map((facility: string, idx: number) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 shrink-0 mt-0.5" />
                        <span className="text-slate-700">{facility}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Jadwal / Batches */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Jadwal Terdekat</h2>
          <div className="space-y-4">
            {batches && batches.length > 0 ? (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              batches.map((batch: any) => (
                <div key={batch.id} className="flex flex-col md:flex-row items-center justify-between p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all group">
                  <div className="flex-1 w-full mb-6 md:mb-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-800">{batch.name}</h3>
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                        batch.status === 'ongoing' ? 'bg-emerald-100 text-emerald-700' :
                        batch.status === 'completed' ? 'bg-slate-200 text-slate-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {batch.status === 'ongoing' ? 'Aktif' : batch.status === 'completed' ? 'Selesai' : 'Pendaftaran'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 md:gap-6 text-sm text-slate-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                        {new Date(batch.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        {batch.end_date && ` - ${new Date(batch.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`}
                      </div>
                    </div>
                  </div>
                  
                  {/* CTA Button using WhatsApp logic */}
                  <div className="flex-shrink-0 w-full md:w-auto">
                    <a 
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Halo, saya tertarik untuk mendaftar program ${program.title} untuk ${batch.name}. Mohon informasi selengkapnya.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full md:w-auto items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-green-600 rounded-xl shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 transition-all"
                    >
                      Daftar Sekarang
                      <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 px-4 rounded-2xl border border-slate-100 bg-slate-50">
                <p className="text-slate-500">Belum ada jadwal batch yang tersedia untuk program ini.</p>
              </div>
            )}
          </div>
        </div>

        {/* Program Lainnya */}
        {otherPrograms && otherPrograms.length > 0 && (
          <div className="mt-16 border-t border-slate-200 pt-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Program Lainnya</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherPrograms.map((other: any) => (
                <Link key={other.id} href={`/program/${other.slug}`} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-primary-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                  <div className="aspect-[16/9] bg-slate-100 relative overflow-hidden flex items-center justify-center">
                    {other.media ? (
                      <img src={other.media.url} alt={other.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <BookOpen className="w-10 h-10 text-slate-300" />
                    )}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-slate-900 shadow-sm">
                        {other.category?.name || 'Umum'}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">{other.title}</h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-1">{other.description || 'Tidak ada deskripsi'}</p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                      <span className="text-sm font-bold text-blue-600">
                        {other.price ? `Rp ${other.price.toLocaleString('id-ID')}` : 'Gratis'}
                      </span>
                      <span className="text-primary-600 group-hover:translate-x-1 transition-transform">
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
