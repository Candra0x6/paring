# Authentication Implementation Analysis
**PARING Backend & Frontend**

---

## Executive Summary

The current implementation uses a **hybrid JWT + Cookie-based authentication** with **httpOnly secure cookies** for token storage. The backend uses NestJS with a custom JWT guard, and the frontend uses Zustand for state management with axios for HTTP requests. **No refresh tokens are currently implemented**, meaning tokens are valid for 1 hour (dev) or 1 day (production) with no ability to extend sessions.

---

## BACKEND IMPLEMENTATION

### 1. **JWT Configuration & Token Handling**

**File:** `/backend/src/env.ts`
```typescript
const envSchema = z.object({
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(1),
  IS_PRODUCTION: z.preprocess(
    (val) => (typeof val === 'string' ? val.toLowerCase() === 'true' : val),
    z.boolean(),
  ).default(false),
  // ... other env vars
});
```

**Key Points:**
- JWT_SECRET is loaded from environment variables
- No built-in refresh token configuration
- Production vs development distinguished via `IS_PRODUCTION` flag

---

### 2. **Auth Service (Token Generation)**

**File:** `/backend/src/auth/auth.service.ts`

```typescript
@Injectable()
export class AuthService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createAuthDto: CreateAuthDto) {
    // 1. Find user by email
    const user = await this.databaseService.user.findUnique({
      where: { email: createAuthDto.email },
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 2. Compare passwords with bcrypt
    const isPasswordMatch = await bcrypt.compare(
      createAuthDto.password,
      user.passwordHash,
    );
    
    if (!isPasswordMatch) {
      throw new BadRequestException('Invalid password');
    }

    // 3. Generate JWT with 1 hour (dev) or 1 day (prod) expiry
    const token = jwt.sign(
      {
        user_id: user.id,
        email: user.email,
        role: user.role,
      },
      env.JWT_SECRET,
      {
        expiresIn: env.IS_PRODUCTION ? '1d' : '1h',  // ⚠️ NO REFRESH TOKEN
      },
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      }
    };
  }
}
```

**Token Payload Structure:**
```json
{
  "user_id": "uuid-string",
  "email": "user@example.com",
  "role": "FAMILY" | "NURSE" | "ADMIN",
  "iat": timestamp,
  "exp": timestamp
}
```

**Current Token Lifetimes:**
- **Development:** 1 hour
- **Production:** 1 day
- **No refresh mechanism** → Users must re-login after expiry

---

### 3. **Auth Controller (Login Endpoint)**

**File:** `/backend/src/auth/auth.controller.ts`

```typescript
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()  // POST /api/auth
  async create(
    @Res({ passthrough: true }) res: Response,
    @Body(new ZodValidationPipe(createAuthDtoSchema))
    createAuthDto: CreateAuthDto,
  ) {
    const { token, user } = await this.authService.create(createAuthDto);

    // Set httpOnly, secure cookie
    res.cookie('access_token', token, {
      httpOnly: true,           // ✅ Prevents JS access
      secure: env.IS_PRODUCTION, // ✅ HTTPS only in prod
      sameSite: 'lax',          // ✅ CSRF protection
      path: '/',
    });

    return {
      message: 'Authentication successful',
      data: {
        userId: user.id,
        email: user.email,
        role: user.role,
      }
    };
  }
}
```

**Response Format:**
```json
{
  "message": "Authentication successful",
  "data": {
    "userId": "uuid",
    "email": "user@example.com",
    "role": "FAMILY"
  }
}
```

**Cookie Details:**
- **Name:** `access_token`
- **httpOnly:** true (protected from XSS)
- **secure:** true (only in production HTTPS)
- **sameSite:** lax (CSRF protection)
- **path:** / (available to entire app)

---

### 4. **JWT Auth Guard (Route Protection)**

**File:** `/backend/src/common/guards/jwt-auth.guard.ts`

