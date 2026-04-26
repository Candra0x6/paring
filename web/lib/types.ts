// Auth
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  access_token?: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: 'ADMIN' | 'FAMILY' | 'NURSE';
  createdAt?: string;
  updatedAt?: string;
}

// Patient
export interface CreatePatientRequest {
  familyId: string;
  name: string;
  dateOfBirth: string;
  weight?: number;
  height?: number;
  medicalHistory?: string[];
}

export interface Patient extends CreatePatientRequest {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

// Nurse Profile
export interface CreateNurseRequest {
  userId: string;
  specialization: string;
  experienceYears: number;
}

export interface NurseProfile extends CreateNurseRequest {
  id: string;
  rating?: number;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Appointment
export interface CreateAppointmentRequest {
  patientId: string;
  nurseId: string;
  serviceType: 'VISIT' | 'LIVE_IN' | 'LIVE_OUT';
  serviceName?: 'MEDIS' | 'NON_MEDIS';
  status?: 'PENDING' | 'CONFIRMED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  dueDate: string;
  totalPrice: number;
}

export interface Appointment extends CreateAppointmentRequest {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

// CareLog (Vital Signs)
export interface CreateCareLogRequest {
  appointmentId: string;
  patientId: string;
  nurseId: string;
  systolic?: number;
  diastolic?: number;
  bloodSugar?: number;
  cholesterol?: number;
  uricAcid?: number;
  woundCondition?: string;
  moodScore?: number;
  clinicalNotes?: string;
}

export interface CareLog extends CreateCareLogRequest {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

// ActivityLog
export interface CreateActivityLogRequest {
  notes: string;
  careLogId: string;
}

export interface ActivityLog extends CreateActivityLogRequest {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

// Payment
export interface CreatePaymentRequest {
  appointmentId: string;
}

export interface PaymentResponse {
  token: string;
  snapToken?: string;
  snapRedirectUrl?: string;
  midtransOrderId?: string;
}

// API Response Wrapper
export interface ApiResponse<T> {
  message: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}
