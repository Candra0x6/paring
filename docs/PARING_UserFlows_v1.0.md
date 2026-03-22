# USER FLOW DIAGRAMS

## PARING

## Homecare Lansia Platform

| Document | User Flow Diagrams — Document #5 |
| --- | --- |
| Version | 1.0 — MVP |
| Flows | 6 Core User Flows |
| Date | March 2026  \|  P2MW Program |

# Legend & Actor Key

## Flow Element Legend

| ⬤  START | Flow entry point — the trigger event that initiates the flow |
| --- | --- |
| [ Step N ]  Action | A sequential step — numbered action by an actor or the system |
| ◆  DECISION | A branching point with YES / NO paths that lead to different outcomes |
| ⬟  END (Success) | Successful flow completion state |
| ⬟  END (Fail / Exit) | Failed or aborted flow termination state |

## Actor Color Key

| Family (Keluarga) | Nurse (Perawat) | System (Auto) | Admin PARING | Lansia (Patient) |
| --- | --- | --- | --- | --- |

## Flows Summary

| Flow ID | Flow Name | Primary Actor | Sprint |
| --- | --- | --- | --- |
| UF-01 | User Registration & Login | Family User | Sprint 2 |
| UF-02 | Elderly Patient Profile Setup | Family User | Sprint 2 |
| UF-03 | Nurse Discovery & Booking | Family User + Nurse | Sprint 3 |
| UF-04 | Real-Time Care Monitoring | Family User + Nurse | Sprint 4 |
| UF-05 | Emergency / Panic Button | Family / Lansia + System + Admin | Sprint 4 |
| UF-06 | Payment Processing | Family User + System | Sprint 5 |

# UF-01: User Registration & Login

Trigger: A new user visits the PARING landing page or app for the first time and wants to create an account, OR a returning user wants to log in.

| Step | Actor | Action / System Event | Screen / State |
| --- | --- | --- | --- |
| ⬤  START: User opens PARING app / landing page |  |  |  |
| 1 | Family | Taps 'Daftar Sekarang' (Register) or 'Masuk' (Login) on landing page | SCR-01: Landing Page |
| ◆  DECISION: Is this a new user? → YES: Proceed to Registration (Step 2) → NO:    Proceed to Login (Step 7) |  |  |  |
| ── Registration Path ── |  |  |  |
| 2 | Family | Fills in registration form: Full Name, Email, Phone (WhatsApp), Password, Password Confirmation | SCR-02: Registration Screen |
| 3 | System | Validates all fields (required, email format, password length ≥8, passwords match) Error state: red border + helper text for each invalid field | SCR-02: Registration Screen |
| ◆  DECISION: Are all fields valid? → YES: Proceed to Step 4 → NO:    Return to Step 2 with inline errors shown |  |  |  |
| 4 | System | Creates user account in database; issues session token; sends Welcome notification via WhatsApp | System / Database |
| 5 | System | Redirects user to Patient Profile Setup screen (first-time onboarding) | SCR-03: Patient Profile Form |
| ⬟  REGISTRATION COMPLETE — User is now logged in and onboarding begins |  |  |  |
| ── Login Path ── |  |  |  |
| 7 | Family | Enters Email and Password in login form | Login Screen |
| 8 | System | Validates credentials against database | System / Database |
| ◆  DECISION: Are credentials correct? → YES: Proceed to Step 9 → NO:    Show error: 'Email atau password salah.' Return to Step 7 |  |  |  |
| 9 | System | Issues session token; redirects to Family Dashboard | Dashboard |
| ⬟  LOGIN COMPLETE — User lands on main dashboard |  |  |  |
| ── Forgot Password Path (Branch from Login) ── |  |  |  |
| F1 | Family | Taps 'Lupa Password?' link on login screen | Login Screen |
| F2 | Family | Enters registered email address | Forgot Password Screen |
| F3 | System | Sends password reset link via email; shows 'Cek email Anda' confirmation | System / Email |
| F4 | Family | Clicks reset link in email, enters new password | Reset Password Screen |
| ⬟  PASSWORD RESET COMPLETE — User can now log in with new password |  |  |  |

# UF-02: Elderly Patient Profile Setup

Trigger: A logged-in family user wants to add or update an elderly patient profile. This must be completed before placing a first booking.

