'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function PublicNavbar({ logoUrl, companyName }: { logoUrl?: string | null, companyName?: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0 lg:w-64">
              <Link href="/" className="flex items-center gap-3 group">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="h-10 w-auto max-w-[200px] object-contain" />
                ) : (
                  <img src="/icon.svg" alt="Logo" className="h-10 w-10 object-contain group-hover:scale-105 transition-transform" />
                )}
                <div className="flex flex-col justify-center">
                  {!logoUrl && <span className="text-xl font-extrabold text-slate-900 tracking-tight block leading-none">DIL</span>}
                  <span className={`font-semibold text-slate-500 hidden sm:block leading-snug ${!logoUrl ? 'text-xs mt-1' : 'text-sm'}`}>{companyName || 'PT Delta Integrated'}</span>
                </div>
              </Link>
            </div>

            {/* Desktop Menu - Centered */}
            <nav className="hidden md:flex flex-1 justify-center space-x-6">
              <Link href="/" className="text-slate-600 hover:text-primary-600 hover:bg-primary-50 px-5 py-2.5 rounded-full text-sm font-semibold transition-all">Beranda</Link>
              <Link href="/about" className="text-slate-600 hover:text-primary-600 hover:bg-primary-50 px-5 py-2.5 rounded-full text-sm font-semibold transition-all">Tentang Kami</Link>
              <Link href="/program" className="text-slate-600 hover:text-primary-600 hover:bg-primary-50 px-5 py-2.5 rounded-full text-sm font-semibold transition-all">Program</Link>
              <Link href="/artikel" className="text-slate-600 hover:text-primary-600 hover:bg-primary-50 px-5 py-2.5 rounded-full text-sm font-semibold transition-all">Artikel</Link>
            </nav>

            {/* Empty space to balance the logo width and keep the center exact */}
            <div className="hidden md:block lg:w-64"></div>

            {/* Mobile Menu Button (Hamburger) */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-primary-600 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors"
                aria-expanded="false"
              >
                <span className="sr-only">Buka menu utama</span>
                {isOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="px-4 pt-2 pb-6 space-y-1 sm:px-6 bg-white border-b border-slate-100 shadow-inner">
            <Link 
              href="/" 
              className="block px-3 py-3 rounded-lg text-base font-semibold text-slate-700 hover:text-primary-600 hover:bg-primary-50"
              onClick={() => setIsOpen(false)}
            >
              Beranda
            </Link>
            <Link 
              href="/about" 
              className="block px-3 py-3 rounded-lg text-base font-semibold text-slate-700 hover:text-primary-600 hover:bg-primary-50"
              onClick={() => setIsOpen(false)}
            >
              Tentang Kami
            </Link>
            <Link 
              href="/program" 
              className="block px-3 py-3 rounded-lg text-base font-semibold text-slate-700 hover:text-primary-600 hover:bg-primary-50"
              onClick={() => setIsOpen(false)}
            >
              Program
            </Link>
            <Link 
              href="/artikel" 
              className="block px-3 py-3 rounded-lg text-base font-semibold text-slate-700 hover:text-primary-600 hover:bg-primary-50"
              onClick={() => setIsOpen(false)}
            >
              Artikel
            </Link>
          </div>
        </div>
      </header>
    </>
  )
}
