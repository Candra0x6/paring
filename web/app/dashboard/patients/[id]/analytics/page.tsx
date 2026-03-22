'use client';

import Link from 'next/link';
import { ArrowLeft, TrendingUp, TrendingDown, Activity, Brain, CheckCircle2, ChevronRight, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PatientAnalyticsPage() {
  const chartData = [
    { name: 'W1', sistolik: 135, diastolik: 85 },
    { name: 'W2', sistolik: 130, diastolik: 82 },
    { name: 'W3', sistolik: 138, diastolik: 88 },
    { name: 'W4', sistolik: 128, diastolik: 80 },
    { name: 'Skrg', sistolik: 125, diastolik: 78 },
  ];

  return (
    <div className="bg-[#FBF9F6] min-h-screen font-sans text-slate-800 pb-20 flex flex-col">
      
      {/* Header Profile */}
      <header className="px-6 py-6 pb-4 bg-white border-b border-slate-100 flex items-center gap-4 sticky top-0 z-50">
         <Link href="/dashboard/patients/1" className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-500 transition-colors">
            <ArrowLeft size={20} />
         </Link>
         <div>
            <h1 className="font-serif text-xl font-bold text-[#1B4332]">Analisis & Tren</h1>
            <p className="text-xs text-slate-500 font-bold mt-0.5">Ibu Kartini • 1 Bulan Terakhir</p>
         </div>
      </header>

      <div className="flex-1 p-6 space-y-6">
        
        {/* PARING AI Care Insights */}
        <div className="bg-gradient-to-br from-[#1B4332] to-[#0f2e20] rounded-[2rem] p-6 text-white shadow-xl shadow-[#1B4332]/20 relative overflow-hidden ring-1 ring-[#37A47C]/30">
           <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#37A47C] rounded-full blur-2xl opacity-40"></div>
           
           <div className="flex items-center gap-2 mb-4 relative z-10">
             <div className="bg-[#E2F1EC]/20 p-2 rounded-xl backdrop-blur-sm border border-white/10">
               <Brain size={20} className="text-emerald-300" />
             </div>
             <h2 className="font-bold text-lg text-emerald-50">Insight AI PARING</h2>
           </div>
           
           <div className="relative z-10">
             <p className="text-sm text-emerald-100/90 leading-relaxed font-light mb-4">
               Kondisi Ibu Kartini menunjukkan **peningkatan stabilitas 15%** minggu ini. Tensi darah rata-rata membaik menjadi <span className="font-bold text-white">125/82 mmHg</span>. Mood dominan ceria.
             </p>
             
             <div className="space-y-2">
               <div className="bg-black/20 backdrop-blur border border-white/10 rounded-2xl p-3 flex gap-3 text-xs text-emerald-50 items-start">
                 <CheckCircle2 size={16} className="text-[#37A47C] shrink-0 mt-0.5" />
                 <p><span className="font-bold text-white">Rekomendasi Diet:</span> Kurangi asupan garam harian maksimal 1 sdt untu menjaga tensi.</p>
               </div>
               <div className="bg-black/20 backdrop-blur border border-white/10 rounded-2xl p-3 flex gap-3 text-xs text-emerald-50 items-start">
                 <CheckCircle2 size={16} className="text-[#37A47C] shrink-0 mt-0.5" />
                 <p><span className="font-bold text-white">Aktivitas Fikisk:</span> Jalan kaki ringan 15 menit setiap pagi untuk sirkulasi darah.</p>
               </div>
             </div>
           </div>
        </div>

        {/* BP Trend Graph Mockup */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
           <div className="flex justify-between items-center mb-6">
             <div>
               <h3 className="font-bold text-[#1B4332] flex items-center gap-2">
                 <Activity size={18} className="text-[#37A47C]" />
                 Tren Tekanan Darah
               </h3>
               <p className="text-[10px] text-slate-400 font-bold mt-1">Sistolik & Diastolik (Agustus)</p>
             </div>
             <div className="bg-[#E2F1EC] text-[#37A47C] px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
               <TrendingDown size={14} /> -5%
             </div>
           </div>
           
           {/* Recharts Component */}
           <div className="h-[200px] w-full mt-4 -ml-4">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart
                 data={chartData}
                 margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
               >
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis 
                   dataKey="name" 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} 
                   dy={10}
                 />
                 <YAxis 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                   domain={[60, 160]}
                   ticks={[80, 100, 120, 140]}
                 />
                 <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                   labelStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#1B4332' }}
                   itemStyle={{ fontSize: '12px', fontWeight: '600' }}
                 />
                 <Line 
                   type="monotone" 
                   dataKey="sistolik" 
                   name="Sistolik"
                   stroke="#ff4d4f" 
                   strokeWidth={3}
                   dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#ff4d4f' }}
                   activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} 
                 />
                 <Line 
                   type="monotone" 
                   dataKey="diastolik" 
                   name="Diastolik"
                   stroke="#37A47C" 
                   strokeWidth={3}
                   dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#37A47C' }}
                   activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} 
                 />
               </LineChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Mood Trend */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
           <div className="flex justify-between items-center mb-6">
             <div>
               <h3 className="font-bold text-[#1B4332] flex items-center gap-2">
                 <Brain size={18} className="text-[#37A47C]" />
                 Tren Mood & Emosi
               </h3>
             </div>
           </div>
           
           <div className="flex items-center justify-between px-2 relative">
             <div className="absolute top-1/2 left-6 right-6 h-1 bg-slate-50 -translate-y-1/2 -z-10"></div>
             
             <div className="flex flex-col items-center gap-2">
               <span className="text-2xl">😊</span>
               <span className="text-[10px] text-slate-400 font-bold">W1</span>
             </div>
             <div className="flex flex-col items-center gap-2">
               <span className="text-2xl">😑</span>
               <span className="text-[10px] text-slate-400 font-bold">W2</span>
             </div>
             <div className="flex flex-col items-center gap-2">
               <span className="text-2xl opacity-50 grayscale">😔</span>
               <span className="text-[10px] text-slate-400 font-bold">W3</span>
             </div>
             <div className="flex flex-col items-center gap-2">
               <span className="text-2xl">😊</span>
               <span className="text-[10px] text-slate-400 font-bold">W4</span>
             </div>
             <div className="flex flex-col items-center gap-2">
               <div className="w-10 h-10 rounded-full bg-[#E2F1EC] flex items-center justify-center border-2 border-white shadow-sm">
                 <span className="text-2xl">😄</span>
               </div>
               <span className="text-[10px] text-[#37A47C] font-bold">Skrg</span>
             </div>
           </div>
        </div>

        {/* Observasi Perawat */}
        <div className="bg-[#F8FAFC] rounded-[2rem] p-6 border border-slate-100">
           <h3 className="font-bold text-[#1B4332] mb-4 flex items-center gap-2">
             <Stethoscope size={18} className="text-[#37A47C]" />
             Ringkasan Observasi Perawat
           </h3>
           <p className="text-sm text-slate-600 font-light leading-relaxed mb-4">
             "Pada 4 sesi terakhir, lansia menunjukkan nafsu makan yang membaik. Namun pada sesi malam sering mengeluh nyeri sendi ringan. Disarankan fisioterapi pasif."
           </p>
           <Link href="/dashboard/patients/1" className="text-xs font-bold text-[#37A47C] flex items-center gap-1">
             Lihat di Riwayat Perawatan <ChevronRight size={14} />
           </Link>
        </div>

      </div>
    </div>
  );
}
