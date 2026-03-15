import { AppointmentStatus, ServiceName } from 'generated/prisma/enums';
import { z } from 'zod';

export const createAppointmentSchema = z.object({
  patientId: z.uuid({ error: 'Invalid patient ID' }),
  nurseId: z.uuid({ error: 'Invalid nurse ID' }),
  status: z
    .enum(AppointmentStatus, { error: 'Invalid status' })
    .default('PENDING')
    .optional(),
  serviceType: z.enum(['VISIT', 'LIVE_IN', 'LIVE_OUT'], {
    error: 'Invalid service type',
  }),
  serviceName: z
    .enum(ServiceName, { error: 'Invalid service name' })
    .default('NON_MEDIS')
    .optional(),
  totalPrice: z.number().positive({ error: 'Total price must be positive' }),
  dueDate: z.coerce.date({ error: 'Invalid due date' }),
});

export type CreateAppointmentDto = z.infer<typeof createAppointmentSchema>;
