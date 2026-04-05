'use client';

import { Smartphone, MonitorOff, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

export default function MobileOnlyPage() {
  return (
    <div className="min-h-screen bg-[#FBF9F6] flex flex-col items-center justify-center p-8 text-center">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#37A47C]/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#1B4332]/5 rounded-full blur-3xl -z-10"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="relative w-24 h-24 mx-auto mb-8">
          <motion.div
            animate={{
              rotate: [0, -10, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="w-full h-full bg-[#E2F1EC] rounded-[2.5rem] flex items-center justify-center text-[#37A47C] shadow-inner"
          >
            <Smartphone size={48} />
          </motion.div>
          <div className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full border-4 border-[#FBF9F6] shadow-lg">
            <MonitorOff size={20} />
          </div>
        </div>

        <h1 className="font-serif text-3xl font-bold text-[#1B4332] mb-4 leading-tight">
          Gunakan Handphone Anda
        </h1>

        <p className="text-slate-500 font-light mb-10 leading-relaxed text-sm">
          Maaf, saat ini <span className="font-bold text-[#37A47C]">PARING App</span> hanya dioptimalkan untuk akses melalui perangkat seluler (handphone).
          Silakan buka link ini kembali di browser handphone Anda untuk mendapatkan pengalaman terbaik.
        </p>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm mb-10">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Tips Akses</p>
          <ul className="text-left space-y-3 text-xs text-slate-600">
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 bg-[#E2F1EC] text-[#37A47C] rounded-full flex items-center justify-center shrink-0 font-bold">1</span>
              <span>Buka link <code className="bg-slate-50 px-1 rounded text-[#37A47C] font-bold">paring.id</code> di browser HP.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 bg-[#E2F1EC] text-[#37A47C] rounded-full flex items-center justify-center shrink-0 font-bold">2</span>
              <span>Scan QR Code atau ketik manual alamat web kami.</span>
            </li>
          </ul>
        </div>

        <Button
          onClick={() => window.location.href = '/'}
          variant="outline"
          className="w-full h-14 justify-center rounded-2xl border-slate-200 text-slate-500"
        >
          <ArrowLeft size={18} className="mr-2" />
          Kembali ke Landing Page
        </Button>
      </motion.div>

      <footer className="mt-16">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">PARING | Homecare Lansia Platform</p>
      </footer>
    </div>
  );
}
