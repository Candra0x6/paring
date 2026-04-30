import { z } from 'zod';

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Registration Schemas
export const patientRegistrationSchema = z
  .object({
    fullName: z.string().min(2, 'Nama lengkap minimal 2 karakter'),
    email: z.string().email('Email tidak valid'),
    phoneNumber: z.string().min(10, 'Nomor telepon minimal 10 digit'),
    password: z.string().min(6, 'Kata sandi minimal 6 karakter'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const nurseRegistrationSchema = z
  .object({
    fullName: z.string().min(2, 'Nama lengkap minimal 2 karakter'),
    email: z.string().email('Email tidak valid'),
    phoneNumber: z.string().min(10, 'Nomor telepon minimal 10 digit'),
    password: z.string().min(6, 'Kata sandi minimal 6 karakter'),
    confirmPassword: z.string(),
    specialization: z.string().min(2, 'Spesialisasi wajib diisi'),
    experienceYears: z.number().min(0, 'Tahun pengalaman harus positif'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type PatientRegistrationFormData = z.infer<
  typeof patientRegistrationSchema
>;
export type NurseRegistrationFormData = z.infer<typeof nurseRegistrationSchema>;

// Patient Schemas
export const patientSchema = z.object({
  name: z.string().min(2, 'Nama pasien wajib diisi'),
  age: z.string().min(1, 'Usia wajib diisi'),
  gender: z.string().min(1, 'Jenis kelamin wajib diisi'),
  dateOfBirth: z.string().optional(),
  weight: z.string().optional(),
  height: z.string().optional(),
  medicalHistory: z.string().optional(),
  address: z.string().min(5, 'Alamat minimal 5 karakter'),
  bp_normal: z.string().optional(),
  blood_sugar: z.string().optional(),
  isDiabetes: z.boolean().optional(),
  isBedridden: z.boolean().optional(),
  allergies: z.string().optional(),
  additional_notes: z.string().optional(),
  emergency_contact: z.string().min(2, 'Nama kontak darurat wajib diisi'),
  emergency_phone: z.string().min(10, 'Nomor telepon minimal 10 digit'),
  ai_consent: z.boolean().optional(),
});

export type PatientFormData = z.infer<typeof patientSchema>;

// Appointment Schemas
export const appointmentSchema = z.object({
  patientName: z.string().min(2, 'Nama lansia wajib diisi'),
  patientId: z.string().min(1, 'Pilihan pasien wajib diisi'),
  nurseId: z.string().min(1, 'Pilihan perawat wajib diisi'),
  serviceType: z.enum(['VISIT', 'LIVE_IN', 'LIVE_OUT']).refine(
    (val) => val !== undefined,
    { message: 'Jenis layanan wajib dipilih' }
  ),
  serviceName: z.enum(['MEDIS', 'NON_MEDIS']).optional(),
  dueDate: z.string().min(1, 'Tanggal perawatan wajib diisi'),
  totalPrice: z.number().positive('Harga harus positif'),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;

// CareLog (Vital Signs) Schemas
export const careLogSchema = z.object({
  systolic: z.number().min(40).max(300).optional(),
  diastolic: z.number().min(40).max(300).optional(),
  bloodSugar: z.number().min(20).max(600).optional(),
  cholesterol: z.number().min(50).max(600).optional(),
  uricAcid: z.number().min(1).max(20).optional(),
  woundCondition: z.string().optional(),
  moodScore: z.number().min(1).max(5).optional(),
  clinicalNotes: z.string().optional(),
});

export type CareLogFormData = z.infer<typeof careLogSchema>;

// ActivityLog Schemas
export const activityLogSchema = z.object({
  notes: z.string().min(1, 'Activity notes are required'),
});

export type ActivityLogFormData = z.infer<typeof activityLogSchema>;

// Nurse Profile Schemas
export const nurseProfileSchema = z.object({
  specialization: z.string().min(2, 'Specialization is required'),
  experienceYears: z.number().min(0, 'Experience years must be positive'),
  bio: z.string().optional(),
});

export type NurseProfileFormData = z.infer<typeof nurseProfileSchema>;
