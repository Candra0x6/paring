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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { CarelogService } from './carelog.service';
import {
  CreateCarelogDto,
  createCarelogSchema,
} from './dto/create-carelog.dto';
import {
  UpdateCarelogDto,
  updateCarelogSchema,
} from './dto/update-carelog.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { Response } from 'express';

@ApiTags('Carelog')
@Controller('carelog')
export class CarelogController {
  constructor(private readonly carelogService: CarelogService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new carelog entry' })
  @ApiBody({ type: CreateCarelogDto })
  @ApiResponse({ status: 201, description: 'Carelog created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(
    @Res() res: Response,
    @Body(new ZodValidationPipe(createCarelogSchema))
    createCarelogDto: CreateCarelogDto,
  ) {
    const result = await this.carelogService.create(createCarelogDto);
    return res.status(201).json({
      message: 'Carelog created successfully',
      data: result,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all carelog entries' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiResponse({ status: 200, description: 'Carelogs retrieved successfully' })
  async findAll(
    @Res() res: Response,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNumber = parseInt(page || '1', 10);
    const limitNumber = parseInt(limit || '10', 10);
    const result = await this.carelogService.findAll(pageNumber, limitNumber);

    return res.status(200).json({
      message: 'Carelogs retrieved successfully',
      ...result,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single carelog by ID' })
  @ApiParam({ name: 'id', description: 'Carelog UUID' })
  @ApiResponse({ status: 200, description: 'Carelog retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Carelog not found' })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const result = await this.carelogService.findOne(id);
    return res.status(200).json({
      message: 'Carelog retrieved successfully',
      data: result,
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a carelog entry' })
  @ApiParam({ name: 'id', description: 'Carelog UUID' })
  @ApiBody({ type: UpdateCarelogDto })
  @ApiResponse({ status: 200, description: 'Carelog updated successfully' })
  @ApiResponse({ status: 404, description: 'Carelog not found' })
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateCarelogSchema))
    updateCarelogDto: UpdateCarelogDto,
  ) {
    const result = await this.carelogService.update(id, updateCarelogDto);
    return res.status(200).json({
      message: 'Carelog updated successfully',
      data: result,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a carelog entry' })
  @ApiParam({ name: 'id', description: 'Carelog UUID' })
  @ApiResponse({ status: 200, description: 'Carelog deleted successfully' })
  @ApiResponse({ status: 404, description: 'Carelog not found' })
  async remove(@Res() res: Response, @Param('id') id: string) {
    const result = await this.carelogService.remove(id);
    return res.status(200).json({
      message: 'Carelog deleted successfully',
      data: result,
    });
  }
}
