# USER FLOW DOCUMENTATION (v2.0)

## PARING - Homecare Lansia Platform

This document outlines the core user journeys for both **Family (Keluarga/Patient Side)** and **Nurse (Perawat)** roles, including the newly added **Non-medis (Non-medical)** service flows.

---

## 1. Family / Patient Side User Flow

The family user manages patients, discovers nurses, books services, monitors active sessions, and reviews health reports.

### A. Discovery & Booking
1.  **Landing Page**: User views available services (Visit Care, Live-Out, Live-In, and the new **Non-medis**).
2.  **Registration/Login**: User authenticates to access the dashboard.
3.  **Patient Setup**: User adds elderly patient details (Name, Age, Conditions).
4.  **Nurse Discovery**: User searches for nurses, filtering by service type (Medical vs. Non-medical).
5.  **Booking**: User selects a nurse, chooses the patient, selects service type, and submits a booking request.
6.  **Payment**: After nurse confirmation, user completes payment via Midtrans.

### B. Monitoring & Reports
1.  **Dashboard**: User sees an "Active Session" banner when a nurse starts the care.
2.  **Real-Time Monitoring**:
    *   **Medical (Visit Care)**: User monitors Blood Pressure, Blood Sugar, Temperature, and Mood.
    *   **Non-Medical (Non-medis)**: User monitors Emotional Status, Activity Level, Appetite, and Mood.
    *   **Timeline**: User tracks nurse arrival and specific actions logged by the nurse.
3.  **Session Report**: Once the session is completed:
    *   User receives a "Sesi Selesai" notification on the dashboard.
    *   **Medical Report**: Detailed vitals and medical actions taken.
    *   **Non-Medical Report**: Summary of ADL (makan, mandi), Emotional Support activities, and Physical Activity results.
    *   **PARING AI Summary**: An AI-generated overview of the patient's condition for easy reading.

---

## 2. Nurse Side User Flow

The nurse manages their professional profile, availability, handles incoming bookings, and performs the care sessions.

### A. Registration & Verification
1.  **Registration Page**: A prospective nurse navigates to the Nurse-specific registration page.
2.  **Step 1: Account Details**: Nurse provides basic information (Full Name, Email, WhatsApp, Password).
3.  **Step 2: Professional Details**: Nurse enters professional data, including STR number, years of experience, and specializations.
4.  **Step 3: Document Upload**: Nurse uploads required documents for verification:
    *   Scan of KTP (ID Card)
    *   Scan of STR (Nurse Registration Certificate)
    *   Optional: Other certifications (BTCLS, Wound Care, etc.)
5.  **Submission**: Nurse submits the application.
6.  **Admin Verification (Backend Flow)**:
    *   The PARING admin team receives the application.
    *   Admin reviews all submitted data and documents for validity and authenticity.
    *   Upon approval, the admin activates the nurse's profile.
7.  **Account Activated**: Nurse receives an email and WhatsApp notification that their account is verified and live on the platform. They can now log in and manage their profile.

### B. Profile & Schedule Management
1.  **Professional Profile**: Nurse sets up their credentials, certifications, and skills (e.g., adding **Non-medis** as a skill).
2.  **Availability**: Nurse sets their working hours/days to appear in search results.
3.  **Earnings**: Nurse monitors income from completed sessions.

### C. Handling Appointments
1.  **Inbox**: Nurse receives new booking requests.
2.  **Appointment Detail**: Nurse reviews patient history and service requirements before accepting.
    *   *New*: Specifically identifies if the request is for **Visit Care** or **Non-medis**.
3.  **Care Session (Active)**:
    *   **Mulai Sesi**: Nurse taps "Start" upon arrival.
    *   **Checklist Execution**:
        *   **If Medical**: Enters Vitals (BP, Sugar) and medical notes.
        *   **If Non-Medical**: Checks off **ADL** (helping eat/bathe), **Emotional Support** (chatting/tea), and **Light Physical Activity** (stretching/walking).
    *   **Observation Notes**: Nurse adds professional notes on patient behavior or concerns.
4.  **Selesaikan Sesi**: Nurse completes the checklist to finalize the report and trigger family notification.

---

## Summary of Role Differences

| Feature | Family (User) Side | Nurse (Perawat) Side |
| :--- | :--- | :--- |
| **Primary Goal** | Monitor & Manage Care | Perform & Log Care |
| **Key View** | Monitoring Dashboard & Reports | Activity Checklist & Schedule |
| **Service Focus** | Health Status & Safety | Action Items & Compliance |
| **Interaction** | Book, Pay, & Chat | Accept, Perform, & Log |