```typescript
@Injectable()
export class JwtAuthGuard {
  private parseCookies(cookieString: string): Record<string, string> {
    const cookies: Record<string, string> = {};
    if (!cookieString) return cookies;
    
    cookieString.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
    });
    return cookies;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Token lookup priority:
    // 1. Authorization: Bearer <token>
    // 2. Cookie: access_token
    let token = null;
    const authHeader = request.headers.authorization;

    if (authHeader) {
      token = authHeader.replace('Bearer ', '');
    } else if (request.headers.cookie) {
      const cookies = this.parseCookies(request.headers.cookie);
      token = cookies.access_token;
    }

    if (!token) {
      throw new UnauthorizedException('Missing authorization token');
    }

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as {
        user_id: string;
        email: string;
        role: string;
      };
      request.user = decoded;  // Attach decoded user to request
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
```

**Token Resolution Logic:**
```
1. Check Authorization header for Bearer token
   ↓ (if present, use it)
2. Parse cookies and look for access_token
   ↓ (if present, use it)
3. If neither found, throw 401 Unauthorized
   ↓
4. Verify JWT signature with JWT_SECRET
   ↓ (if invalid/expired, throw 401)
5. Decode token and attach to request.user
```

---

### 5. **Guard Usage (Protected Routes)**

**File:** `/backend/src/patients/patients.controller.ts`

```typescript
@Controller('patients')
@UseGuards(JwtAuthGuard)  // ✅ Protects ALL routes in this controller
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new patient' })
  async create(
    @Body(new ZodValidationPipe(createPatientSchema))
    createPatientDto: CreatePatientDto,
    @Res() res: Response,
  ) {
    // Only called if JwtAuthGuard passes
    return res.status(HttpStatus.CREATED).json({
      message: 'Patient created successfully',
      data: await this.patientsService.create(createPatientDto),
    });
  }

  @Get()
  async findAll(...) { /* Protected */ }

  @Get(':id')
  async findOne(...) { /* Protected */ }

  // ... other methods
}
```

**Key Pattern:**
- `@UseGuards(JwtAuthGuard)` on class → protects all methods
- Can also be applied to individual methods for granular control
- Failed guard execution throws 401 Unauthorized

---

### 6. **App Setup & CORS Configuration**

**File:** `/backend/src/main.ts`

```typescript
const app = await NestFactory.create(AppModule);

app.setGlobalPrefix('api');
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true,  // ✅ Allow cookies in CORS
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With', 
    'Accept', 
    'Origin'
  ],
  exposedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Total-Count', 
    'X-Page-Number'
  ],
  maxAge: 86400,  // Pre-flight cache 24 hours
});
```

**CORS with Credentials:**
- `credentials: true` allows cookies to be sent/received
- `origin` must be specific (not `*`) when credentials enabled
- Both sides must support this (frontend must set `withCredentials: true`)

---

## FRONTEND IMPLEMENTATION

### 1. **Zustand Auth Store**

**File:** `/web/lib/auth-context.ts`

```typescript
interface AuthState {
  userRole: 'FAMILY' | 'NURSE' | 'ADMIN' | null;
  userId: string | null;
  email: string | null;

  setAuth: (role: string, userId: string, email: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  initializeFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  userRole: null,
  userId: null,
  email: null,

  setAuth: (role, userId, email) => {
    set({ userRole: role as any, userId, email });
    // ⚠️ Store user metadata in localStorage (NOT the token!)
    localStorage.setItem('userRole', role);
    localStorage.setItem('userId', userId);
    localStorage.setItem('email', email);
  },

  logout: () => {
    set({ userRole: null, userId: null, email: null });
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    window.location.href = '/login';  // Force redirect
  },

  isAuthenticated: () => get().userRole !== null,

  initializeFromStorage: () => {
    if (typeof window !== 'undefined') {
      const userRole = localStorage.getItem('userRole');
      const userId = localStorage.getItem('userId');
      const email = localStorage.getItem('email');

      if (userRole && userId && email) {
        set({ userRole: userRole as any, userId, email });
      }
    }
  },
}));
```

**Storage Strategy:**
- ✅ **Token:** Stored in httpOnly cookie (never in JS)
- ✅ **Metadata:** userRole, userId, email in localStorage
- ❌ **Not stored:** Access token (only in cookie)

---

### 2. **Axios API Client with Interceptors**

**File:** `/web/lib/api-client.ts`