| Step | Actor | Action / System Event | Screen / State |
| --- | --- | --- | --- |
| ⬤  START: User is logged in and navigates to 'Profil Lansia' or is redirected post-registration |  |  |  |
| 1 | Family | Taps '+ Tambah Profil Lansia' from the profile management screen | Patient Profile List Screen |
| 2 | Family | Fills in basic patient info: Name, Age, Gender, Weight, Height, Home Address | SCR-03: Patient Profile Form |
| 3 | Family | Fills in health conditions: Blood Pressure (systolic/diastolic), Blood Sugar, Diabetes status | SCR-03: Patient Profile Form |
| 4 | Family | Selects special conditions: Bedridden toggle, Allergy notes, Additional notes | SCR-03: Patient Profile Form |
| 5 | System | Validates required fields (Name, Age, Address mandatory) Error: required fields highlighted in red if empty | SCR-03: Patient Profile Form |
| ◆  DECISION: Are all required fields valid? → YES: Proceed to Step 6 → NO:    Return to Step 2 showing inline validation errors |  |  |  |
| 6 | System | Saves patient profile to database linked to this family account | System / Database |
| 7 | System | Redirects to Patient Profile confirmation screen showing summary of saved data | Profile Confirmation Screen |
| ◆  DECISION: Does the user want to add another patient profile? → YES: Return to Step 1 to add a new profile → NO:    Proceed to Step 8 |  |  |  |
| 8 | Family | Navigates to nurse search or main dashboard | SCR-04: Nurse Search OR Dashboard |
| ⬟  PROFILE SETUP COMPLETE — Patient profile saved; user can now book care |  |  |  |
| ── Edit Existing Profile ── |  |  |  |
| E1 | Family | Taps on existing patient profile from the profile list | Patient Profile List Screen |
| E2 | Family | Updates desired fields | SCR-03: Patient Profile Form (Edit Mode) |
| E3 | System | Saves updated profile to database | System / Database |
| ⬟  PROFILE UPDATED SUCCESSFULLY |  |  |  |

# UF-03: Nurse Discovery & Booking

Trigger: A logged-in family user wants to find and book a nurse for their elderly patient.

| Step | Actor | Action / System Event | Screen / State |
| --- | --- | --- | --- |
| ⬤  START: User is logged in and has at least one patient profile created |  |  |  |
| ── Nurse Search & Selection ── |  |  |  |
| 1 | Family | Navigates to 'Cari Perawat' (Nurse Search) from bottom navigation | SCR-04: Nurse Search Screen |
| 2 | Family | Applies filters: Service Type (Visit / Live-Out / Live-In), Date, Specialization | SCR-04: Nurse Search Screen |
| 3 | System | Returns filtered list of verified nurses matching criteria | SCR-04: Nurse Search Screen |
| ◆  DECISION: Are there nurses matching the filters? → YES: Display nurse cards list — proceed to Step 4 → NO:    Show 'Tidak ada perawat tersedia' empty state — user adjusts filters and returns to Step 2 |  |  |  |
| 4 | Family | Taps on a nurse card to view full profile | SCR-05: Nurse Profile Detail |
| 5 | Family | Reviews nurse qualifications, certifications, ratings, schedule, and service list | SCR-05: Nurse Profile Detail |
| ◆  DECISION: Does the user want to book this nurse? → YES: Taps 'Buat Booking' — proceed to Step 6 → NO:    Returns to nurse list (Step 3) to choose another nurse |  |  |  |
| ── Booking Configuration ── |  |  |  |
| 6 | Family | Selects patient profile from dropdown (for which elderly person is this booking?) | SCR-05: Booking Form |
| 7 | Family | Selects service type, date, and time | SCR-05: Booking Form |
| 8 | Family | Checks service items (blood pressure check, weight check, etc.) and adds concern notes | SCR-05: Booking Form |
| 9 | Family | Reviews booking summary and taps 'Kirim Permintaan Booking' | SCR-05: Booking Form |
| 10 | System | Creates booking record with status: PENDING; sends WA + in-app notification to Nurse | System / Database |
| ── Nurse Confirmation ── |  |  |  |
| 11 | Nurse | Receives booking notification; opens booking detail in nurse app/dashboard | Nurse Dashboard |
| 12 | Nurse | Reviews patient profile, requested services, and concern notes | Nurse Dashboard — Booking Detail |
| ◆  DECISION: Does the nurse accept the booking? → YES: Nurse provides itemized final price and confirms (Step 13) → NO:    Nurse declines with reason — System notifies family (Step 14) |  |  |  |
| 13 | Nurse | Confirms booking with final itemized price; booking status → AWAITING PAYMENT | Nurse Dashboard |
| 13a | System | Sends WA + in-app notification to family with price confirmation and payment prompt | System |
| ⬟  BOOKING CONFIRMED — User proceeds to UF-06 (Payment) to complete the booking |  |  |  |
| 14 | System | Notifies family that nurse has declined; booking status → DECLINED | Dashboard / Notification |
| 14a | Family | Returns to nurse list to select a different nurse (Step 3) | SCR-04: Nurse Search |
| ⬟  BOOKING DECLINED — User searches for alternative nurse |  |  |  |

