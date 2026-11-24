// Копіює фото лотів аукціонів у наше сховище Vercel Blob (lots/<auction>-<item>.jpg),
// щоб вони лишались на сайті й після торгів (сайти аукціонів прибирають старі фото).
// Запускає Vercel Cron раз на день (vercel.json). Вручну: GET /api/cron/mirror-photos з заголовком
// Authorization: Bearer <CRON_SECRET>. Вже скопійовані фото пропускає.
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

import { NextResponse } from 'next/server';
import { list, put } from '@vercel/blob';
import { AUCTION_LOTS } from '@/lib/auction-lots';
import { allResults } from '@/lib/auction-results';
import { lotPhotoPath } from '@/lib/lot-photos';

const MAX_PER_RUN = 400;
const CONCURRENCY = 6;

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: 'BLOB_READ_WRITE_TOKEN is not set' }, { status: 500 });
  }

  // що вже є у сховищі
  const have = new Set<string>();
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: 'lots/', cursor, limit: 1000 });
    page.blobs.forEach((b) => have.add(b.pathname));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  const wanted = new Map<string, string>();
  // Копіюємо лише лоти, торги яких закінчуються протягом 3 днів (або вже закінчились): поки торги
  // далеко, сайт показує оригінальне фото аукціону, а копія потрібна тільки для архіву результатів.
  // Так сховище не витрачає операції на лоти, які можуть ще зникнути з сайту.
  const soon = Date.now() + 3 * 86_400_000;
  for (const l of AUCTION_LOTS) if (l.img && l.endsAt <= soon) wanted.set(lotPhotoPath(l.auction, l.item), l.img);
  for (const r of allResults()) if (r.img) wanted.set(lotPhotoPath(r.auction, r.item), r.img);
  const todo = [...wanted.entries()].filter(([p]) => !have.has(p)).slice(0, MAX_PER_RUN);

  let copied = 0;
  const failed: string[] = [];
  const started = Date.now();
  for (let i = 0; i < todo.length; i += CONCURRENCY) {
    if (Date.now() - started > (maxDuration - 30) * 1000) break; // наступний запуск докопіює решту
    await Promise.all(
      todo.slice(i, i + CONCURRENCY).map(async ([pathname, src]) => {
        try {
          const res = await fetch(src, { headers: { 'User-Agent': 'Mozilla/5.0 (NoLimitGoods photo archive)' } });
          if (!res.ok) throw new Error(String(res.status));
          const body = Buffer.from(await res.arrayBuffer());
          await put(pathname, body, {
            access: 'public',
            addRandomSuffix: false,
            contentType: res.headers.get('content-type') || 'image/jpeg',
            cacheControlMaxAge: 31536000,
          });
          copied++;
        } catch (e) {
          failed.push(`${pathname}: ${(e as Error).message}`);
        }
      })
    );
  }

  return NextResponse.json({ total: wanted.size, alreadyStored: have.size, copied, failed: failed.length, failedSample: failed.slice(0, 10) });
}
