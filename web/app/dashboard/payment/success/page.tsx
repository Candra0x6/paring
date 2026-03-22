'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, ChevronRight, FileText } from 'lucide-react';

export default function PaymentSuccessPage() {
  return (
    <div className="bg-[#37A47C] min-h-screen font-sans text-white flex flex-col justify-center items-center p-6 relative overflow-hidden">
      
      {/* Decorative Background Patterns */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl mix-blend-overlay"></div>
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-[#1B4332]/20 rounded-full blur-3xl mix-blend-overlay"></div>
      
      <div className="w-full max-w-sm relative z-10 flex flex-col items-center">
        
        {/* Animated Check Icon Area */}
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-[#37A47C] shadow-2xl shadow-emerald-900/50 mb-8 animate-[bounce_1s_ease-in-out_infinite]">
          <CheckCircle2 size={48} className="animate-pulse" />
        </div>

        <h1 className="font-serif text-3xl font-bold mb-2 text-center">Pembayaran Berhasil!</h1>
        <p className="text-emerald-100 font-light text-center mb-10 leading-relaxed text-sm">
          Terima kasih. Jadwal Ners Rina untuk tanggal 12 Ags 2026 telah terkunci. Perawat akan segera menghubungi Anda.
        </p>

        {/* Receipt Mockup Card */}
        <div className="bg-white w-full rounded-[2rem] p-6 text-slate-800 shadow-2xl shadow-black/10 relative overflow-hidden mb-10 border border-slate-100/50">
           {/* Receipt Tear Effect at Top */}
           <div className="absolute -top-3 inset-x-0 h-6 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxNycgaGVpZ2h0PScxMCc+CiAgPHBhdGggZD0nbTAsMTAgbDguNSwtMTAgbDguNSwxMCBaJyBmaWxsPScjMzdBNDdDJy8+Cjwvc3ZnPg==')] opacity-100" style={{backgroundRepeat: 'repeat-x'}}></div>
           
           <div className="text-center border-b border-dashed border-slate-200 pb-4 mb-4 mt-2">
             <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Total Pembayaran</p>
             <h2 className="font-serif text-3xl font-bold text-[#1B4332]">Rp 155.000</h2>
           </div>
           
           <div className="space-y-3 text-sm">
             <div className="flex justify-between">
               <span className="text-slate-500">ID Pesanan</span>
               <span className="font-bold text-slate-700">#BK-PAR-8092</span>
             </div>
             <div className="flex justify-between">
               <span className="text-slate-500">Metode</span>
               <span className="font-bold text-slate-700">GoPay</span>
             </div>
             <div className="flex justify-between">
               <span className="text-slate-500">Waktu</span>
               <span className="font-bold text-slate-700">12 Ags 2026, 09:45</span>
             </div>
           </div>
        </div>

        <div className="w-full space-y-3">
          <Button onClick={() => window.location.href='/dashboard/bookings/1'} className="w-full h-14 justify-center bg-white text-[#1B4332] hover:bg-slate-50 text-lg shadow-lg shadow-black/10">
            Lihat Booking Anda
          </Button>
          <Button onClick={() => window.location.href='/dashboard'} variant="ghost" className="w-full h-14 justify-center text-white hover:bg-white/10 hover:text-white">
            Kembali ke Beranda
          </Button>
        </div>

      </div>
    </div>
  );
}
