# Authentication Quick Reference

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                       FRONTEND (Next.js)                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Zustand Store                  Axios Client                 │
│  ─────────────                  ────────────                 │
│  • userRole                      • withCredentials: true      │
│  • userId                        • 401 interceptor           │
│  • email                         • Error handling            │
│  • localStorage sync             • Auto cookie sending       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP + Cookies
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND (NestJS)                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  POST /auth              Protected Routes                    │
│  ─────────────           ──────────────────                  │
│  • Password verify       • @UseGuards(JwtAuthGuard)          │
│  • JWT generate          • Cookie parsing                    │
│  • Set httpOnly cookie   • Bearer token fallback             │
│  • Return user data      • JWT verification                  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Token Lifecycle

### 1️⃣ Login Request
```
POST /api/auth
{
  "email": "user@example.com",
  "password": "password123"
}
```

### 2️⃣ Backend Processing
```typescript
1. Find user by email
2. Verify password with bcrypt.compare()
3. Generate JWT:
   {
     "user_id": "uuid",
     "email": "user@example.com", 
     "role": "FAMILY|NURSE|ADMIN",
     "iat": 1234567890,
     "exp": 1234567890 + (1h|1d)  // 1 hour dev / 1 day prod
   }
4. Set httpOnly cookie: access_token=JWT
5. Return user metadata
```

### 3️⃣ Frontend Storage
```
httpOnly Cookie (automatic):
├─ Name: access_token
├─ Value: JWT
├─ httpOnly: true (XSS protected)
├─ Secure: true (HTTPS only in prod)
└─ SameSite: lax (CSRF protected)

localStorage (manual):
├─ userRole: "FAMILY"
├─ userId: "uuid"
└─ email: "user@example.com"

Zustand state:
├─ userRole, userId, email
└─ Auth methods: setAuth(), logout(), isAuthenticated()
```

### 4️⃣ Protected Route Access
```
GET /api/patients
Authorization: (Cookie auto-sent)

Backend Guard:
├─ Extract access_token from cookie
├─ Verify JWT signature
├─ Attach decoded user to request.user
└─ Allow route execution

Frontend Error Handler (if 401):
├─ Clear localStorage
├─ Clear Zustand state
├─ Show error toast
└─ Redirect to /login
```

---

## 📊 Token Lifecycle Summary

```
                    ┌──────────────────┐
                    │   User Logs In   │
                    └────────┬─────────┘
                             │
                    ┌────────▼──────────┐
                    │ JWT Generated     │
                    │ 1h (dev) / 1d     │
                    │ (prod)            │
                    └────────┬──────────┘
                             │
                    ┌────────▼──────────┐
                    │ httpOnly Cookie   │
                    │ Set in Response   │
                    └────────┬──────────┘
                             │
                    ┌────────▼──────────┐
                    │ Each API Request  │
                    │ Cookie Sent Auto  │
                    └────────┬──────────┘
                             │
                    ┌────────▼──────────┐
                    │ JWT Verified      │
                    │ Valid → Proceed   │
                    │ Expired → 401     │
                    └────────┬──────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
        ┌───────▼───────┐       ┌────────▼─────┐
        │ Request OK    │       │ 401 Response │
        │ Data Returned │       │ Redirect to  │
        │               │       │ /login       │
        └───────────────┘       └──────────────┘
```

---

## 🎯 Current Implementation Status

### ✅ Implemented
- [x] JWT generation & signing
- [x] httpOnly cookie storage
- [x] Cookie-based auth in requests
- [x] Bearer token fallback
- [x] Password hashing (bcrypt)
- [x] Route protection (@UseGuards)
- [x] Error handling & interception
- [x] CORS with credentials
- [x] Role-based user metadata
- [x] Automatic logout on 401

### ❌ NOT Implemented
- [ ] Refresh tokens
- [ ] Token rotation
- [ ] Session extension
- [ ] Backend logout endpoint
- [ ] Client-side route guards
- [ ] Role-based access control (RBAC)
- [ ] Session timeout countdown
- [ ] Remember me functionality

---

## 📍 Key Files & Their Purpose

### Backend

| File | Purpose | Key Code |
|------|---------|----------|
| `auth/auth.service.ts` | JWT generation & password verify | `jwt.sign()`, `bcrypt.compare()` |
| `auth/auth.controller.ts` | Login endpoint | `res.cookie('access_token', ...)` |
| `common/guards/jwt-auth.guard.ts` | Route protection | `jwt.verify()`, `request.user = decoded` |
| `env.ts` | Config & secrets | `JWT_SECRET`, `IS_PRODUCTION` |
| `main.ts` | App setup & CORS | `enableCors({ credentials: true })` |

### Frontend

| File | Purpose | Key Code |
|------|---------|----------|
| `lib/auth-context.ts` | Auth state management | Zustand store, localStorage sync |
| `lib/api-client.ts` | HTTP client & interceptors | `withCredentials: true`, 401 handler |
| `app/login/page.tsx` | Login form & flow | Form validation, `useLogin()` hook |
| `lib/hooks/useApi.ts` | Mutation/Query hooks | `useLogin()`, `useRegisterUser()` |
| `app/dashboard/layout.tsx` | Protected layout | No guard (only API protected) |

