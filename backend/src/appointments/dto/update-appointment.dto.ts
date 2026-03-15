import { z } from 'zod';
import { createAppointmentSchema } from './create-appointment.dto';

export const updateAppointmentSchema = createAppointmentSchema.partial();

export type UpdateAppointmentDto = z.infer<typeof updateAppointmentSchema>;
