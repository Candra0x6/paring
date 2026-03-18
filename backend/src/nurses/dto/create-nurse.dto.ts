import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const CreateNurseSchema = z.object({
  userId: z.uuid({ message: 'userId harus berupa UUID yang valid' }),
  specialization: z.string().min(1, { message: 'Specialization wajib diisi' }),
  experienceYears: z
    .number()
    .int()
    .min(0, { message: 'Pengalaman harus angka positif' }),
});

export class CreateNurseDto {
  @ApiProperty({
    example: '851cb73f-eae4-45f6-b730-757c0a0fbeb7',
    description: 'User ID of the nurse',
  })
  userId: string;

  @ApiProperty({
    example: 'Caregiver',
    description: 'Nurse specialization',
  })
  specialization: string;

  @ApiProperty({
    example: 4,
    description: 'Years of experience',
  })
  experienceYears: number;
}
