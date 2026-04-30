# Quick Reference - Authentication & Patient API

## KEY FILES LOCATION

```
/backend/src/
├── auth/
│   ├── auth.service.ts              ← JWT generation & password validation
│   ├── auth.controller.ts           ← POST /api/auth endpoint
│   ├── auth.module.ts               ← Module setup
│   └── dto/create-auth.dto.ts       ← Email & password validation
├── patients/
│   ├── patients.controller.ts       ← REST endpoints (NO GUARDS - VULNERABLE!)
│   ├── patients.service.ts          ← Business logic
│   ├── patients.module.ts           ← Module setup
│   └── dto/patient.dto.ts           ← Request/response models
└── ...
```

---

## AUTHENTICATION ENDPOINTS

### 1. LOGIN - POST /api/auth

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Success Response (200):**
```json
{
  "message": "Authentication successful"
}
```
Header: `Set-Cookie: access_token=<jwt>; httpOnly; Secure; SameSite=Lax; Path=/`

**Error Responses:**
- 404: User not found
- 400: Invalid password or validation error

---

## PATIENT ENDPOINTS (UNPROTECTED - CRITICAL ISSUE!)

### 1. CREATE PATIENT - POST /api/patients

**Request:**
```bash
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "familyId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "dateOfBirth": "2000-01-01",
    "weight": 65,
    "height": 175,
    "medicalHistory": ["Hypertension"]
  }'
```

**Success Response (201):**
```json
{
  "message": "Patient created successfully",
  "data": {
    "id": "patient-uuid",
    "familyId": "...",
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

**Error Response (400):**
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

### 2. GET ALL PATIENTS - GET /api/patients

**Query Parameters (optional):**
- `name`: Filter by patient name
- `hasAppointments`: 'true' or 'false'
- `status`: PENDING|CONFIRMED|ONGOING|COMPLETED|CANCELLED

**Request:**
```bash
curl http://localhost:3000/api/patients?name=John&hasAppointments=true
```

### 3. GET PATIENT BY ID - GET /api/patients/:id

```bash
curl http://localhost:3000/api/patients/patient-uuid
```

### 4. UPDATE PATIENT - PATCH /api/patients/:id

```bash
curl -X PATCH http://localhost:3000/api/patients/patient-uuid \
  -H "Content-Type: application/json" \
  -d '{
    "weight": 70,
    "height": 176
  }'
```

### 5. DELETE PATIENT - DELETE /api/patients/:id

```bash
curl -X DELETE http://localhost:3000/api/patients/patient-uuid
```

---

## JWT TOKEN STRUCTURE

```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "user_id": "user-uuid",
  "email": "user@example.com",
  "role": "FAMILY",        # Can be: ADMIN, FAMILY, NURSE
  "iat": 1719914400,       # Issued at
  "exp": 1719918000        # Expires at (1 hour or 1 day)
}

Signed with: env.JWT_SECRET
```

---

## SECURITY VULNERABILITIES

| Issue | Severity | Impact | File |
|-------|----------|--------|------|
| No JWT guards on patient endpoints | CRITICAL | Anyone can CRUD patient data | patients.controller.ts |
| No RBAC on routes | HIGH | Nurses could create patients (FAMILY-only) | patients.controller.ts |
| CORS origin: true | HIGH | XSS/CSRF attacks from any domain | main.ts |
| No rate limiting per user | MEDIUM | Account enumeration possible | app.module.ts |

---

## QUICK SECURITY AUDIT CHECKLIST

- [ ] Add `@UseGuards(JwtAuthGuard)` to all patient endpoints
- [ ] Add role decorators: `@Roles('FAMILY')`, `@Roles('NURSE')`, etc.
- [ ] Implement RolesGuard to check user role
- [ ] Change CORS `origin: true` to specific domain(s)
- [ ] Add user ID check: patients should only see/modify their own data
- [ ] Add rate limiting per user (not just global)
- [ ] Add request logging for audit trail
- [ ] Hash sensitive data in logs

---

## ENVIRONMENT VARIABLES REQUIRED

```bash
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key-here  # Min 32 chars recommended
IS_PRODUCTION=false
MIDTRANS_CLIENT_KEY=...
MIDTRANS_SERVER_KEY=...
MIDTRANS_IS_PRODUCTION=false
```

---

## VALIDATION RULES

### Patient Creation

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| familyId | string | Yes | Must be valid UUID |
| name | string | Yes | Min 1 character |
| dateOfBirth | date | Yes | Valid date string (YYYY-MM-DD) |
| weight | number | No | Must be positive |
| height | number | No | Must be positive |
| medicalHistory | array | No | Array of strings |

---

## AUTHENTICATION FLOW SUMMARY

```
1. Client sends POST /api/auth with email & password
2. Server finds user by email
3. Server compares password with bcrypt hash
4. If match: Generate JWT token signed with JWT_SECRET
5. Server sets httpOnly cookie: access_token=<jwt>
6. Client's browser automatically sends cookie on subsequent requests
7. [CURRENTLY: NO GUARD] Server should verify JWT and extract user info
8. [CURRENTLY: NO GUARD] Server should check user role for authorization
```

---

## RECOMMENDED QUICK FIX

### Step 1: Create JWT Guard

File: `src/auth/jwt-auth.guard.ts`
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

File: `src/patients/patients.controller.ts`
```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('patients')
@UseGuards(JwtAuthGuard)
export class PatientsController {
  // All endpoints now require valid JWT token
  // ...
}
```

### Step 3: Restart Server
```bash
npm run start:dev
```

---

## TESTING THE FIX

### Before (Currently works without auth):
```bash
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -d '{"familyId":"...","name":"John",...}'
# Returns 201 - SECURITY ISSUE!
```

### After Fix (Requires auth):
```bash
# 1. Login first
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# 2. Browser saves access_token cookie automatically

# 3. Create patient (now requires valid token)
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -b "access_token=<jwt_token>" \
  -d '{"familyId":"...","name":"John",...}'
# Returns 201 - Only if token is valid

# 4. Without token:
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -d '{"familyId":"...","name":"John",...}'
# Returns 401 Unauthorized - CORRECT!
```

---

## FULL AUTHENTICATION FLOW

```
┌─────────┐                                      ┌────────┐
│ Browser │                                      │ Server │
└────┬────┘                                      └───┬────┘
     │                                               │
     │  1. POST /api/auth                           │
     │  { email, password }                         │
     ├──────────────────────────────────────────────>│
     │                                               │
     │                                    2. Verify bcrypt hash
     │                                    3. Generate JWT
     │                                               │
     │  4. 200 OK                                   │
     │  Set-Cookie: access_token=<JWT>             │
     │<──────────────────────────────────────────────┤
     │                                               │
     │  5. Browser stores httpOnly cookie           │
     │  (JavaScript cannot access)                  │
     │                                               │
     │  6. GET /api/patients                         │
     │  (Cookie automatically included)             │
     ├──────────────────────────────────────────────>│
     │                                               │
     │                                    7. Verify JWT token
     │                                    8. Extract user info
     │                                    9. Execute request
     │                                               │
     │  10. 200 OK + Patient Data                   │
     │<──────────────────────────────────────────────┤
     │                                               │
```

---

Generated: 2024-04-30
Source: Paring Backend Security Analysis
