# API DOCUMENTATION

## PARING

## Homecare Lansia Platform

| Document | API Documentation — Document #8 |
| --- | --- |
| Version | 1.0 — MVP |
| Base URL | https://paring.vercel.app/api/v1 |
| Format | REST / JSON |
| Auth | Session Cookie (NextAuth.js) |
| Date | March 2026  \|  P2MW Program |

# 1. Introduction

This document describes all REST API endpoints exposed by the PARING Next.js backend. All endpoints are prefixed with /api/v1 and return JSON. Authentication is managed by NextAuth.js via a server-side session cookie.

## 1.1 Base Information

| Base URL | https://paring.vercel.app/api/v1 |
| --- | --- |
| Staging URL | https://<pr-preview>.vercel.app/api/v1 |
| Protocol | HTTPS only (HTTP redirects to HTTPS) |
| Content-Type | application/json (all requests and responses) |
| Authentication | Session cookie set by NextAuth.js — required for all protected routes |
| Rate Limiting | Emergency endpoint: max 3 triggers / 10 min per user. Other endpoints: Vercel default limits. |
| Timezone | All timestamps in ISO 8601 UTC (e.g., 2026-03-25T09:00:00Z) |

## 1.2 Standard Response Format

| // Success (HTTP 200 / 201) {  "success": true, "data": { ... }, "meta": { "timestamp": "2026-03-25T09:00:00Z", "version": "1.0" } }  // Error (HTTP 4xx / 5xx) {  "success": false, "error": { "code":    "BOOKING_NOT_FOUND",   // machine-readable "message": "Booking 123 not found.", "field":   null                   // or field name for validation errors } } |
| --- |

## 1.3 HTTP Status Codes Used

| Code | Status | When Used |
| --- | --- | --- |
| 200 | OK | Successful GET, PATCH, or action request |
| 201 | Created | Successful POST that creates a new resource |
| 400 | Bad Request | Missing or invalid request body fields |
| 401 | Unauthorized | No valid session — user must log in |
| 403 | Forbidden | Authenticated but insufficient role/permission |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Duplicate resource (e.g., email already registered) |
| 422 | Unprocessable | Validation error with field-level detail |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unhandled server-side error |
| 503 | Service Unavailable | Third-party dependency (WA, Midtrans) unavailable |

# 2. Authentication Endpoints

| POST  /auth/register   — Register a new family user account |  |
| --- | --- |
| Auth Required | None (public) |
| Request Body | { "name": "Budi Santoso", "email": "budi@example.com", "phone": "6281234567890", "password": "SecurePass123!" } |
| Response | HTTP 201 { "success": true, "data": { "id": "uuid", "name": "Budi Santoso", "email": "budi@example.com", "role": "FAMILY" } } |
| ℹ  Password must be ≥ 8 characters. ℹ  Returns 409 if email already exists. ℹ  Auto-sends welcome WA message to phone. |  |

| POST  /auth/login   — Log in with email and password — sets session cookie |  |
| --- | --- |
| Auth Required | None (public) |
| Request Body | { "email": "budi@example.com", "password": "SecurePass123!" } |
| Response | HTTP 200 { "success": true, "data": { "id": "uuid", "name": "Budi Santoso", "role": "FAMILY" } } // Also sets HttpOnly session cookie: next-auth.session-token |
| ℹ  Account locked for 15 minutes after 5 consecutive failed attempts. ℹ  Returns 401 on invalid credentials. |  |

| POST  /auth/logout   — End the current session and clear the session cookie |  |
| --- | --- |
| Auth Required | Any authenticated user |
| Response | HTTP 200 { "success": true, "data": { "message": "Logged out successfully." } } |

| POST  /auth/forgot-password   — Request a password reset link sent to the registered email |  |
| --- | --- |
| Auth Required | None (public) |
| Request Body | { "email": "budi@example.com" } |
| Response | HTTP 200 { "success": true, "data": { "message": "Reset link sent if email is registered." } } |
| ℹ  Always returns 200 regardless of whether email exists — prevents user enumeration. |  |

