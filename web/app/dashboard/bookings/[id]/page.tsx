import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, MapPin, Calendar, Clock, Receipt, User, History, CheckCircle2, AlertCircle } from 'lucide-react';

export default function BookingDetailPage() {
  return (
    <div className="bg-[#FBF9F6] min-h-screen font-sans text-slate-800 pb-28">
      {/* Header */}
      <header className="px-6 py-6 bg-white border-b border-slate-100 flex items-center gap-4 sticky top-0 z-50">
        <Link href="/dashboard/bookings" className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-500 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-serif text-xl font-bold text-[#1B4332]">Detail Booking</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">#BK-PAR-8092</p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        
        {/* Status Banner */}
        <div className="bg-[#ff4d4f] rounded-[2rem] p-6 shadow-lg shadow-red-500/20 text-white flex gap-4 items-start relative overflow-hidden">
           <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
           <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0 backdrop-blur-sm self-center">
             <AlertCircle size={24} />
           </div>
           <div>
             <h2 className="font-bold text-lg mb-1">Menunggu Pembayaran</h2>
             <p className="text-sm text-red-100 font-light leading-relaxed mb-4">
               Perawat telah mengonfirmasi booking Anda. Silakan selesaikan pembayaran sebelum <span className="font-bold text-white">12 Ags 2026, 15:00 WIB</span> untuk mengunci jadwal.
             </p>
             <Button className="h-10 px-6 bg-white text-red-600 hover:bg-slate-50 shadow-sm border-0 font-bold">
               Bayar Sekarang
             </Button>
           </div>
        </div>

        {/* Info Perawat & Jadwal */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-sm text-[#37A47C] uppercase tracking-wider mb-4">Informasi Sesi</h3>
          
          <div className="flex gap-4 mb-6">
             <div className="w-16 h-16 bg-slate-200 rounded-2xl overflow-hidden shrink-0 relative">
              <div className="absolute inset-0 bg-slate-300"></div>
            </div>
            <div>
              <h4 className="font-bold text-[#1B4332] text-lg mb-1">Ners Rina Suryani</h4>
              <p className="text-xs text-slate-500 font-semibold mb-2">Perawat Visit Tersertifikasi</p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-[#E2F1EC] text-[#37A47C] font-semibold px-2 py-0.5 rounded-lg">BTCLS</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div>
               <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5"><Calendar size={14}/> Tanggal</p>
               <p className="font-bold text-slate-800 text-sm">12 Ags 2026</p>
            </div>
            <div>
               <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5"><Clock size={14}/> Waktu</p>
               <p className="font-bold text-slate-800 text-sm">09:00 - 12:00 WIB</p>
            </div>
            <div className="col-span-2">
               <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5"><MapPin size={14}/> Lokasi Kunjungan</p>
               <p className="font-bold text-slate-800 text-sm">Jl. Slamet Riyadi No. 123, Solo</p>
            </div>
          </div>
        </div>

        {/* Profil Pasien */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-sm text-[#37A47C] uppercase tracking-wider mb-4">Data Pasien</h3>
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-[#FBF9F6] rounded-xl flex items-center justify-center text-slate-400">
               <User size={20} />
             </div>
             <div>
               <h4 className="font-bold text-[#1B4332] mb-0.5">Ibu Kartini</h4>
               <p className="text-xs text-slate-500">68 Tahun • Perempuan • Hipertensi</p>
             </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500 mb-2 font-bold">Layanan Dipilih:</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs font-semibold text-slate-600">Cek Tekanan Darah</span>
              <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs font-semibold text-slate-600">Terapi Ringan</span>
            </div>
          </div>
        </div>

        {/* Ringkasan Biaya */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-sm text-[#37A47C] uppercase tracking-wider mb-4 flex items-center gap-2">
            <Receipt size={16}/> Ringkasan Biaya
          </h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center text-slate-600">
              <span>Layanan Visit Care (3 Jam)</span>
              <span className="font-semibold text-slate-800">Rp 150.000</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Biaya Layanan Aplikasi</span>
              <span className="font-semibold text-slate-800">Rp 5.000</span>
            </div>
            <div className="flex justify-between items-center pt-3 mt-3 border-t border-slate-100">
               <span className="font-bold text-slate-800">Total Pembayaran</span>
               <span className="font-serif text-xl font-bold text-[#1B4332]">Rp 155.000</span>
            </div>
          </div>
        </div>

        <div className="text-center pt-4">
          <button className="text-xs text-slate-400 font-bold hover:text-red-500 transition-colors uppercase tracking-widest">
            Batalkan Booking
          </button>
        </div>

      </div>

    </div>
  );
}
