import { z } from 'zod';

export const createActivitylogSchema = z.object({
  notes: z.string().min(1, 'Notes cannot be empty'),
  careLogId: z.uuid('careLogId must be a valid UUID'),
});

export type CreateActivitylogDto = z.infer<typeof createActivitylogSchema>;
