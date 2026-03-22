'use client';

import Link from 'next/link';
import { ArrowLeft, User, Calendar, Activity, Edit3, ChevronRight, CheckCircle2, Bone, Droplet } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function PatientProfileDetail() {
  return (
    <div className="bg-[#FBF9F6] min-h-screen font-sans text-slate-800 pb-20">
      
      {/* Header Profile */}
      <div className="bg-[#1B4332] pt-6 pb-20 px-6 rounded-b-[2.5rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#37A47C] rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#37A47C] rounded-full blur-2xl opacity-30"></div>
        
        <div className="relative z-10 flex items-center justify-between mb-8">
          <Link href="/dashboard/patients" className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <button className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <Edit3 size={18} />
          </button>
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-white/10 border border-white/20 rounded-3xl flex items-center justify-center text-white mb-4 shadow-lg backdrop-blur-sm overflow-hidden relative">
             <span className="font-serif text-4xl font-bold p-6">K</span>
             <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent"></div>
          </div>
          <h1 className="font-serif text-3xl font-bold text-white mb-1">Ibu Kartini</h1>
          <p className="text-emerald-100 font-medium mb-4">68 Tahun • Hipertensi</p>
          
          <div className="flex gap-4">
             <div className="bg-[#0f2e20] bg-opacity-40 backdrop-blur border border-white/10 rounded-2xl p-3 flex flex-col items-center w-20">
               <span className="text-white font-bold text-lg">55</span>
               <span className="text-emerald-200 text-[10px] uppercase font-bold tracking-widest">Kg</span>
             </div>
             <div className="bg-[#0f2e20] bg-opacity-40 backdrop-blur border border-white/10 rounded-2xl p-3 flex flex-col items-center w-20">
               <span className="text-white font-bold text-lg">158</span>
               <span className="text-emerald-200 text-[10px] uppercase font-bold tracking-widest">cm</span>
             </div>
             <div className="bg-[#0f2e20] bg-opacity-40 backdrop-blur border border-white/10 rounded-2xl p-3 flex flex-col items-center w-20">
               <span className="text-white font-bold text-lg">O</span>
               <span className="text-emerald-200 text-[10px] uppercase font-bold tracking-widest">Darah</span>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 -mt-8 relative z-20 space-y-6">
        
        {/* Quick Link to Analytics */}
        <Link href="/dashboard/patients/1/analytics" className="bg-[#E2F1EC] text-[#1B4332] rounded-2xl p-4 flex items-center justify-between shadow-sm border border-[#37A47C]/30 hover:bg-[#37A47C] hover:text-white transition-colors group">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-white/50 rounded-lg group-hover:bg-white/20">
               <Activity size={20} />
             </div>
             <div>
               <h3 className="font-bold text-sm">Lihat Analisis & Tren</h3>
               <p className="text-[10px] font-medium opacity-80">Grafik Vitals & Insight AI bulanan</p>
             </div>
          </div>
          <ChevronRight size={20} className="text-[#37A47C] group-hover:text-white" />
        </Link>

        {/* Monthly Calendar View Panel */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-[#1B4332] text-lg flex items-center gap-2">
              <Calendar size={20} className="text-[#37A47C]" />
              Kalender Perawatan
            </h2>
            <select className="bg-[#F8FAFC] text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg border-none focus:ring-0">
               <option>Agustus 2026</option>
               <option>Juli 2026</option>
            </select>
          </div>
          
          {/* Simple Dummy Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 text-center mb-4">
            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
              <div key={day} className="text-[10px] font-bold text-slate-400 uppercase">{day}</div>
            ))}
            
            {/* Blank days before 1st */}
            <div className="p-2"></div><div className="p-2"></div><div className="p-2"></div><div className="p-2"></div><div className="p-2"></div>
            
            <div className="p-2 text-sm text-slate-400">1</div>
            <div className="p-2 text-sm text-slate-400">2</div>
            <div className="p-2 text-sm text-slate-700 font-bold bg-[#E2F1EC] rounded-xl text-[#37A47C] ring-1 ring-[#37A47C]/50 relative">
               3
               <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#37A47C] rounded-full"></div>
            </div>
            {/* Some intermediate days... */}
            {[4, 5, 6, 7, 8, 9, 10, 11].map(d => (
              <div key={d} className="p-2 text-sm text-slate-700 font-medium">{d}</div>
            ))}
            <div className="p-2 text-sm text-white font-bold bg-[#1B4332] rounded-xl relative shadow-md shadow-[#1B4332]/30">
               12
               <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
            </div>
            {[13, 14, 15, 16, 17, 18, 19, 20].map(d => (
              <div key={d} className="p-2 text-sm text-slate-700 font-medium">{d}</div>
            ))}
          </div>

          <p className="text-xs text-slate-500 font-medium text-center">Terdapat 2 riwayat kunjungan di bulan ini.</p>
        </div>

        {/* History Summary (Riwayat Perawatan) */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-[#1B4332] text-lg flex items-center gap-2">
              <Activity size={20} className="text-[#37A47C]" />
              Riwayat Kunjungan
            </h2>
          </div>
          
          <div className="space-y-4 border-l-2 border-slate-100 pl-5 ml-2 relative">
             
             {/* History Item 1 */}
             <div className="relative">
               <div className="absolute -left-[29px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-[#37A47C]"></div>
               <p className="text-xs font-bold text-slate-400 mb-1">12 Agustus 2026</p>
               <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-slate-100">
                 <h4 className="font-bold text-[#1B4332] text-sm mb-1">Visit Care (Selesai)</h4>
                 <p className="text-xs text-slate-500 font-medium mb-3">Bersama Ners Rina Suryani</p>
                 
                 <div className="space-y-2 mb-3">
                   <div className="flex items-center gap-2 text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-100">
                     <CheckCircle2 size={14} className="text-[#37A47C]" />
                     <span>Cek Tekanan Darah (120/80)</span>
                   </div>
                   <div className="flex items-center gap-2 text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-100">
                     <CheckCircle2 size={14} className="text-[#37A47C]" />
                     <span>Cek Gula Darah (110 mg/dL)</span>
                   </div>
                 </div>

                 <Link href="/dashboard/sessions/1/report" className="text-xs font-bold text-[#37A47C] flex items-center gap-1 hover:text-[#1B4332] transition-colors w-max">
                   Lihat Report Analisis <ChevronRight size={14} />
                 </Link>
               </div>
             </div>

             {/* History Item 2 */}
             <div className="relative">
               <div className="absolute -left-[29px] top-1.5 w-4 h-4 rounded-full bg-slate-200 border-4 border-white"></div>
               <p className="text-xs font-bold text-slate-400 mb-1">3 Agustus 2026</p>
               <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-slate-100">
                 <h4 className="font-bold text-slate-600 text-sm mb-1">Visit Care (Selesai)</h4>
                 <p className="text-xs text-slate-500 font-medium">Bersama Ners Siti Aisyah</p>
               </div>
             </div>

          </div>
        </div>
      </div>
    </div>
  );
}
