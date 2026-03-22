'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, CheckCircle2, Save, FileText, CheckCircle, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

export default function NurseChecklistPage() {
  const [tasks, setTasks] = useState({
    bp: false,
    sugar: false,
    cholesterol: false,
    wound: false
  });

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans text-slate-800 pb-28">
      
      {/* Header */}
      <header className="px-6 py-6 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-500 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-serif text-xl font-bold text-[#1B4332]">Checklist Perawatan</h1>
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
               <h2 className="font-bold text-xl mb-1 text-white">Ibu Kartini</h2>
               <div className="flex flex-wrap gap-2 text-xs font-medium text-emerald-100">
                 <span className="bg-black/20 px-2.5 py-1 rounded-md">68 Thn</span>
                 <span className="bg-black/20 px-2.5 py-1 rounded-md">55 Kg</span>
                 <span className="bg-black/20 px-2.5 py-1 rounded-md">158 cm</span>
                 <span className="bg-red-500/20 text-red-100 border border-red-500/30 px-2.5 py-1 rounded-md">Hipertensi</span>
               </div>
             </div>
           </div>
        </div>

        {/* Vital Signs / Checks */}
        <div>
          <h3 className="font-bold text-sm text-[#37A47C] uppercase tracking-wider mb-4 px-1 flex items-center gap-2">
            <FileText size={16} /> Tugas Pemeriksaan
          </h3>

          <div className="space-y-4">
            
            {/* Blood Pressure Check */}
            <div className={`p-5 rounded-3xl border transition-all ${tasks.bp ? 'bg-[#E2F1EC] border-[#37A47C]' : 'bg-white border-slate-100 shadow-sm'}`}>
              <div className="flex justify-between items-center mb-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={tasks.bp} 
                    onChange={(e) => setTasks({...tasks, bp: e.target.checked})}
                    className="w-6 h-6 accent-[#37A47C] rounded" 
                  />
                  <span className={`font-bold text-lg ${tasks.bp ? 'text-[#1B4332]' : 'text-slate-700'}`}>Tekanan Darah <span className="text-red-500">*</span></span>
                </label>
              </div>
              
              <div className="grid grid-cols-2 gap-3 pl-9">
                <div>
                  <label className="text-xs text-slate-500 font-bold">Sistolik (Atas)</label>
                  <Input type="number" placeholder="120" className="h-12 bg-white mt-1 border-slate-200" disabled={tasks.bp} />
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-bold">Diastolik (Bawah)</label>
                  <Input type="number" placeholder="80" className="h-12 bg-white mt-1 border-slate-200" disabled={tasks.bp} />
                </div>
              </div>
            </div>

            {/* Blood Sugar Check */}
            <div className={`p-5 rounded-3xl border transition-all ${tasks.sugar ? 'bg-[#E2F1EC] border-[#37A47C]' : 'bg-white border-slate-100 shadow-sm'}`}>
              <div className="flex justify-between items-center mb-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={tasks.sugar} 
                    onChange={(e) => setTasks({...tasks, sugar: e.target.checked})}
                    className="w-6 h-6 accent-[#37A47C] rounded" 
                  />
                  <span className={`font-bold text-lg ${tasks.sugar ? 'text-[#1B4332]' : 'text-slate-700'}`}>Gula Darah <span className="text-red-500">*</span></span>
                </label>
              </div>
              
              <div className="pl-9">
                <label className="text-xs text-slate-500 font-bold">mg/dL</label>
                <Input type="number" placeholder="110" className="h-12 bg-white mt-1 border-slate-200 w-1/2" disabled={tasks.sugar} />
              </div>
            </div>

            {/* Cholesterol Check */}
            <div className={`p-5 rounded-3xl border transition-all ${tasks.cholesterol ? 'bg-[#E2F1EC] border-[#37A47C]' : 'bg-white border-slate-100 shadow-sm'}`}>
               <div className="flex justify-between items-center mb-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={tasks.cholesterol} 
                    onChange={(e) => setTasks({...tasks, cholesterol: e.target.checked})}
                    className="w-6 h-6 accent-[#37A47C] rounded" 
                  />
                  <span className={`font-bold text-lg ${tasks.cholesterol ? 'text-[#1B4332]' : 'text-slate-700'}`}>Cek Kolesterol</span>
                </label>
                <div className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded font-bold">Opsional</div>
              </div>
              
              <div className="pl-9">
                <label className="text-xs text-slate-500 font-bold">mg/dL</label>
                <Input type="number" placeholder="180" className="h-12 bg-white mt-1 border-slate-200 w-1/2" disabled={tasks.cholesterol} />
              </div>
            </div>

          </div>
        </div>

        {/* General Notes */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
          <label className="block text-sm font-bold text-[#1B4332] mb-3">Catatan Observasi Perawat</label>
          <Textarea 
            placeholder="Ketik catatan kondisi umum pasien, respons terhadap perawatan, keluhan..."
            rows={4}
            className="text-sm border-slate-200"
          />
        </div>

      </div>

      {/* Sticky Bottom Completer */}
      <div className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 p-4 pb-safe z-50">
         <div className="max-w-3xl mx-auto">
            <Button 
               onClick={() => window.location.href='/dashboard'}
               className={`w-full h-14 justify-center text-lg rounded-2xl shadow-lg transition-all
                  ${(tasks.bp && tasks.sugar) 
                    ? 'bg-[#37A47C] hover:bg-[#1B4332] shadow-[#37A47C]/20 text-white' 
                    : 'bg-slate-200 text-slate-400 shadow-none pointer-events-none'}`}
            >
               Selesaikan Sesi Perawatan
            </Button>
            <p className="text-center text-[10px] text-slate-400 font-medium mt-3">
              Laporan terkirim otomatis ke dasbor keluarga
            </p>
         </div>
      </div>

    </div>
  );
}
