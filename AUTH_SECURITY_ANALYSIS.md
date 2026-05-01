# PARING Authentication & Security Analysis Report

## Executive Summary

This document provides a comprehensive analysis of the authentication and security implementation across the PARING backend (NestJS) and frontend (Next.js) systems. The implementation uses JWT-based authentication with cookie storage and role-based access control.

---

## 1. BACKEND AUTHENTICATION IMPLEMENTATION (NestJS)

### 1.1 Authentication Module Structure

**File:** `/backend/src/auth/auth.module.ts`
```typescript
- Imports: DatabaseModule
- Controllers: AuthController
- Providers: AuthService
```

**Architecture:**
- **Single Responsibility**: Auth module handles login only
- **Database Integration**: Uses Prisma for user lookup
- **No Refresh Token Mechanism**: Current implementation doesn't have token refresh

### 1.2 JWT Strategy & Token Generation

**File:** `/backend/src/auth/auth.service.ts`

**Login Flow:**
1. Validates email exists in database
2. Compares provided password with bcrypt-hashed `passwordHash`
3. Generates JWT token with payload:
   ```typescript
   {
     user_id: user.id,
     email: user.email,
     role: user.role
   }
   ```

**Token Configuration:**
```typescript
jwt.sign(payload, env.JWT_SECRET, {
  expiresIn: env.IS_PRODUCTION ? '1d' : '1h'
})
```

**⚠️ Security Considerations:**
- Production tokens expire in 24 hours (industry standard: 15min-1h)
- Dev tokens expire in 1 hour (good for testing)
- **No refresh token strategy** - users must re-login after token expires
- **Secret stored in .env** - proper approach but must be protected

### 1.3 JWT Authentication Guard

**File:** `/backend/src/common/guards/jwt-auth.guard.ts`

**Dual Token Acceptance Strategy:**
1. **Priority 1**: Authorization header with Bearer token
   ```
   Authorization: Bearer <JWT_TOKEN>
   ```
2. **Fallback**: HTTP-only cookie (`access_token`)
   ```
   Cookie: access_token=<JWT_TOKEN>
   ```

**Token Validation:**
```typescript
jwt.verify(token, env.JWT_SECRET)
```

**Implementation Details:**
- Manual cookie parsing (no cookie-parser middleware)
- Attaches decoded token to `request.user`:
  ```typescript
  request.user = {
    user_id: string,
    email: string,
    role: string
  }
  ```

**🔒 Security Features:**
- ✅ Throws `UnauthorizedException` on missing/invalid token
- ✅ Properly validates token signature
- ✅ Returns 401 on expired tokens

### 1.4 Protected Endpoints

**File:** `/backend/src/patients/patients.controller.ts`

**Example - Global Route Protection:**
```typescript
@Controller('patients')
@UseGuards(JwtAuthGuard)  // Applied to all routes in controller
export class PatientsController {
  @Get()
  @Post()
  @Patch()
  @Delete()
}
```

**Applied To:**
- ✅ `/patients` (all CRUD operations)
- ⚠️ `/auth` endpoint is NOT protected (correct - public login)
- ⚠️ Other controllers need verification for protection

### 1.5 Role-Based Access Control (RBAC)

**Defined Roles:**
```typescript
enum Role {
  ADMIN = 'ADMIN',
  FAMILY = 'FAMILY',
  NURSE = 'NURSE'
}
```

**Role Enforcement Examples:**

**Patients Service** (`/backend/src/patients/patients.service.ts`):
```typescript
// Only FAMILY role can add patients
if (userExists.role !== 'FAMILY') {
  throw new BadRequestException(
    'Hanya user dengan role FAMILY yang dapat menambahkan pasien'
  );
}
```

**Nurses Service** (`/backend/src/nurses/nurses.service.ts`):
```typescript
// Only NURSE role can create nurse profile
if (user.role !== 'NURSE') {
  throw new BadRequestException(
    'Hanya user dengan role NURSE yang dapat membuat profil perawat'
  );
}
```

