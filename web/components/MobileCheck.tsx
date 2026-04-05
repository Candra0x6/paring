'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function MobileCheck() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkDevice = () => {
      // Don't redirect if we are already on the mobile-only page or landing page
      if (pathname === '/mobile-only' || pathname === '/') return;

      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      
      // Simple check for mobile devices
      const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      
      // Also check screen width as a fallback
      const isSmallScreen = window.innerWidth <= 768;

      if (!isMobile && !isSmallScreen) {
        router.push('/mobile-only');
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, [pathname, router]);

  return null;
}
