import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as crypto from 'crypto';

@Injectable()
export class MidtransService {
  constructor(private readonly databaseService: DatabaseService) {}

  async processNotification(payload: any): Promise<void> {
    // 1. TANTANGAN KEAMANAN: Verifikasi Signature Kriptografi
    this.verifySignature(payload);

    const mtStatus = payload.transaction_status;
    const fraudStatus = payload.fraud_status;
    const orderId = payload.order_id; // Ini adalah midtransOrderId di tabel Payment kita

    // 2. PEMETAAN STATUS
    let paymentStatus: string | null = null;
    if (mtStatus === 'capture') {
      paymentStatus = fraudStatus === 'challenge' ? 'PENDING' : 'SETTLEMENT';
    } else if (mtStatus === 'settlement') {
      paymentStatus = 'SETTLEMENT';
    } else if (['deny', 'cancel', 'expire'].includes(mtStatus)) {
      paymentStatus = mtStatus.toUpperCase();
    }

    if (!paymentStatus) return; // Abaikan status sementara seperti 'pending' atau 'authorize'

    try {
      // 3. DATABASE TRANSACTION: Eksekusi Atomik
      await this.databaseService.$transaction(async (tx) => {
        // A. Update status di tabel Payment
        const updatedPayment = await tx.payment.update({
          where: { midtransOrderId: orderId },
          data: {
            status: paymentStatus as any,
            paymentMethod: payload.payment_type,
            paidAt:
              paymentStatus === 'SETTLEMENT'
                ? new Date(payload.settlement_time)
                : null,
          },
          include: { appointment: true }, // Ambil data appointment sekaligus
        });

        // B. KEPUTUSAN LOGIKA BISNIS UNTUK APPOINTMENT
        if (paymentStatus === 'SETTLEMENT') {
          const appointment = updatedPayment.appointment;
          const currentTime = new Date();

          let nextAppointmentStatus = 'CONFIRMED';

          // UJI ASUMSI KETAT: Apakah uang masuk setelah jadwal kedaluwarsa?
          if (currentTime > appointment.dueDate) {
            // JANGAN DI-CONFIRM!
            // Opsional: Anda bisa mengubah status ke REQUIRES_RESCHEDULE jika sudah menambahkannya di Prisma Enum
            // Atau untuk saat ini, kita biarkan CANCELLED tapi dana harus di-refund manual.
            nextAppointmentStatus = 'CANCELLED';
            console.warn(
              `[URGENT] Uang masuk telat untuk Appointment ${appointment.id}. Butuh tindakan manual!`,
            );
          }

          // C. Update status di tabel Appointment
          await tx.appointment.update({
            where: { id: appointment.id },
            data: { status: nextAppointmentStatus as any },
          });
        }
        // Catatan: Jika status EXPIRE/CANCEL, kita biarkan Appointment tetap PENDING
        // agar fitur "Coba Bayar Lagi" yang kita bahas tadi bisa bekerja.
      });
    } catch (error) {
      console.error('Database transaction failed on webhook:', error);
      throw new InternalServerErrorException('Gagal memproses perubahan data');
    }
  }

  private verifySignature(payload: any): void {
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const hashInput = `${payload.order_id}${payload.status_code}${payload.gross_amount}${serverKey}`;

    const hash = crypto.createHash('sha512').update(hashInput).digest('hex');

    if (hash !== payload.signature_key) {
      throw new ForbiddenException(
        'Invalid Webhook Signature! Potensi Serangan Spoofing.',
      );
    }
  }
}
