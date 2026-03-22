# PRODUCT REQUIREMENTS DOCUMENT

## PARING

## Homecare Lansia Platform

| Version | 1.0 — MVP |
| --- | --- |
| Date | March 2026 |
| Program | P2MW 2026 |
| Status | In Development |

"Homecare yang Anda Rancang, Perawatan yang Kami Jamin."

# 1. Product Overview

## 1.1 Product Summary

PARING is an innovative mobile and web platform designed to simplify, digitize, and optimize the end-to-end process of booking, monitoring, and reporting homecare services for elderly patients (lansia) in Indonesia. The platform connects verified professional nurses with families seeking reliable home-based eldercare — delivering transparency, safety, and peace of mind.

| Product Name | PARING — Homecare Lansia Platform |
| --- | --- |
| Product Type | Web Application (Next.js) + Mobile-Responsive |
| Version | 1.0 MVP |
| Program | P2MW 2026 |
| Owner / Team | PARING Team |
| Timeline | 12 Weeks / 6 Bi-Weekly Sprints (Mar 25 – May 23, 2026) |
| Tech Stack | Next.js (App Router), TypeScript, Tailwind CSS, PostgreSQL, Prisma ORM |
| Hosting | Vercel + Google Cloud Platform |

## 1.2 Vision & Mission

### Vision

To become the leading disruptor in Indonesia's eldercare homecare services by integrating modern technology with a personal human touch — ensuring every elderly patient receives premium care at home, backed by full transparency for their families.

### Mission

* Personalization: Provide an intelligent platform that matches elderly patient profiles and family preferences with verified nurse expertise.

* Transparency: Deliver a fully transparent care ecosystem through real-time monitoring and comprehensive digital reporting.

* Accessibility: Build a digital bridge that simplifies access to trained nurses, medical consultations, and flexible homecare options.

* Professional Empowerment: Equip nurses with digital tools for efficient work, standardized documentation (SDKI/SIKI/SLKI), and professional growth.

* Continuous Innovation: Develop cutting-edge features including AI integration and WhatsApp Bot for an ever-improving homecare experience.

## 1.3 Problem Statement

Families caring for elderly relatives in Indonesia face several critical pain points:

* Difficulty finding verified, qualified nurses for home visits or live-in care.

* Lack of transparency into what actually happens during a care visit.

* No standardized digital record of a patient's care history and health data.

* Emergency situations (falls, breathing difficulties) are handled without a fast, structured response system.

* Manual, fragmented booking processes with no integrated payment solution.

## 1.4 Target Audience

| User Type | Description | Key Needs |
| --- | --- | --- |
| Primary: Keluarga (Family/Wali) | Adult children or guardians managing care for an elderly relative | Easy booking, real-time monitoring, emergency alerts, transparent reporting |
| Secondary: Perawat (Nurses) | Verified professional caregivers offering home visit, live-out, or live-in services | Streamlined scheduling, digital care checklists, payment management |
| Tertiary: Admin PARING | Internal operations team managing nurse verification and emergency SOP | Dashboard to manage nurses, handle emergencies, oversee bookings |
| Tertiary: Lansia (Elderly Patient) | The direct recipient of care — typically 60+ years old | Safety, comfort, easy-to-use emergency button |

# 2. Scope of the Product

## 2.1 In Scope (MVP — 6 Sprints)

* System foundation: repository setup, database schema (User, Patient, Nurse), and SEO-friendly landing page.

* Authentication: Registration and login via email/password credentials.

* Profile management: Elderly patient profile (age, weight, location, health conditions like blood pressure and blood sugar).

* Nurse profile & discovery: Database of verified nurses with certifications, ratings, specializations, and scheduling.

* Booking system: Search, filter by service type (visit, live-in, live-out), view nurse schedule, select services, and confirm booking.

* Payment gateway: Integration with Midtrans for automated payment processing.

* Real-time monitoring dashboard: Caregivers update patient data (blood pressure, weight) in real-time; families view updates live.

* Digital daily checklist: Nurses fill out structured care logs during each visit.

