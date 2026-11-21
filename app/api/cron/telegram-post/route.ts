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

// План на день по годинах (UTC). Іван: більше екскаваторів, гідромолотів/навісного — мінімум.
// 4 слоти з 8 — екскаватори/екскаватори-навантажувачі; одна «додаткова» година по черзі віддається
// навісному, гідромолотам, генераторам або пікапам (кожне — раз на 4 дні).
const SLOT_PLAN: Record<number, string> = {
  7: 'excavators', 8: 'telehandlers', 9: 'excavators', 10: 'agro',
  11: 'excavators', 12: 'trucks', 13: 'excavators', 14: 'extra',
};
const EXTRA_ROTATION = ['pickups', 'attachments', 'energy', 'breakers'];
const ALL_CATS = ['excavators', 'telehandlers', 'agro', 'trucks', 'pickups', 'energy', 'attachments', 'breakers'];

// Ключ моделі: «Unused 2026 JWB JWB2000 — Hydraulic Breaker…» → «jwb jwb2000».
// Однакові моделі (5 однакових нових гідромолотів, 3 однакові JCB 3CX) постимо лише раз.
function modelKey(original: string): string {
  const head = original.split(' — ')[0].replace(/\bunused\b/gi, '').replace(/\b(19|20)\d{2}\b/g, '');
  const words = head.toLowerCase().replace(/[^a-z0-9а-яіїєґ\s]/gi, ' ').split(/\s+/).filter(Boolean);
  return words.slice(0, 2).join(' ') || original.toLowerCase();
}

function categoryFor(slot: number, now: number): string {
  const c = SLOT_PLAN[slot] ?? 'excavators';
  if (c !== 'extra') return c;
  return EXTRA_ROTATION[Math.floor(now / 86_400_000) % EXTRA_ROTATION.length];
}

function pickLots(done: Set<string>, now: number, slot: number, limit = 1): AuctionLot[] {
  const used = new Set<string>();
  const open = AUCTION_LOTS.filter(
    (l) => l.img && (!l.inoperable || l.category === 'pickups') && l.endsAt > now + 24 * 3_600_000 && ALL_CATS.includes(l.category)
      && !done.has(marker(lotPost(l).key)) && !done.has(marker(`title:${l.original}`)) && !done.has(marker(`model:${modelKey(l.original)}`))
  );
  // Спершу живі (б/у) машини, нові «Unused» — після; всередині — свіжіші роки
  open.sort((a, b) => Number(a.unused) - Number(b.unused) || (b.year ?? 0) - (a.year ?? 0));
  const out: AuctionLot[] = [];
  for (let i = 0; out.length < limit && i < 8; i++) {
    const cat = categoryFor(((slot - 7 + i) % 8) + 7, now);
    // якщо в категорії порожньо — екскаватори, потім будь-що
    for (const c of [cat, 'excavators', ...ALL_CATS]) {
      const l = open.find((x) => x.category === c && !used.has(modelKey(x.original)));
      if (l) { used.add(modelKey(l.original)); out.push(l); break; }
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
    ...pickLots(done, now, Number(params.get('slot')) || new Date(now).getUTCHours(), n).map(lotPost),
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
      if (p.title) {
        await put(marker(`title:${p.title}`), new Date().toISOString(), { access: 'public', addRandomSuffix: false, contentType: 'text/plain' });
        await put(marker(`model:${modelKey(p.title)}`), new Date().toISOString(), { access: 'public', addRandomSuffix: false, contentType: 'text/plain' });
      }
      sent.push(p.key);
      await new Promise((r) => setTimeout(r, 3000)); // не спамимо: пауза між постами
    } catch (e) {
      failed.push(`${p.key}: ${(e as Error).message}`);
    }
  }
  console.log('[tg-post]', JSON.stringify({ n, picked: posts.length, sent, failed }));
  return NextResponse.json({ sent, failed });
}
