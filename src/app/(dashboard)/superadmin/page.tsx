import React from 'react';
import { Users, BookOpen, FileText, CheckCircle2, Clock, BarChart3 } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch real counts from Supabase
  const [
    { count: programCount },
    { count: batchCount },
    { count: articleCount },
    { data: recentArticles },
    { data: recentBatches },
  ] = await Promise.all([
    supabase.from('programs').select('*', { count: 'exact', head: true }),
    supabase.from('batches').select('*', { count: 'exact', head: true }),
    supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('articles').select('id, title, status, created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('batches').select('id, name, status, start_date, end_date, programs(name)').order('start_date', { ascending: false }).limit(4),
  ]);

  const stats = [
    { name: 'Total Program', value: programCount ?? 0, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
    { name: 'Total Batch', value: batchCount ?? 0, icon: Clock, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
    { name: 'Artikel Publik', value: articleCount ?? 0, icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  ];

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Baru saja';
    if (mins < 60) return `${mins} menit lalu`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    return `${days} hari lalu`;
  }

  function getBatchStatus(batch: any) {
    const now = new Date();
    const start = batch.start_date ? new Date(batch.start_date) : null;
    const end = batch.end_date ? new Date(batch.end_date) : null;

    if (end && now > end) return { label: 'Selesai', color: 'bg-slate-100 text-slate-600 border-slate-200' };
    if (start && now >= start && end && now <= end) return { label: 'Sedang Berjalan', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
    if (start && now < start) {
      const daysUntil = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return { label: `Mulai dalam ${daysUntil} hari`, color: 'bg-amber-100 text-amber-700 border-amber-200' };
    }
    return { label: batch.status || 'Dijadwalkan', color: 'bg-blue-100 text-blue-700 border-blue-200' };
  }

  function getBatchProgress(batch: any) {
    const now = new Date();
    const start = batch.start_date ? new Date(batch.start_date) : null;
    const end = batch.end_date ? new Date(batch.end_date) : null;
    if (!start || !end) return 0;
    if (now > end) return 100;
    if (now < start) return 0;
    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    return Math.round((elapsed / total) * 100);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ikhtisar Dasbor</h1>
        <p className="mt-1 text-sm text-slate-500">Ringkasan aktivitas dan metrik utama.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all">
            <div className={`absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full opacity-20 ${stat.bg} group-hover:scale-150 transition-transform duration-500`}></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} border ${stat.border}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Artikel Terbaru */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
            <FileText className="w-5 h-5 text-primary-500 mr-2" />
            Artikel Terbaru
          </h2>
          <div className="space-y-5">
            {recentArticles && recentArticles.length > 0 ? (
              recentArticles.map((article: any) => (
                <div key={article.id} className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className={`w-2 h-2 mt-2 rounded-full ring-4 ${article.status === 'published' ? 'bg-emerald-500 ring-emerald-50' : 'bg-amber-500 ring-amber-50'}`}></div>
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{article.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${article.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {article.status === 'published' ? 'Publik' : 'Draf'}
                      </span>
                      <span className="text-xs text-slate-400">{timeAgo(article.created_at)}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">Belum ada artikel.</p>
            )}
          </div>
        </div>

        {/* Batch Terbaru */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
            <CheckCircle2 className="w-5 h-5 text-primary-500 mr-2" />
            Batch Terbaru
          </h2>
          <div className="space-y-4">
            {recentBatches && recentBatches.length > 0 ? (
              recentBatches.map((batch: any) => {
                const status = getBatchStatus(batch);
                const progress = getBatchProgress(batch);
                const progressColor = progress === 100 ? 'bg-slate-400' : progress > 0 ? 'bg-primary-500' : 'bg-amber-500';

                return (
                  <div key={batch.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-bold text-slate-900 truncate mr-2">{batch.name}</p>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${status.color}`}>{status.label}</span>
                    </div>
                    {batch.programs?.name && (
                      <p className="text-xs text-slate-400 mb-2">{batch.programs.name}</p>
                    )}
                    <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                      <div className={`${progressColor} h-2 rounded-full transition-all duration-500`} style={{ width: `${Math.max(progress, 3)}%` }}></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1.5 text-right">{progress}%</p>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">Belum ada batch.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