* Panic / Emergency Button: One-click emergency alert broadcasted to family, nurse, and admin via WhatsApp Gateway, plus direct dial to local emergency numbers.

* Consultation chat: In-app messaging between family and nurse for pre-booking negotiation and during-visit communication.

* AI Recommendation (Fitur Lanjutan): Match nurse competencies to elderly patient condition using AI/algorithm logic.

* AI Analysis Report (Fitur Lanjutan): Auto-generate care summaries from nurse reports using AI sentiment and health parameter analysis.

* Admin dashboard: Manage and verify nurse profiles; standby for emergency SOP response.

* Bug fixing and production deployment.

## 2.2 Out of Scope (Future Iterations)

* Full prescription drug ordering and approval workflow.

* WhatsApp Bot for nurse-family chat integration.

* Full SDKI/SIKI/SLKI medical documentation module (planned post-MVP).

* Doctor referral / clinic partnership integration.

* Native iOS / Android mobile app (current scope: mobile-responsive web).

# 3. Feature Requirements

## 3.1 Feature List & Priority

| # | Feature | Sprint | Priority | Status | User Role |
| --- | --- | --- | --- | --- | --- |
| 1 | Landing Page (SEO-friendly, service & pricing info) | Sprint 1 | High | Not Started | Public |
| 2 | Manual Booking Form (WhatsApp redirect) | Sprint 1 | High | Not Started | Family |
| 3 | Registration & Login (Email/Password) | Sprint 2 | High | Not Started | All Users |
| 4 | Elderly Patient Profile (multi-patient per account) | Sprint 2 | High | Not Started | Family |
| 5 | Admin Dashboard (nurse verification) | Sprint 2 | High | Not Started | Admin |
| 6 | Nurse Discovery & Search (with filters) | Sprint 3 | High | Not Started | Family |
| 7 | Nurse Profile Page (SOP, competencies, schedule) | Sprint 3 | High | Not Started | Family |
| 8 | Service Booking & Scheduling | Sprint 3 | High | Not Started | Family / Nurse |
| 9 | Patient Monitoring Dashboard (real-time) | Sprint 4 | High | Not Started | Family |
| 10 | Nurse Daily Checklist (real-time log) | Sprint 4 | High | Not Started | Nurse |
| 11 | Mood Tracker & Health Parameters (visual graph) | Sprint 4 | Medium | Not Started | Family |
| 12 | Emergency / Panic Button | Sprint 4 | High | Not Started | Family / Lansia |
| 13 | Consultation Chat (in-app, pre-booking) | Sprint 5 | Medium | Not Started | Family / Nurse |
| 14 | Payment Gateway (Midtrans) | Sprint 5 | High | Not Started | Family |
| 15 | AI Nurse Matching (Fitur Lanjutan) | Sprint 6 | Low | Not Started | Family |
| 16 | AI Care Report Analysis (Fitur Lanjutan) | Sprint 6 | Low | Not Started | Family / Admin |
| 17 | Bug Fixing & Production Deployment | Sprint 6 | High | Not Started | All |

## 3.2 Feature Specifications

### F-01: Landing Page

A publicly accessible, SEO-optimized landing page built with Next.js App Router. It communicates PARING's value proposition, service packages, and pricing to prospective users and P2MW evaluators.

* Must include: Service overview, pricing packages, nurse partnership section, CTA for booking/registration.

* Manual booking form that redirects users to WhatsApp admin for guided first orders.

* Responsive design using Tailwind CSS.

### F-02: Authentication & Profile Management

User registration and login using email and password credentials. Supports multi-role access (Family, Nurse, Admin). Profile includes elderly patient data entry: age, weight, location, and health conditions.

* One family account can hold multiple elderly patient profiles.

* Nurse profile includes: certifications, rating, specialization (e.g., bedridden care), and schedule availability.

* WhatsApp OTP integration planned for enhanced authentication security.

### F-03: Nurse Discovery & Booking

Family users can browse a verified nurse database, view schedules, and place a detailed service order.

* Filter by: service type (visit, live-out, live-in), availability, specialization.

* Booking form includes: service items (blood pressure check, weight check, etc.) and custom concern notes.

