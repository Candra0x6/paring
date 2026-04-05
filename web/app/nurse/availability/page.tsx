'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NurseAvailability() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const slots = [
    { id: '1', start: '08:00', end: '12:00', status: 'available' },
    { id: '2', start: '13:00', end: '17:00', status: 'available' }
  ];

  return (
    <div className="px-6 py-8 pb-24 md:pb-8 max-w-3xl mx-auto w-full min-h-screen flex flex-col bg-[#FBF9F6]">
      <header className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-[#1B4332]">Jadwal Saya</h1>
        <p className="text-sm text-slate-500 font-light mt-1">Atur ketersediaan waktu Anda untuk menerima booking.</p>
      </header>

      {/* Calendar Header Mockup */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-[#1B4332]">Agustus 2026</h2>
          <div className="flex gap-2">
            <button className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-[#37A47C] transition-colors"><ChevronLeft size={20}/></button>
            <button className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-[#37A47C] transition-colors"><ChevronRight size={20}/></button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center mb-4">
          {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
            <div key={day} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{day}</div>
          ))}
          
          {/* Mock days */}
          {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
            <div 
              key={day} 
              className={`p-2 text-sm rounded-xl cursor-pointer transition-all ${day === 12 ? 'bg-[#37A47C] text-white font-bold shadow-lg shadow-[#37A47C]/20' : 'text-slate-600 hover:bg-[#E2F1EC] hover:text-[#37A47C]'}`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Time Slots for Selected Day */}
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Clock size={18} className="text-[#37A47C]" />
            Slot Waktu (12 Ags)
          </h3>
          <button className="text-xs font-bold text-[#37A47C] flex items-center gap-1">
            <Plus size={14}/> Tambah Slot
          </button>
        </div>

        {slots.map(slot => (
          <div key={slot.id} className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#E2F1EC] text-[#37A47C] rounded-2xl flex items-center justify-center">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1B4332]">{slot.start} - {slot.end}</p>
                <p className="text-[10px] text-[#37A47C] font-bold uppercase tracking-wider">Tersedia</p>
              </div>
            </div>
            <button className="p-2 text-slate-300 hover:text-red-500 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Button className="w-full h-14 justify-center bg-[#37A47C] hover:bg-[#1B4332] rounded-2xl shadow-lg shadow-[#37A47C]/20">
          <Save size={20} className="mr-2" />
          Simpan Perubahan
        </Button>
      </div>
    </div>
  );
}
