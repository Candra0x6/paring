import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'sonner';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Include cookies for auth
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth metadata
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const userRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('access_token');
    
    if (userRole) {
      config.headers['X-User-Role'] = userRole;
    }
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<any>) => {
    if (error.response?.status === 401) {
      // Session expired - clear auth state completely
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      localStorage.removeItem('email');
      localStorage.removeItem('access_token');
      // Clear the cookie
      document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax';
      toast.error('Session expired. Please login again.');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    if (error.response?.status === 403) {
      // Forbidden - user doesn't have permission
      const message =
        error.response?.data?.message || 'You do not have permission to access this resource';
      toast.error(message);
    }

    if (error.response?.status === 409) {
      // Conflict - typically duplicate email
      const message =
        error.response?.data?.message || 'This email already exists';
      toast.error(message);
    }

    if (error.response?.status === 400) {
      // Validation error
      const message =
        error.response?.data?.message || 'Please check your input';
      toast.error(message);
    }

    if (error.response?.status === 500) {
      toast.error('Server error. Please try again later.');
    }

    if (!error.response) {
      toast.error('Network error. Please check your connection.');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
