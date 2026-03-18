import { PartialType } from '@nestjs/swagger';
import { CreateUserDto, CreateUserSchema } from './create-user.dto';

export const UpdateUserSchema = CreateUserSchema.partial();

export class UpdateUserDto extends PartialType(CreateUserDto) {}
