'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Phone, Lock, FileText, Upload, Award, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function NurseRegisterPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="bg-[#FBF9F6] min-h-screen font-sans text-slate-800">
      <header className="px-6 py-6 bg-white border-b border-slate-100 flex items-center gap-4 sticky top-0 z-50">
        <Link href="/login" className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-500 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-serif text-xl font-bold text-[#1B4332]">Daftar Akun Perawat</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">Langkah {step} dari 3</p>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-6 py-8">
        {/* Step 1: Basic Account Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1 uppercase tracking-widest">Nama Lengkap</label>
              <Input type="text" placeholder="Contoh: Ners Rina Suryani" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1 uppercase tracking-widest">Email Aktif</label>
              <Input type="email" placeholder="email@anda.com" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1 uppercase tracking-widest">No. WhatsApp</label>
              <Input type="tel" placeholder="081234567890" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1 uppercase tracking-widest">Password</label>
              <Input type="password" placeholder="Minimal 8 karakter" />
            </div>
            <Button onClick={() => setStep(2)} className="w-full h-14 justify-center bg-[#37A47C] hover:bg-[#1B4332] rounded-2xl shadow-lg shadow-[#37A47C]/20 text-lg">
              Langkah Berikutnya
            </Button>
          </div>
        )}

        {/* Step 2: Professional Data */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1 uppercase tracking-widest">No. STR Aktif</label>
              <Input type="text" placeholder="Masukkan nomor Surat Tanda Registrasi" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1 uppercase tracking-widest">Pengalaman Kerja (Tahun)</label>
              <Input type="number" placeholder="Contoh: 5" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1 uppercase tracking-widest">Spesialisasi / Keahlian Utama</label>
              <Input type="text" placeholder="Contoh: Perawatan Luka, Gerontologi" />
            </div>
             <div className="flex gap-4">
              <Button onClick={() => setStep(1)} variant="outline" className="w-full h-14 justify-center bg-slate-100 border-slate-200 text-slate-600 rounded-2xl">
                Kembali
              </Button>
              <Button onClick={() => setStep(3)} className="w-full h-14 justify-center bg-[#37A47C] hover:bg-[#1B4332] rounded-2xl shadow-lg shadow-[#37A47C]/20 text-lg">
                Langkah Terakhir
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Document Upload */}
        {step === 3 && (
          <div className="space-y-6">
            <p className="text-center text-sm text-slate-600 mb-4">Unggah dokumen untuk verifikasi oleh tim PARING. Pastikan foto jelas dan tidak buram.</p>
            <div className="p-6 border-2 border-dashed border-slate-300 rounded-2xl text-center">
              <Upload size={32} className="mx-auto text-slate-400 mb-2" />
              <h3 className="font-bold text-slate-700">Scan KTP</h3>
              <p className="text-xs text-slate-500 mb-3">Format JPG, PNG. Maks 2MB.</p>
              <Button variant="outline" className="text-xs h-8">Pilih File</Button>
            </div>
            <div className="p-6 border-2 border-dashed border-slate-300 rounded-2xl text-center">
              <Upload size={32} className="mx-auto text-slate-400 mb-2" />
              <h3 className="font-bold text-slate-700">Scan STR</h3>
              <p className="text-xs text-slate-500 mb-3">Format PDF, JPG, PNG. Maks 2MB.</p>
              <Button variant="outline" className="text-xs h-8">Pilih File</Button>
            </div>
            <div className="p-6 border-2 border-dashed border-slate-300 rounded-2xl text-center">
              <Upload size={32} className="mx-auto text-slate-400 mb-2" />
              <h3 className="font-bold text-slate-700">Sertifikasi Lainnya (Opsional)</h3>
              <p className="text-xs text-slate-500 mb-3">Contoh: BTCLS, Pelatihan ICU</p>
              <Button variant="outline" className="text-xs h-8">Pilih File</Button>
            </div>
            <div className="flex gap-4">
              <Button onClick={() => setStep(2)} variant="outline" className="w-full h-14 justify-center bg-slate-100 border-slate-200 text-slate-600 rounded-2xl">
                Kembali
              </Button>
              <Button onClick={() => window.location.href='/login'} className="w-full h-14 justify-center bg-[#37A47C] hover:bg-[#1B4332] rounded-2xl shadow-lg shadow-[#37A47C]/20 text-lg">
                Kirim & Selesaikan Pendaftaran
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
