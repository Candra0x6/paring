'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Activity, AlertCircle, Phone, Save, Search, Calendar as CalendarIcon, Clock, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

export default function NewBookingPage() {
  return (
    <div className="px-6 py-6 pb-24 md:pb-8 max-w-3xl mx-auto w-full min-h-screen bg-[#FBF9F6]">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/nurses/1" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 text-[#37A47C]">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1B4332]">Buat Booking</h1>
          <p className="text-sm text-slate-500 font-light mt-1">Ners Rina Suryani</p>
        </div>
      </header>

      <form className="space-y-6">
        
        {/* Patient Selection */}
        <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <label className="block text-xs font-bold text-[#1B4332] mb-3 uppercase tracking-wider">Pasien yang Dirawat</label>
          <div className="relative">
            <select className="w-full h-14 px-4 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:outline-none focus:border-[#37A47C] transition-colors text-slate-800 appearance-none font-bold">
              <option value="">Pilih Profil Pasien</option>
              <option value="1">Ibu Kartini (68 Thn)</option>
              <option value="2">Bapak Bardi (72 Thn)</option>
            </select>
            <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#37A47C] pointer-events-none" />
          </div>
          <Link href="/dashboard/patients/new" className="inline-block mt-3 text-sm text-[#37A47C] font-bold hover:underline">
            + Tambah Profil Pasien Baru
          </Link>
        </section>

        {/* Service Type Selection */}
        <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
           <label className="block text-xs font-bold text-[#1B4332] mb-3 uppercase tracking-wider">Layanan Booking</label>
           <div className="space-y-3">
             <label className="flex items-start gap-4 p-4 border-2 border-[#37A47C] bg-[#E2F1EC]/30 rounded-2xl cursor-pointer">
               <input type="radio" name="service" className="mt-1 accent-[#37A47C] w-5 h-5" defaultChecked />
               <div>
                 <div className="font-bold text-[#1B4332]">Visit Care</div>
                 <div className="text-sm text-slate-600 mb-1">Pemeriksaan medis standar (Maks. 3 Jam)</div>
                 <div className="text-sm font-bold text-[#37A47C]">Rp 150.000</div>
               </div>
             </label>
             <label className="flex items-start gap-4 p-4 border border-slate-200 rounded-2xl cursor-pointer">
               <input type="radio" name="service" className="mt-1 accent-[#37A47C] w-5 h-5" />
               <div>
                 <div className="font-bold text-[#1B4332]">Live-Out Care</div>
                 <div className="text-sm text-slate-500 mb-1">Pendampingan penuh (Shift Siang 8 Jam)</div>
                 <div className="text-sm font-bold text-slate-700">Rp 250.000</div>
               </div>
             </label>
           </div>
        </section>

        {/* Schedule */}
        <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
           <label className="block text-xs font-bold text-[#1B4332] mb-3 uppercase tracking-wider">Jadwal Perawatan</label>
           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-xs text-slate-500 mb-1.5 ml-1">Tanggal</label>
               <Input type="date" className="h-14 bg-[#FBF9F6] border-slate-100 placeholder-slate-400 font-bold text-slate-700" />
             </div>
             <div>
               <label className="block text-xs text-slate-500 mb-1.5 ml-1">Jam Datang</label>
               <Input type="time" className="h-14 bg-[#FBF9F6] border-slate-100 font-bold text-slate-700" />
             </div>
           </div>
        </section>

         {/* Medical Needs / Notes */}
        <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
           <label className="block text-xs font-bold text-[#1B4332] mb-3 uppercase tracking-wider">Kebutuhan Tanda Vital / Medis</label>
           <div className="flex flex-wrap gap-2 mb-4">
             {['Cek Tekanan Darah', 'Cek Gula Darah', 'Injeksi / Suntik', 'Rawat Luka', 'Pemberian Obat', 'Terapi Ringan'].map(tag => (
               <label key={tag} className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 cursor-pointer has-[:checked]:bg-[#37A47C]/10 has-[:checked]:border-[#37A47C] has-[:checked]:text-[#1B4332] transition-colors">
                 <input type="checkbox" className="hidden" />
                 {tag}
               </label>
             ))}
           </div>
           
           <label className="block text-xs text-slate-500 mb-1.5 mt-4 ml-1">Catatan Tambahan untuk Perawat (Opsional)</label>
           <Textarea placeholder="Kondisi keluhan detail hari ini..." rows={3} className="bg-[#F8FAFC] border-slate-100 text-sm" />
        </section>

        {/* Final CTA Fixed to Bottom */}
        <div className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 p-4 safe-area-pb z-50">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-500 font-bold uppercase mb-0.5">Total Harga</div>
              <div className="font-serif text-2xl font-bold text-[#1B4332]">Rp 150K</div>
            </div>
            <Button type="button" onClick={() => window.location.href='/dashboard/bookings/1'} className="h-14 px-8 justify-center rounded-2xl bg-[#37A47C] hover:bg-[#1B4332] shadow-lg shadow-[#37A47C]/20 text-lg">
              Kirim Request
            </Button>
          </div>
        </div>

        {/* Spacer for fixed bottom */}
        <div className="h-8"></div>

      </form>
    </div>
  );
}
