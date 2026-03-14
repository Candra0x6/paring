import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { NursesModule } from './nurses/nurses.module';
import { PatientsModule } from './patients/patients.module';

@Module({
  imports: [UsersModule, DatabaseModule, NursesModule, PatientsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
