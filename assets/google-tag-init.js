const GOOGLE_ADS_ID = 'AW-18519737603';
const canonical = document.querySelector('link[rel="canonical"]')?.href || window.location.href;
let pageLocation = 'https://tigalaksanajaya.com/';
try {
  const url = new URL(canonical);
  url.search = '';
  url.hash = '';
  pageLocation = url.href;
} catch {
  // Keep the safe canonical fallback.
}

window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function gtag(){ window.dataLayer.push(arguments); };
window.gtag('js', new Date());
window.gtag('config', GOOGLE_ADS_ID, {
  page_location: pageLocation,
});