| POST  /auth/reset-password   — Reset password using a valid reset token from email link |  |
| --- | --- |
| Auth Required | None (public) |
| Request Body | { "token": "<reset-token-from-email>", "newPassword": "NewPass456!" } |
| Response | HTTP 200 { "success": true, "data": { "message": "Password updated. Please log in." } } |
| ℹ  Token expires after 1 hour. |  |

# 3. Patient Profile Endpoints

| GET  /patients   — List all patient profiles owned by the authenticated user |  |
| --- | --- |
| Auth Required | Family User |
| Response | HTTP 200 { "success": true, "data": [ { "id": "uuid", "name": "Pak Soeharto", "isBedridden": false, "hasDiabetes": true, "city": "Solo", "isActive": true } ] } |
| ℹ  Only returns profiles where deletedAt IS NULL. |  |

| POST  /patients   — Create a new elderly patient profile |  |
| --- | --- |
| Auth Required | Family User |
| Request Body | { "name": "Pak Soeharto", "gender": "MALE", "dateOfBirth": "1954-06-12", "weightKg": 62, "heightCm": 165, "address": "Jl. Merdeka No.5", "city": "Solo", "bpSystolic": 140, "bpDiastolic": 90, "hasDiabetes": true, "isBedridden": false, "aiConsent": false, "emergencyContactName": "Budi Santoso", "emergencyContactPhone": "6281234567890" } |
| Response | HTTP 201 { "success": true, "data": { "id": "uuid", "name": "Pak Soeharto", ... } } |
| ℹ  name, gender, address, city are required. |  |

| GET  /patients/:id   — Get a single patient profile with full health history |  |
| --- | --- |
| Auth Required | Family User (owner) |
| Response | HTTP 200 { "success": true, "data": { "id": "uuid", "name": "Pak Soeharto", "reports": [ ... last 5 session reports ... ], "recentHealthLogs": [ ... ] } } |
| ℹ  Returns 403 if the authenticated user does not own this patient profile. |  |

| PATCH  /patients/:id   — Update a patient profile — partial update (only sent fields are changed) |  |
| --- | --- |
| Auth Required | Family User (owner) |
| Request Body | { "weightKg": 63.5, "bpSystolic": 135, "aiConsent": true } |
| Response | HTTP 200 { "success": true, "data": { "id": "uuid", "weightKg": 63.5, ... } } |

| DELETE  /patients/:id   — Soft-delete a patient profile (sets deletedAt — data is retained) |  |
| --- | --- |
| Auth Required | Family User (owner) |
| Response | HTTP 200 { "success": true, "data": { "message": "Patient profile deactivated." } } |

# 4. Nurse Discovery Endpoints

| GET  /nurses   — List verified nurses with optional query filters |  |
| --- | --- |
| Auth Required | Family User |
| Response | // Query params: ?serviceType=VISIT&city=Solo&date=2026-03-25&canCareBedridden=true HTTP 200 { "success": true, "data": [ { "id": "uuid", "name": "Siti Rahmawati", "ratingAvg": "4.90", "specializations": ["diabetes","lansia"], "serviceTypes": ["VISIT","LIVE_OUT"], "canCareBedridden": true, "totalSessions": 123 } ], "meta": { "total": 16 } } |
| ℹ  Only returns nurses where verifiedStatus = VERIFIED and isActive = true. ℹ  Filter by date checks NurseSchedule for available slots on that date. |  |

| GET  /nurses/:id   — Get a single nurse's full profile including schedule and service list |  |
| --- | --- |
| Auth Required | Family User |
| Response | HTTP 200 { "success": true, "data": { "id": "uuid", "name": "Siti Rahmawati", "certifications": ["STR Perawat", "BTCLS"], "specializations": ["diabetes", "lansia"], "serviceTypes": ["VISIT", "LIVE_OUT"], "ratingAvg": "4.90", "totalSessions": 123, "canCareBedridden": true, "schedule": [ { "date": "2026-03-25", "startTime": "09:00", "endTime": "12:00", "isBooked": false } ] } } |
| ℹ  Schedule shows next 30 days of available and booked slots. |  |

# 5. Booking Endpoints

