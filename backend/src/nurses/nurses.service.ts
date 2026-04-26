import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateNurseDto } from './dto/create-nurse.dto';
import { UpdateNurseDto } from './dto/update-nurse.dto';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class NursesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createNurseDto: CreateNurseDto) {
    const { userId, specialization, experienceYears } = createNurseDto;

    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
    });

    const nurse = await this.databaseService.nurseProfile.findUnique({
      where: { userId },
    });

    if (nurse) {
      throw new ConflictException('Profil perawat untuk user ini sudah ada');
    }

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    if (user.role !== 'NURSE') {
      throw new ForbiddenException(
        'Hanya user dengan role NURSE yang dapat membuat profil perawat',
      );
    }

    const existingProfile = await this.databaseService.nurseProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      throw new ConflictException('Profil perawat untuk user ini sudah ada');
    }

    return this.databaseService.nurseProfile.create({
      data: {
        userId,
        specialization,
        experienceYears,
        rating: 0.0,
        isVerified: false,
      },
    });
  }

  async findAll(
    filters: {
      name?: string;
      specialization?: string;
      experienceYears?: number;
    } = {},
  ) {
    const { name, specialization, experienceYears } = filters;

    const whereClause: Prisma.NurseProfileWhereInput = {};

    if (specialization) {
      whereClause.specialization = {
        contains: specialization,
        mode: 'insensitive',
      };
    }

    if (experienceYears !== undefined && !isNaN(experienceYears)) {
      whereClause.experienceYears = experienceYears;
    }

    if (name) {
      whereClause.user = {
        is: {
          fullName: {
            contains: name,
            mode: 'insensitive',
          },
        },
      };
    }

    const nurses = await this.databaseService.nurseProfile.findMany({
      where: whereClause,
      select: {
        id: true,
        specialization: true,
        experienceYears: true,
        rating: true,
        isVerified: true,
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
    });

    if (!nurses || nurses.length === 0) {
      throw new NotFoundException(
        'Tidak ada perawat yang cocok dengan kriteria',
      );
    }

    return nurses.map((nurse) => ({
      id: nurse.id,
      specialization: nurse.specialization,
      experienceYears: nurse.experienceYears,
      rating: nurse.rating,
      isVerified: nurse.isVerified,
      userId: nurse.user.id,
      fullName: nurse.user.fullName,
      email: nurse.user.email,
      phoneNumber: nurse.user.phoneNumber,
    }));
  }

  async findOne(id: string) {
    const nurse = await this.databaseService.nurseProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
          },
        },
        appointments: {
          include: {
            patient: true,
          },
        },
      },
    });

    if (!nurse) {
      throw new NotFoundException(`Perawat dengan ID ${id} tidak ditemukan`);
    }

    return {
      id: nurse.id,
      specialization: nurse.specialization,
      experienceYears: nurse.experienceYears,
      rating: nurse.rating,
      isVerified: nurse.isVerified,
      userId: nurse.user.id,
      fullName: nurse.user.fullName,
      email: nurse.user.email,
      phoneNumber: nurse.user.phoneNumber,
      appointments: nurse.appointments.map((appointment) => ({
        id: appointment.id,
        serviceType: appointment.serviceType,
        status: appointment.status,
        dueDate: appointment.dueDate,
        patient: {
          id: appointment.patient.id,
          name: appointment.patient.name,
          dateOfBirth: appointment.patient.dateOfBirth,
          medicalHistory: appointment.patient.medicalHistory,
        },
      })),
    };
  }

  async update(id: string, updateNurseDto: UpdateNurseDto) {
    const nurse = await this.databaseService.nurseProfile.findUnique({
      where: { id },
    });

    if (!nurse) {
      throw new NotFoundException(`Perawat dengan ID ${id} tidak ditemukan`);
    }

    const { specialization, experienceYears } = updateNurseDto;

    return this.databaseService.nurseProfile.update({
      where: { id },
      data: {
        specialization,
        experienceYears,
      },
    });
  }

  async remove(id: string) {
    const nurse = await this.databaseService.nurseProfile.findUnique({
      where: { id },
    });

    if (!nurse) {
      throw new NotFoundException(`Perawat dengan ID ${id} tidak ditemukan`);
    }

    return this.databaseService.nurseProfile.delete({
      where: { id },
    });
  }
}
