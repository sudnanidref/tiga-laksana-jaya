import assert from 'node:assert/strict';
import {
  GOOGLE_ADS_ID,
  WHATSAPP_CONVERSION_LABEL,
  canonicalPageLocation,
  createWhatsAppConversionTracker,
  initWhatsAppTracking,
  isWhatsAppUrl,
} from '../assets/whatsapp-tracking.js';

assert.equal(GOOGLE_ADS_ID, 'AW-18519737603');
assert.equal(WHATSAPP_CONVERSION_LABEL, 'ZyVwCP7q36AdEIOK8_5E');
assert.equal(isWhatsAppUrl('https://wa.me/6285781226277?text=secret'), true);
assert.equal(isWhatsAppUrl('https://api.whatsapp.com/send?phone=6285781226277&text=secret'), true);
assert.equal(isWhatsAppUrl('https://example.com/?next=https://wa.me/6285'), false);
assert.equal(isWhatsAppUrl('javascript:alert(1)'), false);
assert.equal(
  canonicalPageLocation('https://tigalaksanajaya.com/kontak/?utm_source=test#form'),
  'https://tigalaksanajaya.com/kontak/'
);

const dormantCalls = [];
const dormant = createWhatsAppConversionTracker({
  gtag: (...args) => dormantCalls.push(args),
  conversionLabel: '',
  pageLocation: 'https://tigalaksanajaya.com/kontak/?gclid=test#form',
});
assert.equal(dormant(), false, 'tracking must remain dormant without an official label');
assert.deepEqual(dormantCalls, [], 'must not send placeholder conversion events');

const calls = [];
const callback = () => {};
const active = createWhatsAppConversionTracker({
  gtag: (...args) => calls.push(args),
  conversionLabel: 'OFFICIAL_TEST_LABEL',
  pageLocation: 'https://tigalaksanajaya.com/kontak/?gclid=private#form',
  eventCallback: callback,
});
assert.equal(active(), true);
assert.equal(calls.length, 1, 'one action must produce one conversion event');
assert.deepEqual(calls[0], [
  'event',
  'conversion',
  {
    send_to: 'AW-18519737603/OFFICIAL_TEST_LABEL',
    page_location: 'https://tigalaksanajaya.com/kontak/',
    event_callback: callback,
  },
]);
const serialized = JSON.stringify(calls);
for (const forbidden of ['wa.me', 'api.whatsapp.com', 'phone', 'email', 'text=', 'gclid', '#form']) {
  assert.equal(serialized.includes(forbidden), false, `payload leaked forbidden data: ${forbidden}`);
}

const blocked = createWhatsAppConversionTracker({
  gtag: () => { throw new Error('blocked'); },
  conversionLabel: 'OFFICIAL_TEST_LABEL',
  pageLocation: 'https://tigalaksanajaya.com/',
});
assert.doesNotThrow(() => blocked(), 'tracking errors must not break navigation or forms');
assert.equal(blocked(), false);

function runInteractionHarness(viewport) {
  const listeners = {};
  const sent = [];
  const doc = {
    documentElement: { dataset: {} },
    querySelector: () => ({ href: 'https://tigalaksanajaya.com/kontak/?utm_source=stub#form' }),
    addEventListener: (type, handler) => { listeners[type] = handler; },
  };
  const win = {
    innerWidth: viewport.width,
    innerHeight: viewport.height,
    location: { href: 'https://tigalaksanajaya.com/kontak/?utm_source=stub#form' },
    gtag: (...args) => sent.push(args),
  };
  initWhatsAppTracking(doc, win);
  assert.equal(sent.length, 0, `${viewport.name}: page load must not send a conversion`);

  const link = { href: 'https://wa.me/6285781226277?text=private', target: '_blank' };
  listeners.click({ target: { closest: () => link } });
  assert.equal(sent.length, 1, `${viewport.name}: one click must send one event`);
  assert.equal(sent[0][2].send_to, 'AW-18519737603/ZyVwCP7q36AdEIOK8_5E');
  assert.equal(sent[0][2].page_location, 'https://tigalaksanajaya.com/kontak/');
  assert.equal(link.target, '_blank', `${viewport.name}: target must remain unchanged`);

  const invalidForm = {
    dataset: { whatsappUrl: 'https://api.whatsapp.com/send?phone=private&text=private' },
    matches: () => true,
    checkValidity: () => false,
  };
  listeners.submit({ target: invalidForm });
  assert.equal(sent.length, 1, `${viewport.name}: invalid form must not convert`);

  const validForm = { ...invalidForm, checkValidity: () => true };
  listeners.submit({ target: validForm });
  assert.equal(sent.length, 2, `${viewport.name}: valid WhatsApp form must send one event`);
  assert.equal(JSON.stringify(sent).includes('private'), false, `${viewport.name}: private form/link data leaked`);
}

runInteractionHarness({ name: 'desktop', width: 1440, height: 900 });
runInteractionHarness({ name: 'mobile', width: 390, height: 844 });

console.log('WhatsApp tracking unit checks passed.');
