// Euro Auctions (euroauctions.com): живі торги + онлайн-ставки у Великій Британії (Лідс, Дромор),
// Іспанії (Сарагоса), Німеччині тощо. НЕ входить до Ritchie Bros, вивезення в Україну дозволене.
//
// Як збираємо (без браузера):
//  1) /en/auctions — список майбутніх аукціонів (посилання /en/auctions/<місце>-<дні>-<місяць>-<рік>).
//  2) сторінка аукціону — шукаємо номер каталогу з посилання equipment-search?a=<N> (або з фото auction-<N>).
//  3) /en/equipment-search?a=<N>&page=<p> — картки лотів (посилання /equipment-search/product/<item>/...).
//     Якщо сторінка віддає дані через вбудований JSON — беремо його (findLotArrays).
//  4) Якщо HTML порожній (дані тягне XHR), а браузер дозволено — відкриваємо сторінку в headless Chromium,
//     перехоплюємо JSON-відповіді й пишемо в лог адресу API, щоб потім перевести на чистий fetch.
//
// Додаткові аукціони можна задати вручну: EA_AUCTIONS="1050:leeds-25th-26th-27th-28th-november-2026,1059:dromore-11th-12th-december-2026".

import { defineSource } from '../lib/source.mjs';
import { load, clean, embeddedJson, findLotArrays, genericLot, anchorCards, labeled } from '../lib/extract.mjs';
import { parseDate, zonedToUtc, auctionId, toNum } from '../lib/model.mjs';
import { sniffPage } from '../lib/browser.mjs';

const BASE = 'https://www.euroauctions.com';
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

// Місця: англійський ключ у slug → [українська назва, валюта, часовий пояс]
const PLACES = {
  leeds: ['Келлінгтон біля Лідса, Англія', 'GBP', 'Europe/London'],
  dromore: ['Дромор, Північна Ірландія', 'GBP', 'Europe/London'],
  eglinton: ['Еглінтон, Північна Ірландія', 'GBP', 'Europe/London'],
  harrogate: ['Гаррогейт, Англія', 'GBP', 'Europe/London'],
  zaragoza: ['Сарагоса, Іспанія', 'EUR', 'Europe/Madrid'],
  ocana: ['Оканья, Іспанія', 'EUR', 'Europe/Madrid'],
  madrid: ['Мадрид, Іспанія', 'EUR', 'Europe/Madrid'],
  dachau: ['Дахау, Німеччина', 'EUR', 'Europe/Berlin'],
  germany: ['Німеччина', 'EUR', 'Europe/Berlin'],
  montpellier: ['Монпельє, Франція', 'EUR', 'Europe/Paris'],
  france: ['Франція', 'EUR', 'Europe/Paris'],
  italy: ['Італія', 'EUR', 'Europe/Rome'],
  netherlands: ['Нідерланди', 'EUR', 'Europe/Amsterdam'],
  moerdijk: ['Мордейк, Нідерланди', 'EUR', 'Europe/Amsterdam'],
  sweden: ['Швеція', 'EUR', 'Europe/Stockholm'],
};

/** "leeds-25th-26th-27th-28th-november-2026" → {placeKey, days:[25..28], month:10, year:2026} */
export function parseAuctionSlug(slug) {
  const s = slug.toLowerCase();
  const year = +(s.match(/(20\d\d)/) || [])[1] || null;
  const month = MONTHS.findIndex((m) => new RegExp(`(^|-)${m}(-|$)`).test(s));
  const days = [...s.matchAll(/(?:^|-)(\d{1,2})(?:st|nd|rd|th)(?=-|$)/g)].map((m) => +m[1]);
  const placeKey = s.split(/-\d/)[0].replace(/-auction.*$/, '').replace(/-+$/, '');
  return { placeKey, days, month: month >= 0 ? month : null, year };
}

function placeInfo(placeKey) {
  const k = Object.keys(PLACES).find((p) => placeKey.includes(p));
  if (k) return PLACES[k];
  const en = placeKey.split('-').map((w) => w[0]?.toUpperCase() + w.slice(1)).join(' ');
  return [en, 'GBP', 'Europe/London'];
}

