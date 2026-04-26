import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, createAuthDtoSchema } from './dto/create-auth.dto';
import { Response } from 'express';
import { env } from '../env';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Login',
    description: 'Login to the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  @Post()
  async create(
    @Res({ passthrough: true }) res: Response,
    @Body(new ZodValidationPipe(createAuthDtoSchema))
    createAuthDto: CreateAuthDto,
  ) {
    const token = await this.authService.create(createAuthDto);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: env.IS_PRODUCTION,
      sameSite: 'lax',
      path: '/',
    });

    return { message: 'Authentication successful' };
  }
}
