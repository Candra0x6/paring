'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, Clock, User, Phone, MessageCircle, AlertCircle, CheckCircle2, ChevronRight, FileText, Navigation, Heart, Move } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NurseAppointmentDetail() {
  const params = useParams();
  const id = params.id as string;

  const appointments: Record<string, any> = {
    '1': {
      id: '1',
      patient: 'Ibu Kartini',
      age: 68,
      condition: 'Hipertensi',
      date: '12 Ags 2026',
      time: '09:00 - 12:00 WIB',
      address: 'Jl. Slamet Riyadi No. 123, Solo',
      paymentStatus: 'PAID',
      service: 'Visit Care',
      status: 'PENDING',
      requirements: ['Cek Tekanan Darah', 'Cek Gula Darah', 'Rawat Luka'],
      note: "Mohon dicek tensinya agak sering ya Sus, tadi pagi sempat mengeluh pusing."
    },
    '2': {
      id: '2',
      patient: 'Opa Sastro',
      age: 75,
      condition: 'Pasca Stroke (Ringan)',
      date: '12 Ags 2026',
      time: '14:00 - 16:00 WIB',
      address: 'Perum Gading Solo Baru, Solo',
      paymentStatus: 'PAID',
      service: 'Non-medis',
      status: 'PENDING',
      requirements: ['Pendampingan ADL', 'Emotional Support', 'Light Exercise'],
      note: "Opa suka sekali mengobrol tentang masa mudanya di Semarang."
    }
  };

  const appointment = appointments[id] || appointments['1'];

  return (
    <div className="bg-[#FBF9F6] min-h-screen font-sans text-slate-800 pb-32">
      {/* Header */}
      <header className="px-6 py-6 bg-white border-b border-slate-100 flex items-center gap-4 sticky top-0 z-50">
        <Link href="/nurse/dashboard" className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-500 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-serif text-xl font-bold text-[#1B4332]">Detail Kunjungan</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">#BK-PAR-8092</p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        
        {/* Payment Warning if UNPAID */}
        {appointment.paymentStatus !== 'PAID' && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-amber-700">
            <AlertCircle size={20} className="shrink-0" />
            <div>
              <p className="text-sm font-bold">Pasien Belum Membayar</p>
              <p className="text-xs font-medium">Anda tidak dapat memulai sesi sebelum pembayaran dikonfirmasi.</p>
            </div>
          </div>
        )}

        {/* Patient Info */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-sm text-[#37A47C] uppercase tracking-wider mb-4">Profil Pasien</h3>
          <div className="flex items-center gap-4 mb-6">
             <div className="w-16 h-16 bg-[#1B4332] rounded-2xl flex items-center justify-center text-white font-serif font-bold text-2xl">
               {appointment.patient.charAt(0)}
             </div>
             <div>
               <h4 className="font-bold text-[#1B4332] text-lg mb-0.5">{appointment.patient}</h4>
               <p className="text-xs text-slate-500 font-semibold">{appointment.age} Tahun • {appointment.condition}</p>
             </div>
             <div className="ml-auto flex gap-2">
               <button className="w-10 h-10 bg-[#E2F1EC] text-[#37A47C] rounded-xl flex items-center justify-center hover:bg-[#37A47C] hover:text-white transition-colors">
                 <Phone size={18} />
               </button>
               <button className="w-10 h-10 bg-[#E2F1EC] text-[#37A47C] rounded-xl flex items-center justify-center hover:bg-[#37A47C] hover:text-white transition-colors">
                 <MessageCircle size={18} />
               </button>
             </div>
          </div>

          <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
            <div>
               <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Tanggal</p>
               <p className="text-sm font-bold text-slate-800">{appointment.date}</p>
            </div>
            <div>
               <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Waktu Kedatangan</p>
               <p className="text-sm font-bold text-slate-800">{appointment.time}</p>
            </div>
            <div className="col-span-2">
               <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Alamat Pasien</p>
               <p className="text-sm font-bold text-slate-800">{appointment.address}</p>
               <button className="mt-3 text-xs font-bold text-[#37A47C] flex items-center gap-1 bg-[#E2F1EC] px-3 py-2 rounded-lg w-max">
                 <Navigation size={14} /> Buka di Maps
               </button>
            </div>
          </div>
        </div>

        {/* Service Requirements */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-sm text-[#37A47C] uppercase tracking-wider mb-4">Kebutuhan {appointment.service === 'Non-medis' ? 'Pendampingan' : 'Medis'}</h3>
          <div className="flex flex-wrap gap-2">
            {appointment.requirements.map((req: string) => (
              <span key={req} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-600">{req}</span>
            ))}
          </div>
          <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Catatan Tambahan</p>
            <p className="text-xs text-slate-600 leading-relaxed font-light italic">"{appointment.note}"</p>
          </div>
        </div>

      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 p-4 safe-area-pb z-50">
        <div className="max-w-3xl mx-auto flex gap-4">
          <Button 
            onClick={() => window.location.href=`/nurse/session/${id}/${appointment.service === 'Non-medis' ? 'non-medical' : 'checklist'}`}
            disabled={appointment.paymentStatus !== 'PAID'}
            className="h-14 flex-1 justify-center rounded-2xl bg-[#37A47C] hover:bg-[#1B4332] shadow-lg shadow-[#37A47C]/20 text-lg disabled:opacity-50 disabled:grayscale"
          >
            Mulai Sesi {appointment.service === 'Non-medis' ? 'Pendampingan' : 'Perawatan'}
          </Button>
        </div>
      </div>
    </div>
  );
}
