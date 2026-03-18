import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const createAuthDtoSchema = z.object({
  email: z.email('Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export class CreateAuthDto {
  @ApiProperty({
    example: 'admin@example.com',
    description: 'Email',
  })
  email: string;

  @ApiProperty({
    example: 'admin123',
    description: 'Password',
  })
  password: string;
}
