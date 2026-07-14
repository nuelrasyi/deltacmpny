import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Users, CheckCircle, MessageCircle, BookOpen } from 'lucide-react';
import { BrandIcon } from '@/components/ui/BrandIcon';
import { createClient } from '@/utils/supabase/server';
import { getBatchesByProgramId } from '@/app/(dashboard)/superadmin/batches/actions';

export default async function ProgramDetailPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();

  const { data: program } = await supabase
    .from('programs')
    .select(`
      *,
      category:categories(name),
      media:media_assets(url)
    `)
    .eq('slug', params.slug)
    .single();

  if (!program) {
    notFound();
  }

  // Fetch real batches for this program
  const batches = await getBatchesByProgramId(program.id);

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
            <div className="text-lg text-slate-600 leading-relaxed whitespace-pre-wrap">
              {program.description}
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
                      <h3 className="text-xl font-bold text-slate-800">{batch.batch_number}</h3>
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                        batch.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700' :
                        batch.status === 'Selesai' ? 'bg-slate-200 text-slate-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {batch.status}
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
                      href={`https://wa.me/6281234567890?text=${encodeURIComponent(`Halo, saya tertarik untuk mendaftar program ${program.title} untuk ${batch.batch_number}. Mohon informasi selengkapnya.`)}`}
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

      </div>
    </div>
  );
}