* Nurse confirms booking, provides itemized pricing, and the user pays via payment gateway.

* Pilot phase (Sprint 3): First 10 customers guided semi-manually by PARING operations team.

### F-04: Real-Time Monitoring Dashboard

Families can monitor care sessions as they happen. Nurses update patient health data in real-time through the app.

* Displays live updates of health parameters (blood pressure, blood sugar, weight, etc.).

* All data is stored in the patient's profile for future reference and nurse handover.

* Includes a mood tracker and basic health parameter visualization (graphical display).

### F-05: Nurse Daily Checklist

Structured digital care log filled out by nurses during each visit. Replaces paper-based or informal documentation.

* Checklist items match ordered services (e.g., blood pressure result, diabetes observation notes).

* Nurses can add freeform notes for special conditions.

* Structured to align with medical standards: SDKI, SIKI, SLKI (full implementation in post-MVP).

### F-06: Emergency / Panic Button

A prominent, one-click emergency alert button accessible by family members or the elderly patient during critical situations (falls, difficulty breathing, etc.).

* One-Click Alert: Pressing the Darurat button triggers an immediate background process.

* Auto-Broadcast via WhatsApp Gateway: Simultaneously sends an emergency message (patient name, location, alert) to: family/guardian, the assigned nurse, and PARING admin.

* Direct Dial Pop-up: After pressing, a pop-up appears with quick-dial options for local emergency numbers (e.g., 119, nearest partner hospital/clinic).

* Admin SOP: PARING admin must call back within 2 minutes to confirm the situation and coordinate assistance if the family is in panic.

### F-07: Consultation Chat

In-app messaging for pre-booking consultations between family and nurse. Allows detailed discussion of care needs, conditions, and pricing negotiation before payment.

* Optional down-payment (DP) model being evaluated for the consultation phase.

* Post-booking: In-app chat continues during the care session for real-time communication.

### F-08: Payment Gateway (Midtrans)

Integrated automated payment processing for service booking fees. Replaces manual bank transfers or cash-based transactions.

* Supported payment types to be confirmed (e.g., credit/debit cards, bank transfer, e-wallet via Midtrans).

* Users receive payment confirmation before care session begins.

* Cancellation option is available before payment.

### F-09: AI Nurse Matching (Fitur Lanjutan — Sprint 6)

An intelligent recommendation engine that matches elderly patient profiles and health conditions to the most suitable verified nurse.

* Uses matching algorithm or lightweight AI API to process patient condition data against nurse competencies.

* Results displayed as recommended nurse list with explanation of match rationale.

### F-10: AI Care Report Analysis (Fitur Lanjutan — Sprint 6)

Automated processing of nurse care reports into concise, structured summaries for families and admins.

* For non-medical reports: AI performs sentiment analysis on nurse-described patient condition, then quantifies parameters (mood, health level) into a standardized scale.

* Output serves as a longitudinal health trend indicator stored in the patient's profile.

* Requires: Informed Consent from the user and data anonymization before AI processing.

# 4. Core User Flows

## 4.1 Primary Flow: First-Time Booking (Family User)

| Step | Action | System Response |
| --- | --- | --- |
| 1 | User registers and logs in (Email/Password) | Account created; session token issued |
| 2 | User creates elderly patient profile (age, location, conditions) | Patient profile saved to database |
| 3 | User browses nurse list with filters (service type, availability) | Filtered nurse cards displayed |
| 4 | User selects a nurse and views schedule | Nurse profile page with availability calendar shown |
| 5 | User places a booking with itemized service selection and concern notes | Booking sent to nurse for confirmation |
| 6 | Nurse confirms and provides final price | User receives price confirmation notification |
| 7 | User pays via Midtrans Payment Gateway | Payment confirmed; care session scheduled |
| 8 | Nurse arrives and begins care; fills digital checklist in real-time | Health data streamed to Family's monitoring dashboard |
| 9 | User monitors session via dashboard; chats with nurse if needed | Live data updates; chat messages delivered |
| 10 | Session ends; full report generated and stored in patient profile | Report accessible in care history; data saved to patient profile |

## 4.2 Emergency Flow: Panic Button Trigger