```typescript
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,  // ✅ Send cookies automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<any>) => {
    // 401 Unauthorized - Session expired
    if (error.response?.status === 401) {
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      localStorage.removeItem('email');
      toast.error('Session expired. Please login again.');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // 409 Conflict - Duplicate email
    if (error.response?.status === 409) {
      const message = error.response?.data?.message || 'This email already exists';
      toast.error(message);
    }

    // 400 Bad Request - Validation
    if (error.response?.status === 400) {
      const message = error.response?.data?.message || 'Please check your input';
      toast.error(message);
    }

    // 500 Server Error
    if (error.response?.status === 500) {
      toast.error('Server error. Please try again later.');
    }

    // Network error
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
    }

    return Promise.reject(error);
  }
);
```

**Key Features:**
1. **`withCredentials: true`** - Automatically sends httpOnly cookies
2. **401 Handler** - Clears auth state and redirects to login
3. **Error Mapping** - Converts HTTP errors to user-friendly messages
4. **Toast Notifications** - Visual feedback for all error scenarios

**Authentication Flow (Axios):**
```
Request:
  ↓ (axios automatically includes httpOnly cookie)
  ↓ POST /api/auth { email, password }
  ↓
Response:
  ↓ (backend sets Set-Cookie header)
  ↓ Axios receives Set-Cookie automatically
  ↓ Browser stores cookie as httpOnly
```

---

### 3. **Login Implementation**

**File:** `/web/app/login/page.tsx`

```typescript
export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { mutate: login, isPending } = useLogin();

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onSuccess: (response: any) => {
        // Extract user info from response
        // Backend returns: { message, data: { userId, email, role } }
        const userRole = response.data?.role || 'FAMILY';
        const userId = response.data?.userId;
        const email = response.data?.email || data.email;

        // Validate userId
        if (!userId || userId === 'unknown') {
          toast.error('Login gagal: User ID tidak valid');
          return;
        }

        // Store auth state (NOT the token - it's in cookie)
        setAuth(userRole, userId, email);
        toast.success('Login berhasil!');

        // Redirect based on role
        if (userRole === 'NURSE') {
          router.push('/nurse/dashboard');
        } else {
          router.push('/dashboard');
        }
      },
      onError: (error: any) => {
        const errorMsg = error.response?.data?.message || 'Email atau password salah';
        toast.error(errorMsg);
      },
    });
  };

  return (
    // ... JSX form
  );
}
```

**Login Flow:**
```
1. User enters email & password
   ↓
2. Frontend calls POST /api/auth
   ↓
3. Backend verifies credentials
   ↓
4. Backend responds with Set-Cookie header
   ↓
5. Axios intercepts response, stores cookie
   ↓
6. Frontend stores userRole, userId, email in Zustand + localStorage
   ↓
7. Frontend redirects to dashboard
```

---

### 4. **Hook for Login Mutation**

**File:** `/web/lib/hooks/useApi.ts`

```typescript
export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginRequest): Promise<AuthResponse> => {
      const response = await apiClient.post('/auth', data);
      return response.data;
    },
  });
};
```

**Used in components:**
```typescript
const { mutate: login, isPending } = useLogin();

login(
  { email: 'user@example.com', password: 'password123' },
  {
    onSuccess: (response) => { /* handle success */ },
    onError: (error) => { /* handle error */ },
  }
);
```

---

### 5. **Protected Route Access Pattern**

**File:** `/web/app/dashboard/layout.tsx`

```typescript
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Beranda', icon: Home },
    { href: '/dashboard/nurses', label: 'Cari', icon: Search },
    // ... other nav items
  ];

  return (
    // ... layout JSX
  );
}
```

**Current Issue:**
- ❌ No client-side route protection
- ❌ Users can access dashboard URL directly even if not authenticated
- ⚠️ Relies entirely on backend 401 responses to protect API data

---

### 6. **Registration Flow**

**File:** `/web/app/register/page.tsx`

```typescript
const handlePatientRegister = (data: PatientRegistrationFormData) => {
  // 1. Register user
  registerUser(
    {
      fullName: registerData.fullName,
      email: registerData.email,
      phoneNumber: registerData.phoneNumber,
      passwordHash: registerData.password,
      role: 'FAMILY',  // Set role during registration
    },
    {
      onSuccess: (response: any) => {
        // 2. Auto-login after registration
        login(
          {
            email: registerData.email,
            password: registerData.password,
          },
          {
            onSuccess: (loginResponse: any) => {
              const userId = loginResponse.data?.userId;
              if (!userId) {
                toast.error('Login failed: User ID not found');
                router.push('/login');
                return;
              }
              // 3. Store auth state
              setAuth('FAMILY', userId, registerData.email);
              // 4. Redirect
              router.push('/dashboard');
            },
          }
        );
      },
    }
  );
};
```

