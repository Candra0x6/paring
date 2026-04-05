'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Inbox, Calendar, User, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NurseLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/nurse/dashboard', label: 'Beranda', icon: LayoutDashboard },
    { href: '/nurse/inbox', label: 'Inbox', icon: Inbox },
    { href: '/nurse/availability', label: 'Jadwal', icon: Calendar },
    { href: '/nurse/earnings', label: 'Penghasilan', icon: Wallet },
    { href: '/nurse/profile', label: 'Profil', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#FBF9F6] font-sans text-slate-800 pb-20 md:pb-0 md:flex">

      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#37A47C]/10 fixed inset-y-0 z-50">
        <div className="p-6 border-b border-[#37A47C]/10 flex items-center gap-2">
          <div className="w-8 h-8 bg-[#37A47C] rounded-lg flex items-center justify-center text-white font-serif font-bold">P</div>
          <span className="font-serif font-bold text-xl text-[#1B4332]">PARING</span>
          <span className="ml-auto text-[10px] bg-[#E2F1EC] text-[#37A47C] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Nurse</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-[#E2F1EC] text-[#1B4332] font-semibold' : 'text-slate-500 hover:bg-slate-50'
                  }`}
              >
                <item.icon size={20} className={isActive ? 'text-[#37A47C]' : ''} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 w-full relative">
        {children}
      </main>

      {/* Mobile Bottom Navigation Component */}
      <div className="md:hidden fixed bottom-6 inset-x-6 z-50 flex justify-center">
        <nav className="bg-[#1B4332] rounded-full px-2 py-2 shadow-2xl shadow-black/60 border border-white/5 flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = item.href === '/nurse/dashboard'
              ? pathname === '/nurse/dashboard'
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative outline-none"
              >
                <motion.div
                  initial={false}
                  animate={{
                    width: isActive ? '110px' : '48px',
                    backgroundColor: isActive ? '#37A47C' : '#1B4332',
                  }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  className="flex items-center justify-center gap-2 h-12 rounded-full px-2 relative overflow-hidden"
                >
                  <item.icon
                    size={20}
                    className={`transition-colors duration-300 relative z-10 ${isActive ? 'text-white' : 'text-slate-200'}`}
                  />

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-white text-sm font-bold whitespace-nowrap relative z-10"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
