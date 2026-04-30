# Complete Code Reference - All Key Files

## Table of Contents
1. [Authentication Service](#1-authentication-service)
2. [Authentication Controller](#2-authentication-controller)
3. [Patient Controller](#3-patient-controller)
4. [Patient Service](#4-patient-service)
5. [DTOs & Validation](#5-dtos--validation)
6. [Configuration Files](#6-configuration-files)
7. [Database Schema](#7-database-schema)

---

## 1. Authentication Service

**File Path:** `/backend/src/auth/auth.service.ts`

```typescript
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
    // Find user by email
    const user = await this.databaseService.user.findUnique({
      where: {
        email: createAuthDto.email,
      },
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    // Compare password with bcrypt hash
    const isPasswordMatch = await bcrypt.compare(
      createAuthDto.password,
      user.passwordHash,
    );
    
    if (!isPasswordMatch) {
      throw new BadRequestException('Invalid password');
    }
    
    // Generate JWT token
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

    return token;
  }
}
```

**What it does:**
- Finds user by email in database
- Compares provided password with stored bcrypt hash
- If valid, generates JWT token with user info
- Token expiration: 1 hour (dev) or 1 day (production)

**Error Cases:**
- 404 NotFoundException: User not found
- 400 BadRequestException: Invalid password

---

## 2. Authentication Controller

**File Path:** `/backend/src/auth/auth.controller.ts`

```typescript
import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, createAuthDtoSchema } from './dto/create-auth.dto';
import { Response } from 'express';
import { env } from '../env';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

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
    // Get JWT token from service
    const token = await this.authService.create(createAuthDto);

    // Set httpOnly secure cookie
    res.cookie('access_token', token, {
      httpOnly: true,                   // Cannot be accessed by JavaScript
      secure: env.IS_PRODUCTION,        // HTTPS only in production
      sameSite: 'lax',                  // CSRF protection
      path: '/',                        // Available for entire application
    });

    return { message: 'Authentication successful' };
  }
}
```

**Endpoint:**
- Route: `POST /api/auth`
- Headers: `Content-Type: application/json`
- Body: `{ "email": "user@example.com", "password": "password123" }`
- Response: `{ "message": "Authentication successful" }`
- Cookie: `access_token=<jwt>; httpOnly; Secure; SameSite=Lax; Path=/`

---

## 3. Patient Controller

**File Path:** `/backend/src/patients/patients.controller.ts`

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  createPatientSchema,
  updatePatientSchema,
  getPatientsFilterSchema,
  CreatePatientDto,
  UpdatePatientDto,
  GetPatientsFilterDto,
} from './dto/patient.dto';
import { Response } from 'express';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  // CREATE PATIENT
  @Post()
  @ApiOperation({ summary: 'Create a new patient' })
  @ApiResponse({ status: 201, description: 'Patient created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiBody({ type: CreatePatientDto })
  async create(
    @Body(new ZodValidationPipe(createPatientSchema))
    createPatientDto: CreatePatientDto,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.CREATED).json({
      message: 'Patient created successfully',
      data: await this.patientsService.create(createPatientDto),
    });
  }

  // GET ALL PATIENTS
  @Get()
  @ApiOperation({ summary: 'Get all patients with filters' })
  @ApiResponse({ status: 200, description: 'Patients fetched successfully' })
  @ApiQuery({ type: GetPatientsFilterDto })
  async findAll(
    @Query(new ZodValidationPipe(getPatientsFilterSchema))
    filter: GetPatientsFilterDto,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.OK).json({
      message: 'Patients fetched successfully',
      data: await this.patientsService.findAll(filter),
    });
  }

  // GET PATIENT BY ID
  @Get(':id')
  @ApiOperation({ summary: 'Get a patient by ID' })
  @ApiResponse({ status: 200, description: 'Patient fetched successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      message: 'Patient fetched successfully',
      data: await this.patientsService.findOne(id),
    });
  }

  // UPDATE PATIENT
  @Patch(':id')
  @ApiOperation({ summary: 'Update a patient by ID' })
  @ApiResponse({ status: 200, description: 'Patient updated successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @ApiBody({ type: UpdatePatientDto })
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updatePatientSchema))
    updatePatientDto: UpdatePatientDto,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.OK).json({
      message: 'Patient updated successfully',
      data: await this.patientsService.update(id, updatePatientDto),
    });
  }

  // DELETE PATIENT
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a patient by ID' })
  @ApiResponse({ status: 202, description: 'Patient deleted successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async remove(@Param('id') id: string, @Res() res: Response) {
    return res.status(HttpStatus.ACCEPTED).json({
      message: 'Patient deleted successfully',
      data: await this.patientsService.remove(id),
    });
  }
}
```

**⚠️ CRITICAL ISSUE:** No `@UseGuards()` on any endpoint - currently publicly accessible!

---

## 4. Patient Service

**File Path:** `/backend/src/patients/patients.service.ts`

```typescript
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {
  CreatePatientDto,
  UpdatePatientDto,
  GetPatientsFilterDto,
} from './dto/patient.dto';

@Injectable()
export class PatientsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createPatientDto: CreatePatientDto) {
    // Validation 1: Check if family (user) exists
    const userExists = await this.databaseService.user.findUnique({
      where: { id: createPatientDto.familyId },
    });

    if (!userExists) {
      throw new NotFoundException(
        `User dengan ID ${createPatientDto.familyId} tidak ditemukan`,
      );
    }

    // Validation 2: Only FAMILY role users can add patients
    if (userExists.role !== 'FAMILY') {
      throw new BadRequestException(
        `User dengan ID ${createPatientDto.familyId} bukan merupakan akun FAMILY`,
      );
    }

    // Validation 3: Prevent duplicate patient names in same family
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

    // Convert date string to Date object
    const data: any = { ...createPatientDto };
    if (
      data.dateOfBirth &&
      (typeof data.dateOfBirth === 'string' ||
        typeof data.dateOfBirth === 'number')
    ) {
      data.dateOfBirth = new Date(data.dateOfBirth);
    }

    // Convert medical history array to comma-separated string
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
```

---

## 5. DTOs & Validation

### 5.1 Authentication DTO

**File Path:** `/backend/src/auth/dto/create-auth.dto.ts`

```typescript
import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const createAuthDtoSchema = z.object({
  email: z.email('Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export class CreateAuthDto {
  @ApiProperty({
    example: 'admin@example.com',
    description: 'Email',
  })
  email: string;

  @ApiProperty({
    example: 'admin123',
    description: 'Password',
  })
  password: string;
}
```

### 5.2 Patient DTOs

**File Path:** `/backend/src/patients/dto/patient.dto.ts`

```typescript
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { z } from 'zod';

// CREATE SCHEMA
export const createPatientSchema = z.object({
  familyId: z.uuid({ message: 'familyId harus berupa UUID yang valid' }),
  name: z.string().min(1, { message: 'Nama tidak boleh kosong' }),
  dateOfBirth: z.coerce.date({
    message:
      'dateOfBirth harus berupa string tanggal yang valid (contoh: 1990-01-01)',
  }),
  weight: z
    .number()
    .positive({ message: 'Berat badan harus positif' })
    .optional(),
  height: z
    .number()
    .positive({ message: 'Tinggi badan harus positif' })
    .optional(),
  medicalHistory: z.array(z.string()).optional(),
});

export const updatePatientSchema = createPatientSchema.partial();

export const getPatientsFilterSchema = z.object({
  name: z.string().optional(),
  hasAppointments: z.enum(['true', 'false']).optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'ONGOING', 'COMPLETED', 'CANCELLED']).optional(),
});

// TypeScript DTOs
export class CreatePatientDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'UUID of the family the patient belongs to',
  })
  familyId: string;

  @ApiProperty({
    example: 'Airlangga Pradana',
    description: 'Full name of the patient',
  })
  name: string;

  @ApiProperty({
    example: '2000-01-01',
    description: 'Date of birth of the patient',
  })
  dateOfBirth: Date;

  @ApiProperty({
    example: 65,
    description: 'Weight of the patient in kg',
    required: false,
  })
  weight?: number;

  @ApiProperty({
    example: 175,
    description: 'Height of the patient in cm',
    required: false,
  })
  height?: number;

  @ApiProperty({
    example: ['Hypertension', 'Diabetes'],
    description: 'Medical history of the patient',
    required: false,
  })
  medicalHistory?: string[];
}