**Registration → Auto-Login → Dashboard Flow:**
```
1. POST /users (create account)
   ↓
2. POST /auth (login immediately)
   ↓ (backend sets cookie)
3. Store user metadata in Zustand
   ↓
4. Redirect to dashboard
```

---

## VALIDATION

### Backend Validation (Zod)

**File:** `/backend/src/auth/dto/create-auth.dto.ts`

```typescript
export const createAuthDtoSchema = z.object({
  email: z.email('Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});
```

**Applied via Zod Validation Pipe:**
```typescript
@Post()
async create(
  @Body(new ZodValidationPipe(createAuthDtoSchema))
  createAuthDto: CreateAuthDto,
) { ... }
```

### Frontend Validation (React Hook Form + Zod)

**File:** `/web/lib/validation.ts`

```typescript
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
```

**Applied via resolver:**
```typescript
const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
});
```

---

## REQUEST/RESPONSE FLOW DIAGRAMS

### Login Request (with Cookies)
```
Frontend (Browser)
    ↓
    POST /api/auth
    { email, password }
    [Authorization header: Bearer token OR Cookie: access_token]
    ↓
Backend (NestJS)
    ↓
    JwtAuthGuard.canActivate() - only for protected routes
    ├─ Check Authorization header
    ├─ Fall back to cookie
    ├─ Verify JWT signature
    └─ Attach user to request.user
    ↓
Response ← Set-Cookie: access_token=...;httpOnly;secure;sameSite=lax
    ↓
Browser Storage:
    ├─ httpOnly Cookie: access_token
    ├─ localStorage: userRole, userId, email
    └─ Zustand state: userRole, userId, email
```

### Protected Route Request
```
Frontend
    ↓
    GET /api/patients
    [Browser automatically includes httpOnly cookie]
    ↓
Backend
    ↓
    JwtAuthGuard checks cookie in request.headers.cookie
    ├─ Extracts access_token
    ├─ Verifies JWT signature
    ├─ If valid: proceed to route handler
    └─ If invalid/expired: throw 401 Unauthorized
    ↓
Frontend interceptor catches 401
    ↓
    Clear localStorage
    ↓
    Redirect to /login
```

---

## CURRENT SESSION MANAGEMENT

### Session Lifetime
- **Duration:** 1 hour (dev) / 1 day (prod)
- **Storage:** httpOnly cookie + localStorage metadata
- **Expiry Action:** Backend returns 401, frontend redirects to login

### Session Timeout Logic
```typescript
// On response with 401 status:
if (error.response?.status === 401) {
  // 1. Clear localStorage
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
  localStorage.removeItem('email');
  
  // 2. Show error message
  toast.error('Session expired. Please login again.');
  
  // 3. Redirect to login
  window.location.href = '/login';
}
```

### Manual Logout
```typescript
logout: () => {
  // 1. Clear Zustand state
  set({ userRole: null, userId: null, email: null });
  
  // 2. Clear localStorage
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
  localStorage.removeItem('email');
  
  // 3. Navigate to login (browser still has httpOnly cookie, 
  //    which will become ineffective after expiry)
  window.location.href = '/login';
}
```

⚠️ **Note:** No backend logout endpoint means cookie persists until natural expiry.

---

## DECORATORS & GUARDS SUMMARY

### Backend Guards
| Guard | File | Usage | Protection |
|-------|------|-------|-----------|
| `JwtAuthGuard` | `/common/guards/jwt-auth.guard.ts` | `@UseGuards(JwtAuthGuard)` | Validates JWT from cookie or bearer token |

### Decorators Used
| Decorator | Import | Purpose |
|-----------|--------|---------|
| `@UseGuards()` | `@nestjs/common` | Apply guard to controller/method |
| `@Controller()` | `@nestjs/common` | Define route controller |
| `@Post()` | `@nestjs/common` | HTTP POST method |
| `@Get()` | `@nestjs/common` | HTTP GET method |
| `@Body()` | `@nestjs/common` | Extract request body |
| `@Res()` | `@nestjs/common` | Inject response object |
| `@Param()` | `@nestjs/common` | Extract URL parameters |

