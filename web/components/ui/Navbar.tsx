"use client";

import React from 'react';
import { motion } from 'motion/react';
import { Heart, Bell } from 'lucide-react';
import { Dropdown } from './Dropdown';

export function Navbar() {
  return (
    <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }} className="w-10 h-10 bg-[#37A47C] rounded-xl flex items-center justify-center text-white">
          <Heart size={20} />
        </motion.div>
        <span className="font-bold text-lg text-slate-800">HealthApp</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8">
        <a href="#" className="text-[#37A47C] font-bold relative group">
          Dashboard
          <motion.span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#37A47C] rounded-full" layoutId="underline" />
        </a>
        <a href="#" className="text-slate-500 font-medium hover:text-slate-800 transition-colors relative group">
          Patients
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-800 rounded-full transition-all group-hover:w-full" />
        </a>
        <a href="#" className="text-slate-500 font-medium hover:text-slate-800 transition-colors relative group">
          Schedule
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-800 rounded-full transition-all group-hover:w-full" />
        </a>
      </div>

      <div className="flex items-center gap-4">
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors relative">
          <Bell size={20} />
          <motion.span 
            animate={{ scale: [1, 1.2, 1] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"
          ></motion.span>
        </motion.button>
        
        <Dropdown />
      </div>
    </div>
  );
}