**⚠️ Issues:**
- Role checking is done in **service layer** (not in guards)
- No centralized role-based guards (e.g., `@Roles('FAMILY')` decorator)
- Role validation happens **after** JWT validation, adding latency

### 1.6 Login Endpoint Response

**File:** `/backend/src/auth/auth.controller.ts`

**POST /api/auth**
```typescript
Request:
{
  email: string,
  password: string
}

Response (200):
{
  message: "Authentication successful",
  data: {
    userId: string,
    email: string,
    role: 'ADMIN' | 'FAMILY' | 'NURSE'
  }
}
```

**Cookie Setting:**
```typescript
res.cookie('access_token', token, {
  httpOnly: true,           // ✅ Prevents XSS access
  secure: env.IS_PRODUCTION, // ✅ HTTPS only in production
  sameSite: 'lax',          // ✅ CSRF protection
  path: '/'
})
```

**🔒 Security Features:**
- ✅ HttpOnly flag prevents JavaScript access
- ✅ Secure flag enforces HTTPS in production
- ✅ SameSite=Lax provides CSRF protection

### 1.7 Environment Variables

**File:** `/backend/.env`
```
IS_PRODUCTION=false
JWT_SECRET="your-secret-key-for-jwt-auth"
DATABASE_URL="postgresql://..."
FRONTEND_URL="http://localhost:3001"
```

**⚠️ Configuration Issues:**
- JWT_SECRET is weak in example ("your-secret-key-for-jwt-auth")
- No rotation mechanism
- Frontend URL hard-coded (consider multiple environments)

### 1.8 CORS Configuration

**File:** `/backend/src/main.ts`

**Current Setup:**
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true,  // ✅ Allows cookies with cross-origin
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
})
```

**🔒 Security:**
- ✅ Credentials enabled for cookie authentication
- ✅ Specific origin allowed
- ⚠️ No rate limiting visible

---

## 2. FRONTEND AUTHENTICATION IMPLEMENTATION (Next.js)

### 2.1 Auth State Management

**File:** `/web/lib/auth-context.ts`

**Tool:** Zustand (lightweight state management)

**State Structure:**
```typescript
interface AuthState {
  userRole: 'FAMILY' | 'NURSE' | 'ADMIN' | null,
  userId: string | null,
  email: string | null,
  
  setAuth: (role, userId, email) => void,
  logout: () => void,
  isAuthenticated: () => boolean,
  initializeFromStorage: () => void
}
```

**Storage Strategy:**
```typescript
// Using localStorage
localStorage.setItem('userRole', role)
localStorage.setItem('userId', userId)
localStorage.setItem('email', email)
```

**⚠️ Security Issues:**
- **Storing auth state in localStorage is vulnerable to XSS**
- JWT token stored in HTTP-only cookie (good)
- But user info stored in accessible localStorage

**Initialization:**
```typescript
initializeFromStorage() {
  // Rehydrate auth state on page load
  // Only runs in browser (checks typeof window)
}
```

### 2.2 API Client Configuration

**File:** `/web/lib/api-client.ts`

**Axios Setup:**
```typescript
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,  // ✅ Include cookies
  headers: {
    'Content-Type': 'application/json'
  }
})
```

**Response Interceptor for Auth Errors:**
```typescript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Session expired
      localStorage.removeItem('userRole')
      localStorage.removeItem('userId')
      localStorage.removeItem('email')
      toast.error('Session expired. Please login again.')
      window.location.href = '/login'
    }
    
    if (error.response?.status === 409) {
      // Conflict (duplicate email)
    }
    
    if (error.response?.status === 400) {
      // Validation error
    }
  }
)
```

**🔒 Security:**
- ✅ Automatic session cleanup on 401
- ✅ Cookies sent automatically with requests
- ⚠️ No request interceptor for Authorization header (relies on cookies)

### 2.3 Login Flow

**File:** `/web/app/login/page.tsx`

**Step-by-Step Flow:**
```typescript
1. User enters email/password
2. Form validated with Zod schema:
   - Email must be valid format
   - Password minimum 6 characters

3. useLogin() hook called with credentials
   - Mutation sends POST /api/auth

