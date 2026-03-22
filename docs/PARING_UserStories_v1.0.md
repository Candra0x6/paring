# USER STORIES & ACCEPTANCE CRITERIA

## PARING

## Homecare Lansia Platform

| Document | User Stories — Document #2 |
| --- | --- |
| Version | 1.0 — MVP |
| Total Stories | 24 User Stories across 7 Epics |
| Date | March 2026  \|  P2MW Program |

# Introduction

This document contains all User Stories and their associated Acceptance Criteria for the PARING Homecare Lansia Platform MVP. Each story follows the standard format: As a [role], I want to [action], so that [benefit]. Stories are grouped by Epic and tagged with priority, sprint, and story points.

## Epic Overview

| Epic ID | Epic Name | Description | Sprint(s) |
| --- | --- | --- | --- |
| EP-01 | System Foundation & Landing | Repository setup, database, public landing page | Sprint 1 |
| EP-02 | Authentication & Profile Mgmt | Registration, login, elderly & nurse profile management | Sprint 2 |
| EP-03 | Nurse Discovery & Booking | Nurse search, filter, schedule, and service booking | Sprint 3 |
| EP-04 | Real-Time Monitoring & Reporting | Live health data dashboard, daily checklists, care reports | Sprint 4 |
| EP-05 | Emergency Safety System | Panic button, auto-broadcast alerts, admin SOP response | Sprint 4 |
| EP-06 | Consultation & Payment | Pre-booking chat, service payment via Midtrans | Sprint 5 |
| EP-07 | AI Integration & Finalization | AI nurse matching, AI report analysis, deployment | Sprint 6 |

## Priority Legend

| Must Have | Should Have | Could Have | Won't Have (MVP) |
| --- | --- | --- | --- |
| Critical for MVP. Cannot ship without it. | High value; strong effort to include. | Nice-to-have; include if capacity allows. | Explicitly deferred to post-MVP. |

# Epic EP-01: System Foundation & Landing Page

| US-01  EPIC: EP-01 — System Foundation & Landing Page |  |  |  |
| --- | --- | --- | --- |
| As a prospective customer (family of an elderly patient), I want to visit a clear and informative landing page about PARING's services and pricing, so that I can quickly decide whether PARING is the right service for my family before registering. |  |  |  |
| Priority Must Have | Sprint Sprint 1 | Story Points 5 pts | Status Not Started |
| Acceptance Criteria |  |  |  |
| ✓  AC-1: Landing page loads in under 3 seconds on a standard mobile connection. |  |  |  |
| ✓  AC-2: Page clearly displays at least 3 service packages with descriptions and indicative pricing. |  |  |  |
| ✓  AC-3: A visible Call-To-Action (CTA) button for registration or WhatsApp consultation is present above the fold. |  |  |  |
| ✓  AC-4: Page is mobile-responsive and displays correctly on screens 375px wide and above. |  |  |  |
| ✓  AC-5: Page passes basic SEO metadata checks (title, description, og:image tags present). |  |  |  |

| US-02  EPIC: EP-01 — System Foundation & Landing Page |  |  |  |
| --- | --- | --- | --- |
| As a prospective customer, I want to submit a manual service inquiry form that connects me to the PARING admin via WhatsApp, so that I can start the booking process immediately even before the full booking system is ready. |  |  |  |
| Priority Must Have | Sprint Sprint 1 | Story Points 3 pts | Status Not Started |
| Acceptance Criteria |  |  |  |
| ✓  AC-1: A booking inquiry form is visible on the landing page with fields: name, phone number, patient name, and service interest. |  |  |  |
| ✓  AC-2: On form submission, the system auto-opens WhatsApp with a pre-filled message to the PARING admin number. |  |  |  |
| ✓  AC-3: Form validates that name and phone number fields are not empty before submission. |  |  |  |
| ✓  AC-4: A confirmation message ('We will contact you shortly!') appears after submission. |  |  |  |

# Epic EP-02: Authentication & Profile Management

