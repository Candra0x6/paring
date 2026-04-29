import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '../generated/prisma/client';
import {
  AppointmentStatus,
  Role,
  ServiceName,
  ServiceType,
} from '../generated/prisma/enums';
import { env } from 'src/env';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: env.DATABASE_URL }),
});

async function main() {
  console.log('Memulai proses seeding...');

  // Password default untuk semua user agar mudah saat testing: 'password123'
  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Membuat 5 User (Role: FAMILY)
  console.log('Seeding Family Users...');
  const families = [];
  for (let i = 1; i <= 5; i++) {
    const family = await prisma.user.create({
      data: {
        email: `family${i}@example.com`,
        passwordHash,
        fullName: `Keluarga Nomor ${i}`,
        phoneNumber: `08123456789${i}`,
        role: Role.FAMILY,
      },
    });
    families.push(family);
  }

  // 2. Membuat 5 User (Role: NURSE)
  console.log('Seeding Nurse Users...');
  const nurses = [];
  for (let i = 1; i <= 5; i++) {
    const nurse = await prisma.user.create({
      data: {
        email: `nurse${i}@example.com`,
        passwordHash,
        fullName: `Perawat Unggulan ${i}`,
        phoneNumber: `08987654321${i}`,
        role: Role.NURSE,
      },
    });
    nurses.push(nurse);
  }

  // 3. Membuat 5 Data Patient
  console.log('Seeding Patients...');
  const patients = [];
  for (let i = 0; i < 5; i++) {
    const patient = await prisma.patient.create({
      data: {
        familyId: families[i].id,
        name: `Opa/Oma ${i + 1}`,
        dateOfBirth: new Date(`1950-0${(i % 9) + 1}-10T00:00:00.000Z`),
        weight: 60.5 + i,
        height: 160.0 + i,
        medicalHistory: i % 2 === 0 ? 'Hipertensi ringan' : 'Diabetes melitus',
      },
    });
    patients.push(patient);
  }

  // 4. Membuat 5 NurseProfile
  console.log('Seeding Nurse Profiles...');
  const nurseProfiles = [];
  for (let i = 0; i < 5; i++) {
    const profile = await prisma.nurseProfile.create({
      data: {
        userId: nurses[i].id,
        specialization:
          i % 2 === 0 ? 'Perawatan Luka Gangren' : 'Caregiver ADL',
        experienceYears: i + 3,
        rating: +(4.0 + i * 0.1).toFixed(1),
        isVerified: true,
      },
    });
    nurseProfiles.push(profile);
  }

  // 5. Membuat 5 Appointment
  console.log('Seeding Appointments...');
  const appointments = [];
  for (let i = 0; i < 5; i++) {
    const appointment = await prisma.appointment.create({
      data: {
        patientId: patients[i].id,
        nurseId: nurseProfiles[i].id,
        serviceType: i % 2 === 0 ? ServiceType.VISIT : ServiceType.LIVE_IN,
        serviceName: i % 2 === 0 ? ServiceName.MEDIS : ServiceName.NON_MEDIS,
        status:
          i === 0 ? AppointmentStatus.ONGOING : AppointmentStatus.CONFIRMED,
        dueDate: new Date(new Date().getTime() + (i + 1) * 24 * 60 * 60 * 1000), // besok sd 5 hari ke depan
        totalPrice: 150000 + i * 50000,
      },
    });
    appointments.push(appointment);
  }

  // 6. Membuat 5 CareLog
  console.log('Seeding CareLogs...');
  const careLogs = [];
  for (let i = 0; i < 5; i++) {
    const careLog = await prisma.careLog.create({
      data: {
        appointmentId: appointments[i].id,
        patientId: patients[i].id,
        nurseId: nurses[i].id,
        systolic: 120 + i,
        diastolic: 80 + i,
        bloodSugar: 105.0 + i,
        cholesterol: 180.0 + i,
        uricAcid: 5.5 + i * 0.1,
        woundCondition: i % 2 === 0 ? 'Bersih dan kering' : null,
        moodScore: (i % 5) + 1,
        clinicalNotes: `Kondisi harian pasien ${i + 1} stabil.`,
      },
    });
    careLogs.push(careLog);
  }

  // 7. Membuat 5 ActivityLog
  console.log('Seeding ActivityLogs...');
  const activityLogs = [];
  for (let i = 0; i < 5; i++) {
    const activityLog = await prisma.activityLog.create({
      data: {
        careLogId: careLogs[i].id,
        notes: `Tindakan perawatan rutin ke-${i + 1} dilakukan dengan baik.`,
      },
    });
    activityLogs.push(activityLog);
  }

  console.log('Seeding database berhasil! 5 data dibuat untuk setiap tabel.');
}

main()
  .catch((e) => {
    console.error('Error saat seeding database:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
