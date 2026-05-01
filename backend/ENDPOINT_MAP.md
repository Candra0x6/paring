# Paring Backend - Complete Endpoint Map

## 📍 Full API Endpoint Reference

### Legend
- 🔓 = Public (no authentication)
- 🔒 = Protected (JWT required)
- ⚡ = Rate limited (global 100 req/60s)

---

## 1️⃣ Authentication & User Management

### Auth Module
```
🔓 ⚡ POST   /api/auth
             Login (email + password)
             │
             ├─ Request:  { email, password }
             ├─ Response: { message, data: { userId, email, role } }
             ├─ Cookie:   Sets access_token (httpOnly)
             └─ Errors:   404 User not found | 400 Invalid password
```

### Users Module
```
🔓 ⚡ POST   /api/users
             Create new user (Registration)
             │
             ├─ Request:  { email, passwordHash, fullName, phoneNumber, role? }
             ├─ Response: { message, data: { id, email, fullName, ... } }
             └─ Errors:   409 Email already registered | 400 Invalid input

🔓 ⚡ GET    /api/users
             List all users (with filters)
             │
             ├─ Query:    ?role=FAMILY&name=John
             ├─ Response: { message, data: [{ ... }, ...] }
             └─ Filters:  role (ADMIN|FAMILY|NURSE), name (search)

🔓 ⚡ GET    /api/users/:id
             Get user by ID
             │
             ├─ Response: { message, data: { ... } }
             └─ Errors:   404 User not found

🔓 ⚡ PATCH  /api/users/:id
             Update user
             │
             ├─ Request:  { fullName?, phoneNumber?, ... }
             ├─ Response: { message, data: { ... } }
             └─ Errors:   404 User not found

🔓 ⚡ DELETE /api/users/:id
             Delete user
             │
             ├─ Response: { message, data: { ... } }
             └─ Errors:   404 User not found
```

---

## 2️⃣ Patient Management

### Patients Module (Protected)
```
🔒 ⚡ POST   /api/patients
             Create new patient (elderly profile)
             │
             ├─ Auth:     JWT token (Bearer or cookie)
             ├─ Request:  { familyId, name, dateOfBirth, weight?, height?, medicalHistory? }
             ├─ Response: { message, data: { id, familyId, name, ... } }
             └─ Errors:   401 Unauthorized | 400 Invalid input | 404 Family not found

🔒 ⚡ GET    /api/patients
             Get all patients with filters
             │
             ├─ Auth:     JWT token
             ├─ Query:    ?familyId=uuid&page=1&limit=10
             ├─ Response: { message, data: [{ ... }, ...], page, limit, total }
             └─ Filters:  familyId, name (search)

🔒 ⚡ GET    /api/patients/:id
             Get patient by ID
             │
             ├─ Auth:     JWT token
             ├─ Response: { message, data: { ... } }
             └─ Errors:   401 Unauthorized | 404 Patient not found

🔒 ⚡ PATCH  /api/patients/:id
             Update patient
             │
             ├─ Auth:     JWT token
             ├─ Request:  { name?, dateOfBirth?, weight?, height?, medicalHistory? }
             ├─ Response: { message, data: { ... } }
             └─ Errors:   401 Unauthorized | 404 Patient not found

🔒 ⚡ DELETE /api/patients/:id
             Delete patient
             │
             ├─ Auth:     JWT token
             ├─ Response: { message, data: { ... } }
             └─ Errors:   401 Unauthorized | 404 Patient not found
```

---

## 3️⃣ Nurse Management

### Nurses Module
```
🔓 ⚡ POST   /api/nurses
             Create nurse profile
             │
             ├─ Request:  { userId, specialization, experienceYears, rating?, isVerified? }
             ├─ Response: { message, data: { id, userId, specialization, ... } }
             └─ Errors:   400 Invalid input | 404 User not found | 409 Nurse profile exists

🔓 ⚡ GET    /api/nurses
             List all nurses (with filters)
             │
             ├─ Query:    ?specialization=Wound+Care&experienceYears=5&name=Jane
             ├─ Response: { message, data: [{ ... }, ...] }
             └─ Filters:  name, specialization, experienceYears

🔓 ⚡ GET    /api/nurses/:id
             Get nurse by ID
             │
             ├─ Response: { message, data: { id, userId, specialization, rating, ... } }
             └─ Errors:   404 Nurse not found

🔓 ⚡ PATCH  /api/nurses/:id
             Update nurse profile
             │
             ├─ Request:  { specialization?, experienceYears?, rating?, isVerified? }
             ├─ Response: { message, data: { ... } }
             └─ Errors:   404 Nurse not found

🔓 ⚡ DELETE /api/nurses/:id
             Delete nurse profile
             │
             ├─ Response: { message, data: { ... } }
             └─ Errors:   404 Nurse not found
```

