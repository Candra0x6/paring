'use client';

import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft, HeartPulse, Activity, Thermometer, Smile, Phone, MessageCircle, Target, Heart, Move, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAppointmentById, useCareLogs } from '@/lib/hooks/useApi';
import { Loader } from '@/components/Loader';

export default function MonitoringPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const sessionId = params.sessionId as string;
  const type = searchParams.get('type') || 'medical';
  const isMedical = type === 'medical';

  const { data: appointmentData, isLoading: aptLoading } = useAppointmentById(sessionId);
  const { data: careLogsData, isLoading: careLogsLoading } = useCareLogs();

  const appointment = appointmentData?.data;
  const careLogs = careLogsData?.data || [];

  // Get care logs for this appointment
  const sessionCareLogs = careLogs.filter((log: any) => log.appointmentId === sessionId);
  const latestLog = sessionCareLogs[0];

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (aptLoading || careLogsLoading) {
    return <Loader />;
  }

  if (!appointment) {
    return (
      <div className="bg-[#FBF9F6] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={40} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">Sesi tidak ditemukan</p>
        </div>
      </div>
    );
  }

  // Parse blood pressure
  const bp = latestLog?.bloodPressure ? latestLog.bloodPressure.split('/').map(Number) : [120, 80];
  const bloodSugar = latestLog?.bloodSugar || 110;
  const temperature = latestLog?.temperature || 36.5;

  // Calculate session duration
  const startTime = new Date(appointment.appointmentDate);
  const serviceHours = appointment.serviceType === 'VISIT' ? 3 : appointment.serviceType === 'LIVE_OUT' ? 8 : 24;
  const endTime = new Date(startTime.getTime() + serviceHours * 60 * 60 * 1000);

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
            <span className="text-white text-xs font-bold uppercase tracking-widest">{appointment.status === 'ONGOING' ? 'Sesi Aktif' : 'Sesi Selesai'}</span>
          </div>
        </div>
        
        <div className="relative z-10">
          <p className="text-emerald-100/80 text-xs font-bold uppercase tracking-widest mb-1">Pasien Dirawat</p>
          <h1 className="font-serif text-3xl font-bold text-white mb-4">{appointment.patientName || 'Pasien'}</h1>
          
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-slate-200 rounded-xl overflow-hidden shrink-0 relative flex items-center justify-center text-slate-600 font-bold">
               {appointment.patientName?.charAt(0)}
             </div>
             <div>
               <p className="text-xs text-emerald-100 font-medium">Perawat Bertugas:</p>
               <p className="text-sm text-white font-bold">{appointment.nurseName || 'Perawat'}</p>
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
               <h2 className="font-bold text-[#1B4332]">
                 {appointment.serviceType === 'VISIT' ? 'Merawat Pasien di Rumah' : 
                  appointment.serviceType === 'LIVE_OUT' ? 'Live-Out Care' : 'Live-In Care'}
               </h2>
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
             <div className="absolute top-[28px] left-[32px] right-[32px] h-1 bg-[#E2F1EC] rounded-full z-0"></div>
             <div className="absolute top-[28px] left-[32px] w-1/2 h-1 bg-[#37A47C] rounded-full z-0 transition-all duration-1000"></div>

             <div className="flex justify-between relative z-10 text-center">
               <div className="flex flex-col items-center gap-2">
                 <div className="w-6 h-6 rounded-full bg-[#37A47C] border-4 border-white shadow-sm flex items-center justify-center text-white">
                   <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-slate-700">Mulai</p>
                   <p className="text-[9px] text-slate-400">{formatTime(appointment.appointmentDate)}</p>
                 </div>
               </div>

               <div className="flex flex-col items-center gap-2 -ml-4">
                 <div className="w-6 h-6 rounded-full bg-[#37A47C] border-4 border-white shadow-sm flex items-center justify-center">
                   <div className="w-2 h-2 bg-white rounded-full"></div>
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-[#37A47C]">Proses</p>
                   <p className="text-[9px] text-slate-500">{formatDate(appointment.appointmentDate)}</p>
                 </div>
               </div>

               <div className="flex flex-col items-center gap-2">
                 <div className="w-6 h-6 rounded-full bg-[#E2F1EC] border-4 border-white shadow-sm flex items-center justify-center"></div>
                 <div>
                   <p className="text-[10px] font-bold text-slate-400">Selesai</p>
                   <p className="text-[9px] text-slate-400">{endTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                 </div>
               </div>
             </div>
           </div>
        </div>
      </div>

      {/* Real-time Stats Cards */}
      <div className="max-w-3xl mx-auto px-6 relative z-20 space-y-4">
        
        {isMedical ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-[2rem] p-5 shadow-lg shadow-[#1B4332]/5 border border-slate-100">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#FFF4F2] text-[#ff4d4f] rounded-xl flex items-center justify-center">
                    <HeartPulse size={20} />
                  </div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tekanan Darah</h3>
               </div>
               <div className="flex items-baseline gap-1">
                 <span className="font-serif text-3xl font-bold text-[#1B4332]">{bp[0]}</span>
                 <span className="text-[#37A47C] font-bold text-lg">/{bp[1]}</span>
               </div>
               <p className="text-xs text-slate-400 mt-2 font-medium">mmHg • {bp[0] >= 90 && bp[0] <= 140 ? 'Normal' : 'Tinggi'}</p>
            </div>

            <div className="bg-white rounded-[2rem] p-5 shadow-lg shadow-[#1B4332]/5 border border-slate-100">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#E2F1EC] text-[#37A47C] rounded-xl flex items-center justify-center">
                    <Activity size={20} />
                  </div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gula Darah</h3>
               </div>
               <div className="flex items-baseline gap-1">
                 <span className="font-serif text-3xl font-bold text-[#1B4332]">{bloodSugar}</span>
               </div>
               <p className="text-xs text-slate-400 mt-2 font-medium">mg/dL • {bloodSugar >= 70 && bloodSugar <= 140 ? 'Normal' : 'Abnormal'}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-[2rem] p-5 shadow-lg shadow-[#1B4332]/5 border border-slate-100">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-pink-50 text-pink-500 rounded-xl flex items-center justify-center">
                    <Heart size={20} />
                  </div>
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Emotional</h3>
               </div>
               <div className="flex items-baseline gap-1">
                 <span className="font-serif text-2xl font-bold text-[#1B4332]">Baik</span>
               </div>
               <p className="text-[10px] text-slate-400 mt-2 font-medium">Pasien Kooperatif</p>
            </div>

            <div className="bg-white rounded-[2rem] p-5 shadow-lg shadow-[#1B4332]/5 border border-slate-100">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                    <Move size={20} />
                  </div>
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Aktivitas</h3>
               </div>
               <div className="flex items-baseline gap-1">
                 <span className="font-serif text-2xl font-bold text-[#1B4332]">Aktif</span>
               </div>
               <p className="text-[10px] text-slate-400 mt-2 font-medium">Mobilitas Baik</p>
            </div>
          </div>
        )}

        {/* Suhu & Status Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center">
                  <Thermometer size={16} />
                </div>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Suhu Tubuh</h3>
             </div>
             <div className="flex items-baseline gap-1">
               <span className="font-serif text-2xl font-bold text-[#1B4332]">{temperature}°</span>
             </div>
             <p className="text-[10px] text-slate-400 mt-1 font-medium">Sekarang • {temperature >= 36 && temperature <= 37.5 ? 'Normal' : 'Tinggi'}</p>
          </div>

          <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-yellow-50 text-yellow-500 rounded-lg flex items-center justify-center">
                  <Smile size={16} />
                </div>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</h3>
             </div>
             <div className="flex items-baseline gap-1">
               <span className="font-serif text-2xl font-bold text-[#1B4332]">Stabil</span>
             </div>
             <p className="text-[10px] text-slate-400 mt-1 font-medium">{latestLog?.notes ? 'Sesuai rencana' : 'Monitoring'}</p>
          </div>
        </div>

        {/* Latest Notes */}
        {latestLog?.notes && (
          <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 mt-6">
            <h3 className="font-bold text-[#1B4332] mb-3 text-sm">Catatan Terbaru</h3>
            <p className="text-sm text-slate-600 font-light">{latestLog.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
