'use client';

import React, { useState, useEffect } from 'react';
import { Target, Compass, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function VisiMisiSlider() {
  const [activeSlide, setActiveSlide] = useState(0); // 0 = Visi, 1 = Misi

  // Auto-slide every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev === 0 ? 1 : 0));
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative max-w-5xl mx-auto">
      
      {/* Slider Container */}
      <div className="relative min-h-[500px] md:min-h-[450px] w-full overflow-hidden">
        
        {/* Visi Slide */}
        <div 
          className={`absolute top-0 left-0 w-full h-full transition-all duration-1000 ease-in-out ${
            activeSlide === 0 
              ? 'opacity-100 translate-x-0 scale-100 z-10 pointer-events-auto' 
              : 'opacity-0 -translate-x-[10%] scale-95 z-0 pointer-events-none'
          }`}
        >
          <div className="bg-white rounded-[2.5rem] p-10 md:p-14 shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center justify-center text-center group h-full">
            <h3 className="text-4xl font-black font-heading text-slate-900 mb-6 uppercase tracking-wider">Visi Kami</h3>
            <p className="text-slate-600 leading-relaxed text-xl md:text-2xl font-medium">
              Menjadi Tempat Uji Kompetensi yang <strong className="text-primary-600 font-bold">unggul dan terpercaya</strong> dalam menghasilkan lulusan yang profesional, kompeten, dan berdaya saing tinggi di bidang Kimia, Fisika, Biologi, Kesehatan dan Keselamatan Kerja (K3), serta manajerial laboratorium.
            </p>
          </div>
        </div>

        {/* Misi Slide (Dark Theme) */}
        <div 
          className={`absolute top-0 left-0 w-full h-full transition-all duration-1000 ease-in-out ${
            activeSlide === 1 
              ? 'opacity-100 translate-x-0 scale-100 z-10 pointer-events-auto' 
              : 'opacity-0 translate-x-[10%] scale-95 z-0 pointer-events-none'
          }`}
        >
          <div className="bg-slate-950 rounded-[2.5rem] p-10 md:p-14 shadow-2xl shadow-slate-900/50 border border-slate-800 flex flex-col group relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-900/30 blur-[80px] rounded-full pointer-events-none"></div>
            
            <div className="text-center mb-10 relative z-10">
              <h3 className="text-4xl font-black font-heading text-white uppercase tracking-wider">Misi Kami</h3>
              <p className="text-slate-400 font-medium">Langkah Strategis DIL</p>
            </div>

            <ul className="space-y-6 relative z-10 flex-1 flex flex-col justify-center px-4 md:px-8">
              <li className="flex items-start gap-4">
                <CheckCircle2 className="w-7 h-7 text-blue-400 shrink-0 mt-1" />
                <p className="text-slate-300 leading-relaxed text-xl">
                  Menyediakan <strong className="text-white font-medium">Pusat Pembelajaran & Sertifikasi Kompetensi</strong>, Produk Berkualitas Tinggi, Teknologi & Layanan Nilai Tambah Melalui Karyawan Yang Sigap & Kompeten.
                </p>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle2 className="w-7 h-7 text-blue-400 shrink-0 mt-1" />
                <p className="text-slate-300 leading-relaxed text-xl">
                  <strong className="text-white font-medium">Menjamin mutu</strong> pelaksanaan uji kompetensi melalui pelatihan dan pembinaan asesor yang profesional dan berintegritas.
                </p>
              </li>
            </ul>
          </div>
        </div>

      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-6 mt-12">
        <button 
          onClick={() => setActiveSlide(0)} 
          className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
            activeSlide === 0 
              ? 'bg-primary-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-110' 
              : 'bg-white text-slate-400 hover:bg-slate-50 hover:text-primary-600 border border-slate-200'
          }`}
          aria-label="Tampilkan Visi"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Dots */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveSlide(0)}
            className={`transition-all duration-500 rounded-full ${activeSlide === 0 ? 'w-8 h-2.5 bg-primary-600' : 'w-2.5 h-2.5 bg-slate-300 hover:bg-primary-400'}`}
            aria-label="Slide Visi"
          />
          <button 
            onClick={() => setActiveSlide(1)}
            className={`transition-all duration-500 rounded-full ${activeSlide === 1 ? 'w-8 h-2.5 bg-slate-900' : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-600'}`}
            aria-label="Slide Misi"
          />
        </div>

        <button 
          onClick={() => setActiveSlide(1)} 
          className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
            activeSlide === 1 
              ? 'bg-slate-900 text-white shadow-[0_0_20px_rgba(15,23,42,0.4)] scale-110' 
              : 'bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-900 border border-slate-200'
          }`}
          aria-label="Tampilkan Misi"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