# UF-04: Real-Time Care Monitoring

Trigger: A booking is confirmed and paid. The nurse has arrived at the patient's home and begins the care session.

| Step | Actor | Action / System Event | Screen / State |
| --- | --- | --- | --- |
| ⬤  START: Booking status = CONFIRMED & PAID; Care session date/time has begun |  |  |  |
| ── Nurse Side: Starting the Session ── |  |  |  |
| 1 | Nurse | Opens PARING app on phone; navigates to active booking | Nurse Dashboard — Active Booking |
| 2 | Nurse | Taps 'Mulai Sesi' (Start Session); booking status → ACTIVE | Nurse Dashboard |
| 3 | System | Creates real-time session record; notifies family that session is now active | System / Database |
| ── Family Side: Monitoring Dashboard ── |  |  |  |
| 4 | Family | Opens PARING app; sees 'Sesi Aktif' banner with nurse name and patient name | SCR-06: Monitoring Dashboard |
| 5 | Family | Views real-time data cards: status shows '— Menunggu update perawat —' for unsubmitted items | SCR-06: Monitoring Dashboard |
| ── Nurse Side: Data Entry During Session ── |  |  |  |
| 6 | Nurse | Performs ordered services (e.g., measures blood pressure) | Physical Care — No Screen |
| 7 | Nurse | Opens checklist for current booking; enters measured values (e.g., BP: 120/80 mmHg) | Nurse Checklist Screen |
| 8 | System | Saves data to database; pushes real-time update to Family's monitoring dashboard | System / Database |
| 9 | Family | Sees data cards update instantly on dashboard with value, timestamp, and nurse name | SCR-06: Monitoring Dashboard |
| 10 | Family | Optionally opens in-app chat to message the nurse with questions or updates | In-App Chat |
| 11 | Nurse | Responds to family chat messages while continuing care | In-App Chat |
| ── Session Completion ── |  |  |  |
| 12 | Nurse | Completes all ordered services; taps 'Selesaikan Sesi' in the app | Nurse Checklist Screen |
| ◆  DECISION: Are all mandatory checklist items completed? → YES: System allows session completion (Step 13) → NO:    System shows error: 'Selesaikan semua checklist wajib' — Nurse must complete all items |  |  |  |
| 13 | System | Marks booking status → COMPLETED; generates session report with all logged data | System / Database |
| 14 | System | Sends session report notification to family; all data stored permanently in patient profile | System |
| 15 | Family | Views completed session report on dashboard: all health data, nurse notes, care summary | Session Report Screen |
| ⬟  CARE SESSION COMPLETE — Report saved to patient profile for future reference |  |  |  |

# UF-05: Emergency / Panic Button Flow

Trigger: During any session (or at any time), the family user or elderly patient experiences a critical emergency (fall, breathing difficulty, etc.) and presses the DARURAT button.

| Step | Actor | Action / System Event | Screen / State |
| --- | --- | --- | --- |
| ⬤  START: User is on the PARING app — DARURAT button is always visible on dashboard |  |  |  |
| 1 | Family | Taps the red DARURAT button prominently displayed on the monitoring dashboard | SCR-06: Monitoring Dashboard |
| 2 | System | Immediately triggers emergency protocol — NO additional confirmation required Critical UX: no delay, no confirmation dialog. Alert fires on single tap. | System (Background) |
| ── Simultaneous Auto-Broadcast ── |  |  |  |
| 3 | System | Sends WhatsApp message to Family's registered emergency contact (Anak/Wali) Message includes: Patient Name, Home Address, 'KONDISI DARURAT — SEGERA DIHUBUNGI' | WhatsApp Gateway |
| 3a | System | Sends same WhatsApp alert to assigned Nurse (if active session) | WhatsApp Gateway |
| 3b | System | Sends same WhatsApp alert to PARING Admin on-duty number | WhatsApp Gateway |
| 3c | System | Logs emergency event: timestamp, patient name, user account, delivery status of all 3 alerts | System / Database |
| ── User Screen: Emergency Modal ── |  |  |  |
| 4 | System | Displays full-screen emergency modal (SCR-07) over current screen | SCR-07: Emergency Screen |
| 5 | Family | Reads confirmation: 'Alert terkirim ke Keluarga, Perawat, Admin PARING' | SCR-07: Emergency Screen |
| 6 | Family | Sees quick-dial buttons: 119 (national emergency), Partner Hospital/Clinic numbers | SCR-07: Emergency Screen |
| 7 | Family | Optionally taps a number to initiate a direct phone call | Phone Dialer (External) |
| ── Admin SOP Response ── |  |  |  |
| 8 | Admin | Receives WhatsApp notification with patient details | WhatsApp — Admin Phone |
| 9 | Admin | Activates Emergency SOP: calls the family back within maximum 2 minutes | Phone Call |
| 10 | Admin | Confirms situation with family; coordinates hospital/clinic contact if needed | Phone Call |
| 11 | Admin | Logs response in admin dashboard: call-back time, action taken, resolution status | Admin Dashboard — Emergency Log |
| ◆  DECISION: Was the emergency resolved without further escalation? → YES: Log as 'Resolved' — Admin closes the emergency record (Step 12) → NO:    Admin escalates to partner hospital/ambulance dispatch (Step 12a) |  |  |  |
| 12 | Admin | Marks emergency record as RESOLVED in admin panel with notes | Admin Dashboard |
| ⬟  EMERGENCY HANDLED — Event logged; family supported; record closed |  |  |  |
| 12a | Admin | Contacts nearest partner hospital/clinic; dispatches assistance | Phone — Hospital Partner |
| ⬟  EMERGENCY ESCALATED — External medical assistance dispatched |  |  |  |

