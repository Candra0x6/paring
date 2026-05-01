# 📚 Paring Backend Documentation Index

Welcome! This directory contains comprehensive documentation of the **Paring Backend** NestJS API.

## 📖 Documentation Files

### 1. **[SUMMARY.md](./SUMMARY.md)** - Start Here! 📌
**Best for**: Overview and high-level understanding  
**Contains**:
- Architecture overview
- Database schema diagram
- API endpoints summary
- Authentication strategy
- Key workflows
- Next steps & recommendations

**Read this first** for a bird's-eye view of the entire backend.

---

### 2. **[BACKEND_API_ANALYSIS.md](./BACKEND_API_ANALYSIS.md)** - Comprehensive Reference
**Best for**: Developers implementing features  
**Contains**:
- Complete database schema (7 models with relationships)
- Full API endpoint documentation (31 endpoints)
- Request/response examples
- Authentication & authorization details
- Global middleware & configuration
- Environment variables
- Module structure
- Technology stack
- curl command examples

**Read this** when you need detailed information about any endpoint or model.

---

### 3. **[ENDPOINT_MAP.md](./ENDPOINT_MAP.md)** - Visual Reference
**Best for**: Quick lookup while coding  
**Contains**:
- Complete endpoint map organized by module
- Request/response formats
- Status transition diagrams
- JWT token structure
- Database relationship diagram
- User journey flow
- Query parameters reference
- Error codes

**Read this** when you need to understand endpoint details or flows.

---

### 4. **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Cheat Sheet
**Best for**: Quick lookups while integrating  
**Contains**:
- Data flow diagrams
- All endpoints in table format
- Common workflows
- Validation rules
- Security highlights
- Environment variables
- Key concepts

**Read this** for fast reference without diving into details.

---

## 🎯 How to Use This Documentation

### "I'm new to this backend"
1. Start with **SUMMARY.md** (5 min read)
2. Review **QUICK_REFERENCE.md** for workflows (3 min read)
3. Deep dive into **BACKEND_API_ANALYSIS.md** for details

### "I need to call an API endpoint"
1. Open **QUICK_REFERENCE.md** or **ENDPOINT_MAP.md**
2. Find the endpoint in the table
3. Reference **BACKEND_API_ANALYSIS.md** for details

### "I'm implementing a feature"
1. Review **SUMMARY.md** for the workflow
2. Check **ENDPOINT_MAP.md** for API details
3. Use **BACKEND_API_ANALYSIS.md** for complete reference

### "I need to understand the database"
1. See schema overview in **SUMMARY.md**
2. View relationships in **ENDPOINT_MAP.md**
3. Read full schema in **BACKEND_API_ANALYSIS.md**

---

## 🔑 Key Information at a Glance

### Base URL
```
http://localhost:3000/api
```

### API Documentation (Swagger)
```
http://localhost:3000/api/docs
```

### Authentication
- **Method**: JWT + HTTP-only cookie
- **Token lifetime**: 1 hour (dev) / 1 day (prod)
- **Protected routes**: All `/patients` endpoints

### Database Models (7 total)
- User
- Patient
- NurseProfile
- Appointment
- Payment (Midtrans)
- CareLog
- ActivityLog

### API Modules (9 total)
- Auth (1 endpoint)
- Users (5 endpoints)
- Patients (5 endpoints - JWT protected)
- Nurses (5 endpoints)
- Appointments (5 endpoints)
- CareLog (5 endpoints)
- ActivityLog (3 endpoints)
- Payment (1 endpoint)
- Midtrans (1 endpoint)

**Total: 31 endpoints**

---

## 📊 Quick Endpoint Reference

| Module | Endpoints | Auth | Purpose |
|--------|-----------|------|---------|
| `/auth` | 1 | 🔓 | User login |
| `/users` | 5 | 🔓 | User management |
| `/patients` | 5 | 🔒 | Elderly care recipient profiles |
| `/nurses` | 5 | 🔓 | Nurse/caregiver profiles |
| `/appointments` | 5 | 🔓 | Service bookings |
| `/carelog` | 5 | 🔓 | Care documentation |
| `/activitylog` | 3 | 🔓 | Activity tracking |
| `/payment` | 1 | 🔓 | Midtrans payment creation |
| `/midtrans` | 1 | 🔓 | Payment webhook handler |

Legend: 🔓 = Public | 🔒 = JWT Protected

---

## 🔐 Authentication

### Login Flow
```
POST /auth { email, password }
  ↓
Returns: { userId, email, role } + sets HTTP-only cookie
  ↓
Use token in subsequent requests via:
  - Authorization: Bearer <token> header, OR
  - HTTP-only cookie (auto-sent)
```

### Protected Endpoint Example
```bash
# With Authorization header
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3000/api/patients

# With HTTP-only cookie (auto-sent by browser)
curl http://localhost:3000/api/patients
```

---

## 🎯 Common Workflows

### Workflow 1: Family Books Appointment
```
1. Register                   → POST /users
2. Login                       → POST /auth
3. Create patient profile      → POST /patients [JWT]
4. Browse nurses               → GET /nurses
5. Book appointment            → POST /appointments (auto-creates Payment)
6. Get payment token           → POST /payment/{appointmentId}
7. Process Midtrans payment    → [Frontend redirects to Snap]
8. Webhook updates payment     → POST /midtrans/webhook
```

### Workflow 2: Nurse Documents Care
```
1. Register as nurse           → POST /users
2. Create nurse profile        → POST /nurses
3. Log care entry              → POST /carelog
4. Add activity notes          → POST /activitylog
```

