'use client';

import { useEffect, useRef } from 'react';
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

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  try {
    let sid = sessionStorage.getItem('sami_sid');
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem('sami_sid', sid);
    }
    return sid;
  } catch {
    return `s_${Date.now()}`;
  }
}

/**
 * Hostinger MySQL Realtime Live Visitor & Shopify-Style Session Tracker.
 * - Records unique live visitors (+1 on open, -1 on close).
 * - Records Shopify-style daily sessions and funnel pageviews.
 * - Zero Supabase. 100% Hostinger MySQL.
 */
export function LiveVisitorTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const visitorId = getOrCreateVisitorId();
    const sessionId = getOrCreateSessionId();
    if (!visitorId) return;

    const currentPath = window.location.pathname;

    const sendPayload = (action: 'ping' | 'leave' | 'pageview') => {
      try {
        const payload = JSON.stringify({
          visitorId,
          sessionId,
          page: currentPath,
          action,
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

    // 1. If user navigates to a new page or first load, send a pageview action
    if (lastTrackedPath.current !== currentPath) {
      lastTrackedPath.current = currentPath;
      sendPayload('pageview');
    }

    // 2. Initial live visitor ping
    sendPayload('ping');

    // 3. Periodic Ping every 8 seconds while tab is active
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        sendPayload('ping');
      }
    }, 8000);

    // 4. Instant Leave trigger when tab is closed, navigated away, or phone browser closed
    const onLeave = () => sendPayload('leave');
    window.addEventListener('beforeunload', onLeave);
    window.addEventListener('pagehide', onLeave);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', onLeave);
      window.removeEventListener('pagehide', onLeave);
    };
  }, [pathname]);

  return null;
}