4. On Success:
   - Extract userRole, userId, email from response
   - Validate userId (check for 'unknown')
   - Call setAuth() to store in Zustand + localStorage
   - Redirect based on role:
     * NURSE → /nurse/dashboard
     * FAMILY → /dashboard

5. On Error:
   - Display error toast
   - Show specific error message from backend
```

**API Hook:**
```typescript
export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await apiClient.post('/auth', data)
      return response.data
    }
  })
}
```

### 2.4 Protected Routes

**Current Implementation: ⚠️ NO BUILT-IN PROTECTION**

**Dashboard Layout** (`/web/app/dashboard/layout.tsx`):
- No authentication check
- Navigation visible immediately
- Anyone can access `/dashboard` in theory

**Protected Feature Usage:**
```typescript
// In page components
const { userId } = useAuthStore()

if (!userId) {
  toast.error('User not authenticated')
  return
}
```

**⚠️ Issue:**
- Protection happens **in component** after render
- No redirect to /login automatically
- Users could see protected content briefly

**Recommended Pattern:**
```typescript
// Should use middleware for route protection
// export function middleware(request) {
//   if (!hasValidToken) redirect to /login
// }
```

### 2.5 Logout Implementation

**From Auth Store:**
```typescript
logout: () => {
  set({ userRole: null, userId: null, email: null })
  localStorage.removeItem('userRole')
  localStorage.removeItem('userId')
  localStorage.removeItem('email')
  window.location.href = '/login'
}
```

**⚠️ Issues:**
- No backend logout endpoint
- Cookie not explicitly cleared
- Full page redirect (not graceful)

### 2.6 React Query Integration

**File:** `/web/lib/react-query.ts` + `/web/lib/hooks/useApi.ts`

**Query Client Setup:**
```typescript
const queryClient = new QueryClient({
  // Default retry/error handling
})
```

**Auth Hooks:**
```typescript
useLogin()           // POST /auth
useRegisterUser()    // POST /users
useUserById(id)      // GET /users/:id
useUpdateUser()      // PATCH /users/:id
useDeleteUser()      // DELETE /users/:id
```

**Query Invalidation on Success:**
```typescript
// After mutation success, invalidate related queries
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['users'] })
}
```

**🔒 Security:**
- ✅ 401 errors automatically handled
- ✅ Queries re-run on auth state change
- ⚠️ No explicit CSRF token handling (relies on SameSite cookies)

### 2.7 Validation

**File:** `/web/lib/validation.ts`

**Login Schema:**
```typescript
loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})
```

**Registration Schemas:**
```typescript
patientRegistrationSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phoneNumber: z.string().min(10),
  password: z.string().min(6),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword)

