# Authentication Request/Response Examples

## 1. Login Request & Response

### Frontend Request
```http
POST /api/auth HTTP/1.1
Host: api.paring.com
Content-Type: application/json
Cookie: (empty on first login)

{
  "email": "budi@example.com",
  "password": "password123"
}
```

### Backend Response (Success - 200)
```http
HTTP/1.1 200 OK
Content-Type: application/json
Set-Cookie: access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTUwZTg0MDAtZTI5Yi00MWQ0LWE3MTYtNDQ2NjU1NDQwMDAwIiwiZW1haWwiOiJidWRpQGV4YW1wbGUuY29tIiwicm9sZSI6IkZBTUlMWSIsImlhdCI6MTcxNDU4MDAwMCwiZXhwIjoxNzE0NTgzNjAwfQ.xxx; HttpOnly; Secure; SameSite=Lax; Path=/

{
  "message": "Authentication successful",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "budi@example.com",
    "role": "FAMILY"
  }
}
```

### JWT Payload (Decoded)
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "budi@example.com",
  "role": "FAMILY",
  "iat": 1714580000,
  "exp": 1714583600
}
```

**Token Lifetime in Example:**
- `iat` (issued at): 1714580000
- `exp` (expires): 1714583600
- Duration: 3600 seconds = 1 hour (development)

### Backend Response (Invalid Credentials - 400)
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "statusCode": 400,
  "message": "Invalid password"
}
```

### Backend Response (User Not Found - 404)
```http
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "statusCode": 404,
  "message": "User not found"
}
```

---

## 2. Registration Request & Response

### Frontend Request (Family/Patient)
```http
POST /api/users HTTP/1.1
Host: api.paring.com
Content-Type: application/json

{
  "fullName": "Budi Santoso",
  "email": "budi@example.com",
  "phoneNumber": "08123456789",
  "passwordHash": "password123",
  "role": "FAMILY"
}
```

### Frontend Request (Nurse)
```http
POST /api/users HTTP/1.1
Host: api.paring.com
Content-Type: application/json

{
  "fullName": "Siti Nurhaliza",
  "email": "siti@example.com",
  "phoneNumber": "08123456789",
  "passwordHash": "password123",
  "role": "NURSE"
}
```

### Backend Response (Success - 201)
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "message": "User created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "fullName": "Budi Santoso",
    "email": "budi@example.com",
    "phoneNumber": "08123456789",
    "role": "FAMILY",
    "createdAt": "2024-05-01T12:00:00Z",
    "updatedAt": "2024-05-01T12:00:00Z"
  }
}
```

### Backend Response (Duplicate Email - 409)
```http
HTTP/1.1 409 Conflict
Content-Type: application/json

{
  "statusCode": 409,
  "message": "Email budi@example.com sudah terdaftar"
}
```

---

## 3. Protected Route Request & Response

### Frontend Request (With Cookie)
```http
GET /api/patients HTTP/1.1
Host: api.paring.com
Cookie: access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...xxx
```

### Frontend Request (With Bearer Token Alternative)
```http
GET /api/patients HTTP/1.1
Host: api.paring.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...xxx
```

### Backend Processing
```typescript
// JwtAuthGuard.canActivate()
1. Extract token from:
   a) Authorization: Bearer <token>
   b) Cookie: access_token=<token>
   
2. Verify signature: jwt.verify(token, JWT_SECRET)

3. Decode payload:
   {
     "user_id": "550e8400-e29b-41d4-a716-446655440000",
     "email": "budi@example.com",
     "role": "FAMILY"
   }
   
4. Attach to request: request.user = decoded
```

### Backend Response (Valid Token - 200)
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "Patients fetched successfully",
  "data": [
    {
      "id": "patient-id-1",
      "name": "Kakek Budi",
      "dateOfBirth": "1945-05-01",
      "weight": 70,
      "height": 170,
      "medicalHistory": "Diabetes",
      "createdAt": "2024-05-01T12:00:00Z"
    }
  ]
}
```

### Backend Response (Missing Token - 401)
```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "statusCode": 401,
  "message": "Missing authorization token"
}
```

### Backend Response (Expired Token - 401)
```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "statusCode": 401,
  "message": "Invalid or expired token"
}
```

