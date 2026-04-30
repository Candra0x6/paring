# Authentication & Patient API Analysis - Paring Backend

## Executive Summary

The Paring backend is a NestJS application with a **JWT-based authentication system** using **HTTP-only secure cookies**. The patient creation endpoint (`POST /api/patients`) is **currently NOT protected by authentication guards**, creating a potential security vulnerability. The authentication mechanism uses JWT tokens with role-based access control (RBAC).

---

## 1. AUTHENTICATION ARCHITECTURE

### 1.1 Authentication Mechanism: JWT with HTTP-Only Cookies

**Technology Stack:**
- JWT Token Generation: `jsonwebtoken` library v9.0.3
- Password Hashing: `bcrypt` library v6.0.0
- Token Storage: HTTP-only, secure cookies (httpOnly: true)
- Environment-based expiration: 1 hour (dev) or 1 day (production)

### 1.2 User Roles (RBAC)
```
enum Role {
  ADMIN      # Administrator role
  FAMILY     # Family/caregiver who orders services
  NURSE      # Healthcare professional
}
```

---

## 2. AUTHENTICATION SERVICE

### 2.1 AuthService - Token Validation & Generation

**File:** `/backend/src/auth/auth.service.ts`

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
    // Step 1: Find user by email
    const user = await this.databaseService.user.findUnique({
      where: {
        email: createAuthDto.email,
      },
    });
    
    // Step 2: Validate user exists
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    // Step 3: Compare provided password with stored bcrypt hash
    const isPasswordMatch = await bcrypt.compare(
      createAuthDto.password,
      user.passwordHash,
    );
    
    // Step 4: Validate password matches
    if (!isPasswordMatch) {
      throw new BadRequestException('Invalid password');
    }
    
    // Step 5: Generate JWT token with user data
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

**Key Points:**
- Uses bcrypt to compare passwords with stored hashes
- JWT payload contains: `user_id`, `email`, `role`
- Token expiration: 1 hour (development), 1 day (production)
- Secret key from environment variable: `JWT_SECRET`

### 2.2 Authentication DTO

**File:** `/backend/src/auth/dto/create-auth.dto.ts`

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

**Validation Rules:**
- Email: Must be valid email format
- Password: Minimum 6 characters

---

## 3. AUTHENTICATION CONTROLLER

### 3.1 AuthController - Login Endpoint

**File:** `/backend/src/auth/auth.controller.ts`

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
    // Step 1: Call auth service to validate credentials and generate JWT
    const token = await this.authService.create(createAuthDto);

    // Step 2: Set HTTP-only secure cookie with JWT token
    res.cookie('access_token', token, {
      httpOnly: true,                      // Prevents JavaScript access (XSS protection)
      secure: env.IS_PRODUCTION,           // HTTPS only in production
      sameSite: 'lax',                     // CSRF protection
      path: '/',
    });

    // Step 3: Return success message
    return { message: 'Authentication successful' };
  }
}
```

**Endpoint Details:**
- **Route:** `POST /api/auth`
- **Request Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "message": "Authentication successful"
  }
  ```
  Cookie set: `access_token` (httpOnly, secure, sameSite=lax)

- **Error Responses:**
  - 404: User not found
  - 400: Invalid password
  - 400: Validation error (invalid email format, password too short)

**Cookie Configuration:**
- `httpOnly: true` - Cannot be accessed by JavaScript (prevents XSS attacks)
- `secure: true` (production only) - Only sent over HTTPS
- `sameSite: 'lax'` - CSRF protection
- `path: '/'` - Available for entire application

---

## 4. PATIENT CREATION ENDPOINT

### 4.1 Patient Controller

**File:** `/backend/src/patients/patients.controller.ts`

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

  // ============================================
  // CREATE PATIENT (POST /api/patients)
  // ============================================
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

  // ============================================
  // GET ALL PATIENTS (GET /api/patients)
  // ============================================
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

  // ============================================
  // GET PATIENT BY ID (GET /api/patients/:id)
  // ============================================
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

  // ============================================
  // UPDATE PATIENT (PATCH /api/patients/:id)
  // ============================================
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

  // ============================================
  // DELETE PATIENT (DELETE /api/patients/:id)
  // ============================================
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

**CRITICAL SECURITY ISSUE:** ⚠️
- **No `@UseGuards()` decorator on any endpoint**
- **No authentication required to create, read, update, or delete patients**
- **All endpoints are publicly accessible**

