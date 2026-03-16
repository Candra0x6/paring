import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivitylogDto } from './dto/create-activitylog.dto';
import { UpdateActivitylogDto } from './dto/update-activitylog.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ActivitylogService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createActivitylogDto: CreateActivitylogDto) {
    const { notes, careLogId } = createActivitylogDto;

    const careLog = await this.databaseService.careLog.findUnique({
      where: { id: careLogId },
    });

    if (!careLog) {
      throw new NotFoundException(`CareLog with ID ${careLogId} not found`);
    }

    return this.databaseService.activityLog.create({
      data: {
        notes,
        careLogId,
      },
    });
  }

  async update(id: string, updateActivitylogDto: UpdateActivitylogDto) {
    // 1. Check if ActivityLog exists
    const existingLog = await this.databaseService.activityLog.findUnique({
      where: { id },
    });

    if (!existingLog) {
      throw new NotFoundException(`ActivityLog with ID ${id} not found`);
    }

    // 2. If careLogId is being updated, verify the new CareLog exists
    if (updateActivitylogDto.careLogId) {
      const careLog = await this.databaseService.careLog.findUnique({
        where: { id: updateActivitylogDto.careLogId },
      });

      if (!careLog) {
        throw new NotFoundException(
          `CareLog with ID ${updateActivitylogDto.careLogId} not found`,
        );
      }
    }

    // 3. Perform the update
    return this.databaseService.activityLog.update({
      where: { id },
      data: updateActivitylogDto,
    });
  }

  async remove(id: string) {
    const existingLog = await this.databaseService.activityLog.findUnique({
      where: { id },
    });

    if (!existingLog) {
      throw new NotFoundException(`ActivityLog with ID ${id} not found`);
    }

    return this.databaseService.activityLog.delete({
      where: { id },
    });
  }
}
