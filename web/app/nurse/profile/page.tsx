'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, Shield, Award, MapPin, Camera, Edit3, Save, Star, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

export default function NurseProfile() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="bg-[#FBF9F6] min-h-screen font-sans text-slate-800 pb-20">
      {/* Photo Header */}
      <div className="relative h-64 bg-[#1B4332] rounded-b-[3rem] overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#37A47C] rounded-full blur-3xl opacity-30"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
          <div className="relative">
            <div className="w-28 h-28 bg-white/20 backdrop-blur-md rounded-[2.5rem] border-4 border-white/30 flex items-center justify-center text-white overflow-hidden">
              <User size={48} />
            </div>
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#37A47C] text-white rounded-2xl border-4 border-[#1B4332] flex items-center justify-center shadow-lg">
              <Camera size={18} />
            </button>
          </div>
          <h1 className="mt-4 font-serif text-2xl font-bold text-white leading-tight">Ners Rina Suryani</h1>
          <div className="flex items-center text-emerald-100 text-xs gap-2 mt-1">
            <span className="bg-white/10 px-3 py-1 rounded-full border border-white/10">STR Aktif</span>
            <span className="flex items-center gap-1"><Star size={12} fill="currentColor" className="text-amber-400" /> 4.9</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 -mt-6 relative z-20 space-y-6">
        {/* Verification Status Card */}
        <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#E2F1EC] text-[#37A47C] rounded-2xl flex items-center justify-center">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="font-bold text-[#1B4332]">Status Verifikasi</h3>
              <p className="text-xs text-slate-500 font-medium leading-tight">Akun Anda telah terverifikasi penuh.</p>
            </div>
          </div>
          <CheckCircle2 size={24} className="text-[#37A47C]" />
        </div>

        {/* Profile Info Form */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-lg text-[#1B4332]">Data Profesional</h2>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 text-[#37A47C] bg-[#E2F1EC] rounded-xl hover:bg-[#37A47C] hover:text-white transition-colors"
            >
              <Edit3 size={18} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1 uppercase tracking-widest">Bio / Ringkasan</label>
              <Textarea 
                placeholder="Ceritakan pengalaman Anda..." 
                rows={3} 
                defaultValue="Perawat profesional tersertifikasi dengan pengalaman lebih dari 5 tahun di ruang ICU dan homecare lansia."
                disabled={!isEditing}
                className={!isEditing ? "bg-slate-50/50 border-transparent text-slate-600" : ""}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1 uppercase tracking-widest">Pengalaman (Tahun)</label>
                <Input 
                  type="number" 
                  defaultValue="5" 
                  disabled={!isEditing}
                  className={!isEditing ? "bg-slate-50/50 border-transparent text-slate-600" : ""}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1 uppercase tracking-widest">Lokasi</label>
                <Input 
                  defaultValue="Solo" 
                  disabled={!isEditing}
                  className={!isEditing ? "bg-slate-50/50 border-transparent text-slate-600" : ""}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1 uppercase tracking-widest">Sertifikasi & Keahlian</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {['Non-medis', 'BTCLS', 'Wound Care', 'Gerontologi', 'Manajemen Diabetes'].map(tag => (
                  <span key={tag} className="text-xs bg-[#E2F1EC] text-[#37A47C] font-semibold px-3 py-1.5 rounded-lg border border-[#37A47C]/10">
                    {tag}
                  </span>
                ))}
                {isEditing && (
                  <button className="text-xs bg-slate-50 text-slate-400 font-bold px-3 py-1.5 rounded-lg border border-dashed border-slate-200">
                    + Tambah
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <Button className="w-full h-14 justify-center bg-[#37A47C] hover:bg-[#1B4332] rounded-2xl shadow-lg shadow-[#37A47C]/20">
            <Save size={20} className="mr-2" />
            Simpan Profil
          </Button>
        )}

        <button 
          onClick={() => window.location.href = '/login'}
          className="w-full py-4 text-red-500 font-bold text-sm hover:bg-red-50 rounded-2xl transition-colors uppercase tracking-widest"
        >
          Keluar dari Akun
        </button>
      </div>
    </div>
  );
}
