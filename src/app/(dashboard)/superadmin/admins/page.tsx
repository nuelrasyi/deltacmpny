import React from 'react';
import { Users, UserPlus, ShieldAlert, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { getAdmins } from '@/actions/auth';
import { deleteAdminUser } from './actions';

export default async function AdminsPage() {
  const admins = await getAdmins();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Kelola Admin</h1>
          <p className="text-sm text-slate-500 mt-1">Daftar akun administrator yang memiliki akses ke dasbor DIL.</p>
        </div>
        <Link href="/superadmin/admins/new" className="inline-flex items-center justify-center px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-sm">
          <UserPlus className="w-4 h-4 mr-2" />
          Daftarkan Admin Baru
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {admins.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">Belum ada Admin terdaftar</h3>
            <p className="text-sm text-slate-500 max-w-sm mb-6">Mulai tambahkan rekan tim Anda yang akan bertugas mengelola program dan artikel.</p>
            <Link href="/superadmin/admins/new" className="inline-flex items-center px-4 py-2 bg-primary-50 text-primary-600 text-sm font-medium rounded-lg hover:bg-primary-100 transition-colors">
              Daftarkan Admin Pertama
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama Admin</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Akun</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tanggal Didaftarkan</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs mr-3">
                          {admin.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-slate-900">{admin.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {admin.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                        admin.role === 'superadmin' 
                          ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {admin.role === 'superadmin' ? <ShieldAlert className="w-3 h-3 mr-1" /> : <CheckCircle className="w-3 h-3 mr-1" />}
                        {admin.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 flex items-center">
                      <Clock className="w-4 h-4 mr-1.5 text-slate-400" />
                      {new Date(admin.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <form action={async () => {
                        'use server';
                        await deleteAdminUser(admin.id);
                      }}>
                        <button type="submit" className="text-slate-400 hover:text-red-600 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                          Cabut Akses
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
