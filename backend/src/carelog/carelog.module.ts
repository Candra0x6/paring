import { Module } from '@nestjs/common';
import { CarelogService } from './carelog.service';
import { CarelogController } from './carelog.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CarelogController],
  providers: [CarelogService],
})
export class CarelogModule {}
