'use client';

import Link from 'next/link';
import { ArrowLeft, Wallet, ShieldCheck, ChevronRight, CreditCard, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function PaymentCheckoutPage() {
  return (
    <div className="bg-[#FBF9F6] min-h-screen font-sans text-slate-800 pb-28">
      
      {/* Header */}
      <header className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-50">
        <Link href="/dashboard/bookings/1" className="p-2 -ml-2 text-slate-500 hover:text-slate-800 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="font-serif text-lg font-bold text-[#1B4332]">Pilih Pembayaran</h1>
        <div className="w-8"></div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">
        
        {/* Total to pay */}
        <div className="bg-[#1B4332] rounded-[2rem] p-6 text-white text-center relative overflow-hidden shadow-lg shadow-[#1B4332]/20">
           <div className="absolute top-0 right-0 w-32 h-32 bg-[#37A47C] rounded-full blur-2xl opacity-40"></div>
           <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#37A47C] rounded-full blur-2xl opacity-20"></div>
           
           <p className="text-sm text-emerald-100/80 mb-1 relative z-10">Total Pembayaran</p>
           <h2 className="font-serif text-4xl font-bold mb-4 relative z-10">Rp 155.000</h2>
           
           <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-col gap-2 relative z-10 text-left border border-white/10">
              <div className="flex justify-between items-center text-sm">
                <span className="text-emerald-100">Layanan Visit Care (Ibu Kartini)</span>
                <span className="font-semibold">Rp 150.000</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-emerald-100">Biaya Aplikasi</span>
                <span className="font-semibold">Rp 5.000</span>
              </div>
           </div>
        </div>

        {/* Payment Methods */}
        <div>
          <h3 className="font-bold text-sm text-[#37A47C] uppercase tracking-wider mb-4 px-1">Metode Pembayaran (Midtrans)</h3>
          
          <div className="space-y-4">
            
            {/* E-Wallet */}
            <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-[#E2F1EC] text-[#37A47C] rounded-xl flex items-center justify-center">
                    <Wallet size={16} />
                  </div>
                  <h4 className="font-bold text-[#1B4332]">E-Wallet</h4>
               </div>
               
               <div className="space-y-2">
                 <label className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl cursor-pointer hover:border-[#37A47C] transition-colors group">
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-6 bg-blue-500 rounded flex items-center justify-center text-[10px] text-white font-bold italic">GoPay</div>
                     <span className="font-bold text-slate-700">GoPay</span>
                   </div>
                   <input type="radio" name="payment" className="accent-[#37A47C] w-5 h-5" defaultChecked />
                 </label>
                 
                 <label className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl cursor-pointer hover:border-[#37A47C] transition-colors group">
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-6 bg-purple-600 rounded flex items-center justify-center text-[10px] text-white font-bold italic">OVO</div>
                     <span className="font-bold text-slate-700">OVO</span>
                   </div>
                   <input type="radio" name="payment" className="accent-[#37A47C] w-5 h-5" />
                 </label>
               </div>
            </div>

            {/* Virtual Account */}
            <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-[#E2F1EC] text-[#37A47C] rounded-xl flex items-center justify-center">
                    <Landmark size={16} />
                  </div>
                  <h4 className="font-bold text-[#1B4332]">Virtual Account</h4>
               </div>
               
               <div className="space-y-2">
                 <label className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl cursor-pointer hover:border-[#37A47C] transition-colors group">
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-8 bg-blue-800 rounded text-[10px] text-white font-black flex items-center justify-center">BCA</div>
                     <span className="font-bold text-slate-700">BCA Virtual Account</span>
                   </div>
                   <input type="radio" name="payment" className="accent-[#37A47C] w-5 h-5" />
                 </label>
                 <label className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl cursor-pointer hover:border-[#37A47C] transition-colors group">
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-8 bg-orange-500 rounded text-[10px] text-white font-black flex items-center justify-center">BNI</div>
                     <span className="font-bold text-slate-700">BNI Virtual Account</span>
                   </div>
                   <input type="radio" name="payment" className="accent-[#37A47C] w-5 h-5" />
                 </label>
               </div>
            </div>

          </div>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
          <ShieldCheck size={16} className="text-[#37A47C]" />
          Pembayaran 100% aman disalurkan melalui Midtrans.
        </div>
        
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 p-4 safe-area-pb z-50">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs text-slate-500 font-medium mb-0.5">Total</p>
            <p className="font-bold text-[#1B4332] text-xl">Rp 155.000</p>
          </div>
          <Button onClick={() => window.location.href='/dashboard/payment/success'} className="h-14 px-8 justify-center rounded-2xl bg-[#37A47C] hover:bg-[#1B4332] shadow-lg shadow-[#37A47C]/20 text-lg flex-1">
            Bayar
          </Button>
        </div>
      </div>
    </div>
  );
}
