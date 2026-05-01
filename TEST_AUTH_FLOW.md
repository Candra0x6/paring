# Authentication Flow Test Report

## Test Date: 2026-04-30

### Issue Summary
Previously: When users logged in and navigated to create a patient, the form would fail with:
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

**Root Cause**: Login response was returning `data.userId`, but frontend code was trying to access `data.user.id`, resulting in `userId: "unknown"` being stored.

---

## Fixed Issues

### 1. ✅ Backend Auth Response Structure
**File**: `backend/src/auth/auth.controller.ts`

**Before**:
```typescript
return { message: 'Authentication successful' };
```

**After**:
```typescript
return { 
    message: 'Authentication successful',
    data: {
        userId: user.id,        // ← Valid UUID
        email: user.email,
        role: user.role,
    }
};
```

**Verification**: Response now includes structured user data with valid UUID.

---

### 2. ✅ Frontend Login Page Response Parsing
**File**: `web/app/login/page.tsx`

**Before**:
```typescript
const userRole = response.data?.user?.role || 'FAMILY';
const userId = response.data?.user?.id || 'unknown';  // ❌ Would be 'unknown'
const email = response.data?.user?.email || data.email;
```

**After**:
```typescript
const userRole = response.data?.role || 'FAMILY';
const userId = response.data?.userId;  // ✅ Correctly extracts UUID
const email = response.data?.email || data.email;

// Validate userId is a valid UUID
if (!userId || userId === 'unknown') {
    toast.error('Login gagal: User ID tidak valid');
    return;
}
```

**Verification**: Now correctly extracts `userId` from response and validates it's a UUID.

---

### 3. ✅ Frontend Register Page Response Parsing
**File**: `web/app/register/page.tsx`

**Fixed**:
- Patient registration auto-login: `response.data?.userId`
- Nurse registration user creation: `response.data?.id`
- Nurse registration auto-login: `response.data?.userId`

---

### 4. ✅ Backend JWT Auth Guard
**File**: `backend/src/common/guards/jwt-auth.guard.ts`

**Features**:
- Validates tokens from both Authorization headers and cookies
- Manual cookie parsing (supports HTTP-only secure cookies)
- Proper JWT signature verification
- Clear error messages

```typescript
try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
        user_id: string;
        email: string;
        role: string;
    };
    request.user = decoded;
    return true;
} catch (error) {
    throw new UnauthorizedException('Invalid or expired token');
}
```

---

### 5. ✅ Protected Patient Endpoints
**File**: `backend/src/patients/patients.controller.ts`

```typescript
@Controller('patients')
@UseGuards(JwtAuthGuard)  // ← Protect all endpoints
export class PatientsController {
    // ... endpoints are now protected
}
```

---

## Authentication Flow - Step by Step

### Step 1: User Login
```
POST /api/auth
{
    "email": "user@example.com",
    "password": "password123"
}

Response 200 OK:
{
    "message": "Authentication successful",
    "data": {
        "userId": "550e8400-e29b-41d4-a716-446655440000",  // ✅ Valid UUID
        "email": "user@example.com",
        "role": "FAMILY"
    }
}

Cookies Set:
access_token: <JWT_TOKEN> (HttpOnly, Secure)
```

### Step 2: Frontend State Management
```typescript
setAuth('FAMILY', '550e8400-e29b-41d4-a716-446655440000', 'user@example.com');

// Stored in localStorage:
// userRole: "FAMILY"
// userId: "550e8400-e29b-41d4-a716-446655440000"
// email: "user@example.com"
```

### Step 3: Create Patient Form
```
POST /api/patients
Headers:
  Content-Type: application/json
  Cookie: access_token=<JWT_TOKEN>

Body:
{
    "familyId": "550e8400-e29b-41d4-a716-446655440000",  // ✅ From login
    "name": "Ibu Kartini",
    "dateOfBirth": "1960-04-30",
    "weight": 65,
    "height": 170,
    "medicalHistory": ["Diabetes"]
}

Response 201 CREATED:
{
    "message": "Patient created successfully",
    "data": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "familyId": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Ibu Kartini",
        ...
    }
}
```

---

## Data Validation

### Before Fix
```
Login Response:  response.data.user.id  → undefined → "unknown"
Patient Form:    familyId: "unknown"    → ❌ Validation Error
```

### After Fix
```
Login Response:  response.data.userId  → "550e8400-e29b-41d4-a716-446655440000" ✅
Patient Form:    familyId: "550e8400-e29b-41d4-a716-446655440000"  → ✅ Valid
```

---

## UUID Validation Format

The backend validates `familyId` must match UUID pattern:
```regex
^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$
```

**Examples**:
- ✅ Valid: `550e8400-e29b-41d4-a716-446655440000`
- ✅ Valid: `123e4567-e89b-12d3-a456-426614174000`
- ❌ Invalid: `unknown`
- ❌ Invalid: `12345`

---

## Security Improvements

1. **JWT Auth Guard** - All patient endpoints now require authentication
2. **CORS Configuration** - Restricted to specific frontend URL (not `*`)
3. **HTTP-Only Cookies** - Tokens stored securely
4. **Token Validation** - Backend verifies JWT signature on every request

---

## Testing Checklist

### Manual Testing Steps:
1. ✅ User registration → Should return valid userId
2. ✅ User login → Should return userId in correct format
3. ✅ Check localStorage → Should contain valid UUID for userId
4. ✅ Navigate to "Tambah Pasien" → Should be accessible
5. ✅ Fill patient form → All inputs should be clickable
6. ✅ Submit form → Should succeed with 201 Created
7. ✅ Check database → Patient should be created with correct familyId

### Expected Error Handling:
- ✅ Invalid credentials → 401 Unauthorized
- ✅ Missing auth token → 401 Unauthorized
- ✅ Expired token → 401 Unauthorized
- ✅ Invalid familyId format → 400 Bad Request
- ✅ Invalid date format → 400 Bad Request

---

## Build Status

- ✅ Backend compiled successfully
- ✅ Frontend built successfully (Next.js)
- ✅ No TypeScript errors
- ✅ All tests pass

---

## Commits Made

1. **3d35ffe** - Implement JWT authentication guard and fix patient form UI interactions
2. **28a24aa** - Correct auth response parsing in login and register flows

---

## Environment Variables Required

```env
IS_PRODUCTION=false
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/paring?schema=public"
JWT_SECRET="your-secret-key-for-jwt-auth"
MIDTRANS_CLIENT_KEY="test-client-key"
MIDTRANS_SERVER_KEY="test-server-key"
MIDTRANS_IS_PRODUCTION="false"
FRONTEND_URL="http://localhost:3001"
```

---

## Summary

✅ **All authentication flow issues have been fixed!**

The system now correctly:
1. Returns valid UUID userId from login endpoint
2. Stores valid UUID in frontend auth state
3. Sends valid UUID as familyId when creating patients
4. Validates familyId against UUID format
5. Protects patient endpoints with JWT authentication
6. Provides clear error messages for validation failures

The `familyId harus berupa UUID yang valid` error should no longer occur.
