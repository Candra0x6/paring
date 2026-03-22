"use client";

import React from 'react';
import { motion } from 'motion/react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', icon, ...props }, ref) => {
    if (icon) {
      return (
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
          <motion.input
            ref={ref}
            whileFocus={{ scale: 1.02, boxShadow: "0 0 0 2px rgba(55, 164, 124, 0.2)" }}
            className={`w-full h-12 pl-12 pr-4 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:outline-none focus:border-[#37A47C] transition-colors text-slate-800 placeholder:text-slate-400 ${className}`}
            {...(props as any)}
          />
        </div>
      );
    }
    return (
      <motion.input
        ref={ref}
        whileFocus={{ scale: 1.02, boxShadow: "0 0 0 2px rgba(55, 164, 124, 0.2)" }}
        className={`w-full h-12 px-4 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:outline-none focus:border-[#37A47C] transition-colors text-slate-800 placeholder:text-slate-400 ${className}`}
        {...(props as any)}
      />
    );
  }
);

Input.displayName = 'Input';
