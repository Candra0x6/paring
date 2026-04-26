'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, MapPin, Calendar, Clock, Receipt, User, History, CheckCircle2, AlertCircle, Loader } from 'lucide-react';
import { useAppointmentById, useUpdateAppointment } from '@/lib/hooks/useApi';
import { toast } from 'sonner';

const STATUS_INFO: Record<string, { label: string; color: string; bgColor: string; textColor: string }> = {
  PENDING: { label: 'Menunggu Pembayaran', color: 'bg-red-500', bgColor: 'bg-[#ff4d4f]', textColor: 'text-white' },
  CONFIRMED: { label: 'Terkonfirmasi', color: 'bg-green-500', bgColor: 'bg-[#52c41a]', textColor: 'text-white' },
  IN_PROGRESS: { label: 'Sedang Berlangsung', color: 'bg-blue-500', bgColor: 'bg-blue-500', textColor: 'text-white' },
  COMPLETED: { label: 'Selesai', color: 'bg-slate-500', bgColor: 'bg-slate-500', textColor: 'text-white' },
  CANCELLED: { label: 'Dibatalkan', color: 'bg-red-600', bgColor: 'bg-red-600', textColor: 'text-white' }
};

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params?.id as string;

  const { data: appointmentData, isLoading } = useAppointmentById(appointmentId);
  const { mutate: updateAppointment, isPending } = useUpdateAppointment();

  if (isLoading) {
    return (
      <div className="bg-[#FBF9F6] min-h-screen flex items-center justify-center">
        <Loader className="animate-spin" size={40} />
      </div>
    );
  }

  const appointment = appointmentData?.data;
  if (!appointment) {
    return (
      <div className="bg-[#FBF9F6] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-[#1B4332] mb-2">Booking tidak ditemukan</h2>
          <Link href="/dashboard/bookings" className="text-[#37A47C] font-semibold">Kembali ke Booking Saya</Link>
        </div>
      </div>
    );
  }

  const statusInfo = STATUS_INFO[appointment.status] || STATUS_INFO.PENDING;
  const dueDate = appointment.dueDate ? new Date(appointment.dueDate) : null;
  const dateStr = dueDate?.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) || '';
  const timeStr = dueDate?.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) || '';

  const handleCancel = () => {
    if (confirm('Apakah Anda yakin ingin membatalkan booking ini?')) {
      updateAppointment(
        { id: appointmentId, data: { status: 'CANCELLED' } },
        {
          onSuccess: () => {
            toast.success('Booking dibatalkan');
            router.push('/dashboard/bookings');
          },
          onError: (error: any) => {
            const msg = error.response?.data?.message || 'Gagal membatalkan booking';
            toast.error(msg);
          }
        }
      );
    }
  };

  return (
    <div className="bg-[#FBF9F6] min-h-screen font-sans text-slate-800 pb-28">
      {/* Header */}
      <header className="px-6 py-6 bg-white border-b border-slate-100 flex items-center gap-4 sticky top-0 z-50">
        <Link href="/dashboard/bookings" className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-500 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-serif text-xl font-bold text-[#1B4332]">Detail Booking</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">#{appointmentId.substring(0, 8)}</p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        
        {/* Status Banner */}
        {appointment.status !== 'COMPLETED' && appointment.status !== 'CANCELLED' && (
          <div className={`rounded-[2rem] p-6 shadow-lg ${statusInfo.bgColor} shadow-red-500/20 ${statusInfo.textColor} flex gap-4 items-start relative overflow-hidden`}>
             <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
             <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0 backdrop-blur-sm self-center">
               <AlertCircle size={24} />
             </div>
             <div>
               <h2 className="font-bold text-lg mb-1">{statusInfo.label}</h2>
               <p className="text-sm font-light leading-relaxed mb-4 opacity-90">
                 {appointment.status === 'PENDING' && 'Perawat telah mengonfirmasi booking Anda. Silakan selesaikan pembayaran untuk mengunci jadwal.'}
                 {appointment.status === 'CONFIRMED' && 'Booking Anda telah dikonfirmasi. Perawat akan tiba sesuai jadwal yang telah ditentukan.'}
                 {appointment.status === 'IN_PROGRESS' && 'Sesi perawatan sedang berlangsung. Terima kasih telah memilih PARING.'}
               </p>
               {appointment.status === 'PENDING' && (
                 <Link href={`/dashboard/payment/${appointmentId}`}>
                   <Button className="h-10 px-6 bg-white text-red-600 hover:bg-slate-50 shadow-sm border-0 font-bold">
                     Bayar Sekarang
                   </Button>
                 </Link>
               )}
             </div>
          </div>
        )}

        {/* Info Perawat & Jadwal */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-sm text-[#37A47C] uppercase tracking-wider mb-4">Informasi Sesi</h3>
          
          <div className="flex gap-4 mb-6">
             <div className="w-16 h-16 bg-[#1B4332] text-white rounded-2xl overflow-hidden shrink-0 flex items-center justify-center font-bold text-xl">
               {appointment.nurseName?.charAt(0) || 'N'}
             </div>
             <div>
               <h4 className="font-bold text-[#1B4332] text-lg mb-1">{appointment.nurseName || 'Perawat'}</h4>
               <p className="text-xs text-slate-500 font-semibold mb-2">Perawat Bersertifikat</p>
               <div className="flex items-center gap-2">
                 <span className="text-[10px] bg-[#E2F1EC] text-[#37A47C] font-semibold px-2 py-0.5 rounded-lg">{appointment.serviceType || 'Care'}</span>
               </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div>
               <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5"><Calendar size={14}/> Tanggal</p>
               <p className="font-bold text-slate-800 text-sm">{dateStr}</p>
            </div>
            <div>
               <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5"><Clock size={14}/> Waktu</p>
               <p className="font-bold text-slate-800 text-sm">{timeStr}</p>
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
               <h4 className="font-bold text-[#1B4332] mb-0.5">{appointment.patientName || 'Pasien'}</h4>
               <p className="text-xs text-slate-500">Rincian pasien</p>
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
              <span>{appointment.serviceType || 'Layanan'}</span>
              <span className="font-semibold text-slate-800">Rp {appointment.totalPrice?.toLocaleString('id-ID') || '0'}</span>
            </div>
            <div className="flex justify-between items-center pt-3 mt-3 border-t border-slate-100">
               <span className="font-bold text-slate-800">Total Pembayaran</span>
               <span className="font-serif text-xl font-bold text-[#1B4332]">Rp {appointment.totalPrice?.toLocaleString('id-ID') || '0'}</span>
            </div>
          </div>
        </div>

        {appointment.status !== 'COMPLETED' && appointment.status !== 'CANCELLED' && (
          <div className="text-center pt-4">
            <button 
              onClick={handleCancel}
              disabled={isPending}
              className="text-xs text-slate-400 font-bold hover:text-red-500 transition-colors uppercase tracking-widest disabled:opacity-50"
            >
              {isPending ? 'Membatalkan...' : 'Batalkan Booking'}
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