---

## 🔄 Request Flow Sequences

### Successful Login
```
1. User fills login form
2. Frontend validates with Zod
3. POST /api/auth { email, password }
4. Backend verifies credentials
5. Backend sends Set-Cookie: access_token
6. Frontend catches response
7. Frontend stores metadata in localStorage + Zustand
8. Frontend redirects to /dashboard
```

### Successful Protected Request
```
1. User navigates to /api/patients
2. Browser auto-includes access_token cookie
3. JwtAuthGuard extracts & verifies token
4. If valid: request.user = decoded token
5. Route handler executes normally
6. Response sent to frontend
```

### Expired Token (401)
```
1. User tries /api/patients with expired token
2. Backend JwtAuthGuard: jwt.verify() throws
3. Backend returns 401 Unauthorized
4. Frontend axios interceptor catches 401
5. Interceptor: localStorage.removeItem(keys)
6. Interceptor: window.location.href = '/login'
7. User sees "Session expired" toast
```

---

## 💾 Data Storage Map

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND STORAGE                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  httpOnly Cookie                                             │
│  ├─ access_token: "eyJhbG..."  ◄── JWT Token               │
│  └─ Automatic with each request                             │
│                                                               │
│  localStorage                                                │
│  ├─ userRole: "FAMILY|NURSE|ADMIN"                           │
│  ├─ userId: "550e8400-e29b-41d4-a716-446655440000"         │
│  └─ email: "user@example.com"                                │
│                                                               │
│  Zustand (useAuthStore)                                      │
│  ├─ userRole, userId, email  ◄── Mirror of localStorage     │
│  ├─ setAuth(), logout()                                      │
│  └─ isAuthenticated()                                        │
│                                                               │
│  React Query Cache                                           │
│  ├─ users, patients, appointments, etc.                      │
│  └─ Invalidated on auth changes                              │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## ⏱️ Token Expiry Times

```
Development:
  │ Login ──────────────────────────────── Expiry │
  │         1 hour                                  │
  └─ User must re-login after 1 hour              │

Production:
  │ Login ──────────────────────────────────────── Expiry │
  │         1 day                                           │
  └─ User must re-login after 1 day                        │
```

---

## 🚫 Known Limitations

### No Refresh Token Flow
```
Current:
  access_token_lifetime_reached
        ↓
  401 Unauthorized
        ↓
  User must re-login

With Refresh Tokens (not implemented):
  access_token_lifetime_reached
        ↓
  Auto-call POST /auth/refresh
        ↓
  Get new access_token
        ↓
  Retry original request
        ↓
  User session continues
```

### No Client-Side Route Guards
```
Current:
  /dashboard
        ↓
  Renders (no auth check)
        ↓
  API call without token
        ↓
  401 response
        ↓
  Redirect to login

Ideal:
  /dashboard
        ↓
  Route guard checks auth
        ↓
  If not authenticated → redirect to /login
        ↓
  If authenticated → render
```

### No RBAC (Role-Based Access Control)
```
Current:
  Role stored in token: { role: "NURSE" }
        ↓
  Frontend can read (but can't be trusted)
  Backend doesn't check roles

Ideal:
  Backend should:
  ├─ Check user role
  ├─ Verify permission for route/action
  └─ Return 403 Forbidden if unauthorized
```

---

## 🔑 Environment Variables

```
JWT_SECRET=your-super-secret-key-min-32-chars
IS_PRODUCTION=false  # true in production
DATABASE_URL=postgresql://...
FRONTEND_URL=http://localhost:3001
```

---

## 📝 Code Examples

### Using Auth in Component
```typescript
import { useAuthStore } from '@/lib/auth-context';

export function MyComponent() {
  const { userRole, userId, isAuthenticated, logout } = useAuthStore();
  
  if (!isAuthenticated()) {
    return <div>Please login</div>;
  }
  
  return (
    <div>
      <p>Hello {userRole} (ID: {userId})</p>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}
```

### Making Protected API Call
```typescript
import { usePatients } from '@/lib/hooks/useApi';

export function PatientsList() {
  // This automatically sends auth cookie
  const { data, isLoading } = usePatients();
  
  if (isLoading) return <div>Loading...</div>;
  return <div>{data?.message}</div>;
}
```

### Protecting Route (Manual)
```typescript
'use client';
import { useAuthStore } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function ProtectedComponent() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, []);
  
  return <div>Protected content</div>;
}
```

---

## 🎓 Summary

| Aspect | Implementation | Status |
|--------|----------------|--------|
| **Token Type** | JWT (HS256) | ✅ |
| **Storage** | httpOnly Cookie | ✅ |
| **Transmission** | Auto via `withCredentials` | ✅ |
| **Validation** | Custom JwtAuthGuard | ✅ |
| **Hashing** | Bcrypt (rounds: 10) | ✅ |
| **Lifetimes** | 1h (dev) / 1d (prod) | ✅ |
| **Refresh** | Not implemented | ❌ |
| **RBAC** | Not implemented | ❌ |
| **Client Routes** | Not guarded | ❌ |
| **Logout** | Manual only | ⚠️ |

