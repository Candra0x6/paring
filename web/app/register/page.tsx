'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Heart, Mail, Lock, User, Phone, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#FBF9F6] flex flex-col font-sans">
      <div className="flex-1 max-w-md w-full mx-auto px-6 py-8 flex flex-col">
        {/* Header */}
        <div className="mb-8 mt-4">
          <Link href="/" className="inline-block p-2 -ml-2 mb-4 text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="font-serif text-3xl font-bold text-[#1B4332] mb-2">Buat Akun</h1>
          <p className="text-slate-500 font-light text-sm">Bergabung dengan PARING untuk memberikan perawatan terbaik bagi lansia Anda.</p>
        </div>

        {/* Form */}
        <form className="space-y-4 flex-1">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Nama Lengkap</label>
            <Input 
              icon={<User size={18} />}
              placeholder="Mis. Budi Santoso"
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Email</label>
            <Input 
              type="email"
              icon={<Mail size={18} />}
              placeholder="budi@example.com"
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Nomor WhatsApp</label>
            <Input 
              type="tel"
              icon={<Phone size={18} />}
              placeholder="0812xxxxxx"
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Kata Sandi</label>
            <Input 
              type="password"
              icon={<Lock size={18} />}
              placeholder="Minimal 8 karakter"
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Konfirmasi Kata Sandi</label>
            <Input 
              type="password"
              icon={<Lock size={18} />}
              placeholder="Masukkan ulang kata sandi"
              required 
            />
          </div>

          <div className="pt-6 pb-8 mt-auto">
            <Button type="button" onClick={() => window.location.href='/dashboard'} className="w-full h-14 justify-center text-lg bg-[#37A47C] hover:bg-[#1B4332] rounded-2xl shadow-lg shadow-[#37A47C]/20">
              Daftar Sekarang
            </Button>
            
            <p className="text-center text-sm text-slate-500 mt-6 font-light">
              Sudah punya akun?{' '}
              <Link href="/login" className="text-[#37A47C] font-bold hover:underline">
                Masuk di sini
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
