import { Controller, Post, Body, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, createAuthDtoSchema } from './dto/create-auth.dto';
import { Response } from 'express';
import { env } from '../env';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

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
    const { token, user } = await this.authService.create(createAuthDto);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: env.IS_PRODUCTION,
      sameSite: 'lax',
      path: '/',
    });

    return {
      message: 'Authentication successful',
      data: {
        userId: user.id,
        email: user.email,
        role: user.role,
        token: token,
      }
    };
  }

  @ApiOperation({
    summary: 'Logout',
    description: 'Logout and clear the authentication cookie',
  })
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
  })
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: env.IS_PRODUCTION,
      sameSite: 'lax',
      path: '/',
    });

    return {
      message: 'Logged out successfully'
    };
  }
}