| Step | Action | System Response |
| --- | --- | --- |
| 1 | User presses the red Darurat (Emergency) button on the app | System triggers background emergency process immediately |
| 2 | System auto-broadcasts WA message (patient name + location + alert) | Message delivered to: family, assigned nurse, and PARING admin via WhatsApp Gateway |
| 3 | Pop-up appears on user screen with quick-dial emergency numbers | User taps one number and initiates direct call (119 or nearest clinic partner) |
| 4 | Admin receives WA notification and activates Emergency SOP | Admin calls back within 2 minutes; coordinates hospital/clinic contact if needed |

# 5. Technical Requirements

## 5.1 Tech Stack

| Frontend / Fullstack | Next.js (App Router) with TypeScript — enables SEO-friendly Landing Page and interactive dashboard in one codebase |
| --- | --- |
| Styling | Tailwind CSS for rapid, responsive UI development |
| Database | PostgreSQL with Prisma ORM (type-safe schema management) |
| Database Schemas | User (Family/Wali), Patient (Lansia), Nurse (Perawat) |
| Authentication | Email & Password (default credentials); WhatsApp OTP via API Gateway (planned) |
| Notifications | WhatsApp API Gateway — OTP, schedule reminders, emergency broadcasts |
| Payment | Midtrans Payment Gateway — automated booking payment |
| Hosting | Vercel (Next.js deployment) + Google Cloud Platform |
| AI Integration | Lightweight AI API or custom matching algorithm (Sprint 6) |

## 5.2 Third-Party Integrations

| Service | Provider | Purpose |
| --- | --- | --- |
| WhatsApp Gateway | WA API Gateway (e.g., Fonnte / Wablas) | OTP, schedule reminders, emergency broadcasts |
| Payment Gateway | Midtrans | Automated service payment processing |
| Hosting / Deployment | Vercel + Google Cloud Platform | Next.js app deployment and cloud infrastructure |
| AI / Recommendation | Lightweight AI API (TBD) or custom algorithm | Nurse-patient matching and care report analysis |

## 5.3 Non-Functional Requirements

* Performance: Dashboard real-time updates must reflect within 3 seconds of nurse data entry.

* Availability: System uptime target of 99.5% during active care hours.

* Security: All user data stored with encryption at rest; HTTPS enforced across all endpoints.

* Data Privacy: User data anonymized before AI processing; Informed Consent required for AI features.

* Scalability: Database schema and architecture designed to handle multi-patient profiles and growing nurse database.

* Accessibility: UI must be simple and readable for elderly-adjacent users; large tap targets for emergency button.

# 6. Development Plan & Timeline

## 6.1 Sprint Overview (6 Bi-Weekly Sprints)

| Sprint | Name & Focus | Key Deliverables | Due Date | Priority |
| --- | --- | --- | --- | --- |
| Sprint 1 | Fondasi Sistem & Landing Page | Repository setup, DB schema, Landing Page, Manual booking form | Mar 25, 2026 | HIGH |
| Sprint 2 | Autentikasi & Manajemen Profil | Registration/login, Elderly patient profile, Admin dashboard (nurse management) | Apr 11, 2026 | HIGH |
| Sprint 3 | Pemesanan & Daftar Perawat | Nurse search/filter, Nurse detail page, Booking system, Pilot with first 10 customers | Apr 25, 2026 | HIGH |
| Sprint 4 | Fitur Monitoring & Laporan Digital | Real-time monitoring dashboard, Daily checklist, Mood tracker, Panic Button | Apr 11, 2026 | HIGH |
| Sprint 5 | Konsultasi & Payment Gateway | In-app consultation chat, Midtrans payment integration | May 9, 2026 | MEDIUM |
| Sprint 6 | Integrasi AI & Finalisasi Rilis | AI nurse matching, AI report analysis, Bug fixing, Production deployment | May 23, 2026 | MEDIUM |

## 6.2 Completed Tasks (as of March 2026)

* Repository initialization: Next.js, Tailwind CSS, TypeScript, Prisma — DONE (Mar 12, 2026)

* Prisma database schema design (User, Patient, Nurse entities) — DONE (Mar 12, 2026)