nurseRegistrationSchema = z.object({
  // + specialization, experienceYears
})
```

### 2.8 Providers & Setup

**File:** `/web/app/providers.tsx`

```typescript
export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
```

**⚠️ Missing:**
- No global auth context provider
- No automatic token refresh on app startup
- localStorage initialization should happen here

---

## 3. COMPLETE AUTHENTICATION FLOW

### 3.1 Login Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND - User Inputs Credentials                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Zod Validation (email, password)                             │
│ - Email format check                                         │
│ - Password min 6 chars                                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ POST /api/auth (apiClient.post)                              │
│ - withCredentials: true (sends cookies)                      │
│ - Payload: { email, password }                               │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
   ┌─────────────────────────────────────────────────────────┐
   │ BACKEND - AuthController.create()                        │
   └────────────────────┬────────────────────────────────────┘
                        │
                        ▼
   ┌─────────────────────────────────────────────────────────┐
   │ AuthService.create()                                     │
   │ - Find user by email                                     │
   │ - Compare password vs bcrypt hash                        │
   │ - If invalid: throw BadRequestException                  │
   └────────────────────┬────────────────────────────────────┘
                        │
                ┌───────┴────────┐
                │                │
           ✅ Valid         ❌ Invalid
                │                │
                ▼                ▼
          ┌──────────────┐  ┌─────────────────────────┐
          │ Generate JWT │  │ 400/401 Error Response  │
          │ Payload:     │  │ - Frontend shows toast  │
          │ - user_id    │  │ - User stays on login   │
          │ - email      │  └─────────────────────────┘
          │ - role       │
          │ Expires:     │
          │ - Prod: 1d   │
          │ - Dev: 1h    │
          └──────┬───────┘
                 │
                 ▼
        ┌─────────────────────────────────────────────────────┐
        │ Set HTTP-only Cookie                                │
        │ - Name: access_token                                │
        │ - Value: JWT                                        │
        │ - HttpOnly: true (JS can't access)                  │
        │ - Secure: true (HTTPS only in prod)                │
        │ - SameSite: Lax (CSRF protection)                   │
        └────────────────────┬────────────────────────────────┘
                             │
                             ▼
        ┌─────────────────────────────────────────────────────┐
        │ Return 200 Response                                 │
        │ {                                                   │
        │   message: "Authentication successful",             │
        │   data: {                                           │
        │     userId: "uuid",                                 │
        │     email: "user@example.com",                      │
        │     role: "FAMILY" | "NURSE" | "ADMIN"              │
        │   }                                                 │
        │ }                                                   │
        └────────────────────┬────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
┌─────────────────────────────────────────────────────────┐
│ FRONTEND - Handle Success                               │
│ 1. Extract userRole, userId, email                      │
│ 2. Validate userId !== 'unknown'                        │
│ 3. Call setAuth(role, userId, email)                    │
│    - Store in Zustand state                             │
│    - Store in localStorage                              │
│ 4. Show success toast                                   │
│ 5. Redirect:                                            │
│    - NURSE → /nurse/dashboard                           │
│    - FAMILY → /dashboard                                │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Token Storage & Refresh Mechanism

**Current Token Storage:**
```
┌─────────────────────────────────────────────┐
│ HTTP-only Cookie (secure)                   │
├─────────────────────────────────────────────┤
│ Name: access_token                          │
│ Value: JWT token                            │
│ HttpOnly: true ✅                           │
│ Secure: true (prod) ✅                      │
│ Domain: automatic                           │
│ Path: /                                     │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Browser localStorage (accessible)           │
├─────────────────────────────────────────────┤
│ userRole: "FAMILY" | "NURSE" | "ADMIN"      │
│ userId: "uuid"                              │
│ email: "user@example.com"                   │
│ ⚠️ Vulnerable to XSS                        │
└─────────────────────────────────────────────┘
```

**Refresh Mechanism: ⚠️ NOT IMPLEMENTED**
```
❌ No refresh token endpoint
❌ No automatic token refresh
❌ No token expiration handling in frontend
❌ User must re-login when token expires

Current expiration:
- Production: 24 hours
- Development: 1 hour

When token expires:
1. Next API call returns 401
2. Response interceptor catches it
3. localStorage cleared
4. User redirected to /login
5. Session lost
```

### 3.3 Protected Endpoints Flow

**Example: Create Patient**
```
┌─────────────────────────────────────────────────────────┐
│ FRONTEND                                                │
│ 1. User clicks "Add Patient"                            │
│ 2. Form submission                                      │
│ 3. useCreatePatient() called                            │
│    - apiClient.post('/patients', data)                  │
│    - withCredentials: true                              │
│    - Cookies sent automatically ✅                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ BACKEND - HTTP Request Received                         │
│ Headers include:                                        │
│ - Cookie: access_token=<JWT>                            │
│ - Content-Type: application/json                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ @UseGuards(JwtAuthGuard)                                │
│ 1. Extract token from Cookie (or Auth header)           │
│ 2. Verify JWT signature with JWT_SECRET                 │
│ 3. Decode payload → request.user                        │
│    {                                                    │
│      user_id: "uuid",                                   │
│      email: "user@example.com",                         │
│      role: "FAMILY"                                     │
│    }                                                    │
│ 4. If valid: continue to handler                        │
│    If invalid: throw 401 Unauthorized                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ PatientsController.create()                             │
│ Access request.user available                           │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ PatientsService.create()                                │
│ 1. Check user role === 'FAMILY'                         │
│    If not: throw BadRequestException                    │
│ 2. Query database with familyId = userId               │
│ 3. Create patient record                                │
│ 4. Return patient data                                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ FRONTEND - Response Handling                            │
│ 1. Success: show toast, redirect                        │
│ 2. 401: clear localStorage, redirect to /login          │
│ 3. 400: show validation error                           │
└─────────────────────────────────────────────────────────┘
```

### 3.4 Logout Flow

**Current Implementation:**
```
Frontend Logout:
┌────────────────────────────────────────────┐
│ useAuthStore.logout()                      │
├────────────────────────────────────────────┤
│ 1. Clear Zustand state                     │
│    - userRole = null                       │
│    - userId = null                         │
│    - email = null                          │
│                                            │
│ 2. Clear localStorage                      │
│    - removeItem('userRole')                │
│    - removeItem('userId')                  │
│    - removeItem('email')                   │
│                                            │
│ 3. Redirect to /login                      │
│    - window.location.href = '/login'       │
│                                            │
│ ⚠️ Issues:                                 │
│ - Cookie NOT explicitly cleared            │
│ - No backend logout endpoint               │
│ - Token still valid for 1d (prod) / 1h    │
└────────────────────────────────────────────┘

