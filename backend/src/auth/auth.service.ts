import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { DatabaseService } from '../database/database.service';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { env } from '../env';

@Injectable()
export class AuthService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createAuthDto: CreateAuthDto) {
    const user = await this.databaseService.user.findUnique({
      where: {
        email: createAuthDto.email,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordMatch = await bcrypt.compare(
      createAuthDto.password,
      user.passwordHash,
    );
    if (!isPasswordMatch) {
      throw new BadRequestException('Invalid password');
    }
    const token = jwt.sign(
      {
        user_id: user.id,
        email: user.email,
        role: user.role,
      },
      env.JWT_SECRET,
      {
        expiresIn: env.IS_PRODUCTION ? '1d' : '1h',
      },
    );

    return { 
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      }
    };
  }
}
