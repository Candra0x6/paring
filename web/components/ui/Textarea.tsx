"use client";

import React from 'react';
import { motion } from 'motion/react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <motion.textarea
        ref={ref}
        whileFocus={{ scale: 1.02, boxShadow: "0 0 0 2px rgba(55, 164, 124, 0.2)" }}
        className={`w-full p-4 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:outline-none focus:border-[#37A47C] transition-colors text-slate-800 placeholder:text-slate-400 resize-none ${className}`}
        {...(props as any)}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
