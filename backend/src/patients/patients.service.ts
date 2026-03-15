import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import {
  CreatePatientDto,
  UpdatePatientDto,
  GetPatientsFilterDto,
} from './dto/patient.dto';

@Injectable()
export class PatientsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createPatientDto: CreatePatientDto) {
    // Validasi apakah user (family) ada
    const userExists = await this.databaseService.user.findUnique({
      where: { id: createPatientDto.familyId },
    });

    if (!userExists) {
      throw new NotFoundException(
        `User dengan ID ${createPatientDto.familyId} tidak ditemukan`,
      );
    }

    // Validasi tambahan: Hanya user dengan role FAMILY yang boleh menambahkan pasien
    if (userExists.role !== 'FAMILY') {
      throw new BadRequestException(
        `User dengan ID ${createPatientDto.familyId} bukan merupakan akun FAMILY`,
      );
    }

    // Validasi pengecekan nama pasien ganda (agar tidak ada duplikat dalam 1 keluarga)
    const existingPatient = await this.databaseService.patient.findFirst({
      where: {
        familyId: createPatientDto.familyId,
        name: createPatientDto.name,
      },
    });

    if (existingPatient) {
      throw new BadRequestException(
        `Pasien dengan nama ${createPatientDto.name} sudah didaftarkan oleh akun ini`,
      );
    }

    // Parsing dateOfBirth dari string menjadi Date object agar sesuai dengan schema Prisma
    const data: any = { ...createPatientDto };
    if (
      data.dateOfBirth &&
      (typeof data.dateOfBirth === 'string' ||
        typeof data.dateOfBirth === 'number')
    ) {
      data.dateOfBirth = new Date(data.dateOfBirth);
    }

    // Convert array of strings menjadi comma-separated string agar sesuai dengan Prisma schema (String?)
    if (data.medicalHistory && Array.isArray(data.medicalHistory)) {
      data.medicalHistory = data.medicalHistory.join(', ');
    }

    return await this.databaseService.patient.create({
      data,
    });
  }

  async findAll(filter?: GetPatientsFilterDto) {
    const { name, hasAppointments, status } = filter || {};
    const whereClause: any = {};

    if (name) {
      whereClause.name = { contains: name, mode: 'insensitive' };
    }

    if (status) {
      whereClause.appointments = { some: { status } };
    } else if (hasAppointments === 'true') {
      whereClause.appointments = { some: {} };
    } else if (hasAppointments === 'false') {
      whereClause.appointments = { none: {} };
    }

    const patients = await this.databaseService.patient.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        dateOfBirth: true,
        weight: true,
        height: true,
        medicalHistory: true,
        family: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
          },
        },
        appointments: {
          select: {
            id: true,
            serviceType: true,
            status: true,
            dueDate: true,
          },
          orderBy: { dueDate: 'asc' },
        },
      },
    });

    if (patients.length === 0) {
      throw new NotFoundException('Pasien tidak ditemukan');
    }

    return patients;
  }

  async findOne(id: string) {
    const patient = await this.databaseService.patient.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        dateOfBirth: true,
        weight: true,
        height: true,
        medicalHistory: true,
        family: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
          },
        },
        appointments: {
          select: {
            id: true,
            serviceType: true,
            status: true,
            dueDate: true,
            totalPrice: true,
            nurse: {
              select: {
                id: true,
                specialization: true,
                rating: true,
                user: {
                  select: {
                    fullName: true,
                    phoneNumber: true,
                  },
                },
              },
            },
          },
          orderBy: { dueDate: 'desc' },
        },
      },
    });

    if (!patient) {
      throw new NotFoundException(`Pasien dengan ID ${id} tidak ditemukan`);
    }

    return patient;
  }

  async update(id: string, updatePatientDto: UpdatePatientDto) {
    const existingPatient = await this.databaseService.patient.findUnique({
      where: { id },
    });

    if (!existingPatient) {
      throw new NotFoundException(`Pasien dengan ID ${id} tidak ditemukan`);
    }

    if (
      updatePatientDto.familyId &&
      updatePatientDto.familyId !== existingPatient.familyId
    ) {
      const userExists = await this.databaseService.user.findUnique({
        where: { id: updatePatientDto.familyId },
      });

      if (!userExists) {
        throw new NotFoundException(
          `User dengan ID ${updatePatientDto.familyId} tidak ditemukan`,
        );
      }

      if (userExists.role !== 'FAMILY') {
        throw new BadRequestException(
          `User dengan ID ${updatePatientDto.familyId} bukan merupakan akun FAMILY`,
        );
      }
    }

    if (updatePatientDto.name || updatePatientDto.familyId) {
      const targetFamilyId =
        updatePatientDto.familyId || existingPatient.familyId;
      const targetName = updatePatientDto.name || existingPatient.name;

      if (
        targetName !== existingPatient.name ||
        targetFamilyId !== existingPatient.familyId
      ) {
        const duplicatePatient = await this.databaseService.patient.findFirst({
          where: {
            familyId: targetFamilyId,
            name: targetName,
            id: { not: id },
          },
        });

        if (duplicatePatient) {
          throw new BadRequestException(
            `Pasien dengan nama ${targetName} sudah didaftarkan oleh akun ini`,
          );
        }
      }
    }

    const data: any = { ...updatePatientDto };

    if (
      data.dateOfBirth &&
      (typeof data.dateOfBirth === 'string' ||
        typeof data.dateOfBirth === 'number')
    ) {
      data.dateOfBirth = new Date(data.dateOfBirth);
    }

    if (data.medicalHistory && Array.isArray(data.medicalHistory)) {
      data.medicalHistory = data.medicalHistory.join(', ');
    }

    return await this.databaseService.patient.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const existingPatient = await this.databaseService.patient.findUnique({
      where: { id },
    });

    if (!existingPatient) {
      throw new NotFoundException(`Pasien dengan ID ${id} tidak ditemukan`);
    }

    return await this.databaseService.patient.delete({
      where: { id },
    });
  }
}