---

## 4️⃣ Appointment Management

### Appointments Module
```
🔓 ⚡ POST   /api/appointments
             Create appointment (booking)
             │
             ├─ Request:  {
             │              patientId,
             │              nurseId,
             │              serviceType (VISIT|LIVE_IN|LIVE_OUT),
             │              serviceName (MEDIS|NON_MEDIS),
             │              dueDate,
             │              totalPrice
             │            }
             ├─ Response: { message, data: { id, patientId, nurseId, status: PENDING, ... } }
             ├─ Auto:     Creates Payment record (status: PENDING)
             └─ Errors:   400 dueDate in past | 404 Patient/Nurse not found
             │            409 Nurse conflict | 400 Invalid input

🔓 ⚡ GET    /api/appointments
             List all appointments
             │
             ├─ Query:    ?status=PENDING&dueDate=2024-12-25
             ├─ Response: { message, data: [{ ... }, ...] }
             └─ Filters:  status (PENDING|CONFIRMED|ONGOING|COMPLETED|CANCELLED)
                          dueDate (YYYY-MM-DD format)

🔓 ⚡ GET    /api/appointments/:id
             Get appointment by ID
             │
             ├─ Response: { message, data: { ... } }
             └─ Errors:   404 Appointment not found

🔓 ⚡ PATCH  /api/appointments/:id
             Update appointment (change status, reschedule)
             │
             ├─ Request:  { status?, dueDate?, totalPrice?, ... }
             ├─ Response: { message, data: { ... } }
             └─ Errors:   404 Appointment not found

🔓 ⚡ DELETE /api/appointments/:id
             Delete/cancel appointment
             │
             ├─ Response: { message, data: { ... } }
             └─ Errors:   404 Appointment not found
```

---

## 5️⃣ Care Documentation

### CareLog Module
```
🔓 ⚡ POST   /api/carelog
             Create care log entry (vital signs + observations)
             │
             ├─ Request:  {
             │              appointmentId,
             │              patientId,
             │              nurseId,
             │              systolic?,         (blood pressure upper)
             │              diastolic?,        (blood pressure lower)
             │              bloodSugar?,       (mg/dL)
             │              cholesterol?,      (mg/dL)
             │              uricAcid?,         (mg/dL)
             │              woundCondition?,
             │              moodScore?,        (1-5 scale)
             │              clinicalNotes?
             │            }
             ├─ Response: { message, data: { id, appointmentId, recordedAt, ... } }
             └─ Errors:   400 Invalid input | 404 Appointment/Patient/Nurse not found

🔓 ⚡ GET    /api/carelog
             List care logs (paginated)
             │
             ├─ Query:    ?page=1&limit=10&patientId=uuid
             ├─ Response: {
             │              message,
             │              data: [{ ... }, ...],
             │              page: 1,
             │              limit: 10,
             │              total: 100
             │            }
             └─ Pagination: page (default: 1), limit (default: 10)

🔓 ⚡ GET    /api/carelog/:id
             Get care log by ID
             │
             ├─ Response: { message, data: { ... } }
             └─ Errors:   404 CareLog not found

🔓 ⚡ PATCH  /api/carelog/:id
             Update care log
             │
             ├─ Request:  { systolic?, diastolic?, bloodSugar?, ... }
             ├─ Response: { message, data: { ... } }
             └─ Errors:   404 CareLog not found

🔓 ⚡ DELETE /api/carelog/:id
             Delete care log
             │
             ├─ Response: { message, data: { ... } }
             └─ Errors:   404 CareLog not found
```

