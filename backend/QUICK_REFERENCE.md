# Paring Backend - Quick Reference Card

## 🚀 Quick Start

**Base URL**: `http://localhost:3000/api`  
**Swagger Docs**: `http://localhost:3000/api/docs`

---

## 📊 Data Flow Diagram

```
User Registration & Login
├── POST /users (Register with role: ADMIN, FAMILY, NURSE)
└── POST /auth (Login → returns JWT token + sets HTTP-only cookie)

Family Workflow
├── POST /patients (Create elderly patient profile) [JWT Protected]
├── GET /patients (List their patients) [JWT Protected]
└── POST /appointments (Book nurse for patient)
    ├── Automatically creates Payment record
    └── POST /payment/{appointmentId} (Get Midtrans token)

Nurse Workflow
├── POST /nurses (Create nurse profile with specialization)
├── GET /appointments (View bookings)
├── POST /carelog (Log vital signs & observations)
│   └── POST /activitylog (Add sub-notes to carelog)
└── GET /carelog (View patient care history)

Payment Processing
├── POST /payment/{appointmentId} (Get Snap token)
├── [Frontend redirects to Midtrans Snap]
└── POST /midtrans/webhook (Midtrans notifies backend of payment status)
```

---

## 🔑 Authentication Quick Lookup

| What | Details |
|------|---------|
| **Method** | JWT + bcrypt |
| **Token Location** | Cookie OR Authorization header |
| **Token Lifetime** | Dev: 1 hour \| Prod: 1 day |
| **Protected Endpoints** | Patients module only |
| **Public Endpoints** | Everything else |

---

## 📋 All Endpoints by Module

### 🔐 Auth (`/auth`)
| POST | `/auth` | Login | No auth | Returns: `{ userId, email, role }` + sets cookie |

### 👥 Users (`/users`)
| POST | `/users` | Register | No auth | |
| GET | `/users` | List all | No auth | Query: `role`, `name` |
| GET | `/users/:id` | Get one | No auth | |
| PATCH | `/users/:id` | Update | No auth | |
| DELETE | `/users/:id` | Delete | No auth | |

### 👴 Patients (`/patients`)
| POST | `/patients` | Create | **JWT** | `familyId, name, dateOfBirth, medicalHistory` |
| GET | `/patients` | List | **JWT** | Query: `familyId` |
| GET | `/patients/:id` | Get one | **JWT** | |
| PATCH | `/patients/:id` | Update | **JWT** | |
| DELETE | `/patients/:id` | Delete | **JWT** | |

### 🏥 Nurses (`/nurses`)
| POST | `/nurses` | Create | No auth | `userId, specialization, experienceYears` |
| GET | `/nurses` | List | No auth | Query: `name, specialization, experienceYears` |
| GET | `/nurses/:id` | Get one | No auth | |
| PATCH | `/nurses/:id` | Update | No auth | |
| DELETE | `/nurses/:id` | Delete | No auth | |

### 📅 Appointments (`/appointments`)
| POST | `/appointments` | Create | No auth | `patientId, nurseId, serviceType, serviceName, dueDate, totalPrice` |
| GET | `/appointments` | List | No auth | Query: `status, dueDate` |
| GET | `/appointments/:id` | Get one | No auth | |
| PATCH | `/appointments/:id` | Update | No auth | Status: PENDING→CONFIRMED→ONGOING→COMPLETED/CANCELLED |
| DELETE | `/appointments/:id` | Delete | No auth | |

### 📝 CareLog (`/carelog`)
| POST | `/carelog` | Create | No auth | `appointmentId, patientId, nurseId, vitals...` |
| GET | `/carelog` | List | No auth | Query: `page, limit` (Paginated) |
| GET | `/carelog/:id` | Get one | No auth | |
| PATCH | `/carelog/:id` | Update | No auth | |
| DELETE | `/carelog/:id` | Delete | No auth | |

### 🎯 ActivityLog (`/activitylog`)
| POST | `/activitylog` | Create | No auth | `careLogId, notes` |
| PATCH | `/activitylog/:id` | Update | No auth | |
| DELETE | `/activitylog/:id` | Delete | No auth | |

### 💳 Payment (`/payment`)
| POST | `/payment/:appointmentId` | Create Midtrans | No auth | Returns: `{ token }` (Snap token) |

### 🔔 Midtrans Webhook (`/midtrans`)
| POST | `/midtrans/webhook` | Webhook handler | No auth | Midtrans sends this |

---

## 🗄️ Database Schema at a Glance

```
User [ADMIN, FAMILY, NURSE]
  ├─→ Patient (family: User)
  │   ├─→ Appointment (patient: Patient)
  │   │   ├─→ Payment (Midtrans integration)
  │   │   └─→ CareLog
  │   │       └─→ ActivityLog
  │   └─→ CareLog
  │
  └─→ NurseProfile (one-to-one)
      ├─→ Appointment (nurse: NurseProfile)
      └─→ CareLog
```

