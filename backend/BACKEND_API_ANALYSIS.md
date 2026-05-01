# Paring Backend API - Comprehensive Analysis

## Project Overview
- **Framework**: NestJS
- **Database**: PostgreSQL (Prisma ORM)
- **API Prefix**: `/api`
- **Authentication**: JWT (JSON Web Token) with cookie-based session support
- **Rate Limiting**: 100 requests per 60 seconds (global throttler)
- **Documentation**: Swagger available at `/api/docs`
- **Deployment**: Vercel serverless + local development support

---

## Database Schema

### Core Models

#### 1. **User** (Authentication & Authorization)
```
- id: UUID (primary key)
- email: String (unique)
- passwordHash: String (bcrypt hashed)
- fullName: String
- phoneNumber: String
- role: Enum [ADMIN, FAMILY, NURSE]
- createdAt: DateTime
- updatedAt: DateTime

Relationships:
- patients: Patient[] (one-to-many)
- nurseProfile: NurseProfile? (one-to-one, optional)
```

#### 2. **Patient** (Elderly Care Recipients)
```
- id: UUID
- familyId: String (FK to User)
- name: String
- dateOfBirth: DateTime
- weight: Float? (nullable)
- height: Float? (nullable)
- medicalHistory: String? (chronic conditions like diabetes, hypertension)
- createdAt: DateTime
- updatedAt: DateTime

Relationships:
- family: User (belongs to)
- appointments: Appointment[]
- medicalLogs: CareLog[]
```

#### 3. **NurseProfile** (Caregiver Information)
```
- id: UUID
- userId: String (FK to User, unique)
- specialization: String (e.g., "Wound Care", "ADL Caregiving")
- experienceYears: Int
- rating: Float (default: 0.0)
- isVerified: Boolean (default: false)
- createdAt: (implicit)
- updatedAt: (implicit)

Relationships:
- user: User (one-to-one)
- appointments: Appointment[]
- careLogs: CareLog[]
```

#### 4. **Appointment** (Service Bookings & Transactions)
```
- id: UUID
- patientId: String (FK)
- nurseId: String (FK to NurseProfile)
- serviceType: Enum [VISIT, LIVE_IN, LIVE_OUT]
- serviceName: Enum [MEDIS, NON_MEDIS]
- status: Enum [PENDING, CONFIRMED, ONGOING, COMPLETED, CANCELLED]
- dueDate: DateTime (mandatory - service deadline)
- totalPrice: Float
- createdAt: DateTime
- updatedAt: DateTime

Relationships:
- patient: Patient
- nurse: NurseProfile
- careLogs: CareLog[]
- payments: Payment[]
```

#### 5. **Payment** (Midtrans Integration)
```
- id: UUID
- appointmentId: String (FK)
- midtransOrderId: String (unique) - Used as order_id for Midtrans API
- amount: Float
- status: Enum [PENDING, SETTLEMENT, EXPIRE, CANCEL, DENY, REFUND]
- paymentMethod: String? (e.g., "bca_va", "gopay", "credit_card")
- snapToken: String? (Midtrans Snap token for payment page)
- snapRedirectUrl: String? (Redirect URL for payment)
- paidAt: DateTime? (when payment actually cleared)
- createdAt: DateTime
- updatedAt: DateTime

Indexes:
- appointmentId
```

#### 6. **CareLog** (Real-time Care Documentation)
```
- id: UUID
- appointmentId: String (FK)
- patientId: String (FK)
- nurseId: String (FK to NurseProfile)

Vital Metrics (nullable):
- systolic: Int? (blood pressure upper, e.g., 120)
- diastolic: Int? (blood pressure lower, e.g., 80)
- bloodSugar: Float? (mg/dL)
- cholesterol: Float? (mg/dL)
- uricAcid: Float? (mg/dL)

Clinical Observations:
- woundCondition: String? (observations)
- moodScore: Int? (scale 1-5 for patient mood tracking)
- clinicalNotes: Text? (long nurse notes)

- recordedAt: DateTime (default: now)
- updatedAt: DateTime

Relationships:
- appointment: Appointment
- patient: Patient
- nurse: NurseProfile
- activityLog: ActivityLog[]

Indexes:
- (patientId, recordedAt) - for graphing queries
```

