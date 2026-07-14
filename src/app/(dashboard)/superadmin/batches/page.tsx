import React from 'react'
import { Plus, Search, Users, Calendar, Trash2, Edit3 } from 'lucide-react'
import Link from 'next/link'
import { getBatches, deleteBatch } from './actions'

export default async function BatchesPage() {
  const batches = await getBatches()

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Jadwal & Batch</h1>
          <p className="text-sm text-slate-500 mt-1">Atur jadwal pelaksanaan program dan kuota peserta.</p>
        </div>
        <Link href="/superadmin/batches/new" className="flex items-center px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-all shadow-sm hover:shadow-md hover:shadow-primary-500/20">
          <Plus className="w-4 h-4 mr-2" />
          Buat Batch Baru
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama Batch</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Program</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {batches && batches.length > 0 ? (
                batches.map((batch: any) => (
                  <tr key={batch.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-slate-900">{batch.batch_number}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600 line-clamp-1">{batch.program?.title || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-slate-500">
                        <Calendar className="w-4 h-4 mr-1.5 text-slate-400" />
                        {new Date(batch.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {batch.end_date && ` - ${new Date(batch.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${
                        batch.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        batch.status === 'Selesai' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                        'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {batch.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link href={`/superadmin/batches/${batch.id}/edit`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <form action={async () => {
                          'use server'
                          await deleteBatch(batch.id)
                        }}>
                          <button type="submit" className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                        <Users className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-sm font-medium text-slate-900">Belum ada jadwal batch</p>
                      <p className="text-sm text-slate-500 mt-1">Buat jadwal batch baru untuk memulai pendaftaran peserta.</p>
                      <Link href="/superadmin/batches/new" className="mt-4 inline-flex items-center px-4 py-2 bg-primary-50 text-primary-600 text-sm font-medium rounded-lg hover:bg-primary-100 transition-colors">
                        Buat Batch Pertama
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