/** Будує RawAuction з slug сторінки аукціону та номера каталогу. */
export function auctionFromSlug(slug, a, extra = {}) {
  const { placeKey, days, month, year } = parseAuctionSlug(slug);
  const [place, currency, tz] = placeInfo(placeKey);
  // Euro Auctions починає живі торги о 8:30–10:00; беремо 10:00 місцевого часу як орієнтир дня торгів
  const startsAt = year != null && month != null && days.length ? zonedToUtc(year, month, days[0], 10, 0, tz) : null;
  const endsAt = startsAt && days.length > 1 ? zonedToUtc(year, month, days[days.length - 1], 10, 0, tz) : startsAt;
  const enName = placeKey.split('-').map((w) => w[0]?.toUpperCase() + w.slice(1)).join(' ');
  return {
    id: auctionId('ea', placeKey, startsAt, tz),
    name: extra.name || `${enName} Auction`,
    place,
    startsAt,
    endsAt,
    live: true,
    unreserved: true, // Euro Auctions продає без резервної ціни
    totalLots: extra.totalLots || 0,
    url: `${BASE}/en/auctions/${slug}`,
    currency,
    location: place,
    _ref: { a: a ? String(a) : '', slug, tz, days, month, year },
  };
}

async function listAuctions(ctx) {
  const found = new Map();
  try {
    const html = await ctx.fetchHtml(`${BASE}/en/auctions`);
    const $ = load(html);
    $('a[href*="/auctions/"]').each((_, el) => {
      const href = $(el).attr('href') || '';
      const m = href.match(/\/auctions\/([a-z0-9-]+-20\d\d)\/?(?:[?#]|$)/i);
      if (!m) return;
      const slug = m[1].toLowerCase();
      const card = clean($(el).closest('article, li, .card, [class*="auction"], div').first().text());
      if (!found.has(slug)) found.set(slug, { slug, card });
    });
    ctx.log.info(`аукціонів у списку: ${found.size}`);
  } catch (e) {
    ctx.log.warn(`список аукціонів недоступний (${e.message}) — беру лише EA_AUCTIONS`);
  }
  // ручний список із змінної середовища
  for (const pair of (process.env.EA_AUCTIONS || '').split(',').map((s) => s.trim()).filter(Boolean)) {
    const [a, slug] = pair.split(':');
    if (slug) found.set(slug, { slug, a });
  }

  const out = [];
  for (const { slug, a: preset, card } of found.values()) {
    let a = preset || '';
    let name = '';
    let totalLots = toNum((card || '').match(/([\d,]+)\s+(?:lots|items)/i)?.[1]);
    if (!a) {
      try {
        const html = await ctx.fetchHtml(`${BASE}/en/auctions/${slug}`);
        a = html.match(/equipment-search\?(?:[^"'<>]*&)?a=(\d{3,5})/)?.[1] || html.match(/auction-(\d{3,5})\//)?.[1] || '';
        const $ = load(html);
        name = clean($('h1').first().text());
        totalLots ??= toNum(clean($('body').text()).match(/([\d,]+)\s+(?:lots|items)/i)?.[1]);
      } catch (e) {
        ctx.log.warn(`сторінка аукціону ${slug}: ${e.message}`);
      }
    }
    if (!a) { ctx.log.warn(`не знайшов номер каталогу (a=) для ${slug} — пропускаю`); continue; }
    const auc = auctionFromSlug(slug, a, { name, totalLots: totalLots || 0 });
    // минулі аукціони не беремо
    if (auc.endsAt && auc.endsAt < ctx.now.getTime() - 36 * 3600e3) continue;
    out.push(auc);
  }
  return out;
}

/** Розбір однієї сторінки каталогу (HTML) у сирі лоти. Експортується для тестів. */
export function parseSearchPage(html, auction) {
  const lots = [];
  // 1) вбудований JSON
  for (const j of embeddedJson(html)) {
    for (const arr of findLotArrays(j, 3)) for (const o of arr) lots.push(fromJson(o, auction));
    if (lots.length) return dedupe(lots);
  }
  // 2) картки в HTML
  const $ = load(html);
  for (const c of anchorCards($, /\/equipment-search\/product\/(\d{6,})/)) {
    const text = c.text;
    const dayN = toNum(text.match(/\bday\s*(\d)\b/i)?.[1]);
    const hours = toNum(labeled(text, '(?:hours|hrs|meter)'));
    const year = toNum(labeled(text, 'year'));
    lots.push({
      auction: auction.id,
      item: c.id,
      lot: labeled(text, 'lot').match(/^\d+[a-z]?/i)?.[0] || '',
      original: c.title,
      text,
      year: year && year > 1950 ? year : undefined,
      hours: hours ?? undefined,
      img: c.img,
      gallery: c.imgs,
      url: c.href,
      endsAt: dayEndsAt(auction, dayN),
      categoryHint: decodeURIComponent(c.href.split('/').slice(-3, -1).join(' ')).replace(/-/g, ' '),
    });
  }
  return dedupe(lots);
}

function dayEndsAt(auction, dayN) {
  const r = auction._ref || {};
  if (dayN && r.year != null && r.month != null && r.days?.[dayN - 1]) return zonedToUtc(r.year, r.month, r.days[dayN - 1], 10, 0, r.tz);
  return auction.startsAt ?? null;
}

function fromJson(o, auction) {
  const g = genericLot(o);
  const dayN = toNum(o.day ?? o.saleDay ?? o.auctionDay);
  return {
    ...g,
    auction: auction.id,
    url: g.url || `${BASE}/en/equipment-search/product/${g.item}/0/`,
    endsAt: g.endsAt ? parseDate(g.endsAt, auction._ref?.tz) : dayEndsAt(auction, dayN),
  };
}

const dedupe = (lots) => [...new Map(lots.filter((l) => l.item).map((l) => [l.item, l])).values()];

async function listLots(auction, ctx) {
  const a = auction._ref.a;
  const all = new Map();
  for (let p = 1; p <= 400 && all.size < ctx.limit; p++) {
    const url = `${BASE}/en/equipment-search?a=${a}${p > 1 ? `&page=${p}` : ''}`;
    let html;
    try {
      html = await ctx.fetchHtml(url);
    } catch (e) {
      if (p === 1) throw e;
      ctx.log.warn(`сторінка ${p}: ${e.message} — зупиняюсь`);
      break;
    }
    const lots = parseSearchPage(html, auction);
    const before = all.size;
    for (const l of lots) all.set(l.item, l);
    ctx.log.debug(`a=${a} сторінка ${p}: ${lots.length} карток, нових ${all.size - before}`);
    if (p === 1 && !lots.length) {
      const viaBrowser = await browserFallback(auction, ctx);
      for (const l of viaBrowser) all.set(l.item, l);
      break;
    }
    if (all.size === before) break;
  }
  return [...all.values()].slice(0, ctx.limit);
}

async function browserFallback(auction, ctx) {
  const browser = await ctx.getBrowser();
  if (!browser) {
    ctx.log.warn('у HTML немає карток лотів, а браузер недоступний (--no-browser або немає playwright)');
    return [];
  }
  const url = `${BASE}/en/equipment-search?a=${auction._ref.a}`;
  const { html, json } = await sniffPage(browser, url, { log: ctx.log });
  const lots = [];
  for (const j of json) {
    const arrs = findLotArrays(j.data, 3);
    if (arrs.length) {
      ctx.log.info(`API знайдено: ${j.method} ${j.url}${j.postData ? ' body=' + j.postData.slice(0, 300) : ''} → ${arrs[0].length} лотів. Перенесіть цей запит у fetch.`);
      for (const o of arrs[0]) lots.push(fromJson(o, auction));
    }
  }
  if (!lots.length) lots.push(...parseSearchPage(html, auction));
  return dedupe(lots);
}

export default defineSource({
  id: 'euroauctions',
  house: 'Euro Auctions',
  name: 'Euro Auctions (Лідс, Дромор, Сарагоса та ін.)',
  needsBrowser: false,
  browserFallback: true,
  currency: 'GBP',
  baseUrl: BASE,
  listAuctions,
  listLots,
});
