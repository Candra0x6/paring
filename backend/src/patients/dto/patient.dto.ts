import { ApiProperty, PartialType } from '@nestjs/swagger';
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

export class CreatePatientDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'UUID of the family the patient belongs to',
  })
  familyId: string;

  @ApiProperty({
    example: 'Airlangga Pradana',
    description: 'Full name of the patient',
  })
  name: string;

  @ApiProperty({
    example: '2000-01-01',
    description: 'Date of birth of the patient',
  })
  dateOfBirth: Date;

  @ApiProperty({
    example: 65,
    description: 'Weight of the patient in kg',
    required: false,
  })
  weight?: number;

  @ApiProperty({
    example: 175,
    description: 'Height of the patient in cm',
    required: false,
  })
  height?: number;

  @ApiProperty({
    example: ['Hypertension', 'Diabetes'],
    description: 'Medical history of the patient',
    required: false,
  })
  medicalHistory?: string[];
}

export class UpdatePatientDto extends PartialType(CreatePatientDto) {}

export class GetPatientsFilterDto {
  @ApiProperty({
    example: 'Airlangga',
    description: 'Filter patients by name',
    required: false,
  })
  name?: string;

  @ApiProperty({
    enum: ['true', 'false'],
    description: 'Filter patients who have appointments',
    required: false,
  })
  hasAppointments?: string;

  @ApiProperty({
    enum: ['PENDING', 'CONFIRMED', 'ONGOING', 'COMPLETED', 'CANCELLED'],
    description: 'Filter patients by appointment status',
    required: false,
  })
  status?: string;
}