Backend:
- No logout endpoint
- Cookie remains until expiration
- OR until browser is closed (if session-only)
```

---

## 4. ROLE-BASED ACCESS CONTROL (RBAC)

### 4.1 Defined Roles

```typescript
enum Role {
  ADMIN = 'ADMIN',    // System administrator
  FAMILY = 'FAMILY',  // Patient/elder family member
  NURSE = 'NURSE'     // Healthcare provider
}
```

### 4.2 Current Role Enforcement

**Location:** In service layer (not ideal)

**Patients Service:**
```typescript
if (userExists.role !== 'FAMILY') {
  throw new BadRequestException(
    'Hanya user dengan role FAMILY yang dapat menambahkan pasien'
  );
}
```

**Nurses Service:**
```typescript
if (user.role !== 'NURSE') {
  throw new BadRequestException(
    'Hanya user dengan role NURSE yang dapat membuat profil perawat'
  );
}
```

### 4.3 Frontend Role Handling

**In Auth Store:**
```typescript
userRole: 'FAMILY' | 'NURSE' | 'ADMIN' | null
```

**Login Redirect:**
```typescript
if (userRole === 'NURSE') {
  router.push('/nurse/dashboard')
} else {
  router.push('/dashboard')  // FAMILY default
}
```

**Route Structure:**
```
/dashboard/              → FAMILY user area
  - patients/
  - bookings/
  - nurses/ (search)
  
/nurse/                  → NURSE user area
  - dashboard/
  - availability/
  - earnings/
  - sessions/
```

**⚠️ No Admin Interface Currently Visible**

### 4.4 Missing Role Guards

**Recommended Implementation:**
```typescript
// Should have custom guards like:
@Roles('FAMILY')
@UseGuards(JwtAuthGuard, RolesGuard)
@Post()
createPatient() { }

