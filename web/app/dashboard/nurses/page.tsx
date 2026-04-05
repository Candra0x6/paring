'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Star, SlidersHorizontal, Activity, FileText, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function NurseSearchPage() {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [showChatNudge, setShowChatNudge] = useState(true);

  // Hardcoded nurses
  const nurses = [
    {
      id: 1,
      name: 'Ners Rina Suryani',
      rating: 4.9,
      specialty: 'Spesialis Penyakit Dalam',
      services: ['Visit Care', 'Live-Out Care'],
      location: 'Solo',
      isRecommendation: true,
      sessions: '124'
    },
    {
      id: 2,
      name: 'Ners Budiawan',
      rating: 4.8,
      specialty: 'Perawatan Geriatri',
      services: ['Live-In Care'],
      location: 'Jakarta Selatan',
      isRecommendation: false,
      sessions: '120+'
    },
    {
      id: 3,
      name: 'Ners Siti Aisyah',
      rating: 5.0,
      specialty: 'Perawatan Pasca Stroke',
      services: ['Visit Care', 'Live-Out Care'],
      location: 'Jakarta Timur',
      isRecommendation: false,
      sessions: '80+'
    },
    {
      id: 4,
      name: 'Siti Aminah',
      rating: 4.7,
      specialty: 'Pendamping Lansia (Non-medis)',
      services: ['Non-medis'],
      location: 'Solo',
      isRecommendation: false,
      sessions: '45+'
    },
    {
      id: 5,
      name: 'Bambang Heru',
      rating: 4.8,
      specialty: 'Pendamping & Teman Ngobrol',
      services: ['Non-medis'],
      location: 'Sukoharjo',
      isRecommendation: false,
      sessions: '30+'
    }
  ];

  // Filtering logic
  const filteredNurses = activeFilter === 'Semua' 
    ? nurses.filter(n => !n.isRecommendation) 
    : nurses.filter(n => !n.isRecommendation && n.services.includes(activeFilter));

  const recommendations = nurses.filter(n => n.isRecommendation);

  return (
    <div className="px-6 py-8 pb-80 md:pb-8 max-w-3xl mx-auto w-full min-h-screen flex flex-col bg-[#FBF9F6]">
      <header className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-[#1B4332]">Cari Perawat</h1>
        <p className="text-sm text-slate-500 font-light mt-1">Temukan perawat terbaik untuk keluarga Anda</p>
      </header>

      {/* Search Bar & Filters */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex-1 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Ketik spesialisasi atau nama..." 
            className="w-full h-12 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-[#37A47C] transition-colors text-slate-800 shadow-sm"
          />
        </div>
        <button className="w-12 h-12 bg-[#37A47C] text-white rounded-2xl flex items-center justify-center shadow-md shadow-[#37A47C]/20 shrink-0 hover:bg-[#1B4332] active:scale-95 transition-all">
          <SlidersHorizontal size={20} />
        </button>
      </div>

      <div className="flex overflow-x-auto pb-4 mb-4 gap-3 no-scrollbar -mx-6 px-6 [&::-webkit-scrollbar]:hidden">
        {['Semua', 'Visit Care', 'Live-Out Care', 'Live-In Care', 'Non-medis'].map((filter) => (
          <button 
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all
              ${activeFilter === filter 
                ? 'bg-[#1B4332] text-white shadow-md' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
             {filter}
          </button>
        ))}
      </div>

      {/* Recommended Section (Only show if 'Semua' is active or it matches the filter) */}
      {(activeFilter === 'Semua' && recommendations.length > 0) && (
        <div className="bg-[#E2F1EC] p-5 rounded-3xl mb-8 relative overflow-hidden border border-[#37A47C]/20">
          <div className="absolute top-0 right-0 p-3 opacity-20">
            <Activity size={80} className="text-[#37A47C]" />
          </div>
          <div className="relative z-10">
            <h2 className="text-[#1B4332] font-bold mb-1">Rekomendasi AI PARING</h2>
            <p className="text-xs text-[#37A47C] max-w-[200px] leading-relaxed mb-4">Cocok 98% dengan kondisi medis Ibu Kartini (Hipertensi).</p>
            
            {recommendations.map(r => (
               <Link key={r.id} href={`/dashboard/nurses/${r.id}`} className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm group">
                 <div className="w-16 h-16 bg-slate-200 rounded-xl overflow-hidden shrink-0 relative">
                   {/* Image Placeholder */}
                   <div className="absolute inset-0 bg-slate-300"></div>
                 </div>
                 <div className="flex-1">
                   <div className="flex justify-between items-start mb-1">
                     <h3 className="font-bold text-[#1B4332] leading-tight text-sm">{r.name}</h3>
                     <div className="flex items-center text-[#F59E0B] text-xs font-bold">
                       <Star size={12} fill="currentColor" className="mr-0.5" /> {r.rating}
                     </div>
                   </div>
                   <p className="text-xs text-[#37A47C] font-semibold mb-2">{r.specialty}</p>
                   <div className="flex items-center gap-2">
                     {r.services.map(s => (
                       <span key={s} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{s}</span>
                     ))}
                   </div>
                 </div>
               </Link>
            ))}
          </div>
        </div>
      )}

      {/* List of Nurses */}
      <div className="space-y-4">
        <h2 className="font-bold text-slate-800 text-lg mb-2">Perawat Tersedia</h2>
        
        {filteredNurses.length > 0 ? (
          filteredNurses.map((n) => (
            <Link key={n.id} href={`/dashboard/nurses/${n.id}`} className="block bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:border-[#37A47C]/40 transition-colors">
              <div className="flex gap-4">
                 <div className="w-20 h-20 bg-slate-200 rounded-2xl overflow-hidden shrink-0 relative">
                  <div className="absolute inset-0 bg-slate-300"></div>
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-[#1B4332] leading-tight text-base">{n.name}</h3>
                      <div className="flex items-center text-[#F59E0B] text-xs font-bold">
                        <Star size={12} fill="currentColor" className="mr-0.5" /> {n.rating}
                      </div>
                    </div>
                    <div className="flex items-center text-slate-500 text-xs gap-1 mb-2">
                      <MapPin size={12} /> {n.location}
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {n.services.map(s => (
                        <span key={s} className="text-[10px] bg-[#E2F1EC] text-[#37A47C] font-semibold px-2 py-1 rounded-lg">{s}</span>
                      ))}
                    </div>
                    <span className="text-[10px] font-medium text-slate-400">{n.sessions} Sesi</span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          /* Empty State */
          <div className="bg-white rounded-[2rem] p-6 border border-slate-100 flex flex-col items-center justify-center text-center py-16 h-full mt-4">
             <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
               <Search size={40} />
             </div>
             <h3 className="font-bold text-[#1B4332] text-lg mb-2">Tidak Ada Perawat Ditemukan</h3>
             <p className="text-sm text-slate-500 font-light max-w-[240px]">
               Maaf, belum ada perawat untuk layanan <strong>{activeFilter}</strong> saat ini.
             </p>
             <button onClick={() => setActiveFilter('Semua')} className="mt-6 font-bold text-sm text-[#37A47C] bg-[#E2F1EC] hover:bg-slate-200 transition-colors px-6 py-3 rounded-xl">
               Lihat Semua Perawat
             </button>
          </div>
        )}
      </div>


      {/* AI Chat Nudge */}
      <AnimatePresence>
        {showChatNudge && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-[100px] left-6 right-6 z-50"
          >
            <div className="bg-[#1B4332] text-white p-5 rounded-[2.5rem] shadow-2xl shadow-[#1B4332]/40 relative overflow-hidden border border-white/10">
              {/* Background Decoration */}
              <div className="absolute -right-4 -top-4 opacity-10 rotate-12">
                <Sparkles size={120} />
              </div>

              <button 
                onClick={() => setShowChatNudge(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-[#37A47C] rounded-xl flex items-center justify-center">
                    <Sparkles size={16} className="text-white" />
                  </div>
                  <h3 className="font-bold text-sm tracking-tight">Kesulitan mencari perawat yang sesuai?</h3>
                </div>

                <div className="flex flex-col gap-2 mb-5">
                  <button className="text-left text-xs bg-white/10 hover:bg-white/15 py-2.5 px-4 rounded-2xl border border-white/5 transition-colors">
                    “Saya perlu perawat untuk mengobati luka”
                  </button>
                  <button className="text-left text-xs bg-white/10 hover:bg-white/15 py-2.5 px-4 rounded-2xl border border-white/5 transition-colors">
                    “Perawat rutin untuk Pratama”
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <button className="flex-1 bg-[#37A47C] hover:bg-[#2d8665] text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-black/10 transition-all active:scale-95 flex items-center justify-center gap-2">
                    <Sparkles size={16} />
                    Chat dengan AI
                  </button>
                  <button 
                    onClick={() => setShowChatNudge(false)}
                    className="text-white/50 hover:text-white text-xs font-medium px-2 py-1 transition-colors"
                  >
                    Jangan tampilkan lagi
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
