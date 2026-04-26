import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Snap } from 'midtrans-client';
import { env } from '../env';

@Injectable()
export class PaymentService {
  constructor(private readonly databaseService: DatabaseService) {}

  private snap = new Snap({
    clientKey: env.MIDTRANS_CLIENT_KEY,
    isProduction: env.MIDTRANS_IS_PRODUCTION,
    serverKey: env.MIDTRANS_SERVER_KEY,
  });

  async createMidtransTransaction(appointmentId: string) {
    // 1. Ambil data Appointment
    const appointment = await this.databaseService.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new BadRequestException('Jadwal tidak ditemukan');
    }

    // 2. Kalkulasi Durasi Kedaluwarsa yang Ketat
    const now = new Date();
    const dueDate = new Date(appointment.dueDate);

    // Hitung selisih waktu dalam menit
    const diffInMs = dueDate.getTime() - now.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    // ATURAN BISNIS: Pembayaran maksimal 120 menit (2 jam) SEBELUM jadwal layanan dimulai
    // agar perawat punya waktu bersiap dan berangkat.
    const preparationBufferMinutes = 120;
    const expiryDuration = diffInMinutes - preparationBufferMinutes;

    // Jika waktu sudah terlalu mepet, tolak pembuatan transaksi
    if (expiryDuration <= 0) {
      throw new BadRequestException(
        'Waktu pemesanan terlalu dekat dengan jadwal layanan. Silakan pilih jadwal lain.',
      );
    }

    // 3. Buat record Payment di database (status PENDING)
    // Gunakan UUID baru untuk midtransOrderId
    const paymentRecord = await this.databaseService.payment.create({
      data: {
        appointmentId: appointment.id,
        midtransOrderId: `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        amount: appointment.totalPrice,
        status: 'PENDING',
      },
    });

    // 4. Susun Payload untuk Midtrans
    const midtransPayload = {
      transaction_details: {
        order_id: paymentRecord.midtransOrderId, // WAJIB gunakan ID dari tabel Payment
        gross_amount: paymentRecord.amount,
      },
      // Fitur Kunci: Kunci pintu pembayaran sebelum layanan dimulai
      page_expiry: {
        duration: expiryDuration,
        unit: 'minute',
      },
      // ... (tambahkan customer_details, item_details sesuai kebutuhan) ...
    };

    // 5. Hit API Midtrans (menggunakan SDK midtrans-client atau HTTP Request)
    const transaction = await this.snap.createTransaction(midtransPayload);
    return {
      snapToken: transaction.token,
      redirectUrl: transaction.redirect_url,
    };
  }
}
