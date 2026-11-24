// Дані аукціонів для головної сторінки — рахуються на сервері під час збирання сайту.
// Клієнтські блоки головної отримують лише цей короткий зріз через props, а не весь масив лотів
// (~1 МБ), тож браузер не завантажує всі лоти, щоб показати кілька лічильників і плиток.

import { AUCTIONS, AUCTION_CALENDAR, AUCTION_LOTS, type AuctionLot, type CalendarItem } from './auction-lots';
import type { AuctionCategory } from './auction-core';
import { allResults, type AuctionResult } from './auction-results';

export type TeaserTile = { href: string; label: string; img: string; n: number };
export type FeedLot = Pick<AuctionLot, 'item' | 'img' | 'title' | 'year' | 'miles' | 'hours' | 'endsAt'>;

export type HomeLots = {
  total: number; // скільки лотів на сайті
  byAuction: Record<string, number>; // кількість лотів по кожному аукціону
  calendar: CalendarItem[];
  tiles: TeaserTile[]; // плитки категорій з фото
  feed: FeedLot[]; // стрічка «скоро торги»
  closings: number[]; // моменти закриття лотів (унікальні, за зростанням) — для відліку «До торгів»
  sold: AuctionResult[]; // блок «за скільки продали»
  soldTotal: number;
};

const TILES: { href: string; label: string; pick: (l: AuctionLot) => boolean; count: (l: AuctionLot) => boolean }[] = [
  { href: '/pikapy-z-anglii', label: 'Пікапи', pick: (l) => /Hilux/.test(l.original) && (l.year ?? 0) >= 2022, count: (l) => l.category === 'pickups' },
  { href: '/samoskydy-z-anglii', label: 'Самоскиди', pick: (l) => l.category === 'trucks' && (l.year ?? 0) >= 2021, count: (l) => l.category === 'trucks' },
  { href: '/heneratory-z-anglii', label: 'Генератори', pick: (l) => l.category === 'energy' && !!l.year, count: (l) => l.category === 'energy' },
  { href: '/traktory-z-anglii', label: 'Трактори', pick: (l) => l.category === 'agro' && /Tractor/.test(l.original), count: (l) => l.category === 'agro' },
  { href: '/ekskavatory-z-anglii', label: 'Екскаватори', pick: (l) => l.category === 'excavators' && /Excavator/.test(l.original), count: (l) => l.category === 'excavators' },
  { href: '/teleskopichni-navantazhuvachi-z-anglii', label: 'Телескопи', pick: (l) => l.category === 'telehandlers', count: (l) => l.category === 'telehandlers' },
  { href: '/jcb-3cx-z-anglii', label: 'JCB 3CX', pick: (l) => /3CX/.test(l.original), count: (l) => /3CX|4CX|backhoe/i.test(l.original) },
  { href: '/gidromoloty-z-anglii', label: 'Гідромолоти', pick: (l) => l.category === 'breakers', count: (l) => l.category === 'breakers' },
];

// Для блоку проданих: тільки техніка (без ковшів, молотів, генераторів)
const SOLD_ORDER: AuctionCategory[] = ['agro', 'excavators', 'telehandlers', 'trucks', 'pickups'];

// По черзі з кожної категорії — найдорожчі лоти, щоб у стрічці були і трактори, і екскаватори, і телескопи
function pickSold(all: AuctionResult[], n: number): AuctionResult[] {
  const byCat = SOLD_ORDER.map((c) => all.filter((r) => r.category === c).sort((a, b) => b.bid - a.bid));
  const out: AuctionResult[] = [];
  for (let i = 0; out.length < n && byCat.some((l) => l[i]); i++) for (const l of byCat) if (l[i] && out.length < n) out.push(l[i]);
  return out;
}

export function homeLots(): HomeLots {
  const byAuction: Record<string, number> = {};
  for (const l of AUCTION_LOTS) byAuction[l.auction] = (byAuction[l.auction] || 0) + 1;

  const tiles: TeaserTile[] = [];
  for (const t of TILES) {
    const lot = AUCTION_LOTS.find((l) => l.img && t.pick(l));
    if (lot) tiles.push({ href: t.href, label: t.label, img: lot.img, n: AUCTION_LOTS.filter(t.count).length });
  }

  const feed = (['pickups', 'trucks', 'excavators', 'telehandlers', 'agro', 'energy'] as const)
    .map((c) => AUCTION_LOTS.filter((l) => l.category === c && l.img && !l.inoperable).sort((a, b) => (b.year ?? 0) - (a.year ?? 0))[0])
    .filter(Boolean)
    .map((l): FeedLot => ({ item: l.item, img: l.img, title: l.title, year: l.year, miles: l.miles ?? null, hours: l.hours, endsAt: l.endsAt }));

  const known = new Set(AUCTIONS.map((a) => a.id));
  const builtAt = Date.now(); // лоти, що закрились до збирання сайту, для відліку не потрібні
  const closings = [...new Set(AUCTION_LOTS.filter((l) => known.has(l.auction) && l.endsAt > builtAt).map((l) => l.endsAt))].sort((a, b) => a - b);

  const results = allResults().filter((r) => SOLD_ORDER.includes(r.category));

  return {
    total: AUCTION_LOTS.length,
    byAuction,
    calendar: AUCTION_CALENDAR,
    tiles,
    feed,
    closings,
    sold: pickSold(results.filter((r) => r.img), 8),
    soldTotal: results.length,
  };
}
