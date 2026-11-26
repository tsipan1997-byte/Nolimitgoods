// Визначення партнера на сервері (server-компоненти, generateMetadata, API).
//
// Режими (див. docs/white-label-spec.md, розділ «Режими розгортання»):
//  1. TENANT_ID=<id>            — один бренд на деплой (окремий Vercel-проєкт на партнера). Сторінки
//                                 лишаються статичними (SSG/ISR).
//  2. TENANT_HOST_ROUTING=1     — один деплой на всіх, бренд за Host (middleware ставить x-tenant-id).
//                                 Сторінки рендеряться динамічно, бо читають заголовки запиту.
//  3. нічого не задано          — завжди NoLimitGoods, заголовки не читаються → основний сайт
//                                 збирається і працює рівно як раніше.
// У `next dev` режим 2 увімкнено за замовчуванням, щоб перевіряти Host: demo.localhost.

import { headers } from 'next/headers';
import { DEFAULT_TENANT, tenantByHost, tenantById, type Tenant } from './tenants';

export const TENANT_HEADER = 'x-tenant-id';

export function hostRoutingEnabled(): boolean {
  return process.env.TENANT_HOST_ROUTING === '1' || process.env.NODE_ENV === 'development';
}

/** Партнер для server-компонентів і generateMetadata. */
export function getTenant(): Tenant {
  const fixed = process.env.TENANT_ID;
  if (fixed) return tenantById(fixed);
  if (!hostRoutingEnabled()) return DEFAULT_TENANT;
  try {
    const h = headers();
    const id = h.get(TENANT_HEADER);
    if (id) return tenantById(id);
    return tenantByHost(h.get('x-forwarded-host') || h.get('host'));
  } catch {
    // поза контекстом запиту (наприклад, під час статичної збірки)
    return DEFAULT_TENANT;
  }
}

/** Партнер для Route Handlers: за об'єктом Request (не залежить від headers()). */
export function getTenantFromRequest(request: Request): Tenant {
  const fixed = process.env.TENANT_ID;
  if (fixed) return tenantById(fixed);
  const id = request.headers.get(TENANT_HEADER);
  if (id) return tenantById(id);
  return tenantByHost(request.headers.get('x-forwarded-host') || request.headers.get('host'));
}
