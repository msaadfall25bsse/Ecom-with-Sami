// Client-side analytics event tracker for conversions, clicks, and pageviews

export interface AnalyticsEventData {
  contact_channel?: string;
  action?: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

export const analytics = {
  trackContact: (data: AnalyticsEventData) => {
    try {
      if (typeof window !== 'undefined') {
        // Facebook Pixel contact tracking
        if ((window as any).fbq) {
          (window as any).fbq('track', 'Contact', data);
        }
        // TikTok Pixel contact tracking
        if ((window as any).ttq) {
          (window as any).ttq.track('Contact', data);
        }
        // Google Analytics 4 event tracking
        if ((window as any).gtag) {
          (window as any).gtag('event', 'contact', data);
        }
      }
    } catch (err) {
      console.warn('[Analytics] Failed to track contact event:', err);
    }
  },

  trackEvent: (eventName: string, data?: AnalyticsEventData) => {
    try {
      if (typeof window !== 'undefined') {
        if ((window as any).fbq) {
          (window as any).fbq('trackCustom', eventName, data);
        }
        if ((window as any).ttq) {
          (window as any).ttq.track(eventName, data);
        }
        if ((window as any).gtag) {
          (window as any).gtag('event', eventName, data);
        }
      }
    } catch (err) {
      console.warn(`[Analytics] Failed to track ${eventName}:`, err);
    }
  },

  trackInitiateCheckout: (data?: AnalyticsEventData) => {
    try {
      if (typeof window !== 'undefined') {
        if ((window as any).fbq) {
          (window as any).fbq('track', 'InitiateCheckout', data);
        }
        if ((window as any).ttq) {
          (window as any).ttq.track('InitiateCheckout', data);
        }
        if ((window as any).gtag) {
          (window as any).gtag('event', 'begin_checkout', data);
        }
      }
    } catch (err) {
      console.warn('[Analytics] Failed to track InitiateCheckout:', err);
    }
  }
};

export default analytics;
