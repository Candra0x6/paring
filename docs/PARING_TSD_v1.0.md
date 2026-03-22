# TECHNICAL SPECIFICATIONS DOCUMENT

## PARING

## Homecare Lansia Platform

| Document | Technical Specifications — Document #7 |
| --- | --- |
| Version | 1.0 — MVP |
| Date | March 2026  \|  P2MW Program |
| Audience | Engineering Team, Tech Lead, CTO |
| Status | Draft — In Review |

# 1. System Overview

PARING is a full-stack web application built with the React/TypeScript ecosystem. It serves multiple user roles (Family, Nurse, Admin) through a unified Next.js codebase, exposing both a public-facing SEO landing page and a protected interactive dashboard. The system integrates third-party services for payment, messaging, authentication, and AI.

## 1.1 Architecture Pattern

| Pattern | Monolithic Full-Stack with API Routes (Next.js App Router) |
| --- | --- |
| Rendering | Hybrid: SSR for Landing Page (SEO), CSR for Dashboard & real-time views |
| API Layer | Next.js Route Handlers (/app/api/**) — RESTful conventions |
| Auth Strategy | Server-side session via NextAuth.js (JWT + database session) |
| Real-Time | Polling (short-interval fetch) for MVP; WebSocket/SSE in post-MVP |
| Deployment | Vercel (Next.js) + Google Cloud Platform (DB, Storage) |
| Environments | Development → Staging → Production |

## 1.2 High-Level Architecture Diagram (Text)

| ┌─────────────────────────────────────────────────────────────────┐ │                         CLIENT LAYER                            │ │   Browser / Mobile Browser  ←→  Next.js App Router (Vercel)    │ │   [ Landing Page (SSR) ]  [ Dashboard (CSR) ]  [ Nurse App ]   │ └───────────────────────────────┬─────────────────────────────────┘ │  HTTPS ┌───────────────────────────────▼─────────────────────────────────┐ │                      APPLICATION LAYER                          │ │         Next.js API Route Handlers  (/app/api/**)               │ │   Auth Routes │ Booking Routes │ Monitoring Routes │ Admin API  │ └───┬───────────────────┬──────────────────┬───────────────────┬──┘ │                   │                  │                   │ ▼                   ▼                  ▼                   ▼ ┌───────────┐  ┌─────────────────┐  ┌──────────────┐  ┌───────────────┐ │ NextAuth  │  │  Prisma ORM     │  │  WA Gateway  │  │   Midtrans    │ │ (Auth)    │  │  PostgreSQL DB  │  │  (Notif/OTP) │  │  (Payment)    │ │           │  │  (GCP Cloud SQL)│  │              │  │               │ └───────────┘  └─────────────────┘  └──────────────┘  └───────────────┘ │ ┌──────▼──────┐ │  AI API     │ │  (Sprint 6) │ └─────────────┘ |
| --- |

# 2. Technology Stack

## 2.1 Core Technologies

| Layer | Technology | Version | Rationale |
| --- | --- | --- | --- |
| Frontend/Fullstack | Next.js (App Router) | 14.x | Unified SSR+CSR, file-based routing, API routes |
| Language | TypeScript | 5.x | Type safety across full stack |
| Styling | Tailwind CSS | 3.x | Utility-first, rapid responsive UI |
| ORM | Prisma | 5.x | Type-safe DB access, schema migrations |
| Database | PostgreSQL | 15.x | Relational, ACID-compliant, GCP Cloud SQL |
| Auth | NextAuth.js | 4.x | Multi-provider auth, session management |
| State Management | React Context + SWR | Latest | Lightweight; SWR for data fetching + caching |
| Form Validation | React Hook Form + Zod | Latest | Schema-based validation end-to-end |
| Payment | Midtrans SDK (Node.js) | Latest | Indonesian payment gateway |
| Messaging | WA API Gateway (Fonnte/Wablas) | REST | WhatsApp OTP, notifications, emergency broadcast |
| Deployment | Vercel | Latest | Optimized Next.js hosting, CI/CD |
| Cloud | Google Cloud Platform | Latest | Cloud SQL (PostgreSQL), Cloud Storage |

## 2.2 Development Tools

| Tool | Purpose | Notes |
| --- | --- | --- |
| ESLint + Prettier | Code linting and formatting | Enforced via pre-commit hooks (Husky) |
| Jest + React Testing Library | Unit & integration tests | Target: 70% coverage on core business logic |
| Playwright | End-to-end testing | Booking flow, payment flow, emergency flow |
| Prisma Studio | DB admin & visual inspection | Dev environment only |
| GitHub Actions | CI/CD pipeline | Run tests → build → deploy to Vercel on PR merge |
| Vercel Preview | Staging environment per PR | Auto-deployed preview URLs for each pull request |
| Postman / Thunder Client | API endpoint testing | Used during development of each route |

# 3. System Modules & Responsibilities

The application is organized into feature-based modules, each owning its own API routes, server components, client components, and service layer.

| Module | Responsibilities | Key Files / Routes |
| --- | --- | --- |
| auth | Registration, login, logout, session, password reset | app/api/auth/** \| lib/auth.ts |
| users | User profile CRUD, role management | app/api/users/** \| prisma: User model |
| patients | Elderly patient profile CRUD, health data | app/api/patients/** \| prisma: Patient model |
| nurses | Nurse profile, verification status, schedule | app/api/nurses/** \| prisma: Nurse model |
| bookings | Booking creation, status updates, history | app/api/bookings/** \| prisma: Booking model |
| sessions | Active care session management, checklist | app/api/sessions/** \| prisma: Session model |
| monitoring | Real-time health data ingestion & retrieval | app/api/monitoring/** \| prisma: HealthLog |
| emergency | Panic button trigger, broadcast, admin log | app/api/emergency/** \| lib/wa-gateway.ts |
| payments | Midtrans payment session, webhook handling | app/api/payments/** \| lib/midtrans.ts |
| notifications | WA Gateway dispatcher (OTP, schedule, alerts) | lib/notifications.ts \| lib/wa-gateway.ts |
| admin | Nurse verification, emergency logs, dashboard | app/admin/** \| app/api/admin/** |
| ai | Nurse matching, report analysis (Sprint 6) | app/api/ai/** \| lib/ai-client.ts |

# 4. API Design Principles

## 4.1 Conventions

* Base URL: /api/v1/[resource]

* Method semantics: GET (read), POST (create), PATCH (partial update), DELETE (soft delete).

* Authentication: All protected routes require a valid session cookie (NextAuth). Admin routes additionally require role='ADMIN'.

* Response envelope: All responses use a consistent JSON envelope.

* Error codes: Standard HTTP status codes + machine-readable error code in body.

## 4.2 Standard Response Envelope

| // Success { "success": true, "data": { ... }, "meta": { "timestamp": "2026-03-25T09:00:00Z" } }  // Error { "success": false, "error": { "code": "BOOKING_NOT_FOUND", "message": "Booking with id 123 was not found.", "field": null } } |
| --- |

## 4.3 Authentication Flow

| POST /api/auth/register Body: { name, email, phone, password } Response 201: { user: { id, name, email, role } }  POST /api/auth/login       (NextAuth signIn) Body: { email, password } Response 200: Sets HttpOnly session cookie  POST /api/auth/logout      (NextAuth signOut) Response 200: Clears session cookie  POST /api/auth/forgot-password Body: { email } Response 200: Sends reset link (even if email not found — security)  POST /api/auth/reset-password Body: { token, newPassword } Response 200: Password updated |
| --- |

## 4.4 Core Endpoint Reference

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | /api/v1/nurses | User | List verified nurses with optional filters (type, date, specialization) |
| GET | /api/v1/nurses/:id | User | Get single nurse profile with schedule |
| GET | /api/v1/patients | User | List all patient profiles for current user |
| POST | /api/v1/patients | User | Create a new patient profile |
| PATCH | /api/v1/patients/:id | User | Update patient profile |
| POST | /api/v1/bookings | User | Create a new booking request |
| GET | /api/v1/bookings | User | List all bookings for current user |
| PATCH | /api/v1/bookings/:id | Nurse/User | Nurse confirms or user cancels a booking |
| GET | /api/v1/sessions/:id/logs | User | Get real-time health log for an active session |
| POST | /api/v1/sessions/:id/logs | Nurse | Nurse submits health data entry to a session |
| POST | /api/v1/emergency/trigger | User | Trigger panic button — broadcasts WA + logs event |
| POST | /api/v1/payments/initiate | User | Create Midtrans payment session for a booking |
| POST | /api/v1/payments/webhook | System | Midtrans webhook — updates booking payment status |
| GET | /api/v1/admin/nurses | Admin | List all nurses including pending verification |
| PATCH | /api/v1/admin/nurses/:id | Admin | Approve or reject a nurse profile |

# 5. Non-Functional Requirements

## 5.1 Performance

| Metric | Target | Measurement Method |
| --- | --- | --- |
| Landing page Time-to-First-Byte (TTFB) | < 600ms | Vercel Analytics / Lighthouse |
| Dashboard initial page load | < 2.5s on 4G | Chrome DevTools / Lighthouse |
| Real-time monitoring polling interval | ≤ 3 seconds | Custom latency log |
| API response time (P95) | < 500ms | Vercel Functions log |
| Emergency broadcast delivery (WA) | < 10 seconds | WA Gateway delivery report |
| Payment session initiation | < 3 seconds | Midtrans API response time |

## 5.2 Security Requirements

* HTTPS enforced on all routes via Vercel TLS.

* All passwords hashed using bcrypt (cost factor 12) before storage.

* Session tokens stored as HttpOnly, Secure, SameSite=Lax cookies.

* API routes protected by middleware session check — unauthenticated requests return 401.

* Midtrans webhook verified using HMAC-SHA512 signature to prevent spoofing.

* Emergency broadcast endpoint rate-limited to 3 triggers per user per 10-minute window.

* Patient health data anonymized before being sent to AI API endpoints (Sprint 6).

* Environment variables (API keys, DB URL, secrets) never committed to version control — stored in Vercel environment variables.

## 5.3 Scalability

* Database connection pooling via Prisma Accelerate or PgBouncer to handle concurrent requests.

* Vercel serverless functions auto-scale; no manual capacity planning required for MVP scale.

* Static assets (images, fonts) served via Vercel CDN.

* GCP Cloud SQL configured with automatic storage increase and read replica for future scale.

## 5.4 Availability & Reliability

* Target uptime: 99.5% monthly (Vercel SLA provides 99.99% for hosting).

* Database backups: Daily automated backups on GCP Cloud SQL, 7-day retention.

* WA Gateway fallback: If primary gateway fails, switch to backup provider (configured in env var).

* Emergency broadcast uses fire-and-forget pattern with delivery logging; failures are retried once.

# 6. Environment Configuration

## 6.1 Required Environment Variables

| # Database DATABASE_URL=postgresql://user:pass@host:5432/paring_db  # NextAuth NEXTAUTH_SECRET=<random-32-char-string> NEXTAUTH_URL=https://paring.vercel.app  # WhatsApp Gateway WA_GATEWAY_URL=https://api.fonnte.com/send WA_GATEWAY_TOKEN=<your-fonnte-token> WA_ADMIN_NUMBER=628xxxxxxxxxx  # Midtrans MIDTRANS_SERVER_KEY=<your-server-key> MIDTRANS_CLIENT_KEY=<your-client-key> MIDTRANS_IS_PRODUCTION=false   # true in production  # AI (Sprint 6) AI_API_URL=https://api.openai.com/v1   # or alternative AI_API_KEY=<your-ai-api-key>  # App NEXT_PUBLIC_APP_URL=https://paring.vercel.app NODE_ENV=production |
| --- |

## 6.2 Environments

| Environment | URL | Purpose |
| --- | --- | --- |
| Development | localhost:3000 | Local development; uses local PostgreSQL |
| Staging (Preview) | *.vercel.app (PR preview) | Auto-deployed per pull request; uses staging DB |
| Production | paring.vercel.app | Live application; uses GCP Cloud SQL |

# 7. Third-Party Integration Specs

## 7.1 WhatsApp Gateway (Fonnte)

Used for: OTP verification, booking notifications, schedule reminders, and emergency broadcasts.

| // Send WA Message — POST https://api.fonnte.com/send // Headers: { Authorization: WA_GATEWAY_TOKEN } // Body: { "target": "628xxxxxxxxxx", "message": "Notifikasi dari PARING: ...", "countryCode": "62" } // Emergency broadcast: call send() 3 times in parallel (family, nurse, admin) // Log each delivery status to EmergencyLog table |
| --- |

## 7.2 Midtrans Payment Gateway

Used for: booking payment processing. MVP uses Snap (redirect-based) integration.

| // Step 1: Create Snap token — POST /api/v1/payments/initiate // Server calls Midtrans API: const snap = new MidtransClient.Snap({ isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true', serverKey: process.env.MIDTRANS_SERVER_KEY, }); const token = await snap.createTransactionToken({ transaction_details: { order_id: bookingId, gross_amount: totalAmount }, customer_details: { name, email, phone }, item_details: [{ id, price, quantity, name }], });  // Step 2: Frontend receives token and opens Snap popup window.snap.pay(token, { onSuccess, onPending, onError });  // Step 3: Midtrans calls webhook POST /api/v1/payments/webhook // Verify signature: SHA512(orderId + statusCode + grossAmount + serverKey) // Update Booking.paymentStatus in DB based on transaction_status |
| --- |

## 7.3 AI Integration (Sprint 6)

Two AI features are planned: nurse matching recommendation and automated care report analysis. Both require data anonymization before API call.

| // Nurse Matching — POST /api/v1/ai/match // Input: anonymized patient condition profile // Output: ranked list of nurse IDs with match scores  // Care Report Analysis — POST /api/v1/ai/analyze // Input: anonymized session health log data // Output: { sentiment: 'POSITIVE'\|'NEUTRAL'\|'CONCERNING', //           summary: string, healthScore: 1-5, flags: string[] } // Requires: Informed Consent = true on patient profile // Anonymize: strip name, address, DOB before sending to AI API |
| --- |

# 8. Deployment & CI/CD Pipeline

## 8.1 Pipeline Overview

| Developer pushes to feature branch │ ▼ GitHub Actions CI runs: 1. npm run lint          (ESLint) 2. npm run type-check    (TypeScript tsc --noEmit) 3. npm run test          (Jest unit tests) 4. Build check: next build │ ▼ (if all pass) Vercel Preview Deployment → PR Preview URL │ ▼ (PR approved + merged to main) Vercel Production Deployment → paring.vercel.app │ ▼ Prisma migrations run: npx prisma migrate deploy |
| --- |

## 8.2 Branch Strategy

| Branch | Purpose | Deploy Target |
| --- | --- | --- |
| main | Stable production code | Vercel Production |
| develop | Integration branch for ongoing sprint work | Vercel Preview (stable) |
| feature/* | Individual task branches | Vercel Preview (per PR) |
| hotfix/* | Critical production bug fixes — merged to main directly | Vercel Production |

## 8.3 Database Migration Strategy

* Schema changes made via Prisma migration files (prisma/migrations/**).

* Migrations run automatically on production deploy via npx prisma migrate deploy.

* Never edit migration files after they are committed — create a new migration instead.

* Seeding: npx prisma db seed populates initial admin account and sample nurse data for staging.

# 9. Error Handling & Logging

## 9.1 Error Classification

| Level | HTTP Code | Error Type | Action |
| --- | --- | --- | --- |
| P0 | 500 | Unhandled server error, DB down | Page-level error boundary; log to console/Vercel |
| P1 | 400–422 | Validation errors, bad input | Return field-level error to client for inline display |
| P1 | 401/403 | Unauthenticated / Unauthorized | Redirect to login or return 401 JSON |
| P2 | 404 | Resource not found | Return 404 JSON with RESOURCE_NOT_FOUND code |
| P2 | 409 | Conflict (duplicate booking, etc.) | Return 409 with specific CONFLICT code |
| P3 | 503 | Third-party API unavailable | Return 503; client shows retry message |

## 9.2 Logging Strategy

* Development: console.log / console.error with structured JSON output.

* Production: Vercel Functions log viewer + optional Sentry integration for error tracking.

* Emergency events always logged to EmergencyLog table regardless of WA delivery outcome.

* Payment webhook events logged to PaymentLog table for audit purposes.

## 9.3 Global Error Boundary (Frontend)

| // app/error.tsx — catches all unhandled React errors in production 'use client'; export default function Error({ error, reset }) { return ( <div> <h2>Terjadi kesalahan. Silakan coba lagi.</h2> <button onClick={() => reset()}>Coba Lagi</button> </div> ); } |
| --- |

# 10. Technical Glossary

| Term | Definition |
| --- | --- |
| SSR | Server-Side Rendering — page HTML generated on the server for each request (SEO-friendly) |
| CSR | Client-Side Rendering — page rendered in the browser using JavaScript |
| App Router | Next.js 13+ routing system using the /app directory with React Server Components |
| Prisma ORM | Object-Relational Mapper that provides a type-safe API to interact with PostgreSQL |
| NextAuth.js | Authentication library for Next.js; manages sessions, providers, and token lifecycle |
| SWR | React data fetching library with built-in caching, revalidation, and stale-while-revalidate |
| Snap (Midtrans) | Midtrans redirect-based payment UI; generates a token used to open a payment popup |
| Webhook | Server-to-server HTTP callback; Midtrans calls our /payments/webhook after payment |
| HMAC-SHA512 | Hash-based message authentication — used to verify Midtrans webhook authenticity |
| HttpOnly Cookie | Browser cookie that cannot be accessed by JavaScript — used for secure session storage |
| Soft Delete | Marking a record as inactive (isDeleted=true) rather than removing it from the DB |
| Fire-and-forget | Async operation triggered without awaiting its result — used for non-critical notifications |
