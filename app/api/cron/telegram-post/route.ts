// Автопостинг у Telegram-канал: щодня кілька нових лотів (з фото) і свіжі «продано за £X».
// Пише той самий бот, що приймає заявки (TELEGRAM_BOT_TOKEN), у канал TELEGRAM_CHANNEL_ID (@назва або -100…).
// Що вже опубліковано — позначки у Vercel Blob: state/tg/<ключ>. Повторів не буде.
// Перевірка без публікації: GET /api/cron/telegram-post?dry=1 з заголовком Authorization: Bearer <CRON_SECRET>.
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

import { NextResponse } from 'next/server';
import { list, put } from '@vercel/blob';
import { AUCTION_LOTS, type AuctionLot } from '@/lib/auction-lots';
import { allResults } from '@/lib/auction-results';
import { lotPost, soldPost, type TgPost } from '@/lib/telegram-post';

const LOTS_PER_RUN = 4;
const SOLD_PER_RUN = 2;
const marker = (key: string) => `state/tg/${key.replace(/[^a-zA-Z0-9-]/g, '_')}`;

async function postedKeys(): Promise<Set<string>> {
  const out = new Set<string>();
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: 'state/tg/', cursor, limit: 1000 });
    page.blobs.forEach((b) => out.add(b.pathname));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return out;
}

// Різні категорії по черзі, свіжіші роки першими, без несправних
function pickLots(done: Set<string>, now: number): AuctionLot[] {
  const open = AUCTION_LOTS.filter((l) => l.img && !l.inoperable && l.endsAt > now && !done.has(marker(lotPost(l).key)));
  const byCat = new Map<string, AuctionLot[]>();
  for (const l of open.sort((a, b) => (b.year ?? 0) - (a.year ?? 0))) byCat.set(l.category, [...(byCat.get(l.category) || []), l]);
  const out: AuctionLot[] = [];
  while (out.length < LOTS_PER_RUN && [...byCat.values()].some((v) => v.length)) {
    for (const v of byCat.values()) if (v.length && out.length < LOTS_PER_RUN) out.push(v.shift()!);
  }
  return out;
}

async function send(token: string, chat: string, p: TgPost) {
  const res = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chat,
      photo: p.photo,
      caption: p.caption.slice(0, 1024),
      parse_mode: 'HTML',
      reply_markup: { inline_keyboard: [[{ text: p.button, url: p.url }]] },
    }),
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok || !j.ok) throw new Error(j.description || `HTTP ${res.status}`);
}

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const dry = new URL(req.url).searchParams.get('dry') === '1';
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHANNEL_ID;
  if (!dry && (!token || !chat)) return NextResponse.json({ error: 'TELEGRAM_BOT_TOKEN or TELEGRAM_CHANNEL_ID is not set' }, { status: 500 });

  const now = Date.now();
  const done = await postedKeys();
  const posts: TgPost[] = [
    ...pickLots(done, now).map(lotPost),
    ...allResults(now)
      .filter((r) => r.img && now - r.closedAt < 7 * 86_400_000)
      .map(soldPost)
      .filter((p) => !done.has(marker(p.key)))
      .slice(0, SOLD_PER_RUN),
  ];

  if (dry) return NextResponse.json({ dry: true, count: posts.length, posts });

  const sent: string[] = [];
  const failed: string[] = [];
  for (const p of posts) {
    try {
      await send(token!, chat!, p);
      await put(marker(p.key), new Date().toISOString(), { access: 'public', addRandomSuffix: false, contentType: 'text/plain' });
      sent.push(p.key);
      await new Promise((r) => setTimeout(r, 3000)); // не спамимо: пауза між постами
    } catch (e) {
      failed.push(`${p.key}: ${(e as Error).message}`);
    }
  }
  return NextResponse.json({ sent, failed });
}
