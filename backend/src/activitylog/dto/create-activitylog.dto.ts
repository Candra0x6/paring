import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const createActivitylogSchema = z.object({
  notes: z.string().min(1, 'Notes cannot be empty'),
  careLogId: z.uuid('careLogId must be a valid UUID'),
});

export class CreateActivitylogDto {
  @ApiProperty({
    example: 'Patient completed morning exercises',
    description: 'Detailed assessment or observation notes',
  })
  notes: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'UUID of the related care log',
  })
  careLogId: string;
}
