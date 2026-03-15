import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  Res,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
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
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(createPatientSchema))
    createPatientDto: CreatePatientDto,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.CREATED).json({
      message: 'Patient created successfully',
      data: await this.patientsService.create(createPatientDto),
    });
  }

  @Get()
  async findAll(
    @Query(new ZodValidationPipe(getPatientsFilterSchema))
    filter: GetPatientsFilterDto,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.OK).json({
      message: 'Patients fetched successfully',
      data: await this.patientsService.findAll(filter),
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      message: 'Patient fetched successfully',
      data: await this.patientsService.findOne(id),
    });
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(updatePatientSchema))
  async update(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.OK).json({
      message: 'Patient updated successfully',
      data: await this.patientsService.update(id, updatePatientDto),
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    return res.status(HttpStatus.ACCEPTED).json({
      message: 'Patient deleted successfully',
      data: await this.patientsService.remove(id),
    });
  }
}
