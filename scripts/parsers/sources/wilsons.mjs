// Wilsons Auctions (wilsonsauctions.com): Plant & Machinery, Commercial — Белфаст, Портадаун, Ньюкасл, Дублін.
// Збираємо без браузера:
//  1) /auctions (і /auctions?category=plant-machinery) — посилання /auctions/<slug>-<id>, лишаємо техніку.
//  2) сторінка аукціону /auctions/<slug>-<id>?page=<p> — картки лотів з посиланнями .../lots/<item>.
// Якщо HTML без карток — запасний шлях через headless Chromium (перехоплення XHR JSON).

import { defineSource } from '../lib/source.mjs';
import { load, clean, textOf, embeddedJson, findLotArrays, genericLot, anchorCards, labeled } from '../lib/extract.mjs';
import { parseDate, auctionId, toNum } from '../lib/model.mjs';
import { sniffPage } from '../lib/browser.mjs';
import { wafName } from '../lib/http.mjs';

const BASE = 'https://www.wilsonsauctions.com';
const LIST_URLS = [`${BASE}/auctions`, `${BASE}/auctions?category=plant-machinery`];
// які аукціони беремо: техніка, комерційний транспорт, агро
const WANT = /plant|machinery|commercial|agri|tractor|construction|groundcare|truck|hgv/i;
const SKIP = /classic|motorbike|car-auction|cars-|salvage|jewel|art|antique|property|house/i;

const PLACES = [
  [/belfast|mallusk/i, 'Белфаст, Північна Ірландія', 'GBP'],
  [/portadown/i, 'Портадаун, Північна Ірландія', 'GBP'],
  [/newcastle/i, 'Ньюкасл, Англія', 'GBP'],
  [/dublin|kildare|naas/i, 'Дублін, Ірландія', 'EUR'],
  [/limerick/i, 'Лімерик, Ірландія', 'EUR'],
  [/telford/i, 'Телфорд, Англія', 'GBP'],
  [/bristol/i, 'Бристоль, Англія', 'GBP'],
  [/glasgow|scotland/i, 'Глазго, Шотландія', 'GBP'],
];
const placeOf = (text) => PLACES.find(([re]) => re.test(text)) || [null, 'Белфаст, Північна Ірландія', 'GBP'];

