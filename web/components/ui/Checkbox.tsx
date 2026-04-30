"use client";

import React, { useState, forwardRef } from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, onChange, disabled, ...props }, ref) => {
    const [internalChecked, setInternalChecked] = useState(props.checked === true);
    
    const isChecked = onChange ? props.checked : internalChecked;
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.checked;
      if (onChange) {
        onChange(e);
      } else {
        setInternalChecked(newValue);
      }
    };

    return (
      <motion.label 
        whileHover={{ x: disabled ? 0 : 5 }} 
        className={`flex items-center gap-3 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      >
        <input
          ref={ref}
          type="checkbox"
          checked={isChecked as boolean}
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
          {...props}
        />
        <motion.div 
          whileTap={{ scale: disabled ? 1 : 0.8 }} 
          className={
            isChecked
              ? "w-6 h-6 rounded-md bg-[#37A47C] flex items-center justify-center text-white shadow-sm"
              : "w-6 h-6 rounded-md border-2 border-slate-200 bg-white flex items-center justify-center text-transparent hover:border-[#37A47C] transition-colors"
          }
        >
          {isChecked ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
              <Check size={16} />
            </motion.div>
          ) : (
            <Check size={16} />
          )}
        </motion.div>
        <span className={`font-medium ${disabled ? 'text-slate-500' : 'text-slate-700'}`}>{label}</span>
      </motion.label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
