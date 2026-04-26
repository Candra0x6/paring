import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCarelogDto } from './dto/create-carelog.dto';
import { UpdateCarelogDto } from './dto/update-carelog.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CarelogService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createCarelogDto: CreateCarelogDto) {
    const { appointmentId, patientId, nurseId } = createCarelogDto;

    // 1. Validasi keberadaan Appointment
    const appointment = await this.databaseService.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException(
        `Appointment dengan ID ${appointmentId} tidak ditemukan`,
      );
    }

    // 2. Validasi apakah Patient sesuai dengan Appointment
    if (appointment.patientId !== patientId) {
      throw new BadRequestException(
        `Patient ID ${patientId} tidak cocok dengan data Appointment`,
      );
    }

    // 3. Validasi apakah Nurse sesuai dengan Appointment
    if (appointment.nurseId !== nurseId) {
      throw new BadRequestException(
        `Nurse ID ${nurseId} tidak cocok dengan data Appointment`,
      );
    }

    // Eksekusi pembuatan CareLog jika semua validasi berlalu
    try {
      const carelog = await this.databaseService.careLog.create({
        data: createCarelogDto,
      });
      return carelog;
    } catch (error) {
      throw new BadRequestException(
        'Gagal membuat carelog: ' +
          (error?.message || 'Terjadi kesalahan yang tidak diketahui'),
      );
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.databaseService.careLog.findMany({
        skip,
        take: limit,
        include: {
          appointment: true,
          patient: true,
          nurse: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                  role: true,
                },
              },
            },
          }, // Mengambil detail user melalui NurseProfile
        },
        orderBy: {
          recordedAt: 'desc',
        },
      }),
      this.databaseService.careLog.count(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const existingCarelog = await this.databaseService.careLog.findUnique({
      where: { id },
      include: {
        appointment: true,
        patient: true,
        nurse: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!existingCarelog) {
      throw new NotFoundException(`Carelog dengan ID ${id} tidak ditemukan`);
    }

    return existingCarelog;
  }

  async update(id: string, updateCarelogDto: UpdateCarelogDto) {
    // 1. Pastikan CareLog exists
    const existingCarelog = await this.findOne(id);

    // 2. Mencegah perubahan relasi esensial setelah carelog dibuat
    if (
      (updateCarelogDto.appointmentId &&
        updateCarelogDto.appointmentId !== existingCarelog.appointmentId) ||
      (updateCarelogDto.patientId &&
        updateCarelogDto.patientId !== existingCarelog.patientId) ||
      (updateCarelogDto.nurseId &&
        updateCarelogDto.nurseId !== existingCarelog.nurseId)
    ) {
      throw new BadRequestException(
        'ID relasi penjadwalan (appointment/patient/nurse) tidak boleh diubah setelah log dibuat.',
      );
    }

    try {
      const updatedCarelog = await this.databaseService.careLog.update({
        where: { id },
        data: updateCarelogDto,
      });

      return updatedCarelog;
    } catch (error) {
      throw new BadRequestException(
        'Gagal memperbarui carelog: ' +
          (error?.message || 'Terjadi kesalahan yang tidak diketahui'),
      );
    }
  }

  async remove(id: string) {
    const existingCarelog = await this.findOne(id);

    if (!existingCarelog) {
      throw new NotFoundException(`Carelog dengan ID ${id} tidak ditemukan`);
    }

    try {
      const deletedCarelog = await this.databaseService.careLog.delete({
        where: { id },
      });
      return deletedCarelog;
    } catch (error) {
      throw new BadRequestException(
        'Gagal menghapus carelog: ' +
          (error?.message || 'Terjadi kesalahan yang tidak diketahui'),
      );
    }
  }
}
