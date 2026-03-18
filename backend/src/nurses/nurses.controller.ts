import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { NursesService } from './nurses.service';
import { CreateNurseDto, CreateNurseSchema } from './dto/create-nurse.dto';
import { UpdateNurseDto, UpdateNurseSchema } from './dto/update-nurse.dto';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { Response } from 'express';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Nurses')
@Controller('nurses')
export class NursesController {
  constructor(private readonly nursesService: NursesService) {}

  @ApiOperation({ summary: 'Create a new nurse' })
  @ApiResponse({ status: 201, description: 'Nurse created successfully' })
  @Post()
  async create(
    @Res() res: Response,
    @Body(new ZodValidationPipe(CreateNurseSchema))
    createNurseDto: CreateNurseDto,
  ) {
    const result = await this.nursesService.create(createNurseDto);
    return res.status(HttpStatus.CREATED).json({
      message: 'Perawat berhasil dibuat',
      data: result,
    });
  }

  @ApiOperation({ summary: 'Get all nurses' })
  @ApiResponse({ status: 200, description: 'Nurses found successfully' })
  @ApiQuery({ name: 'name', required: false, description: 'Nurse name' })
  @ApiQuery({ name: 'specialization', required: false, description: 'Specialization' })
  @ApiQuery({ name: 'experienceYears', required: false, description: 'Years of experience' })
  @Get()
  async findAll(
    @Res() res: Response,
    @Query('name') name?: string,
    @Query('specialization') specialization?: string,
    @Query('experienceYears') experienceYears?: string,
  ) {
    const result = await this.nursesService.findAll({
      name,
      specialization,
      experienceYears: experienceYears
        ? parseInt(experienceYears, 10)
        : undefined,
    });
    return res.status(HttpStatus.OK).json({
      message: 'Perawat berhasil ditemukan',
      data: result,
    });
  }

  @ApiOperation({ summary: 'Get nurse by ID' })
  @ApiResponse({ status: 200, description: 'Nurse found successfully' })
  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: string) {
    const result = await this.nursesService.findOne(id);
    return res.status(HttpStatus.OK).json({
      message: 'Perawat berhasil ditemukan',
      data: result,
    });
  }

  @ApiOperation({ summary: 'Update nurse by ID' })
  @ApiResponse({ status: 200, description: 'Nurse updated successfully' })
  @Patch(':id')
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateNurseSchema))
    updateNurseDto: UpdateNurseDto,
  ) {
    const result = await this.nursesService.update(id, updateNurseDto);
    return res.status(HttpStatus.OK).json({
      message: 'Perawat berhasil diupdate',
      data: result,
    });
  }

  @ApiOperation({ summary: 'Delete nurse by ID' })
  @ApiResponse({ status: 200, description: 'Nurse removed successfully' })
  @Delete(':id')
  async remove(@Res() res: Response, @Param('id') id: string) {
    const result = await this.nursesService.remove(id);
    return res.status(HttpStatus.OK).json({
      message: 'Perawat berhasil dihapus',
      data: result,
    });
  }
}
