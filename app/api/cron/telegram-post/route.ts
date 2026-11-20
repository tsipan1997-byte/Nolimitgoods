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

// Крон запускає пост щогодини у робочий час (vercel.json: 07–14 UTC = 9:00–16:00 за Києвом), по 1 лоту — 8 лотів на день. Вручну можна ?n=1..4
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

// Пріоритетні категорії по черзі, свіжіші роки першими, без несправних (крім пікапів — биті на запчастини теж потрібні) і без лотів, що закриваються менше ніж за добу
const CATEGORY_PRIORITY = ['excavators', 'telehandlers', 'agro', 'trucks', 'energy', 'breakers', 'attachments', 'pickups'];
function pickLots(done: Set<string>, now: number, limit = LOTS_PER_RUN): AuctionLot[] {
  const open = AUCTION_LOTS.filter(
    (l) => l.img && (!l.inoperable || l.category === 'pickups') && l.endsAt > now + 24 * 3_600_000 && CATEGORY_PRIORITY.includes(l.category) && !done.has(marker(lotPost(l).key))
  );
  const byCat = new Map<string, AuctionLot[]>(CATEGORY_PRIORITY.map((c) => [c, []]));
  for (const l of open.sort((a, b) => (b.year ?? 0) - (a.year ?? 0))) byCat.get(l.category)!.push(l);
  // День тижня зсуває старт, щоб щодня першою була інша категорія
  const shift = new Date(now).getUTCDay() % CATEGORY_PRIORITY.length;
  const order = [...CATEGORY_PRIORITY.slice(shift), ...CATEGORY_PRIORITY.slice(0, shift)];
  // Пікапи — не частіше ніж через день (Іван: основне — техніка, пікапів 1–2, не більше)
  if (Math.floor(now / 86_400_000) % 2 === 1) byCat.set('pickups', []);
  const out: AuctionLot[] = [];
  // Однакові лоти (напр. кілька нових однакових гідромолотів) не постимо повторно
  const seen = new Set<string>();
  for (const [c, v] of byCat) {
    byCat.set(c, v.filter((l) => {
      const t = marker(`title:${l.original}`);
      if (done.has(t) || seen.has(t)) return false;
      seen.add(t);
      return true;
    }));
  }
  while (out.length < limit && order.some((c) => byCat.get(c)!.length)) {
    for (const c of order) {
      const v = byCat.get(c)!;
      if (v.length && out.length < limit) out.push(v.shift()!);
    }
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
  const params = new URL(req.url).searchParams;
  const dry = params.get('dry') === '1';
  const n = Math.min(4, Math.max(1, Number(params.get('n')) || 1));
  // Разовий запуск лише в указану дату (?only=YYYY-MM-DD) — для додаткових постів у конкретний день
  const only = params.get('only');
  if (only && only !== new Date().toISOString().slice(0, 10)) return NextResponse.json({ skipped: `only ${only}` });
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHANNEL_ID;
  if (!dry && (!token || !chat)) return NextResponse.json({ error: 'TELEGRAM_BOT_TOKEN or TELEGRAM_CHANNEL_ID is not set' }, { status: 500 });

  const now = Date.now();
  const done = await postedKeys();
  const posts: TgPost[] = [
    ...pickLots(done, now, n).map(lotPost),
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
      if (p.title) await put(marker(`title:${p.title}`), new Date().toISOString(), { access: 'public', addRandomSuffix: false, contentType: 'text/plain' });
      sent.push(p.key);
      await new Promise((r) => setTimeout(r, 3000)); // не спамимо: пауза між постами
    } catch (e) {
      failed.push(`${p.key}: ${(e as Error).message}`);
    }
  }
  console.log('[tg-post]', JSON.stringify({ n, picked: posts.length, sent, failed }));
  return NextResponse.json({ sent, failed });
}