#### 7. **ActivityLog** (Sub-entries to CareLog)
```
- id: UUID
- notes: Text
- careLogId: String (FK)
- createdAt: DateTime
- updatedAt: DateTime

Relationships:
- careLog: CareLog
```

### Enums
- **Role**: ADMIN, FAMILY, NURSE
- **ServiceType**: VISIT, LIVE_IN, LIVE_OUT
- **ServiceName**: MEDIS (medical), NON_MEDIS (non-medical)
- **AppointmentStatus**: PENDING, CONFIRMED, ONGOING, COMPLETED, CANCELLED
- **PaymentStatus**: PENDING, SETTLEMENT, EXPIRE, CANCEL, DENY, REFUND

---

## API Endpoints

### Application Base
- **Base Path**: `/api`
- **Root Endpoint**: `GET /` - Returns "Hello" message
- **Swagger Docs**: `GET /docs`

---

### 1. Authentication Module (`/api/auth`)

**Authentication Strategy**:
- **Method**: JWT with bcrypt password hashing
- **Token Storage**: HTTP-only cookie + Authorization header support
- **Token Expiry**: 
  - Production: 1 day
  - Development: 1 hour
- **Cookie Settings**: httpOnly, sameSite='lax', path='/'

#### Endpoints:

| Method | Path | Auth | Description | Response |
|--------|------|------|-------------|----------|
| `POST` | `/auth` | None | Login (email + password) | `{ message, data: { userId, email, role } }` + sets cookie |

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK)**:
```json
{
  "message": "Authentication successful",
  "data": {
    "userId": "uuid",
    "email": "user@example.com",
    "role": "FAMILY" | "NURSE" | "ADMIN"
  }
}
```

**Errors**:
- `404 Not Found`: User not found
- `400 Bad Request`: Invalid password

---

### 2. Users Module (`/api/users`)

**Auth Guard**: None (public endpoints for user registration/retrieval)

