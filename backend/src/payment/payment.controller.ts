import { Controller, Post, Param, Res, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({
    summary: 'Create Midtrans Transaction',
    description: 'Create Midtrans Transaction',
  })
  @ApiResponse({
    status: 200,
    description: 'Midtrans Transaction created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Midtrans Transaction creation failed',
  })
  @Post(':appointmentId')
  async create(
    @Res() res: Response,
    @Param('appointmentId') appointmentId: string,
  ) {
    try {
      const token =
        await this.paymentService.createMidtransTransaction(appointmentId);
      return res.status(HttpStatus.OK).json({ token });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }
}
