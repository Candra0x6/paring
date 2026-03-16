# Paring API

REST API untuk sistem **Paring**, sebuah platform yang menghubungkan **pasien dengan perawat** serta mengelola appointment layanan kesehatan.

API ini dibangun dengan pendekatan **RESTful** dan menyediakan endpoint untuk:

* Authentication
* User Management
* Nurse Management
* Patient Management
* Appointment Management
* Activity Logging

---

# Base URL

```bash
{{BASE_URL}}
```

Contoh saat development:

```bash
http://localhost:3000
```

---

# Authentication

## Login

Authenticate user dan mendapatkan token sesi.

**Endpoint**

```
POST /auth
```

**Request Body**

```json
{
  "email": "rangga@example.com",
  "password": "akugila123"
}
```

---

# Users

## Create User

```
POST /users
```

**Request Body**

```json
{
  "email": "nayla@example.com",
  "passwordHash": "akunayla123",
  "fullName": "Nayla Saffana",
  "phoneNumber": "+62812726371673",
  "role": "NURSE"
}
```

---

## Get Users

```
GET /users
```

**Query Parameters**

| Parameter | Type   | Description             |
| --------- | ------ | ----------------------- |
| role      | string | Filter berdasarkan role |
| name      | string | Filter berdasarkan nama |

**Example**

```
GET /users?role=NURSE
```

---

## Get User By ID

```
GET /users/:id
```

**Example**

```
GET /users/f80a7c0b-b268-4172-b92b-ad5cce94a6cf
```

---

## Update User

```
PATCH /users/:id
```

**Request Body**

```json
{
  "fullName": "Airlangga Pradana"
}
```

---

## Delete User

```
DELETE /users/:id
```

---

# Nurses

## Create Nurse

```
POST /nurses
```

**Request Body**

```json
{
  "userId": "f80a7c0b-b268-4172-b92b-ad5cce94a6cf",
  "specialization": "Caregiver",
  "experienceYears": 3
}
```

---

## Get All Nurses

```
GET /nurses
```

**Query Parameters**

| Parameter       | Type   |
| --------------- | ------ |
| name            | string |
| specialization  | string |
| experienceYears | number |

**Example**

```
GET /nurses?specialization=Caregiver
```

---

## Get Nurse By ID

```
GET /nurses/:id
```

---

## Update Nurse

```
PATCH /nurses/:id
```

**Request Body**

```json
{
  "experienceYears": 5
}
```

---

## Delete Nurse

```
DELETE /nurses/:id
```

---

# Patients

## Create Patient

```
POST /patients
```

**Request Body**

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

---

## Get All Patients

```
GET /patients
```

---

## Get Patient By ID

```
GET /patients/:id
```

---

## Update Patient

```
PATCH /patients/:id
```

---

## Delete Patient

```
DELETE /patients/:id
```

---

# Appointments

## Create Appointment

```
POST /appointments
```

**Request Body**

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

---

## Get All Appointments

```
GET /appointments
```

---

## Get Appointment By ID

```
GET /appointments/:id
```

---

## Update Appointment

```
PATCH /appointments/:id
```

---

## Delete Appointment

```
DELETE /appointments/:id
```

---

# Activity Log

## Add Activity Log

```
POST /activitylog
```

---

## Update Activity Log

```
PATCH /activitylog/:id
```

---

## Delete Activity Log

```
DELETE /activitylog/:id
```

---