### ActivityLog Module (sub-entries to CareLog)
```
🔓 ⚡ POST   /api/activitylog
             Create activity log entry
             │
             ├─ Request:  { careLogId, notes }
             ├─ Response: { message, data: { id, careLogId, notes, createdAt, ... } }
             └─ Errors:   400 Invalid input | 404 CareLog not found

🔓 ⚡ PATCH  /api/activitylog/:id
             Update activity log
             │
             ├─ Request:  { notes? }
             ├─ Response: { message, data: { ... } }
             └─ Errors:   404 ActivityLog not found

🔓 ⚡ DELETE /api/activitylog/:id
             Delete activity log
             │
             ├─ Response: { message, data: { ... } }
             └─ Errors:   404 ActivityLog not found
```

---

## 6️⃣ Payment Processing

### Payment Module (Midtrans Integration)
```
🔓 ⚡ POST   /api/payment/:appointmentId
             Create Midtrans transaction
             │
             ├─ Params:   appointmentId (UUID)
             ├─ Request:  (No body required)
             ├─ Response: { token: "snap_token_here" }
             │
             ├─ Business Logic:
             │   ├─ Fetch appointment by ID
             │   ├─ Validate dueDate >= NOW + 120 minutes (buffer)
             │   ├─ Create Payment record with Midtrans
             │   ├─ Return Snap token to frontend
             │   └─ Frontend uses token to redirect to Midtrans Snap
             │
             ├─ Creates Payment record with:
             │   ├─ appointmentId (FK)
             │   ├─ midtransOrderId (unique)
             │   ├─ amount (from appointment.totalPrice)
             │   ├─ snapToken
             │   ├─ snapRedirectUrl
             │   ├─ status: PENDING
             │   └─ paymentMethod: null (updated after webhook)
             │
             └─ Errors:   400 Appointment not found
                          400 Booking window too close (< 120 min before dueDate)
                          400 Invalid input

### Midtrans Module (Webhook Handler)
🔓 ⚡ POST   /api/midtrans/webhook
             Midtrans sends payment status notifications
             │
             ├─ Auth:     None (Midtrans server)
             ├─ Request:  {
             │              order_id: "midtransOrderId",
             │              transaction_id: "...",
             │              status_code: "200",
             │              transaction_status: "settlement" | "pending" | "expired" | "cancelled" | "denied" | "refund",
             │              payment_type: "bank_transfer" | "gopay" | "credit_card" | etc,
             │              settlement_time?: "2024-01-01T12:00:00Z"
             │            }
             ├─ Response: { status: "success", message: "Webhook processed" }
             │
             ├─ Business Logic:
             │   ├─ Find Payment by order_id (midtransOrderId)
             │   ├─ Update Payment.status based on transaction_status
             │   │   ├─ settlement → SETTLEMENT
             │   │   ├─ pending → PENDING
             │   │   ├─ expired → EXPIRE
             │   │   ├─ cancelled → CANCEL
             │   │   ├─ denied → DENY
             │   │   └─ refund → REFUND
             │   ├─ Update Payment.paymentMethod
             │   ├─ Set Payment.paidAt if SETTLEMENT
             │   └─ Update Appointment.status if payment successful
             │
             └─ Errors:   400 Payment not found (ignored)
                          500 Internal error
```

---

## 7️⃣ Health Check

### Root Endpoint
```
🔓 ⚡ GET    /api
             Health check / Welcome message
             │
             └─ Response: "Hello" or similar message
```

---

## 📊 Request/Response Format

### Standard Success Response
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Standard Paginated Response
```json
{
  "message": "Items retrieved successfully",
  "data": [ { ... }, { ... } ],
  "page": 1,
  "limit": 10,
  "total": 100
}
```

### Standard Error Response
```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "BadRequest" | "NotFound" | "Unauthorized" | "Conflict"
}
```

---

## 🔄 Request Authentication Methods

### Method 1: Authorization Header (Bearer Token)
```
GET /api/patients
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Method 2: HTTP-Only Cookie (Auto-sent by browser)
```
GET /api/patients
Cookie: access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📋 Complete Status Transitions

### Appointment Status Flow
```
PENDING → CONFIRMED → ONGOING → COMPLETED
       ↓
       → CANCELLED (at any point)
```

### Payment Status Flow
```
PENDING → SETTLEMENT (success)
       → EXPIRE (time expired)
       → CANCEL (user cancelled)
       → DENY (fraud detected)
       → REFUND (money returned)
```

---

