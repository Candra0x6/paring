'use client';

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { queryClient } from '@/lib/react-query';
import { AuthInitializer } from '@/components/AuthInitializer';
import { SessionTimeoutProvider } from '@/components/SessionTimeoutProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionTimeoutProvider>
        <AuthInitializer />
        {children}
        <Toaster position="top-right" richColors />
        <ReactQueryDevtools initialIsOpen={false} />
      </SessionTimeoutProvider>
    </QueryClientProvider>
  );
}
