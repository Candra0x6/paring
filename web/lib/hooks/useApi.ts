import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import type {
  LoginRequest,
  AuthResponse,
  CreatePatientRequest,
  Patient,
  CreateNurseRequest,
  NurseProfile,
  CreateAppointmentRequest,
  Appointment,
  CreateCareLogRequest,
  CareLog,
  CreateActivityLogRequest,
  ActivityLog,
} from '@/lib/types';

// ==================== AUTH HOOKS ====================
export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginRequest): Promise<AuthResponse> => {
      const response = await apiClient.post('/auth', data);
      return response.data;
    },
  });
};

export const useRegisterUser = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post('/users', data);
      return response.data;
    },
  });
};

// ==================== NURSE HOOKS ====================
export const useCreateNurseProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateNurseRequest) => {
      const response = await apiClient.post('/nurses', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nurses'] });
    },
  });
};

export const useNurses = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: ['nurses', filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters || {}).toString();
      const response = await apiClient.get(
        `/nurses${params ? `?${params}` : ''}`
      );
      return response.data;
    },
  });
};

export const useNurseById = (id: string) => {
  return useQuery({
    queryKey: ['nurses', id],
    queryFn: async () => {
      const response = await apiClient.get(`/nurses/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useUpdateNurseProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<NurseProfile> }) => {
      const response = await apiClient.patch(`/nurses/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nurses'] });
    },
  });
};

// ==================== PATIENT HOOKS ====================
export const usePatients = (familyId?: string) => {
  return useQuery({
    queryKey: ['patients', familyId],
    queryFn: async () => {
      const params = familyId ? `?familyId=${familyId}` : '';
      const response = await apiClient.get(`/patients${params}`);
      return response.data;
    },
    enabled: !!familyId,
  });
};

export const usePatientById = (id: string) => {
  return useQuery({
    queryKey: ['patients', id],
    queryFn: async () => {
      const response = await apiClient.get(`/patients/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreatePatientRequest) => {
      const response = await apiClient.post('/patients', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Patient> }) => {
      const response = await apiClient.patch(`/patients/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};

// ==================== APPOINTMENT HOOKS ====================
export const useAppointments = (filters?: { status?: string; dueDate?: string }) => {
  return useQuery({
    queryKey: ['appointments', filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters as any || {}).toString();
      const response = await apiClient.get(
        `/appointments${params ? `?${params}` : ''}`
      );
      return response.data;
    },
  });
};

export const useAppointmentById = (id: string) => {
  return useQuery({
    queryKey: ['appointments', id],
    queryFn: async () => {
      const response = await apiClient.get(`/appointments/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateAppointmentRequest) => {
      const response = await apiClient.post('/appointments', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Appointment> }) => {
      const response = await apiClient.patch(`/appointments/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

// ==================== CARELOG (VITAL SIGNS) HOOKS ====================
export const useCareLogs = (appointmentId?: string) => {
  return useQuery({
    queryKey: ['carelogs', appointmentId],
    queryFn: async () => {
      const params = appointmentId ? `?appointmentId=${appointmentId}` : '';
      const response = await apiClient.get(`/carelog${params}`);
      return response.data;
    },
    enabled: !!appointmentId,
  });
};

export const useCareLogById = (id: string) => {
  return useQuery({
    queryKey: ['carelogs', id],
    queryFn: async () => {
      const response = await apiClient.get(`/carelog/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateCareLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateCareLogRequest) => {
      const response = await apiClient.post('/carelog', data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['carelogs', variables.appointmentId] });
    },
  });
};

export const useUpdateCareLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CareLog> }) => {
      const response = await apiClient.patch(`/carelog/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carelogs'] });
    },
  });
};

// ==================== ACTIVITYLOG HOOKS ====================
export const useActivityLogs = (careLogId?: string) => {
  return useQuery({
    queryKey: ['activitylogs', careLogId],
    queryFn: async () => {
      const params = careLogId ? `?careLogId=${careLogId}` : '';
      const response = await apiClient.get(`/activitylog${params}`);
      return response.data;
    },
    enabled: !!careLogId,
  });
};

export const useCreateActivityLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateActivityLogRequest) => {
      const response = await apiClient.post('/activitylog', data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['activitylogs', variables.careLogId] });
    },
  });
};

// ==================== PAYMENT HOOKS ====================
export const useCreatePayment = () => {
  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const response = await apiClient.post(`/payment/${appointmentId}`);
      return response.data;
    },
  });
};
