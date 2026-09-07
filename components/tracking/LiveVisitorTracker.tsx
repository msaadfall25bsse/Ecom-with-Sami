'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return '';
  try {
    let vid = sessionStorage.getItem('sami_vid');
    if (!vid) {
      vid = `v_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem('sami_vid', vid);
    }
    return vid;
  } catch {
    return `v_${Date.now()}`;
  }
}

/**
 * Hostinger MySQL Realtime Live Visitor Tracker.
 * - Unique device identification (even on shared Wi-Fi).
 * - Instant increment on page open (+1).
 * - Instant decrement on tab close / leave (-1).
 * - Zero Supabase dependency.
 */
export function LiveVisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const visitorId = getOrCreateVisitorId();
    if (!visitorId) return;

    const sendPing = () => {
      try {
        const payload = JSON.stringify({
          visitorId,
          page: window.location.pathname,
          action: 'ping',
        });

        if (navigator.sendBeacon) {
          const blob = new Blob([payload], { type: 'application/json' });
          navigator.sendBeacon('/api/analytics/heartbeat', blob);
        } else {
          fetch('/api/analytics/heartbeat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            keepalive: true,
          }).catch(() => {});
        }
      } catch {
        // Silent catch
      }
    };

    const sendLeave = () => {
      try {
        const payload = JSON.stringify({
          visitorId,
          action: 'leave',
        });

        if (navigator.sendBeacon) {
          const blob = new Blob([payload], { type: 'application/json' });
          navigator.sendBeacon('/api/analytics/heartbeat', blob);
        } else {
          fetch('/api/analytics/heartbeat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            keepalive: true,
          }).catch(() => {});
        }
      } catch {
        // Silent catch
      }
    };

    // 1. Initial Ping when device enters page
    sendPing();

    // 2. Periodic Ping every 8 seconds while tab is active
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        sendPing();
      }
    }, 8000);

    // 3. Instant Leave trigger when tab is closed, navigated away, or phone browser closed
    window.addEventListener('beforeunload', sendLeave);
    window.addEventListener('pagehide', sendLeave);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', sendLeave);
      window.removeEventListener('pagehide', sendLeave);
    };
  }, [pathname]);

  return null;
}
