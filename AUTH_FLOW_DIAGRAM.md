╔══════════════════════════════════════════════════════════════════════════════╗
║                  PARING AUTHENTICATION COMPLETE FLOW                         ║
╚══════════════════════════════════════════════════════════════════════════════╝

═══════════════════════════════════════════════════════════════════════════════
PHASE 1: LOGIN
═══════════════════════════════════════════════════════════════════════════════

┌─────────────────────┐
│  FRONTEND (Login)   │
└──────────┬──────────┘
           │
           │ User enters email + password
           ▼
┌─────────────────────────────────────────────────────────┐
│ React Form (react-hook-form)                            │
│ - Field validation                                      │
│ - Email format check                                    │
│ - Password length check                                 │
│ Resolver: Zod schema (loginSchema)                      │
└──────────┬──────────────────────────────────────────────┘
           │
           │ If valid, submit
           ▼
┌─────────────────────────────────────────────────────────┐
│ useLogin() Hook (React Query)                           │
│ useMutation({                                           │
│   mutationFn: POST /api/auth                            │
│   - Payload: { email, password }                        │
│   - withCredentials: true                               │
│ })                                                      │
└──────────┬──────────────────────────────────────────────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
┌────────┐     ┌──────────┐
│ Axios  │────▶│ Network  │
└────────┘     └────┬─────┘
                    │
         ┌──────────┴──────────┐
         │ (HTTP POST)         │
         │ /api/auth           │
         │ Body: JSON          │
         │ Cookies sent:       │
         │ (existing if any)   │
         └──────────┬──────────┘
                    ▼
         ╔══════════════════════════════════════════════════════╗
         ║            BACKEND (NestJS)                          ║
         ╚══════════════════════════════════════════════════════╝
                    │
         ┌──────────┴──────────┐
         │ AuthController      │
         │ POST /api/auth      │
         └──────────┬──────────┘
                    │
                    ▼
         ┌──────────────────────────────────┐
         │ AuthService.create()             │
         │                                  │
         │ 1. Find user by email            │
         │    SELECT * FROM users           │
         │    WHERE email = ?               │
         │                                  │
         │ 2. If not found:                 │
         │    throw NotFoundException       │
         │    Response: 404                 │
         └──────────┬──────────────────────┘
                    │
             ┌──────┴──────┐
             │             │
        ✅ Found      ❌ Not Found
             │             │
             ▼             ▼
     ┌──────────────┐  ┌──────────────┐
     │ Compare      │  │ Return 404   │
     │ password     │  │ Error        │
     │ vs hash      │  └──────────────┘
     └──────┬───────┘
            │
       ┌────┴────┐
       │          │
   ✅ Match  ❌ No match
       │          │
       ▼          ▼
    ┌───────────────────────────┐
    │ 1. Generate JWT Token:    │
    │    jwt.sign({             │
    │      user_id: uuid,       │
    │      email: string,       │
    │      role: enum,          │
    │    }, JWT_SECRET, {       │
    │      expiresIn: '24h'     │
    │    })                     │
    │                           │
    │ 2. Set HttpOnly Cookie:   │
    │    res.cookie(             │
    │      'access_token',      │
    │      token,               │
    │      {                    │
    │        httpOnly: true,    │
    │        secure: true,      │
    │        sameSite: 'lax'    │
    │      }                    │
    │    )                      │
    │                           │
    │ 3. Return Response:       │
    │    {                      │
    │      message: "Auth...",  │
    │      data: {              │
    │        userId: uuid,      │
    │        email: string,     │
    │        role: enum         │
    │      }                    │
    │    }                      │
    └────────┬──────────────────┘
             │
             ▼ (HTTP 200 + Set-Cookie header)
   ┌─────────────────────────────────────────┐
   │ Return to FRONTEND                      │
   │ Response: 200 OK                        │
   │ Headers:                                │
   │   Set-Cookie: access_token=<JWT>;...   │
   │ Body: { userId, email, role }           │
   └────────┬────────────────────────────────┘
            │
            ▼
   ┌─────────────────────────────────────────┐
   │ FRONTEND - Response Handler             │
   │ onSuccess() callback:                   │
   │                                         │
   │ 1. Extract from response:               │
   │    - userRole = response.data.role      │
   │    - userId = response.data.userId      │
   │    - email = response.data.email        │
   │                                         │
   │ 2. Validate userId                      │
   │    if (!userId || userId === 'unknown') │
   │      show error toast                   │
   │                                         │
   │ 3. Store in Zustand:                    │
   │    setAuth(role, userId, email)         │
   │      ├─ state.userRole = role           │
   │      ├─ state.userId = userId           │
   │      ├─ state.email = email             │
   │      └─ localStorage.setItem(...)       │
   │                                         │
   │ 4. Show success toast                   │
   │    toast.success("Login berhasil!")     │
   │                                         │
   │ 5. Redirect by role:                    │
   │    if (userRole === 'NURSE')            │
   │      router.push('/nurse/dashboard')    │
   │    else                                 │
   │      router.push('/dashboard')          │
   └─────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════
