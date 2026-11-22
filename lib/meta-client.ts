// Клієнтська частина відстеження Meta: fbclid з рекламного кліку і подія Lead
// з event_id для дедуплікації з серверною (Conversions API) подією.
// fbclid тримаємо лише в памʼяті сторінки — нічого не пишемо в cookie чи storage.

let fbc = '';
let landingTag: string | null = null;

// Звідки людина прийшла на сайт (utm, fbclid/gclid, сайт-реферер). Запамʼятовуємо
// при першому завантаженні, бо після переходів по сайту з адреси це зникає.
function readLandingTag(): string {
  const parts: string[] = [];
  const params = new URLSearchParams(window.location.search);
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((k) => {
    const v = params.get(k);
    if (v) parts.push(`${k}=${v.slice(0, 60)}`);
  });
  if (params.get('fbclid')) parts.push('fbclid=yes');
  if (params.get('gclid')) parts.push('gclid=yes');
  try {
    const host = document.referrer ? new URL(document.referrer).hostname : '';
    if (host && host !== window.location.hostname) parts.push(`ref=${host}`);
  } catch {
    /* ignore */
  }
  return parts.join(' ');
}

// Мітка для поля source заявки, наприклад «fbclid=yes ref=lm.facebook.com».
export function trafficTag(): string {
  if (typeof window === 'undefined') return '';
  if (landingTag === null) {
    try {
      landingTag = readLandingTag();
    } catch {
      landingTag = '';
    }
  }
  return landingTag;
}

// Викликається при завантаженні сторінки (MetaTracking у layout): якщо людина
// прийшла з реклами, в URL є fbclid — запамʼятовуємо його до кінця сесії вкладки.
export function captureFbclid() {
  if (typeof window === 'undefined') return;
  trafficTag();
  try {
    const id = new URLSearchParams(window.location.search).get('fbclid');
    if (id) fbc = `fb.1.${Date.now()}.${id.slice(0, 250)}`;
  } catch {
    /* ignore */
  }
}

export function getFbc(): string {
  if (fbc) return fbc;
  captureFbclid();
  return fbc;
}

// Pixel Lead з тим самим eventID, що йде в /api/lead як leadId.
export function trackLead(leadId: string, data: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  const w = window as any;
  if (typeof w.fbq === 'function') w.fbq('track', 'Lead', data, { eventID: leadId });
}
