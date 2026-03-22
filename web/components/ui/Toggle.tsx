"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';

export interface ToggleProps {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export function Toggle({ label, checked = false, onChange }: ToggleProps) {
  const [internalChecked, setInternalChecked] = useState(checked);
  
  const isChecked = onChange ? checked : internalChecked;
  const handleChange = () => {
    if (onChange) {
      onChange(!isChecked);
    } else {
      setInternalChecked(!isChecked);
    }
  };

  return (
    <motion.div 
      whileHover={{ x: 5 }} 
      className="flex items-center gap-3 cursor-pointer"
      onClick={handleChange}
    >
      <div className={`w-12 h-7 rounded-full relative shadow-inner transition-colors ${isChecked ? 'bg-[#37A47C]' : 'bg-slate-200'}`}>
        <motion.div 
          layout
          animate={{ x: isChecked ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
          className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm"
        />
      </div>
      <span className="text-slate-700 font-medium">{label}</span>
    </motion.div>
  );
}
