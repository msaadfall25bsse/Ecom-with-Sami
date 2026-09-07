'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Lightweight real-time visitor tracker.
 * Sends non-blocking heartbeats to keep live visitor counts in sync with GA4.
 * Zero database impact.
 */
export function LiveVisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const sendPing = () => {
      try {
        const payload = JSON.stringify({ path: window.location.pathname });
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/analytics/heartbeat', payload);
        } else {
          fetch('/api/analytics/heartbeat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            keepalive: true,
          }).catch(() => {});
        }
      } catch {
        // Silent catch for resilience
      }
    };

    // Initial pageview ping
    sendPing();

    // Periodic heartbeat every 40s while tab is active
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        sendPing();
      }
    }, 40000);

    return () => clearInterval(interval);
  }, [pathname]);

  return null;
}