| US-03  EPIC: EP-02 — Authentication & Profile Management |  |  |  |
| --- | --- | --- | --- |
| As a new family user, I want to register for a PARING account using my email and a password, so that I can securely access the platform and manage care for my elderly family member. |  |  |  |
| Priority Must Have | Sprint Sprint 2 | Story Points 5 pts | Status Not Started |
| Acceptance Criteria |  |  |  |
| ✓  AC-1: Registration form includes: full name, email, phone number, and password (with confirmation field). |  |  |  |
| ✓  AC-2: Password must be at least 8 characters; system shows a clear error if requirements are not met. |  |  |  |
| ✓  AC-3: System rejects duplicate email addresses with a clear error message. |  |  |  |
| ✓  AC-4: On successful registration, user is automatically logged in and redirected to the dashboard. |  |  |  |
| ✓  AC-5: A welcome notification is sent (email or WhatsApp) confirming account creation. |  |  |  |

| US-04  EPIC: EP-02 — Authentication & Profile Management |  |  |  |
| --- | --- | --- | --- |
| As a registered family user, I want to log in using my email and password, so that I can access my dashboard, patient profiles, and booking history securely. |  |  |  |
| Priority Must Have | Sprint Sprint 2 | Story Points 3 pts | Status Not Started |
| Acceptance Criteria |  |  |  |
| ✓  AC-1: Login form accepts email and password. |  |  |  |
| ✓  AC-2: Failed login (wrong password or unregistered email) shows a specific error: 'Invalid email or password.' |  |  |  |
| ✓  AC-3: After 5 consecutive failed login attempts, the account is temporarily locked for 15 minutes. |  |  |  |
| ✓  AC-4: A 'Forgot Password' link is visible and functional. |  |  |  |
| ✓  AC-5: Successful login redirects to the main dashboard. |  |  |  |

| US-05  EPIC: EP-02 — Authentication & Profile Management |  |  |  |
| --- | --- | --- | --- |
| As a family user, I want to create and manage one or more elderly patient profiles within my account, so that I can track and manage care for multiple family members from a single account. |  |  |  |
| Priority Must Have | Sprint Sprint 2 | Story Points 8 pts | Status Not Started |
| Acceptance Criteria |  |  |  |
| ✓  AC-1: User can create a new elderly patient profile with fields: name, age, weight, height, address, and health conditions (blood pressure, blood sugar, mobility status). |  |  |  |
| ✓  AC-2: A single account can hold a minimum of 3 patient profiles. |  |  |  |
| ✓  AC-3: User can edit an existing patient profile at any time. |  |  |  |
| ✓  AC-4: User can deactivate (soft-delete) a patient profile without losing care history. |  |  |  |
| ✓  AC-5: Patient profile clearly shows 'bedridden' flag if that option is selected, to filter compatible nurses. |  |  |  |

| US-06  EPIC: EP-02 — Authentication & Profile Management |  |  |  |
| --- | --- | --- | --- |
| As a PARING admin, I want to manage and verify nurse profiles through an admin dashboard, so that I can ensure only qualified and vetted nurses are visible to families on the platform. |  |  |  |
| Priority Must Have | Sprint Sprint 2 | Story Points 8 pts | Status Not Started |
| Acceptance Criteria |  |  |  |
| ✓  AC-1: Admin can view a list of all pending nurse registrations. |  |  |  |
| ✓  AC-2: Admin can approve or reject a nurse profile with a status change and optional rejection note. |  |  |  |
| ✓  AC-3: Admin can upload or attach nurse certification documents to a nurse profile. |  |  |  |
| ✓  AC-4: Admin can update a nurse's rating and view the nurse's booking history. |  |  |  |
| ✓  AC-5: Only 'Verified' nurses appear in the public nurse search results. |  |  |  |

# Epic EP-03: Nurse Discovery & Booking

| US-07  EPIC: EP-03 — Nurse Discovery & Booking |  |  |  |
| --- | --- | --- | --- |
| As a family user, I want to search and filter available nurses by service type, location, and availability, so that I can efficiently find the right nurse for my elderly family member's specific needs. |  |  |  |
| Priority Must Have | Sprint Sprint 3 | Story Points 8 pts | Status Not Started |
| Acceptance Criteria |  |  |  |
| ✓  AC-1: Nurse search page displays verified nurses as browsable cards with name, photo, rating, and specialization tags. |  |  |  |
| ✓  AC-2: User can filter nurses by: service type (visit / live-out / live-in), availability date, and specialization (e.g., bedridden care). |  |  |  |
| ✓  AC-3: Search results update dynamically when filters are changed without full page reload. |  |  |  |
| ✓  AC-4: If no nurses match the filter criteria, a clear 'No nurses available' message is shown with a suggestion to adjust filters. |  |  |  |

