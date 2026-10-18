export const GOOGLE_ADS_ID = 'AW-18519737603';

// Official TLJ label supplied for "Klik WhatsApp Tiga Laksana Jaya".
export const WHATSAPP_CONVERSION_LABEL = 'ZyVwCP7q36AdEIOK8_5E';

export function canonicalPageLocation(value) {
  try {
    const url = new URL(value, 'https://tigalaksanajaya.com/');
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return 'https://tigalaksanajaya.com/';
    url.search = '';
    url.hash = '';
    return url.href;
  } catch {
    return 'https://tigalaksanajaya.com/';
  }
}

export function isWhatsAppUrl(value) {
  try {
    const url = new URL(value, 'https://tigalaksanajaya.com/');
    const hostname = url.hostname.toLowerCase();
    return url.protocol === 'https:' && (hostname === 'wa.me' || hostname === 'api.whatsapp.com');
  } catch {
    return false;
  }
}

export function createWhatsAppConversionTracker({
  gtag,
  conversionLabel = WHATSAPP_CONVERSION_LABEL,
  pageLocation,
  eventCallback = () => {},
} = {}) {
  const label = String(conversionLabel || '').trim();
  const location = canonicalPageLocation(pageLocation);

  return function trackWhatsAppConversion() {
    if (!label || typeof gtag !== 'function') return false;
    try {
      gtag('event', 'conversion', {
        send_to: `${GOOGLE_ADS_ID}/${label}`,
        page_location: location,
        event_callback: eventCallback,
      });
      return true;
    } catch {
      return false;
    }
  };
}

export function initWhatsAppTracking(doc = globalThis.document, win = globalThis.window) {
  if (!doc || !win || doc.documentElement?.dataset.whatsAppTrackingReady === 'true') return;
  if (doc.documentElement) doc.documentElement.dataset.whatsAppTrackingReady = 'true';

  const canonical = doc.querySelector('link[rel="canonical"]')?.href || win.location?.href;
  const track = () => createWhatsAppConversionTracker({
    gtag: win.gtag,
    conversionLabel: WHATSAPP_CONVERSION_LABEL,
    pageLocation: canonical,
    eventCallback: () => {},
  })();

  doc.addEventListener('click', (event) => {
    const link = event.target?.closest?.('a[href]');
    if (link && isWhatsAppUrl(link.href)) track();
  }, { capture: true });

  doc.addEventListener('submit', (event) => {
    const form = event.target;
    if (!form?.matches?.('form[data-whatsapp-form]')) return;
    if (typeof form.checkValidity === 'function' && !form.checkValidity()) return;
    if (isWhatsAppUrl(form.dataset.whatsappUrl || '')) track();
  }, { capture: true });
}

if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  initWhatsAppTracking(document, window);
}
