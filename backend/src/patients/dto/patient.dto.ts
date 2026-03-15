import { z } from 'zod';

export const createPatientSchema = z.object({
  familyId: z.uuid({ message: 'familyId harus berupa UUID yang valid' }),
  name: z.string().min(1, { message: 'Nama tidak boleh kosong' }),
  dateOfBirth: z.coerce.date({
    message:
      'dateOfBirth harus berupa string tanggal yang valid (contoh: 1990-01-01)',
  }),
  weight: z
    .number()
    .positive({ message: 'Berat badan harus positif' })
    .optional(),
  height: z
    .number()
    .positive({ message: 'Tinggi badan harus positif' })
    .optional(),
  medicalHistory: z.array(z.string()).optional(),
});

export const updatePatientSchema = createPatientSchema.partial();

export const getPatientsFilterSchema = z.object({
  name: z.string().optional(),
  hasAppointments: z.enum(['true', 'false']).optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'ONGOING', 'COMPLETED', 'CANCELLED']).optional(),
});

export type CreatePatientDto = z.infer<typeof createPatientSchema>;
export type UpdatePatientDto = z.infer<typeof updatePatientSchema>;
export type GetPatientsFilterDto = z.infer<typeof getPatientsFilterSchema>;