# UF-06: Payment Processing (Midtrans)

Trigger: A nurse has confirmed a booking and set the final price. The family user receives a notification and proceeds to payment.

| Step | Actor | Action / System Event | Screen / State |
| --- | --- | --- | --- |
| ⬤  START: Booking status = AWAITING PAYMENT; Nurse has confirmed final price |  |  |  |
| 1 | Family | Receives WA + in-app notification: 'Harga dikonfirmasi — Segera bayar untuk mengunci jadwal' | Notification |
| 2 | Family | Opens booking detail from notification or from 'Riwayat Booking' list | Booking Detail Screen |
| 3 | Family | Reviews itemized price breakdown (services + PARING service fee) | Booking Detail Screen |
| ◆  DECISION: Does the user accept the price? → YES: Taps 'Lanjut ke Pembayaran' — proceed to Step 4 → NO:    Taps 'Batalkan Booking' — proceed to Cancel Path (Step C1) |  |  |  |
| 4 | Family | Opens payment screen; selects preferred payment method (Bank Transfer, e-Wallet, Credit Card) | SCR-08: Payment Screen |
| 5 | Family | Taps 'Bayar Sekarang' | SCR-08: Payment Screen |
| 6 | System | Initiates Midtrans payment session; redirects user to Midtrans payment page | Midtrans Payment Page (External) |
| 7 | Family | Completes payment on Midtrans page (enters card details or follows bank transfer instructions) | Midtrans Payment Page |
| 8 | System | Midtrans sends payment webhook to PARING backend confirming payment status | System / Midtrans Webhook |
| ◆  DECISION: Was the payment successful? → YES: Proceed to Step 9 (Success) → NO:    Proceed to Step 10 (Failed) |  |  |  |
| ── Payment Success Path ── |  |  |  |
| 9 | System | Updates booking status → CONFIRMED; sends WA confirmation to Family and Nurse with session details | System / WA Gateway |
| 9a | System | Generates payment receipt stored in user account | System / Database |
| ⬟  PAYMENT COMPLETE — Booking locked; session scheduled; both parties notified |  |  |  |
| ── Payment Failed Path ── |  |  |  |
| 10 | System | Returns user to PARING app with payment failure notification | SCR-08: Payment Screen |
| 11 | Family | Sees error: 'Pembayaran gagal — silakan coba lagi atau pilih metode lain' | SCR-08: Payment Screen |
| 12 | Family | Selects a different payment method and retries (returns to Step 4) OR cancels booking | SCR-08: Payment Screen |
| ⬟  PAYMENT FAILED — User can retry or cancel the booking |  |  |  |
| ── Cancellation Path ── |  |  |  |
| C1 | Family | Taps 'Batalkan Booking' on booking detail screen | Booking Detail Screen |
| C2 | System | Shows cancellation policy and refund terms clearly | Cancellation Policy Screen |
| ◆  DECISION: Does the user confirm cancellation? → YES: Proceed to Step C3 → NO:    User returns to booking detail; no cancellation |  |  |  |
| C3 | System | Cancels booking; updates status → CANCELLED; notifies Nurse via WA | System / WA Gateway |
| C4 | System | Initiates refund per cancellation policy (if payment was already made) | System / Midtrans |
| ⬟  BOOKING CANCELLED — Refund initiated per cancellation policy |  |  |  |
