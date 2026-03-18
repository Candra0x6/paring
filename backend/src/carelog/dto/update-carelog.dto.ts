import { PartialType } from '@nestjs/swagger';
import { CreateCarelogDto } from './create-carelog.dto';
import { z } from 'zod';
import { createCarelogSchema } from './create-carelog.dto';

export const updateCarelogSchema = createCarelogSchema.partial();

export class UpdateCarelogDto extends PartialType(CreateCarelogDto) {}