/** Розбір сторінки-списку аукціонів. Експортується для тестів. */
export function parseAuctionList(html, now = new Date()) {
  const $ = load(html);
  const out = new Map();
  $('a[href*="/auctions/"]').each((_, el) => {
    const href = $(el).attr('href') || '';
    const m = href.match(/\/auctions\/([a-z0-9-]+?)-(\d{3,6})\/?(?:[?#]|$)/i);
    if (!m || /\/lots\//.test(href)) return;
    const [, slug, sid] = m;
    if (!WANT.test(slug) || SKIP.test(slug)) return;
    const $box = $(el).closest('article, li, .card, [class*="auction"], [class*="Auction"]').first();
    const text = textOf($, $box.length ? $box : $(el).parent(), ' | ');
    const prev = out.get(sid);
    if (prev && prev.text.length >= text.length) return;
    out.set(sid, { slug, sid, href, text, title: clean($box.find('h2,h3,h4').first().text()) || clean($(el).text()) });
  });
  return [...out.values()].map((r) => {
    const startsAt = parseDate(r.text.match(/\b(?:mon|tue|wed|thu|fri|sat|sun)[a-z]*\.?,?\s+\d{1,2}(?:st|nd|rd|th)?\s+[a-z]+\.?\s+\d{4}(?:[^|]{0,20}?\d{1,2}[:.]\d\d\s*(?:am|pm)?)?/i)?.[0]
      || r.text.match(/\d{1,2}(?:st|nd|rd|th)?\s+[a-z]+\s+\d{4}(?:[^|]{0,20}?\d{1,2}[:.]\d\d\s*(?:am|pm)?)?/i)?.[0]
      || r.text.match(/\d{1,2}\/\d{1,2}\/\d{4}(?:\s+\d{1,2}:\d\d)?/)?.[0]);
    const [, place, currency] = placeOf(`${r.slug} ${r.text}`);
    const placeKey = (placeOf(`${r.slug} ${r.text}`)[0]?.source.split('|')[0] || 'belfast').replace(/\W/g, '');
    return {
      id: `${auctionId('wilsons', placeKey, startsAt)}-${r.sid}`, // 'wilsons-belfast-2026-11-6275'
      name: r.title || r.slug.replace(/-/g, ' '),
      place,
      startsAt,
      endsAt: startsAt,
      live: !/timed|online only/i.test(r.text),
      totalLots: toNum(r.text.match(/([\d,]+)\s+lots/i)?.[1]) || 0,
      unreserved: /unreserved|no reserve/i.test(r.text),
      url: new URL(r.href, BASE).href.split('?')[0],
      currency,
      location: place,
      _ref: { slug: r.slug, sid: r.sid },
    };
  }).filter((a) => !a.startsAt || a.startsAt > now.getTime() - 36 * 3600e3);
}

async function listAuctions(ctx) {
  const all = new Map();
  let lastErr;
  for (const u of LIST_URLS) {
    try {
      for (const a of parseAuctionList(await ctx.fetchHtml(u), ctx.now)) all.set(a._ref.sid, a);
    } catch (e) { lastErr = e; ctx.log.warn(`${u}: ${e.message}`); }
  }
  if (!all.size && lastErr) throw lastErr;
  return [...all.values()];
}

/** Розбір сторінки каталогу аукціону. Експортується для тестів. */
export function parseLotsPage(html, auction) {
  const lots = [];
  for (const j of embeddedJson(html)) {
    for (const arr of findLotArrays(j, 3)) for (const o of arr) {
      const g = genericLot(o);
      lots.push({ ...g, auction: auction.id, url: g.url || `${auction.url}/lots/${g.item}`, endsAt: g.endsAt ? parseDate(g.endsAt) : auction.startsAt });
    }
    if (lots.length) return lots;
  }
  const $ = load(html);
  for (const c of anchorCards($, /\/lots\/(\d{4,})/)) {
    const lotNo = labeled(c.text, 'lot').match(/^\d+[a-z]?/i)?.[0] || '';
    const est = c.text.match(/estimate[^£€\d]*[£€]\s?([\d,]+)/i)?.[1];
    lots.push({
      auction: auction.id,
      item: c.id,
      lot: lotNo,
      original: c.title.replace(/^lot\s*\d+[a-z]?\s*[-:|]?\s*/i, ''),
      text: c.text,
      specs: est ? `оцінка аукціону ≈ ${auction.currency === 'EUR' ? '€' : '£'}${est.replace(/,/g, ' ')}` : '',
      img: c.img,
      gallery: c.imgs,
      url: c.href,
      endsAt: auction.startsAt ?? null,
    });
  }
  return lots;
}

async function listLots(auction, ctx) {
  const all = new Map();
  for (let p = 1; p <= 100 && all.size < ctx.limit; p++) {
    const html = await ctx.fetchHtml(`${auction.url}${p > 1 ? `?page=${p}` : ''}`).catch((e) => { if (p === 1) throw e; return ''; });
    const lots = parseLotsPage(html, auction);
    const before = all.size;
    for (const l of lots) all.set(l.item, l);
    if (p === 1 && !lots.length) {
      const b = await ctx.getBrowser();
      if (!b) { ctx.log.warn(`${auction.url}: карток немає в HTML, браузер недоступний`); break; }
      const { html: h2, json } = await sniffPage(b, auction.url, { log: ctx.log });
      // Wilsons стоїть за Barracuda з категорією WEB_SCRAPING_BLOCKED — це пряма заборона збору. Не обходимо.
      const waf = wafName(h2);
      if (waf && !json.length) throw new Error(`${auction.url}: ${waf} блокує автоматичний збір (сайт забороняє скрапінг) — потрібен письмовий дозвіл або фід/API від Wilsons`);
      for (const j of json) for (const arr of findLotArrays(j.data, 3)) {
        ctx.log.info(`API знайдено: ${j.method} ${j.url} → ${arr.length}`);
        for (const o of arr) { const g = genericLot(o); all.set(g.item, { ...g, auction: auction.id, url: g.url || `${auction.url}/lots/${g.item}`, endsAt: auction.startsAt }); }
      }
      if (!all.size) for (const l of parseLotsPage(h2, auction)) all.set(l.item, l);
      break;
    }
    if (all.size === before) break;
  }
  return [...all.values()].slice(0, ctx.limit);
}

export default defineSource({
  id: 'wilsons',
  house: 'Wilsons Auctions',
  name: 'Wilsons Auctions — Plant & Machinery',
  // Вимкнено за замовчуванням: сайт блокує автоматичний збір (Barracuda, WEB_SCRAPING_BLOCKED, перевірено 26.11.2026).
  // Увімкнути лише після письмового дозволу або отримання фіду/API від Wilsons. Явний запуск --source=wilsons працює.
  enabled: false,
  needsBrowser: false,
  browserFallback: true,
  currency: 'GBP',
  baseUrl: BASE,
  listAuctions,
  listLots,
});
