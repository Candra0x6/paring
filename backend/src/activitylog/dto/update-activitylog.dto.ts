import { z } from 'zod';
import { createActivitylogSchema } from './create-activitylog.dto';

export const updateActivitylogSchema = createActivitylogSchema.partial();

export type UpdateActivitylogDto = z.infer<typeof updateActivitylogSchema>;
