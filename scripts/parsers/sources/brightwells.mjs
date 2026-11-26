// Brightwells (Медлі, Герефордшир, Англія): відділ Plant & Machinery, онлайн-торги з таймером.
// Логіка перенесена з scripts/auction-scrape/scrape-catalogues.mjs і scripts/auto-bids/update-bids.mjs:
//  1) www.brightwells.com/plant-machinery/ — посилання /department/plant-machinery/sale/<id>.
//  2) відкритий API: POST https://api.brightwells.com/api/1/sales/<id>/lots/data {page, perPage}
//     → { lots: [{ id, lotNo, title, currentBid, countOfBids, images, endDate ... }] }.
//     scripts/auto-bids уже ходить у цей API звичайним fetch з Node, браузер не потрібен.

import { defineSource } from '../lib/source.mjs';
import { load, clean, pick, genericLot } from '../lib/extract.mjs';
import { parseDate, auctionId, toNum } from '../lib/model.mjs';

const SITE = 'https://www.brightwells.com';
const DEPT = `${SITE}/plant-machinery/`;
const API = 'https://api.brightwells.com/api/1';

/** Розбір сторінки відділу: id розпродажів. */
export function parseDept(html) {
  const ids = new Set();
  for (const m of html.matchAll(/\/department\/plant-machinery\/sale\/(\d+)(?=["'?#/\s<])/g)) ids.add(m[1]);
  return [...ids];
}

/** Розбір сторінки розпродажу: назва й дати. */
export function parseSalePage(html, saleId) {
  const $ = load(html);
  const title = clean($('h1').first().text()) || clean($('title').text()).replace(/\s*[|–-]\s*Brightwells.*$/i, '');
  const text = clean($('body').text());
  const dates = [...text.matchAll(/\b\d{1,2}(?:st|nd|rd|th)?\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}(?:[^\d]{1,6}\d{1,2}[:.]\d\d\s*(?:am|pm)?)?/gi)].map((m) => parseDate(m[0])).filter(Boolean).sort((a, b) => a - b);
  const startsAt = dates[0] ?? null;
  const endsAt = dates[dates.length - 1] ?? startsAt;
  return {
    id: auctionId('bw', title.replace(/\b(auction|sale|and|&)\b/gi, ' ').trim().split(/\s+/).slice(0, 2).join('-') || 'sale', startsAt) + `-${saleId}`,
    name: title || `Brightwells sale ${saleId}`,
    place: 'Медлі, Герефордшир, Англія',
    startsAt,
    endsAt,
    live: /\blive\b/i.test(text) && !/\btimed\b|online only/i.test(text),
    totalLots: toNum(text.match(/([\d,]+)\s+lots/i)?.[1]) || 0,
    url: `${SITE}/department/plant-machinery/sale/${saleId}`,
    currency: 'GBP',
    location: 'Медлі, Герефордшир',
    _ref: { saleId },
  };
}

/** Один лот з API Brightwells → сирий лот. Експортується для тестів. */
export function lotFromApi(l, auction) {
  const g = genericLot(l);
  const id = String(pick(l, ['id', 'lotId', 'lot_id']) ?? '');
  const imgs = (pick(l, ['images', 'media', 'photos']) || []).map((x) => (typeof x === 'string' ? x : pick(x, ['url', 'large', 'original', 'src', 'path']))).filter(Boolean);
  const status = String(pick(l, ['status', 'lotStatus', 'state']) || '').toLowerCase();
  const sold = toNum(pick(l, ['soldPrice', 'hammerPrice', 'salePrice'])) ?? (/sold/.test(status) ? toNum(pick(l, ['currentBid'])) : null);
  return {
    ...g,
    auction: auction.id,
    item: id,
    lot: String(pick(l, ['lotNo', 'lotNumber']) ?? ''),
    original: clean(pick(l, ['title', 'name', 'shortDescription', 'heading']) || g.original),
    description: clean(pick(l, ['description', 'longDescription', 'details']) || ''),
    year: toNum(pick(l, ['year', 'yearOfManufacture', 'registrationYear'])),
    img: imgs[0] || g.img,
    gallery: imgs,
    url: `${SITE}/department/plant-machinery/sale/${auction._ref.saleId}/lot/${id}`,
    endsAt: parseDate(pick(l, ['endDate', 'endsAt', 'endTime', 'closingDate', 'biddingEndDate', 'lotEndDate'])) ?? auction.endsAt ?? null,
    currentBid: toNum(pick(l, ['currentBid'])),
    bids: toNum(pick(l, ['countOfBids', 'bidCount'])),
    soldPrice: sold,
    status: sold ? 'sold' : /closed|ended|unsold|withdrawn/.test(status) ? 'closed' : undefined,
  };
}

async function listAuctions(ctx) {
  const ids = parseDept(await ctx.fetchHtml(DEPT));
  ctx.log.info(`розпродажів у відділі: ${ids.length}`);
  const out = [];
  for (const id of ids) {
    let a;
    try { a = parseSalePage(await ctx.fetchHtml(`${SITE}/department/plant-machinery/sale/${id}`), id); } catch (e) {
      ctx.log.warn(`сторінка розпродажу ${id}: ${e.message}`);
      a = parseSalePage('<html></html>', id);
    }
    if (a.endsAt && a.endsAt < ctx.now.getTime() - 36 * 3600e3) continue;
    out.push(a);
  }
  return out;
}

async function listLots(auction, ctx) {
  const sale = auction._ref.saleId;
  const j = await ctx.fetchJson(`${API}/sales/${sale}/lots/data`, {
    method: 'POST',
    headers: { Origin: SITE, Referer: auction.url },
    body: { page: 1, perPage: 2000 },
  });
  const lots = (j.lots || j.data || []).map((l) => lotFromApi(l, auction));
  if (!auction.totalLots) auction.totalLots = toNum(j.total ?? j.totalCount ?? j.count) || lots.length;
  // дата розпродажу, якщо сторінка її не дала: найпізніше закриття лота
  if (!auction.endsAt) {
    const ends = lots.map((l) => l.endsAt).filter(Boolean).sort((a, b) => a - b);
    auction.startsAt = ends[0] ?? null;
    auction.endsAt = ends[ends.length - 1] ?? null;
  }
  return lots.slice(0, ctx.limit);
}

export default defineSource({
  id: 'brightwells',
  house: 'Brightwells',
  name: 'Brightwells — Plant & Machinery',
  needsBrowser: false,
  currency: 'GBP',
  baseUrl: SITE,
  listAuctions,
  listLots,
});
