import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { CreateUserDto, CreateUserSchema } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserSchema } from './dto/update-user.dto';
import { Response } from 'express';
import { Role } from 'generated/prisma/enums';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(CreateUserSchema)) createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    return res.status(201).json({
      message: 'User created successfully',
      data: await this.usersService.create(createUserDto),
    });
  }

  @Get()
  async findAll(
    @Res() res: Response,
    @Query('role') role?: string,
    @Query('name') name?: string,
  ) {
    if (role && !Object.values(Role).includes(role as Role)) {
      throw new BadRequestException({
        statusCode: 400,
        message: `Invalid role. Valid values: ${Object.values(Role).join(', ')}`,
      });
    }
    return res.status(200).json({
      message: 'Users found successfully',
      data: await this.usersService.findAll(role as Role | undefined, name),
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    return res.status(200).json({
      message: 'User found successfully',
      data: await this.usersService.findOne(id),
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateUserSchema)) updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    const updatedUser = await this.usersService.update(id, updateUserDto);
    return res.status(200).json({
      message: 'User updated successfully',
      data: updatedUser,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const removedUser = await this.usersService.remove(id);
    return res.status(200).json({
      message: 'User removed successfully',
      data: removedUser,
    });
  }
}
