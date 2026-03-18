import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ActivitylogService } from './activitylog.service';
import {
  CreateActivitylogDto,
  createActivitylogSchema,
} from './dto/create-activitylog.dto';
import {
  UpdateActivitylogDto,
  updateActivitylogSchema,
} from './dto/update-activitylog.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { Response } from 'express';

@ApiTags('Activitylog')
@Controller('activitylog')
export class ActivitylogController {
  constructor(private readonly activitylogService: ActivitylogService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new activity log entry' })
  @ApiBody({ type: CreateActivitylogDto })
  @ApiResponse({
    status: 201,
    description: 'Activity log created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'CareLog not found' })
  async create(
    @Body(new ZodValidationPipe(createActivitylogSchema))
    createActivitylogDto: CreateActivitylogDto,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.CREATED).json({
      message: 'Activity log created successfully',
      data: await this.activitylogService.create(createActivitylogDto),
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing activity log entry' })
  @ApiParam({ name: 'id', description: 'Activity log UUID' })
  @ApiBody({ type: UpdateActivitylogDto })
  @ApiResponse({
    status: 200,
    description: 'Activity log updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Activity log or CareLog not found',
  })
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateActivitylogSchema))
    updateActivitylogDto: UpdateActivitylogDto,
    @Res() res: Response,
  ) {
    const data = await this.activitylogService.update(id, updateActivitylogDto);
    return res.status(HttpStatus.OK).json({
      message: 'Activity log updated successfully',
      data,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an activity log entry' })
  @ApiParam({ name: 'id', description: 'Activity log UUID' })
  @ApiResponse({
    status: 200,
    description: 'Activity log deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Activity log not found' })
  async remove(@Param('id') id: string, @Res() res: Response) {
    const data = await this.activitylogService.remove(id);
    return res.status(HttpStatus.OK).json({
      message: 'Activity log deleted successfully',
      data,
    });
  }
}
