'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, CheckCircle2, Save, FileText, Heart, Coffee, Move, Wind } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';

export default function NurseNonMedicalChecklistPage() {
  const [tasks, setTasks] = useState({
    adl: false,
    emotional: false,
    physical: false
  });

  return (
    <div className="bg-[#FBF9F6] min-h-screen font-sans text-slate-800 pb-28">
      
      {/* Header */}
      <header className="px-6 py-6 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/nurse/dashboard" className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-500 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-serif text-xl font-bold text-[#1B4332]">Checklist Non-Medis</h1>
            <p className="text-xs text-slate-500 font-bold mt-0.5">Sesi Sedang Berjalan <span className="text-[#37A47C]">●</span></p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        
        {/* Patient Profile Summary */}
        <div className="bg-[#1B4332] rounded-[2rem] p-6 text-white relative overflow-hidden shadow-lg shadow-[#1B4332]/20">
           <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#37A47C] rounded-full blur-2xl opacity-50"></div>
           
           <div className="flex items-center gap-4 relative z-10">
             <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10 shrink-0">
               <User size={32} />
             </div>
             <div>
               <h2 className="font-bold text-xl mb-1 text-white">Opa Sastro</h2>
               <div className="flex flex-wrap gap-2 text-xs font-medium text-emerald-100">
                 <span className="bg-black/20 px-2.5 py-1 rounded-md">75 Thn</span>
                 <span className="bg-black/20 px-2.5 py-1 rounded-md">Purna Tugas</span>
                 <span className="bg-blue-500/20 text-blue-100 border border-blue-500/30 px-2.5 py-1 rounded-md">Pendampingan</span>
               </div>
             </div>
           </div>
        </div>

        {/* Non-Medical Tasks */}
        <div>
          <h3 className="font-bold text-sm text-[#37A47C] uppercase tracking-wider mb-4 px-1 flex items-center gap-2">
            <FileText size={16} /> Aktivitas Pendampingan
          </h3>

          <div className="space-y-4">
            
            {/* ADL Check */}
            <div className={`p-5 rounded-3xl border transition-all ${tasks.adl ? 'bg-[#E2F1EC] border-[#37A47C]' : 'bg-white border-slate-100 shadow-sm'}`}>
              <div className="flex justify-between items-start mb-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={tasks.adl} 
                    onChange={(e) => setTasks({...tasks, adl: e.target.checked})}
                    className="w-6 h-6 accent-[#37A47C] rounded" 
                  />
                  <span className={`font-bold text-lg ${tasks.adl ? 'text-[#1B4332]' : 'text-slate-700'}`}>Activity Daily Living (ADL)</span>
                </label>
                <div className="bg-[#E2F1EC] text-[#37A47C] text-[10px] px-2 py-1 rounded-lg font-black tracking-wider">Rp 50.000</div>
              </div>
              <p className="text-xs text-slate-500 ml-9 leading-relaxed">
                Membantu makan, mandi, berpakaian, dan mobilisasi ringan di dalam rumah.
              </p>
            </div>

            {/* Emotional Support Check */}
            <div className={`p-5 rounded-3xl border transition-all ${tasks.emotional ? 'bg-[#E2F1EC] border-[#37A47C]' : 'bg-white border-slate-100 shadow-sm'}`}>
              <div className="flex justify-between items-start mb-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={tasks.emotional} 
                    onChange={(e) => setTasks({...tasks, emotional: e.target.checked})}
                    className="w-6 h-6 accent-[#37A47C] rounded" 
                  />
                  <span className={`font-bold text-lg ${tasks.emotional ? 'text-[#1B4332]' : 'text-slate-700'}`}>Emotional Support & Active</span>
                </label>
                <div className="flex flex-col items-end gap-1">
                  <div className="bg-[#E2F1EC] text-[#37A47C] text-[10px] px-2 py-1 rounded-lg font-black tracking-wider">Rp 100.000</div>
                  <Heart size={18} className="text-pink-400" />
                </div>
              </div>
              <p className="text-xs text-slate-500 ml-9 leading-relaxed">
                Menemani mengobrol, mendengarkan cerita, dan menemani minum teh untuk mengurangi depresi.
              </p>
            </div>

            {/* Light Physical Activity Check */}
            <div className={`p-5 rounded-3xl border transition-all ${tasks.physical ? 'bg-[#E2F1EC] border-[#37A47C]' : 'bg-white border-slate-100 shadow-sm'}`}>
              <div className="flex justify-between items-start mb-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={tasks.physical} 
                    onChange={(e) => setTasks({...tasks, physical: e.target.checked})}
                    className="w-6 h-6 accent-[#37A47C] rounded" 
                  />
                  <span className={`font-bold text-lg ${tasks.physical ? 'text-[#1B4332]' : 'text-slate-700'}`}>Light Physical Activity</span>
                </label>
                <div className="flex flex-col items-end gap-1">
                  <div className="bg-[#E2F1EC] text-[#37A47C] text-[10px] px-2 py-1 rounded-lg font-black tracking-wider">Rp 150.000</div>
                  <Move size={18} className="text-blue-400" />
                </div>
              </div>
              <p className="text-xs text-slate-500 ml-9 leading-relaxed">
                Membantu jalan pagi, senam lansia, dan stretching ringan untuk menjaga kebugaran.
              </p>
            </div>

          </div>
        </div>

        {/* General Notes */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
          <label className="block text-sm font-bold text-[#1B4332] mb-3">Catatan Kegiatan & Mood Opa</label>
          <Textarea 
            placeholder="Ketik catatan aktivitas yang dilakukan, mood pasien hari ini, atau hal penting lainnya..."
            rows={4}
            className="text-sm border-slate-200"
          />
        </div>

      </div>

      {/* Sticky Bottom Completer */}
      <div className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 p-4 pb-safe z-50">
         <div className="max-w-3xl mx-auto">
            <Button 
               onClick={() => window.location.href='/nurse/dashboard'}
               className={`w-full h-14 justify-center text-lg rounded-2xl shadow-lg transition-all
                  ${(tasks.adl || tasks.emotional || tasks.physical) 
                    ? 'bg-[#37A47C] hover:bg-[#1B4332] shadow-[#37A47C]/20 text-white' 
                    : 'bg-slate-200 text-slate-400 shadow-none pointer-events-none'}`}
            >
               Selesaikan Sesi Pendampingan
            </Button>
            <p className="text-center text-[10px] text-slate-400 font-medium mt-3">
              Laporan harian terkirim ke keluarga
            </p>
         </div>
      </div>

    </div>
  );
}