@Roles('NURSE', 'ADMIN')
@UseGuards(JwtAuthGuard, RolesGuard)
@Get()
getNurses() { }
```

---

## 5. SECURITY ASSESSMENT

### 5.1 ✅ Strengths

| Feature | Implementation |
|---------|-----------------|
| **Password Security** | Bcrypt hashing with salt (10 rounds) |
| **Token Signing** | JWT with HS256 algorithm |
| **Cookie Security** | HttpOnly flag prevents XSS |
| **HTTPS Enforcement** | Secure flag in production |
| **CSRF Protection** | SameSite=Lax cookie attribute |
| **CORS Config** | Specific origin validation |
| **Credentials Allowed** | Proper handling of cross-origin cookies |
| **Input Validation** | Zod schemas on frontend & backend |
| **Unauthorized Handling** | 401 triggers logout & redirect |
| **Role Encoding** | JWT includes role for permission decisions |

### 5.2 ⚠️ Vulnerabilities

| Issue | Severity | Impact | Recommendation |
|-------|----------|--------|-----------------|
| **No Refresh Token** | Medium | Long token expiration (1d prod) = larger compromise window | Implement refresh token with short-lived access token |
| **Role Check in Service** | Low | Performance + maintainability | Create @Roles() decorator with RolesGuard |
| **localStorage Auth Data** | Medium | Vulnerable to XSS | Remove role/userId from localStorage (keep in cookie) |
| **No Backend Logout** | Low | Token remains valid after logout | Add logout endpoint to invalidate token |
| **No Rate Limiting** | Medium | Brute force attacks possible | Implement @nestjs/throttler |
| **No Audit Logging** | Low | Can't track authentication events | Log login/logout with timestamps |
| **Single JWT Secret** | Low | Key rotation difficult | Implement key versioning |
| **No Token Blacklist** | Low | Revoked tokens still valid | Implement Redis blacklist or JWT with jti claim |
| **Weak Example Secret** | Medium | Dev users might use weak secrets | Force strong secret in env validation |

### 5.3 🔒 Recommendations Priority

**Immediate (P0):**
1. ✅ Implement refresh token mechanism
   - Short access token (15-30 min)
   - Long refresh token (7 days)
   - Rotate refresh token on each use

2. ✅ Add rate limiting
   ```typescript
   @Throttle(5, 15) // 5 attempts per 15 seconds
   @Post('/auth')
   login() { }
   ```

3. ✅ Remove sensitive data from localStorage
   - Only keep in HttpOnly cookie
   - Fetch user info from `/me` endpoint if needed

**Short-term (P1):**
1. ✅ Implement role-based guards
   ```typescript
   @Roles('FAMILY', 'NURSE')
   @UseGuards(RolesGuard)
   ```

2. ✅ Add backend logout endpoint
   ```typescript
   @Post('/auth/logout')
   logout() {
     // Invalidate token (add to blacklist)
     // Clear cookie
   }
   ```

3. ✅ Add audit logging
   - Log all auth events
   - Track login/logout times
   - Track role changes

**Medium-term (P2):**
1. Add 2FA support
2. Add session management
3. Implement JWT token blacklist
4. Add password reset flow
5. Add email verification

---

## 6. ENVIRONMENT VARIABLES REFERENCE

### Backend

```bash
# .env
IS_PRODUCTION=false|true
JWT_SECRET=<strong-secret-key>
DATABASE_URL=postgresql://...
FRONTEND_URL=http://localhost:3001
MIDTRANS_CLIENT_KEY=<key>
MIDTRANS_SERVER_KEY=<key>
MIDTRANS_IS_PRODUCTION=false|true
```

### Frontend

```bash
# .env.local or .env.production
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_WHATSAPP_ADMIN=628xxxx
```

**⚠️ Current State:**
- Backend `.env` has weak example secret
- No `.env.local` in frontend repo
- NEXT_PUBLIC_API_URL not in `.env` files (hardcoded in code)

---

## 7. COMPLETE AUTH FLOW SUMMARY

### Login → Token Storage → API Calls → Token Refresh → Logout

```
═══════════════════════════════════════════════════════════════
1. LOGIN
═══════════════════════════════════════════════════════════════
User enters credentials
  ↓
Frontend validates (Zod)
  ↓
POST /api/auth {email, password}
  ↓
Backend validates (DB + bcrypt)
  ↓
Generate JWT (24h/1h expiry)
  ↓
Set HttpOnly cookie
  ↓
Return {userId, email, role}
  ↓
Frontend stores in Zustand + localStorage

═══════════════════════════════════════════════════════════════
2. TOKEN STORAGE
═══════════════════════════════════════════════════════════════
Secure Storage:
  ✅ HttpOnly Cookie (access_token)
  ├─ Sent automatically with requests
  ├─ Protected by SameSite
  ├─ HTTPS only in production

Accessible Storage (XSS Risk):
  ⚠️ localStorage
  ├─ userRole
  ├─ userId
  ├─ email

═══════════════════════════════════════════════════════════════
3. API CALLS (Protected Endpoints)
═══════════════════════════════════════════════════════════════
apiClient.post('/patients', data)
  ↓ (withCredentials: true)
Cookie: access_token=<JWT> sent automatically
  ↓
