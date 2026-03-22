'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import { ArrowLeft, User, Activity, AlertCircle, Phone, Save } from 'lucide-react';

export default function AddPatient() {
  const [isDiabetes, setIsDiabetes] = useState(false);
  const [isBedridden, setIsBedridden] = useState(false);
  const [aiConsent, setAiConsent] = useState(false);

  return (
    <div className="px-6 py-6 pb-24 md:pb-8 max-w-3xl mx-auto w-full min-h-screen bg-[#FBF9F6]">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/patients" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 text-[#37A47C]">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1B4332]">Tambah Pasien</h1>
          <p className="text-sm text-slate-500 font-light mt-1">Lengkapi data profil medis lansia</p>
        </div>
      </header>

      <form className="space-y-8">
        {/* Basic Info Section */}
        <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#E2F1EC] rounded-xl flex items-center justify-center text-[#37A47C]">
              <User size={20} />
            </div>
            <h2 className="font-bold text-lg text-[#1B4332]">Data Dasar</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Nama Lengkap Pasien <span className="text-red-500">*</span></label>
              <Input placeholder="Mis. Ibu Kartini" required />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Usia (Tahun) <span className="text-red-500">*</span></label>
                <Input type="number" placeholder="60" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Jenis Kelamin <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select className="w-full h-12 px-4 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:outline-none focus:border-[#37A47C] transition-colors text-slate-800 appearance-none">
                    <option value="">Pilih</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Berat Badan (kg)</label>
                <Input type="number" placeholder="55" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Tinggi Badan (cm)</label>
                <Input type="number" placeholder="160" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Alamat Lengkap <span className="text-red-500">*</span></label>
              <Textarea placeholder="Alamat domisili saat ini" rows={3} required />
            </div>
          </div>
        </section>

        {/* Medical History Section */}
        <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
           <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#FFF4F2] rounded-xl flex items-center justify-center text-[#ff4d4f]">
              <Activity size={20} />
            </div>
            <h2 className="font-bold text-lg text-[#1B4332]">Kondisi Medis</h2>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Tekanan Darah Normal</label>
                <Input placeholder="120/80" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Gula Darah Rata-rata</label>
                <Input placeholder="110 mg/dL" />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <Checkbox 
                label="Memiliki Riwayat Diabetes" 
                checked={isDiabetes} 
                onChange={setIsDiabetes} 
              />
              <Checkbox 
                label="Pasien Tirah Baring (Bedridden)" 
                checked={isBedridden} 
                onChange={setIsBedridden} 
              />
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Alergi Obat/Makanan</label>
              <Input placeholder="Mis. Paracetamol, Seafood" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Catatan Tambahan untuk Perawat</label>
              <Textarea placeholder="Kondisi khusus, kebiasaan, atau pantangan..." rows={3} />
            </div>
          </div>
        </section>

        {/* Emergency Contact */}
        <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
           <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#FFF4F2] rounded-xl flex items-center justify-center text-[#ff4d4f]">
              <AlertCircle size={20} />
            </div>
            <h2 className="font-bold text-lg text-[#1B4332]">Kontak Darurat</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Nama Kontak Darurat <span className="text-red-500">*</span></label>
              <Input placeholder="Nama kerabat" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Nomor Telepon / WhatsApp <span className="text-red-500">*</span></label>
              <Input type="tel" icon={<Phone size={18}/>} placeholder="08xxxxxxxxxx" required />
            </div>
            <div className="pt-4">
               <Checkbox 
                label="Saya mengizinkan PARING AI untuk menganalisis laporan medis pasien guna mendapatkan rekomendasi perawatan terbaik." 
                checked={aiConsent} 
                onChange={setAiConsent} 
              />
            </div>
          </div>
        </section>

        <div className="pt-4 pb-8">
          <Button type="button" onClick={() => window.location.href='/dashboard/patients'} className="w-full h-14 justify-center text-lg bg-[#37A47C] hover:bg-[#1B4332] rounded-2xl shadow-lg shadow-[#37A47C]/30">
            <Save size={20} className="mr-2" />
            Simpan Profil Pasien
          </Button>
        </div>

      </form>
    </div>
  );
}
