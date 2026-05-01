import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/lib/auth-context';
import { toast } from 'sonner';

/**
 * Hook to handle session timeout with warning
 *
 * Features:
 * - Tracks user inactivity
 * - Shows warning when 5 minutes remain
 * - Auto-logs out when session expires
 * - Resets timer on user activity
 */
export function useSessionTimeout() {
  const { logout, isAuthenticated } = useAuthStore();
  const sessionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningShownRef = useRef(false);

  // Session duration from backend (1 hour for dev, 1 day for prod)
  // Using 1 hour (60 min) as safer default for testing
  const SESSION_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
  const WARNING_TIME = 55 * 60 * 1000; // Show warning at 55 minutes (5 min before expiry)
  const RESET_TIME = 50 * 60 * 1000; // Reset timer after 50 minutes of inactivity

  const resetTimer = () => {
    // Only reset if user is authenticated
    if (!isAuthenticated()) {
      return;
    }

    // Clear existing timers
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Reset warning flag
    warningShownRef.current = false;

    // Set warning timeout (show at 55 min)
    warningTimeoutRef.current = setTimeout(() => {
      if (!warningShownRef.current) {
        warningShownRef.current = true;
        toast.warning(
          'Your session will expire in 5 minutes. Please save your work.',
          {
            duration: 8000,
          }
        );
      }
    }, WARNING_TIME);

    // Set logout timeout (auto-logout at 60 min)
    sessionTimeoutRef.current = setTimeout(() => {
      toast.error('Session expired. Please log in again.');
      logout();
    }, SESSION_DURATION);
  };

  const handleUserActivity = () => {
    resetTimer();
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      return;
    }

    // Initialize timer on mount
    resetTimer();

    // Listen for user activity events
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    events.forEach((event) => {
      document.addEventListener(event, handleUserActivity);
    });

    // Cleanup function
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleUserActivity);
      });

      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, [isAuthenticated()]);
}
