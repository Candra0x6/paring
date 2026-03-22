'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Phone, Video, MoreVertical, Send, Paperclip, ImageIcon } from 'lucide-react';

export default function ChatRoom() {
  const [msg, setMsg] = useState('');

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans text-slate-800 flex flex-col h-screen">
      
      {/* Header */}
      <header className="px-4 py-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/consultation" className="p-2 -ml-2 text-slate-500 hover:text-slate-800 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden shrink-0 relative">
               <div className="absolute inset-0 bg-slate-300"></div>
               <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
             </div>
             <div>
               <h2 className="font-bold text-[#1B4332] text-sm md:text-base leading-tight">Dr. Sarah (Admin)</h2>
               <p className="text-[10px] md:text-xs text-[#37A47C] font-semibold">Online</p>
             </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-[#37A47C]">
          <button className="p-2 hover:bg-[#E2F1EC] rounded-full transition-colors"><Phone size={20} /></button>
          <button className="p-2 hover:bg-[#E2F1EC] rounded-full transition-colors hidden md:block"><Video size={20} /></button>
          <button className="p-2 hover:bg-[#E2F1EC] rounded-full transition-colors text-slate-500"><MoreVertical size={20} /></button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-3xl mx-auto w-full">
        <div className="text-center my-6">
          <span className="bg-slate-200/50 text-slate-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Hari Ini</span>
        </div>
        
        {/* Incoming */}
        <div className="flex gap-3 max-w-[85%]">
           <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0 overflow-hidden relative self-end">
             <div className="absolute inset-0 bg-slate-300"></div>
           </div>
           <div>
             <div className="bg-white p-3 md:p-4 rounded-2xl rounded-bl-none shadow-sm border border-slate-100 text-sm text-slate-700 leading-relaxed font-light">
               Halo Ibu, jadwal Ners Rina untuk besok siang sudah kami konfirmasi. Apakah ada catatan khusus tambahan terkait kondisi Ibu Kartini hari ini?
             </div>
             <p className="text-[10px] text-slate-400 mt-1 ml-1 font-medium">09:40</p>
           </div>
        </div>

        {/* Outgoing */}
        <div className="flex gap-3 max-w-[85%] self-end ml-auto justify-end">
           <div>
             <div className="bg-[#1B4332] p-3 md:p-4 rounded-2xl rounded-br-none shadow-sm text-sm text-white leading-relaxed font-light">
               Halo Dok, terima kasih. Kondisi ibu cukup stabil, tapi tadi pagi sempat mengeluh agak pusing. Mohon nanti dicek tensinya agak sering ya.
             </div>
             <p className="text-[10px] text-slate-400 mt-1 mr-1 text-right font-medium">09:41 · <span className="text-[#37A47C]">Dibaca</span></p>
           </div>
        </div>
        
        {/* Incoming */}
        <div className="flex gap-3 max-w-[85%]">
           <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0 overflow-hidden relative self-end">
             <div className="absolute inset-0 bg-slate-300"></div>
           </div>
           <div>
             <div className="bg-white p-3 md:p-4 rounded-2xl rounded-bl-none shadow-sm border border-slate-100 text-sm text-slate-700 leading-relaxed font-light">
               Baik Ibu. Kami akan masukkan pesan tersebut ke Log Instruksi Perawat agar Ners Rina lebih awas terkait tensinya.
             </div>
             <p className="text-[10px] text-slate-400 mt-1 ml-1 font-medium">09:42</p>
           </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-100 px-4 py-3 pb-safe z-50">
        <div className="max-w-3xl mx-auto flex items-end gap-2">
          
          <button className="p-3 text-slate-400 hover:text-[#37A47C] bg-slate-50 rounded-full transition-colors shrink-0">
            <Paperclip size={20} />
          </button>
          
          <div className="flex-1 bg-[#F8FAFC] border border-slate-200 rounded-[1.5rem] flex items-end px-3 py-2 focus-within:border-[#37A47C] transition-colors">
            <textarea 
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Ketik balasan..." 
              className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-slate-800 resize-none max-h-32 p-1 min-h-[24px]"
              rows={1}
            />
            <button className="p-1 mb-0.5 text-slate-400 hover:text-[#37A47C] transition-colors">
              <ImageIcon size={20} />
            </button>
          </div>
          
          <button className={`p-3.5 rounded-full flex items-center justify-center transition-all shrink-0 shadow-sm
             ${msg.trim() ? 'bg-[#37A47C] text-white hover:bg-[#1B4332]' : 'bg-[#E2F1EC] text-[#37A47C]/50'}`}>
            <Send size={18} className={msg.trim() ? "ml-0.5" : ""} />
          </button>
          
        </div>
      </div>
      
    </div>
  );
}
