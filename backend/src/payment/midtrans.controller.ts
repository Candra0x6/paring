import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { MidtransService } from './midtrans.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('midtrans')
export class MidtransController {
  constructor(private readonly midtransService: MidtransService) {}

  @ApiOperation({
    summary: 'Midtrans Webhook',
    description: 'Midtrans Webhook',
  })
  @ApiResponse({
    status: 200,
    description: 'Midtrans Webhook processed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Midtrans Webhook processing failed',
  })
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleMidtransNotification(@Body() payload: any) {
    // Kita lempar payload ke Service untuk diolah
    await this.midtransService.processNotification(payload);

    // Midtrans hanya butuh tahu bahwa kita menerima datanya dengan baik
    return { status: 'success', message: 'Webhook processed' };
  }
}
