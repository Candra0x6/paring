'use client';

import { useState } from 'react';
import { Bell, UserPlus, HeartPulse, FileText, Activity, AlertCircle, ArrowRight, Clock, X, PhoneCall, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardHome() {
  // State for demonstration purposes
  const [hasActiveSession, setHasActiveSession] = useState(true);
  const [activeSessionType, setActiveSessionType] = useState<'medical' | 'non-medical'>('medical');
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  return (
    <div className="px-6 py-8 pb-24 md:pb-8 max-w-3xl mx-auto w-full">
      
      {/* Emergency Modal Overlay */}
      <AnimatePresence>
        {showEmergencyModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEmergencyModal(false)}
              className="absolute inset-0 bg-red-950/90 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm relative z-10 overflow-hidden text-center shadow-2xl shadow-red-500/20"
            >
              {/* Pulsing Rings Animation */}
              <div className="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center">
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 bg-red-500 rounded-full"
                />
                <motion.div 
                  animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                  className="absolute inset-0 bg-red-400 rounded-full"
                />
                <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center text-white relative z-10 shadow-lg">
                  <PhoneCall size={32} />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-red-600 mb-2">Panggilan Darurat</h2>
              <p className="text-slate-500 font-light mb-8 leading-relaxed">
                Menghubungi Tim Medis Paring & Ambulan Terdekat...
              </p>

              <div className="space-y-3">
                <button className="w-full bg-red-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-red-200 active:scale-95 transition-transform flex items-center justify-center gap-2">
                  <Activity size={20} />
                  Kirim Lokasi GPS
                </button>
                <button 
                  onClick={() => setShowEmergencyModal(false)}
                  className="w-full bg-slate-100 text-slate-500 font-bold py-4 rounded-2xl active:scale-95 transition-transform"
                >
                  Batal
                </button>
              </div>

              <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold text-red-400 uppercase tracking-widest">
                <AlertCircle size={14} />
                Hanya untuk situasi kritis
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1B4332]">Halo, Budi 👋</h1>
          <p className="text-sm text-slate-500 font-light mt-1">Keluarga PARING</p>
        </div>
        <div className="flex gap-3">
          {/* Debug Toggle Control */}
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setHasActiveSession(!hasActiveSession)}
              className="text-[8px] font-bold uppercase tracking-widest px-2 py-1 bg-slate-200 text-slate-600 rounded-lg"
            >
              Toggle Sesi {hasActiveSession ? 'OFF' : 'ON'}
            </button>
            {hasActiveSession && (
              <button
                onClick={() => setActiveSessionType(activeSessionType === 'medical' ? 'non-medical' : 'medical')}
                className="text-[8px] font-bold uppercase tracking-widest px-2 py-1 bg-emerald-100 text-[#37A47C] rounded-lg"
              >
                {activeSessionType === 'medical' ? 'Set Non-medis' : 'Set Medis'}
              </button>
            )}
          </div>
          <button className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center relative text-slate-600 hover:bg-slate-50 transition-colors">
            <Bell size={20} />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </header>

      {/* Quick Actions (Mobile First Grid) */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <Link href="/dashboard/nurses" className="bg-[#1B4332] text-white p-5 rounded-[2rem] shadow-lg shadow-[#1B4332]/20 flex flex-col justify-between h-40 group relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#37A47C] rounded-full blur-2xl opacity-60"></div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm self-start relative z-10">
            <HeartPulse size={24} />
          </div>
          <div className="relative z-10">
            <p className="font-bold text-lg leading-tight mb-1">Cari<br />Perawat</p>
          </div>
        </Link>

        <div className="grid grid-rows-2 gap-4">
          <Link href="/dashboard/patients/new" className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 hover:border-[#37A47C]/30 transition-colors">
            <div className="w-10 h-10 bg-[#E2F1EC] text-[#37A47C] rounded-xl flex items-center justify-center shrink-0">
              <UserPlus size={20} />
            </div>
            <span className="font-bold text-sm text-[#1B4332] leading-tight">Tambah<br />Pasien</span>
          </Link>
          <Link href="/dashboard/bookings" className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 hover:border-[#37A47C]/30 transition-colors">
            <div className="w-10 h-10 bg-[#FFF4F2] text-[#ff4d4f] rounded-xl flex items-center justify-center shrink-0">
              <FileText size={20} />
            </div>
            <span className="font-bold text-sm text-[#1B4332] leading-tight">Riwayat<br />Layanan</span>
          </Link>
        </div>
      </div>

      {/* Active Session Status */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="font-bold text-lg text-slate-800">Sesi Aktif Hari Ini</h2>
        </div>

        {hasActiveSession ? (
          /* Active Session Card */
          <div className="bg-[#37A47C] rounded-[2rem] p-1 shadow-lg shadow-[#37A47C]/20 relative overflow-hidden group hover:scale-[1.02] transition-transform">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl opacity-50"></div>

            <Link href={`/dashboard/monitoring/1?type=${activeSessionType}`} className="block p-5 bg-[#37A47C] rounded-[1.8rem] relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 bg-emerald-700/50 px-3 py-1.5 rounded-full border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></div>
                  <span className="text-white text-[10px] font-bold uppercase tracking-widest">
                    {activeSessionType === 'medical' ? 'Visit Care' : 'Non-Medis'}
                  </span>
                </div>
                <span className="text-emerald-100 text-xs font-bold flex items-center gap-1">
                  <Clock size={12} /> {activeSessionType === 'medical' ? '09:00 - 12:00' : '14:00 - 16:00'}
                </span>
              </div>

              <div className="flex gap-4 items-center">
                <div className="w-14 h-14 bg-white/20 rounded-2xl overflow-hidden shrink-0 relative flex items-center justify-center text-white font-serif font-bold text-xl">
                  {activeSessionType === 'medical' ? 'K' : 'S'}
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-xl font-bold text-white mb-0.5">
                    {activeSessionType === 'medical' ? 'Ibu Kartini' : 'Opa Sastro'}
                  </h3>
                  <p className="text-sm text-emerald-100 font-medium tracking-wide">Bersama Ners Rina Suryani</p>
                </div>
                <div className="w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-sm">
                  <ArrowRight size={20} />
                </div>
              </div>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Recently Completed Session Card */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                  <CheckCircle2 size={12} className="text-[#37A47C]" />
                  <span className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">Sesi Selesai</span>
                </div>
                <span className="text-slate-400 text-xs font-bold">14:00 - 16:00 WIB</span>
              </div>

              <div className="flex gap-4 items-center mb-6">
                <div className="w-14 h-14 bg-[#1B4332] rounded-2xl flex items-center justify-center text-white shrink-0 relative font-serif font-bold text-xl">
                  S
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-xl font-bold text-[#1B4332] mb-0.5">Opa Sastro</h3>
                  <p className="text-sm text-slate-500 font-medium tracking-wide">Pendampingan Non-medis Selesai</p>
                </div>
              </div>

              <Link 
                href="/dashboard/sessions/4/report?type=non-medical" 
                className="w-full h-12 bg-[#E2F1EC] text-[#37A47C] hover:bg-[#37A47C] hover:text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-[#37A47C]/20"
              >
                <FileText size={18} />
                Lihat Laporan Sesi
              </Link>
            </div>

            {/* Empty State No Active Session */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center py-10 opacity-60">
              <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
                <Activity size={32} />
              </div>
              <h3 className="font-bold text-slate-700 mb-2">Tidak ada sesi aktif</h3>
              <p className="text-sm text-slate-500 font-light max-w-[200px]">Cari perawat terbaik untuk kebutuhan medis lansia Anda.</p>
              <button
                onClick={() => window.location.href = '/dashboard/nurses'}
                className="mt-4 text-[#37A47C] font-bold text-sm bg-[#E2F1EC] px-4 py-2 rounded-xl"
              >
                Cari Perawat
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Emergency Button Prominent Action */}
      <div className="bg-[#ff4d4f]/10 border border-[#ff4d4f]/20 rounded-[2rem] p-6 flex items-center gap-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff4d4f] rounded-full blur-3xl opacity-10"></div>
        <button 
          onClick={() => setShowEmergencyModal(true)}
          className="w-16 h-16 bg-[#ff4d4f] text-white rounded-[1.5rem] shadow-lg shadow-red-500/30 flex items-center justify-center shrink-0 animate-pulse hover:animate-none hover:scale-105 transition-transform active:scale-95"
        >
          <AlertCircle size={32} />
        </button>
        <div>
          <h3 className="font-bold text-red-600 mb-1 text-lg">Tombol Darurat</h3>
          <p className="text-xs text-red-500/80 font-medium">Tekan hanya saat krisis. Notifikasi 24/7 ke admin & ambulan.</p>
        </div>
      </div>

    </div>
  );
}