## 🎯 Key Query Parameters Summary

| Endpoint | Parameter | Type | Example |
|----------|-----------|------|---------|
| `/users` | `role` | enum | `?role=NURSE` |
| `/users` | `name` | string | `?name=John` |
| `/patients` | `familyId` | uuid | `?familyId=uuid` |
| `/nurses` | `name` | string | `?name=Jane` |
| `/nurses` | `specialization` | string | `?specialization=Wound+Care` |
| `/nurses` | `experienceYears` | number | `?experienceYears=5` |
| `/appointments` | `status` | enum | `?status=CONFIRMED` |
| `/appointments` | `dueDate` | date | `?dueDate=2024-12-25` |
| `/carelog` | `page` | number | `?page=2` |
| `/carelog` | `limit` | number | `?limit=20` |

---

## 🔐 JWT Token Structure

```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "role": "FAMILY" | "NURSE" | "ADMIN",
  "iat": 1704067200,
  "exp": 1704153600
}

Signature:
HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), JWT_SECRET)
```

---

## ⚙️ Global Middleware Stack

1. **Logger**: Logs all requests (implicit)
2. **CORS**: Handles cross-origin requests
3. **Throttler Guard**: Rate limiting (100 req/60s)
4. **API Prefix**: All routes prefixed with `/api`
5. **Exception Filters**: Catches and formats errors
6. **Validation Pipe**: Zod schema validation on request bodies

---

## 💾 Database Relationships Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                           USER                                   │
│  (id, email, passwordHash, fullName, phoneNumber, role, ...)    │
└────────────────────────┬──────────────────┬──────────────────────┘
                         │                  │
        ┌────────────────┘                  └──────────────┐
        │ (one-to-many)                    (one-to-one)   │
        │                                                  │
        ▼                                                  ▼
    PATIENT                                         NURSE_PROFILE
    (id, familyId, name,                           (id, userId,
     dateOfBirth, weight,                          specialization,
     height, medicalHistory, ...)                  experienceYears, ...)
        │                                                  │
        │ (one-to-many)                   (one-to-many) │
        │                                                │
        ├─────────┬─────────────────────────┬────────────┤
        │         │                         │            │
        ▼         ▼                         ▼            ▼
   APPOINTMENT                            CARE_LOG
   (patientId ──┐                        (appointmentId ──┐
    nurseId ─────┼─────────────────────┬─ patientId ──┐
    serviceType  │                     │  nurseId ────┼─────────┐
    status       │                     │  vitals, ...) │         │
    dueDate, ...)│                     │               │         │
                 │                     │               ▼         │
                 │   ┌─────────────────┴─┐        ACTIVITY_LOG  │
                 │   │                     │        (careLogId,  │
                 │   ▼                     │         notes, ...)  │
                 │ PAYMENT                 │                      │
                 │ (appointmentId, ────────┘
                 │  midtransOrderId,
                 │  amount, status,
                 │  snapToken, ...)
                 │
                 └─ (one-to-many) to PAYMENT
```

---

## 🚀 Typical User Journey

```
START
  │
  ├─→ POST /users (register)
  │
  ├─→ POST /auth (login) [get JWT]
  │
  ├─→ POST /patients (create patient profile) [JWT]
  │
  ├─→ GET /nurses (browse available nurses)
  │
  ├─→ POST /appointments (book appointment)
  │    └─→ Auto-creates Payment (PENDING)
  │
  ├─→ POST /payment/{appointmentId} (get Midtrans token)
  │    └─→ Returns snap_token
  │
  ├─→ [Frontend redirects to Midtrans Snap payment page]
  │
  ├─→ POST /midtrans/webhook (Midtrans sends status)
  │    └─→ Payment status updated (SETTLEMENT|EXPIRE|CANCEL|etc)
  │
  ├─→ GET /appointments (view appointment status)
  │
  ├─→ [Nurse appointment starts]
  │
  ├─→ POST /carelog (nurse logs vitals)
  │
  ├─→ POST /activitylog (nurse logs activities)
  │
  ├─→ GET /carelog (family views care documentation)
  │
  └─→ END
```

---

*This is the complete endpoint map for the Paring Backend API*
*All endpoints are rate-limited to 100 requests per 60 seconds globally*
*Authentication uses JWT tokens stored in HTTP-only cookies*