### 4.2 Patient DTO - Request Format

**File:** `/backend/src/patients/dto/patient.dto.ts`

```typescript
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { z } from 'zod';

// ============================================
// CREATE PATIENT SCHEMA (Zod validation)
// ============================================
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

// ============================================
// TypeScript DTO Classes for Swagger Docs
// ============================================
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

**POST /api/patients - Create Patient**

Request Headers:
```
Content-Type: application/json
Cookie: access_token=<jwt_token>  [NOT CURRENTLY REQUIRED - SECURITY ISSUE]
```

Request Body:
```json
{
  "familyId": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Airlangga Pradana",
  "dateOfBirth": "2000-01-01",
  "weight": 65,
  "height": 175,
  "medicalHistory": ["Hypertension", "Diabetes"]
}
```

Success Response (201 CREATED):
```json
{
  "message": "Patient created successfully",
  "data": {
    "id": "patient-uuid-123",
    "familyId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Airlangga Pradana",
    "dateOfBirth": "2000-01-01T00:00:00Z",
    "weight": 65,
    "height": 175,
    "medicalHistory": "Hypertension, Diabetes",
    "createdAt": "2024-04-30T10:00:00Z",
    "updatedAt": "2024-04-30T10:00:00Z"
  }
}
```

Error Responses:
```json
{
  "statusCode": 400,
  "message": "Validasi gagal",
  "errors": [
    {
      "field": "familyId",
      "message": "familyId harus berupa UUID yang valid"
    }
  ]
}
```

### 4.3 Patient Service - Business Logic

**File:** `/backend/src/patients/patients.service.ts`

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

    // Convert date string to Date object for Prisma
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

    // Create patient in database
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

    // Additional validation logic for updates...
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

**Key Validations:**
1. Check if family (user) exists in database
2. Verify user has FAMILY role
3. Prevent duplicate patient names within same family
4. Convert dateOfBirth string to Date object
5. Convert medicalHistory array to comma-separated string for storage

---

## 5. CURRENT SECURITY ARCHITECTURE

### 5.1 CORS Configuration

**File:** `/backend/src/main.ts`

```typescript
app.enableCors({
  origin: true,                    // Allow all origins (⚠️ PERMISSIVE)
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true,               // Allow cookies/credentials
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Type', 'Authorization', 'X-Total-Count', 'X-Page-Number'],
  maxAge: 86400,                   // 24 hours cache
});
```

**Issues:**
- `origin: true` allows requests from ANY origin
- Should be restricted to specific domains in production

### 5.2 Rate Limiting

**File:** `/backend/src/app.module.ts`

```typescript
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
    // ... other modules
  ],
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

**Rate Limiting:**
- 100 requests per 60 seconds globally
- Applied to all endpoints

### 5.3 Validation Pipe

**File:** `/backend/src/common/pipes/zod-validation.pipe.ts`

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

**Validation:**
- Uses Zod for runtime schema validation
- Returns detailed field-level error messages
- Validates all request data before reaching route handlers

---

## 6. DATA MODELS

### 6.1 User Model

```prisma
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  fullName     String
  phoneNumber  String
  role         Role     @default(FAMILY)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Relations
  patients Patient[]
  nurseProfile NurseProfile?
}
```

### 6.2 Patient Model

```prisma
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
```

---

## 7. AUTHENTICATION FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────┐
│                          AUTHENTICATION FLOW                         │
└─────────────────────────────────────────────────────────────────────┘

Step 1: LOGIN REQUEST
━━━━━━━━━━━━━━━━━━━━
Client                                  Server
  │                                        │
  │──────── POST /api/auth ───────────────>│
  │  {                                     │
  │    "email": "user@example.com",       │
  │    "password": "password123"          │
  │  }                                     │
  │                                        │


Step 2: PASSWORD VALIDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━
Server (AuthService)
  │
  ├─→ Find user by email
  │   └─→ Query: User.findUnique({ email: "user@example.com" })
  │
  ├─→ Check user exists
  │   └─→ If not found → NotFoundException (404)
  │
  ├─→ Compare passwords
  │   └─→ bcrypt.compare(providedPassword, user.passwordHash)
  │
  └─→ If invalid → BadRequestException (400)


