import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateNurseDto, CreateNurseSchema } from './create-nurse.dto';

export const UpdateNurseSchema = CreateNurseSchema.omit({ userId: true }).partial();

export class UpdateNurseDto extends PartialType(
  OmitType(CreateNurseDto, ['userId'] as const),
) {}
