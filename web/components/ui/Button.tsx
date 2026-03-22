"use client";

import React from 'react';
import { motion } from 'motion/react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'icon';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  let variantStyles = '';
  switch (variant) {
    case 'primary':
      variantStyles = 'bg-[#37A47C] text-white shadow-lg shadow-[#37A47C]/30 hover:bg-[#2A7D5E]';
      break;
    case 'secondary':
      variantStyles = 'bg-[#37A47C]/10 text-[#37A47C] font-bold hover:bg-[#37A47C]/20';
      break;
    case 'outline':
      variantStyles = 'bg-white border-2 border-slate-200 text-slate-600 font-bold hover:border-slate-300 hover:text-slate-800';
      break;
    case 'ghost':
      variantStyles = 'text-slate-500 font-bold hover:bg-slate-50';
      break;
    case 'icon':
      variantStyles = 'bg-[#37A47C] text-white shadow-lg shadow-[#37A47C]/30 hover:bg-[#2A7D5E] justify-center';
      return (
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 10 }} 
          whileTap={{ scale: 0.9 }} 
          className={`h-12 w-12 rounded-2xl transition-colors flex items-center ${variantStyles} ${className}`}
          {...(props as any)}
        >
          {children}
        </motion.button>
      );
  }

  return (
    <motion.button 
      whileHover={{ scale: 1.05 }} 
      whileTap={{ scale: 0.95 }} 
      className={`h-12 px-6 font-bold rounded-2xl transition-colors flex items-center gap-2 ${variantStyles} ${className}`}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}