Step 3: JWT TOKEN GENERATION
━━━━━━━━━━━━━━━━━━━━━━━━━━
Server (AuthService)
  │
  └─→ jwt.sign(
        {
          user_id: user.id,
          email: user.email,
          role: user.role           // ADMIN | FAMILY | NURSE
        },
        env.JWT_SECRET,
        {
          expiresIn: "1h" or "1d"   // Depends on IS_PRODUCTION
        }
      )


Step 4: COOKIE RESPONSE
━━━━━━━━━━━━━━━━━━━━━
Server                                   Client
  │                                        │
  │<──── 200 OK ──────────────────────────│
  │  Response Body:                       │
  │  {                                    │
  │    "message": "Authentication         │
  │               successful"             │
  │  }                                    │
  │                                       │
  │  Response Headers:                    │
  │  Set-Cookie: access_token=<JWT>;     │
  │              httpOnly;                │
  │              Secure;                  │
  │              SameSite=Lax;            │
  │              Path=/                   │
  │                                       │
  └─────────────────────────────────────>│
      Browser automatically stores        │
      httpOnly cookie (JS cannot access)  │


Step 5: SUBSEQUENT REQUESTS
━━━━━━━━━━━━━━━━━━━━━━━━
Client                                  Server
  │                                       │
  │──── GET /api/patients ────────────────>│
  │  Headers:                            │
  │  Cookie: access_token=<JWT>          │
  │                                       │
  │  [CURRENTLY: NO GUARD PROTECTION     │
  │   ANY REQUEST ACCEPTED WITHOUT       │
  │   TOKEN VALIDATION]                  │
  │                                       │
  │<──── 200 OK + Patient Data ─────────│
  │                                       │
  └───────────────────────────────────────┘


JWT Token Structure (Example)
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "role": "FAMILY",
  "iat": 1719914400,
  "exp": 1719918000  // 1 hour later
}

Signature:
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  env.JWT_SECRET
)
```

---

## 8. ENVIRONMENT CONFIGURATION

**File:** `/backend/src/env.ts`

```typescript
import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.url(),                    // PostgreSQL connection string
  JWT_SECRET: z.string().min(1),            // Secret key for JWT signing
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

**Required Environment Variables:**
```bash
DATABASE_URL=postgresql://user:password@host:port/dbname
JWT_SECRET=your-secret-key-here-min-32-chars-recommended
IS_PRODUCTION=false
MIDTRANS_CLIENT_KEY=your-midtrans-client-key
MIDTRANS_SERVER_KEY=your-midtrans-server-key
MIDTRANS_IS_PRODUCTION=false
```

---

## 9. DEPENDENCIES

**File:** `/backend/package.json`

```json
{
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/swagger": "^7.4.2",
    "@nestjs/throttler": "^6.5.0",
    "@prisma/adapter-pg": "^7.5.0",
    "@prisma/client": "^7.5.0",
    "bcrypt": "^6.0.0",           // Password hashing
    "jsonwebtoken": "^9.0.3",     // JWT token generation/validation
    "pg": "^8.20.0",              // PostgreSQL driver
    "zod": "^4.3.6"               // Schema validation
  }
}
```

---

## 10. SECURITY ISSUES & RECOMMENDATIONS

### ⚠️ CRITICAL SECURITY ISSUES

#### Issue 1: No Authentication Guards on Patient Endpoints
**Severity:** CRITICAL
**Description:** Patient creation, read, update, delete endpoints are NOT protected by JWT guards
**Impact:** Any unauthenticated user can create, read, modify, or delete patient data
**Fix:** Implement JWT authentication guard and apply to all protected endpoints

#### Issue 2: Permissive CORS Configuration
**Severity:** HIGH
**Description:** `origin: true` allows requests from any domain
**Impact:** Cross-origin attacks possible
**Fix:** Restrict to specific frontend domain(s)

#### Issue 3: No Role-Based Access Control (RBAC)
**Severity:** HIGH
**Description:** No route-level authorization to check user role
**Impact:** A NURSE user could create patients (should be limited to FAMILY role)
**Fix:** Implement @UseGuards with role validation

### Recommended Fixes

#### 1. Create JWT Authentication Guard

```typescript
// jwt-auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { env } from '../env';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies['access_token'];

    if (!token) {
      throw new UnauthorizedException('No access token provided');
    }

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      request.user = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
```

#### 2. Create Role Guard

```typescript
// roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const userRole = request.user?.role;

    if (!roles.includes(userRole)) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
```