| US-08  EPIC: EP-03 — Nurse Discovery & Booking |  |  |  |
| --- | --- | --- | --- |
| As a family user, I want to view a nurse's complete profile including qualifications, schedule, and service competencies, so that I can make an informed decision before committing to a booking. |  |  |  |
| Priority Must Have | Sprint Sprint 3 | Story Points 5 pts | Status Not Started |
| Acceptance Criteria |  |  |  |
| ✓  AC-1: Nurse profile page shows: photo, full name, certifications, star rating, number of completed sessions, specializations, and SOP competency list. |  |  |  |
| ✓  AC-2: An interactive schedule calendar shows available and booked dates. |  |  |  |
| ✓  AC-3: A list of services this nurse can provide is displayed with corresponding price ranges. |  |  |  |
| ✓  AC-4: User can initiate a booking directly from the nurse profile page. |  |  |  |

| US-09  EPIC: EP-03 — Nurse Discovery & Booking |  |  |  |
| --- | --- | --- | --- |
| As a family user, I want to book a nurse for a specific date and service configuration, so that I can schedule the exact care my elderly family member needs. |  |  |  |
| Priority Must Have | Sprint Sprint 3 | Story Points 13 pts | Status Not Started |
| Acceptance Criteria |  |  |  |
| ✓  AC-1: Booking form includes: patient profile selector, date/time selection, service type, and specific service items (e.g., blood pressure check, diabetes screening). |  |  |  |
| ✓  AC-2: User can add a custom 'concern note' (free text) to describe special requirements. |  |  |  |
| ✓  AC-3: For bedridden patients, the form only allows booking nurses with the bedridden care specialization. |  |  |  |
| ✓  AC-4: User receives an on-screen confirmation that the booking request was sent to the nurse. |  |  |  |
| ✓  AC-5: Nurse receives an in-app and WhatsApp notification of the new booking request. |  |  |  |

| US-10  EPIC: EP-03 — Nurse Discovery & Booking |  |  |  |
| --- | --- | --- | --- |
| As a nurse, I want to confirm or decline a booking request and submit the final service price, so that I can manage my schedule and ensure the pricing reflects the agreed service items. |  |  |  |
| Priority Must Have | Sprint Sprint 3 | Story Points 8 pts | Status Not Started |
| Acceptance Criteria |  |  |  |
| ✓  AC-1: Nurse receives a booking request in their dashboard with: patient profile summary, requested services, date/time, and concern notes. |  |  |  |
| ✓  AC-2: Nurse can confirm with a final price (itemized per service) or decline with a reason. |  |  |  |
| ✓  AC-3: Family user receives a notification with the nurse's confirmed price. |  |  |  |
| ✓  AC-4: Family user has the option to accept the price (proceed to payment) or cancel the booking. |  |  |  |

# Epic EP-04: Real-Time Monitoring & Reporting

| US-11  EPIC: EP-04 — Monitoring & Reporting |  |  |  |
| --- | --- | --- | --- |
| As a family user, I want to view a real-time monitoring dashboard during an active care session, so that I can stay informed about my elderly family member's health status without being physically present. |  |  |  |
| Priority Must Have | Sprint Sprint 4 | Story Points 13 pts | Status Not Started |
| Acceptance Criteria |  |  |  |
| ✓  AC-1: Dashboard displays live health parameters entered by the nurse: blood pressure, weight, blood sugar, and any additional recorded metrics. |  |  |  |
| ✓  AC-2: Data updates on the dashboard within 3 seconds of the nurse saving an entry. |  |  |  |
| ✓  AC-3: Each data point is time-stamped with the nurse's name. |  |  |  |
| ✓  AC-4: If no data has been entered yet, the dashboard shows 'Session in progress — awaiting first update' instead of empty/broken state. |  |  |  |

