import { Controller, Post, Param, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, CurrentUser } from '../common/decorators';
import type { JwtPayload } from '../common/decorators/current-user.decorator';

@Controller('payment')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({
    summary: 'Create Midtrans Transaction (FAMILY or ADMIN only)',
    description: 'Create Midtrans Transaction for appointment payment',
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
  @Roles('ADMIN' as any, 'FAMILY' as any)
  async create(
    @Res() res: Response,
    @Param('appointmentId') appointmentId: string,
    @CurrentUser() user: JwtPayload,
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
