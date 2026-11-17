// Тимчасовий службовий маршрут (гілка media-b64, не production): віддає фото лотів з каталогів аукціонів
// у base64 для монтажу контенту. Лише дозволені хости.
import { NextResponse } from 'next/server';

const ALLOWED = /^https:\/\/(cdn\.ironpla\.net|[a-z0-9.-]*euroauctions\.com|[a-z0-9.-]*rbauction\.[a-z.]+|[a-z0-9.-]*ritchiebros\.com)\//;

export async function GET(req: Request) {
  const urls = new URL(req.url).searchParams.getAll('u').filter((u) => ALLOWED.test(u)).slice(0, 40);
  const out: Record<string, string | null> = {};
  await Promise.all(
    urls.map(async (u) => {
      try {
        const r = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        out[u] = r.ok ? Buffer.from(await r.arrayBuffer()).toString('base64') : null;
      } catch {
        out[u] = null;
      }
    }),
  );
  return NextResponse.json(out);
}
