'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  Save,
  Loader,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import {
  usePatients,
  useNurses,
  useCreateAppointment,
  usePricing,
} from '@/lib/hooks/useApi';
import { useAuthStore } from '@/lib/auth-context';
import { appointmentSchema, type AppointmentFormData } from '@/lib/validation';
import { toast } from 'sonner';

export default function NewBookingPage() {
  const router = useRouter();
  const { userId } = useAuthStore();
  const [selectedServiceType, setSelectedServiceType] = useState<string>('VISIT');
  const [notes, setNotes] = useState('');

  // Fetch patients, nurses, and pricing
  const { data: patientsData, isLoading: patientsLoading } = usePatients(userId || undefined);
  const { data: nursesData, isLoading: nursesLoading } = useNurses();
  const { data: pricingData } = usePricing();
  const { mutate: createAppointment, isPending } = useCreateAppointment();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      serviceType: 'VISIT',
      serviceName: 'NON_MEDIS',
    },
  });

  const patientId = watch('patientId');
  const serviceType = watch('serviceType');

  useEffect(() => {
    setSelectedServiceType(serviceType);
  }, [serviceType]);

  // Get pricing from API or fallback to defaults
  const servicePrices = pricingData?.data || {
    VISIT: 150000,
    LIVE_OUT: 250000,
    LIVE_IN: 400000,
  };
  
  const totalPrice = servicePrices[serviceType] || 150000;

  const onSubmit = (data: AppointmentFormData) => {
    const dueDate = new Date(`${data.dueDate}T${register('dueDate')}`);

    createAppointment(
      {
        patientName: data.patientName,
        patientId: data.patientId,
        nurseId: data.nurseId,
        serviceType: data.serviceType as 'VISIT' | 'LIVE_IN' | 'LIVE_OUT',
        serviceName: 'NON_MEDIS',
        status: 'PENDING',
        dueDate: new Date(data.dueDate + ' 10:00:00').toISOString(),
        totalPrice,
      },
      {
        onSuccess: () => {
          toast.success('Booking berhasil dibuat!');
          router.push('/dashboard/bookings');
        },
        onError: (error: any) => {
          const msg = error.response?.data?.message || 'Gagal membuat booking';
          toast.error(msg);
        },
      }
    );
  };

  const patients = patientsData?.data || [];
  const nurses = nursesData?.data || [];

  return (
    <div className="px-6 py-6 pb-32 md:pb-8 max-w-3xl mx-auto w-full min-h-screen bg-[#FBF9F6]">
      <header className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/bookings"
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 text-[#37A47C]"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1B4332]">
            Buat Booking
          </h1>
          <p className="text-sm text-slate-500 font-light mt-1">
            Cari perawat untuk pasien Anda
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Patient Name Input */}
        <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <label className="block text-xs font-bold text-[#1B4332] mb-3 uppercase tracking-wider">
            Nama Lansia (Pasien) <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('patientName')}
            placeholder="Masukkan nama lansia yang dirawat"
            className="h-14 px-4 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:outline-none focus:border-[#37A47C] transition-colors text-slate-800 font-bold"
          />
          {errors.patientName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.patientName.message}
            </p>
          )}
        </section>

        {/* Patient Selection */}
        <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <label className="block text-xs font-bold text-[#1B4332] mb-3 uppercase tracking-wider">
            Pilih Profil Pasien <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              {...register('patientId')}
              className="w-full h-14 px-4 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:outline-none focus:border-[#37A47C] transition-colors text-slate-800 appearance-none font-bold"
            >
              <option value="">
                {patientsLoading ? 'Memuat...' : 'Pilih Profil Pasien'}
              </option>
              {patients.map((patient: any) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={20}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#37A47C] pointer-events-none"
            />
          </div>
          {errors.patientId && (
            <p className="text-red-500 text-xs mt-1">
              {errors.patientId.message}
            </p>
          )}
          <Link
            href="/dashboard/patients/new"
            className="inline-block mt-3 text-sm text-[#37A47C] font-bold hover:underline"
          >
            + Tambah Profil Pasien Baru
          </Link>
        </section>

        {/* Nurse Selection */}
        <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <label className="block text-xs font-bold text-[#1B4332] mb-3 uppercase tracking-wider">
            Pilih Perawat <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              {...register('nurseId')}
              className="w-full h-14 px-4 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:outline-none focus:border-[#37A47C] transition-colors text-slate-800 appearance-none font-bold"
            >
              <option value="">
                {nursesLoading ? 'Memuat...' : 'Pilih Perawat'}
              </option>
              {nurses.map((nurse: any) => (
                <option key={nurse.id} value={nurse.id}>
                  {nurse.specialization} - {nurse.experienceYears} Tahun
                </option>
              ))}
            </select>
            <ChevronDown
              size={20}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#37A47C] pointer-events-none"
            />
          </div>
          {errors.nurseId && (
            <p className="text-red-500 text-xs mt-1">
              {errors.nurseId.message}
            </p>
          )}
        </section>

        {/* Service Type Selection */}
        <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <label className="block text-xs font-bold text-[#1B4332] mb-3 uppercase tracking-wider">
            Layanan Booking <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            {[
              {
                value: 'VISIT',
                title: 'Visit Care',
                desc: 'Pemeriksaan medis standar (Maks. 3 Jam)',
                price: 'Rp 150.000',
              },
              {
                value: 'LIVE_OUT',
                title: 'Live-Out Care',
                desc: 'Pendampingan penuh (Shift Siang 8 Jam)',
                price: 'Rp 250.000',
              },
              {
                value: 'LIVE_IN',
                title: 'Live-In Care',
                desc: 'Pendampingan 24 jam penuh',
                price: 'Rp 400.000',
              },
            ].map((service) => (
              <label
                key={service.value}
                className={`flex items-start gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                  selectedServiceType === service.value
                    ? 'border-[#37A47C] bg-[#E2F1EC]/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  {...register('serviceType')}
                  value={service.value}
                  className="mt-1 accent-[#37A47C] w-5 h-5"
                />
                <div>
                  <div className="font-bold text-[#1B4332]">{service.title}</div>
                  <div className="text-sm text-slate-600 mb-1">
                    {service.desc}
                  </div>
                  <div className="text-sm font-bold text-[#37A47C]">
                    {service.price}
                  </div>
                </div>
              </label>
            ))}
          </div>
          {errors.serviceType && (
            <p className="text-red-500 text-xs mt-1">
              {errors.serviceType.message}
            </p>
          )}
        </section>

        {/* Schedule */}
        <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <label className="block text-xs font-bold text-[#1B4332] mb-3 uppercase tracking-wider">
            Jadwal Perawatan <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5 ml-1">
                Tanggal
              </label>
              <Input
                type="date"
                {...register('dueDate')}
                className="h-14 bg-[#FBF9F6] border-slate-100 placeholder-slate-400 font-bold text-slate-700"
              />
              {errors.dueDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.dueDate.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5 ml-1">
                Jam Datang
              </label>
              <Input
                type="time"
                className="h-14 bg-[#FBF9F6] border-slate-100 font-bold text-slate-700"
                defaultValue="10:00"
              />
            </div>
          </div>
        </section>

        {/* Medical Needs / Notes */}
        <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <label className="block text-xs font-bold text-[#1B4332] mb-3 uppercase tracking-wider">
            Catatan Tambahan
          </label>
          <Textarea
            placeholder="Kondisi keluhan detail hari ini..."
            rows={3}
            className="bg-[#F8FAFC] border-slate-100 text-sm"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </section>

        {/* Spacer for fixed bottom */}
        <div className="h-8"></div>
      </form>

      {/* Final CTA Fixed to Bottom */}
      <div className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 p-4 safe-area-pb z-50">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase mb-0.5">
              Total Harga
            </div>
            <div className="font-serif text-2xl font-bold text-[#1B4332]">
              Rp {(totalPrice / 1000).toFixed(0)}K
            </div>
          </div>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
            className="h-14 px-8 justify-center rounded-2xl bg-[#37A47C] hover:bg-[#1B4332] shadow-lg shadow-[#37A47C]/20 text-lg disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader size={20} className="mr-2 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <Save size={20} className="mr-2" />
                Kirim Request
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
