import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const RoleEnum = z.enum(['ADMIN', 'FAMILY', 'NURSE']);

export const CreateUserSchema = z.object({
  email: z.email({ message: 'Format email tidak valid' }),

  passwordHash: z
    .string({ error: 'Password wajib diisi' })
    .min(8, { message: 'Password minimal 8 karakter' }),

  fullName: z
    .string({ error: 'Nama lengkap wajib diisi' })
    .min(3, { message: 'Nama lengkap minimal 3 karakter' }),

  phoneNumber: z
    .string({ error: 'Nomor telepon wajib diisi' })
    .regex(/^(\+62|08)[0-9]{8,12}$/, {
      message: 'Format nomor telepon tidak valid (contoh: 08123456789)',
    }),

  role: RoleEnum.optional().default('FAMILY'),
});

export class CreateUserDto {
  @ApiProperty({
    example: 'nayla@example.com',
    description: 'Email address of the user',
  })
  email: string;

  @ApiProperty({
    example: 'akunayla123',
    description: 'Hashed password or plain password (depending on logic)',
  })
  passwordHash: string;

  @ApiProperty({
    example: 'Nayla Saffana',
    description: 'Full name of the user',
  })
  fullName: string;

  @ApiProperty({
    example: '+628127381286',
    description: 'Phone number in Indonesian format',
  })
  phoneNumber: string;

  @ApiProperty({
    enum: ['ADMIN', 'FAMILY', 'NURSE'],
    default: 'FAMILY',
    description: 'Role of the user',
  })
  role?: 'ADMIN' | 'FAMILY' | 'NURSE';
}
