'use client';

import Link from 'next/link';
import { ArrowLeft, HeartPulse, Activity, Thermometer, Smile, Clock, MapPin, Search, Phone, MessageCircle, Map, Target } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function MonitoringPage() {
  return (
    <div className="bg-[#FBF9F6] min-h-screen font-sans text-slate-800 pb-24">
      
      {/* Active Session Header Banner */}
      <div className="bg-[#1B4332] pt-6 pb-20 px-6 rounded-b-[3rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#37A47C] rounded-full blur-3xl opacity-30"></div>
        <div className="relative z-10 flex items-center justify-between mb-8">
          <Link href="/dashboard" className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-2 bg-[#37A47C] px-3 py-1 rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></div>
            <span className="text-white text-xs font-bold uppercase tracking-widest">Sesi Aktif</span>
          </div>
        </div>
        
        <div className="relative z-10">
          <p className="text-emerald-100/80 text-xs font-bold uppercase tracking-widest mb-1">Pasien Dirawat</p>
          <h1 className="font-serif text-3xl font-bold text-white mb-4">Ibu Kartini</h1>
          
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-slate-200 rounded-xl overflow-hidden shrink-0 relative">
               <div className="absolute inset-0 bg-slate-300"></div>
             </div>
             <div>
               <p className="text-xs text-emerald-100 font-medium">Perawat Bertugas:</p>
               <p className="text-sm text-white font-bold">Ners Rina Suryani</p>
             </div>
          </div>
        </div>
      </div>

      {/* Tracking Timeline & Quick Actions */}
      <div className="max-w-3xl mx-auto px-6 -mt-16 mb-4 relative z-20">
        <div className="bg-white rounded-[2rem] p-5 shadow-lg shadow-[#1B4332]/10 border border-slate-100 flex flex-col gap-5">
           
           <div className="flex justify-between items-center">
             <div>
               <p className="text-[#37A47C] font-bold text-xs uppercase tracking-widest mb-1 flex items-center gap-1"><Target size={12}/> Aktif</p>
               <h2 className="font-bold text-[#1B4332]">Merawat Pasien di Rumah</h2>
             </div>
             <div className="flex gap-2">
               <Button variant="ghost" className="w-10 h-10 rounded-full p-2 bg-[#E2F1EC] text-[#37A47C] hover:bg-[#37A47C] hover:text-white transition-colors">
                 <MessageCircle size={18} />
               </Button>
               <Button variant="ghost" className="w-10 h-10 rounded-full p-2 bg-[#E2F1EC] text-[#37A47C] hover:bg-[#37A47C] hover:text-white transition-colors">
                 <Phone size={18} />
               </Button>
             </div>
           </div>

           {/* Location Timeline */}
           <div className="bg-slate-50 p-4 rounded-3xl relative border border-slate-100">
             
             {/* Progress Line */}
             <div className="absolute top-[28px] left-[32px] right-[32px] h-1 bg-[#E2F1EC] rounded-full z-0"></div>
             <div className="absolute top-[28px] left-[32px] w-1/2 h-1 bg-[#37A47C] rounded-full z-0 transition-all duration-1000"></div>

             <div className="flex justify-between relative z-10 text-center">
               
               <div className="flex flex-col items-center gap-2">
                 <div className="w-6 h-6 rounded-full bg-[#37A47C] border-4 border-white shadow-sm flex items-center justify-center text-white">
                   <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-slate-700">Berangkat</p>
                   <p className="text-[9px] text-slate-400">07:30 WIB</p>
                 </div>
               </div>

               <div className="flex flex-col items-center gap-2 -ml-4">
                 <div className="w-6 h-6 rounded-full bg-[#37A47C] border-4 border-white shadow-sm flex items-center justify-center">
                   <MapPin size={10} className="text-white fill-white" />
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-[#37A47C]">Sampai Lokasi</p>
                   <p className="text-[9px] text-slate-500">08:00 WIB</p>
                 </div>
               </div>

               <div className="flex flex-col items-center gap-2">
                 <div className="w-6 h-6 rounded-full bg-[#E2F1EC] border-4 border-white shadow-sm flex items-center justify-center"></div>
                 <div>
                   <p className="text-[10px] font-bold text-slate-400">Selesai</p>
                   <p className="text-[9px] text-slate-400">12:00 WIB</p>
                 </div>
               </div>

             </div>
           </div>

        </div>
      </div>

      {/* Real-time Stats Cards */}
      <div className="max-w-3xl mx-auto px-6 relative z-20 space-y-4">
        
        {/* Tensi & Gula Darah Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-[2rem] p-5 shadow-lg shadow-[#1B4332]/5 border border-slate-100">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#FFF4F2] text-[#ff4d4f] rounded-xl flex items-center justify-center">
                  <HeartPulse size={20} />
                </div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tekanan Darah</h3>
             </div>
             <div className="flex items-baseline gap-1">
               <span className="font-serif text-3xl font-bold text-[#1B4332]">120</span>
               <span className="text-[#37A47C] font-bold text-lg">/80</span>
             </div>
             <p className="text-xs text-slate-400 mt-2 font-medium">mmHg • Normal</p>
          </div>

          <div className="bg-white rounded-[2rem] p-5 shadow-lg shadow-[#1B4332]/5 border border-slate-100">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#E2F1EC] text-[#37A47C] rounded-xl flex items-center justify-center">
                  <Activity size={20} />
                </div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gula Darah</h3>
             </div>
             <div className="flex items-baseline gap-1">
               <span className="font-serif text-3xl font-bold text-[#1B4332]">110</span>
             </div>
             <p className="text-xs text-slate-400 mt-2 font-medium">mg/dL • Normal</p>
          </div>
        </div>

        {/* Suhu & Mood Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center">
                  <Thermometer size={16} />
                </div>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Suhu Tubuh</h3>
             </div>
             <div className="flex items-baseline gap-1">
               <span className="font-serif text-2xl font-bold text-[#1B4332]">36.5°</span>
             </div>
             <p className="text-[10px] text-slate-400 mt-1 font-medium">Diupdate 5 mnt lalu</p>
          </div>

          <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-yellow-50 text-yellow-500 rounded-lg flex items-center justify-center">
                  <Smile size={16} />
                </div>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mood Pasien</h3>
             </div>
             <div className="flex items-baseline gap-1">
               <span className="font-serif text-2xl font-bold text-[#1B4332]">Ceria</span>
             </div>
             <p className="text-[10px] text-slate-400 mt-1 font-medium">Diupdate 5 mnt lalu</p>
          </div>
        </div>

        {/* Checklist Log List */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 mt-6">
           <h3 className="font-bold text-[#1B4332] mb-6 flex items-center gap-2">
             <Search size={18} className="text-[#37A47C]" />
             Log Tindakan Perawat
           </h3>
           
           <div className="relative pl-6 border-l-2 border-[#E2F1EC] space-y-8">
             {/* Log Item */}
             <div className="relative">
                <div className="absolute -left-[31px] top-1 w-4 h-4 bg-white border-4 border-[#37A47C] rounded-full"></div>
                <p className="text-xs text-slate-500 font-bold mb-1">09:15 WIB</p>
                <h4 className="font-bold text-[#1B4332] text-sm mb-1">Cek Tekanan Darah & Gula</h4>
                <p className="text-sm text-slate-600 font-light">Kondisi stabil, Tensi 120/80 dan Gula Darah 110 mg/dL. Lansia kooperatif.</p>
             </div>
             
             {/* Log Item */}
             <div className="relative">
                <div className="absolute -left-[31px] top-1 w-4 h-4 bg-white border-4 border-[#37A47C] rounded-full"></div>
                <p className="text-xs text-slate-500 font-bold mb-1">08:50 WIB</p>
                <h4 className="font-bold text-[#1B4332] text-sm mb-1">Pemberian Obat Pagi</h4>
                <p className="text-sm text-slate-600 font-light">Obat Hipertensi diminum tanpa penolakan setelah sarapan bubur.</p>
             </div>

             {/* Log Item - Start */}
             <div className="relative">
                <div className="absolute -left-[31px] top-1 w-4 h-4 bg-[#E2F1EC] border-4 border-[#E2F1EC] rounded-full"></div>
                <p className="text-xs text-slate-500 font-bold mb-1">08:00 WIB</p>
                <h4 className="font-bold text-slate-700 text-sm mb-1">Sesi Dimulai</h4>
                <p className="text-sm text-slate-500 font-light">Perawat Ners Rina telah tiba di lokasi dan memulai sesi harian.</p>
             </div>
           </div>
        </div>
      </div>
      
    </div>
  );
}
