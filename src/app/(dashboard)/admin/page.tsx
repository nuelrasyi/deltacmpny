import React from 'react';
import { Users, BookOpen, FileText, CheckCircle2, TrendingUp, Clock } from 'lucide-react';

export default function AdminDashboardPage() {
  const stats = [
    { name: 'Total Program', value: '12', icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
    { name: 'Total Batch', value: '8', icon: Clock, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
    { name: 'Total Peserta', value: '256', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { name: 'Artikel Publik', value: '34', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ikhtisar Dasbor</h1>
        <p className="mt-1 text-sm text-slate-500">Ringkasan aktivitas dan metrik utama PT Delta Integrated Learning.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <div className="relative z-10 mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
              <span className="text-emerald-600 font-medium">+12%</span>
              <span className="text-slate-400 ml-2">dari bulan lalu</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
            <Clock className="w-5 h-5 text-primary-500 mr-2" />
            Aktivitas Terkini
          </h2>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary-500 ring-4 ring-primary-50"></div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-900">Peserta baru mendaftar di Program "Leadership Training"</p>
                  <p className="text-xs text-slate-500 mt-1">2 jam yang lalu</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
            <CheckCircle2 className="w-5 h-5 text-primary-500 mr-2" />
            Batch Berjalan (Ongoing)
          </h2>
          <div className="space-y-4">
            <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-bold text-slate-900">Batch 04 - Digital Marketing</p>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">Sedang Berjalan</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
                <div className="bg-primary-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <p className="text-xs text-slate-500 mt-2 text-right">60% Selesai</p>
            </div>
            
            <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-bold text-slate-900">Batch 02 - HR Management</p>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">Persiapan</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
              <p className="text-xs text-slate-500 mt-2 text-right">Mulai dalam 3 hari</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
