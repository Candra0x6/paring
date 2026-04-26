import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { DatabaseModule } from '../database/database.module';
import { MidtransService } from './midtrans.service';
import { MidtransController } from './midtrans.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [PaymentController, MidtransController],
  providers: [PaymentService, MidtransService],
})
export class PaymentModule {}
