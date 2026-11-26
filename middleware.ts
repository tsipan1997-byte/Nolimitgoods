// White Label: визначаємо партнера за Host і передаємо його далі заголовком x-tenant-id.
// Для основного домену NoLimitGoods middleware нічого не змінює.

import { NextResponse, type NextRequest } from 'next/server';
import { PARTS_PATH_PREFIXES, tenantByHost, tenantById } from './lib/tenants';

export function middleware(request: NextRequest) {
  const fixed = process.env.TENANT_ID;
  const tenant = fixed ? tenantById(fixed) : tenantByHost(request.headers.get('x-forwarded-host') || request.headers.get('host'));

  if (tenant.isDefault) {
    // Не довіряємо x-tenant-id від клієнта: на основному домені завжди NoLimitGoods.
    if (!request.headers.has('x-tenant-id')) return NextResponse.next();
    const h = new Headers(request.headers);
    h.set('x-tenant-id', tenant.id);
    return NextResponse.next({ request: { headers: h } });
  }

  const { pathname } = request.nextUrl;

  // Партнер — це аукціонний портал: розділ запчастин NoLimitGoods у нього вимкнено.
  if (!tenant.features.parts) {
    if (PARTS_PATH_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
      const url = request.nextUrl.clone();
      url.pathname = '/aukciony';
      url.search = '';
      return NextResponse.redirect(url);
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-tenant-id', tenant.id);

  // Головна партнера = аукціонний портал
  if (!tenant.features.parts && pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/aukciony';
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  const res = NextResponse.next({ request: { headers: requestHeaders } });
  if (!tenant.seo.indexable) res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return res;
}

export const config = {
  // Усе, крім статики Next.js і файлів з розширенням
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.[a-zA-Z0-9]+$).*)'],
};
