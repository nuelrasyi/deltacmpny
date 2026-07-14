'use client'

import React, { useState } from 'react'
import { Send, X, MessageCircle } from 'lucide-react'

interface FloatingWhatsAppProps {
  phoneNumber?: string;
}

export default function FloatingWhatsApp({ phoneNumber = '6281234567890' }: FloatingWhatsAppProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  // Pastikan nomor hanya berisi angka
  const cleanNumber = phoneNumber.replace(/\D/g, '');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    
    // Opsional: Tutup widget setelah mengirim
    // setIsOpen(false);
    setMessage('');
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 right-6 md:right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition-all duration-300 group ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        aria-label="Hubungi via WhatsApp"
      >
        <svg
          className="w-8 h-8"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.061-.177-.296-.019-.456.13-.605.133-.133.296-.347.444-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
        <div className="absolute right-16 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          WhatsApp Kami
          <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
        </div>
      </button>

      {/* Chat Widget */}
      <div 
        className={`fixed bottom-24 right-6 z-50 w-[90vw] md:w-[360px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 pointer-events-none translate-y-10'}`}
        style={{ height: '450px' }}
      >
        {/* Header */}
        <div className="bg-[#075E54] p-4 flex items-center justify-between shadow-md relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 overflow-hidden relative">
              <svg className="w-6 h-6 text-[#128C7E]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.061-.177-.296-.019-.456.13-.605.133-.133.296-.347.444-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-base leading-tight">Admin DIL</h3>
              <p className="text-white/80 text-xs">Biasanya membalas dalam beberapa jam</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Area */}
        <div 
          className="flex-1 p-4 overflow-y-auto bg-[#E5DDD5]"
          style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: 'contain', opacity: 0.9 }}
        >
          {/* Welcome Message */}
          <div className="flex justify-start mb-4">
            <div className="bg-white text-[#303030] text-sm rounded-lg rounded-tl-none py-2 px-3 max-w-[85%] shadow-sm relative">
              <p>Halo! 👋</p>
              <p className="mt-1">Ada yang bisa kami bantu seputar pendaftaran uji kompetensi atau layanan DIL?</p>
              <span className="text-[10px] text-slate-400 absolute bottom-1 right-2 inline-block">12:00</span>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-3 bg-[#F0F0F0] flex items-end gap-2 z-10 relative">
          <form onSubmit={handleSend} className="flex-1 flex gap-2">
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              placeholder="Ketik pesan..."
              className="w-full bg-white rounded-2xl border-none outline-none resize-none px-4 py-3 text-sm max-h-[100px] shadow-sm custom-scrollbar focus:ring-2 focus:ring-[#128C7E]/50"
              rows={1}
            />
            <button 
              type="submit"
              disabled={!message.trim()}
              className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center transition-colors ${
                message.trim() 
                  ? 'bg-[#128C7E] text-white hover:bg-[#075E54] shadow-md' 
                  : 'bg-white text-slate-400 shadow-sm'
              }`}
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