### Backend Response (Invalid Token - 401)
```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "statusCode": 401,
  "message": "Invalid or expired token"
}
```

---

## 4. Frontend Interceptor Handling

### Successful Request Flow
```javascript
// axios instance with withCredentials: true
apiClient.post('/auth', { email, password })
  .then(response => {
    // response.data = {
    //   message: "Authentication successful",
    //   data: { userId, email, role }
    // }
    console.log('Login successful:', response.data);
  })
  .catch(error => {
    // Interceptor handles 401, 400, 409, 500
  });
```

### 401 Error Handling
```javascript
// When backend returns 401:
if (error.response?.status === 401) {
  // 1. Clear storage
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
  localStorage.removeItem('email');
  
  // 2. Show notification
  toast.error('Session expired. Please login again.');
  
  // 3. Redirect
  window.location.href = '/login';
}
```

### 409 Error Handling
```javascript
// When backend returns 409 (duplicate email):
if (error.response?.status === 409) {
  const message = error.response?.data?.message 
    || 'This email already exists';
  toast.error(message);
  // User stays on registration page
}
```

### 400 Error Handling
```javascript
// When backend returns 400 (validation error):
if (error.response?.status === 400) {
  const message = error.response?.data?.message 
    || 'Please check your input';
  toast.error(message);
  // User can correct and retry
}
```

---

## 5. Complete Login Flow Example

### Step 1: Frontend Form Submission
```javascript
const onSubmit = (data: LoginFormData) => {
  login(data, {
    onSuccess: (response: any) => {
      const userRole = response.data?.role || 'FAMILY';
      const userId = response.data?.userId;
      const email = response.data?.email;
      
      setAuth(userRole, userId, email);
      router.push('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  });
};
```

### Step 2: HTTP Request
```
POST /api/auth
{
  "email": "budi@example.com",
  "password": "password123"
}
```

### Step 3: Backend Processing
```typescript
// AuthController.create()
const { token, user } = await this.authService.create(createAuthDto);

// AuthService.create()
const user = await db.user.findUnique({ where: { email } });
const isMatch = await bcrypt.compare(password, user.passwordHash);
const token = jwt.sign(
  { user_id: user.id, email, role },
  JWT_SECRET,
  { expiresIn: '1h' }
);

// Set cookie
res.cookie('access_token', token, {
  httpOnly: true,
  secure: IS_PRODUCTION,
  sameSite: 'lax',
  path: '/'
});
```

### Step 4: HTTP Response
```
200 OK
Set-Cookie: access_token=eyJ...;HttpOnly;Secure;SameSite=Lax;Path=/

{
  "message": "Authentication successful",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "budi@example.com",
    "role": "FAMILY"
  }
}
```

### Step 5: Frontend Processing
```javascript
// Login mutation success callback
const userRole = 'FAMILY';
const userId = '550e8400-e29b-41d4-a716-446655440000';
const email = 'budi@example.com';

// Store in Zustand + localStorage
useAuthStore.setState({
  userRole: 'FAMILY',
  userId: '550e8400-e29b-41d4-a716-446655440000',
  email: 'budi@example.com'
});

localStorage.setItem('userRole', 'FAMILY');
localStorage.setItem('userId', '550e8400-e29b-41d4-a716-446655440000');
localStorage.setItem('email', 'budi@example.com');

// Browser automatically stores httpOnly cookie

// Redirect to dashboard
router.push('/dashboard');
```

### Step 6: Subsequent Requests
```
Browser memory after login:
├─ httpOnly Cookie: access_token = JWT_TOKEN
├─ localStorage: userRole = 'FAMILY'
├─ localStorage: userId = '550e8400...'
└─ localStorage: email = 'budi@example.com'

GET /api/patients (browser automatically sends cookie)
Cookie: access_token=JWT_TOKEN

Backend receives and validates JWT
✓ Token valid → return patients
✗ Token expired → return 401
```

---

## 6. Token Payload Examples

