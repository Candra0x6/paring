'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, CheckCircle2, ChevronRight, FileText, Search, Activity } from 'lucide-react';

export default function BookingList() {
  const [activeTab, setActiveTab] = useState('aktif');

  // Hardcoded bookings for different states
  const bookings = {
    aktif: [
      {
        id: '1',
        invoice: '#BK-PAR-8092',
        status: 'Menunggu Pembayaran',
        statusColor: 'bg-[#ff4d4f]/10 text-red-600 border-[#ff4d4f]/20',
        nurse: 'Ners Rina Suryani',
        service: 'Visit Care',
        patient: 'Ibu Kartini',
        date: '12 Ags 2026, 09:00 WIB',
        hasPhoto: true
      },
      {
        id: '2',
        invoice: '#BK-PAR-8105',
        status: 'Terkonfirmasi',
        statusColor: 'bg-[#E2F1EC] text-[#37A47C] border-[#37A47C]/20',
        nurse: 'Ners Siti Aisyah',
        service: 'Live-Out Care',
        patient: 'Bapak Bardi',
        date: '15 Ags 2026, 08:00 - 16:00',
        hasPhoto: false
      }
    ],
    selesai: [
      {
        id: '3',
        invoice: '#BK-PAR-7982',
        status: 'Selesai',
        statusColor: 'bg-slate-100 text-slate-600 border-slate-200',
        nurse: 'Ners Budiawan',
        service: 'Live-In Care',
        patient: 'Ibu Kartini',
        date: '01 Ags 2026',
        hasPhoto: true
      }
    ],
    dibatalkan: []
  };

  const currentBookings = bookings[activeTab as keyof typeof bookings];

  return (
    <div className="px-6 py-8 pb-24 md:pb-8 max-w-3xl mx-auto w-full min-h-screen flex flex-col bg-[#FBF9F6]">
      <header className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-[#1B4332]">Booking Saya</h1>
        <p className="text-sm text-slate-500 font-light mt-1">Riwayat pesanan layanan homecare PARING.</p>
      </header>
      
      {/* Tabs */}
      <div className="flex mb-6 bg-white rounded-full p-1 border border-slate-100 shadow-sm relative z-10">
        {['aktif', 'selesai', 'dibatalkan'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-sm font-bold rounded-full transition-all capitalize
              ${activeTab === tab 
                ? 'bg-[#1B4332] text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Dynamic List */}
      <div className="flex-1 space-y-4">
        {currentBookings.length > 0 ? (
          currentBookings.map((b) => (
            <Link key={b.id} href={`/dashboard/bookings/${b.id}`} className="block bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 hover:border-[#37A47C]/40 hover:shadow-md transition-all group">
              <div className="flex justify-between items-center mb-4 border-b border-slate-50 pb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{b.invoice}</span>
                <div className={`px-3 py-1 font-bold text-xs rounded-full border ${b.statusColor} flex items-center gap-1`}>
                  {b.status === 'Terkonfirmasi' && <CheckCircle2 size={12} />}
                  {b.status}
                </div>
              </div>
              
              <div className="flex gap-4">
                 <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden relative ${b.hasPhoto ? 'bg-slate-200' : 'bg-[#1B4332] text-white'}`}>
                  {b.hasPhoto ? <div className="absolute inset-0 bg-slate-300"></div> : <span className="font-serif font-bold text-xl">{b.nurse.substring(5, 6)}</span>}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[#1B4332] text-lg leading-tight mb-1">{b.nurse}</h3>
                  <p className="text-sm font-medium text-[#37A47C] mb-2">{b.service} <span className="text-slate-400 font-light pl-1">({b.patient})</span></p>
                  
                  <div className="flex items-center text-xs text-slate-500 gap-1.5 font-medium">
                    <Calendar size={14} className="text-slate-400" />
                    {b.date}
                  </div>
                </div>
                <div className="self-center">
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-[#37A47C] transition-colors" />
                </div>
              </div>
            </Link>
          ))
        ) : (
          /* Empty State */
          <div className="bg-white rounded-[2rem] p-6 border border-slate-100 flex flex-col items-center justify-center text-center py-16 h-full mt-4">
             <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
               <FileText size={40} />
             </div>
             <h3 className="font-bold text-[#1B4332] text-lg mb-2">Belum ada booking {activeTab}</h3>
             <p className="text-sm text-slate-500 font-light max-w-[240px]">
               {activeTab === 'aktif' ? 'Cari perawat terbaik untuk kebutuhan medis lansia Anda hari ini.' : 'Tidak ada riwayat untuk ditampilkan pada kategori ini.'}
             </p>
             {activeTab === 'aktif' && (
               <button onClick={() => window.location.href='/dashboard/nurses'} className="mt-6 font-bold text-sm bg-[#37A47C] text-white hover:bg-[#1B4332] transition-colors px-6 py-3 rounded-xl shadow-lg shadow-[#37A47C]/20">
                 Cari Perawat
               </button>
             )}
          </div>
        )}
      </div>

    </div>
  );
}
