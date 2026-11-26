// ============================================================================
// ШАР ДАНИХ ЛОТІВ (адаптер). Звідки сайт бере лоти — по черзі:
//  1. LOTS_FEED_URL — JSON від автопарсера (Vercel Blob / будь-який HTTPS), ISR: кеш на
//     LOTS_REVALIDATE_SECONDS (за замовчуванням 3600 с), скидання — POST /api/lots/revalidate.
//  2. lib/lots-feed.json — той самий формат, комітиться workflow-ом парсера (варіант «коміт → деплой»).
//  3. Поточні lib/auction-*.ts (AUCTION_LOTS) — як зараз, якщо фід порожній або недоступний.
// Формат фіду: scripts/parsers/README.md (lots.json: { generatedAt, sources, auctions, lots }).
// LOTS_FEED_MODE: 'merge' (за замовчуванням: фід + статичні лоти, фід перемагає на дублях) | 'replace'.
// Лише для server-компонентів і API: client-компоненти й надалі імпортують AUCTION_LOTS напряму,
// поки сторінки не переведені на getLots() (див. docs/white-label-spec.md, розділ «Автопарсер»).
// ============================================================================

import localFeed from './lots-feed.json';
import {
  AUCTIONS,
  AUCTION_LOTS,
  NO_UKRAINE_EXPORT,
  type AuctionCategory,
  type AuctionInfo,
  type AuctionLot,
} from './auction-lots';

export type FeedLot = Partial<AuctionLot> & {
  auction: string;
  item: string;
  title: string;
  category: AuctionCategory | null;
  status?: 'active' | 'sold' | 'closed';
  house?: string;
  source?: string;
};

export type LotsFeed = {
  generatedAt: string | null;
  sources?: Record<string, { ok: boolean; count: number; error?: string; durationMs?: number }>;
  auctions: AuctionInfo[];
  lots: FeedLot[];
};

export type LotsResult = {
  source: 'remote' | 'feed' | 'static';
  generatedAt: string | null;
  auctions: AuctionInfo[];
  lots: AuctionLot[];
};

export const LOTS_CACHE_TAG = 'lots';
const DAY = 24 * 60 * 60 * 1000;

function toLot(f: FeedLot): AuctionLot | null {
  if (!f.category || !f.auction || !f.item || !f.title) return null;
  return {
    auction: f.auction,
    lot: f.lot ?? '',
    item: String(f.item),
    title: f.title,
    original: f.original ?? f.title,
    category: f.category,
    year: f.year ?? null,
    hours: f.hours ?? null,
    miles: f.miles ?? null,
    specs: f.specs ?? '',
    unused: Boolean(f.unused),
    inoperable: Boolean(f.inoperable),
    location: f.location ?? '',
    endsAt: Number(f.endsAt) || 0,
    live: Boolean(f.live),
    img: f.img ?? '',
    ...(f.gallery?.length ? { gallery: f.gallery } : {}),
    ...(f.engine ? { engine: f.engine } : {}),
    url: f.url ?? '',
  };
}

/** Відбір з фіду: тільки активні, не прострочені, без аукціонів із забороною експорту в Україну. */
export function feedToLots(feed: LotsFeed, now = Date.now()): { lots: AuctionLot[]; auctions: AuctionInfo[] } {
  const auctions = (feed.auctions || []).filter((a) => !NO_UKRAINE_EXPORT.has(a.house));
  const banned = new Set((feed.auctions || []).filter((a) => NO_UKRAINE_EXPORT.has(a.house)).map((a) => a.id));
  const lots: AuctionLot[] = [];
  for (const f of feed.lots || []) {
    if ((f.status ?? 'active') !== 'active') continue;
    if (f.house && NO_UKRAINE_EXPORT.has(f.house)) continue;
    if (banned.has(f.auction)) continue;
    if (f.endsAt && Number(f.endsAt) < now - DAY) continue;
    const l = toLot(f);
    if (l) lots.push(l);
  }
  return { lots, auctions };
}

function combine(feed: LotsFeed, source: 'remote' | 'feed'): LotsResult {
  const { lots, auctions } = feedToLots(feed);
  if (process.env.LOTS_FEED_MODE === 'replace') {
    return { source, generatedAt: feed.generatedAt, lots, auctions };
  }
  const key = (l: Pick<AuctionLot, 'auction' | 'item'>) => `${l.auction}:${l.item}`;
  const seen = new Set(lots.map(key));
  const auctionIds = new Set(auctions.map((a) => a.id));
  return {
    source,
    generatedAt: feed.generatedAt,
    lots: [...lots, ...AUCTION_LOTS.filter((l) => !seen.has(key(l)))],
    auctions: [...auctions, ...AUCTIONS.filter((a) => !auctionIds.has(a.id) && !NO_UKRAINE_EXPORT.has(a.house))],
  };
}

function staticResult(): LotsResult {
  return { source: 'static', generatedAt: null, lots: AUCTION_LOTS, auctions: AUCTIONS.filter((a) => !NO_UKRAINE_EXPORT.has(a.house)) };
}

async function fetchRemote(url: string): Promise<LotsFeed | null> {
  try {
    const revalidate = Number(process.env.LOTS_REVALIDATE_SECONDS) || 3600;
    const res = await fetch(url, { next: { revalidate, tags: [LOTS_CACHE_TAG] } });
    if (!res.ok) {
      console.error(`Lots feed ${res.status}`);
      return null;
    }
    const data = (await res.json()) as LotsFeed;
    return Array.isArray(data?.lots) ? data : null;
  } catch (err: any) {
    console.error('Lots feed failed:', err?.message || 'error');
    return null;
  }
}

/** Лоти для сайту. Ніколи не кидає помилку: у гіршому разі — поточні статичні лоти. */
export async function getLots(): Promise<LotsResult> {
  const url = process.env.LOTS_FEED_URL;
  if (url) {
    const remote = await fetchRemote(url);
    if (remote && remote.lots.length) return combine(remote, 'remote');
  }
  const local = localFeed as unknown as LotsFeed;
  if (local?.lots?.length) return combine(local, 'feed');
  return staticResult();
}
