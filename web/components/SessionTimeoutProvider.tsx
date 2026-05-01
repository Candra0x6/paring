'use client';

import { useSessionTimeout } from '@/hooks/useSessionTimeout';

/**
 * Provider component that wraps the app with session timeout protection
 *
 * This component uses the useSessionTimeout hook to:
 * - Monitor user inactivity
 * - Show warning before session expires
 * - Auto-logout when session expires
 *
 * Place this near the root of the app
 */
export function SessionTimeoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize session timeout hook
  useSessionTimeout();

  // Just render children - the hook handles everything
  return <>{children}</>;
}
