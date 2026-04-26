import { Module } from '@nestjs/common';
import { ActivitylogService } from './activitylog.service';
import { ActivitylogController } from './activitylog.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ActivitylogController],
  providers: [ActivitylogService],
})
export class ActivitylogModule {}
