'use client';

import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowLeft,
  User,
  CheckCircle2,
  Save,
  FileText,
  Loader,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import { useAppointmentById, useCreateCareLog } from '@/lib/hooks/useApi';
import { careLogSchema, type CareLogFormData } from '@/lib/validation';
import { toast } from 'sonner';

export default function MedicalChecklistPage() {
  const router = useRouter();
  const params = useParams();
  const appointmentId = params?.id as string;
  
  const { data: appointmentData, isLoading } = useAppointmentById(appointmentId);
  const { mutate: createCareLog, isPending } = useCreateCareLog();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CareLogFormData>({
    resolver: zodResolver(careLogSchema),
  });

  const bpChecked = watch('systolic');
  const sugarChecked = watch('bloodSugar');
  const cholesterolChecked = watch('cholesterol');

  const onSubmit = (data: CareLogFormData) => {
    const appointment = appointmentData?.data;
    
    if (!appointment) {
      toast.error('Appointment data not found');
      return;
    }

    createCareLog(
      {
        appointmentId: appointment.id,
        patientId: appointment.patientId,
        nurseId: appointment.nurseId,
        systolic: data.systolic ? parseInt(data.systolic as any) : undefined,
        diastolic: data.diastolic ? parseInt(data.diastolic as any) : undefined,
        bloodSugar: data.bloodSugar ? parseFloat(data.bloodSugar as any) : undefined,
        cholesterol: data.cholesterol ? parseFloat(data.cholesterol as any) : undefined,
        uricAcid: data.uricAcid ? parseFloat(data.uricAcid as any) : undefined,
        clinicalNotes: data.clinicalNotes,
      },
      {
        onSuccess: () => {
          toast.success('Vital signs recorded successfully!');
          router.push(`/nurse/session/${appointmentId}/non-medical`);
        },
        onError: (error: any) => {
          const msg = error.response?.data?.message || 'Failed to save vital signs';
          toast.error(msg);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="bg-[#F8FAFC] min-h-screen flex items-center justify-center">
        <Loader className="animate-spin" size={40} />
      </div>
    );
  }

  const appointment = appointmentData?.data;

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans text-slate-800 pb-28">
      {/* Header */}
      <header className="px-6 py-6 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link
            href="/nurse/dashboard"
            className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-serif text-xl font-bold text-[#1B4332]">
              Checklist Medis
            </h1>
            <p className="text-xs text-slate-500 font-bold mt-0.5">
              Sesi Sedang Berjalan <span className="text-[#37A47C]">●</span>
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Patient Profile Summary */}
        {appointment && (
          <div className="bg-[#1B4332] rounded-[2rem] p-6 text-white relative overflow-hidden shadow-lg shadow-[#1B4332]/20">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#37A47C] rounded-full blur-2xl opacity-50"></div>

            <div className="flex items-center gap-4 relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10 shrink-0">
                <User size={32} />
              </div>
              <div>
                <h2 className="font-bold text-xl mb-1 text-white">Pasien</h2>
                <div className="flex flex-wrap gap-2 text-xs font-medium text-emerald-100">
                  <span className="bg-black/20 px-2.5 py-1 rounded-md">
                    {appointment.serviceType}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vital Signs Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <h3 className="font-bold text-sm text-[#37A47C] uppercase tracking-wider mb-4 px-1 flex items-center gap-2">
              <FileText size={16} /> Pemeriksaan Tanda Vital
            </h3>

            <div className="space-y-4">
              {/* Blood Pressure */}
              <div className={`p-5 rounded-3xl border transition-all ${
                bpChecked
                  ? 'bg-[#E2F1EC] border-[#37A47C]'
                  : 'bg-white border-slate-100 shadow-sm'
              }`}>
                <div className="flex items-center gap-3 mb-4 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-6 h-6 accent-[#37A47C] rounded"
                  />
                  <span className={`font-bold text-lg ${
                    bpChecked ? 'text-[#1B4332]' : 'text-slate-700'
                  }`}>
                    Tekanan Darah <span className="text-red-500">*</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pl-9">
                  <div>
                    <label className="text-xs text-slate-500 font-bold">
                      Sistolik (Atas)
                    </label>
                    <Input
                      type="number"
                      placeholder="120"
                      className="h-12 bg-white mt-1 border-slate-200"
                      {...register('systolic')}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-bold">
                      Diastolik (Bawah)
                    </label>
                    <Input
                      type="number"
                      placeholder="80"
                      className="h-12 bg-white mt-1 border-slate-200"
                      {...register('diastolic')}
                    />
                  </div>
                </div>
              </div>

              {/* Blood Sugar */}
              <div className={`p-5 rounded-3xl border transition-all ${
                sugarChecked
                  ? 'bg-[#E2F1EC] border-[#37A47C]'
                  : 'bg-white border-slate-100 shadow-sm'
              }`}>
                <div className="flex items-center gap-3 mb-4 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-6 h-6 accent-[#37A47C] rounded"
                  />
                  <span className={`font-bold text-lg ${
                    sugarChecked ? 'text-[#1B4332]' : 'text-slate-700'
                  }`}>
                    Gula Darah <span className="text-red-500">*</span>
                  </span>
                </div>

                <div className="pl-9">
                  <label className="text-xs text-slate-500 font-bold">
                    Hasil (mg/dL)
                  </label>
                  <Input
                    type="number"
                    placeholder="110"
                    className="h-12 bg-white mt-1 border-slate-200"
                    {...register('bloodSugar')}
                  />
                </div>
              </div>

              {/* Cholesterol */}
              <div className={`p-5 rounded-3xl border transition-all ${
                cholesterolChecked
                  ? 'bg-[#E2F1EC] border-[#37A47C]'
                  : 'bg-white border-slate-100 shadow-sm'
              }`}>
                <div className="flex items-center gap-3 mb-4 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-6 h-6 accent-[#37A47C] rounded"
                  />
                  <span className={`font-bold text-lg ${
                    cholesterolChecked ? 'text-[#1B4332]' : 'text-slate-700'
                  }`}>
                    Kolesterol (Opsional)
                  </span>
                </div>

                {cholesterolChecked && (
                  <div className="pl-9">
                    <label className="text-xs text-slate-500 font-bold">
                      Hasil (mg/dL)
                    </label>
                    <Input
                      type="number"
                      placeholder="180"
                      className="h-12 bg-white mt-1 border-slate-200"
                      {...register('cholesterol')}
                    />
                  </div>
                )}
              </div>

              {/* Clinical Notes */}
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <label className="block text-xs font-bold text-slate-700 mb-3">
                  Catatan Klinis
                </label>
                <Textarea
                  placeholder="Kondisi pasien, pengamatan lainnya..."
                  rows={3}
                  {...register('clinicalNotes')}
                />
              </div>
            </div>
          </div>

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
                Lanjutkan ke Non-Medis
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
