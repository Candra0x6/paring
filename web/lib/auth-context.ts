import { create } from 'zustand';

interface AuthState {
  userRole: 'FAMILY' | 'NURSE' | 'ADMIN' | null;
  userId: string | null;
  email: string | null;
  isInitialized: boolean;
  isLoading: boolean;

  setAuth: (role: string, userId: string, email: string, token?: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  initializeFromStorage: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  userRole: null,
  userId: null,
  email: null,
  isInitialized: false,
  isLoading: false,

  setAuth: (role: string, userId: string, email: string, token?: string) => {
    set({ userRole: role as any, userId, email, isLoading: false });
    localStorage.setItem('userRole', role);
    localStorage.setItem('userId', userId);
    localStorage.setItem('email', email);
    if (token) {
      localStorage.setItem('access_token', token);
      // Also set a non-httpOnly cookie so Next.js middleware can read it
      // but client-side can also manage it during login/logout
      document.cookie = `access_token=${token}; path=/; SameSite=Lax`;
    }
  },

  logout: () => {
    set({ userRole: null, userId: null, email: null, isLoading: false });
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('access_token');
    // Clear the cookie
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax';
    window.location.href = '/login';
  },

  isAuthenticated: () => get().userRole !== null,

  initializeFromStorage: () => {
    if (typeof window !== 'undefined') {
      const userRole = localStorage.getItem('userRole');
      const userId = localStorage.getItem('userId');
      const email = localStorage.getItem('email');

      if (userRole && userId && email) {
        set({ userRole: userRole as any, userId, email, isInitialized: true });
      } else {
        set({ isInitialized: true });
      }
    }
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },
}));