| POST  /bookings   — Create a new booking request — notifies nurse via WA |  |
| --- | --- |
| Auth Required | Family User |
| Request Body | { "patientId": "uuid", "nurseId": "uuid", "serviceType": "VISIT", "scheduledDate": "2026-03-25", "scheduledTime": "09:00", "concernNotes": "Pasien memiliki riwayat diabetes, mohon cek gula darah.", "services": [ { "serviceName": "Cek Tekanan Darah", "serviceType": "MEDICAL", "unitPrice": 25000 }, { "serviceName": "Cek Berat Badan",   "serviceType": "MEDICAL", "unitPrice": 15000 } ] } |
| Response | HTTP 201 { "success": true, "data": { "id": "uuid", "status": "PENDING", "scheduledDate": "2026-03-25", "estimatedPrice": 40000 } } |
| ℹ  If patient isBedridden=true but nurse canCareBedridden=false, returns 422. ℹ  Sends WA notification to nurse on creation. |  |

| GET  /bookings   — List all bookings for the authenticated user (Family sees own bookings; Nurse sees received bookings) |  |
| --- | --- |
| Auth Required | Family User or Nurse |
| Response | // Query params: ?status=PENDING&page=1&limit=10 HTTP 200 { "success": true, "data": [ { "id": "uuid", "status": "PENDING", "patientName": "Pak Soeharto", "nurseName": "Siti Rahmawati", "scheduledDate": "2026-03-25", "finalPrice": null } ], "meta": { "total": 4 } } |

| GET  /bookings/:id   — Get full detail of a single booking including services, chat, and session info |  |
| --- | --- |
| Auth Required | Owner (Family or Nurse) |
| Response | HTTP 200 { "success": true, "data": { "id": "uuid", "status": "AWAITING_PAYMENT", "patient": { ... }, "nurse": { ... }, "services": [ { "serviceName": "Cek Tekanan Darah", "unitPrice": 25000 } ], "finalPrice": 45000, "session": null } } |

| PATCH  /bookings/:id/confirm   — Nurse confirms a PENDING booking and sets the final price |  |
| --- | --- |
| Auth Required | Nurse (assigned) |
| Request Body | { "finalPrice": 45000, "priceBreakdown": [ { "serviceName": "Cek Tekanan Darah", "unitPrice": 25000 }, { "serviceName": "Cek Berat Badan",   "unitPrice": 15000 }, { "serviceName": "Biaya Layanan PARING", "unitPrice": 5000 } ] } |
| Response | HTTP 200 { "success": true, "data": { "id": "uuid", "status": "AWAITING_PAYMENT", "finalPrice": 45000 } } |
| ℹ  Booking status → AWAITING_PAYMENT. ℹ  Sends WA payment prompt to family. |  |

| PATCH  /bookings/:id/decline   — Nurse declines a PENDING booking with an optional reason |  |
| --- | --- |
| Auth Required | Nurse (assigned) |
| Request Body | { "declineNote": "Jadwal saya sudah penuh pada tanggal tersebut." } |
| Response | HTTP 200 { "success": true, "data": { "id": "uuid", "status": "DECLINED" } } |
| ℹ  Sends WA notification to family user. |  |

| PATCH  /bookings/:id/cancel   — User cancels a booking — applicable for PENDING, CONFIRMED, or AWAITING_PAYMENT status |  |
| --- | --- |
| Auth Required | Family User (owner) |
| Request Body | { "reason": "Jadwal berubah." } |
| Response | HTTP 200 { "success": true, "data": { "id": "uuid", "status": "CANCELLED", "cancelledBy": "USER" } } |
| ℹ  Returns 422 if booking is already ACTIVE or COMPLETED (cannot cancel active session). ℹ  Triggers refund flow if payment was already made. |  |

# 6. Session & Monitoring Endpoints

| POST  /sessions/:sessionId/start   — Nurse marks the session as started — activates real-time monitoring dashboard for family |  |
| --- | --- |
| Auth Required | Nurse (assigned) |
| Response | HTTP 200 { "success": true, "data": { "id": "uuid", "status": "ACTIVE", "startedAt": "2026-03-25T09:05:00Z" } } |
| ℹ  Booking status → ACTIVE. ℹ  Family sees 'Sesi Aktif' banner on dashboard. |  |

