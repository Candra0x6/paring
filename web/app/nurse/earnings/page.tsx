'use client';

import { useState } from 'react';
import { useAppointments, useNurseById } from '@/lib/hooks/useApi';
import { useAuthStore } from '@/lib/auth-context';
import { Wallet, TrendingUp, Calendar, ArrowUpRight, Download, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/Loader';

export default function NurseEarnings() {
  const { userId } = useAuthStore();
  const { data: appointmentsData, isLoading } = useAppointments();
  const { data: nurseData } = useNurseById(userId || '');

  const appointments = appointmentsData?.data || [];

  // Get completed appointments
  const completedAppointments = appointments.filter((apt: any) => 
    apt.status === 'COMPLETED'
  );

  // Get confirmed appointments (pending payout)
  const confirmedAppointments = appointments.filter((apt: any) => 
    apt.status === 'CONFIRMED' || apt.status === 'ONGOING'
  );

  // Calculate total earnings
  const totalEarnings = completedAppointments.reduce((sum: number, apt: any) => 
    sum + (apt.totalPrice || 0), 0
  );

  // Calculate pending payout
  const pendingPayout = confirmedAppointments.reduce((sum: number, apt: any) => 
    sum + (apt.totalPrice || 0), 0
  );

  const formatCurrency = (amount: number) => {
    return (amount || 0).toLocaleString('id-ID');
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return <Loader />;
  }

  // Create transaction list from completed appointments
  const transactions = completedAppointments.map((apt: any) => ({
    id: apt.id,
    date: formatDate(apt.appointmentDate),
    patient: apt.patientName || 'Pasien',
    amount: apt.totalPrice || 0,
    status: 'SUCCESS'
  })).concat(
    confirmedAppointments.map((apt: any) => ({
      id: apt.id,
      date: formatDate(apt.appointmentDate),
      patient: apt.patientName || 'Pasien',
      amount: apt.totalPrice || 0,
      status: 'PENDING'
    }))
  );

  return (
    <div className="px-6 py-8 pb-24 md:pb-8 max-w-3xl mx-auto w-full min-h-screen flex flex-col bg-[#FBF9F6]">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1B4332]">Penghasilan</h1>
          <p className="text-sm text-slate-500 font-light mt-1">Pantau pendapatan Anda dari setiap sesi.</p>
        </div>
        <button className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 hover:text-[#37A47C] transition-colors">
          <Download size={20} />
        </button>
      </header>

      {/* Earnings Overview Card */}
      <div className="bg-[#1B4332] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-[#1B4332]/20 mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#37A47C] rounded-full blur-3xl opacity-30"></div>
        <div className="relative z-10">
          <p className="text-emerald-100/80 text-xs font-bold uppercase tracking-[0.2em] mb-2">Total Pendapatan</p>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-sm font-bold text-emerald-200">Rp</span>
            <h2 className="font-serif text-4xl font-bold">{formatCurrency(totalEarnings)}</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <p className="text-[10px] font-bold text-emerald-100/60 uppercase tracking-wider mb-1">Akan Cair</p>
              <p className="text-lg font-bold">Rp {formatCurrency(pendingPayout)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <p className="text-[10px] font-bold text-emerald-100/60 uppercase tracking-wider mb-1">Sesi Selesai</p>
              <p className="text-lg font-bold">{completedAppointments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="font-bold text-slate-800 tracking-tight">Riwayat Transaksi ({transactions.length})</h3>
          <select className="bg-transparent text-xs font-bold text-[#37A47C] border-none focus:ring-0">
            <option>Semua</option>
            <option>Bulan Ini</option>
            <option>Juli 2026</option>
          </select>
        </div>

        {transactions.length > 0 ? (
          transactions.map((tx: any) => (
            <div key={tx.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 flex items-center justify-between hover:border-[#37A47C]/30 transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.status === 'SUCCESS' ? 'bg-[#E2F1EC] text-[#37A47C]' : 'bg-amber-50 text-amber-500'}`}>
                  {tx.status === 'SUCCESS' ? <CheckCircle2 size={24} /> : <TrendingUp size={24} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1B4332]">{tx.patient}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800">Rp {formatCurrency(tx.amount)}</p>
                <p className={`text-[9px] font-black uppercase tracking-widest ${tx.status === 'SUCCESS' ? 'text-[#37A47C]' : 'text-amber-500'}`}>
                  {tx.status === 'SUCCESS' ? 'Selesai' : 'Pending'}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-[2rem] p-6 border border-slate-100 flex flex-col items-center justify-center text-center py-16">
            <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
              <AlertCircle size={40} />
            </div>
            <h3 className="font-bold text-[#1B4332] text-lg mb-2">Belum ada transaksi</h3>
            <p className="text-sm text-slate-500 font-light max-w-[240px]">
              Selesaikan beberapa sesi untuk mulai mendapatkan penghasilan.
            </p>
          </div>
        )}
      </div>

      <div className="mt-8">
        <Button disabled={totalEarnings === 0} className="w-full h-14 justify-center bg-white border-2 border-slate-100 text-slate-600 hover:border-[#37A47C] hover:text-[#37A47C] rounded-2xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
          Tarik Dana ke Bank
          <ArrowUpRight size={20} className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
