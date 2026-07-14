import { Suspense } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Network } from 'lucide-react'
import { getOrganizationMembers, deleteOrganizationMember } from './actions'

export const metadata = {
  title: 'Struktur Organisasi - DIL CMS',
}

export default async function OrganizationPage() {
  const members = await getOrganizationMembers()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Struktur Organisasi</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola anggota dan profil dalam struktur organisasi.</p>
        </div>
        <Link href="/superadmin/organization/new" className="flex items-center px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-all shadow-sm hover:shadow-md hover:shadow-primary-500/20">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Anggota
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {members.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Network className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Belum ada anggota</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-6">Mulai bangun struktur organisasi dengan menambahkan anggota pertama.</p>
            <Link href="/superadmin/organization/new" className="inline-flex items-center px-5 py-2.5 bg-primary-50 text-primary-600 font-medium rounded-xl hover:bg-primary-100 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Anggota
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-slate-500 text-xs uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th scope="col" className="px-6 py-4">Profil</th>
                  <th scope="col" className="px-6 py-4">Nama</th>
                  <th scope="col" className="px-6 py-4">Jabatan</th>
                  <th scope="col" className="px-6 py-4 text-center">Urutan</th>
                  <th scope="col" className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      {member.avatar_url ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm">
                          <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold border-2 border-primary-100">
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">{member.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-700">{member.position}</span>
                        <span className="text-xs text-slate-500">{member.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg">
                        {member.order_index}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/superadmin/organization/${member.id}/edit`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <form action={async () => {
                          'use server'
                          await deleteOrganizationMember(member.id, member.avatar_url)
                        }}>
                          <button type="submit" className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
