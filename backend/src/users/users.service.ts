import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../../generated/prisma';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.databaseService.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (existingUser) {
      throw new ConflictException({
        statusCode: 409,
        message: `Email ${createUserDto.email} sudah terdaftar`,
      });
    }

    return await this.databaseService.user.create({
      data: {
        ...createUserDto,
        passwordHash: await bcrypt.hash(createUserDto.passwordHash, 10),
      },
    });
  }

  async findAll(role?: Role, name?: string) {
    const users = await this.databaseService.user.findMany({
      where: {
        ...(role && { role }),
        ...(name && {
          fullName: { contains: name, mode: 'insensitive' },
        }),
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (users.length === 0) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'User not found',
      });
    }

    return users;
  }

  async findOne(id: string) {
    const user = await this.databaseService.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        patients: {
          select: {
            id: true,
            name: true,
            dateOfBirth: true,
            weight: true,
            height: true,
            medicalHistory: true,
            createdAt: true,
            appointments: {
              select: {
                id: true,
                serviceType: true,
                status: true,
                totalPrice: true,
                dueDate: true,
                createdAt: true,
              },
            },
          },
        },
        nurseProfile: {
          select: {
            id: true,
            specialization: true,
            experienceYears: true,
            rating: true,
            isVerified: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException({
        statusCode: 404,
        message: `User with id ${id} not found`,
      });
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.databaseService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException({
        statusCode: 404,
        message: `User with id ${id} not found`,
      });
    }

    if (updateUserDto.passwordHash) {
      updateUserDto.passwordHash = await bcrypt.hash(
        updateUserDto.passwordHash,
        10,
      );
    }

    if (updateUserDto.email) {
      const existingUser = await this.databaseService.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException({
          statusCode: 409,
          message: `Email ${updateUserDto.email} sudah terdaftar`,
        });
      }
    }

    return await this.databaseService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    const user = await this.databaseService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException({
        statusCode: 404,
        message: `User with id ${id} not found`,
      });
    }

    return await this.databaseService.user.delete({
      where: { id },
    });
  }
}
