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
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { CreateUserDto, CreateUserSchema } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserSchema } from './dto/update-user.dto';
import { Response } from 'express';
import { Role } from 'generated/prisma/enums';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, CurrentUser } from '../common/decorators';
import type { JwtPayload } from '../common/decorators/current-user.decorator';

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

  @ApiOperation({ summary: 'Create a new user (Public - Registration)' })
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

  @ApiOperation({ summary: 'Get all users (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Users found successfully' })
  @ApiQuery({ name: 'role', required: false, enum: ['ADMIN', 'FAMILY', 'NURSE'] })
  @ApiQuery({ name: 'name', required: false, description: 'Search by full name' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN' as any)
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

  @ApiOperation({ summary: 'Get user by ID (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'User found successfully' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN' as any)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    return res.status(200).json({
      message: 'User found successfully',
      data: await this.usersService.findOne(id),
    });
  }

  @ApiOperation({ summary: 'Update user by ID (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN' as any)
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

  @ApiOperation({ summary: 'Delete user by ID (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'User removed successfully' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN' as any)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const removedUser = await this.usersService.remove(id);
    return res.status(200).json({
      message: 'User removed successfully',
      data: removedUser,
    });
  }
}
