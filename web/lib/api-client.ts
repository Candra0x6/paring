import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'sonner';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Include cookies for auth
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<any>) => {
    if (error.response?.status === 401) {
      // Session expired
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      localStorage.removeItem('email');
      toast.error('Session expired. Please login again.');
      window.location.href = '/login';
      return Promise.reject(error);
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
