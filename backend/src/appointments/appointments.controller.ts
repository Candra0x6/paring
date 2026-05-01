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
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import {
  CreateAppointmentDto,
  createAppointmentSchema,
} from './dto/create-appointment.dto';
import {
  UpdateAppointmentDto,
  updateAppointmentSchema,
} from './dto/update-appointment.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { Response } from 'express';
import { AppointmentStatus } from 'generated/prisma/enums';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, CurrentUser } from '../common/decorators';
import type { JwtPayload } from '../common/decorators/current-user.decorator';

@ApiTags('Appointments')
@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new appointment (FAMILY or NURSE only)' })
  @ApiBody({ type: CreateAppointmentDto })
  @ApiResponse({ status: 201, description: 'Appointment created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @Roles('ADMIN' as any, 'FAMILY' as any, 'NURSE' as any)
  async create(
    @Body(new ZodValidationPipe(createAppointmentSchema))
    createAppointmentDto: CreateAppointmentDto,
    @Res() res: Response,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.appointmentsService.create(createAppointmentDto);
    return res.status(201).json({
      message: 'Appointment created successfully',
      data: result,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all appointments (Authenticated users only)' })
  @ApiQuery({ name: 'status', enum: AppointmentStatus, required: false, description: 'Filter by appointment status' })
  @ApiQuery({ name: 'dueDate', required: false, description: 'Filter by due date (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Appointments retrieved successfully' })
  @Roles('ADMIN' as any, 'FAMILY' as any, 'NURSE' as any)
  async findAll(
    @Res() res: Response,
    @Query('status') status?: AppointmentStatus,
    @Query('dueDate') dueDate?: string,
  ) {
    const result = await this.appointmentsService.findAll(status, dueDate);
    return res.status(200).json({
      message: 'Appointments retrieved successfully',
      data: result,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single appointment by ID (Authenticated users only)' })
  @ApiParam({ name: 'id', description: 'Appointment UUID' })
  @ApiResponse({ status: 200, description: 'Appointment retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  @Roles('ADMIN' as any, 'FAMILY' as any, 'NURSE' as any)
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const result = await this.appointmentsService.findOne(id);
    return res.status(200).json({
      message: 'Appointment retrieved successfully',
      data: result,
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an appointment (ADMIN or appointment participant only)' })
  @ApiParam({ name: 'id', description: 'Appointment UUID' })
  @ApiBody({ type: UpdateAppointmentDto })
  @ApiResponse({ status: 200, description: 'Appointment updated successfully' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  @Roles('ADMIN' as any, 'FAMILY' as any, 'NURSE' as any)
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateAppointmentSchema))
    updateAppointmentDto: UpdateAppointmentDto,
    @Res() res: Response,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.appointmentsService.update(
      id,
      updateAppointmentDto,
    );
    return res.status(200).json({
      message: 'Appointment updated successfully',
      data: result,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an appointment (ADMIN only)' })
  @ApiParam({ name: 'id', description: 'Appointment UUID' })
  @ApiResponse({ status: 200, description: 'Appointment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  @Roles('ADMIN' as any)
  async remove(@Param('id') id: string, @Res() res: Response) {
    const result = await this.appointmentsService.remove(id);
    return res.status(200).json({
      message: 'Appointment deleted successfully',
      data: result,
    });
  }
}
