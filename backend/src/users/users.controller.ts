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

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
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

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users found successfully' })
  @ApiQuery({ name: 'role', required: false, enum: ['ADMIN', 'FAMILY', 'NURSE'] })
  @ApiQuery({ name: 'name', required: false, description: 'Search by full name' })
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

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found successfully' })
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    return res.status(200).json({
      message: 'User found successfully',
      data: await this.usersService.findOne(id),
    });
  }

  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
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

  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: 200, description: 'User removed successfully' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const removedUser = await this.usersService.remove(id);
    return res.status(200).json({
      message: 'User removed successfully',
      data: removedUser,
    });
  }
}
