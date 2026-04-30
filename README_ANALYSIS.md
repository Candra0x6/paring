# Paring Backend - Authentication & Patient API Analysis

## Overview

This directory contains comprehensive documentation of the Paring backend's authentication system and patient API endpoints. Three detailed analysis documents have been generated to help you understand the security architecture and identify vulnerabilities.

---

## Documents Included

### 1. AUTHENTICATION_AND_PATIENT_API_ANALYSIS.md (1326 lines)

**The complete technical deep-dive into the system**

Contains:
- Full source code for all authentication files
- Detailed explanation of JWT implementation
- Patient endpoint code and validation rules
- Security issues with detailed explanations
- Authentication flow diagrams
- Environment configuration details
- Recommended security fixes with code examples
- Testing examples and curl commands

**Use this when:** You need a complete understanding of how authentication works and what needs to be fixed.

---

### 2. QUICK_REFERENCE.md (353 lines)

**Quick lookup guide for developers**

Contains:
- File locations and quick navigation
- API endpoint examples with curl commands
- JWT token structure reference
- Security vulnerability checklist
- Environment variables required
- Validation rules table
- Quick fix implementation steps
- Testing comparison (before/after)

**Use this when:** You need to quickly find something or implement a fix in the code.

---

### 3. COMPLETE_CODE_REFERENCE.md (1034 lines)

**All source code in one place with annotations**

Contains:
- Complete auth service code
- Complete auth controller code
- Complete patient controller code
- Complete patient service code
- All DTOs and validation schemas
- Configuration files (main.ts, env.ts, app.module.ts)
- Complete Prisma database schema
- File structure summary

**Use this when:** You need to copy-paste code or reference the exact implementation.

---

## Key Findings Summary

### Authentication System

The authentication system uses:
- **JWT (JSON Web Tokens)** with HS256 algorithm
- **bcrypt** for password hashing
- **HTTP-only secure cookies** for token storage
- **Role-based access control (RBAC)** with 3 roles: ADMIN, FAMILY, NURSE
- **Token expiration**: 1 hour (development) or 1 day (production)

**Location:** `/backend/src/auth/`

---

### Patient Endpoints

REST API with full CRUD operations:
- **POST /api/patients** - Create patient
- **GET /api/patients** - List all patients (with filters)
- **GET /api/patients/:id** - Get specific patient
- **PATCH /api/patients/:id** - Update patient
- **DELETE /api/patients/:id** - Delete patient

**Location:** `/backend/src/patients/`

**Validation:** Uses Zod for runtime schema validation with detailed error messages

---

## Critical Security Issues Found

### Issue 1: No Authentication Guards on Patient Endpoints (CRITICAL)

**Problem:** All patient endpoints are publicly accessible without requiring a valid JWT token.

**Impact:** Anyone can create, read, update, or delete patient data without authentication.

**File:** `/backend/src/patients/patients.controller.ts`

**Evidence:** No `@UseGuards()` decorator on any endpoint

**Fix Required:** Implement JWT authentication guard on all endpoints

---

### Issue 2: Permissive CORS Configuration (HIGH)

**Problem:** CORS allows requests from any origin (`origin: true`)

**Impact:** Potential for CSRF and XSS attacks from malicious domains

**File:** `/backend/src/main.ts`

**Fix Required:** Restrict CORS to specific frontend domain(s)

---

### Issue 3: No Role-Based Authorization (HIGH)

**Problem:** No enforcement of user roles on endpoints

**Impact:** A NURSE user could perform actions restricted to FAMILY users

**Fix Required:** Implement role-based guards on endpoints

---

## Authentication Flow

```
1. User POSTs credentials to /api/auth
2. Server validates email & password (bcrypt comparison)
3. Server generates JWT token with user info + signature
4. Server sets httpOnly cookie with JWT
5. Browser automatically includes cookie in subsequent requests
6. [CURRENTLY MISSING] Server verifies JWT and extracts user info
7. [CURRENTLY MISSING] Server checks user role for authorization
```

---

## Environment Variables Required

```bash
DATABASE_URL=postgresql://...          # PostgreSQL connection
JWT_SECRET=your-secret-key            # Min 32 chars recommended
IS_PRODUCTION=false                   # Dev/Prod mode
MIDTRANS_CLIENT_KEY=...               # Payment gateway
MIDTRANS_SERVER_KEY=...               # Payment gateway
MIDTRANS_IS_PRODUCTION=false          # Payment gateway
```

---

## Implementation of Quick Fix

The quickest way to secure the patient endpoints:

### Step 1: Create JWT Guard

Create file: `src/auth/jwt-auth.guard.ts`

```typescript
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
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

### Step 2: Apply Guard to Patient Controller

In `src/patients/patients.controller.ts`, add at the top:

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('patients')
@UseGuards(JwtAuthGuard)
export class PatientsController {
  // All endpoints now require valid JWT
  // ...
}
```

### Step 3: Test

