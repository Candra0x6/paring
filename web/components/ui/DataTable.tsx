"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpDown, MoreVertical } from 'lucide-react';

export function DataTable() {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const data = [
    { name: 'Jenny Wilson', date: 'Oct 9, 2023', type: 'On-site', status: 'Confirmed', statusColor: 'bg-emerald-100 text-emerald-600' },
    { name: 'Kevin Bernard', date: 'Oct 10, 2023', type: 'Online', status: 'Pending', statusColor: 'bg-amber-100 text-amber-600' },
    { name: 'Eleanor Pena', date: 'Oct 12, 2023', type: 'On-site', status: 'Cancelled', statusColor: 'bg-red-100 text-red-600' },
  ];

  return (
    <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                <div className="flex items-center gap-2">
                  Patient Name
                  <motion.div animate={{ rotate: sortOrder === 'asc' ? 0 : 180 }}>
                    <ArrowUpDown size={14} className={sortOrder === 'asc' ? 'text-[#37A47C]' : 'text-slate-400'} />
                  </motion.div>
                </div>
              </th>
              <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
              <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row, i) => (
              <motion.tr 
                key={i} 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ backgroundColor: "rgb(248 250 252)", scale: 1.01 }}
                className="transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <img src={`https://i.pravatar.cc/150?u=${row.name}`} alt="" className="w-8 h-8 rounded-full bg-slate-100" />
                    <span className="font-bold text-slate-800 text-sm">{row.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-slate-600 font-medium">{row.date}</td>
                <td className="py-4 px-6 text-sm text-slate-600 font-medium">{row.type}</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${row.statusColor}`}>
                    {row.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <motion.button whileHover={{ scale: 1.1, backgroundColor: "rgb(239 246 255)", color: "#37A47C" }} whileTap={{ scale: 0.9 }} className="p-2 text-slate-400 rounded-lg transition-colors">
                    <MoreVertical size={18} />
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
