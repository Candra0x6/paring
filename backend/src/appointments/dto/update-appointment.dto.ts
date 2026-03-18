import { PartialType } from '@nestjs/swagger';
import { CreateAppointmentDto, createAppointmentSchema } from './create-appointment.dto';
import { z } from 'zod';

export const updateAppointmentSchema = createAppointmentSchema.partial();

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {}