### FAMILY Role Token
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "budi@example.com",
  "role": "FAMILY",
  "iat": 1714580000,
  "exp": 1714583600
}
```

### NURSE Role Token
```json
{
  "user_id": "660e8400-e29b-41d4-a716-446655440001",
  "email": "siti@example.com",
  "role": "NURSE",
  "iat": 1714580000,
  "exp": 1714583600
}
```

### ADMIN Role Token
```json
{
  "user_id": "770e8400-e29b-41d4-a716-446655440002",
  "email": "admin@example.com",
  "role": "ADMIN",
  "iat": 1714580000,
  "exp": 1714583600
}
```

---

## 7. Cookie Details

### Cookie Set in Response
```http
Set-Cookie: access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTUwZTg0MDAtZTI5Yi00MWQ0LWE3MTYtNDQ2NjU1NDQwMDAwIiwiZW1haWwiOiJidWRpQGV4YW1wbGUuY29tIiwicm9sZSI6IkZBTUlMWSIsImlhdCI6MTcxNDU4MDAwMCwiZXhwIjoxNzE0NTgzNjAwfQ.abc123; HttpOnly; Secure; SameSite=Lax; Path=/
```

### Cookie Attributes Explained
| Attribute | Value | Purpose |
|-----------|-------|---------|
| `Name` | `access_token` | Cookie identifier |
| `Value` | `eyJ...` | JWT token (base64 encoded) |
| `HttpOnly` | `true` | Cannot be accessed by JavaScript (prevents XSS) |
| `Secure` | `true` (prod) | Only sent over HTTPS |
| `SameSite` | `Lax` | Prevents CSRF attacks |
| `Path` | `/` | Cookie available to entire app |
| `Max-Age/Expires` | (implicit in JWT) | Token expires after 1h (dev) / 1d (prod) |

### Browser Cookie Behavior
```
After login:
├─ Cookie stored in browser memory
├─ Automatically sent with every same-origin request
├─ Cannot be accessed/modified by JavaScript (httpOnly)
└─ Expires after 1 hour / 1 day

Example subsequent request:
POST /api/patients
[Browser automatically includes]: Cookie: access_token=eyJ...

After token expires:
└─ JWT.verify() fails
└─ Backend returns 401
└─ Frontend clears localStorage and redirects to /login
```

---

## 8. Validation Errors

### Invalid Email Format
```http
POST /api/auth HTTP/1.1
Content-Type: application/json

{
  "email": "not-an-email",
  "password": "password123"
}
```

**Response (400):**
```json
{
  "statusCode": 400,
  "message": "Validasi gagal",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### Password Too Short
```http
POST /api/auth HTTP/1.1
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "123"
}
```

**Response (400):**
```json
{
  "statusCode": 400,
  "message": "Validasi gagal",
  "errors": [
    {
      "field": "password",
      "message": "Password must be at least 6 characters long"
    }
  ]
}
```

### Multiple Validation Errors
```http
POST /api/auth HTTP/1.1
Content-Type: application/json

{
  "email": "invalid",
  "password": "123"
}
```

**Response (400):**
```json
{
  "statusCode": 400,
  "message": "Validasi gagal",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters long"
    }
  ]
}
```

---

## 9. CORS Request Headers

### Preflight Request (OPTIONS)
```http
OPTIONS /api/auth HTTP/1.1
Host: api.paring.com
Origin: http://localhost:3001
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type
```

### Preflight Response
```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:3001
Access-Control-Allow-Methods: GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
```

### Actual Request (with Credentials)
```http
POST /api/auth HTTP/1.1
Host: api.paring.com
Origin: http://localhost:3001
Cookie: (any existing cookies)
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Actual Response (with Credentials)
```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:3001
Access-Control-Allow-Credentials: true
Content-Type: application/json
Set-Cookie: access_token=...;HttpOnly;Secure;SameSite=Lax

{
  "message": "Authentication successful",
  "data": { ... }
}
```

---

## 10. Error Response Reference

| Status | Endpoint | Meaning | Handling |
|--------|----------|---------|----------|
| 200 | POST /auth | Login successful | Store token, redirect |
| 201 | POST /users | User created | Auto-login or redirect to login |
| 400 | Any | Validation failed | Show validation errors |
| 401 | Protected routes | Token invalid/expired | Clear auth, redirect to login |
| 404 | POST /auth | User not found | Show error message |
| 409 | POST /users | Email already exists | Show error, stay on form |
| 500 | Any | Server error | Show generic error message |

