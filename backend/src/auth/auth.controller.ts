import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Response } from 'express';
import { env } from 'src/env';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async create(
    @Body() createAuthDto: CreateAuthDto,
    @Res({ passthrough: true }) res: Response,
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
