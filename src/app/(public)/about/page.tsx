import React from 'react';
import { getCompanyProfile } from '@/app/(dashboard)/superadmin/actions';
import { Building, MapPin, Mail, Phone } from 'lucide-react';

export const metadata = {
  title: 'Tentang Kami - DIL',
};

export default async function AboutPage() {
  const profile = await getCompanyProfile();
  
  // Format description using simple line breaks if HTML is not fully used
  const content = profile?.about_us || profile?.description || 'Belum ada profil perusahaan.';

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 pt-20 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-900/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/30 rounded-full blur-[128px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 text-white mb-6 backdrop-blur-md border border-white/20">
            <Building className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Tentang <span className="text-primary-400">Kami</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
            Mengenal lebih dekat {profile?.name || 'PT Delta Integrated Learning'}, visi, misi, dan perjalanan kami dalam memajukan kompetensi profesional.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-slate-50 flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-12 -mt-12 relative z-20">
          {/* Cover/Logo Area (Optional if there's a big cover, but we'll keep it clean) */}
          <div className="p-8 md:p-12">
            <div 
              className="prose prose-lg prose-slate max-w-none prose-headings:text-slate-900 prose-a:text-primary-600 prose-img:rounded-xl whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>

        {/* Contact Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Alamat Kantor</h3>
            <p className="text-sm text-slate-500 whitespace-pre-wrap">{profile?.address}</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Hubungi Kami</h3>
            <p className="text-sm text-slate-500">
              <a href={`https://wa.me/${(profile?.whatsapp_number || '').replace(/\D/g, '')}`} className="hover:text-emerald-600">
                {profile?.whatsapp_number}
              </a>
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Email Resmi</h3>
            <p className="text-sm text-slate-500">
              <a href={`mailto:${profile?.email}`} className="hover:text-purple-600">
                {profile?.email}
              </a>
            </p>
          </div>
        </div>

        {/* Elegant Maps Section */}
        {profile?.address && (
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 inline-flex items-center justify-center gap-3">
                <span className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </span>
                Lokasi Kami
              </h2>
              <p className="text-slate-500 mt-2">Kunjungi kantor kami untuk konsultasi atau pendaftaran langsung.</p>
            </div>
            
            {/* Map Container with elegant padding/border instead of table header */}
            <div className="w-full bg-white p-2 md:p-3 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 group">
              <div className="w-full h-[400px] relative rounded-2xl overflow-hidden bg-slate-100">
                <iframe
                  title="Lokasi Kantor"
                  width="100%"
                  height="100%"
                  className="absolute inset-0 border-0 opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(profile.address)}&output=embed`}
                ></iframe>
                
                {/* Animated Custom Pin Overlay */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 flex flex-col items-center justify-center pb-8">
                  <div className="animate-bounce">
                    <svg 
                      className="w-14 h-14 drop-shadow-2xl" 
                      viewBox="0 0 24 24" 
                      fill="#e11d48" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        d="M12 0C7.58 0 4 3.58 4 8c0 5.25 7 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11.5c-1.93 0-3.5-1.57-3.5-3.5S10.07 4.5 12 4.5 15.5 6.07 15.5 8 13.93 11.5 12 11.5z" 
                        fill="#e11d48"
                      />
                      <circle cx="12" cy="8" r="2.5" fill="white"/>
                    </svg>
                  </div>
                  {/* Shadow at the bottom */}
                  <div className="w-8 h-2 bg-black/40 rounded-[100%] blur-[3px] mt-1" />
                </div>
              </div>
            </div>
          </div>
        )}

        </div>
      </section>
    </div>
  );
}
