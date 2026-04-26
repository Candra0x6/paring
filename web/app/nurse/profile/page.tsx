'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  User,
  Shield,
  Award,
  MapPin,
  Camera,
  Edit3,
  Save,
  Star,
  CheckCircle2,
  Loader,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import {
  useNurseById,
  useUpdateNurseProfile,
} from '@/lib/hooks/useApi';
import { useAuthStore } from '@/lib/auth-context';
import { nurseProfileSchema, type NurseProfileFormData } from '@/lib/validation';
import { toast } from 'sonner';

export default function NurseProfile() {
  const router = useRouter();
  const { userId } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  // Fetch nurse profile
  const { data: nurseData, isLoading } = useNurseById(userId || '');
  const { mutate: updateProfile, isPending } = useUpdateNurseProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NurseProfileFormData>({
    resolver: zodResolver(nurseProfileSchema),
  });

  useEffect(() => {
    if (nurseData?.data) {
      const nurse = nurseData.data;
      reset({
        specialization: nurse.specialization || '',
        experienceYears: nurse.experienceYears || 0,
        bio: nurse.bio || '',
      });
    }
  }, [nurseData, reset]);

  const onSubmit = (data: NurseProfileFormData) => {
    if (!userId) {
      toast.error('User not authenticated');
      return;
    }

    updateProfile(
      {
        id: userId,
        data: {
          specialization: data.specialization,
          experienceYears: data.experienceYears,
        },
      },
      {
        onSuccess: () => {
          toast.success('Profil berhasil diperbarui!');
          setIsEditing(false);
        },
        onError: (error: any) => {
          const msg = error.response?.data?.message || 'Gagal memperbarui profil';
          toast.error(msg);
        },
      }
    );
  };

  const handleLogout = () => {
    const { logout } = useAuthStore.getState();
    logout();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="bg-[#FBF9F6] min-h-screen flex items-center justify-center">
        <Loader className="animate-spin" size={40} />
      </div>
    );
  }

  const nurse = nurseData?.data;

  return (
    <div className="bg-[#FBF9F6] min-h-screen font-sans text-slate-800 pb-20">
      {/* Photo Header */}
      <div className="relative h-64 bg-[#1B4332] rounded-b-[3rem] overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#37A47C] rounded-full blur-3xl opacity-30"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
          <div className="relative">
            <div className="w-28 h-28 bg-white/20 backdrop-blur-md rounded-[2.5rem] border-4 border-white/30 flex items-center justify-center text-white overflow-hidden">
              <User size={48} />
            </div>
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#37A47C] text-white rounded-2xl border-4 border-[#1B4332] flex items-center justify-center shadow-lg">
              <Camera size={18} />
            </button>
          </div>
          <h1 className="mt-4 font-serif text-2xl font-bold text-white leading-tight">
            Perawat Profesional
          </h1>
          <div className="flex items-center text-emerald-100 text-xs gap-2 mt-1">
            <span className="bg-white/10 px-3 py-1 rounded-full border border-white/10">
              {nurse?.isVerified ? 'Terverifikasi' : 'Menunggu Verifikasi'}
            </span>
            <span className="flex items-center gap-1">
              <Star
                size={12}
                fill="currentColor"
                className="text-amber-400"
              />{' '}
              {nurse?.rating || '5.0'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 -mt-6 relative z-20 space-y-6">
        {/* Verification Status Card */}
        <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#E2F1EC] text-[#37A47C] rounded-2xl flex items-center justify-center">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="font-bold text-[#1B4332]">Status Verifikasi</h3>
              <p className="text-xs text-slate-500 font-medium leading-tight">
                {nurse?.isVerified
                  ? 'Akun Anda telah terverifikasi penuh.'
                  : 'Akun Anda sedang dalam proses verifikasi.'}
              </p>
            </div>
          </div>
          {nurse?.isVerified && (
            <CheckCircle2 size={24} className="text-[#37A47C]" />
          )}
        </div>

        {/* Profile Info Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-lg text-[#1B4332]">
              Data Profesional
            </h2>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 text-[#37A47C] bg-[#E2F1EC] rounded-xl hover:bg-[#37A47C] hover:text-white transition-colors"
            >
              <Edit3 size={18} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1 uppercase tracking-widest">
                Spesialisasi
              </label>
              <Input
                placeholder="Mis. Caregiver, Nurse, Physiotherapist"
                disabled={!isEditing}
                {...register('specialization')}
                className={!isEditing ? 'bg-slate-50/50 border-transparent text-slate-600' : ''}
              />
              {errors.specialization && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.specialization.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1 uppercase tracking-widest">
                  Pengalaman (Tahun)
                </label>
                <Input
                  type="number"
                  disabled={!isEditing}
                  {...register('experienceYears', { valueAsNumber: true })}
                  className={!isEditing ? 'bg-slate-50/50 border-transparent text-slate-600' : ''}
                />
                {errors.experienceYears && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.experienceYears.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1 uppercase tracking-widest">
                  Bio / Ringkasan
                </label>
                <Textarea
                  placeholder="Ceritakan pengalaman Anda..."
                  rows={3}
                  disabled={!isEditing}
                  {...register('bio')}
                  className={!isEditing ? 'bg-slate-50/50 border-transparent text-slate-600' : ''}
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-14 justify-center bg-[#37A47C] hover:bg-[#1B4332] rounded-2xl shadow-lg shadow-[#37A47C]/20 disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader size={20} className="mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save size={20} className="mr-2" />
                  Simpan Profil
                </>
              )}
            </Button>
          )}
        </form>

        <button
          onClick={handleLogout}
          className="w-full py-4 text-red-500 font-bold text-sm hover:bg-red-50 rounded-2xl transition-colors uppercase tracking-widest"
        >
          Keluar dari Akun
        </button>
      </div>
    </div>
  );
}
