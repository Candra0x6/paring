"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, User, Settings, LogOut } from 'lucide-react';

export function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button 
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-slate-50 p-1 pr-3 rounded-full transition-colors"
      >
        <img src="https://i.pravatar.cc/150?u=annette" alt="Profile" className="w-8 h-8 rounded-full object-cover" />
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown size={16} className="text-slate-500" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 py-2 z-50"
          >
            <div className="px-4 py-3 border-b border-slate-100 mb-2">
              <p className="text-sm font-bold text-slate-800">Annette Black</p>
              <p className="text-xs text-slate-500 font-medium">annette@example.com</p>
            </div>
            <button className="w-full px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors">
              <User size={16} className="text-slate-400" /> Profile
            </button>
            <button className="w-full px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors">
              <Settings size={16} className="text-slate-400" /> Settings
            </button>
            <div className="h-px bg-slate-100 my-2"></div>
            <button className="w-full px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors">
              <LogOut size={16} className="text-red-400" /> Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
