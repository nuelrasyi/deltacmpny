"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, Users, FileText, Settings, Info, Network, LucideIcon } from 'lucide-react';

const IconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  BookOpen,
  Users,
  FileText,
  Settings,
  Info,
  Network,
};

interface SidebarLinkProps {
  href: string;
  iconName: string;
  children: React.ReactNode;
  exact?: boolean;
}

export default function SidebarLink({ href, iconName, children, exact = false }: SidebarLinkProps) {
  const pathname = usePathname();
  
  // Active logic
  const isActive = exact 
    ? pathname === href 
    : pathname.startsWith(href) && (pathname === href || pathname[href.length] === '/');

  const Icon = IconMap[iconName] || LayoutDashboard; // fallback

  return (
    <Link 
      href={href} 
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl group transition-all mb-1 ${
        isActive 
          ? 'bg-primary-600/10 text-primary-400' 
          : 'text-slate-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon className={`w-5 h-5 mr-3 transition-transform duration-300 ${isActive ? 'scale-110 text-primary-400' : 'group-hover:scale-110'}`} />
      {children}
    </Link>
  );
}
