import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const createCarelogSchema = z.object({
  appointmentId: z.uuid({ message: 'Invalid appointment ID' }),
  patientId: z.uuid({ message: 'Invalid patient ID' }),
  nurseId: z.uuid({ message: 'Invalid nurse ID' }),
  systolic: z.number().int().positive().optional(),
  diastolic: z.number().int().positive().optional(),
  bloodSugar: z.number().positive().optional(),
  cholesterol: z.number().positive().optional(),
  uricAcid: z.number().positive().optional(),
  woundCondition: z.string().optional(),
  moodScore: z.number().int().min(1).max(5).optional(),
  clinicalNotes: z.string().optional(),
});

export class CreateCarelogDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'UUID of the related appointment',
  })
  appointmentId: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'UUID of the patient',
  })
  patientId: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440002',
    description: 'UUID of the nurse',
  })
  nurseId: string;

  @ApiProperty({
    example: 120,
    description: 'Systolic blood pressure',
    required: false,
  })
  systolic?: number;

  @ApiProperty({
    example: 80,
    description: 'Diastolic blood pressure',
    required: false,
  })
  diastolic?: number;

  @ApiProperty({
    example: 110.5,
    description: 'Blood sugar level',
    required: false,
  })
  bloodSugar?: number;

  @ApiProperty({
    example: 180.2,
    description: 'Cholesterol level',
    required: false,
  })
  cholesterol?: number;

  @ApiProperty({
    example: 6.5,
    description: 'Uric acid level',
    required: false,
  })
  uricAcid?: number;

  @ApiProperty({
    example: 'Healing well',
    description: 'Description of wound condition',
    required: false,
  })
  woundCondition?: string;

  @ApiProperty({
    example: 4,
    description: 'Mood score (1-5)',
    required: false,
  })
  moodScore?: number;

  @ApiProperty({
    example: 'Patient is showing improvement',
    description: 'General clinical notes',
    required: false,
  })
  clinicalNotes?: string;
}
