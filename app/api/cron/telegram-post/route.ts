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
import { lotPost, soldPost, summaryPost, type TgPost } from '@/lib/telegram-post';

// Крон щогодини 07–16 UTC (9:00–18:00 за Києвом), 10 постів на день, по черзі:
// непарні години — лот на торгах (5 на день), парні — «продано за £X» (5 на день). Лише техніка: без гідромолотів, навісного, пікапів.
// Вручну можна ?n=1..4
const LOT_SLOTS = [7, 9, 11, 13, 15];
const SOLD_SLOTS = [8, 10, 12, 14, 16]; // UTC
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
  7: 'excavators', 9: 'telehandlers', 11: 'excavators', 13: 'extra', 15: 'excavators',
};
const EXTRA_ROTATION = ['agro', 'trucks', 'energy'];
const ALL_CATS = ['excavators', 'telehandlers', 'agro', 'trucks', 'energy'];
// «Продано»: яку категорію шукати першою в кожну парну годину
const SOLD_PLAN: Record<number, string[]> = {
  8: ['excavators'], 10: ['telehandlers', 'excavators'], 12: ['excavators'], 14: ['agro', 'trucks', 'energy', 'telehandlers'], 16: ['excavators', 'telehandlers'],
};

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
    (l) => l.img && !l.inoperable && l.endsAt > now + 24 * 3_600_000 && ALL_CATS.includes(l.category)
      && !done.has(marker(lotPost(l).key)) && !done.has(marker(`title:${l.original}`)) && !done.has(marker(`model:${modelKey(l.original)}`))
  );
  // Спершу живі (б/у) машини, нові «Unused» — після; всередині — свіжіші роки
  open.sort((a, b) => Number(a.unused) - Number(b.unused) || (b.year ?? 0) - (a.year ?? 0));
  const out: AuctionLot[] = [];
  for (let i = 0; out.length < limit && i < 5; i++) {
    const cat = categoryFor(LOT_SLOTS[(Math.max(0, LOT_SLOTS.indexOf(slot)) + i) % 5], now);
    // якщо в категорії порожньо — екскаватори, потім будь-що
    for (const c of [cat, 'excavators', ...ALL_CATS]) {
      const l = open.find((x) => x.category === c && !used.has(modelKey(x.original)));
      if (l) { used.add(modelKey(l.original)); out.push(l); break; }
    }
  }
  return out;
}

// Зведений пост «за скільки пішла техніка» (?kind=summary&auction=rb-nov). Лоти — вручну.
const SUMMARY_PICKS: Record<string, string[]> = {
  'rb-nov': ['160', '172', '170', '175', '164', '188', '116', '64', '90', '72', '264', '442'],
};

async function sendText(token: string, chat: string, p: { text: string; url: string; button: string }) {
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chat,
      text: p.text.slice(0, 4096),
      parse_mode: 'HTML',
      link_preview_options: { is_disabled: true },
      reply_markup: { inline_keyboard: [[{ text: p.button, url: p.url }]] },
    }),
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok || !j.ok) throw new Error(j.description || `HTTP ${res.status}`);
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

  if (params.get('kind') === 'summary') {
    const auction = params.get('auction') || 'rb-nov';
    const p = summaryPost(allResults(now), auction, SUMMARY_PICKS[auction] || []);
    if (dry) return NextResponse.json({ dry: true, post: p });
    if (done.has(marker(p.key))) return NextResponse.json({ skipped: `already posted ${p.key}` });
    try {
      await sendText(token!, chat!, p);
      await put(marker(p.key), new Date().toISOString(), { access: 'public', addRandomSuffix: false, contentType: 'text/plain' });
      console.log('[tg-post]', JSON.stringify({ sent: [p.key] }));
      return NextResponse.json({ sent: [p.key] });
    } catch (e) {
      console.log('[tg-post]', JSON.stringify({ failed: [`${p.key}: ${(e as Error).message}`] }));
      return NextResponse.json({ failed: [`${p.key}: ${(e as Error).message}`] }, { status: 500 });
    }
  }
  const slot = Number(params.get('slot')) || new Date(now).getUTCHours();
  const stamp = () => new Date().toISOString();
  const mark = (k: string) => put(marker(k), stamp(), { access: 'public', addRandomSuffix: false, contentType: 'text/plain' });
  const sent: string[] = [];
  const failed: string[] = [];

  // Лоти: беремо кілька кандидатів; якщо Telegram не бере фото — пробуємо оригінальне фото, далі наступний лот
  const forced = params.get('n') !== null;
  const cands = LOT_SLOTS.includes(slot) || forced ? pickLots(done, now, slot, n + 3) : [];
  const soldCand = () => {
    const order = [...(SOLD_PLAN[slot] ?? []), ...ALL_CATS];
    const pool = allResults(now).filter(
      (r) => r.img && now - r.closedAt < 30 * 86_400_000 && ALL_CATS.includes(r.category)
        && !done.has(marker(soldPost(r).key)) && !done.has(marker(`soldmodel:${modelKey(r.original)}`))
    );
    for (const c of order) {
      const r = pool.filter((x) => x.category === c).sort((a, b) => b.closedAt - a.closedAt || b.bid - a.bid)[0];
      if (r) return r;
    }
    return undefined;
  };
  if (dry) return NextResponse.json({ dry: true, slot, lots: cands.map((l) => l.original), sold: SOLD_SLOTS.includes(slot) ? soldCand()?.original : null });
  let okLots = 0;
  for (const l of cands) {
    if (okLots >= n) break;
    const p = lotPost(l);
    try {
      try { await send(token!, chat!, p); }
      catch (e) {
        if (!/HTTP URL|wrong file|IMAGE_PROCESS|failed to get/i.test((e as Error).message) || !l.img || l.img === p.photo) throw e;
        await send(token!, chat!, { ...p, photo: l.img });
      }
      await mark(p.key);
      if (p.title) { await mark(`title:${p.title}`); await mark(`model:${modelKey(p.title)}`); }
      sent.push(p.key); okLots++;
      await new Promise((r) => setTimeout(r, 3000));
    } catch (e) {
      failed.push(`${p.key}: ${(e as Error).message}`);
      await mark(p.key); // битий лот більше не пробуємо
    }
  }

  // «Продано за £X»: 5 на день у парні години, лише техніка, без повторів моделі
  if (SOLD_SLOTS.includes(slot)) {
    const r = soldCand();
    if (r) {
      const p = soldPost(r);
      try {
        try { await send(token!, chat!, p); }
        catch (e) {
          if (!r.img || r.img === p.photo) throw e;
          await send(token!, chat!, { ...p, photo: r.img });
        }
        await mark(p.key); await mark(`soldmodel:${modelKey(r.original)}`);
        sent.push(p.key);
      } catch (e) {
        failed.push(`${p.key}: ${(e as Error).message}`);
        await mark(p.key);
      }
    }
  }
  console.log('[tg-post]', JSON.stringify({ n, slot, sent, failed }));
  return NextResponse.json({ sent, failed });
}