| POST  /sessions/:sessionId/logs   — Nurse submits a health data entry during an active session — streamed to family dashboard |  |
| --- | --- |
| Auth Required | Nurse (assigned) |
| Request Body | { "metric": "BP_SYSTOLIC", "value": 120, "unit": "mmHg", "note": "Normal" } |
| Response | HTTP 201 { "success": true, "data": { "id": "uuid", "metric": "BP_SYSTOLIC", "value": "120.00", "unit": "mmHg", "recordedAt": "2026-03-25T09:22:00Z" } } |
| ℹ  Supported metrics: BP_SYSTOLIC, BP_DIASTOLIC, WEIGHT_KG, BLOOD_SUGAR, MOOD, TEMPERATURE, CUSTOM. ℹ  Family dashboard polling /sessions/:id/logs every 3 seconds to display real-time updates. |  |

| GET  /sessions/:sessionId/logs   — Get all health log entries for a session — used for polling real-time updates |  |
| --- | --- |
| Auth Required | Family User (owner) or Nurse |
| Response | // Query param: ?since=2026-03-25T09:20:00Z  (only return entries after this timestamp) HTTP 200 { "success": true, "data": [ { "id": "uuid", "metric": "BP_SYSTOLIC", "value": "120.00", "unit": "mmHg", "recordedAt": "2026-03-25T09:22:00Z", "note": "Normal" } ] } |
| ℹ  Use the ?since param to fetch only new entries since the last poll. |  |

| PATCH  /sessions/:sessionId/checklist/:entryId   — Mark a checklist item as completed and optionally add a note |  |
| --- | --- |
| Auth Required | Nurse (assigned) |
| Request Body | { "isCompleted": true, "note": "Gula darah 145 mg/dL — sedikit tinggi, disarankan kurangi gula." } |
| Response | HTTP 200 { "success": true, "data": { "id": "uuid", "isCompleted": true, "completedAt": "2026-03-25T10:05:00Z" } } |

| POST  /sessions/:sessionId/complete   — Nurse marks the session as complete — auto-generates SessionReport |  |
| --- | --- |
| Auth Required | Nurse (assigned) |
| Response | HTTP 200 { "success": true, "data": { "sessionId": "uuid", "status": "COMPLETED", "reportId": "uuid", "endedAt": "2026-03-25T11:30:00Z" } } |
| ℹ  Returns 422 if any mandatory checklist items are not marked isCompleted=true. ℹ  Auto-generates SessionReport record with all health logs and checklist data. ℹ  Sends completion notification to family via WA. |  |

| GET  /sessions/:sessionId/report   — Get the final session report after session is completed |  |
| --- | --- |
| Auth Required | Family User (owner) or Nurse |
| Response | HTTP 200 { "success": true, "data": { "id": "uuid", "sessionId": "uuid", "reportData": { "healthLogs": [...], "checklistEntries": [...] }, "aiSentiment": null, "aiSummary": null, "generatedAt": "2026-03-25T11:30:00Z" } } |
| ℹ  aiSentiment and aiSummary will be null until Sprint 6 AI analysis is implemented. |  |

# 7. Emergency Endpoint

| POST  /emergency/trigger   — Trigger the panic button — broadcasts WA to family, nurse, and admin simultaneously; logs event |  |
| --- | --- |
| Auth Required | Family User |
| Request Body | { "patientId": "uuid", "bookingId": "uuid" }   // bookingId optional if no active session |
| Response | HTTP 200 { "success": true, "data": { "emergencyId": "uuid", "familyWaSent": true, "nurseWaSent": true, "adminWaSent": true, "triggeredAt": "2026-03-25T10:00:00Z" } } |
| ℹ  Rate limited: max 3 triggers per user per 10-minute window. Returns 429 if exceeded. ℹ  WA message content: 'PARING DARURAT — [Patient Name] membutuhkan bantuan segera di [Address].' ℹ  If any WA broadcast fails, system logs the failure and retries once. Does not block the 200 response. ℹ  Admin is expected to call back within 2 minutes per SOP. |  |

