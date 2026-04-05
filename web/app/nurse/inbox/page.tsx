'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Calendar, ChevronRight, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export default function NurseInbox() {
  const [activeTab, setActiveTab] = useState('baru');

  const bookings = {
    baru: [
      {
        id: '1',
        patient: 'Ibu Kartini',
        service: 'Visit Care',
        date: '12 Ags 2026',
        time: '09:00 WIB',
        status: 'PENDING',
        paymentStatus: 'PAID'
      },
      {
        id: '2',
        patient: 'Opa Sastro',
        service: 'Non-medis',
        date: '12 Ags 2026',
        time: '14:00 WIB',
        status: 'PENDING',
        paymentStatus: 'PAID'
      }
    ],
    selesai: [
      {
        id: '2',
        patient: 'Bapak Bardi',
        service: 'Live-Out Care',
        date: '10 Ags 2026',
        time: '08:00 - 16:00',
        status: 'COMPLETED',
        paymentStatus: 'PAID'
      }
    ]
  };

  const currentBookings = bookings[activeTab as keyof typeof bookings] || [];

  return (
    <div className="px-6 py-8 pb-24 md:pb-8 max-w-3xl mx-auto w-full min-h-screen flex flex-col bg-[#FBF9F6]">
      <header className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-[#1B4332]">Inbox Booking</h1>
        <p className="text-sm text-slate-500 font-light mt-1">Kelola permintaan layanan dari pasien.</p>
      </header>

      {/* Tabs */}
      <div className="flex mb-6 bg-white rounded-full p-1 border border-slate-100 shadow-sm relative z-10">
        {['baru', 'selesai'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-sm font-bold rounded-full transition-all capitalize
              ${activeTab === tab 
                ? 'bg-[#1B4332] text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'}`}
          >
            {tab === 'baru' ? 'Permintaan Baru' : 'Riwayat'}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 space-y-4">
        {currentBookings.length > 0 ? (
          currentBookings.map((b) => (
            <Link key={b.id} href={`/nurse/appointments/${b.id}`} className="block bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 hover:border-[#37A47C]/40 hover:shadow-md transition-all group">
              <div className="flex justify-between items-center mb-4 border-b border-slate-50 pb-4">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${b.paymentStatus === 'PAID' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {b.paymentStatus === 'PAID' ? 'Pembayaran Berhasil' : 'Menunggu Bayar'}
                  </span>
                </div>
                <div className={`px-3 py-1 font-bold text-[10px] rounded-full border ${b.status === 'COMPLETED' ? 'bg-slate-100 text-slate-600' : 'bg-[#E2F1EC] text-[#37A47C]'} flex items-center gap-1`}>
                  {b.status === 'COMPLETED' && <CheckCircle2 size={10} />}
                  {b.status}
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#1B4332] text-white flex items-center justify-center shrink-0 font-serif font-bold text-xl">
                  {b.patient.charAt(4)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[#1B4332] text-lg leading-tight mb-1">{b.patient}</h3>
                  <p className="text-sm font-medium text-[#37A47C] mb-2">{b.service}</p>
                  
                  <div className="flex items-center text-xs text-slate-500 gap-3 font-medium">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} className="text-slate-400" />
                      {b.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} className="text-slate-400" />
                      {b.time}
                    </div>
                  </div>
                </div>
                <div className="self-center">
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-[#37A47C] transition-colors" />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="bg-white rounded-[2rem] p-6 border border-slate-100 flex flex-col items-center justify-center text-center py-16 mt-4">
             <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
               <Filter size={40} />
             </div>
             <h3 className="font-bold text-[#1B4332] text-lg mb-2">Belum ada booking</h3>
             <p className="text-sm text-slate-500 font-light max-w-[240px]">
               Data booking akan muncul di sini setelah pasien memilih Anda.
             </p>
          </div>
        )}
      </div>
    </div>
  );
}