| US-12  EPIC: EP-04 — Monitoring & Reporting |  |  |  |
| --- | --- | --- | --- |
| As a nurse, I want to fill out a structured digital care checklist during a visit, so that I can document my patient's condition accurately in real time, replacing paper logs. |  |  |  |
| Priority Must Have | Sprint Sprint 4 | Story Points 8 pts | Status Not Started |
| Acceptance Criteria |  |  |  |
| ✓  AC-1: Checklist is pre-populated with the services ordered in the booking (e.g., blood pressure item appears if it was ordered). |  |  |  |
| ✓  AC-2: Nurse can enter numeric health values (blood pressure: systolic/diastolic, weight in kg, blood sugar in mg/dL). |  |  |  |
| ✓  AC-3: Nurse can add a free-text note for any checklist item. |  |  |  |
| ✓  AC-4: Data submitted by the nurse is immediately reflected in the family's monitoring dashboard. |  |  |  |
| ✓  AC-5: Nurse cannot submit the checklist without completing all mandatory service items from the booking. |  |  |  |

| US-13  EPIC: EP-04 — Monitoring & Reporting |  |  |  |
| --- | --- | --- | --- |
| As a family user, I want to view a mood tracker graph and health parameter trends for my elderly family member, so that I can understand long-term patterns in my family member's health and emotional wellbeing. |  |  |  |
| Priority Should Have | Sprint Sprint 4 | Story Points 5 pts | Status Not Started |
| Acceptance Criteria |  |  |  |
| ✓  AC-1: Dashboard includes a graphical visualization (line chart) showing at least the last 5 sessions of key health parameters. |  |  |  |
| ✓  AC-2: Mood tracker displays a 5-scale icon-based score (1=Distressed to 5=Excellent) entered by the nurse. |  |  |  |
| ✓  AC-3: Charts are labeled with dates and include a legend. |  |  |  |

| US-14  EPIC: EP-04 — Monitoring & Reporting |  |  |  |
| --- | --- | --- | --- |
| As a family user, I want to receive and review a full care report after each completed session, so that I have a permanent record of what was done during the visit and my family member's condition. |  |  |  |
| Priority Must Have | Sprint Sprint 4 | Story Points 5 pts | Status Not Started |
| Acceptance Criteria |  |  |  |
| ✓  AC-1: A session report is auto-generated when the nurse marks the session as complete. |  |  |  |
| ✓  AC-2: Report includes: session date/time, nurse name, all completed checklist items and their recorded values, and any nurse notes. |  |  |  |
| ✓  AC-3: Report is permanently stored in the associated elderly patient profile. |  |  |  |
| ✓  AC-4: Family can access all historical reports from the patient profile page. |  |  |  |

# Epic EP-05: Emergency Safety System

| US-15  EPIC: EP-05 — Emergency Safety System |  |  |  |
| --- | --- | --- | --- |
| As a family user or elderly patient, I want to press a prominent Emergency (Darurat) button in the app to trigger an instant alert, so that help can be mobilized as fast as possible during a crisis without navigating complex menus. |  |  |  |
| Priority Must Have | Sprint Sprint 4 | Story Points 8 pts | Status Not Started |
| Acceptance Criteria |  |  |  |
| ✓  AC-1: The Emergency button is visible on the home/dashboard screen — large (minimum 80x80px tap target), red in color, and labeled clearly 'DARURAT'. |  |  |  |
| ✓  AC-2: Pressing the button does not require any additional confirmation dialogs — it triggers immediately. |  |  |  |
| ✓  AC-3: The button is accessible within 1 tap from the main dashboard at all times during a session. |  |  |  |
| ✓  AC-4: A brief visual confirmation (screen flash or 'Alert Sent!' banner) appears after pressing. |  |  |  |

