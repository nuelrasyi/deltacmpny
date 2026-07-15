import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, BookOpen, FileText, Settings, LogOut, Bell, Network, ShieldAlert } from 'lucide-react';
import RealtimeClock from '@/components/RealtimeClock';
import SidebarLink from '@/components/SidebarLink';
import { logout } from '@/actions/auth';
import { Toaster } from 'react-hot-toast';
import { getCompanyProfile } from '@/app/(dashboard)/superadmin/actions';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const superadminLinks = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Pengaturan Perusahaan', href: '/superadmin', icon: Settings },
  ];

  const profile = await getCompanyProfile();
  const logoUrl = profile?.logo?.url;

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      <Toaster position="top-right" />
      {/* Sidebar */}
      <aside className="w-72 bg-slate-950 text-slate-300 flex flex-col hidden lg:flex flex-shrink-0 shadow-xl z-20">
        <div className="h-20 flex items-center px-8 border-b border-white/10">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-8 h-8 object-contain mr-3" />
          ) : (
            <img src="/icon.svg" alt="Logo" className="w-8 h-8 object-contain mr-3" />
          )}
          <span className="text-lg font-bold tracking-widest text-white">DIL CMS</span>
        </div>
        
        <div className="px-6 py-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Menu Utama
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <SidebarLink href="/superadmin" iconName="LayoutDashboard" exact>
            Dashboard
          </SidebarLink>
          <SidebarLink href="/superadmin/programs" iconName="BookOpen">
            Program
          </SidebarLink>
          <SidebarLink href="/superadmin/batches" iconName="Users">
            Jadwal & Batch
          </SidebarLink>
          <SidebarLink href="/superadmin/articles" iconName="FileText">
            Artikel
          </SidebarLink>
          <SidebarLink href="/superadmin/organization" iconName="Network">
            Struktur Organisasi
          </SidebarLink>
          <SidebarLink href="/superadmin/settings" iconName="Settings" exact>
            Pengaturan
          </SidebarLink>
          <form action={logout} className="w-full">
            {/* Action placeholder for logout */}
            <button type="submit" className="flex items-center px-4 py-3 w-full text-sm font-medium rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all text-left group mb-1">
              <LogOut className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
              Keluar
            </button>
          </form>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Panel Administrasi</h2>
          
          <div className="flex items-center gap-6">
            <RealtimeClock />
            
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-700 leading-tight">Admin DIL</p>
                <p className="text-xs text-slate-500 font-medium">Administrator</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-tr from-primary-600 to-indigo-400 rounded-xl flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-lg transition-all">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-auto p-6 sm:p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