#### Endpoints:

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/users` | None | Create new user (registration) |
| `GET` | `/users` | None | Get all users (filterable) |
| `GET` | `/users/:id` | None | Get user by ID |
| `PATCH` | `/users/:id` | None | Update user |
| `DELETE` | `/users/:id` | None | Delete user |

**POST /users** - Create User
```json
{
  "email": "nurse@example.com",
  "passwordHash": "password123",
  "fullName": "John Doe",
  "phoneNumber": "08123456789",
  "role": "NURSE" | "FAMILY" | "ADMIN" (default: FAMILY)
}
```

**GET /users** - Query Parameters:
- `role`: Filter by ADMIN, FAMILY, or NURSE
- `name`: Search by full name (case-insensitive contains)

**Response (200 OK)**:
```json
{
  "message": "Users found successfully",
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "John Doe",
      "phoneNumber": "08123456789",
      "role": "FAMILY",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### 3. Patients Module (`/api/patients`)

**Auth Guard**: `JwtAuthGuard` ✅ (ALL endpoints protected)

#### Endpoints:

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/patients` | JWT | Create new patient |
| `GET` | `/patients` | JWT | Get all patients (filterable) |
| `GET` | `/patients/:id` | JWT | Get patient by ID |
| `PATCH` | `/patients/:id` | JWT | Update patient |
| `DELETE` | `/patients/:id` | JWT | Delete patient |

**POST /patients** - Create Patient
```json
{
  "familyId": "uuid",
  "name": "Grandmother Name",
  "dateOfBirth": "1950-01-01T00:00:00Z",
  "weight": 65.5,
  "height": 160,
  "medicalHistory": "Diabetes, Hypertension"
}
```

**GET /patients** - Query Parameters:
- `familyId`: Filter by family ID
- Other filter fields available via schema

**Response (201 Created / 200 OK)**:
```json
{
  "message": "Patient created/fetched successfully",
  "data": {
    "id": "uuid",
    "familyId": "uuid",
    "name": "Grandmother Name",
    "dateOfBirth": "1950-01-01T00:00:00Z",
    "weight": 65.5,
    "height": 160,
    "medicalHistory": "Diabetes, Hypertension",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### 4. Nurses Module (`/api/nurses`)

**Auth Guard**: None (public)

#### Endpoints:

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/nurses` | None | Create nurse profile |
| `GET` | `/nurses` | None | Get all nurses (filterable) |
| `GET` | `/nurses/:id` | None | Get nurse by ID |
| `PATCH` | `/nurses/:id` | None | Update nurse profile |
| `DELETE` | `/nurses/:id` | None | Delete nurse profile |

**POST /nurses** - Create Nurse Profile
```json
{
  "userId": "uuid",
  "specialization": "Wound Care",
  "experienceYears": 5,
  "rating": 4.5,
  "isVerified": true
}
```

**GET /nurses** - Query Parameters:
- `name`: Search by nurse name
- `specialization`: Filter by specialization
- `experienceYears`: Filter by experience years

**Response (201 Created / 200 OK)**:
```json
{
  "message": "Perawat berhasil dibuat",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "specialization": "Wound Care",
    "experienceYears": 5,
    "rating": 4.5,
    "isVerified": true
  }
}
```

---

### 5. Appointments Module (`/api/appointments`)

**Auth Guard**: None (public)

#### Endpoints:

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/appointments` | None | Create appointment |
| `GET` | `/appointments` | None | Get all appointments (filterable) |
| `GET` | `/appointments/:id` | None | Get appointment by ID |
| `PATCH` | `/appointments/:id` | None | Update appointment |
| `DELETE` | `/appointments/:id` | None | Delete appointment |

**POST /appointments** - Create Appointment
```json
{
  "patientId": "uuid",
  "nurseId": "uuid",
  "serviceType": "VISIT" | "LIVE_IN" | "LIVE_OUT",
  "serviceName": "MEDIS" | "NON_MEDIS",
  "dueDate": "2024-12-25T14:00:00Z",
  "totalPrice": 500000
}
```

**Business Logic**:
- `dueDate` must be in the future
- Patient and Nurse must exist
- No conflicting appointments for same nurse at same time
- Creates automatic Payment record

**GET /appointments** - Query Parameters:
- `status`: PENDING, CONFIRMED, ONGOING, COMPLETED, CANCELLED
- `dueDate`: Filter by due date (YYYY-MM-DD format)

**Response (201 Created / 200 OK)**:
```json
{
  "message": "Appointment created/retrieved successfully",
  "data": {
    "id": "uuid",
    "patientId": "uuid",
    "nurseId": "uuid",
    "serviceType": "VISIT",
    "serviceName": "MEDIS",
    "status": "PENDING",
    "dueDate": "2024-12-25T14:00:00Z",
    "totalPrice": 500000,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### 6. CareLog Module (`/api/carelog`)

**Auth Guard**: None (public)

#### Endpoints:

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/carelog` | None | Create care log entry |
| `GET` | `/carelog` | None | Get all care logs (paginated) |
| `GET` | `/carelog/:id` | None | Get care log by ID |
| `PATCH` | `/carelog/:id` | None | Update care log |
| `DELETE` | `/carelog/:id` | None | Delete care log |

**POST /carelog** - Create CareLog Entry
```json
{
  "appointmentId": "uuid",
  "patientId": "uuid",
  "nurseId": "uuid",
  "systolic": 120,
  "diastolic": 80,
  "bloodSugar": 120.5,
  "cholesterol": 200,
  "uricAcid": 6.5,
  "woundCondition": "Improving, slight redness",
  "moodScore": 4,
  "clinicalNotes": "Patient responsive, appetite good"
}
```

**GET /carelog** - Query Parameters (Pagination):
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response (201 Created / 200 OK)**:
```json
{
  "message": "Carelog created/retrieved successfully",
  "data": {
    "id": "uuid",
    "appointmentId": "uuid",
    "patientId": "uuid",
    "nurseId": "uuid",
    "systolic": 120,
    "diastolic": 80,
    "bloodSugar": 120.5,
    "cholesterol": 200,
    "uricAcid": 6.5,
    "woundCondition": "Improving, slight redness",
    "moodScore": 4,
    "clinicalNotes": "Patient responsive, appetite good",
    "recordedAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "page": 1,
  "limit": 10,
  "total": 100
}
```

---

### 7. ActivityLog Module (`/api/activitylog`)

**Auth Guard**: None (public)

#### Endpoints:

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/activitylog` | None | Create activity log entry |
| `PATCH` | `/activitylog/:id` | None | Update activity log |
| `DELETE` | `/activitylog/:id` | None | Delete activity log |

**POST /activitylog** - Create ActivityLog
```json
{
  "careLogId": "uuid",
  "notes": "Patient took medication at 10:00 AM, ate breakfast"
}
```

**Response (201 Created)**:
```json
{
  "message": "Activity log created successfully",
  "data": {
    "id": "uuid",
    "notes": "Patient took medication at 10:00 AM, ate breakfast",
    "careLogId": "uuid",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### 8. Payment Module (`/api/payment`)

**Auth Guard**: None (public)

#### Endpoints:

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/payment/:appointmentId` | None | Create Midtrans transaction |

**POST /payment/:appointmentId** - Create Payment Transaction
```
No request body required
```

**Business Logic**:
- Appointment must exist
- Appointment must have a dueDate
- Current time + 120-minute buffer must be before dueDate
- Creates Payment record with Midtrans Snap token
- Snap token is used to render payment page on frontend

**Response (200 OK)**:
```json
{
  "token": "midtrans_snap_token_here"
}
```

**Errors**:
- `400 Bad Request`: Appointment not found or booking window too close

**Associated Payment Record** (created during request):
```
- paymentId: UUID (unique)
- appointmentId: UUID
- midtransOrderId: String (unique)
- amount: Float (from appointment.totalPrice)
- status: "PENDING"
- snapToken: String (returned in response)
- snapRedirectUrl: String (Midtrans redirect URL)
```

---

### 9. Midtrans Module (`/api/midtrans`)

**Auth Guard**: None (public webhook endpoint)

#### Endpoints:

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/midtrans/webhook` | None | Handle Midtrans payment notifications |

**POST /midtrans/webhook** - Webhook Handler
Midtrans sends webhook notifications when payment status changes.

**Request Body** (Midtrans sends):
```json
{
  "order_id": "midtransOrderId",
  "transaction_id": "transaction_id",
  "status_code": "200",
  "transaction_status": "settlement" | "pending" | "expired" | "cancelled" | "denied" | "refund",
  "payment_type": "bank_transfer" | "gopay" | "credit_card",
  "settlement_time": "2024-01-01T12:00:00Z"
}
```

**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Webhook processed"
}
```

**Business Logic**:
- Updates Payment.status based on transaction_status
- Updates Payment.paymentMethod
- Sets Payment.paidAt when transaction_status = "settlement"
- Handles refunds, expirations, and cancellations

---

## Authentication & Authorization

### Auth Flow

1. **Registration** → `POST /users` (create account with role)
2. **Login** → `POST /auth` (validate email/password)
   - Generates JWT token
   - Sets HTTP-only cookie with token
   - Returns token in response
3. **Subsequent Requests** → Include token in:
   - **Option A**: `Authorization: Bearer <token>` header
   - **Option B**: Cookie (auto-sent by browser)
4. **Token Verification** → `JwtAuthGuard` extracts and validates JWT
   - Checks signature with `JWT_SECRET`
   - Extracts `user_id`, `email`, `role`
   - Attaches to `request.user`

### JWT Payload
```typescript
{
  user_id: string;
  email: string;
  role: "ADMIN" | "FAMILY" | "NURSE";
  iat: number;         // issued at
  exp: number;         // expiration time
}
```

### Guard Implementation

**JwtAuthGuard** (`src/common/guards/jwt-auth.guard.ts`):
- Implements NestJS `CanActivate` interface
- Tries Authorization header first (Bearer token)
- Falls back to cookie if no header
- Throws `UnauthorizedException` if token missing or invalid
- Decodes and validates JWT signature
- Attaches decoded payload to `request.user`

### Protected Routes
- `GET /patients/*` - Requires JWT
- `POST /patients` - Requires JWT
- `PATCH /patients/*` - Requires JWT
- `DELETE /patients/*` - Requires JWT

### Public Routes
- `POST /auth` - Login
- `POST /users` - Registration
- `GET /users*` - User lookup
- `POST /nurses` - Create nurse
- `GET /nurses*` - List nurses
- `POST /appointments` - Book appointment
- `GET /appointments*` - List appointments
- `POST /carelog` - Log care data
- `GET /carelog*` - View care logs
- `POST /activitylog` - Add activity
- `POST /payment/:appointmentId` - Create payment
- `POST /midtrans/webhook` - Payment webhook

---

## Global Middleware & Configuration

### 1. Rate Limiting (Throttler)
- **Limit**: 100 requests
- **Window**: 60 seconds
- **Applied to**: All routes globally via `APP_GUARD`

### 2. CORS Settings
```
- Origin: FRONTEND_URL env var (default: http://localhost:3001)
- Methods: GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS
- Credentials: Enabled (for cookies)
- Allowed Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin
- Exposed Headers: Content-Type, Authorization, X-Total-Count, X-Page-Number
- Max Age: 86400 seconds (24 hours)
```

### 3. Global Pipes
- **ZodValidationPipe**: Validates request bodies using Zod schemas

### 4. HTTP Prefix
- All routes prefixed with `/api`

---

## Environment Variables

```env
DATABASE_URL=postgresql://user:pass@host:port/dbname  # Required
JWT_SECRET=your-secret-key                             # Required
IS_PRODUCTION=false|true                               # Default: false
MIDTRANS_CLIENT_KEY=your-midtrans-client-key           # Required
MIDTRANS_SERVER_KEY=your-midtrans-server-key           # Required
MIDTRANS_IS_PRODUCTION=false|true                      # Default: false
FRONTEND_URL=http://localhost:3001                     # For CORS
```

---

## Module Structure

```
src/
├── main.ts                      # Application entry point
├── app.module.ts                # Root module
├── app.controller.ts            # Health check controller
├── app.service.ts               # Basic service
├── env.ts                        # Environment validation (Zod)
├── auth/                         # Authentication module
│   ├── auth.controller.ts        # Login endpoint
│   ├── auth.service.ts           # JWT generation
│   ├── auth.module.ts
│   └── dto/
│       └── create-auth.dto.ts
├── users/                        # User management
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.module.ts
│   └── dto/
├── patients/                     # Patient records
│   ├── patients.controller.ts
│   ├── patients.service.ts
│   ├── patients.module.ts
│   └── dto/
├── nurses/                       # Nurse profiles
│   ├── nurses.controller.ts
│   ├── nurses.service.ts
│   ├── nurses.module.ts
│   └── dto/
├── appointments/                 # Service bookings
│   ├── appointments.controller.ts
│   ├── appointments.service.ts
│   ├── appointments.module.ts
│   └── dto/
├── carelog/                      # Care documentation
│   ├── carelog.controller.ts
│   ├── carelog.service.ts
│   ├── carelog.module.ts
│   └── dto/
├── activitylog/                  # Activity tracking
│   ├── activitylog.controller.ts
│   ├── activitylog.service.ts
│   ├── activitylog.module.ts
│   └── dto/
├── payment/                      # Payment integration
│   ├── payment.controller.ts
│   ├── payment.service.ts
│   ├── midtrans.controller.ts
│   ├── midtrans.service.ts
│   ├── payment.module.ts
│   └── dto/
├── database/                     # Prisma integration
│   ├── database.module.ts
│   ├── database.service.ts
├── common/                       # Shared utilities
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   ├── pipes/
│   │   └── zod-validation.pipe.ts
│   └── decorators/
```

---

## Key Technology Stack

- **Framework**: NestJS 10+
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: jsonwebtoken (JWT), bcrypt
- **Validation**: Zod schemas
- **Payment Gateway**: Midtrans (Snap payment)
- **API Documentation**: Swagger/OpenAPI
- **Rate Limiting**: @nestjs/throttler
- **CORS**: @nestjs/common CORS middleware
- **Deployment**: Vercel serverless (supports traditional Node.js too)

---

## Quick Reference: API Call Examples

### 1. Register User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nurse@example.com",
    "passwordHash": "password123",
    "fullName": "Jane Nurse",
    "phoneNumber": "08123456789",
    "role": "NURSE"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nurse@example.com",
    "password": "password123"
  }'
```

### 3. Create Patient (with JWT)
```bash
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "familyId": "uuid",
    "name": "Grandmother",
    "dateOfBirth": "1950-01-01T00:00:00Z",
    "medicalHistory": "Diabetes"
  }'
```

### 4. Create Appointment
```bash
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "uuid",
    "nurseId": "uuid",
    "serviceType": "VISIT",
    "serviceName": "MEDIS",
    "dueDate": "2024-12-25T14:00:00Z",
    "totalPrice": 500000
  }'
```

### 5. Create Payment
```bash
curl -X POST http://localhost:3000/api/payment/appointment-uuid \
  -H "Content-Type: application/json"
```

### 6. Log Care Data
```bash
curl -X POST http://localhost:3000/api/carelog \
  -H "Content-Type: application/json" \
  -d '{
    "appointmentId": "uuid",
    "patientId": "uuid",
    "nurseId": "uuid",
    "systolic": 120,
    "diastolic": 80,
    "bloodSugar": 120.5,
    "moodScore": 4,
    "clinicalNotes": "Patient doing well"
  }'
```

---

## Important Notes

1. **Payment Workflow**:
   - Appointment created → Payment record auto-created (PENDING)
   - Client requests Snap token from `/payment/:appointmentId`
   - Midtrans webhook notifies backend when payment clears
   - Payment status updated to SETTLEMENT
   - Appointment can proceed

2. **Authentication**:
   - Patients controller is protected with JwtAuthGuard
   - All other routes are currently public
   - Consider adding role-based guards for production (RBAC)

3. **Data Validation**:
   - All DTOs use Zod schemas for compile-time + runtime validation
   - ZodValidationPipe automatically validates incoming data

4. **Rate Limiting**:
   - Global 100 req/60sec limit
   - Applies to all routes equally

5. **Timezone**:
   - All DateTime fields in UTC
   - Appointments use `dueDate` as service deadline
   - Payment expiry calculated based on 120-minute preparation buffer

---

## To-Do / Considerations

1. Add role-based access control (RBAC) for other endpoints
2. Implement endpoint-specific rate limits
3. Add logging middleware for audit trails
4. Implement user activation/email verification
5. Add password reset flow
6. Implement pagination helpers for all list endpoints
7. Add transaction handling for appointment + payment creation
8. Document error codes and specific business rule validations
9. Add API versioning strategy
10. Consider implementing WebSockets for real-time appointment updates
