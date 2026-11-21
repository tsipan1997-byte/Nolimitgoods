// Результати аукціонів: за скільки реально пішли лоти.
// Джерела: (1) лоти на сайті, торги яких закінчились, + остання ставка з auction-prices.json;
// (2) lib/auction-archive.json — знімок старих результатів, щоб вони не зникали, коли ми оновлюємо лоти.
// Оновити архів: npx tsx scripts/archive-results.ts (робіть перед заміною лотів у auction-lots.ts).

import archive from './auction-archive.json';
import { AUCTIONS, AUCTION_LOTS, type AuctionCategory, type AuctionLot } from './auction-lots';
import { lotPrice } from './auction-prices';

export type AuctionResult = {
  auction: string;
  house: string;
  item: string;
  lot: string;
  title: string;
  original: string;
  category: AuctionCategory;
  year: number | null;
  hours: number | null;
  miles?: number | null;
  img: string;
  closedAt: number;
  bid: number; // фінальна ставка (ціна молотка), £ без збору аукціону
  bids: number;
  unreserved: boolean; // без резервної ціни — отже лот продано за цю ставку
};

const AUCTION_BY_ID = Object.fromEntries(AUCTIONS.map((a) => [a.id, a]));

function closed(l: AuctionLot, now: number) {
  return l.live ? l.endsAt + 10 * 3_600_000 <= now : l.endsAt <= now;
}

// УВАГА: ставки з auction-prices.json — проміжні (знімаються під час торгів), фінальну ціну
// Ritchie Bros показує лише зареєстрованим покупцям. Тому автоматично з них результати НЕ рахуємо:
// вони занижені (напр. JCB 540-140 «£45» при 69 реальних ставках). Результати додаємо в архів
// лише перевірені вручну (з поля verified: true).
export const LIVE_RESULTS_ENABLED = false;

export function liveResults(now = Date.now()): AuctionResult[] {
  if (!LIVE_RESULTS_ENABLED) return [];
  const out: AuctionResult[] = [];
  for (const l of AUCTION_LOTS) {
    if (!closed(l, now)) continue;
    const p = lotPrice(l.auction, l.lot);
    if (!p || !p.bid || !p.bids) continue;
    const a = AUCTION_BY_ID[l.auction];
    out.push({
      auction: l.auction,
      house: a?.house ?? '',
      item: l.item,
      lot: l.lot,
      title: l.title,
      original: l.original,
      category: l.category,
      year: l.year,
      hours: l.hours,
      miles: l.miles ?? null,
      img: l.img,
      closedAt: l.endsAt,
      bid: p.bid,
      bids: p.bids,
      unreserved: a?.unreserved ?? false,
    });
  }
  return out;
}

export function allResults(now = Date.now()): AuctionResult[] {
  const map = new Map<string, AuctionResult>();
  for (const r of archive as (AuctionResult & { verified?: boolean })[]) if (r.verified) map.set(`${r.auction}:${r.item}`, r);
  for (const r of liveResults(now)) map.set(`${r.auction}:${r.item}`, r);
  return [...map.values()].sort((a, b) => b.closedAt - a.closedAt || b.bid - a.bid);
}

// «JCB 3CX», «Caterpillar 320», «Toyota Hilux» — для зведеної таблиці цін
export function modelKey(original: string) {
  const name = original
    .replace(/^Quantity of\s*\(\d+\)\s*/i, '')
    .replace(/^(Unused\s+)?\d{4}\s+/i, '')
    .replace(/\s+—.*$/, '');
  return name.split(/\s+/).slice(0, 2).join(' ');
}

export type PriceStat = { key: string; count: number; min: number; median: number; max: number; years: string; sample: AuctionResult };

export function priceStats(results: AuctionResult[], by: (r: AuctionResult) => string = (r) => modelKey(r.original)): PriceStat[] {
  const groups = new Map<string, AuctionResult[]>();
  for (const r of results) {
    const k = by(r);
    groups.set(k, [...(groups.get(k) || []), r]);
  }
  return [...groups.entries()]
    .map(([key, rs]) => {
      const bids = rs.map((r) => r.bid).sort((a, b) => a - b);
      const ys = rs.map((r) => r.year).filter(Boolean) as number[];
      return {
        key,
        count: rs.length,
        min: bids[0],
        median: bids[Math.floor(bids.length / 2)],
        max: bids[bids.length - 1],
        years: ys.length ? (Math.min(...ys) === Math.max(...ys) ? String(ys[0]) : `${Math.min(...ys)}–${Math.max(...ys)}`) : '',
        sample: rs.find((r) => r.img) ?? rs[0],
      };
    })
    .sort((a, b) => b.count - a.count || b.median - a.median);
}
