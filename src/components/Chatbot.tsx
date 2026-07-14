'use client'

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, ChevronRight } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: React.ReactNode;
}

const faqs = [
  {
    id: 'q1',
    question: 'Apa itu DIL FMIPA UM dan apa dasar hukum pendiriannya?',
    answer: (
      <div className="space-y-2">
        <p>DIL FMIPA UM (Daerah Instrumen Laboratorium FMIPA Universitas Negeri Malang) adalah unit pelaksana uji kompetensi yang berfokus pada bidang laboratorium sains dan teknologi, khususnya rumpun ilmu sains, analisis instrumen, pengujian mutu bahan, dan manajerial laboratorium.</p>
        <p>DIL FMIPA UM didirikan berdasarkan SK Nomor 12.8.12/UN32.3/DL/2025 dari Dekan FMIPA UM tertanggal 12 Agustus 2025.</p>
        <p>Alamat: Jl. Semarang No.5, Malang 65145<br/>Email: tuk.fmipa@um.ac.id<br/>Website: tuk-fmipa.um.ac.id</p>
        <p>Ada yang ingin Anda ketahui lebih lanjut tentang layanan DIL?</p>
      </div>
    )
  },
  {
    id: 'q2',
    question: 'Skema kompetensi apa saja yang tersedia di DIL FMIPA UM?',
    answer: (
      <div className="space-y-2">
        <p>DIL FMIPA UM memiliki 15 skema kompetensi yang dapat diujikan, antara lain:</p>
        <ol className="list-decimal pl-4 space-y-1">
          <li>Laboran Laboratorium Kimia</li>
          <li>Teknisi Laboratorium Kimia</li>
          <li>Operator Instrumen</li>
          <li>Analis Laboratorium</li>
          <li>Penyelia Laboratorium</li>
          <li>Manajer Mutu</li>
          <li>Manajer Teknis</li>
          <li>Kepala Laboratorium / Tenaga Ahli</li>
          <li>Analisis Gravimetri & Volumetri</li>
          <li>Analisis UV-Vis</li>
          <li>Analisis Kromatografi Cair (HPLC)</li>
          <li>Analisis Kromatografi Gas</li>
          <li>Analisis Proksimat</li>
          <li>Analisis Mikrobiologi</li>
          <li>Analisis Pengambil Contoh Uji Pangan</li>
        </ol>
        <p>Skema mana yang ingin Anda ketahui lebih lanjut?</p>
      </div>
    )
  },
  {
    id: 'q3',
    question: 'Bidang apa saja yang menjadi ruang lingkup DIL FMIPA UM?',
    answer: (
      <div className="space-y-2">
        <p>DIL FMIPA UM didirikan untuk memenuhi kebutuhan tenaga profesional di bidang:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Laboratorium Kimia, Fisika, dan Biologi</li>
          <li>Industri yang memerlukan analisis instrumen</li>
          <li>Keselamatan dan Kesehatan Kerja (K3)</li>
          <li>Manajerial laboratorium</li>
          <li>Pengujian mutu bahan</li>
        </ul>
        <p>DIL FMIPA UM merupakan bagian dari upaya strategis dalam membangun sumber daya manusia yang kompeten, tersertifikasi, dan siap bersaing di bidang sains dan aplikasinya.</p>
      </div>
    )
  },
  {
    id: 'q4',
    question: 'Bagaimana cara mendaftar sebagai peserta uji kompetensi di DIL FMIPA UM?',
    answer: (
      <div className="space-y-2">
        <p>Berikut alur pendaftaran di DIL FMIPA UM:</p>
        <ol className="list-decimal pl-4 space-y-1">
          <li>Pemohon mengisi formulir pendaftaran dan melengkapi dokumen persyaratan</li>
          <li>Bagian Administrasi DIL menerima dan memverifikasi kelengkapan berkas</li>
          <li>Berkas yang memenuhi syarat diteruskan kepada LSP TELAPI</li>
          <li>LSP TELAPI menetapkan jadwal dan asesor uji kompetensi</li>
          <li>Pemohon yang dinyatakan memenuhi syarat menjadi Peserta Uji Kompetensi</li>
        </ol>
        <p>Untuk informasi pendaftaran:<br/>Email: deltalearning@dil.co.id<br/>Telp: 089514503492</p>
      </div>
    )
  },
  {
    id: 'q5',
    question: 'Apa perbedaan Pemohon Sertifikasi dan Peserta Uji Kompetensi?',
    answer: (
      <div className="space-y-2">
        <p>Keduanya memiliki pengertian yang berbeda berdasarkan Panduan Mutu DIL:</p>
        <p><strong>Pemohon Sertifikasi:</strong><br/>Orang yang telah mendaftar dan mengajukan permohonan untuk diterima mengikuti proses sertifikasi. Status ini berlaku sejak pendaftaran hingga verifikasi dokumen selesai.</p>
        <p><strong>Peserta Uji Kompetensi:</strong><br/>Pemohon yang telah memenuhi seluruh persyaratan yang ditetapkan dan berhak ikut serta dalam proses sertifikasi / asesmen kompetensi secara resmi.</p>
        <p>Singkatnya: Pemohon &rarr; (verifikasi dokumen) &rarr; Peserta Uji Kompetensi.</p>
      </div>
    )
  },
  {
    id: 'q6',
    question: 'Dokumen dan persyaratan teknis apa yang diperlukan untuk uji kompetensi?',
    answer: (
      <div className="space-y-2">
        <p>Persyaratan yang disiapkan DIL FMIPA UM untuk pelaksanaan uji kompetensi meliputi:</p>
        <p><strong>Dokumen Perangkat Kerja:</strong></p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Skema sertifikasi kompetensi yang diacu</li>
          <li>Standar kompetensi yang berlaku (SKKNI)</li>
          <li>Persyaratan teknis yang ditetapkan LSP TELAPI</li>
          <li>Prosedur LSP terkait pelaksanaan uji kompetensi</li>
        </ul>
        <p><strong>Peralatan Uji:</strong></p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Peralatan harus sesuai spesifikasi yang ditetapkan</li>
          <li>Wajib diverifikasi atau dikalibrasi secara tepat</li>
          <li>Kondisi uji mencakup: pencahayaan, suhu ruangan, kebisingan, pemisahan peserta, dan keamanan</li>
        </ul>
        <p><strong>Dokumen peserta:</strong> formulir pendaftaran, KTP, ijazah, dan portofolio pengalaman (sesuai skema yang dipilih).</p>
      </div>
    )
  },
  {
    id: 'q7',
    question: 'Bagaimana alur lengkap proses sertifikasi di DIL FMIPA UM?',
    answer: (
      <div className="space-y-2">
        <p>Alur Proses Sertifikasi DIL FMIPA UM:</p>
        <ol className="list-decimal pl-4 space-y-1">
          <li><strong>Pendaftaran</strong> — Pemohon mengisi formulir dan menyerahkan dokumen ke Bagian Administrasi DIL</li>
          <li><strong>Verifikasi Dokumen</strong> — Tim DIL memverifikasi kelengkapan dan kesesuaian persyaratan</li>
          <li><strong>Penetapan Peserta</strong> — DIL meneruskan data ke LSP TELAPI; pemohon yang lolos ditetapkan sebagai Peserta</li>
          <li><strong>Pelaksanaan Asesmen</strong> — Uji kompetensi dilaksanakan oleh Asesor Kompetensi dari LSP TELAPI di lokasi DIL</li>
          <li><strong>Keputusan Sertifikasi</strong> — LSP TELAPI mengevaluasi hasil asesmen dan membuat keputusan kelulusan</li>
          <li><strong>Penerbitan Sertifikat</strong> — Sertifikat kompetensi diterbitkan oleh BNSP melalui LSP TELAPI</li>
          <li><strong>Pemeliharaan</strong> — Pemegang sertifikat wajib mengikuti surveillance dan sertifikasi ulang sesuai jadwal</li>
        </ol>
      </div>
    )
  },
  {
    id: 'q8',
    question: 'Apa itu asesmen kompetensi dan metode apa yang digunakan?',
    answer: (
      <div className="space-y-2">
        <p>Asesmen adalah proses penilaian kepada seseorang terhadap pemenuhan persyaratan yang ditetapkan dalam skema sertifikasi.</p>
        <p>Metode pengujian yang dapat digunakan di DIL FMIPA UM antara lain:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Ujian tertulis — pemahaman teori dan regulasi</li>
          <li>Ujian lisan — wawancara dengan asesor</li>
          <li>Ujian praktik — demonstrasi keterampilan di laboratorium</li>
          <li>Pengamatan — observasi langsung di lingkungan kerja atau lab</li>
        </ul>
        <p>Asesmen dilaksanakan oleh Asesor Kompetensi berlisensi yang memiliki kualifikasi relevan dan kompeten untuk melaksanakan serta menilai ujian, dengan tetap menjaga prinsip ketidakberpihakan.</p>
      </div>
    )
  },
  {
    id: 'q9',
    question: 'Apakah ada asesor pendamping dari DIL saat uji kompetensi berlangsung?',
    answer: (
      <div className="space-y-2">
        <p>Ya. Berdasarkan Panduan Mutu DIL, Bagian Teknis DIL FMIPA UM bertugas menyiapkan asesor pendamping yang mendampingi proses uji kompetensi yang dilakukan oleh asesor dari LSP TELAPI.</p>
        <p>Fungsi asesor pendamping dari DIL:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Membantu menyiapkan sarana dan prasarana uji</li>
          <li>Memfasilitasi kelancaran proses uji kompetensi</li>
          <li>Memastikan kondisi lingkungan uji sesuai standar</li>
        </ul>
        <p>Namun keputusan penilaian kompetensi sepenuhnya berada di tangan asesor resmi dari LSP TELAPI.</p>
      </div>
    )
  },
  {
    id: 'q10',
    question: 'Bagaimana kondisi ruang uji kompetensi di DIL FMIPA UM?',
    answer: (
      <div className="space-y-2">
        <p>DIL FMIPA UM memastikan kondisi uji sesuai persyaratan teknis yang ditetapkan LSP. Standar kondisi ruang uji meliputi:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Pencahayaan yang memadai</li>
          <li>Suhu ruangan yang terkendali</li>
          <li>Tingkat kebisingan yang sesuai</li>
          <li>Pemisahan antarpeserta uji untuk menjaga integritas</li>
          <li>Keamanan peserta uji selama proses berlangsung</li>
        </ul>
        <p>Seluruh peralatan uji diverifikasi dan dikalibrasi secara berkala untuk memastikan akurasi hasil pengujian.</p>
      </div>
    )
  },
  {
    id: 'q11',
    question: 'Bagaimana sistem manajemen mutu yang diterapkan DIL FMIPA UM?',
    answer: (
      <div className="space-y-2">
        <p>DIL FMIPA UM menerapkan sistem manajemen mutu yang didokumentasikan berdasarkan Pedoman BNSP 206-2007, mencakup:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Sistem manajemen ditetapkan dan dipelihara sesuai pedoman BNSP dan LSP</li>
          <li>Sistem manajemen dipahami dan diterapkan di semua level organisasi</li>
          <li>Prosedur pemeliharaan peralatan dan penyiapan kondisi uji</li>
          <li>Pengendalian dokumen dan rekaman secara sistematis</li>
          <li>Program kerja tahunan, program mutu, dan sasaran mutu</li>
          <li>Audit internal dan kaji ulang manajemen secara berkala</li>
          <li>Uraian tugas dan tanggung jawab yang terdokumentasi untuk setiap personil</li>
          <li>Jaminan ketidakberpihakan dalam pelaksanaan uji kompetensi</li>
          <li>Jaminan keamanan materi uji kompetensi</li>
        </ul>
      </div>
    )
  },
  {
    id: 'q12',
    question: 'Apakah sertifikat dari DIL FMIPA UM diakui secara nasional?',
    answer: (
      <div className="space-y-2">
        <p>Ya, sertifikat kompetensi yang diterbitkan melalui DIL FMIPA UM diakui secara nasional karena:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>DIL FMIPA UM bermitra dengan LSP TELAPI yang berlisensi dari BNSP (Badan Nasional Sertifikasi Profesi)</li>
          <li>Sertifikat diterbitkan oleh BNSP melalui LSP TELAPI</li>
          <li>Mengacu pada SKKNI (Standar Kompetensi Kerja Nasional Indonesia)</li>
          <li>DIL FMIPA UM telah melalui proses verifikasi resmi sesuai Peraturan BNSP No. 5/BNSP/VII/2014</li>
        </ul>
        <p>Sertifikat ini diakui oleh instansi pemerintah, BUMN, swasta, dan dapat menjadi syarat dalam pengajuan akreditasi laboratorium (ISO/IEC 17025).</p>
      </div>
    )
  },
  {
    id: 'q13',
    question: 'Siapa yang melakukan penilaian/asesmen dalam uji kompetensi di DIL?',
    answer: (
      <div className="space-y-2">
        <p>Asesmen dilaksanakan oleh Asesor Kompetensi yang memenuhi kriteria berikut:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Memiliki kualifikasi yang relevan dengan skema yang diujikan</li>
          <li>Berlisensi dan ditugaskan oleh LSP TELAPI</li>
          <li>Wajib menjaga prinsip ketidakberpihakan sebagai asesor</li>
          <li>Untuk skema teknis (K3, Kepala Lab, Analis), asesor memiliki keahlian spesifik di bidang tersebut</li>
        </ul>
        <p>DIL FMIPA UM juga dapat memiliki asesor kompetensi internal sesuai ruang lingkup DIL untuk menjadi bagian dari tim asesor LSP, dengan tetap menjaga ketidakberpihakan.</p>
        <p>Hal ini memastikan objektivitas dan kredibilitas setiap hasil sertifikasi yang dikeluarkan.</p>
      </div>
    )
  },
  {
    id: 'q14',
    question: 'Apakah DIL FMIPA UM melayani uji kompetensi di bidang K3?',
    answer: (
      <div className="space-y-2">
        <p>Ya. DIL FMIPA UM secara resmi menyelenggarakan uji kompetensi di bidang Keselamatan dan Kesehatan Kerja (K3) sebagai bagian dari ruang lingkup operasionalnya.</p>
        <p>Bidang K3 yang dicakup:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Keselamatan dan Kesehatan Kerja di laboratorium</li>
          <li>K3 dalam industri Kimia, Fisika, dan Biologi</li>
          <li>Standar keselamatan instrumen dan fasilitas lab</li>
        </ul>
        <p>Sertifikasi K3 di DIL FMIPA UM mengacu pada standar kompetensi nasional (SKKNI) yang ditetapkan Kemnaker RI dan dilaksanakan di bawah pengawasan LSP TELAPI.</p>
        <p>Ingin tahu skema K3 spesifik apa yang tersedia? Saya bisa membantu mengarahkan.</p>
      </div>
    )
  },
  {
    id: 'q15',
    question: 'Siapa saja yang memimpin dan mengelola DIL FMIPA UM?',
    answer: (
      <div className="space-y-2">
        <p>Struktur Organisasi DIL FMIPA UM:</p>
        <p><strong>Penanggung Jawab:</strong> Prof. Dr. Hadi Suwono, M.Si (Dekan FMIPA UM)<br/><strong>Ketua DIL (Manajer Puncak):</strong> Prof. Surjani Wonorahardjo, Ph.D<br/><strong>Manajer Mutu:</strong> Dr. Neena Zakia, S.Si., M.Si<br/><strong>Manajer Pemasaran:</strong> Dr. Cahyo Aji Hapsoro, S.Si., M.Si<br/><strong>Bagian Administrasi:</strong> Chariztya Anggita Maharani, S.Si., M.Si</p>
        <p><strong>Manajer Teknis:</strong></p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Prof. Suharti, S.Pd., M.Si</li>
          <li>Prof. Nandang Mufti, M.T., Ph.D</li>
          <li>Dr. Sitoresmi Prabaningtyas, S.Si., M.Si</li>
          <li>Dr. Robi Kurniawan, M.Si</li>
        </ul>
      </div>
    )
  }
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial greeting message
    if (messages.length === 0) {
      setMessages([
        {
          id: 'msg-0',
          sender: 'bot',
          text: 'Halo! Saya Asisten Virtual DIL. Ada yang bisa saya bantu? Silakan pilih pertanyaan di bawah ini.'
        }
      ]);
    }
  }, [messages.length]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleQuestionClick = (faq: typeof faqs[0]) => {
    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: faq.question
    };
    
    setMessages(prev => [...prev, userMsg]);

    // Simulate bot thinking delay
    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: faq.answer
      };
      setMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  return (
    <>
      {/* Floating Button with Premium Glow & Animations */}
      <div className={`fixed bottom-6 right-6 z-50 flex items-center justify-center transition-all duration-300 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-primary-600 to-blue-500 text-white rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:-translate-y-1 hover:scale-105 transition-all duration-300 group z-10"
          aria-label="Buka Chatbot FAQ"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
        {/* Breathing glow effect underneath */}
        <div className="absolute inset-0 bg-primary-500 rounded-full blur-md opacity-40 animate-ping" style={{ animationDuration: '3s' }}></div>
      </div>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 z-50 w-[90vw] md:w-[380px] max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 pointer-events-none translate-y-10'}`}
        style={{ maxHeight: '80vh', height: '600px' }}
      >
        {/* Header */}
        <div className="bg-primary-600 p-4 flex items-center justify-between shadow-md relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-white font-bold font-heading text-lg leading-tight">Asisten DIL</h3>
              <p className="text-primary-100 text-xs">Pusat Bantuan Cepat</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-primary-600 text-white rounded-tr-sm' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies Area */}
        <div className="p-4 bg-white border-t border-slate-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Pilih Pertanyaan:</p>
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[160px] pr-1 custom-scrollbar">
            {faqs.map((faq) => (
              <button
                key={faq.id}
                onClick={() => handleQuestionClick(faq)}
                className="text-left w-full p-2.5 rounded-xl bg-slate-50 hover:bg-primary-50 text-sm text-slate-700 hover:text-primary-700 border border-slate-200 hover:border-primary-200 transition-colors flex items-center justify-between group"
              >
                <span className="line-clamp-2 pr-2 leading-tight">{faq.question}</span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary-500 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Custom Scrollbar Styles for the quick replies */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: #94a3b8;
        }
      `}} />
    </>
  );
}