| US-16  EPIC: EP-05 — Emergency Safety System |  |  |  |
| --- | --- | --- | --- |
| As a system (on behalf of user), I want to automatically send an emergency broadcast via WhatsApp to the family contact, assigned nurse, and PARING admin, so that all relevant parties are notified simultaneously without any manual effort from the distressed user. |  |  |  |
| Priority Must Have | Sprint Sprint 4 | Story Points 8 pts | Status Not Started |
| Acceptance Criteria |  |  |  |
| ✓  AC-1: On panic button press, a WhatsApp message is sent within 10 seconds to all 3 recipients: family contact, assigned nurse, and PARING admin. |  |  |  |
| ✓  AC-2: WhatsApp message includes: Patient name, registered home address, and the text 'KONDISI DARURAT — SEGERA DIHUBUNGI'. |  |  |  |
| ✓  AC-3: System logs the timestamp and delivery status of each broadcast for admin reference. |  |  |  |
| ✓  AC-4: If WhatsApp delivery fails, system triggers an in-app push notification as fallback. |  |  |  |

| US-17  EPIC: EP-05 — Emergency Safety System |  |  |  |
| --- | --- | --- | --- |
| As a family user or elderly patient, I want to see a pop-up with quick-dial emergency numbers immediately after pressing the panic button, so that I can call for help (ambulance/hospital) with one more tap, even if I am panicking. |  |  |  |
| Priority Must Have | Sprint Sprint 4 | Story Points 5 pts | Status Not Started |
| Acceptance Criteria |  |  |  |
| ✓  AC-1: After the panic button is pressed, a pop-up appears within 2 seconds showing at least: 119 (national emergency), and the nearest PARING partner clinic/hospital number. |  |  |  |
| ✓  AC-2: Each number in the pop-up is a tappable link that initiates a direct phone call. |  |  |  |
| ✓  AC-3: The pop-up can be dismissed; user is not forced to call. |  |  |  |

| US-18  EPIC: EP-05 — Emergency Safety System |  |  |  |
| --- | --- | --- | --- |
| As a PARING admin, I want to receive an instant WhatsApp notification and follow an SOP for responding to emergency alerts, so that I can coordinate emergency assistance for the patient within 2 minutes of the alert being triggered. |  |  |  |
| Priority Must Have | Sprint Sprint 4 | Story Points 3 pts | Status Not Started |
| Acceptance Criteria |  |  |  |
| ✓  AC-1: Admin WhatsApp receives the emergency message with patient details. |  |  |  |
| ✓  AC-2: Internal SOP document is linked or accessible from the admin dashboard. |  |  |  |
| ✓  AC-3: Admin is required to log the emergency response (call-back time, action taken) in the admin panel. |  |  |  |
| ✓  AC-4: Response time target: admin calls back within 2 minutes. System logs the actual response time for performance review. |  |  |  |

# Epic EP-06: Consultation & Payment

| US-19  EPIC: EP-06 — Consultation & Payment |  |  |  |
| --- | --- | --- | --- |
| As a family user, I want to send a chat message to a selected nurse before confirming my booking, so that I can clarify care requirements, ask questions, and agree on scope before committing to payment. |  |  |  |
| Priority Should Have | Sprint Sprint 5 | Story Points 8 pts | Status Not Started |
| Acceptance Criteria |  |  |  |
| ✓  AC-1: A 'Consult Nurse' option is accessible from the nurse's profile page. |  |  |  |
| ✓  AC-2: Chat interface shows nurse avatar, name, and online/offline status. |  |  |  |
| ✓  AC-3: Messages are delivered in real-time (under 5-second latency for online users). |  |  |  |
| ✓  AC-4: Chat history is preserved and accessible from the booking history view. |  |  |  |

| US-20  EPIC: EP-06 — Consultation & Payment |  |  |  |
| --- | --- | --- | --- |
| As a family user, I want to pay for a confirmed booking securely using the Midtrans payment gateway, so that the transaction is processed automatically without needing manual bank transfers or cash. |  |  |  |
| Priority Must Have | Sprint Sprint 5 | Story Points 13 pts | Status Not Started |
| Acceptance Criteria |  |  |  |
| ✓  AC-1: Payment page clearly shows: nurse name, session date, itemized services, and total amount due. |  |  |  |
| ✓  AC-2: User can select from available Midtrans payment methods (bank transfer, e-wallet, credit card). |  |  |  |
| ✓  AC-3: On successful payment, booking status changes to 'Confirmed' and both nurse and family receive a WhatsApp confirmation. |  |  |  |
| ✓  AC-4: On failed payment, system shows a clear error and allows retry without re-entering booking details. |  |  |  |
| ✓  AC-5: A payment receipt is stored in the user's account and accessible from booking history. |  |  |  |

