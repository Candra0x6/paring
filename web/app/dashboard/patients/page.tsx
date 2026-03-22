'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { User, Plus, ChevronRight, FileText } from 'lucide-react';

export default function PatientsList() {
  const [patients, setPatients] = useState([
    { id: 1, name: 'Ibu Kartini', age: 68, condition: 'Hipertensi', color: 'bg-[#E2F1EC] text-[#37A47C]', label: 'K' },
    { id: 2, name: 'Bapak Bardi', age: 72, condition: 'Stroke Ringan', color: 'bg-slate-100 text-slate-400', label: 'B' }
  ]);

  return (
    <div className="px-6 py-8 pb-24 md:pb-8 max-w-3xl mx-auto w-full min-h-screen flex flex-col bg-[#FBF9F6]">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1B4332]">Profil Pasien</h1>
          <p className="text-sm text-slate-500 font-light mt-1">Kelola data kesehatan lansia Anda</p>
        </div>
        <button 
          onClick={() => setPatients(patients.length ? [] : [
            { id: 1, name: 'Ibu Kartini', age: 68, condition: 'Hipertensi', color: 'bg-[#E2F1EC] text-[#37A47C]', label: 'K' },
            { id: 2, name: 'Bapak Bardi', age: 72, condition: 'Stroke Ringan', color: 'bg-slate-100 text-slate-400', label: 'B' }
          ])} 
          className="text-[10px] bg-slate-200 text-slate-500 px-2 py-1 rounded shadow-sm font-bold uppercase tracking-widest"
        >
          Toggle Empty
        </button>
      </header>

      {/* Patient List */}
      <div className="space-y-4 flex-1">
        {patients.length > 0 ? (
          patients.map(p => (
            <Link key={p.id} href={`/dashboard/patients/${p.id}`} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between group hover:border-[#37A47C]/30 hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 ${p.color} rounded-2xl flex items-center justify-center shrink-0 font-serif font-bold text-xl relative overflow-hidden`}>
                   <span className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent"></span>
                   {p.label}
                </div>
                <div>
                  <h3 className="font-bold text-[#1B4332] text-lg leading-tight mb-1">{p.name}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
                    <span className="px-2 py-0.5 bg-slate-100 rounded-md">{p.age} Thn</span>
                    <span className="px-2 py-0.5 bg-red-50 text-red-500 rounded-md">{p.condition}</span>
                  </div>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#37A47C] group-hover:text-white transition-colors">
                <ChevronRight size={20} />
              </div>
            </Link>
          ))
        ) : (
          /* Empty State */
          <div className="bg-white rounded-[2rem] p-6 border border-slate-100 flex flex-col items-center justify-center text-center py-16 mt-4">
             <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
               <User size={40} />
             </div>
             <h3 className="font-bold text-[#1B4332] text-lg mb-2">Belum ada pasien</h3>
             <p className="text-sm text-slate-500 font-light max-w-[240px]">
               Tambahkan profil medis lansia Anda untuk dapat memesan layanan homecare PARING.
             </p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="mt-8 relative z-20">
        <Button onClick={() => window.location.href='/dashboard/patients/new'} className="w-full h-14 justify-center text-lg bg-[#37A47C] hover:bg-[#1B4332] rounded-2xl shadow-lg shadow-[#37A47C]/20 border-0">
          <Plus size={20} className="mr-2"/>
          Tambah Pasien Baru
        </Button>
      </div>
    </div>
  );
}