### Workflow 3: View Patient History
```
1. Login                       → POST /auth
2. List my patients            → GET /patients [JWT]
3. View appointments           → GET /appointments
4. View care logs              → GET /carelog
```

---

## 🛠️ Development Setup

```bash
# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma migrate dev

# Start development server
npm run start

# View Swagger docs
# Open: http://localhost:3000/api/docs
```

### Required Environment Variables
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
MIDTRANS_CLIENT_KEY=...
MIDTRANS_SERVER_KEY=...
```

---

## 📞 Support & Troubleshooting

### "I got a 401 Unauthorized error"
- Missing or invalid JWT token
- Check Authorization header or cookie
- Try logging in again: `POST /auth`

### "I got a 404 Not Found error"
- Resource doesn't exist
- Check the ID parameter
- Verify the resource was created

### "Payment webhook not working"
- Ensure `MIDTRANS_SERVER_KEY` is set correctly
- Check that endpoint `POST /midtrans/webhook` is public
- Verify Midtrans webhook URL is configured correctly

### "CORS errors from frontend"
- Check `FRONTEND_URL` environment variable
- Ensure frontend URL matches CORS configuration
- Check browser console for exact error

---

## 📚 File Organization

```
backend/
├── DOCUMENTATION_INDEX.md          ← You are here
├── SUMMARY.md                      ← Start here for overview
├── BACKEND_API_ANALYSIS.md         ← Comprehensive reference
├── ENDPOINT_MAP.md                 ← Visual endpoint reference
├── QUICK_REFERENCE.md              ← Quick cheat sheet
├── README.md                       ← Original project README
│
├── src/
│   ├── main.ts                     # App entry point
│   ├── app.module.ts               # Root module
│   ├── env.ts                      # Environment validation
│   ├── auth/                       # Authentication (1 endpoint)
│   ├── users/                      # User management (5 endpoints)
│   ├── patients/                   # Patient profiles (5 endpoints, JWT protected)
│   ├── nurses/                     # Nurse profiles (5 endpoints)
│   ├── appointments/               # Appointments (5 endpoints)
│   ├── carelog/                    # Care logs (5 endpoints)
│   ├── activitylog/                # Activity logs (3 endpoints)
│   ├── payment/                    # Payment (1 endpoint)
│   ├── database/                   # Prisma integration
│   └── common/                     # Shared utilities
│       ├── guards/
│       │   └── jwt-auth.guard.ts
│       ├── pipes/
│       │   └── zod-validation.pipe.ts
│       └── decorators/
│
├── prisma/
│   └── schema.prisma               # Database schema
└── package.json
```

---

## 🔍 Finding Information

**Looking for...** | **Read this**
---|---
API endpoint details | ENDPOINT_MAP.md or BACKEND_API_ANALYSIS.md
Database schema | BACKEND_API_ANALYSIS.md (section 1)
Authentication flow | SUMMARY.md (Authentication Strategy section)
Example API calls | BACKEND_API_ANALYSIS.md (API Examples section)
Error codes | ENDPOINT_MAP.md (Error Codes section)
Environment variables | SUMMARY.md or BACKEND_API_ANALYSIS.md
Workflows | QUICK_REFERENCE.md (Common Workflows section)
Module structure | BACKEND_API_ANALYSIS.md or SUMMARY.md
Security features | SUMMARY.md (Security Features section)
JWT details | ENDPOINT_MAP.md (JWT Token Structure section)
Payment workflow | ENDPOINT_MAP.md (Payment Module section)
Rate limiting | QUICK_REFERENCE.md (Rate Limiting section)

---

## ✨ Key Features

✅ **JWT Authentication** - Secure token-based auth with HTTP-only cookies  
✅ **Role-Based Access** - ADMIN, FAMILY, NURSE roles  
✅ **Elderly Care Platform** - Patient profiles, appointment booking, care documentation  
✅ **Payment Integration** - Midtrans Snap for payment processing  
✅ **Real-time Care Logs** - Vital signs tracking with graphing support  
✅ **API Documentation** - Swagger/OpenAPI at `/api/docs`  
✅ **Rate Limiting** - Global 100 req/60s throttler  
✅ **Input Validation** - Zod schema validation  
✅ **Production Ready** - Deployed to Vercel serverless  

---

## 📞 Contact & Support

- **Swagger Docs**: `http://localhost:3000/api/docs`
- **GitHub**: [Check project repository]
- **Issues**: Document in project management system

---

## 🎓 Learning Path

**For New Developers**:
1. Read SUMMARY.md (overview)
2. Read QUICK_REFERENCE.md (key concepts)
3. Explore BACKEND_API_ANALYSIS.md (deep dive)
4. Review src/ directory structure
5. Start coding!

**For Feature Implementation**:
1. Check QUICK_REFERENCE.md for workflow
2. Review ENDPOINT_MAP.md for affected endpoints
3. Reference BACKEND_API_ANALYSIS.md for details
4. Implement feature using src/ code as reference

---

## 📝 Notes

- All endpoints use `/api` prefix
- All responses follow standard format with `message` and `data` fields
- Rate limiting applies globally (100 req/60s)
- JWT tokens valid for 1 hour (dev) or 1 day (prod)
- HTTP-only cookies prevent XSS attacks
- Midtrans webhook is public (no authentication needed)

---

**Last Updated**: May 2026  
**Framework**: NestJS  
**Database**: PostgreSQL (Prisma ORM)  
**Authentication**: JWT + bcrypt

---

Happy coding! 🚀