| US-21  EPIC: EP-06 — Consultation & Payment |  |  |  |
| --- | --- | --- | --- |
| As a family user, I want to cancel a booking and receive a refund according to the cancellation policy, so that I am not financially penalized for cancellations made within a reasonable window. |  |  |  |
| Priority Should Have | Sprint Sprint 5 | Story Points 5 pts | Status Not Started |
| Acceptance Criteria |  |  |  |
| ✓  AC-1: User can cancel a booking from the booking detail page if the session has not yet started. |  |  |  |
| ✓  AC-2: Cancellation policy is clearly displayed (e.g., full refund if cancelled more than 24 hours before session). |  |  |  |
| ✓  AC-3: On cancellation, nurse is notified via WhatsApp and in-app notification. |  |  |  |
| ✓  AC-4: Refund status is displayed in the user's payment history. |  |  |  |

# Epic EP-07: AI Integration & Finalization

| US-22  EPIC: EP-07 — AI Integration & Finalization |  |  |  |
| --- | --- | --- | --- |
| As a family user, I want to receive AI-powered nurse recommendations based on my elderly family member's health profile and condition, so that I can find the most suitable nurse quickly without manually reviewing every profile. |  |  |  |
| Priority Could Have | Sprint Sprint 6 | Story Points 13 pts | Status Not Started |
| Acceptance Criteria |  |  |  |
| ✓  AC-1: After completing the patient profile, the system displays a 'Recommended for You' section with ranked nurse suggestions. |  |  |  |
| ✓  AC-2: Each recommendation shows a compatibility score and a brief explanation (e.g., 'Specializes in diabetes monitoring — matches your patient's condition'). |  |  |  |
| ✓  AC-3: User can choose to ignore recommendations and search manually. |  |  |  |
| ✓  AC-4: Recommendation logic is based on: patient health conditions vs. nurse specializations, patient location vs. nurse service area. |  |  |  |

| US-23  EPIC: EP-07 — AI Integration & Finalization |  |  |  |
| --- | --- | --- | --- |
| As a family user, I want to receive an AI-generated summary of my elderly family member's care session after it ends, so that I get a quick, readable health insight without reading through the full technical nurse checklist. |  |  |  |
| Priority Could Have | Sprint Sprint 6 | Story Points 8 pts | Status Not Started |
| Acceptance Criteria |  |  |  |
| ✓  AC-1: An AI-generated care summary card appears on the session report page below the raw checklist data. |  |  |  |
| ✓  AC-2: Summary includes: overall patient condition sentiment (Positive/Neutral/Concerning), key highlights, and any flagged concerns. |  |  |  |
| ✓  AC-3: User must explicitly accept an Informed Consent prompt before AI analysis is applied to their data. |  |  |  |
| ✓  AC-4: AI analysis only processes anonymized care data — no personal identifiers are sent to the AI model. |  |  |  |

| US-24  EPIC: EP-07 — AI Integration & Finalization |  |  |  |
| --- | --- | --- | --- |
| As a development team, I want to complete final bug fixing, end-to-end testing, and production deployment before the P2MW deadline, so that PARING is live, stable, and demonstrable to P2MW judges by May 23, 2026. |  |  |  |
| Priority Must Have | Sprint Sprint 6 | Story Points 13 pts | Status Not Started |
| Acceptance Criteria |  |  |  |
| ✓  AC-1: All critical (P0) and high (P1) bugs identified in QA are resolved before production deployment. |  |  |  |
| ✓  AC-2: End-to-end flow tested: registration → profile → booking → payment → monitoring → report. |  |  |  |
| ✓  AC-3: Emergency panic button tested and confirmed functional on staging environment. |  |  |  |
| ✓  AC-4: Application deployed and accessible on Vercel production URL. |  |  |  |
| ✓  AC-5: Admin dashboard accessible and functional for nurse management. |  |  |  |
