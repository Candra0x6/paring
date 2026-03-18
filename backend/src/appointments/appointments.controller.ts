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

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiBody({ type: CreateAppointmentDto })
  @ApiResponse({ status: 201, description: 'Appointment created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(
    @Body(new ZodValidationPipe(createAppointmentSchema))
    createAppointmentDto: CreateAppointmentDto,
    @Res() res: Response,
  ) {
    const result = await this.appointmentsService.create(createAppointmentDto);
    return res.status(201).json({
      message: 'Appointment created successfully',
      data: result,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all appointments' })
  @ApiQuery({ name: 'status', enum: AppointmentStatus, required: false, description: 'Filter by appointment status' })
  @ApiQuery({ name: 'dueDate', required: false, description: 'Filter by due date (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Appointments retrieved successfully' })
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
  @ApiOperation({ summary: 'Get a single appointment by ID' })
  @ApiParam({ name: 'id', description: 'Appointment UUID' })
  @ApiResponse({ status: 200, description: 'Appointment retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const result = await this.appointmentsService.findOne(id);
    return res.status(200).json({
      message: 'Appointment retrieved successfully',
      data: result,
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an appointment' })
  @ApiParam({ name: 'id', description: 'Appointment UUID' })
  @ApiBody({ type: UpdateAppointmentDto })
  @ApiResponse({ status: 200, description: 'Appointment updated successfully' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateAppointmentSchema))
    updateAppointmentDto: UpdateAppointmentDto,
    @Res() res: Response,
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
  @ApiOperation({ summary: 'Delete an appointment' })
  @ApiParam({ name: 'id', description: 'Appointment UUID' })
  @ApiResponse({ status: 200, description: 'Appointment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async remove(@Param('id') id: string, @Res() res: Response) {
    const result = await this.appointmentsService.remove(id);
    return res.status(200).json({
      message: 'Appointment deleted successfully',
      data: result,
    });
  }
}
