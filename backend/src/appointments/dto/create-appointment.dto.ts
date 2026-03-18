import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatus, ServiceName, ServiceType } from 'generated/prisma/enums';
import { z } from 'zod';

export const createAppointmentSchema = z.object({
  patientId: z.uuid({ error: 'Invalid patient ID' }),
  nurseId: z.uuid({ error: 'Invalid nurse ID' }),
  status: z
    .enum(Object.values(AppointmentStatus) as [string, ...string[]], {
      error: 'Invalid status',
    })
    .default('PENDING')
    .optional(),
  serviceType: z.enum(Object.values(ServiceType) as [string, ...string[]], {
    error: 'Invalid service type',
  }),
  serviceName: z
    .enum(Object.values(ServiceName) as [string, ...string[]], {
      error: 'Invalid service name',
    })
    .default('NON_MEDIS')
    .optional(),
  dueDate: z.coerce.date({ error: 'Invalid due date' }),
  totalPrice: z
    .number({ error: 'Invalid total price' })
    .positive({ error: 'Total price must be positive' }),
});

export class CreateAppointmentDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'UUID of the patient',
  })
  patientId: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'UUID of the nurse',
  })
  nurseId: string;

  @ApiProperty({
    enum: AppointmentStatus,
    default: 'PENDING',
    required: false,
    description: 'Current status of the appointment',
  })
  status?: AppointmentStatus;

  @ApiProperty({
    enum: ServiceType,
    description: 'Type of service provided',
  })
  serviceType: ServiceType;

  @ApiProperty({
    enum: ServiceName,
    default: 'NON_MEDIS',
    required: false,
    description: 'Specific name of the service',
  })
  serviceName?: ServiceName;

  @ApiProperty({
    example: '2026-03-20T10:00:00Z',
    description: 'Scheduled date and time for the appointment',
  })
  dueDate: Date;

  @ApiProperty({
    example: 150000,
    description: 'Total price of the appointment',
  })
  totalPrice: number;
}
