// Запуск одного джерела: HTTP-контекст, нормалізація, валідація. Використовують run.mjs і test.mjs.

import fs from 'node:fs';
import path from 'node:path';
import { createHttp, OfflineStore, RecordStore } from './http.mjs';
import { normalizeLot, normalizeAuction, validateLot } from './model.mjs';

export function logger(prefix, verbose = !!process.env.PARSERS_VERBOSE) {
  const line = (lvl, a) => `[${new Date().toISOString()}] ${lvl} ${prefix} ${a.join(' ')}`;
  return {
    info: (...a) => console.log(line('INFO', a)),
    warn: (...a) => console.warn(line('WARN', a)),
    error: (...a) => console.error(line('ERR ', a)),
    debug: (...a) => { if (verbose) console.log(line('DBG ', a)); },
  };
}

export const readJson = (p) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; } };
export const writeJson = (p, v) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(v, null, 1) + '\n'); };
export const withTimeout = (p, ms, what) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error(`${what}: перевищено ${Math.round(ms / 1000)} с`)), ms).unref())]);

/** Запускає одне джерело й повертає нормалізований результат. Помилки не кидає. */
export async function runSource(src, { limit = Infinity, offlineDir, saveDir, browser, now = new Date(), log = logger(src.id) } = {}) {
  const started = Date.now();
  const http = createHttp({
    log,
    offline: offlineDir ? new OfflineStore(path.join(offlineDir, src.id)) : null,
    record: saveDir ? new RecordStore(path.join(saveDir, src.id)) : null,
  });
  const ctx = { ...http, log, limit, offline: !!offlineDir, getBrowser: () => (browser && !offlineDir ? browser.get() : Promise.resolve(null)), now };
  const res = { source: src.id, house: src.house, name: src.name, ok: false, startedAt: new Date(started).toISOString(), durationMs: 0, counts: {}, warnings: [], auctions: [], lots: [] };
  try {
    let rawAuctions = [];
    let rawLots = [];
    if (src.run) {
      const r = await src.run(ctx);
      rawAuctions = r.auctions || [];
      rawLots = (r.lots || []).map((l) => ({ l, a: rawAuctions.find((x) => x.id === l.auction) || {} }));
    } else {
      rawAuctions = await src.listAuctions(ctx);
      log.info(`аукціонів: ${rawAuctions.length}`);
      for (const a of rawAuctions) {
        if (rawLots.length >= limit) break;
        try {
          const ls = await src.listLots(a, { ...ctx, limit: limit - rawLots.length });
          log.info(`${a.id}: лотів ${ls.length}`);
          for (const l of ls) rawLots.push({ l, a });
        } catch (e) {
          // один каталог не валить усе джерело
          log.warn(`${a.id}: ${e.message}`);
          res.warnings.push(`${a.id}: ${e.message}`);
        }
      }
      if (rawAuctions.length && !rawLots.length && res.warnings.length) throw new Error(`усі каталоги з помилкою: ${res.warnings[0]}`);
    }
    const meta = { source: src.id, house: src.house, tz: src.tz };
    res.auctions = rawAuctions.map((a) => normalizeAuction(a, { ...meta, currency: a.currency || src.currency }));
    for (const { l, a } of rawLots.slice(0, limit)) {
      const n = normalizeLot({ ...l, auction: l.auction || a.id }, { ...meta, currency: a.currency || src.currency, baseUrl: src.baseUrl, location: a.location || a.place, live: a.live, now });
      const errs = validateLot(n);
      if (errs.length) { res.warnings.push(`${n.sourceId}: невалідні поля ${errs.join(',')}`); continue; }
      res.lots.push(n);
    }
    // аукціон без totalLots — рахуємо зібрані
    for (const a of res.auctions) if (!a.totalLots) a.totalLots = res.lots.filter((l) => l.auction === a.id).length;
    res.ok = true;
  } catch (e) {
    res.error = e.message;
    log.error(e.stack || e.message);
  }
  res.durationMs = Date.now() - started;
  res.finishedAt = new Date().toISOString();
  res.httpRequests = http.stats().requests;
  res.counts = { auctions: res.auctions.length, lots: res.lots.length, matched: res.lots.filter((l) => l.category != null).length };
  return res;
}

