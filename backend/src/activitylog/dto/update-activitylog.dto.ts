import { PartialType } from '@nestjs/swagger';
import { z } from 'zod';
import {
  createActivitylogSchema,
  CreateActivitylogDto,
} from './create-activitylog.dto';

export const updateActivitylogSchema = createActivitylogSchema.partial();

export class UpdateActivitylogDto extends PartialType(CreateActivitylogDto) {}
