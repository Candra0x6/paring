import { create } from 'zustand';

interface AuthState {
  userRole: 'FAMILY' | 'NURSE' | 'ADMIN' | null;
  userId: string | null;
  email: string | null;

  setAuth: (role: string, userId: string, email: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  initializeFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  userRole: null,
  userId: null,
  email: null,

  setAuth: (role, userId, email) => {
    set({ userRole: role as any, userId, email });
    localStorage.setItem('userRole', role);
    localStorage.setItem('userId', userId);
    localStorage.setItem('email', email);
  },

  logout: () => {
    set({ userRole: null, userId: null, email: null });
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    window.location.href = '/login';
  },

  isAuthenticated: () => get().userRole !== null,

  initializeFromStorage: () => {
    if (typeof window !== 'undefined') {
      const userRole = localStorage.getItem('userRole');
      const userId = localStorage.getItem('userId');
      const email = localStorage.getItem('email');

      if (userRole && userId && email) {
        set({ userRole: userRole as any, userId, email });
      }
    }
  },
}));
