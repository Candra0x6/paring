# Paring API Documentation

Dokumentasi ini memuat endpoint untuk layanan Paring API. 

**Base URL:** `{{BASE_URL}}`

---

## Tabel Konten
1. [USER](#1-user)
2. [NURSE](#2-nurse)
3. [Patient](#3-patient)
4. [Appointments](#4-appointments)
5. [Activity Log](#5-activity-log)
6. [Auth](#6-auth)

---

## 1. USER

### NEW USER
Membuat pengguna baru.
- **Method:** `POST`
- **Endpoint:** `/users`

**Request Body (JSON):**
```json
{
    "email": "nayla@example.com",
    "passwordHash": "akunayla123",
    "fullName": "Nayla Saffana",
    "phoneNumber": "+62812726371673",
    "role": "NURSE"
}
```

### GET USERS
Mengambil daftar pengguna.
- **Method:** `GET`
- **Endpoint:** `/users`

**Query Parameters:**
| Parameter | Type | Description | Status |
| :--- | :--- | :--- | :--- |
| `role` | text | Filter berdasarkan role (contoh: NURSE) | *Disabled* |
| `name` | text | Filter berdasarkan nama (contoh: rangga) | *Disabled* |

### UPDATE USER
Memperbarui data pengguna.
- **Method:** `PATCH`
- **Endpoint:** `/users/:id` *(contoh: `/users/896e16ec-730a-431b-82c2-a21bf4c46cef`)*

**Request Body (JSON):**
```json
{
    "fullName": "Airlangga Pradana"
}
```

### GET USER BY ID
Mengambil data satu pengguna spesifik berdasarkan ID.
- **Method:** `GET`
- **Endpoint:** `/users/:id` *(contoh: `/users/f80a7c0b-b268-4172-b92b-ad5cce94a6cf`)*

**Query Parameters:**
| Parameter | Type | Description | Status |
| :--- | :--- | :--- | :--- |
| `role` | text | Filter berdasarkan role | *Disabled* |

### DELETE USER
Menghapus pengguna.
- **Method:** `DELETE`
- **Endpoint:** `/users/:id` *(contoh: `/users/21078367-aa6f-4e3c-9f3c-019ca71813c1`)*

---

## 2. NURSE

### NEW NURSE
Mendaftarkan perawat baru.
- **Method:** `POST`
- **Endpoint:** `/nurses`

**Request Body (JSON):**
```json
{
    "userId": "f80a7c0b-b268-4172-b92b-ad5cce94a6cf",
    "specialization": "Caregiver",
    "experienceYears": 3
}
```

### GET ALL NURSES
Mengambil daftar perawat.
- **Method:** `GET`
- **Endpoint:** `/nurses`

**Query Parameters:**
| Parameter | Type | Description | Status |
| :--- | :--- | :--- | :--- |
| `name` | text | Filter berdasarkan nama | *Disabled* |
| `specialization` | text | Filter berdasarkan spesialisasi | *Disabled* |
| `experienceYears`| text | Filter berdasarkan tahun pengalaman | *Disabled* |

**Request Body (JSON):**
```json
{
    "userId": "f80a7c0b-b268-4172-b92b-ad5cce94a6cf",
    "specialization": "Caregiver",
    "experienceYears": 3
}
```

### UPDATE NURSE
Memperbarui data perawat.
- **Method:** `PATCH`
- **Endpoint:** `/nurses/:id` *(contoh: `/nurses/6fa4cf92-4e51-42de-a72b-c6e73cd41e18`)*

**Request Body (JSON):**
```json
{
    "experienceYears": 5
}
```

### GET ONE NURSE
Mengambil data satu perawat spesifik.
- **Method:** `GET`
- **Endpoint:** `/nurses/:id` *(contoh: `/nurses/6fa4cf92-4e51-42de-a72b-c6e73cd41e18`)*

**Request Body (JSON):**
```json
{
    "userId": "f80a7c0b-b268-4172-b92b-ad5cce94a6cf",
    "specialization": "Caregiver",
    "experienceYears": 3
}
```

### DELETE NURSE
Menghapus perawat.
- **Method:** `DELETE`
- **Endpoint:** `/nurses/:id` *(contoh: `/nurses/6fa4cf92-4e51-42de-a72b-c6e73cd41e18`)*

**Request Body (JSON):**
```json
{
    "experienceYears": 5
}
```

---

## 3. Patient

### NEW PATIENT
Menambahkan pasien baru.
- **Method:** `POST`
- **Endpoint:** `/patients`

**Request Body (JSON):**
```json
{
    "familyId": "896e16ec-730a-431b-82c2-a21bf4c46cef",
    "name": "Daniel Budianto",
    "dateOfBirth": "2004-10-23",
    "weight": 65,
    "height": 178,
    "medicalHistory": [
        "flu",
        "cold"
    ]
}
```

### GET ALL PATIENTS
Mengambil daftar pasien.
- **Method:** `GET`
- **Endpoint:** `/patients`

### GET SINGLE PATIENT
Mengambil data spesifik pasien berdasarkan ID.
- **Method:** `GET`
- **Endpoint:** `/patients/:id` *(contoh: `/patients/21078367-aa6f-4e3c-9f3c-019ca71813c1`)*

### UPDATE PATIENT
Memperbarui data pasien.
- **Method:** `PATCH`
- **Endpoint:** `/patients/:id` *(contoh: `/patients/21078367-aa6f-4e3c-9f3c-019ca71813c1`)*

**Request Body (JSON):**
```json
{
    "name": "Daniel Hartanto"
}
```

### DELETE PATIENT
Menghapus data pasien.
- **Method:** `DELETE`
- **Endpoint:** `/patients/:id` *(contoh: `/patients/21078367-aa6f-4e3c-9f3c-019ca71813c1`)*

---

## 4. Appointments

### ADD APPOINTMENT
Membuat janji temu baru.
- **Method:** `POST`
- **Endpoint:** `/appointments`

**Request Body (JSON):**
```json
{
    "patientId": "21078367-aa6f-4e3c-9f3c-019ca71813c1",
    "nurseId": "6fa4cf92-4e51-42de-a72b-c6e73cd41e18",
    "status": "PENDING",
    "serviceType": "LIVE_IN",
    "totalPrice": 75000,
    "dueDate": "2026-03-17"
}
```

### GET ALL APPOINTMENTS
Mengambil daftar janji temu.
- **Method:** `GET`
- **Endpoint:** `/appointments`

### GET SINGLE APPOINTMENT
Mengambil detail satu janji temu.
- **Method:** `GET`
- **Endpoint:** `/appointments/:id` *(contoh: `/appointments/akdusagdysgadsadsad`)*

### UPDATE APPOINTMENT
Memperbarui status janji temu.
- **Method:** `PATCH`
- **Endpoint:** `/appointments/:id` *(contoh: `/appointments/akdusagdysgadsadsad`)*

**Request Body (JSON):**
```json
{
    "status": "CONFIRMED"
}
```

### DELETE APPOINTMENT
Menghapus janji temu.
- **Method:** `DELETE`
- **Endpoint:** `/appointments/:id` *(contoh: `/appointments/akdusagdysgadsadsad`)*

---

## 5. Activity Log

### ADD NEW LOG
Menambahkan catatan aktivitas baru.
- **Method:** `POST`
- **Endpoint:** `/activitylog`

**Request Body (JSON):**
```json
{
    "careLogId": "amdishaudhasdsad",
    "notes": "This is a test note"
}
```

### UPDATE LOG
Memperbarui catatan aktivitas.
- **Method:** `PATCH`
- **Endpoint:** `/activitylog/:id` *(contoh: `/activitylog/snadaihdiasd`)*

**Request Body (JSON):**
```json
{
    "notes": "This request is used to update the activity log for a specific user. The request body includes the user ID and the new activity log entry."
}
```

### DELETE LOG
Menghapus catatan aktivitas.
- **Method:** `DELETE`
- **Endpoint:** `/activitylog/:id` *(contoh: `/activitylog/snadaihdiasd`)*

---

## 6. Auth

### LOGIN
Otentikasi pengguna untuk mendapatkan akses.
- **Method:** `POST`
- **Endpoint:** `/auth`

**Request Body (JSON):**
```json
{
    "email": "rangga@example.com",
    "password": "akugila123"
}
```