#### 3. Apply Guards to Patient Controller

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientsController {
  
  @Post()
  @Roles('FAMILY', 'ADMIN')  // Only FAMILY and ADMIN can create patients
  async create(...) { ... }

  @Get()
  @Roles('FAMILY', 'NURSE', 'ADMIN')  // All authenticated users can view
  async findAll(...) { ... }

  // ... other endpoints
}
```

#### 4. Fix CORS Configuration

```typescript
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 
          ['http://localhost:3001', 'https://yourdomain.com'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Type', 'Authorization', 'X-Total-Count', 'X-Page-Number'],
  maxAge: 86400,
});
```

---

## 11. TESTING EXAMPLES

### Example 1: Login

```bash
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "family@example.com",
    "password": "password123"
  }' \
  -v
```

**Expected Response:**
```
HTTP/1.1 200 OK
Set-Cookie: access_token=eyJhbGc...; HttpOnly; Secure; SameSite=Lax; Path=/

{"message":"Authentication successful"}
```

### Example 2: Create Patient (Current - No Auth Required)

```bash
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "familyId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Airlangga Pradana",
    "dateOfBirth": "2000-01-01",
    "weight": 65,
    "height": 175,
    "medicalHistory": ["Hypertension", "Diabetes"]
  }'
```

### Example 3: Create Patient (With Auth Cookie)

```bash
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -b "access_token=<jwt_token>" \
  -d '{
    "familyId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Airlangga Pradana",
    "dateOfBirth": "2000-01-01",
    "weight": 65,
    "height": 175,
    "medicalHistory": ["Hypertension", "Diabetes"]
  }'
```

---

## 12. SUMMARY TABLE

| Component | Implementation | Security Level | Status |
|-----------|----------------|-----------------|--------|
| **Authentication** | JWT + bcrypt | Medium | ✓ Implemented |
| **Token Storage** | HTTP-only cookie | Good | ✓ Secure |
| **Token Expiration** | 1h (dev), 1d (prod) | Good | ✓ Configured |
| **Password Hashing** | bcrypt | Good | ✓ Implemented |
| **Patient Endpoint** | No guards | CRITICAL | ✗ Unprotected |
| **RBAC** | Role-based schema | Not implemented | ✗ Missing |
| **CORS** | Any origin allowed | HIGH RISK | ✗ Permissive |
| **Rate Limiting** | 100 req/min global | Medium | ✓ Enabled |
| **Input Validation** | Zod schemas | Good | ✓ Active |

---

## 13. FILE STRUCTURE

```
backend/
├── src/
│   ├── auth/
│   │   ├── auth.service.ts           # JWT generation, password validation
│   │   ├── auth.controller.ts        # POST /api/auth endpoint
│   │   ├── auth.module.ts            # Auth module configuration
│   │   ├── dto/
│   │   │   └── create-auth.dto.ts    # Email & password validation
│   │   └── auth.controller.spec.ts
│   │
│   ├── patients/
│   │   ├── patients.service.ts       # CRUD operations, validation
│   │   ├── patients.controller.ts    # REST endpoints (NO GUARDS)
│   │   ├── patients.module.ts        # Patients module configuration
│   │   ├── dto/
│   │   │   └── patient.dto.ts        # Request/response models
│   │   └── patients.controller.spec.ts
│   │
│   ├── common/
│   │   └── pipes/
│   │       └── zod-validation.pipe.ts  # Zod validation pipe
│   │
│   ├── database/
│   │   ├── database.service.ts       # Prisma client connection
│   │   └── database.module.ts
│   │
│   ├── app.module.ts                 # Root module, CORS, rate limiting
│   ├── main.ts                       # Bootstrap, app configuration
│   └── env.ts                        # Environment validation
│
├── prisma/
│   ├── schema.prisma                 # Database schema, models
│   └── seed.ts                       # Database seeding
│
└── package.json                      # Dependencies
```

---

## CONCLUSION

The Paring backend uses a **JWT-based authentication system with HTTP-only secure cookies** for token storage. However, the **patient endpoints are currently not protected by authentication guards**, creating a **CRITICAL security vulnerability**. 

All endpoints should be protected with:
1. JWT authentication guard to verify token validity
2. Role-based authorization guards to enforce access control
3. Restricted CORS configuration
4. Proper error handling for authentication failures

The authentication mechanism itself is well-implemented with bcrypt password hashing and JWT token generation, but it's not being enforced on the API endpoints that need protection.