```bash
# Restart server
npm run start:dev

# Try creating patient WITHOUT token (should fail with 401)
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -d '{"familyId":"...","name":"John",...}'

# Expected: 401 Unauthorized
```

---

## Testing the System

### Login Example

```bash
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "message": "Authentication successful"
}
```

**Cookie Set:** `access_token=<jwt>; httpOnly; Secure; SameSite=Lax; Path=/`

---

### Create Patient Example

```bash
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -b "access_token=<jwt_token>" \
  -d '{
    "familyId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "dateOfBirth": "2000-01-01",
    "weight": 65,
    "height": 175,
    "medicalHistory": ["Hypertension"]
  }'
```

**Response:**
```json
{
  "message": "Patient created successfully",
  "data": {
    "id": "patient-uuid",
    "familyId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "dateOfBirth": "2000-01-01T00:00:00Z",
    "weight": 65,
    "height": 175,
    "medicalHistory": "Hypertension",
    "createdAt": "2024-04-30T10:00:00Z",
    "updatedAt": "2024-04-30T10:00:00Z"
  }
}
```

---

## Database Models

### User Model
- `id` (UUID)
- `email` (unique)
- `passwordHash` (bcrypt)
- `fullName`
- `phoneNumber`
- `role` (ADMIN, FAMILY, NURSE)

### Patient Model
- `id` (UUID)
- `familyId` (FK to User)
- `name`
- `dateOfBirth`
- `weight` (optional)
- `height` (optional)
- `medicalHistory` (optional, comma-separated string)

### Relationships
- One User can have many Patients
- One Patient belongs to one User (family)
- Patients have Appointments with Nurses

---

## File Structure

```
/backend/src/
├── auth/                          # Authentication module
│   ├── auth.service.ts            # JWT & password logic
│   ├── auth.controller.ts         # POST /api/auth endpoint
│   ├── auth.module.ts             # Module configuration
│   └── dto/create-auth.dto.ts     # Email & password validation
├── patients/                      # Patient management module
│   ├── patients.controller.ts     # REST endpoints (NEEDS GUARDS!)
│   ├── patients.service.ts        # CRUD operations
│   ├── patients.module.ts         # Module configuration
│   └── dto/patient.dto.ts         # Request/response models
├── common/
│   └── pipes/zod-validation.pipe.ts # Input validation
├── database/
│   ├── database.service.ts        # Prisma client
│   └── database.module.ts         # Database configuration
├── app.module.ts                  # Root module
├── main.ts                        # App bootstrap (CORS config)
└── env.ts                         # Environment validation
/prisma/
├── schema.prisma                  # Database schema
└── seed.ts                        # Database seeding
```

---

## How to Use These Documents

1. **First Time Reading?** Start with `QUICK_REFERENCE.md` for a quick overview

2. **Need Implementation Details?** Read `AUTHENTICATION_AND_PATIENT_API_ANALYSIS.md`

3. **Implementing a Fix?** Use `COMPLETE_CODE_REFERENCE.md` for exact code to copy

4. **Quick Lookup?** Use `QUICK_REFERENCE.md` as a cheat sheet

---

## Recommendations

### Immediate (Security Critical)

- [ ] Add JWT authentication guards to all patient endpoints
- [ ] Implement role-based authorization checks
- [ ] Restrict CORS to specific frontend domain

### Short Term

- [ ] Add request logging for audit trail
- [ ] Implement rate limiting per user (not just global)
- [ ] Add endpoints for user role verification

### Medium Term

- [ ] Implement refresh token rotation
- [ ] Add multi-factor authentication option
- [ ] Add request signing/verification for critical operations
- [ ] Implement API key authentication for external services

### Long Term

- [ ] Migrate to OAuth2/OpenID Connect
- [ ] Implement GraphQL with proper authorization
- [ ] Add comprehensive security testing (OWASP)

---

## Dependencies Used

- **@nestjs/common** v10 - NestJS core
- **@nestjs/throttler** v6.5 - Rate limiting
- **jsonwebtoken** v9.0.3 - JWT generation/verification
- **bcrypt** v6.0.0 - Password hashing
- **zod** v4.3.6 - Schema validation
- **@prisma/client** v7.5.0 - ORM
- **pg** v8.20.0 - PostgreSQL driver

---

## References

- JWT: https://jwt.io
- bcrypt: https://en.wikipedia.org/wiki/Bcrypt
- Zod: https://zod.dev
- Prisma: https://www.prisma.io
- NestJS: https://nestjs.com
- OWASP Security: https://owasp.org

---

## Questions?

Refer to:
1. `AUTHENTICATION_AND_PATIENT_API_ANALYSIS.md` - For technical details
2. `QUICK_REFERENCE.md` - For quick answers and API usage
3. `COMPLETE_CODE_REFERENCE.md` - For exact code implementations

---

Generated: 2024-04-30
Analysis Version: 1.0
System: Paring Backend (NestJS)

