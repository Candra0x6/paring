'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, Sparkles, User, Brain, MessageSquare, ShieldAlert, HeartPulse, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AiChatPage() {
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', text: 'Halo! Saya Paring AI. Ada yang bisa saya bantu hari ini terkait layanan perawat atau kondisi kesehatan keluarga Anda?', time: '09:00' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    { text: 'Cari perawat luka', icon: HeartPulse },
    { text: 'Cara pesan layanan', icon: Zap },
    { text: 'Bantuan darurat', icon: ShieldAlert },
    { text: 'Tips kesehatan lansia', icon: Brain },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text?: string) => {
    const input = text || msg;
    if (!input.trim()) return;

    const newMsg = { id: Date.now(), role: 'user', text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, newMsg]);
    setMsg('');
    
    // Mock response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "Baik, saya bisa membantu mencarikan perawat spesialis luka. Biasanya kami merekomendasikan Ners yang memiliki sertifikasi CWCCA.",
        "Untuk memesan layanan, Anda bisa klik menu 'Cari' di bawah, lalu pilih perawat yang sesuai dan klik 'Pesan Sekarang'.",
        "Jika ada situasi darurat medis, mohon tekan tombol SOS merah di dashboard utama atau hubungi 119 segera.",
        "Menjaga hidrasi dan pola tidur sangat penting bagi lansia. Apakah sudah ada jadwal rutin pengecekan tensi?"
      ];
      const aiMsg = { id: Date.now() + 1, role: 'ai', text: responses[Math.floor(Math.random() * responses.length)], time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => [...prev, aiMsg]);
    }, 1500);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans text-slate-800 flex flex-col h-screen max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
      
      {/* Background Glow Decorations */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-100/50 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-[#37A47C]/10 rounded-full blur-3xl -z-10"></div>

      {/* Header */}
      <header className="px-4 py-4 bg-white/80 backdrop-blur-md border-b border-emerald-100 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-2 -ml-2 text-slate-500 hover:text-emerald-700 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center relative shadow-inner overflow-hidden">
               <motion.div 
                 animate={{ rotate: [0, 15, -15, 0] }}
                 transition={{ repeat: Infinity, duration: 4 }}
               >
                 <Sparkles size={22} fill="currentColor" />
               </motion.div>
               <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
             </div>
             <div>
               <h2 className="font-bold text-[#1B4332] text-sm md:text-base leading-tight flex items-center gap-1.5">
                 Paring AI Dashboard
               </h2>
               <p className="text-[10px] md:text-xs text-[#37A47C] font-semibold flex items-center gap-1">
                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                 Smart Assistant Online
               </p>
             </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           <button className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
             Alpha Feature
           </button>
        </div>
      </header>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
        <div className="text-center my-4">
          <span className="bg-emerald-50 text-emerald-700/60 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-emerald-100/50">
            End-to-End Encrypted with AI
          </span>
        </div>
        
        <AnimatePresence>
          {messages.map((m) => (
            <motion.div 
              key={m.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex gap-3 max-w-[88%] ${m.role === 'user' ? 'self-end ml-auto justify-end' : ''}`}
            >
              {m.role === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white shrink-0 flex items-center justify-center self-end shadow-lg shadow-emerald-200">
                  <Sparkles size={16} />
                </div>
              )}
              
              <div className="flex flex-col">
                <div className={`p-4 rounded-2xl shadow-sm leading-relaxed text-sm font-light ${
                  m.role === 'user' 
                    ? 'bg-[#1B4332] text-white rounded-br-none' 
                    : 'bg-white border border-emerald-50 text-slate-700 rounded-bl-none'
                }`}>
                  {m.text}
                </div>
                <p className={`text-[10px] text-slate-400 mt-1.5 font-medium ${m.role === 'user' ? 'text-right mr-1' : 'ml-1'}`}>
                  {m.time} {m.role === 'user' && '· '}
                  {m.role === 'user' && <span className="text-emerald-500 uppercase tracking-tighter">Sent</span>}
                </p>
              </div>

              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-500 shrink-0 flex items-center justify-center self-end border border-slate-300">
                  <User size={16} />
                </div>
              )}
            </motion.div>
          ))}

          {isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 max-w-[80%]"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 shrink-0 flex items-center justify-center self-end border border-emerald-200">
                <Sparkles size={16} />
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-emerald-50 shadow-sm flex gap-1 items-center">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></motion.div>
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></motion.div>
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="bg-white/90 backdrop-blur-xl border-t border-emerald-100 px-4 py-4 pb-8 z-50">
        <div className="max-w-3xl mx-auto space-y-4">
          
          {/* Suggestions Layer */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 px-1">
            {suggestions.map((s, idx) => (
              <button 
                key={idx}
                onClick={() => handleSend(s.text)}
                className="flex items-center gap-2 whitespace-nowrap bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold px-4 py-2 rounded-xl border border-emerald-100 transition-all active:scale-95"
              >
                <s.icon size={14} className="text-emerald-500" />
                {s.text}
              </button>
            ))}
          </div>

          <div className="flex items-end gap-2">
            <div className="flex-1 bg-[#F8FAFC] border border-emerald-100 rounded-[1.5rem] flex items-end px-4 py-2.5 focus-within:border-emerald-500 transition-colors shadow-inner">
              <textarea 
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Tanya apapun tentang layanan Paring..." 
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-slate-800 resize-none max-h-32 p-1 min-h-[24px]"
                rows={1}
              />
            </div>
            
            <button 
              onClick={() => handleSend()}
              disabled={!msg.trim()}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shrink-0 shadow-lg
               ${msg.trim() ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-emerald-100 text-emerald-400 opacity-50 cursor-not-allowed'}`}
            >
              <Send size={20} className={msg.trim() ? "ml-0.5" : ""} />
            </button>
          </div>
          
          <p className="text-[9px] text-center text-slate-400 uppercase tracking-widest font-bold">
            Paring AI dapat membuat kesalahan. Periksa info penting.
          </p>
        </div>
      </div>
      
    </div>
  );
}
