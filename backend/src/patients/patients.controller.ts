import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, CurrentUser } from '../common/decorators';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import {
  createPatientSchema,
  updatePatientSchema,
  getPatientsFilterSchema,
  CreatePatientDto,
  UpdatePatientDto,
  GetPatientsFilterDto,
} from './dto/patient.dto';
import { Response } from 'express';

@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new patient (FAMILY or ADMIN only)' })
  @ApiResponse({ status: 201, description: 'Patient created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiBody({ type: CreatePatientDto })
  @Roles('ADMIN' as any, 'FAMILY' as any)
  async create(
    @Body(new ZodValidationPipe(createPatientSchema))
    createPatientDto: CreatePatientDto,
    @Res() res: Response,
    @CurrentUser() user: JwtPayload,
  ) {
    return res.status(HttpStatus.CREATED).json({
      message: 'Patient created successfully',
      data: await this.patientsService.create(createPatientDto),
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all patients with filters (FAMILY/NURSE can view their own)' })
  @ApiResponse({ status: 200, description: 'Patients fetched successfully' })
  @ApiQuery({ type: GetPatientsFilterDto })
  @Roles('ADMIN' as any, 'FAMILY' as any, 'NURSE' as any)
  async findAll(
    @Query(new ZodValidationPipe(getPatientsFilterSchema))
    filter: GetPatientsFilterDto,
    @Res() res: Response,
    @CurrentUser() user: JwtPayload,
  ) {
    return res.status(HttpStatus.OK).json({
      message: 'Patients fetched successfully',
      data: await this.patientsService.findAll(filter),
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a patient by ID (FAMILY/NURSE can view their own)' })
  @ApiResponse({ status: 200, description: 'Patient fetched successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @Roles('ADMIN' as any, 'FAMILY' as any, 'NURSE' as any)
  async findOne(@Param('id') id: string, @Res() res: Response, @CurrentUser() user: JwtPayload) {
    return res.status(HttpStatus.OK).json({
      message: 'Patient fetched successfully',
      data: await this.patientsService.findOne(id),
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a patient by ID (ADMIN or patient owner only)' })
  @ApiResponse({ status: 200, description: 'Patient updated successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @ApiBody({ type: UpdatePatientDto })
  @Roles('ADMIN' as any, 'FAMILY' as any)
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updatePatientSchema))
    updatePatientDto: UpdatePatientDto,
    @Res() res: Response,
    @CurrentUser() user: JwtPayload,
  ) {
    return res.status(HttpStatus.OK).json({
      message: 'Patient updated successfully',
      data: await this.patientsService.update(id, updatePatientDto),
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a patient by ID (ADMIN only)' })
  @ApiResponse({ status: 202, description: 'Patient deleted successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @Roles('ADMIN' as any)
  async remove(@Param('id') id: string, @Res() res: Response) {
    return res.status(HttpStatus.ACCEPTED).json({
      message: 'Patient deleted successfully',
      data: await this.patientsService.remove(id),
    });
  }
}
