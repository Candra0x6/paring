'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, CheckCircle2, ChevronRight, FileText, Loader } from 'lucide-react';
import { useAppointments } from '@/lib/hooks/useApi';

const STATUS_MAP: Record<string, string[]> = {
  aktif: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'],
  selesai: ['COMPLETED'],
  dibatalkan: ['CANCELLED']
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Menunggu Pembayaran', color: 'bg-[#ff4d4f]/10 text-red-600 border-[#ff4d4f]/20' },
  CONFIRMED: { label: 'Terkonfirmasi', color: 'bg-[#E2F1EC] text-[#37A47C] border-[#37A47C]/20' },
  IN_PROGRESS: { label: 'Sedang Berlangsung', color: 'bg-blue-50 text-blue-600 border-blue-200' },
  COMPLETED: { label: 'Selesai', color: 'bg-slate-100 text-slate-600 border-slate-200' },
  CANCELLED: { label: 'Dibatalkan', color: 'bg-red-50 text-red-600 border-red-200' }
};

export default function BookingList() {
  const [activeTab, setActiveTab] = useState('aktif');
  const { data: appointmentsData, isLoading } = useAppointments();

  const appointments = appointmentsData?.data || [];
  
  // Filter appointments by tab status
  const filteredAppointments = appointments.filter((apt: any) => 
    STATUS_MAP[activeTab]?.includes(apt.status)
  );

  const getStatusInfo = (status: string) => {
    return STATUS_LABELS[status] || { label: status, color: 'bg-slate-100 text-slate-600 border-slate-200' };
  };

  const formatDate = (date: string | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="px-6 py-8 pb-24 md:pb-8 max-w-3xl mx-auto w-full min-h-screen flex flex-col items-center justify-center bg-[#FBF9F6]">
        <Loader className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="px-6 py-8 pb-24 md:pb-8 max-w-3xl mx-auto w-full min-h-screen flex flex-col bg-[#FBF9F6]">
      <header className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-[#1B4332]">Booking Saya</h1>
        <p className="text-sm text-slate-500 font-light mt-1">Riwayat pesanan layanan homecare PARING.</p>
      </header>
      
      {/* Tabs */}
      <div className="flex mb-6 bg-white rounded-full p-1 border border-slate-100 shadow-sm relative z-10">
        {['aktif', 'selesai', 'dibatalkan'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-sm font-bold rounded-full transition-all capitalize
              ${activeTab === tab 
                ? 'bg-[#1B4332] text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Dynamic List */}
      <div className="flex-1 space-y-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((apt: any) => {
            const statusInfo = getStatusInfo(apt.status);
            const nurseInitial = apt.nurseName?.charAt(0) || 'N';
            
            return (
              <Link key={apt.id} href={`/dashboard/bookings/${apt.id}`} className="block bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 hover:border-[#37A47C]/40 hover:shadow-md transition-all group">
                <div className="flex justify-between items-center mb-4 border-b border-slate-50 pb-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">#{apt.id.substring(0, 8)}</span>
                  <div className={`px-3 py-1 font-bold text-xs rounded-full border ${statusInfo.color} flex items-center gap-1`}>
                    {apt.status === 'CONFIRMED' && <CheckCircle2 size={12} />}
                    {statusInfo.label}
                  </div>
                </div>
                
                <div className="flex gap-4">
                   <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden bg-[#1B4332] text-white">
                    <span className="font-serif font-bold text-xl">{nurseInitial}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#1B4332] text-lg leading-tight mb-1">{apt.nurseName || 'Perawat'}</h3>
                    <p className="text-sm font-medium text-[#37A47C] mb-2">{apt.serviceType || 'Care'} <span className="text-slate-400 font-light pl-1">({apt.patientName || 'Pasien'})</span></p>
                    
                    <div className="flex items-center text-xs text-slate-500 gap-1.5 font-medium">
                      <Calendar size={14} className="text-slate-400" />
                      {formatDate(apt.dueDate)}
                    </div>
                  </div>
                  <div className="self-center">
                    <ChevronRight size={20} className="text-slate-300 group-hover:text-[#37A47C] transition-colors" />
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          /* Empty State */
          <div className="bg-white rounded-[2rem] p-6 border border-slate-100 flex flex-col items-center justify-center text-center py-16 h-full mt-4">
             <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
               <FileText size={40} />
             </div>
             <h3 className="font-bold text-[#1B4332] text-lg mb-2">Belum ada booking {activeTab}</h3>
             <p className="text-sm text-slate-500 font-light max-w-[240px]">
               {activeTab === 'aktif' ? 'Cari perawat terbaik untuk kebutuhan medis lansia Anda hari ini.' : 'Tidak ada riwayat untuk ditampilkan pada kategori ini.'}
             </p>
             {activeTab === 'aktif' && (
               <Link href="/dashboard/nurses" className="mt-6 font-bold text-sm bg-[#37A47C] text-white hover:bg-[#1B4332] transition-colors px-6 py-3 rounded-xl shadow-lg shadow-[#37A47C]/20 inline-block">
                 Cari Perawat
               </Link>
             )}
          </div>
        )}
      </div>

    </div>
  );
}