# 7. Constraints & Risks

## 7.1 Constraints

* Timeline: Fixed 12-week P2MW program deadline; all MVP features must be delivered by May 23, 2026.

* Team Size: Student development team; complex features must be scoped to what is realistically achievable.

* Budget: Infrastructure costs limited to Vercel free tier and Google Cloud starter plan where possible.

* Regulatory: Medical data handling must comply with applicable Indonesian health data regulations; AI features require Informed Consent mechanisms.

## 7.2 Risk Register

| Risk | Likelihood | Impact | Mitigation Strategy |
| --- | --- | --- | --- |
| Midtrans integration delays | Medium | High | Begin integration in Sprint 3 sandbox; use manual WhatsApp payment as fallback during pilot |
| WhatsApp Gateway API rate limits or downtime | Medium | High | Test gateway early (Sprint 1); have fallback SMS or email notification as backup |
| AI feature complexity exceeds timeline | High | Medium | AI features are scoped as Fitur Lanjutan in Sprint 6 and are non-blocking for core MVP; can be deferred post-P2MW |
| Real-time data sync latency > 3 seconds | Low | Medium | Use Prisma streaming or polling strategy; optimize queries early in Sprint 4 |
| Nurse verification backlog slowing Sprint 3 pilot | Medium | Medium | Pre-onboard 5–10 nurses manually before Sprint 3; admin dashboard ready in Sprint 2 |
| User data privacy non-compliance for AI features | Low | High | Build Informed Consent flow and data anonymization before Sprint 6 AI integration |

# 8. Success Metrics

## 8.1 MVP Success Criteria

The following metrics define a successful MVP launch within the P2MW program timeframe:

| Metric | Target |
| --- | --- |
| First-time customer bookings (pilot) | ≥ 10 bookings completed during Sprint 3 pilot |
| End-to-end booking flow functional | User can book, pay, and receive care within the app |
| Real-time monitoring active | Health data updates visible to family within 3 seconds |
| Emergency button response time (admin) | Admin calls back within 2 minutes of panic button trigger |
| Nurse checklist completion rate | ≥ 90% of care sessions include a completed digital checklist |
| Payment success rate | ≥ 95% of payment attempts succeed via Midtrans |
| Production deployment | App live on Vercel + GCP by Sprint 6 deadline (May 23, 2026) |

# 9. Open Questions & Decisions Pending

| # | Open Question | Decision Owner |
| --- | --- | --- |
| 1 | Will pre-booking consultation require a Down Payment (DP)? If so, what is the DP model and flow? | PM + Business Lead |
| 2 | How does prescription drug ordering work? Does the nurse order, or does the family approve first? | PM + Medical Advisor (Dzakwan) |
| 3 | Which WhatsApp API Gateway provider will be used (Fonnte, Wablas, etc.)? | Tech Lead |
| 4 | Full SDKI/SIKI/SLKI documentation standard — which sprint does implementation begin? | PM + Medical Advisor |
| 5 | Can doctors partner with PARING to recommend the platform to patients? What is the referral model? | Business Lead |
| 6 | What specific AI API or algorithm will power the nurse-matching feature in Sprint 6? | Tech Lead |
| 7 | What are the exact local emergency numbers (clinics/hospitals) to include in the Panic Button direct dial? | Operations Lead |

## Appendix: Glossary

| Term | Definition |
| --- | --- |
| Lansia | Lanjut Usia — Indonesian term for elderly person (typically 60+ years) |
| Perawat | Nurse / professional caregiver in the PARING platform context |
| Keluarga / Wali | Family member or guardian who manages care and monitoring for the elderly patient |
| SDKI/SIKI/SLKI | Indonesian nursing care standard documentation framework (diagnosis, intervention, outcome) |
| P2MW | Program Pembinaan Mahasiswa Wirausaha — Indonesian student entrepreneurship development program |
| Fitur Lanjutan | Advanced features planned for Sprint 6 and beyond — non-blocking for core MVP |
| PRD | Product Requirements Document — this document |
| WA Gateway | WhatsApp API Gateway service used for automated messaging and notifications |
