'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Heart, Mail, Lock } from 'lucide-react';
import { useLogin } from '@/lib/hooks/useApi';
import { useAuthStore } from '@/lib/auth-context';
import { loginSchema, type LoginFormData } from '@/lib/validation';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onSuccess: (response: any) => {
        // Extract user info from response
        // Backend returns: { message, data: { userId, email, role } }
        const userRole = response.data?.role || 'FAMILY';
        const userId = response.data?.userId;
        const email = response.data?.email || data.email;

        // Validate userId is a valid UUID
        if (!userId || userId === 'unknown') {
          toast.error('Login gagal: User ID tidak valid');
          return;
        }

        // Store auth state
        setAuth(userRole, userId, email);
        toast.success('Login berhasil!');

        // Redirect based on role
        if (userRole === 'NURSE') {
          router.push('/nurse/dashboard');
        } else {
          router.push('/dashboard');
        }
      },
      onError: (error: any) => {
        const errorMsg =
          error.response?.data?.message || 'Email atau password salah';
        toast.error(errorMsg);
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#FBF9F6] flex flex-col font-sans">
      <div className="flex-1 max-w-md w-full mx-auto px-6 py-8 flex flex-col justify-center">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-[#37A47C] rounded-2xl flex items-center justify-center text-white shadow-lg mx-auto mb-6 transform -rotate-6">
            <Heart size={32} />
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1B4332] mb-2">
            Selamat Datang
          </h1>
          <p className="text-slate-500 font-light text-sm">
            Masuk ke akun PARING Anda.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
              Email
            </label>
            <Input
              type="email"
              icon={<Mail size={18} />}
              placeholder="Email Anda"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5 px-1">
              <label className="block text-xs font-bold text-slate-700">
                Kata Sandi
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-[#37A47C] hover:underline"
              >
                Lupa Sandi?
              </Link>
            </div>
            <Input
              type="password"
              icon={<Lock size={18} />}
              placeholder="Kata Sandi Anda"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="pt-8">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-14 justify-center text-lg bg-[#37A47C] hover:bg-[#1B4332] rounded-2xl shadow-lg shadow-[#37A47C]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Memproses...' : 'Masuk'}
            </Button>

            <p className="text-center text-sm text-slate-500 mt-8 font-light">
              Belum punya akun?{' '}
              <Link
                href="/register"
                className="text-[#37A47C] font-bold hover:underline"
              >
                Daftar
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