| GET  /emergency/:emergencyId   — Get details of a specific emergency event including broadcast statuses and admin response |  |
| --- | --- |
| Auth Required | Admin |
| Response | HTTP 200 { "success": true, "data": { "id": "uuid", "triggeredAt": "2026-03-25T10:00:00Z", "familyWaSent": true, "nurseWaSent": true, "adminWaSent": true, "adminCallbackTime": "2026-03-25T10:01:45Z", "adminAction": "Menghubungi RS Mitra — ambulans dikirim.", "resolution": "ESCALATED", "resolvedAt": "2026-03-25T10:45:00Z" } } |
| ℹ  Admin-only endpoint — returns 403 for non-admin users. |  |

| PATCH  /emergency/:emergencyId/resolve   — Admin logs the resolution of an emergency event |  |
| --- | --- |
| Auth Required | Admin |
| Request Body | { "adminAction": "Menghubungi keluarga. Kondisi stabil.", "resolution": "RESOLVED" } |
| Response | HTTP 200 { "success": true, "data": { "id": "uuid", "resolution": "RESOLVED", "resolvedAt": "2026-03-25T10:20:00Z" } } |

# 8. Payment Endpoints

| POST  /payments/initiate   — Create a Midtrans Snap payment session for a booking in AWAITING_PAYMENT status |  |
| --- | --- |
| Auth Required | Family User (booking owner) |
| Request Body | { "bookingId": "uuid" } |
| Response | HTTP 201 { "success": true, "data": { "paymentId": "uuid", "snapToken": "<midtrans-snap-token>", "midtransOrderId": "PARING-uuid-20260325", "amount": 45000 } } |
| ℹ  The snapToken is used by the frontend to open the Midtrans Snap payment popup. ℹ  Order ID format: PARING-{bookingId}-{yyyymmdd} ℹ  Returns 409 if a payment is already initiated for this booking. |  |

| POST  /payments/webhook   — Midtrans calls this endpoint after a payment event — updates booking and payment status |  |
| --- | --- |
| Auth Required | Midtrans System |
| Request Body | // Midtrans webhook payload (auto-sent by Midtrans): { "order_id": "PARING-uuid-20260325", "transaction_status": "settlement", "transaction_id": "midtrans-tx-id", "gross_amount": "45000.00", "signature_key": "<hmac-sha512-signature>" } |
| Response | HTTP 200 { "success": true } |
| ℹ  Signature verified via HMAC-SHA512 before processing. Returns 401 if invalid. ℹ  On 'settlement' or 'capture': Booking status → PAID; Payment status → SUCCESS. ℹ  On 'expire' or 'cancel': Booking status → CANCELLED; Payment status → EXPIRED or FAILED. ℹ  Raw Midtrans payload stored in Payment.webhookPayload for audit. |  |

| GET  /payments/:bookingId   — Get payment record for a specific booking |  |
| --- | --- |
| Auth Required | Family User (owner) or Admin |
| Response | HTTP 200 { "success": true, "data": { "id": "uuid", "bookingId": "uuid", "amount": "45000.00", "status": "SUCCESS", "paymentMethod": "bank_transfer", "paidAt": "2026-03-25T09:45:00Z" } } |

# 9. Chat Endpoints

| GET  /bookings/:bookingId/chat   — Get all chat messages for a booking — ordered by sentAt ascending |  |
| --- | --- |
| Auth Required | Family User or Nurse (booking parties) |
| Response | // Query param: ?since=2026-03-25T09:00:00Z HTTP 200 { "success": true, "data": [ { "id": "uuid", "senderType": "USER", "message": "Apakah perawat bisa datang jam 9?", "isRead": true, "sentAt": "2026-03-25T08:00:00Z" } ] } |
| ℹ  Poll every 5 seconds with ?since param to get new messages during active chat. |  |

