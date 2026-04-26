'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Radio } from '@/components/ui/Radio';
import { Textarea } from '@/components/ui/Textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import {
  Heart,
  Mail,
  Lock,
  User,
  Phone,
  ArrowLeft,
  UserCircle,
  Briefcase,
  ChevronRight,
  Check,
  UploadCloud,
  MapPin,
  Clock,
  ShieldCheck,
  FileText,
  CreditCard,
  Award,
} from 'lucide-react';
import { useRegisterUser, useCreateNurseProfile, useLogin } from '@/lib/hooks/useApi';
import { useAuthStore } from '@/lib/auth-context';
import {
  patientRegistrationSchema,
  nurseRegistrationSchema,
  type PatientRegistrationFormData,
  type NurseRegistrationFormData,
} from '@/lib/validation';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [role, setRole] = useState<'PATIENT' | 'NURSE'>('PATIENT');
  const [step, setStep] = useState(0); // 0: Role Selection, 1+: Registration/Details
  
  // Patient Registration
  const { mutate: registerUser, isPending: isPatientPending } = useRegisterUser();
  
  // Nurse Registration
  const { mutate: createNurseProfile, isPending: isNursePending } = useCreateNurseProfile();
  const { mutate: login } = useLogin();

  // Patient Form
  const patientForm = useForm<PatientRegistrationFormData>({
    resolver: zodResolver(patientRegistrationSchema),
  });

  // Nurse Form
  const [nurseData, setNurseData] = useState({
    experience: '',
    specializations: [] as string[],
    bio: '',
    documents: {
      str: false,
      ktp: false,
      certification: false,
    },
    serviceTypes: [] as string[],
    availability: '',
    location: '',
  });

  const nurseForm = useForm<NurseRegistrationFormData>({
    resolver: zodResolver(nurseRegistrationSchema),
  });

  const handleRoleSelection = (selectedRole: 'PATIENT' | 'NURSE') => {
    setRole(selectedRole);
    setStep(1);
  };

  const handlePatientRegister = (data: PatientRegistrationFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // Remove confirmPassword before sending
    const { confirmPassword, ...registerData } = data;

    registerUser(
      {
        fullName: registerData.fullName,
        email: registerData.email,
        phoneNumber: registerData.phoneNumber,
        passwordHash: registerData.password,
        role: 'FAMILY',
      },
      {
        onSuccess: (response: any) => {
          toast.success('Registrasi berhasil! Logging in...');
          
          // Auto-login
          login(
            {
              email: registerData.email,
              password: registerData.password,
            },
            {
              onSuccess: (loginResponse: any) => {
                const userId = loginResponse.data?.user?.id || 'unknown';
                setAuth('FAMILY', userId, registerData.email);
                router.push('/dashboard');
              },
              onError: () => {
                router.push('/login');
              },
            }
          );
        },
        onError: (error: any) => {
          const msg = error.response?.data?.message || 'Registrasi gagal';
          toast.error(msg);
        },
      }
    );
  };

  const handleNurseRegister = (data: NurseRegistrationFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // First, register the user as NURSE
    const { confirmPassword, specialization, experienceYears, ...userData } = data;

    registerUser(
      {
        fullName: userData.fullName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        passwordHash: userData.password,
        role: 'NURSE',
      },
      {
        onSuccess: (response: any) => {
          const userId = response.data?.user?.id;
          
          if (!userId) {
            toast.error('Failed to create user account');
            return;
          }

          // Then create nurse profile
          createNurseProfile(
            {
              userId,
              specialization,
              experienceYears,
            },
            {
              onSuccess: () => {
                toast.success('Registrasi perawat berhasil! Logging in...');
                
                // Auto-login
                login(
                  {
                    email: userData.email,
                    password: userData.password,
                  },
                  {
                    onSuccess: (loginResponse: any) => {
                      setAuth('NURSE', userId, userData.email);
                      router.push('/nurse/dashboard');
                    },
                    onError: () => {
                      router.push('/login');
                    },
                  }
                );
              },
              onError: (error: any) => {
                toast.error('Failed to create nurse profile');
              },
            }
          );
        },
        onError: (error: any) => {
          const msg = error.response?.data?.message || 'Registrasi gagal';
          toast.error(msg);
        },
      }
    );
  };

  const toggleSpecialization = (spec: string) => {
    setNurseData((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter((s) => s !== spec)
        : [...prev.specializations, spec],
    }));
  };

  // Step 0: Role Selection
  if (step === 0) {
    return (
      <div className="min-h-screen bg-[#FBF9F6] flex flex-col font-sans">
        <div className="flex-1 max-w-md w-full mx-auto px-6 py-8 flex flex-col">
          {/* Header */}
          <div className="mb-8 mt-4">
            <Link
              href="/"
              className="inline-block p-2 -ml-2 mb-4 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft size={24} />
            </Link>
            <h1 className="font-serif text-3xl font-bold text-[#1B4332] mb-2">
              Buat Akun
            </h1>
            <p className="text-slate-500 font-light text-sm">
              Bergabung dengan PARING untuk memberikan perawatan terbaik bagi
              lansia Anda.
            </p>
          </div>

          {/* Role Selection */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleRoleSelection('PATIENT')}
                className={`group relative flex flex-col items-center gap-3 p-5 rounded-[1.5rem] border-2 transition-all ${
                  role === 'PATIENT'
                    ? 'border-[#37A47C] bg-[#E2F1EC]/30'
                    : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                    role === 'PATIENT'
                      ? 'bg-[#37A47C] text-white shadow-lg shadow-[#37A47C]/20'
                      : 'bg-white text-slate-400'
                  }`}
                >
                  <UserCircle size={28} />
                </div>
                <div className="text-center">
                  <p
                    className={`text-sm font-bold ${
                      role === 'PATIENT'
                        ? 'text-[#1B4332]'
                        : 'text-slate-500'
                    }`}
                  >
                    Keluarga
                  </p>
                  <p
                    className={`text-[10px] mt-0.5 ${
                      role === 'PATIENT'
                        ? 'text-[#37A47C]'
                        : 'text-slate-400'
                    }`}
                  >
                    Cari Perawat
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelection('NURSE')}
                className={`group relative flex flex-col items-center gap-3 p-5 rounded-[1.5rem] border-2 transition-all ${
                  role === 'NURSE'
                    ? 'border-[#37A47C] bg-[#E2F1EC]/30'
                    : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                    role === 'NURSE'
                      ? 'bg-[#37A47C] text-white shadow-lg shadow-[#37A47C]/20'
                      : 'bg-white text-slate-400'
                  }`}
                >
                  <Briefcase size={28} />
                </div>
                <div className="text-center">
                  <p
                    className={`text-sm font-bold ${
                      role === 'NURSE'
                        ? 'text-[#1B4332]'
                        : 'text-slate-500'
                    }`}
                  >
                    Perawat
                  </p>
                  <p
                    className={`text-[10px] mt-0.5 ${
                      role === 'NURSE'
                        ? 'text-[#37A47C]'
                        : 'text-slate-400'
                    }`}
                  >
                    Beri Layanan
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Patient Registration Form
  if (step === 1 && role === 'PATIENT') {
    return (
      <div className="min-h-screen bg-[#FBF9F6] flex flex-col font-sans">
        <div className="flex-1 max-w-md w-full mx-auto px-6 py-8 flex flex-col">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => setStep(0)}
              className="p-2 -ml-2 mb-4 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="font-serif text-3xl font-bold text-[#1B4332] mb-2">
              Daftar Sebagai Keluarga
            </h1>
            <p className="text-slate-500 font-light text-sm">
              Isi data diri Anda untuk membuat akun.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={patientForm.handleSubmit(handlePatientRegister)}
            className="space-y-4 flex-1"
          >
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
                Nama Lengkap
              </label>
              <Input
                icon={<User size={18} />}
                placeholder="Mis. Budi Santoso"
                {...patientForm.register('fullName')}
              />
              {patientForm.formState.errors.fullName && (
                <p className="text-red-500 text-xs mt-1">
                  {patientForm.formState.errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
                Email
              </label>
              <Input
                type="email"
                icon={<Mail size={18} />}
                placeholder="budi@example.com"
                {...patientForm.register('email')}
              />
              {patientForm.formState.errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {patientForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
                Nomor WhatsApp
              </label>
              <Input
                type="tel"
                icon={<Phone size={18} />}
                placeholder="0812xxxxxx"
                {...patientForm.register('phoneNumber')}
              />
              {patientForm.formState.errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {patientForm.formState.errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
                Kata Sandi
              </label>
              <Input
                type="password"
                icon={<Lock size={18} />}
                placeholder="Minimal 6 karakter"
                {...patientForm.register('password')}
              />
              {patientForm.formState.errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {patientForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
                Konfirmasi Kata Sandi
              </label>
              <Input
                type="password"
                icon={<Lock size={18} />}
                placeholder="Ulangi kata sandi"
                {...patientForm.register('confirmPassword')}
              />
              {patientForm.formState.errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {patientForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="pt-6 pb-8 mt-auto">
              <Button
                type="submit"
                disabled={isPatientPending}
                className="w-full h-14 justify-center text-lg bg-[#37A47C] hover:bg-[#1B4332] rounded-2xl shadow-lg shadow-[#37A47C]/20 disabled:opacity-50"
              >
                {isPatientPending ? 'Mendaftar...' : 'Daftar Sekarang'}
              </Button>

              <p className="text-center text-sm text-slate-500 mt-6 font-light">
                Sudah punya akun?{' '}
                <Link
                  href="/login"
                  className="text-[#37A47C] font-bold hover:underline"
                >
                  Masuk di sini
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Step 1: Nurse Registration Form
  if (step === 1 && role === 'NURSE') {
    return (
      <div className="min-h-screen bg-[#FBF9F6] flex flex-col font-sans">
        <div className="flex-1 max-w-md w-full mx-auto px-6 py-8 flex flex-col">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => setStep(0)}
              className="p-2 -ml-2 mb-4 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="font-serif text-3xl font-bold text-[#1B4332] mb-2">
              Daftar Sebagai Perawat
            </h1>
            <p className="text-slate-500 font-light text-sm">
              Isi data diri Anda untuk membuat akun perawat.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={nurseForm.handleSubmit(handleNurseRegister)}
            className="space-y-4 flex-1"
          >
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
                Nama Lengkap
              </label>
              <Input
                icon={<User size={18} />}
                placeholder="Mis. Siti Nurhaliza"
                {...nurseForm.register('fullName')}
              />
              {nurseForm.formState.errors.fullName && (
                <p className="text-red-500 text-xs mt-1">
                  {nurseForm.formState.errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
                Email
              </label>
              <Input
                type="email"
                icon={<Mail size={18} />}
                placeholder="siti@example.com"
                {...nurseForm.register('email')}
              />
              {nurseForm.formState.errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {nurseForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
                Nomor WhatsApp
              </label>
              <Input
                type="tel"
                icon={<Phone size={18} />}
                placeholder="0812xxxxxx"
                {...nurseForm.register('phoneNumber')}
              />
              {nurseForm.formState.errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {nurseForm.formState.errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
                Kata Sandi
              </label>
              <Input
                type="password"
                icon={<Lock size={18} />}
                placeholder="Minimal 6 karakter"
                {...nurseForm.register('password')}
              />
              {nurseForm.formState.errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {nurseForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
                Konfirmasi Kata Sandi
              </label>
              <Input
                type="password"
                icon={<Lock size={18} />}
                placeholder="Ulangi kata sandi"
                {...nurseForm.register('confirmPassword')}
              />
              {nurseForm.formState.errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {nurseForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
                Spesialisasi
              </label>
              <Input
                placeholder="Mis. Caregiver, Nurse, Physiotherapist"
                {...nurseForm.register('specialization')}
              />
              {nurseForm.formState.errors.specialization && (
                <p className="text-red-500 text-xs mt-1">
                  {nurseForm.formState.errors.specialization.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
                Tahun Pengalaman
              </label>
              <Input
                type="number"
                placeholder="Contoh: 5"
                {...nurseForm.register('experienceYears', { valueAsNumber: true })}
              />
              {nurseForm.formState.errors.experienceYears && (
                <p className="text-red-500 text-xs mt-1">
                  {nurseForm.formState.errors.experienceYears.message}
                </p>
              )}
            </div>

            <div className="pt-6 pb-8 mt-auto">
              <Button
                type="submit"
                disabled={isNursePending}
                className="w-full h-14 justify-center text-lg bg-[#37A47C] hover:bg-[#1B4332] rounded-2xl shadow-lg shadow-[#37A47C]/20 disabled:opacity-50"
              >
                {isNursePending ? 'Mendaftar...' : 'Daftar Sekarang'}
              </Button>

              <p className="text-center text-sm text-slate-500 mt-6 font-light">
                Sudah punya akun?{' '}
                <Link
                  href="/login"
                  className="text-[#37A47C] font-bold hover:underline"
                >
                  Masuk di sini
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return null;
}