export class UpdatePatientDto extends PartialType(CreatePatientDto) {}

export class GetPatientsFilterDto {
  @ApiProperty({
    example: 'Airlangga',
    description: 'Filter patients by name',
    required: false,
  })
  name?: string;

  @ApiProperty({
    enum: ['true', 'false'],
    description: 'Filter patients who have appointments',
    required: false,
  })
  hasAppointments?: string;

  @ApiProperty({
    enum: ['PENDING', 'CONFIRMED', 'ONGOING', 'COMPLETED', 'CANCELLED'],
    description: 'Filter patients by appointment status',
    required: false,
  })
  status?: string;
}
```

---

## 6. Configuration Files

### 6.1 Main Application Bootstrap

**File Path:** `/backend/src/main.ts`

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

let cachedApp: INestApplication;

async function createApp(): Promise<INestApplication> {
  if (cachedApp) {
    return cachedApp;
  }

  try {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api');
    
    // CORS Configuration (PERMISSIVE - should be restricted)
    app.enableCors({
      origin: true,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
      exposedHeaders: ['Content-Type', 'Authorization', 'X-Total-Count', 'X-Page-Number'],
      maxAge: 86400,
    });

    // Swagger Documentation
    const config = new DocumentBuilder()
      .setTitle('Paring API')
      .setDescription('Paring API Documentation')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    await app.init();
    console.log('✓ Application initialized successfully');
    cachedApp = app;
    return app;
  } catch (error) {
    console.error('✗ Error creating app:', error);
    throw error;
  }
}

// Vercel serverless handler
export default async (req: any, res: any) => {
  try {
    const app = await createApp();
    const server = app.getHttpAdapter().getInstance();
    return server(req, res);
  } catch (error) {
    console.error('✗ Error in Vercel handler:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error?.message || 'Unknown error'
    });
  }
};

// Local development
if (!process.env.VERCEL) {
  createApp()
    .then(async (app) => {
      await app.listen(3000);
      console.log('✓ Application is running on: http://localhost:3000');
    })
    .catch((error) => {
      console.error('✗ Failed to start application:', error);
      process.exit(1);
    });
}
```