| POST  /bookings/:bookingId/chat   — Send a chat message in a booking |  |
| --- | --- |
| Auth Required | Family User or Nurse (booking parties) |
| Request Body | { "message": "Saya akan datang tepat waktu jam 09:00." } |
| Response | HTTP 201 { "success": true, "data": { "id": "uuid", "senderType": "NURSE", "message": "Saya akan datang tepat waktu jam 09:00.", "sentAt": "2026-03-25T08:05:00Z" } } |
| ℹ  Only the two parties of the booking (the family user and the assigned nurse) can send messages. ℹ  Returns 403 if a third party attempts to access this booking's chat. |  |

# 10. Admin Endpoints

All admin endpoints require role = ADMIN. Non-admin requests return HTTP 403.

| GET  /admin/nurses   — List all nurses including PENDING, VERIFIED, and REJECTED — with pagination |  |
| --- | --- |
| Auth Required | Admin |
| Response | // Query param: ?status=PENDING&page=1&limit=20 HTTP 200 { "success": true, "data": [ { "id": "uuid", "name": "Rina Wulandari", "verifiedStatus": "PENDING", "createdAt": "2026-03-20T14:00:00Z" } ], "meta": { "total": 3 } } |

| PATCH  /admin/nurses/:id/verify   — Approve or reject a nurse profile verification request |  |
| --- | --- |
| Auth Required | Admin |
| Request Body | { "action": "APPROVE" }   // or "REJECT" // Optional: { "action": "REJECT", "rejectNote": "Sertifikasi tidak valid." } |
| Response | HTTP 200 { "success": true, "data": { "id": "uuid", "verifiedStatus": "VERIFIED", "verifiedAt": "2026-03-25T10:00:00Z" } } |
| ℹ  On APPROVE: nurse immediately appears in public nurse search. ℹ  On REJECT: nurse receives WA notification with the reject reason. |  |

| GET  /admin/emergencies   — List all emergency events — filterable by resolution status |  |
| --- | --- |
| Auth Required | Admin |
| Response | // Query param: ?resolution=ESCALATED&page=1 HTTP 200 { "success": true, "data": [ { "id": "uuid", "triggeredAt": "...", "resolution": "ESCALATED", "adminCallbackTime": "..." } ] } |

| GET  /admin/bookings   — List all bookings across all users — for operational oversight |  |
| --- | --- |
| Auth Required | Admin |
| Response | // Query param: ?status=ACTIVE HTTP 200 { "success": true, "data": [ { "id": "uuid", "status": "ACTIVE", ... } ] } |

# 11. AI Endpoints (Sprint 6 — Fitur Lanjutan)

These endpoints are planned for Sprint 6. They require aiConsent = true on the Patient profile before processing. All data sent to the AI API is anonymized — no personal identifiers are included.

| POST  /ai/match   — Get AI-powered nurse recommendations based on a patient's health profile |  |
| --- | --- |
| Auth Required | Family User |
| Request Body | { "patientId": "uuid" } |
| Response | HTTP 200 { "success": true, "data": { "recommendations": [ { "nurseId": "uuid", "nurseName": "Siti Rahmawati", "matchScore": 94, "reason": "Spesialis diabetes dan lansia — cocok dengan kondisi pasien." }, { "nurseId": "uuid", "nurseName": "Dewi Anggraini",  "matchScore": 81, "reason": "Pengalaman lansia aktif, tersedia tanggal yang diminta." } ] } } |
| ℹ  Returns 422 if patient aiConsent = false. ℹ  Data anonymized: patient name, address, DOB stripped before sending to AI API. |  |

| POST  /ai/analyze/:sessionId   — Run AI analysis on a completed session's care report |  |
| --- | --- |
| Auth Required | Admin or System (auto-triggered post-session) |
| Response | HTTP 200 { "success": true, "data": { "sessionId": "uuid", "aiSentiment": "POSITIVE", "aiSummary": "Pasien dalam kondisi stabil. Tekanan darah terkontrol.", "aiHealthScore": 4, "analyzedAt": "2026-03-25T12:00:00Z" } } |
| ℹ  Requires patient aiConsent = true on the linked patient profile. ℹ  Only processes anonymized health metric data — no names, addresses, or personal identifiers. ℹ  Updates SessionReport with aiSentiment, aiSummary, aiHealthScore fields. |  |
