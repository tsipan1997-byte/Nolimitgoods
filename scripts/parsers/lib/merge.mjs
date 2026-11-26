// Злиття результатів джерел із попереднім lots.json: статуси active → closed/sold, архів результатів.

import { validateLot } from './model.mjs';

const DAY = 86400e3;

/**
 * @param {{lots?:any[], auctions?:any[], sources?:Record<string,any>}|null} prev   попередній lots.json
 * @param {{id:string, ok:boolean, error?:string, durationMs:number, lots:any[], auctions:any[]}[]} results  результати джерел цього запуску
 * @param {{now?:Date, archiveDays?:number, graceMs?:number, banned?:Set<string>}} [opt]
 * @returns {{feed:{generatedAt:string, sources:Record<string,any>, auctions:any[], lots:any[]}, archived:any[], stats:Record<string,number>}}
 */
export function mergeFeed(prev, results, opt = {}) {
  const now = opt.now || new Date();
  const t = now.getTime();
  const iso = now.toISOString();
  const archiveMs = (opt.archiveDays ?? 30) * DAY;
  const grace = opt.graceMs ?? 2 * 3600e3; // живі торги: лот «закривається» через 2 год після дня торгів
  const banned = opt.banned || new Set();
  const stats = { new: 0, updated: 0, closed: 0, sold: 0, expired: 0, archived: 0, dropped: 0, invalid: 0 };

  const prevLots = new Map((prev?.lots || []).map((l) => [l.sourceId, l]));
  const okSources = new Set(results.filter((r) => r.ok).map((r) => r.id));
  const lots = new Map();

  // 1) свіжі лоти з успішних джерел
  for (const r of results) {
    if (!r.ok) continue;
    for (const l of r.lots) {
      if (l.category == null || banned.has(l.house)) { stats.dropped++; continue; }
      if (validateLot(l).length) { stats.invalid++; continue; }
      const old = prevLots.get(l.sourceId);
      if (old) {
        stats.updated++;
        l.firstSeenAt = old.firstSeenAt || l.firstSeenAt;
        // ручні правки назви українською, якщо колись додамо, не затираємо оригіналом
        if (old.titleLocked) { l.title = old.title; l.titleLocked = true; }
      } else stats.new++;
      lots.set(l.sourceId, l);
    }
  }

  // 2) лоти з попереднього файлу, яких немає в цьому запуску
  for (const [id, old] of prevLots) {
    if (lots.has(id)) continue;
    const l = { ...old };
    if (okSources.has(l.source) && l.status === 'active') {
      // джерело відпрацювало, а лота в каталозі вже немає → торги по ньому завершились
      l.status = l.soldPrice ? 'sold' : 'closed';
      l.closedAt = iso;
      stats[l.status]++;
    }
    lots.set(id, l);
  }

  // 3) минув час закриття → closed/sold (навіть якщо сайт ще показує лот)
  for (const l of lots.values()) {
    if (l.status === 'active' && l.endsAt && l.endsAt + grace < t) {
      l.status = l.soldPrice ? 'sold' : 'closed';
      l.closedAt = l.closedAt || iso;
      stats.expired++;
    }
  }

  // 4) архів: закриті/продані старші за archiveDays
  const archived = [];
  for (const [id, l] of lots) {
    if (l.status === 'active') continue;
    // дата торгів, а якщо її немає — коли лот зник з каталогу
    const when = l.endsAt || Date.parse(l.closedAt || l.lastSeenAt || 0) || 0;
    if (when && when < t - archiveMs) { archived.push(l); lots.delete(id); stats.archived++; }
  }

  // 5) аукціони: свіжі від успішних джерел + попередні від тих, що впали/не запускались; лише ті, де лишились лоти
  const auctions = new Map();
  for (const a of prev?.auctions || []) if (!okSources.has(a.source)) auctions.set(a.id, a);
  for (const r of results) if (r.ok) for (const a of r.auctions) auctions.set(a.id, a);
  const used = new Set([...lots.values()].map((l) => l.auction));
  const auctionList = [...auctions.values()].filter((a) => used.has(a.id) && !banned.has(a.house));

  const sources = { ...(prev?.sources || {}) };
  for (const r of results) {
    sources[r.id] = { ok: r.ok, count: r.ok ? r.lots.filter((l) => l.category != null).length : 0, ...(r.error ? { error: r.error } : {}), durationMs: r.durationMs, at: iso };
  }

  const sorted = [...lots.values()].sort((a, b) => (a.status === 'active' ? 0 : 1) - (b.status === 'active' ? 0 : 1) || (a.endsAt || 9e15) - (b.endsAt || 9e15) || a.sourceId.localeCompare(b.sourceId));
  return { feed: { generatedAt: iso, sources, auctions: auctionList, lots: sorted }, archived, stats };
}

/** Додає закриті лоти в архів (без дублів, новіші перезаписують старі). */
export function appendArchive(prevArchive, archived, now = new Date()) {
  const map = new Map((prevArchive?.lots || []).map((l) => [l.sourceId, l]));
  for (const l of archived) map.set(l.sourceId, l);
  return { updatedAt: now.toISOString(), lots: [...map.values()].sort((a, b) => (b.endsAt || 0) - (a.endsAt || 0)) };
}