Backend receives request
  ↓
JwtAuthGuard:
  - Extract token from cookie
  - Verify signature
  - Decode payload
  ↓
Check request.user.role === required role
  ↓
Service layer enforces role (⚠️ should be in guard)
  ↓
Execute controller logic
  ↓
Return response or 401/403 error

═══════════════════════════════════════════════════════════════
4. TOKEN REFRESH
═══════════════════════════════════════════════════════════════
❌ NOT IMPLEMENTED

Current behavior:
  Token expires after 24h (prod) / 1h (dev)
  ↓
  Next API call → 401 Unauthorized
  ↓
  Response interceptor catches 401
  ↓
  Clear localStorage
  ↓
  Redirect to /login
  ↓
  User must re-enter credentials

Recommended implementation:
  Access token expires in 15 min
  ↓
  401 → Refresh token flow
  ↓
  POST /auth/refresh {refreshToken}
  ↓
  Return new access token
  ↓
  Retry original request
  ↓
  If refresh fails → redirect to /login

═══════════════════════════════════════════════════════════════
5. LOGOUT
═══════════════════════════════════════════════════════════════
User clicks logout
  ↓
useAuthStore.logout()
  ├─ Clear Zustand state
  ├─ Clear localStorage
  └─ window.location.href = '/login'

Issues:
  ❌ No POST /auth/logout endpoint
  ❌ Cookie NOT explicitly cleared
  ❌ Token remains valid until expiration
  ❌ No session invalidation on backend

Recommended:
  POST /auth/logout
  ├─ Backend adds token to blacklist
  ├─ Sets cookie to expire immediately
  └─ Frontend clears state & redirects

═══════════════════════════════════════════════════════════════
```

---

## 8. IMPLEMENTATION CHECKLIST

### Current Implementation Status

```
✅ IMPLEMENTED:
- [x] JWT-based authentication
- [x] Password hashing (bcrypt)
- [x] Login endpoint
- [x] Protected routes with guards
- [x] Role-based access (in service layer)
- [x] Cookie-based token storage
- [x] 401 error handling
- [x] Logout (frontend only)
- [x] Input validation (Zod)

⚠️ PARTIALLY IMPLEMENTED:
- [ ] Token refresh (no refresh token)
- [ ] Rate limiting (no throttler)
- [ ] Audit logging (missing)
- [ ] Backend logout endpoint (missing)

❌ NOT IMPLEMENTED:
- [ ] 2FA
- [ ] Email verification
- [ ] Password reset
- [ ] Session management
- [ ] Token blacklist
- [ ] Role-based guards (@Roles decorator)
- [ ] Request logging
- [ ] Security headers (CSP, HSTS, X-Frame-Options)
- [ ] API key management
```

---

## 9. CODE REFERENCES

### Backend

1. **auth.service.ts** - Token generation & password validation
2. **jwt-auth.guard.ts** - Token verification & extraction
3. **auth.controller.ts** - Login endpoint & cookie setting
4. **users.service.ts** - User creation with password hashing
5. **main.ts** - CORS & app configuration

### Frontend

1. **auth-context.ts** - Zustand state management
2. **api-client.ts** - Axios configuration with interceptors
3. **login/page.tsx** - Login UI & form handling
4. **useApi.ts** - React Query hooks
5. **validation.ts** - Zod schemas

---

## 10. SUMMARY

The PARING authentication system implements **JWT-based authentication with HTTP-only cookies** and **role-based access control**. While the core implementation is secure (password hashing, token signing, CSRF protection), it lacks:

1. **Token refresh mechanism** - Users face 24h max sessions
2. **Refresh token strategy** - No sliding window sessions
3. **Rate limiting** - Brute force attacks possible
4. **Backend logout** - Tokens remain valid after logout
5. **Role-based guards** - Role enforcement in service layer is inefficient
6. **Audit logging** - No authentication event tracking

The frontend stores sensitive user data in **vulnerable localStorage** despite having a secure HTTP-only cookie available. 

**Priority fixes:** Implement refresh tokens, add rate limiting, remove sensitive data from localStorage, and create role-based guards.

