'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, ChevronRight, FileText, Loader } from 'lucide-react';
import { useAppointments } from '@/lib/hooks/useApi';

export default function SessionsPage() {
  const [activeTab, setActiveTab] = useState('aktif');
  const { data: appointmentsData, isLoading } = useAppointments();

  const appointments = appointmentsData?.data || [];
  
  const STATUS_MAP: Record<string, string[]> = {
    aktif: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'],
    selesai: ['COMPLETED'],
    dibatalkan: ['CANCELLED']
  };

  const filteredAppointments = appointments.filter((apt: any) => 
    STATUS_MAP[activeTab]?.includes(apt.status)
  );

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
        <h1 className="font-serif text-2xl font-bold text-[#1B4332]">Sesi Saya</h1>
        <p className="text-sm text-slate-500 font-light mt-1">Riwayat sesi perawatan Anda.</p>
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
          filteredAppointments.map((apt: any) => (
            <Link 
              key={apt.id} 
              href={`/dashboard/monitoring/${apt.id}`}
              className="block bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 hover:border-[#37A47C]/40 hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-[#1B4332] text-lg mb-1">
                    Sesi dengan {apt.nurseName || 'Perawat'}
                  </h3>
                  <p className="text-sm text-slate-600">
                    Pasien: <span className="font-medium">{apt.patientName || 'N/A'}</span>
                  </p>
                </div>
                <div className={`px-3 py-1 font-bold text-xs rounded-full border
                  ${apt.status === 'COMPLETED' 
                    ? 'bg-slate-100 text-slate-600 border-slate-200' 
                    : apt.status === 'IN_PROGRESS'
                    ? 'bg-blue-50 text-blue-600 border-blue-200'
                    : 'bg-yellow-50 text-yellow-600 border-yellow-200'}`}
                >
                  {apt.status === 'COMPLETED' ? 'Selesai' : apt.status === 'IN_PROGRESS' ? 'Berlangsung' : 'Menunggu'}
                </div>
              </div>
              
              <div className="flex items-center text-xs text-slate-500 gap-1.5 font-medium mb-3">
                <Calendar size={14} className="text-slate-400" />
                {formatDate(apt.dueDate)}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2 text-xs">
                  <span className="bg-[#E2F1EC] text-[#37A47C] px-2.5 py-1 rounded-lg font-medium">
                    {apt.serviceType || 'Care'}
                  </span>
                  {apt.serviceName && (
                    <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-medium">
                      {apt.serviceName}
                    </span>
                  )}
                </div>
                <ChevronRight size={20} className="text-slate-300 group-hover:text-[#37A47C] transition-colors" />
              </div>
            </Link>
          ))
        ) : (
          /* Empty State */
          <div className="bg-white rounded-[2rem] p-6 border border-slate-100 flex flex-col items-center justify-center text-center py-16 h-full mt-4">
            <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
              <FileText size={40} />
            </div>
            <h3 className="font-bold text-[#1B4332] text-lg mb-2">Belum ada sesi {activeTab}</h3>
            <p className="text-sm text-slate-500 font-light max-w-[240px]">
              {activeTab === 'aktif' ? 'Pesan perawat untuk memulai sesi.' : 'Tidak ada riwayat untuk ditampilkan pada kategori ini.'}
            </p>
            {activeTab === 'aktif' && (
              <Link href="/dashboard/bookings/new" className="mt-6 font-bold text-sm bg-[#37A47C] text-white hover:bg-[#1B4332] transition-colors px-6 py-3 rounded-xl shadow-lg shadow-[#37A47C]/20 inline-block">
                Pesan Perawat
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
