// ============================================================================
// META CONVERSIONS API (серверні події)
// Піксель у браузері вимкнений, доки відвідувач не натисне «Прийняти» в
// cookie-банері, тому більшість заявок Meta не бачить. Ці події йдуть із
// сервера напряму в Meta: без cookie, з тим самим event_id, що й піксель,
// тож якщо піксель теж спрацював, Meta рахує подію один раз.
//
// Потрібна змінна META_CAPI_TOKEN на Vercel (Events Manager → піксель →
// Settings → Conversions API → Generate access token). Без неї — нічого не шле.
// META_TEST_EVENT_CODE (необовʼязково) — щоб події падали у вкладку Test events.
// ============================================================================

import { createHash } from 'crypto';
import { envOf, type Tenant } from './tenants';
import { getTenantFromRequest } from './tenant-server';

// Pixel ID і токен — з конфігу партнера (lib/tenants.ts → analytics). Для NoLimitGoods:
// піксель 1667641475157850 і META_CAPI_TOKEN, як і раніше.
const API_VERSION = 'v21.0';
const TIMEOUT_MS = 3000;

export type MetaEventInput = {
  eventName: 'Lead' | 'Contact';
  eventId: string;
  page?: string;
  request: Request;
  fbc?: string;
  contact?: string;
  customData?: Record<string, string | number | undefined>;
};

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

// Контакт із форми: телефон, @telegram або email. Хешуємо тільки телефон і email.
function contactUserData(contact: string | undefined): { ph?: string[]; em?: string[] } {
  const c = (contact || '').trim();
  if (!c) return {};
  const email = c.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);
  if (email) return { em: [sha256(email[0].toLowerCase())] };
  if (/^@|t\.me\//i.test(c)) return {};
  let digits = c.replace(/[^0-9]/g, '');
  if (digits.length < 9 || digits.length > 15) return {};
  // Локальні формати → міжнародний: 0XXXXXXXXX (UA) і 07XXXXXXXXX (UK)
  if (digits.length === 10 && digits.startsWith('0')) digits = '38' + digits;
  else if (digits.length === 11 && digits.startsWith('07')) digits = '44' + digits.slice(1);
  return { ph: [sha256(digits)] };
}

function cookie(request: Request, name: string): string | undefined {
  const raw = request.headers.get('cookie') || '';
  const m = raw.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : undefined;
}

function sourceUrl(siteUrl: string, page: string | undefined): string {
  if (!page) return siteUrl;
  if (/^https?:\/\//.test(page)) return page.slice(0, 500);
  return siteUrl + (page.startsWith('/') ? page : `/${page}`).slice(0, 400);
}

// Ніколи не кидає помилку і не логує токен: заявка клієнта важливіша за статистику.
export async function sendMetaEvent(input: MetaEventInput, tenantOverride?: Tenant): Promise<boolean> {
  const tenant = tenantOverride ?? getTenantFromRequest(input.request);
  const pixelId = tenant.analytics.metaPixelId;
  const token = envOf(tenant.analytics.metaCapiTokenEnv);
  if (!pixelId || !token) return false;

  try {
    const h = input.request.headers;
    const ip = (h.get('x-forwarded-for') || h.get('x-real-ip') || '').split(',')[0].trim();
    const ua = h.get('user-agent') || '';
    const fbc = (input.fbc || cookie(input.request, '_fbc') || '').slice(0, 300);
    const fbp = cookie(input.request, '_fbp');

    const userData: Record<string, unknown> = { ...contactUserData(input.contact) };
    if (ip) userData.client_ip_address = ip;
    if (ua) userData.client_user_agent = ua.slice(0, 500);
    if (/^fb\.1\.\d+\./.test(fbc)) userData.fbc = fbc;
    if (fbp) userData.fbp = fbp;

    const customData = Object.fromEntries(
      Object.entries(input.customData || {}).filter(([, v]) => v !== undefined && v !== '')
    );

    const body: Record<string, unknown> = {
      data: [
        {
          event_name: input.eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: input.eventId.slice(0, 100),
          event_source_url: sourceUrl(tenant.siteUrl, input.page),
          action_source: 'website',
          user_data: userData,
          custom_data: customData,
        },
      ],
    };
    const testCode = process.env.META_TEST_EVENT_CODE;
    if (testCode) body.test_event_code = testCode;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(
        `https://graph.facebook.com/${API_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(token)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: controller.signal,
        }
      );
      if (!res.ok) {
        const text = (await res.text()).slice(0, 300);
        console.error(`Meta CAPI ${input.eventName} ${res.status}: ${text}`);
        return false;
      }
      return true;
    } finally {
      clearTimeout(timer);
    }
  } catch (err: any) {
    console.error(`Meta CAPI ${input.eventName} failed:`, err?.name || 'error');
    return false;
  }
}