PHASE 2: TOKEN STORAGE & STATE MANAGEMENT
═══════════════════════════════════════════════════════════════════════════════

TOKEN LOCATIONS:

┌──────────────────────────────────────────────────────────────┐
│ Browser Storage                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ 1. HTTP-ONLY COOKIE (Automatic)            ✅ SECURE       │
│    ┌────────────────────────────────────┐                   │
│    │ Name: access_token                 │                   │
│    │ Value: eyJhbGc...                  │                   │
│    │ HttpOnly: true   → JS can't read   │                   │
│    │ Secure: true     → HTTPS only      │                   │
│    │ SameSite: Lax    → CSRF protected  │                   │
│    │ Path: /          → All routes      │                   │
│    │ Domain: auto     → Set by server   │                   │
│    │ Expires: 24h     → 1 day (prod)    │                   │
│    └────────────────────────────────────┘                   │
│    Sent with: Every HTTP request                            │
│    (withCredentials: true in axios)                         │
│                                                              │
│ 2. LOCAL STORAGE (XSS Vulnerable)        ⚠️  EXPOSED      │
│    ┌────────────────────────────────────┐                   │
│    │ localStorage.setItem(key, value)   │                   │
│    ├────────────────────────────────────┤                   │
│    │ userRole:  "FAMILY"                │                   │
│    │ userId:    "550e8400-e29b-..."     │                   │
│    │ email:     "user@example.com"      │                   │
│    └────────────────────────────────────┘                   │
│    Accessible: JavaScript (window.localStorage)             │
│    Vulnerability: Accessible to XSS scripts                 │
│    Persistence: Until explicitly cleared                    │
│                                                              │
│ 3. ZUSTAND STATE (Memory)                 ✅ EPHEMERAL    │
│    ┌────────────────────────────────────┐                   │
│    │ useAuthStore() {                   │                   │
│    │   userRole: null,                  │                   │
│    │   userId: null,                    │                   │
│    │   email: null,                     │                   │
│    │   functions: {                     │                   │
│    │     setAuth(),                     │                   │
│    │     logout(),                      │                   │
│    │     isAuthenticated()              │                   │
│    │   }                                │                   │
│    │ }                                  │                   │
│    └────────────────────────────────────┘                   │
│    Scope: Global React context                              │
│    Persistence: Page reload → clears                        │
│    On page reload → rehydrates from localStorage            │
│                                                              │
└──────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════
PHASE 3: API CALLS WITH AUTHENTICATION
═══════════════════════════════════════════════════════════════════════════════

EXAMPLE: Create Patient

User Action:
  Click "Add Patient" → Fill form → Submit
                            ▼

Frontend Component:
  ┌────────────────────────────────────────────────┐
  │ useCreatePatient() Hook (React Query)          │
  │ useMutation({                                  │
  │   mutationFn: apiClient.post('/patients', {   │
  │     familyId: userId,                          │
  │     name: 'Ibu Kartini',                        │
  │     dateOfBirth: '1960-05-15',                  │
  │     ...                                        │
  │   })                                           │
  │ })                                             │
  └────────────┬─────────────────────────────────┘
               │
               ▼
Axios Instance (api-client.ts):
  ┌────────────────────────────────────────────────┐
  │ apiClient.post('/patients', data)              │
  │ Configuration:                                 │
  │ - baseURL: NEXT_PUBLIC_API_URL                 │
  │ - withCredentials: true                        │
  │ - headers: Content-Type: application/json      │
  │                                                │
  │ Before sending:                                │
  │ - Browser automatically includes:              │
  │   Cookie: access_token=<JWT>                   │
  └────────────┬─────────────────────────────────┘
               │
    ┌──────────┴──────────┐
    │ (HTTP POST Request) │
    │ POST /api/patients  │
    │ Headers:            │
    │ - Cookie: ...       │
    │ - Content-Type: ... │
    │ Body: { ... }       │
    └──────────┬──────────┘
               │
               ▼ (BACKEND)

Backend Receives Request:
  ┌────────────────────────────────────────────────┐
  │ PatientsController.create()                    │
  │ @UseGuards(JwtAuthGuard)  ← Runs first        │
  │                                                │
  │ JwtAuthGuard:                                  │
  │ 1. Extract token from cookie:                  │
  │    const cookies = parseCookies(request.headers)
  │    token = cookies.access_token                │
  │                                                │
  │ 2. Verify token signature:                     │
  │    jwt.verify(token, env.JWT_SECRET)           │
  │                                                │
  │ 3. If valid, decode & attach to request:      │
  │    request.user = {                            │
  │      user_id: '550e8400-...',                  │
  │      email: 'user@example.com',                │
  │      role: 'FAMILY'                            │
  │    }                                           │
  │                                                │
  │ 4. Return true (allow access)                  │
  │    OR throw UnauthorizedException              │
  └────────────┬─────────────────────────────────┘
               │
        ┌──────┴──────┐
        │             │
    ✅ Valid      ❌ Invalid
        │             │
        ▼             ▼
  Continue        Return 401:
  Request         Unauthorized
        │             │
        ▼             ▼
  ┌──────────────────────────┐  ┌─────────────────┐
  │ PatientsService.create() │  │ Frontend catches│
  │                          │  │ 401 error       │
  │ 1. Check role:           │  │                 │
  │    if (user.role !=      │  │ Response        │
  │        'FAMILY')         │  │ Interceptor:    │
  │      throw Error         │  │                 │
  │                          │  │ 1. Clear storage│
  │ 2. Create patient record │  │ 2. Redirect to  │
  │    in database           │  │    /login       │
  │                          │  │ 3. Show toast   │
  │ 3. Return patient data   │  │    "Session     │
  └──────────┬───────────────┘  │     expired"    │
             │                  └─────────────────┘
             ▼
  Response 201 Created:
  ┌────────────────────────┐
  │ {                      │
  │   message: "Patient    │
  │            created...",│
  │   data: {              │
  │     id: uuid,          │
  │     name: "Ibu...",    │
  │     ...                │
  │   }                    │
  │ }                      │
  └────────────┬───────────┘
               │
               ▼