### 6.2 Environment Configuration

**File Path:** `/backend/src/env.ts`

```typescript
import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(1),
  IS_PRODUCTION: z
    .preprocess(
      (val) => (typeof val === 'string' ? val.toLowerCase() === 'true' : val),
      z.boolean(),
    )
    .default(false),
  MIDTRANS_CLIENT_KEY: z.string().min(1),
  MIDTRANS_SERVER_KEY: z.string().min(1),
  MIDTRANS_IS_PRODUCTION: z
    .preprocess(
      (val) => (typeof val === 'string' ? val.toLowerCase() === 'true' : val),
      z.boolean(),
    )
    .default(false),
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
```

### 6.3 Validation Pipe

**File Path:** `/backend/src/common/pipes/zod-validation.pipe.ts`

```typescript
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown, _metadata: ArgumentMetadata) {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      const errors = result.error.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));

      throw new BadRequestException({
        statusCode: 400,
        message: 'Validasi gagal',
        errors,
      });
    }

    return result.data;
  }
}
```

### 6.4 App Module

**File Path:** `/backend/src/app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { NursesModule } from './nurses/nurses.module';
import { PatientsModule } from './patients/patients.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { CarelogModule } from './carelog/carelog.module';
import { ActivitylogModule } from './activitylog/activitylog.module';
import { AuthModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,      // 60 seconds
        limit: 100,      // 100 requests per minute
      },
    ]),
    UsersModule,
    DatabaseModule,
    NursesModule,
    PatientsModule,
    AppointmentsModule,
    CarelogModule,
    ActivitylogModule,
    AuthModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
```

---

## 7. Database Schema

**File Path:** `/backend/prisma/schema.prisma`

