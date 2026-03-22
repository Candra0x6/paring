import Link from 'next/link';
import { Search, Plus, MessageCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ConsultationList() {
  return (
    <div className="bg-[#FBF9F6] min-h-screen font-sans text-slate-800 pb-24 flex flex-col h-screen">
      
      {/* Header */}
      <header className="px-6 py-6 pb-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-50">
        <h1 className="font-serif text-2xl font-bold text-[#1B4332]">Konsultasi</h1>
        <button className="w-10 h-10 bg-[#E2F1EC] text-[#37A47C] hover:bg-[#1B4332] hover:text-white rounded-full flex items-center justify-center transition-colors">
          <Plus size={20} />
        </button>
      </header>

      {/* Search */}
      <div className="px-6 py-4 bg-white">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Cari pesan atau nama perawat..." 
            className="w-full h-12 pl-11 pr-4 bg-[#F8FAFC] border border-slate-100 rounded-2xl focus:outline-none focus:border-[#37A47C] transition-colors text-slate-800 text-sm"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        
        {/* Chat Item - Unread */}
        <Link href="/dashboard/consultation/1" className="flex items-center gap-4 px-6 py-4 bg-white hover:bg-slate-50 border-b border-slate-50 transition-colors">
          <div className="w-14 h-14 bg-slate-200 rounded-2xl overflow-hidden shrink-0 relative">
            <div className="absolute inset-0 bg-slate-300"></div>
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1 min-w-0">
             <div className="flex justify-between items-center mb-1">
               <h3 className="font-bold text-[#1B4332] truncate text-base">Dr. Sarah (Admin)</h3>
               <span className="text-xs font-bold text-[#37A47C]">09:41</span>
             </div>
             <p className="text-sm font-medium text-slate-800 truncate">Ibu, jadwal ners Rina untuk besok siang sudah...</p>
          </div>
          <div className="w-5 h-5 bg-[#ff4d4f] text-white text-[10px] font-bold flex items-center justify-center rounded-full shrink-0 shadow-sm border border-white">
            2
          </div>
        </Link>
        
        {/* Chat Item - Read */}
        <Link href="/dashboard/consultation/2" className="flex items-center gap-4 px-6 py-4 bg-white hover:bg-slate-50 border-b border-slate-50 transition-colors">
           <div className="w-14 h-14 bg-slate-200 rounded-2xl overflow-hidden shrink-0 relative">
            <div className="absolute inset-0 bg-slate-300"></div>
          </div>
          <div className="flex-1 min-w-0">
             <div className="flex justify-between items-center mb-1">
               <h3 className="font-bold text-slate-700 truncate text-base">Ners Rina Suryani</h3>
               <span className="text-xs text-slate-400 font-medium">Kemarin</span>
             </div>
             <p className="text-sm text-slate-500 truncate flex items-center gap-1 font-light">
               <CheckCircle2 size={14} className="text-[#37A47C]" /> Baik bu, saya akan siapkan alatnya.
             </p>
          </div>
        </Link>
        
        {/* Chat Item - Read */}
        <Link href="/dashboard/consultation/3" className="flex items-center gap-4 px-6 py-4 bg-white hover:bg-slate-50 border-b border-slate-50 transition-colors">
           <div className="w-14 h-14 bg-slate-200 rounded-2xl overflow-hidden shrink-0 relative opacity-60">
            <div className="absolute inset-0 bg-slate-300"></div>
          </div>
          <div className="flex-1 min-w-0">
             <div className="flex justify-between items-center mb-1">
               <h3 className="font-bold text-slate-700 truncate text-base">Ners Siti Aisyah</h3>
               <span className="text-xs text-slate-400 font-medium">12 Mei</span>
             </div>
             <p className="text-sm text-slate-500 truncate flex items-center gap-1 font-light">
               <CheckCircle2 size={14} className="text-slate-300" /> Sesi sudah selesai ya bu. Terima kasih!
             </p>
          </div>
        </Link>
        
      </div>
    </div>
  );
}
