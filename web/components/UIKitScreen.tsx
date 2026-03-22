import React, { useState } from 'react';
import {
  ArrowUpDown, ChevronDown, Calendar as CalendarIcon, X, Menu,
  Search, Bell, User, Check, Settings, LogOut, Heart, Star,
  MoreVertical, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Checkbox } from './ui/Checkbox';
import { Radio } from './ui/Radio';
import { Toggle } from './ui/Toggle';
import { Navbar } from './ui/Navbar';
import { DataTable } from './ui/DataTable';
import { Modal } from './ui/Modal';
import { Drawer } from './ui/Drawer';
import { Sheet } from './ui/Sheet';
export default function UIKitScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans text-slate-800 pb-32">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="border-b border-slate-200 pb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">UI Kit & Design System</h1>
          <p className="text-slate-500">A comprehensive collection of reusable components aligned to an 8pt grid system.</p>
        </motion.div>

        {/* 1. Buttons */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <h2 className="text-xl font-bold text-slate-800 border-l-4 border-[#37A47C] pl-4">Buttons</h2>
          <div className="flex flex-wrap items-center gap-4 bg-white p-8 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <Button variant="primary">
              Primary Button
            </Button>
            <Button variant="secondary">
              Secondary Button
            </Button>
            <Button variant="outline">
              Outline Button
            </Button>
            <Button variant="ghost">
              Ghost Button
            </Button>
            <Button variant="icon">
              <Heart size={20} />
            </Button>
          </div>
        </motion.section>

        {/* 2. Form Elements */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-bold text-slate-800 border-l-4 border-[#37A47C] pl-4">Form Elements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">

            {/* Text Inputs */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Text Input</label>
                <Input
                  type="text"
                  placeholder="Enter your name"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Input with Icon</label>
                <Input
                  type="text"
                  placeholder="Search patients..."
                  icon={<Search size={20} />}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Textarea</label>
                <Textarea
                  placeholder="Enter medical notes..."
                  rows={4}
                />
              </div>
            </div>

            {/* Toggles, Checkboxes, Radios */}
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">Checkboxes</label>
                <div className="flex flex-col gap-3">
                  <Checkbox label="Selected Option" checked={true} />
                  <Checkbox label="Unselected Option" checked={false} />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">Radio Buttons</label>
                <div className="flex flex-col gap-3">
                  <Radio label="Active Radio" checked={true} />
                  <Radio label="Inactive Radio" checked={false} />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">Toggle Switch</label>
                <Toggle label="Notifications On" checked={true} />
              </div>
            </div>

          </div>
        </motion.section>

        {/* 3. Navigation & Dropdowns */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-bold text-slate-800 border-l-4 border-[#37A47C] pl-4">Navigation & Menus</h2>

          {/* Navbar */}
          <Navbar />
        </motion.section>

        {/* 4. Data Table */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-bold text-slate-800 border-l-4 border-[#37A47C] pl-4">Data Table</h2>
          <DataTable />
        </motion.section>

        {/* 5. Responsive Cards & Date Picker */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-bold text-slate-800 border-l-4 border-[#37A47C] pl-4">Cards & Date Picker</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Standard Card */}
            <motion.div whileHover={{ y: -5, boxShadow: "0 20px 40px rgb(0,0,0,0.08)" }} className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col transition-shadow">
              <div className="w-12 h-12 bg-[#37A47C]/10 rounded-2xl flex items-center justify-center text-[#37A47C] mb-4">
                <FileText size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Medical Records</h3>
              <p className="text-slate-500 text-sm font-medium mb-6 flex-1">Access all your past medical history, test results, and prescriptions in one secure place.</p>
              <button className="text-[#37A47C] font-bold text-sm flex items-center gap-1 hover:text-[#2A7D5E] transition-colors group">
                View Records <motion.div className="inline-block" whileHover={{ x: 3 }}><ChevronDown size={16} className="-rotate-90" /></motion.div>
              </button>
            </motion.div>

            {/* Profile Card */}
            <motion.div whileHover={{ y: -5, boxShadow: "0 20px 40px rgb(0,0,0,0.08)" }} className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center text-center transition-shadow">
              <img src="https://i.pravatar.cc/150?u=doctor" alt="Doctor" className="w-20 h-20 rounded-[20px] object-cover mb-4 shadow-sm" />
              <h3 className="text-lg font-bold text-slate-800 mb-1">Dr. Sarah Jenkins</h3>
              <p className="text-[#37A47C] text-sm font-bold mb-4">Neurologist</p>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-600 mb-6">
                <Star size={16} className="text-amber-400 fill-amber-400" /> 4.9 (120 reviews)
              </div>
              <motion.button whileHover={{ scale: 1.02, backgroundColor: "rgb(241 245 249)" }} whileTap={{ scale: 0.98 }} className="w-full py-3 bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors">
                View Profile
              </motion.button>
            </motion.div>

            {/* Date Picker Component */}
            <motion.div whileHover={{ y: -5, boxShadow: "0 20px 40px rgb(0,0,0,0.08)" }} className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800">October 2023</h3>
                <div className="flex gap-2">
                  <motion.button whileHover={{ scale: 1.1, backgroundColor: "rgb(248 250 252)" }} whileTap={{ scale: 0.9 }} className="p-1.5 rounded-lg text-slate-400 transition-colors"><ChevronDown size={16} className="rotate-90" /></motion.button>
                  <motion.button whileHover={{ scale: 1.1, backgroundColor: "rgb(248 250 252)" }} whileTap={{ scale: 0.9 }} className="p-1.5 rounded-lg text-slate-400 transition-colors"><ChevronDown size={16} className="-rotate-90" /></motion.button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-y-4 mb-2">
                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
                  <div key={day} className="text-center text-[11px] font-bold text-slate-400 uppercase">{day}</div>
                ))}
                {/* Empty slots for offset */}
                <div className="text-center py-1"></div>
                <div className="text-center py-1"></div>
                {/* Days */}
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(date => (
                  <div key={date} className="flex justify-center">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${date === 10 ? 'bg-[#37A47C] text-white shadow-md shadow-[#37A47C]/30' :
                          date === 9 ? 'bg-[#37A47C]/10 text-[#37A47C]' :
                            'text-slate-700 hover:bg-slate-50'
                        }`}>
                      {date}
                    </motion.button>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </motion.section>

        {/* 6. Overlays & Dialogs */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-bold text-slate-800 border-l-4 border-[#37A47C] pl-4">Overlays & Dialogs</h2>
          <div className="flex flex-wrap gap-4 bg-white p-8 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="h-12 px-6 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-700 transition-colors"
            >
              Open Modal Dialog
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setIsDrawerOpen(true)}
              className="h-12 px-6 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-700 transition-colors"
            >
              Open Slide-in Drawer
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setIsSheetOpen(true)}
              className="h-12 px-6 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-700 transition-colors"
            >
              Open Bottom Sheet
            </motion.button>
          </div>
        </motion.section>

      </div>

      {/* --- Portals / Overlays --- */}

      {/* Modal Dialog */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="w-16 h-16 bg-[#37A47C]/10 rounded-2xl flex items-center justify-center text-[#37A47C] mb-6">
          <CalendarIcon size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Confirm Appointment</h2>
        <p className="text-slate-500 font-medium mb-8 leading-relaxed">Are you sure you want to book an appointment with Dr. Kevin Bernard on Oct 10 at 10:30 AM?</p>
        <div className="flex gap-4">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setIsModalOpen(false)} className="flex-1 h-14 bg-slate-50 text-slate-700 font-bold rounded-2xl hover:bg-slate-100 transition-colors">
            Cancel
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setIsModalOpen(false)} className="flex-1 h-14 bg-[#37A47C] text-white font-bold rounded-2xl shadow-lg shadow-[#37A47C]/30 hover:bg-[#2A7D5E] transition-colors">
            Confirm
          </motion.button>
        </div>
      </Modal>

      {/* Slide-in Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Filters"
        footer={
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setIsDrawerOpen(false)} className="w-full h-14 bg-[#37A47C] text-white font-bold rounded-2xl shadow-lg shadow-[#37A47C]/30 hover:bg-[#2A7D5E] transition-colors">
            Apply Filters
          </motion.button>
        }
      >
        <div className="space-y-4">
          <h3 className="font-bold text-slate-800">Specialty</h3>
          <div className="flex flex-wrap gap-2">
            {['Cardiology', 'Dentistry', 'Neurology', 'Pediatrics'].map((tag, i) => (
              <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} key={tag} className={`px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition-colors ${i === 0 ? 'bg-[#37A47C] text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
                {tag}
              </motion.span>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-bold text-slate-800">Availability</h3>
          <Checkbox label="Available Today" checked={true} />
          <Checkbox label="Available This Week" checked={false} />
        </div>
      </Drawer>

      {/* Bottom Sheet */}
      <Sheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} title="Share Record">
        <motion.button whileHover={{ scale: 1.02, backgroundColor: "rgb(248 250 252)" }} whileTap={{ scale: 0.98 }} className="w-full p-4 flex items-center gap-4 rounded-2xl transition-colors border border-transparent hover:border-slate-100 text-left">
          <div className="w-12 h-12 bg-[#37A47C]/10 rounded-full flex items-center justify-center text-[#37A47C]">
            <User size={20} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Send to Doctor</h4>
            <p className="text-sm text-slate-500 font-medium">Share directly with your care team</p>
          </div>
        </motion.button>
        <motion.button whileHover={{ scale: 1.02, backgroundColor: "rgb(248 250 252)" }} whileTap={{ scale: 0.98 }} className="w-full p-4 flex items-center gap-4 rounded-2xl transition-colors border border-transparent hover:border-slate-100 text-left">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
            <FileText size={20} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Export as PDF</h4>
            <p className="text-sm text-slate-500 font-medium">Download a copy to your device</p>
          </div>
        </motion.button>
      </Sheet>

    </div>
  );
}
