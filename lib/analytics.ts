type Params = Record<string, string | number | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/** Sends a conversion event to GTM/GA4 and the Facebook pixel, when they are loaded. */
export function trackEvent(name: 'generate_lead' | 'whatsapp_click' | 'catalog_request', params: Params = {}) {
  if (typeof window === 'undefined') return;
  window.dataLayer?.push({ event: name, ...params });
  window.gtag?.('event', name, params);
  if (name === 'generate_lead' || name === 'catalog_request') window.fbq?.('track', 'Lead', params);
  if (name === 'whatsapp_click') window.fbq?.('track', 'Contact', params);
}
