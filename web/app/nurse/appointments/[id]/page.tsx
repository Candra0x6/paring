'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, Clock, User, Phone, MessageCircle, AlertCircle, CheckCircle2, ChevronRight, FileText, Navigation, Heart, Move, Loader } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAppointmentById, useUpdateAppointment } from '@/lib/hooks/useApi';
import { toast } from 'sonner';

export default function NurseAppointmentDetail() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params?.id as string;

  const { data: appointmentData, isLoading } = useAppointmentById(appointmentId);
  const { mutate: updateAppointment, isPending } = useUpdateAppointment();

  const appointment = appointmentData?.data;

  if (isLoading) {
    return (
      <div className="bg-[#FBF9F6] min-h-screen flex items-center justify-center">
        <Loader className="animate-spin" size={40} />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="bg-[#FBF9F6] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-[#1B4332] mb-2">Janji tidak ditemukan</h2>
          <Link href="/nurse/appointments" className="text-[#37A47C] font-semibold">Kembali ke Jadwal</Link>
        </div>
      </div>
    );
  }

  const handleStartSession = () => {
    if (appointment.status === 'CONFIRMED') {
      updateAppointment(
        { id: appointmentId, data: { status: 'ONGOING' } },
        {
          onSuccess: () => {
            toast.success('Sesi dimulai');
            router.push(`/nurse/session/${appointmentId}/checklist`);
          },
          onError: (error: any) => {
            const msg = error.response?.data?.message || 'Gagal memulai sesi';
            toast.error(msg);
          }
        }
      );
    }
  };

  const handleCompleteSession = () => {
    updateAppointment(
      { id: appointmentId, data: { status: 'COMPLETED' } },
      {
        onSuccess: () => {
          toast.success('Sesi selesai');
          router.push('/nurse/dashboard');
        },
        onError: (error: any) => {
          const msg = error.response?.data?.message || 'Gagal menyelesaikan sesi';
          toast.error(msg);
        }
      }
    );
  };

  const dueDate = appointment.dueDate ? new Date(appointment.dueDate) : null;
  const dateStr = dueDate?.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) || '';
  const timeStr = dueDate?.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) || '';

  return (
    <div className="bg-[#FBF9F6] min-h-screen font-sans text-slate-800 pb-32">
      {/* Header */}
      <header className="px-6 py-6 bg-white border-b border-slate-100 flex items-center gap-4 sticky top-0 z-50">
        <Link href="/nurse/appointments" className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-500 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-serif text-xl font-bold text-[#1B4332]">Detail Kunjungan</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">#{appointmentId.substring(0, 8)}</p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        
        {/* Payment Warning if UNPAID */}
        {appointment.status === 'PENDING' && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-amber-700">
            <AlertCircle size={20} className="shrink-0" />
            <div>
              <p className="text-sm font-bold">Janji Belum Dikonfirmasi</p>
              <p className="text-xs font-medium">Pasien masih dalam proses konfirmasi pembayaran.</p>
            </div>
          </div>
        )}

        {/* Patient Info */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-sm text-[#37A47C] uppercase tracking-wider mb-4">Profil Pasien</h3>
          <div className="flex items-center gap-4 mb-6">
             <div className="w-16 h-16 bg-[#1B4332] rounded-2xl flex items-center justify-center text-white font-serif font-bold text-2xl">
               {appointment.patientName?.charAt(0) || 'P'}
             </div>
             <div>
               <h4 className="font-bold text-[#1B4332] text-lg mb-0.5">{appointment.patientName || 'Pasien'}</h4>
               <p className="text-xs text-slate-500 font-semibold">{appointment.serviceName || 'Perawatan'}</p>
             </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-sm text-[#37A47C] uppercase tracking-wider mb-4">Detail Jadwal</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-600 shrink-0">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Tanggal</p>
                <p className="font-bold text-slate-800">{dateStr}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-600 shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Waktu</p>
                <p className="font-bold text-slate-800">{timeStr}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-600 shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Jenis Layanan</p>
                <p className="font-bold text-slate-800">{appointment.serviceType || 'Care'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-sm text-[#37A47C] uppercase tracking-wider mb-4">Informasi Layanan</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600">Total Biaya</span>
              <span className="font-bold text-slate-800">Rp {appointment.totalPrice?.toLocaleString('id-ID') || '0'}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600">Status Bayar</span>
              <span className={`text-xs font-bold px-2 py-1 rounded-full
                ${appointment.status === 'CONFIRMED' || appointment.status === 'ONGOING' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'}`}
              >
                {appointment.status === 'CONFIRMED' || appointment.status === 'ONGOING' ? 'Terbayar' : 'Menunggu'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {appointment.status === 'CONFIRMED' && (
            <Button 
              onClick={handleStartSession}
              className="w-full h-14 bg-[#37A47C] hover:bg-[#1B4332] rounded-2xl text-lg font-bold shadow-lg shadow-[#37A47C]/20"
            >
              <CheckCircle2 size={20} className="mr-2" />
              Mulai Sesi Medis
            </Button>
          )}
          {appointment.status === 'ONGOING' && (
            <Button 
              onClick={handleCompleteSession}
              disabled={isPending}
              className="w-full h-14 bg-[#37A47C] hover:bg-[#1B4332] rounded-2xl text-lg font-bold shadow-lg shadow-[#37A47C]/20 disabled:opacity-50"
            >
              {isPending ? 'Menyelesaikan...' : 'Selesaikan Sesi'}
            </Button>
          )}
          <Link 
            href={`/nurse/session/${appointmentId}/non-medical`}
            className="block w-full h-14 bg-white border border-slate-200 rounded-2xl text-lg font-bold shadow-sm hover:bg-slate-50 flex items-center justify-center gap-2 text-[#1B4332] transition-colors"
          >
            <FileText size={20} />
            Catatan Pendampingan
          </Link>
        </div>

      </div>
    </div>
  );
}
