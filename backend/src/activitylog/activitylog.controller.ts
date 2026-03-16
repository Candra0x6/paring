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

@Controller('activitylog')
export class ActivitylogController {
  constructor(private readonly activitylogService: ActivitylogService) {}

  @Post()
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
  async remove(@Param('id') id: string, @Res() res: Response) {
    const data = await this.activitylogService.remove(id);
    return res.status(HttpStatus.OK).json({
      message: 'Activity log deleted successfully',
      data,
    });
  }
}
