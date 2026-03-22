'use client';

import Link from 'next/link';
import { ArrowLeft, FileText, CheckCircle2, ShieldAlert, Sparkles, TrendingUp, Download, CheckCircle, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function SessionReportPage() {
  return (
    <div className="bg-[#FBF9F6] min-h-screen font-sans text-slate-800 pb-28">
      
      {/* Header */}
      <header className="px-6 py-6 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/bookings" className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-500 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-serif text-xl font-bold text-[#1B4332]">Laporan Sesi</h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">12 Ags 2026</p>
          </div>
        </div>
        <button className="w-10 h-10 text-slate-500 hover:text-[#37A47C] transition-colors rounded-full flex items-center justify-center">
          <Download size={20} />
        </button>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        
        {/* PARING AI Summary Card */}
        <div className="bg-[#1B4332] rounded-[2rem] p-6 shadow-xl shadow-[#1B4332]/20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#37A47C] rounded-full blur-2xl opacity-40"></div>
          
          <div className="flex items-center gap-2 mb-4 relative z-10 text-emerald-200">
            <Sparkles size={18} />
            <h2 className="text-xs font-bold uppercase tracking-widest">Ringkasan PARING AI</h2>
          </div>
          
          <div className="flex items-start gap-4 mb-4 relative z-10">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0 backdrop-blur-sm">
              <span className="font-serif text-2xl font-bold text-white">B+</span>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1 leading-tight">Kondisi Stabil Membaik</h3>
               <p className="text-sm text-emerald-100/90 font-light leading-relaxed mb-4">
                 Berdasarkan log perawat, tekanan darah dan gula darah pasien hari ini dalam batas normal. Respons terhadap perawatan luka sangat positif.
               </p>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 relative z-10 flex items-start gap-3">
             <ShieldAlert size={16} className="text-amber-300 mt-0.5" />
             <p className="text-xs text-white/90">
               <span className="font-bold text-white">Rekomendasi Utama:</span> Perbanyak asupan air putih di malam hari, gula darah sedikit berfluktuasi menjelang asar.
             </p>
          </div>
        </div>

        {/* Info Sesi Dasar */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-sm text-[#37A47C] uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Detail Sesi</h3>
          
          <div className="grid grid-cols-2 gap-y-4">
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1">Pasien Dirawat</p>
              <p className="font-bold text-slate-800 text-sm">Ibu Kartini (68 Thn)</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1">Perawat Bertugas</p>
              <p className="font-bold text-[#1B4332] text-sm">Ners Rina Suryani</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1 flex items-center gap-1.5"><Clock size={14}/> Durasi Sesi</p>
              <p className="font-bold text-slate-800 text-sm">09:00 - 12:15 WIB (3j 15m)</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1 flex items-center gap-1.5"><TrendingUp size={14}/> Jenis Layanan</p>
              <p className="font-bold text-slate-800 text-sm">Visit Care</p>
            </div>
          </div>
        </div>

        {/* Checklist Medis */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-sm text-[#37A47C] uppercase tracking-wider mb-4 flex items-center gap-2">
            <CheckCircle size={18} /> Hasil Checklist Tindakan
          </h3>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                 <h4 className="font-bold text-[#1B4332]">Pengukuran Tanda Vital</h4>
                 <CheckCircle2 size={16} className="text-[#37A47C]" />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                <div>
                  <span className="text-slate-500 block text-xs">Tekanan Darah:</span>
                  <span className="font-bold text-slate-800">120/80 mmHg</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs">Gula Darah Sewaktu:</span>
                  <span className="font-bold text-slate-800">110 mg/dL</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs">Suhu Tubuh:</span>
                  <span className="font-bold text-slate-800">36.5°C</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs">Saturasi O2:</span>
                  <span className="font-bold text-slate-800">98%</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                 <h4 className="font-bold text-[#1B4332]">Pemberian Obat</h4>
                 <CheckCircle2 size={16} className="text-[#37A47C]" />
              </div>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Obat Amlodipine 5mg dan Metformin 500mg diminum jam 09:30 setelah sarapan tanpa halangan.
              </p>
            </div>

             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                 <h4 className="font-bold text-[#1B4332]">Rawat Luka Kaki</h4>
                 <CheckCircle2 size={16} className="text-[#37A47C]" />
              </div>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Pembersihan pus dan penggantian balutan di tumit kiri. Luka mengering dengan baik dibanding sesi 2 hari lalu.
              </p>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                 <h4 className="font-bold text-[#1B4332]">Catatan Khusus Ners</h4>
                 <FileText size={16} className="text-[#37A47C]" />
              </div>
              <p className="text-sm font-light text-slate-600 leading-relaxed italic">
                "Ibu agak sulit diajak bergerak hari ini karena mengaku pegal, sebaiknya besok dicoba terapi gerak ringan di tempat tidur (ROM pasif)."
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
