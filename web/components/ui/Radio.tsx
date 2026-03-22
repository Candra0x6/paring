"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';

export interface RadioProps {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export function Radio({ label, checked = false, onChange }: RadioProps) {
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
    <motion.label 
      whileHover={{ x: 5 }} 
      className="flex items-center gap-3 cursor-pointer"
      onClick={handleChange}
    >
      <motion.div 
        whileTap={{ scale: 0.8 }} 
        className={
          isChecked 
            ? "w-6 h-6 rounded-full border-2 border-[#37A47C] flex items-center justify-center"
            : "w-6 h-6 rounded-full border-2 border-slate-200 flex items-center justify-center hover:border-[#37A47C] transition-colors"
        }
      >
        {isChecked && (
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ type: "spring", stiffness: 300, damping: 20 }} 
            className="w-3 h-3 rounded-full bg-[#37A47C]"
          />
        )}
      </motion.div>
      <span className="text-slate-700 font-medium">{label}</span>
    </motion.label>
  );
}
