import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentStatus, Prisma } from '../../generated/prisma/client';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paymentService: PaymentService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    const {
      patientId,
      nurseId,
      serviceName,
      serviceType,
      dueDate,
      totalPrice,
    } = createAppointmentDto;

    const now = new Date();
    if (dueDate <= now) {
      throw new BadRequestException('Due date must be in the future');
    }

    const patientExists = await this.databaseService.patient.findUnique({
      where: { id: patientId },
    });
    if (!patientExists) {
      throw new NotFoundException(`Patient with ID ${patientId} not found`);
    }

    const nurseExists = await this.databaseService.nurseProfile.findUnique({
      where: { id: nurseId },
    });
    if (!nurseExists) {
      throw new NotFoundException(`Nurse with ID ${nurseId} not found`);
    }

    const conflict = await this.databaseService.appointment.findFirst({
      where: {
        nurseId,
        dueDate,
        status: {
          in: ['PENDING', 'CONFIRMED', 'ONGOING'],
        },
      },
    });

    if (conflict) {
      throw new ConflictException(
        'Nurse is already booked for this specific time',
      );
    }

    try {
      // 1. Simpan ke database dulu
      const appointment = await this.databaseService.appointment.create({
        data: {
          patientId,
          nurseId,
          serviceType,
          totalPrice,
          serviceName,
          dueDate,
          status: 'PENDING',
        },
      });

      // 2. Coba buat transaksi Midtrans
      try {
        const paymentResult =
          await this.paymentService.createMidtransTransaction(appointment.id);

        const { snapToken, redirectUrl } = paymentResult;

        const paymentRecord = await this.databaseService.payment.findFirst({
          where: { appointmentId: appointment.id },
        });

        if (!paymentRecord) {
          throw new NotFoundException(
            `Payment record not found for Appointment ${appointment.id}`,
          );
        }

        // 3. Update payment record
        await this.databaseService.payment.update({
          where: { id: paymentRecord.id },
          data: {
            snapToken,
            snapRedirectUrl: redirectUrl,
          },
        });

        // Jika sukses, kembalikan appointment berserta token Midtrans
        return {
          ...appointment,
          payment: paymentResult, // Berisi Snap Token dan URL
        };
      } catch (paymentError) {
        // SKENARIO BENCANA TERTANGANI: Midtrans gagal, tapi jadwal sudah tersimpan!
        // Jangan batalkan jadwalnya (jangan throw 500).
        // Biarkan frontend tahu bahwa jadwal terbuat, tapi pembayaran harus di-trigger ulang.
        console.error(
          `Gagal membuat tagihan Midtrans untuk Appointment ${appointment.id}`,
          paymentError,
        );

        return {
          ...appointment,
          paymentInitFailed: true,
          message:
            'Jadwal berhasil dibuat, namun sistem pembayaran sedang sibuk. Silakan buka menu Tagihan untuk mencoba bayar.',
        };
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to create appointment');
    }
  }

  async findAll(status?: AppointmentStatus, dueDate?: string) {
    const where: Prisma.AppointmentWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (dueDate) {
      const date = new Date(dueDate);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      where.dueDate = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    const appointments = await this.databaseService.appointment.findMany({
      where,
      include: {
        patient: true,
        nurse: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phoneNumber: true,
              },
            },
          },
        },
      },
      orderBy: {
        dueDate: 'asc',
      },
    });

    if (appointments.length === 0) {
      throw new NotFoundException(
        'No appointments found matching the given criteria',
      );
    }

    return appointments;
  }

  async findOne(id: string) {
    const appointment = await this.databaseService.appointment.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        serviceType: true,
        dueDate: true,
        patient: {
          select: {
            id: true,
            name: true,
            dateOfBirth: true,
            medicalHistory: true,
          },
        },
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
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return appointment;
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    const appointmentExists = await this.databaseService.appointment.findUnique(
      {
        where: { id },
      },
    );

    if (!appointmentExists) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    if (
      updateAppointmentDto.dueDate &&
      updateAppointmentDto.dueDate <= new Date()
    ) {
      throw new BadRequestException('Due date must be in the future');
    }

    if (updateAppointmentDto.patientId) {
      const patientExists = await this.databaseService.patient.findUnique({
        where: { id: updateAppointmentDto.patientId },
      });
      if (!patientExists) {
        throw new NotFoundException(
          `Patient with ID ${updateAppointmentDto.patientId} not found`,
        );
      }
    }

    if (updateAppointmentDto.nurseId) {
      const nurseExists = await this.databaseService.nurseProfile.findUnique({
        where: { id: updateAppointmentDto.nurseId },
      });
      if (!nurseExists) {
        throw new NotFoundException(
          `Nurse with ID ${updateAppointmentDto.nurseId} not found`,
        );
      }
    }

    const checkNurseId =
      updateAppointmentDto.nurseId || appointmentExists.nurseId;
    const checkDueDate =
      updateAppointmentDto.dueDate || appointmentExists.dueDate;

    if (
      updateAppointmentDto.nurseId ||
      updateAppointmentDto.dueDate ||
      updateAppointmentDto.status
    ) {
      const conflict = await this.databaseService.appointment.findFirst({
        where: {
          id: { not: id },
          nurseId: checkNurseId,
          dueDate: checkDueDate,
          status: {
            in: ['PENDING', 'CONFIRMED', 'ONGOING'],
          },
        },
      });

      if (conflict) {
        const statusToCheck =
          updateAppointmentDto.status || appointmentExists.status;
        const isCurrentlyActive = ['PENDING', 'CONFIRMED', 'ONGOING'].includes(
          statusToCheck,
        );
        if (isCurrentlyActive) {
          throw new ConflictException(
            'Nurse is already booked for this specific time',
          );
        }
      }
    }

    try {
      const updatedAppointment = await this.databaseService.appointment.update({
        where: { id },
        data: updateAppointmentDto,
      });

      return updatedAppointment;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update appointment');
    }
  }

  async remove(id: string) {
    const appointmentExists = await this.databaseService.appointment.findUnique(
      {
        where: { id },
      },
    );

    if (!appointmentExists) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    try {
      const deletedAppointment = await this.databaseService.appointment.delete({
        where: { id },
      });

      return deletedAppointment;
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete appointment');
    }
  }
}
