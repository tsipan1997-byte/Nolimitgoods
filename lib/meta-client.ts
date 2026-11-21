// Клієнтська частина відстеження Meta: fbclid з рекламного кліку і подія Lead
// з event_id для дедуплікації з серверною (Conversions API) подією.
// fbclid тримаємо лише в памʼяті сторінки — нічого не пишемо в cookie чи storage.

let fbc = '';

// Викликається при завантаженні сторінки (MetaTracking у layout): якщо людина
// прийшла з реклами, в URL є fbclid — запамʼятовуємо його до кінця сесії вкладки.
export function captureFbclid() {
  if (typeof window === 'undefined') return;
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