---

## REFRESH TOKENS - NOT IMPLEMENTED ❌

**Current State:**
- ❌ No refresh token issued
- ❌ No refresh token endpoint
- ❌ No token rotation mechanism
- ❌ Users must re-login after expiry

**What Would Be Needed:**
```typescript
// Backend changes:
// 1. Issue both access_token (short-lived) and refresh_token (long-lived)
// 2. Store refresh_token in httpOnly cookie (different from access_token)
// 3. Create POST /auth/refresh endpoint
// 4. Verify refresh_token and issue new access_token

// Frontend changes:
// 1. Catch 401 on protected routes
// 2. Call POST /auth/refresh automatically
// 3. Retry original request with new access_token
// 4. Only redirect to login if refresh fails
```

---

## PASSWORD HASHING

**Backend:** `/backend/src/auth/auth.service.ts` & `/backend/src/users/users.service.ts`

```typescript
// Registration
const passwordHash = await bcrypt.hash(password, 10);

// Login
const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
```

**Implementation:**
- ✅ Bcrypt with salt rounds = 10
- ✅ One-way hashing (cannot decrypt)
- ✅ Used consistently in auth and user services

---

## SECURITY CHARACTERISTICS

| Feature | Status | Details |
|---------|--------|---------|
| **JWT** | ✅ Implemented | Signed with HS256 (symmetric key) |
| **httpOnly Cookie** | ✅ Implemented | Prevents XSS token theft |
| **Secure Flag** | ✅ In Production | HTTPS only |
| **SameSite** | ✅ Implemented | lax (CSRF protection) |
| **CORS** | ✅ Configured | With credentials support |
| **Password Hashing** | ✅ Implemented | Bcrypt with 10 salt rounds |
| **Role-Based Access** | ⚠️ Partial | Stored in token but no RBAC checks |
| **Refresh Tokens** | ❌ Not Implemented | Users re-login after expiry |
| **Logout Endpoint** | ❌ Not Implemented | Cookie persists until expiry |
| **Client-Side Route Protection** | ❌ Not Implemented | API-only protection via 401 |

---

## CODE STRUCTURE SUMMARY

```
Backend (/backend/src/)
├── auth/
│   ├── auth.module.ts           (DI configuration)
│   ├── auth.controller.ts        (POST /auth)
│   ├── auth.service.ts          (JWT generation, bcrypt compare)
│   └── dto/
│       └── create-auth.dto.ts   (Zod validation schema)
├── common/
│   ├── guards/
│   │   └── jwt-auth.guard.ts    (Token verification)
│   └── pipes/
│       └── zod-validation.pipe.ts (Request validation)
├── users/
│   ├── users.service.ts         (User CRUD + hashing)
│   └── users.controller.ts      (User endpoints)
├── env.ts                        (Environment config)
└── main.ts                       (App setup, CORS)

Frontend (/web/)
├── lib/
│   ├── auth-context.ts          (Zustand auth store)
│   ├── api-client.ts            (Axios with interceptors)
│   ├── validation.ts            (Zod schemas)
│   └── hooks/
│       └── useApi.ts            (React Query mutations/queries)
└── app/
    ├── login/page.tsx           (Login form)
    ├── register/page.tsx        (Registration form)
    └── dashboard/
        └── layout.tsx           (Protected layout - no guard)
```

---

## KEY INSIGHTS

1. **Token Storage:**
   - ✅ Token in httpOnly cookie (secure)
   - ⚠️ User metadata in localStorage (not sensitive)

2. **Token Transmission:**
   - ✅ Automatic via `withCredentials: true`
   - ✅ Falls back to Bearer token if needed

3. **Session Validation:**
   - ✅ Checked on every protected route request
   - ✅ JWT signature verified against JWT_SECRET
   - ❌ No session timeout before JWT expiry

4. **Failure Handling:**
   - ✅ 401 triggers interceptor → logout + redirect
   - ⚠️ No automatic retry with refresh token
   - ✅ User-friendly error toasts

5. **Architecture:**
   - ✅ Clean separation of concerns
   - ✅ Type-safe validation (Zod + TypeScript)
   - ✅ React Query for data fetching
   - ⚠️ Missing: Protected route middleware on frontend

