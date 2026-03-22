'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Heart, Mail, Lock, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FBF9F6] flex flex-col font-sans">
      <div className="flex-1 max-w-md w-full mx-auto px-6 py-8 flex flex-col justify-center">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-[#37A47C] rounded-2xl flex items-center justify-center text-white shadow-lg mx-auto mb-6 transform -rotate-6">
            <Heart size={32} />
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1B4332] mb-2">Selamat Datang</h1>
          <p className="text-slate-500 font-light text-sm">Masuk ke akun PARING Anda.</p>
        </div>

        {/* Form */}
        <form className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Email</label>
            <Input 
              type="email"
              icon={<Mail size={18} />}
              placeholder="Email Anda"
              required 
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5 px-1">
              <label className="block text-xs font-bold text-slate-700">Kata Sandi</label>
              <Link href="/forgot-password" className="text-xs font-medium text-[#37A47C] hover:underline">
                Lupa Sandi?
              </Link>
            </div>
            <Input 
              type="password"
              icon={<Lock size={18} />}
              placeholder="Kata Sandi Anda"
              required 
            />
          </div>

          <div className="pt-8">
            <Button type="button" onClick={() => window.location.href='/dashboard'} className="w-full h-14 justify-center text-lg bg-[#37A47C] hover:bg-[#1B4332] rounded-2xl shadow-lg shadow-[#37A47C]/20">
              Masuk
            </Button>
            
            <p className="text-center text-sm text-slate-500 mt-8 font-light">
              Belum punya akun?{' '}
              <Link href="/register" className="text-[#37A47C] font-bold hover:underline">
                Daftar sekarang
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