```prisma
// Enums
enum Role {
  ADMIN
  FAMILY
  NURSE
}

enum ServiceType {
  VISIT
  LIVE_IN
  LIVE_OUT
}

enum AppointmentStatus {
  PENDING
  CONFIRMED
  ONGOING
  COMPLETED
  CANCELLED
}

enum ServiceName {
  MEDIS
  NON_MEDIS
}

// User Model
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  fullName     String
  phoneNumber  String
  role         Role     @default(FAMILY)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  patients Patient[]
  nurseProfile NurseProfile?
}

// Patient Model
model Patient {
  id             String   @id @default(uuid())
  familyId       String
  family         User     @relation(fields: [familyId], references: [id])
  name           String
  dateOfBirth    DateTime
  weight         Float?
  height         Float?
  medicalHistory String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  appointments Appointment[]
  medicalLogs  CareLog[]
}

// Nurse Profile Model
model NurseProfile {
  id              String  @id @default(uuid())
  userId          String  @unique
  user            User    @relation(fields: [userId], references: [id])
  specialization  String
  experienceYears Int
  rating          Float   @default(0.0)
  isVerified      Boolean @default(false)

  appointments Appointment[]
  careLogs     CareLog[]
}

// Appointment Model
model Appointment {
  id        String       @id @default(uuid())
  patientId String
  patient   Patient      @relation(fields: [patientId], references: [id])
  nurseId   String
  nurse     NurseProfile @relation(fields: [nurseId], references: [id])

  serviceType ServiceType
  serviceName ServiceName
  status      AppointmentStatus @default(PENDING)
  dueDate     DateTime
  totalPrice  Float

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  careLogs CareLog[]
  payments Payment[]
}

// Care Log Model
model CareLog {
  id String @id @default(uuid())

  appointmentId String
  appointment   Appointment @relation(fields: [appointmentId], references: [id])

  patientId String
  patient   Patient @relation(fields: [patientId], references: [id])

  nurseId String
  nurse   NurseProfile @relation(fields: [nurseId], references: [id])

  systolic       Int?
  diastolic      Int?
  bloodSugar     Float?
  cholesterol    Float?
  uricAcid       Float?
  woundCondition String?
  moodScore      Int?
  clinicalNotes  String? @db.Text

  activityLog ActivityLog[]

  recordedAt DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([patientId, recordedAt])
}

// Activity Log Model
model ActivityLog {
  id        String   @id @default(uuid())
  notes     String   @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  careLogId String
  careLog   CareLog @relation(fields: [careLogId], references: [id])
}

// Payment Model
model Payment {
  id String @id @default(uuid())

  appointmentId String
  appointment   Appointment @relation(fields: [appointmentId], references: [id])

  midtransOrderId String @unique
  amount Float
  status PaymentStatus @default(PENDING)
  paymentMethod String?
  snapToken       String?
  snapRedirectUrl String?

  paidAt    DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([appointmentId])
}

enum PaymentStatus {
  PENDING
  SETTLEMENT
  EXPIRE
  CANCEL
  DENY
  REFUND
}
```

---

## File Structure Summary

```
backend/
├── src/
│   ├── auth/
│   │   ├── auth.service.ts           [COMPLETE CODE ABOVE]
│   │   ├── auth.controller.ts        [COMPLETE CODE ABOVE]
│   │   ├── auth.module.ts
│   │   ├── dto/
│   │   │   └── create-auth.dto.ts    [COMPLETE CODE ABOVE]
│   │   └── auth.controller.spec.ts
│   │
│   ├── patients/
│   │   ├── patients.controller.ts    [COMPLETE CODE ABOVE]
│   │   ├── patients.service.ts       [COMPLETE CODE ABOVE]
│   │   ├── patients.module.ts
│   │   ├── dto/
│   │   │   └── patient.dto.ts        [COMPLETE CODE ABOVE]
│   │   └── patients.controller.spec.ts
│   │
│   ├── common/
│   │   └── pipes/
│   │       └── zod-validation.pipe.ts [COMPLETE CODE ABOVE]
│   │
│   ├── database/
│   │   ├── database.service.ts
│   │   └── database.module.ts
│   │
│   ├── app.module.ts                 [COMPLETE CODE ABOVE]
│   ├── main.ts                       [COMPLETE CODE ABOVE]
│   └── env.ts                        [COMPLETE CODE ABOVE]
│
├── prisma/
│   ├── schema.prisma                 [COMPLETE CODE ABOVE]
│   └── seed.ts
│
└── package.json
```

