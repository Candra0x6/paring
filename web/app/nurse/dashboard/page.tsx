'use client';

import { useState } from 'react';
import { Bell, Calendar, Clock, ArrowRight, Activity, CheckCircle2, TrendingUp, Wallet } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NurseDashboard() {
  const [stats] = useState({
    visits: 124,
    earnings: '4.2M',
    rating: 4.9
  });

  const upcomingVisits = [
    {
      id: '1',
      patient: 'Ibu Kartini',
      time: '09:00 - 12:00',
      type: 'Visit Care',
      address: 'Jl. Slamet Riyadi No. 123, Solo',
      status: 'PAID'
    },
    {
      id: '2',
      patient: 'Opa Sastro',
      time: '14:00 - 16:00',
      type: 'Non-medis',
      address: 'Perum Gading Solo Baru, Solo',
      status: 'PAID'
    }
  ];

  return (
    <div className="px-6 py-8 pb-24 md:pb-8 max-w-3xl mx-auto w-full">
      {/* Top Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1B4332]">Halo, Ners Rina 👋</h1>
          <p className="text-sm text-slate-500 font-light mt-1">Mitra Perawat PARING</p>
        </div>
        <div className="flex gap-3">
          <button className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center relative text-slate-600 hover:bg-slate-50 transition-colors">
            <Bell size={20} />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 bg-[#E2F1EC] text-[#37A47C] rounded-xl flex items-center justify-center mb-2">
            <CheckCircle2 size={20} />
          </div>
          <span className="text-xl font-bold text-[#1B4332] leading-tight">{stats.visits}</span>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Sesi</span>
        </div>
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 bg-[#FFF4F2] text-[#ff4d4f] rounded-xl flex items-center justify-center mb-2">
            <TrendingUp size={20} />
          </div>
          <span className="text-xl font-bold text-[#1B4332] leading-tight">{stats.rating}</span>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Rating</span>
        </div>
        <div className="bg-[#1B4332] p-4 rounded-3xl shadow-lg shadow-[#1B4332]/20 flex flex-col items-center justify-center text-center text-white">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-2 backdrop-blur-sm">
            <Wallet size={20} />
          </div>
          <span className="text-lg font-bold leading-tight">{stats.earnings}</span>
          <span className="text-[10px] text-emerald-100 font-bold uppercase tracking-wider">IDR</span>
        </div>
      </div>

      {/* Upcoming Visit Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="font-bold text-lg text-slate-800">Kunjungan Terdekat</h2>
          <Link href="/nurse/inbox" className="text-sm font-bold text-[#37A47C] hover:underline">Lihat Semua</Link>
        </div>

        {upcomingVisits.length > 0 ? (
          upcomingVisits.map((visit) => (
            <div key={visit.id} className="bg-[#37A47C] rounded-[2rem] p-1 shadow-lg shadow-[#37A47C]/20 relative overflow-hidden group hover:scale-[1.02] transition-transform mb-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl opacity-50"></div>

              <Link href={`/nurse/appointments/${visit.id}`} className="block p-5 bg-[#37A47C] rounded-[1.8rem] relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 bg-emerald-700/50 px-3 py-1.5 rounded-full border border-white/10">
                    <span className="text-white text-[10px] font-bold uppercase tracking-widest">{visit.type}</span>
                  </div>
                  <span className="text-emerald-100 text-xs font-bold flex items-center gap-1"><Clock size={12} /> {visit.time}</span>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl overflow-hidden shrink-0 relative flex items-center justify-center text-white font-bold text-xl">
                    {visit.patient.charAt(4)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-xl font-bold text-white mb-0.5">{visit.patient}</h3>
                    <p className="text-xs text-emerald-100 font-medium tracking-wide truncate max-w-[200px]">{visit.address}</p>
                  </div>
                  <div className="w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-sm">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center py-10">
            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
              <Calendar size={32} />
            </div>
            <h3 className="font-bold text-slate-700 mb-2">Belum ada kunjungan</h3>
            <p className="text-sm text-slate-500 font-light max-w-[200px]">Anda belum memiliki jadwal kunjungan dalam waktu dekat.</p>
          </div>
        )}
      </div>

      {/* Quick Actions / Performance */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/nurse/availability" className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between h-40 hover:border-[#37A47C]/30 transition-colors group">
          <div className="w-12 h-12 bg-[#E2F1EC] text-[#37A47C] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Calendar size={24} />
          </div>
          <div>
            <p className="font-bold text-lg text-[#1B4332] leading-tight">Atur<br />Jadwal</p>
          </div>
        </Link>
        <Link href="/nurse/earnings" className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between h-40 hover:border-[#37A47C]/30 transition-colors group">
          <div className="w-12 h-12 bg-[#FFF4F2] text-[#ff4d4f] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Wallet size={24} />
          </div>
          <div>
            <p className="font-bold text-lg text-[#1B4332] leading-tight">Detail<br />Penghasilan</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
