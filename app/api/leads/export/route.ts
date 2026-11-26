export const dynamic = 'force-dynamic';

// Експорт заявок партнера в CSV (White Label).
// GET /api/leads/export?from=2026-12-01&to=2026-12-31
//   Authorization: Bearer <токен>   (або ?token=<токен>)
// Партнер — за Host; токен — значення env, назва якої в lib/tenants.ts → leads.csvExportTokenEnv.
// Заявки беруться зі сховища KV (lib/lead-store.ts).

import { timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';
import { envOf } from '@/lib/tenants';
import { getTenantFromRequest } from '@/lib/tenant-server';
import { leadStoreConfigured, leadsToCsv, listLeads } from '@/lib/lead-store';

function sameToken(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

function parseDay(v: string | null, endOfDay: boolean): number | null {
  if (!v || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return null;
  const t = Date.parse(`${v}T${endOfDay ? '23:59:59.999' : '00:00:00.000'}Z`);
  return Number.isFinite(t) ? t : null;
}

export async function GET(request: Request) {
  const tenant = getTenantFromRequest(request);
  const expected = envOf(tenant.leads.csvExportTokenEnv);
  if (!expected) {
    return NextResponse.json({ error: 'export_disabled' }, { status: 404 });
  }

  const url = new URL(request.url);
  const auth = request.headers.get('authorization') || '';
  const given = auth.startsWith('Bearer ') ? auth.slice(7).trim() : url.searchParams.get('token') || '';
  if (!given || !sameToken(given, expected)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  if (!leadStoreConfigured()) {
    return NextResponse.json({ error: 'store_not_configured' }, { status: 503 });
  }

  const from = parseDay(url.searchParams.get('from'), false);
  const to = parseDay(url.searchParams.get('to'), true);
  let leads = await listLeads(tenant.id);
  leads = leads.filter((l) => {
    const t = Date.parse(l.createdAt);
    return (from === null || t >= from) && (to === null || t <= to);
  });

  const day = new Date().toISOString().slice(0, 10);
  return new NextResponse(leadsToCsv(leads), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="leads-${tenant.id}-${day}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