Frontend Success Handler:
  ┌────────────────────────────────────────┐
  │ onSuccess() callback:                  │
  │                                        │
  │ 1. Show success toast                  │
  │    toast.success('Pasien berhasil...')│
  │                                        │
  │ 2. Invalidate related queries:         │
  │    queryClient.invalidateQueries({     │
  │      queryKey: ['patients']            │
  │    })                                  │
  │                                        │
  │ 3. Redirect:                           │
  │    router.push('/dashboard/patients')  │
  └────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════
PHASE 4: TOKEN EXPIRATION & REFRESH (⚠️ NOT IMPLEMENTED)
═══════════════════════════════════════════════════════════════════════════════

CURRENT BEHAVIOR (24h/1h expiration):

After token expires:
  ▼ (After 24 hours in production)
  
Next API Call:
  Token still included in cookie
  ▼
Backend Receives:
  JwtAuthGuard validates token
  ▼
jwt.verify() fails:
  - Error: "jwt expired"
  ▼
Throws UnauthorizedException:
  Response: 401
  ▼
Frontend Response Interceptor:
  if (error.status === 401) {
    localStorage.removeItem('userRole')
    localStorage.removeItem('userId')
    localStorage.removeItem('email')
    toast.error('Session expired. Please login again.')
    window.location.href = '/login'
  }
  ▼
User redirected to login page
User must re-enter credentials

RECOMMENDED IMPLEMENTATION (Sliding Window):

Access Token: 30 minutes
Refresh Token: 7 days

When Access Token Expires:
  ▼
POST /api/auth/refresh
  Body: { refreshToken: "..." }
  ▼
Backend:
  1. Verify refresh token
  2. Check if in blacklist
  3. If valid:
     - Generate new access token
     - Optionally rotate refresh token
     - Return new tokens
     ▼
  4. If invalid:
     - Return 401
     - Frontend redirects to /login

Frontend:
  ▼
Response Interceptor:
  if (401) {
    if (hasRefreshToken) {
      POST /auth/refresh
      ▼
      if (success) {
        Store new token
        Retry original request
      }
      else {
        Redirect to /login
      }
    }
    else {
      Redirect to /login
    }
  }

═══════════════════════════════════════════════════════════════════════════════
PHASE 5: LOGOUT
═══════════════════════════════════════════════════════════════════════════════

CURRENT IMPLEMENTATION (Frontend Only):

User clicks logout button:
  ▼
useAuthStore.logout() called:
  {
    1. Clear Zustand state:
       set({
         userRole: null,
         userId: null,
         email: null
       })
    
    2. Clear localStorage:
       localStorage.removeItem('userRole')
       localStorage.removeItem('userId')
       localStorage.removeItem('email')
    
    3. Full page redirect:
       window.location.href = '/login'
  }
  ▼
User sent to /login

ISSUES:
  ❌ No backend logout endpoint
  ❌ Cookie NOT explicitly cleared
  ❌ Token remains valid in browser
  ❌ If user intercepts request, token still works

RECOMMENDED IMPLEMENTATION:

POST /api/auth/logout
  ▼
Frontend:
  1. Call logout endpoint
  2. Backend invalidates token
  3. Returns response
  4. Frontend clears state
  5. Redirect to /login

Backend:
  POST /api/auth/logout:
    1. Get token from request
    2. Add to blacklist (Redis)
    3. Clear cookie:
       res.cookie('access_token', '', {
         maxAge: 0,  // Expire immediately
         httpOnly: true,
         secure: true
       })
    4. Return success response

═══════════════════════════════════════════════════════════════════════════════

🎯 KEY POINTS:

✅ SECURE:
  • Password hashed with bcrypt
  • JWT signed with secret
  • Token in HttpOnly cookie (XSS protected)
  • Secure flag for HTTPS only
  • SameSite=Lax for CSRF protection

⚠️ VULNERABLE:
  • User data in localStorage (XSS risk)
  • No token refresh mechanism
  • No rate limiting on login
  • No backend logout

🔧 TO FIX (Priority Order):
  1. Implement refresh tokens
  2. Add rate limiting
  3. Remove user data from localStorage
  4. Add logout endpoint
  5. Add role-based guards

