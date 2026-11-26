// Загальні помічники розбору: cheerio, пошук вбудованого JSON у сторінці,
// пошук «масивів лотів» у довільному JSON (коли структуру API наперед не знаємо точно).

import * as cheerio from 'cheerio';

export const load = (html) => cheerio.load(html);
export const clean = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();

/** Текст елемента з пробілами між блоками (cheerio .text() склеює "2026" і "9,479" у "20269,479"). */
export const textOf = ($, el, sep = ' ') => clean($(el).find('*').addBack().contents().filter((_, n) => n.type === 'text').map((_, n) => $(n).text()).get().join(sep));

/** Регістронезалежний доступ до поля з кількома можливими назвами; підтримує шляхи 'a.b' та 'images[0]'. */
export function pick(obj, keys) {
  if (!obj || typeof obj !== 'object') return undefined;
  for (const k of keys) {
    const v = getPath(obj, k);
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return undefined;
}

function getPath(obj, p) {
  let cur = obj;
  for (const part of p.replace(/\[(\d+)\]/g, '.$1').split('.')) {
    if (cur == null || typeof cur !== 'object') return undefined;
    if (part in cur) { cur = cur[part]; continue; }
    const lk = part.toLowerCase();
    const key = Object.keys(cur).find((x) => x.toLowerCase() === lk);
    if (key === undefined) return undefined;
    cur = cur[key];
  }
  return cur;
}

/** Усі JSON-блоки, вбудовані в HTML: <script type="application/json|ld+json">, __NEXT_DATA__, window.X = {...}. */
export function embeddedJson(html) {
  const $ = typeof html === 'string' ? load(html) : html;
  const out = [];
  $('script').each((_, el) => {
    const type = ($(el).attr('type') || '').toLowerCase();
    const txt = $(el).html() || '';
    if (/json/.test(type)) {
      try { out.push(JSON.parse(txt)); } catch { /* пропускаємо биті блоки */ }
      return;
    }
    // window.__INITIAL_STATE__ = {...};  var lots = [...];
    const re = /(?:window\.[\w$]+|var\s+[\w$]+|let\s+[\w$]+|const\s+[\w$]+)\s*=\s*(\{[\s\S]*?\}|\[[\s\S]*?\])\s*;\s*(?:\n|$)/g;
    let m;
    while ((m = re.exec(txt))) {
      try { out.push(JSON.parse(m[1])); } catch { /* не чистий JSON */ }
    }
  });
  return out;
}

const ID_KEYS = ['id', 'itemId', 'item_id', 'productId', 'lotId', 'lot_id', 'stockId', 'uuid', 'guid', 'sku'];
const TITLE_KEYS = ['title', 'name', 'lotTitle', 'headline', 'shortDescription', 'description', 'heading'];

/** Чи схожий об'єкт на лот: є ідентифікатор і назва. */
export const looksLikeLot = (o) => o && typeof o === 'object' && !Array.isArray(o) && pick(o, ID_KEYS) != null && typeof pick(o, TITLE_KEYS) === 'string';

/** Знаходить у JSON найбільший масив об'єктів, схожих на лоти (≥60% елементів). */
export function findLotArrays(json, min = 1) {
  const found = [];
  const seen = new Set();
  (function walk(v, depth) {
    if (!v || typeof v !== 'object' || depth > 12 || seen.has(v)) return;
    seen.add(v);
    if (Array.isArray(v)) {
      if (v.length >= min) {
        const ok = v.filter(looksLikeLot).length;
        if (ok >= Math.max(min, Math.ceil(v.length * 0.6))) found.push(v);
      }
      for (const x of v) walk(x, depth + 1);
    } else {
      for (const x of Object.values(v)) walk(x, depth + 1);
    }
  })(json, 0);
  return found.sort((a, b) => b.length - a.length);
}

/** Перетворює довільний «лот-подібний» JSON-об'єкт у сирий лот для normalizeLot. */
export function genericLot(o) {
  const imgs = pick(o, ['images', 'photos', 'gallery', 'media', 'pictures']);
  const gallery = Array.isArray(imgs)
    ? imgs.map((x) => (typeof x === 'string' ? x : pick(x, ['url', 'src', 'large', 'original', 'imageUrl', 'path', 'href']))).filter((x) => typeof x === 'string')
    : [];
  const img = pick(o, ['image', 'imageUrl', 'img', 'thumbnail', 'thumb', 'mainImage', 'primaryImage', 'photo', 'image.url', 'mainImage.url']);
  return {
    item: String(pick(o, ID_KEYS) ?? ''),
    lot: String(pick(o, ['lotNo', 'lotNumber', 'lot_number', 'lotNum', 'lot', 'number']) ?? ''),
    original: clean(pick(o, TITLE_KEYS)),
    description: clean(pick(o, ['description', 'longDescription', 'details', 'summary', 'body']) ?? ''),
    year: numOrNull(pick(o, ['year', 'yearOfManufacture', 'manufactureYear', 'yom', 'modelYear'])),
    hours: numOrNull(pick(o, ['hours', 'meterReading', 'usageHours', 'engineHours', 'hourMeter'])),
    img: typeof img === 'string' ? img : '',
    gallery,
    url: pick(o, ['url', 'link', 'href', 'permalink', 'detailUrl', 'productUrl']) || '',
    endsAt: pick(o, ['endsAt', 'endDate', 'end_date', 'closingDate', 'closeDate', 'endTime', 'closingTime', 'lotEndTime', 'saleDate', 'auctionDate']),
    currentBid: pick(o, ['currentBid', 'current_bid', 'highBid', 'highestBid', 'currentPrice', 'bid']),
    bids: pick(o, ['countOfBids', 'bidCount', 'numberOfBids', 'bids']),
    soldPrice: pick(o, ['soldPrice', 'hammerPrice', 'hammer', 'salePrice', 'soldFor', 'finalPrice']),
    location: clean(pick(o, ['location', 'locationName', 'site', 'city', 'location.name']) ?? ''),
    categoryHint: clean([pick(o, ['category', 'categoryName', 'category.name', 'type', 'subCategory', 'subcategory'])].flat().join(' ')),
    statusHint: clean(pick(o, ['status', 'state', 'lotStatus']) ?? ''),
  };
}

const numOrNull = (v) => {
  if (v == null || v === '') return null;
  const n = Number(String(v).replace(/[, ]/g, ''));
  return Number.isFinite(n) ? n : null;
};

/**
 * Картки лотів за посиланнями: для кожного <a href>, що підходить під re (група 1 = id),
 * піднімаємося до найближчого предка, який містить лише цей один id (це і є картка).
 * @returns {{id:string, href:string, $card:any, text:string, title:string, img:string, imgs:string[]}[]}
 */
export function anchorCards($, re, { maxUp = 8 } = {}) {
  const byId = new Map();
  $('a[href]').each((_, a) => {
    const href = $(a).attr('href') || '';
    const m = href.match(re);
    if (!m) return;
    const id = m[1];
    if (byId.has(id)) {
      const c = byId.get(id);
      if (!c.title) c.title = clean($(a).attr('title') || $(a).text());
      return;
    }
    let $card = $(a);
    for (let i = 0; i < maxUp; i++) {
      const $p = $card.parent();
      if (!$p.length || $p.is('body')) break;
      const ids = new Set();
      $p.find('a[href]').each((_, x) => { const mm = ($(x).attr('href') || '').match(re); if (mm) ids.add(mm[1]); });
      if (ids.size > 1) break;
      $card = $p;
    }
    const imgs = [];
    $card.find('img, source').each((_, im) => {
      const $im = $(im);
      const src = $im.attr('data-src') || $im.attr('data-lazy-src') || $im.attr('data-original') || ($im.attr('srcset') || $im.attr('data-srcset') || '').split(/\s+/)[0] || $im.attr('src') || '';
      if (src && !/^data:|placeholder|spinner|blank\.gif|logo/i.test(src)) imgs.push(src);
    });
    // текст картки з розділювачами між блоками
    const text = clean($card.find('*').addBack().contents().filter((_, n) => n.type === 'text').map((_, n) => $(n).text()).get().join(' | '));
    const heading = clean($card.find('h1,h2,h3,h4,h5,.title,[class*="title"],[class*="Title"]').first().text());
    byId.set(id, { id, href, $card, text, title: heading || clean($(a).attr('title') || $(a).text()), img: imgs[0] || '', imgs: [...new Set(imgs)] });
  });
  return [...byId.values()];
}

/** "Hours: 1,234" / "Year: 2019" / "Lot 151" з тексту картки. */
export function labeled(text, label) {
  const re = new RegExp(`\\b${label}\\b\\s*(?:no\\.?|number)?\\s*[:#\\-|]*\\s*([^|]{1,60})`, 'i');
  const m = String(text || '').match(re);
  return m ? clean(m[1]) : '';
}
