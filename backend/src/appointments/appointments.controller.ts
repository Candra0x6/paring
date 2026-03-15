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

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
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
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const result = await this.appointmentsService.findOne(id);
    return res.status(200).json({
      message: 'Appointment retrieved successfully',
      data: result,
    });
  }

  @Patch(':id')
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
  async remove(@Param('id') id: string, @Res() res: Response) {
    const result = await this.appointmentsService.remove(id);
    return res.status(200).json({
      message: 'Appointment deleted successfully',
      data: result,
    });
  }
}
