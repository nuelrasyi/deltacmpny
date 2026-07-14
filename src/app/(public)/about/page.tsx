import React from 'react';
import { getCompanyProfile } from '@/app/(dashboard)/superadmin/actions';
import { getOrganizationMembers } from '@/app/(dashboard)/superadmin/organization/actions';
import { Building, MapPin, Mail, Phone, Target, Compass, CheckCircle2 } from 'lucide-react';
import { BrandIcon } from '@/components/ui/BrandIcon';
import VisiMisiSlider from './VisiMisiSlider';

export const metadata = {
  title: 'Tentang Kami - DIL',
};

export default async function AboutPage() {
  const profile = await getCompanyProfile();
  
  const content = profile?.about_us || profile?.description || 'Belum ada profil perusahaan yang ditambahkan.';

  const members = await getOrganizationMembers();
  
  const leader = members.find(m => m.order_index === 0) || {
    name: 'Belum Diatur',
    position: 'Ketua TUK',
    role: 'Pimpinan Utama',
    avatar_url: null,
  };

  const subordinates = members.filter(m => m.order_index > 0).sort((a, b) => a.order_index - b.order_index);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background Decorative Mesh Elements */}
      <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-primary-100/40 blur-[120px]"></div>
        <div className="absolute top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-blue-100/50 blur-[100px]"></div>
      </div>

      {/* Hero Section - Dark & Premium */}
      <section className="bg-slate-950 pt-28 pb-32 relative overflow-hidden z-10 border-b border-white/10">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/20 to-transparent pointer-events-none"></div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary-500/20 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-black font-heading text-white tracking-tight mb-6 leading-tight">
            Mengenal <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-blue-300">DIL Lebih Dekat</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-300 font-light max-w-3xl mx-auto leading-relaxed">
            Menjadi pelopor standardisasi dan sertifikasi kompetensi profesional berstandar nasional dan global.
          </p>
        </div>
      </section>

      {/* Main Content Areas */}
      <div className="relative z-20">
        
        {/* Intro / Profile Text (Glassmorphism & Hardcoded) */}
        <section className="-mt-16 mb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/90 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-white p-8 md:p-14 lg:p-16 transition-all duration-500 hover:shadow-[0_20px_60px_rgb(0,0,0,0.08)] relative overflow-hidden">
              
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50/50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
                <div className="lg:col-span-5">
                  <h2 className="text-4xl md:text-5xl font-black font-heading text-slate-900 leading-tight mb-6">
                    Membangun Kompetensi <span className="text-primary-600">Profesional Berstandar Global</span>
                  </h2>
                  <div className="w-20 h-1.5 bg-primary-600 rounded-full"></div>
                </div>
                
                <div className="lg:col-span-7 space-y-6">
                  <p className="text-xl md:text-2xl text-slate-700 font-light leading-relaxed">
                    <strong className="font-bold text-slate-900">PT Delta Integrated Learning (DIL)</strong> adalah lembaga pelatihan dan sertifikasi profesional yang berfokus pada bidang Keselamatan dan Kesehatan Kerja (K3), manajerial laboratorium, serta analisis instrumen sains.
                  </p>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Sebagai mitra strategis FMIPA Universitas Negeri Malang dan Tempat Uji Kompetensi yang terverifikasi resmi oleh BNSP RI, kami hadir untuk mencetak sumber daya manusia yang aman, kompeten, dan siap menghadapi tantangan dunia kerja modern melalui layanan standardisasi yang profesional dan tepercaya.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Visi & Misi */}
        <section className="py-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-black font-heading text-slate-900 mb-6 tracking-tight">
                Visi & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">Misi</span>
              </h2>
              <div className="w-24 h-2 bg-gradient-to-r from-primary-600 to-blue-600 rounded-full mx-auto shadow-lg shadow-primary-500/30"></div>
            </div>

            <VisiMisiSlider />
          </div>
        </section>

        {/* Struktur Organisasi */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-black font-heading text-slate-900 mb-6 tracking-tight">
                Manajemen & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">Struktur</span>
              </h2>
              <div className="w-24 h-2 bg-gradient-to-r from-primary-600 to-blue-600 rounded-full mx-auto shadow-lg shadow-primary-500/30 mb-8"></div>
              <p className="text-slate-500 max-w-2xl mx-auto text-lg md:text-xl">
                Didukung oleh para praktisi akademis dan pakar industri yang berdedikasi tinggi untuk menjaga kualitas uji kompetensi.
              </p>
            </div>

            <div className="flex flex-col items-center">
              
              {/* Leader Node */}
              <div className="flex flex-col items-center z-10">
                <div className="w-24 h-24 mb-4 rounded-full bg-primary-50 border-4 border-white shadow-xl shadow-primary-200 flex items-center justify-center overflow-hidden">
                  {leader.avatar_url ? (
                    <img src={leader.avatar_url} alt={leader.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-4xl font-black font-heading text-primary-300">
                      {leader.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="inline-block px-4 py-1.5 rounded-full bg-primary-600 text-white text-xs font-bold tracking-widest uppercase mb-3 shadow-md shadow-primary-500/30">
                  {leader.role}
                </div>
                <h4 className="text-2xl font-black font-heading text-slate-900 mb-1">{leader.position}</h4>
                <p className="text-slate-600 font-medium">{leader.name}</p>
              </div>

              {/* Vertical line from Leader to Horizontal axis */}
              <div className="w-px h-10 bg-slate-300"></div>

              {/* Horizontal axis and Subordinates */}
              <div className="w-full flex justify-center relative mt-0 px-4">
                <div className="flex w-full max-w-6xl justify-between">
                  {subordinates.map((member, index) => (
                    <div key={index} className="relative flex flex-col items-center flex-1 px-2">
                      
                      {/* Horizontal connecting lines */}
                      {index !== 0 && (
                        <div className="absolute top-0 right-1/2 w-1/2 border-t-2 border-slate-300"></div>
                      )}
                      {index !== subordinates.length - 1 && (
                        <div className="absolute top-0 left-1/2 w-1/2 border-t-2 border-slate-300"></div>
                      )}

                      {/* Vertical connecting line down to the subordinate */}
                      <div className="w-px h-8 bg-slate-300"></div>

                      {/* Subordinate Node (Clean, No Card Background) */}
                      <div className="flex flex-col items-center text-center mt-4">
                        <div className="w-20 h-20 mb-4 rounded-full bg-slate-50 border-4 border-white shadow-lg shadow-slate-200 flex items-center justify-center overflow-hidden">
                          {member.avatar_url ? (
                            <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-3xl font-black font-heading text-slate-300">
                              {member.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold tracking-widest uppercase mb-2">
                          {member.role}
                        </div>
                        <h4 className="text-xl font-black font-heading text-slate-900 mb-1 leading-tight">{member.position}</h4>
                        <p className="text-slate-500 text-sm font-medium leading-snug">{member.name}</p>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Contact Info & Maps */}
        <section className="py-20 bg-white border-t border-slate-100 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                { icon: MapPin, title: 'Alamat Kantor', value: profile?.address || '-' },
                { icon: Phone, title: 'Hubungi Kami', value: profile?.whatsapp_number || '-', isLink: true, href: `https://wa.me/${(profile?.whatsapp_number || '').replace(/\D/g, '')}` },
                { icon: Mail, title: 'Email Resmi', value: profile?.email || '-', isLink: true, href: `mailto:${profile?.email}` }
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col items-center text-center hover:bg-slate-100 transition-colors">
                  <div className="w-16 h-16 bg-white shadow-sm rounded-2xl text-primary-600 flex items-center justify-center mb-6">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-black font-heading text-2xl text-slate-900 mb-3">{item.title}</h3>
                  {item.isLink ? (
                    <a href={item.href} className="text-slate-600 hover:text-primary-600 transition-colors font-medium">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-slate-600 whitespace-pre-wrap font-medium">{item.value}</p>
                  )}
                </div>
              ))}
            </div>

            {profile?.address && (
              <div>
                <div className="w-full bg-slate-50 p-3 md:p-4 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-200 group">
                  <div className="w-full h-[500px] relative rounded-[2rem] overflow-hidden bg-slate-200">
                    <iframe
                      title="Lokasi Kantor"
                      width="100%"
                      height="100%"
                      className="absolute inset-0 border-0 opacity-80 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0"
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps?q=${encodeURIComponent(profile.address)}&output=embed`}
                    ></iframe>
                    
                    {/* Animated Custom Pin Overlay */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 flex flex-col items-center justify-center pb-8 group-hover:scale-110 transition-transform duration-500">
                      <div className="animate-bounce">
                        <svg 
                          className="w-16 h-16 drop-shadow-2xl" 
                          viewBox="0 0 24 24" 
                          fill="#2563eb" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path 
                            d="M12 0C7.58 0 4 3.58 4 8c0 5.25 7 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11.5c-1.93 0-3.5-1.57-3.5-3.5S10.07 4.5 12 4.5 15.5 6.07 15.5 8 13.93 11.5 12 11.5z" 
                            fill="#2563eb"
                          />
                          <circle cx="12" cy="8" r="2.5" fill="white"/>
                        </svg>
                      </div>
                      <div className="w-10 h-2.5 bg-black/30 rounded-[100%] blur-[4px] mt-2" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
