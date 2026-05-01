'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/auth-context';

/**
 * Component that initializes authentication from storage
 *
 * This component:
 * 1. Loads auth state from localStorage when app starts
 * 2. Shows a loading state while initializing
 * 3. Prevents flash of unauthenticated content
 *
 * Usage: Place in root layout before main content
 */
export function AuthInitializer() {
  const [isInitialized, setIsInitialized] = useState(false);
  const { initializeFromStorage } = useAuthStore();

  useEffect(() => {
    // Load auth state from storage
    initializeFromStorage();
    // Mark as initialized - content can now render
    setIsInitialized(true);
  }, [initializeFromStorage]);

  // Don't render children until auth is initialized
  // This prevents flash of protected content when user isn't actually logged in
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FBF9F6]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#10B981] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Return null so this component renders nothing once initialized
  return null;
}
