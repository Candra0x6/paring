'use client';

import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  CheckCircle2,
  Save,
  FileText,
  Loader,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { useAppointmentById, useCreateActivityLog } from '@/lib/hooks/useApi';
import { activityLogSchema, type ActivityLogFormData } from '@/lib/validation';
import { toast } from 'sonner';

const ACTIVITIES = [
  {
    key: 'adl',
    title: 'Activity Daily Living (ADL)',
    desc: 'Membantu makan, mandi, berpakaian, dan mobilisasi ringan di dalam rumah.',
    price: 'Rp 50.000',
  },
  {
    key: 'emotional',
    title: 'Dukungan Emosional & Aktif',
    desc: 'Berbincang, mendengarkan keluh kesah, dan memberikan motivasi positif.',
    price: 'Rp 30.000',
  },
  {
    key: 'physical',
    title: 'Aktivitas Fisik Ringan',
    desc: 'Senam ringan, jalan kaki, atau terapi gerakan sesuai kemampuan.',
    price: 'Rp 40.000',
  },
];

export default function NurseNonMedicalChecklistPage() {
  const router = useRouter();
  const params = useParams();
  const appointmentId = params?.id as string;

  const { data: appointmentData, isLoading } = useAppointmentById(appointmentId);
  const { mutate: createActivityLog, isPending } = useCreateActivityLog();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ActivityLogFormData>({
    resolver: zodResolver(activityLogSchema),
  });

  const notes = watch('notes');

  const onSubmit = (data: ActivityLogFormData) => {
    if (!appointmentData?.data?.id) {
      toast.error('Appointment data not found');
      return;
    }

    createActivityLog(
      {
        notes: data.notes,
        careLogId: appointmentData.data.id,
      },
      {
        onSuccess: () => {
          toast.success('Activity log recorded successfully!');
          router.push(`/nurse/dashboard`);
        },
        onError: (error: any) => {
          const msg = error.response?.data?.message || 'Failed to save activity log';
          toast.error(msg);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="bg-[#FBF9F6] min-h-screen flex items-center justify-center">
        <Loader className="animate-spin" size={40} />
      </div>
    );
  }

  const appointment = appointmentData?.data;

  return (
    <div className="bg-[#FBF9F6] min-h-screen font-sans text-slate-800 pb-28">
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
              Checklist Non-Medis
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
                    {appointment.serviceName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Non-Medical Tasks Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <h3 className="font-bold text-sm text-[#37A47C] uppercase tracking-wider mb-4 px-1 flex items-center gap-2">
              <FileText size={16} /> Aktivitas Pendampingan
            </h3>

            <div className="space-y-4">
              {ACTIVITIES.map((activity) => (
                <div
                  key={activity.key}
                  className="p-5 rounded-3xl border border-slate-100 bg-white shadow-sm hover:border-[#37A47C] transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-6 h-6 accent-[#37A47C] rounded"
                        defaultChecked={
                          activity.key === 'adl' || activity.key === 'emotional'
                        }
                      />
                      <span className="font-bold text-lg text-[#1B4332]">
                        {activity.title}
                      </span>
                    </label>
                    <div className="bg-[#E2F1EC] text-[#37A47C] text-[10px] px-2 py-1 rounded-lg font-black tracking-wider">
                      {activity.price}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 ml-9 leading-relaxed">
                    {activity.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Notes */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
            <label className="block text-xs font-bold text-slate-700 mb-3">
              Catatan Kegiatan <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Deskripsikan aktivitas pendampingan yang dilakukan hari ini..."
              rows={4}
              {...register('notes')}
            />
            {errors.notes && (
              <p className="text-red-500 text-xs mt-1">{errors.notes.message}</p>
            )}
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
                <CheckCircle2 size={20} className="mr-2" />
                Selesaikan Sesi
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