### Key Fields to Remember
- **User**: `email` (unique), `passwordHash` (bcrypt), `role`
- **Patient**: `familyId`, `dateOfBirth`, `medicalHistory`
- **NurseProfile**: `userId`, `specialization`, `experienceYears`, `rating`
- **Appointment**: `patientId`, `nurseId`, `dueDate` (mandatory), `totalPrice`, `status`
- **Payment**: `appointmentId`, `midtransOrderId` (unique!), `snapToken`, `status`
- **CareLog**: Vital signs (systolic, diastolic, bloodSugar, etc), `clinicalNotes`, `recordedAt`
- **ActivityLog**: `careLogId`, `notes`

---

## 🔄 Common Workflows

### Workflow 1: Family Books Appointment
```
1. POST /users → Register family
2. POST /auth → Login, get JWT
3. POST /patients → Create patient profile [JWT]
4. POST /appointments → Book nurse (creates Payment auto)
5. POST /payment/{appointmentId} → Get Midtrans Snap token
6. [Frontend: Use token to redirect to Midtrans]
7. POST /midtrans/webhook ← Midtrans notifies payment status
```

### Workflow 2: Nurse Logs Care
```
1. POST /users → Register nurse
2. POST /nurses → Create nurse profile
3. [Family books appointment → POST /appointments]
4. POST /carelog → Nurse logs vitals and notes
5. POST /activitylog → Nurse adds activity notes
6. GET /carelog → Family/Admin views care history
```

### Workflow 3: View Patient History
```
1. POST /auth → Login with JWT
2. GET /patients [JWT] → List my patients
3. GET /appointments?patientId=X → View patient's appointments
4. GET /carelog?patientId=X → View patient's care logs
```

---

## 🎯 Validation Rules

| Field | Rules |
|-------|-------|
| **email** | Unique, valid email format |
| **password** | Min 1 char (bcrypt hashed) |
| **role** | ADMIN \| FAMILY \| NURSE |
| **dueDate** | Must be future date/time |
| **serviceType** | VISIT \| LIVE_IN \| LIVE_OUT |
| **serviceName** | MEDIS \| NON_MEDIS |
| **appointmentStatus** | PENDING → CONFIRMED → ONGOING → COMPLETED/CANCELLED |
| **paymentStatus** | PENDING → SETTLEMENT/EXPIRE/CANCEL/DENY/REFUND |
| **moodScore** | 1-5 scale |

---

## ⚡ Rate Limiting

- **Global Limit**: 100 requests per 60 seconds
- **Applies to**: All endpoints
- **Resets**: Every 60 seconds

---

## 🔐 Security Highlights

✅ **JWT with signed tokens** (HS256)  
✅ **HTTP-only cookies** (CSRF protection)  
✅ **bcrypt password hashing** (salted rounds: 10)  
✅ **CORS enabled** for frontend (configurable origin)  
✅ **Zod validation** on all inputs  
✅ **Rate limiting** (100 req/60s)  

⚠️ **TODO**: Add role-based access control (RBAC)

---

## 💾 Environment Variables

```env
DATABASE_URL=postgresql://...              # PostgreSQL connection
JWT_SECRET=your-secret-key                 # JWT signing key
IS_PRODUCTION=false                        # Dev/Prod mode
MIDTRANS_CLIENT_KEY=...                    # Midtrans public key
MIDTRANS_SERVER_KEY=...                    # Midtrans secret key
MIDTRANS_IS_PRODUCTION=false               # Midtrans sandbox/prod
FRONTEND_URL=http://localhost:3001         # CORS origin
```

---

## 📞 Error Codes Summary

| Code | Meaning | Common Causes |
|------|---------|---------------|
| 200 | OK | Success |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid input, business rule violated |
| 401 | Unauthorized | Missing/invalid JWT token |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate email, etc |
| 500 | Server Error | Unexpected error |

---

## 🚀 Deployment Notes

- **Port**: 3000 (local), Vercel (production)
- **Database**: PostgreSQL (must be running)
- **Built with**: NestJS, Prisma, TypeScript
- **Package Manager**: npm/yarn
- **Scripts**:
  ```bash
  npm run start          # Dev mode
  npm run build          # Build for production
  npm run start:prod     # Production mode
  npx prisma migrate    # Run migrations
  npx prisma generate   # Generate Prisma client
  ```

---

## 🎓 Key Concepts

**JWT Payload Fields**:
- `user_id`: User UUID
- `email`: User email
- `role`: User role (ADMIN/FAMILY/NURSE)
- `iat`: Issued at timestamp
- `exp`: Expiration timestamp

**Midtrans Order ID** (in Payment model):
- Use `midtransOrderId` (NOT `appointmentId`) as `order_id` in Midtrans API
- Unique identifier for payment tracking
- Referenced in webhook responses

**Care Log Graph Queries**:
- Indexed by `(patientId, recordedAt)`
- Can fetch time-series vital signs
- Used for mood/health trend charts

---

## 🔗 Related URLs

- **Swagger Docs**: `/api/docs`
- **Frontend**: `http://localhost:3001`
- **Backend**: `http://localhost:3000/api`
- **Midtrans Dashboard**: https://dashboard.midtrans.com

---

*Last Updated: May 2026*
*Generated from: /backend/BACKEND_API_ANALYSIS.md*
