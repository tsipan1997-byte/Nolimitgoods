// Cheffins (Кембридж, Англія): розпродажі ферм (онлайн-торги з таймером) і Cambridge Machinery Sale (живі торги).
// Логіка перенесена з scripts/auction-scrape/scrape-catalogues.mjs.
//
//  1) www.cheffins.co.uk/machinery-vintage-auctions.htm — звичайний HTML: посилання «Catalogue» на
//     cheffins.auctionmarts.com/lots/<id> (один каталог) або /sales/<id> (збірний аукціон з кількома каталогами).
//  2) каталог cheffins.auctionmarts.com/lots/<id>?page=<p>&pageSize=60 — картки .lot-grid-item.
//     auctionmarts — SPA (React): у сирому HTML карток зазвичай НЕМАЄ, тому спершу пробуємо fetch
//     (вбудований JSON / картки), а якщо порожньо — headless Chromium, як у старому скрипті.
//     Тому needsBrowser: true (CI ставить Chromium).

import { defineSource } from '../lib/source.mjs';
import { load, clean, embeddedJson, findLotArrays, genericLot } from '../lib/extract.mjs';
import { parseDate, auctionId, toNum, zonedToUtc } from '../lib/model.mjs';

const LIST = 'https://www.cheffins.co.uk/machinery-vintage-auctions.htm';
const MARTS = 'https://cheffins.auctionmarts.com';
const SKIP = /vintage|automobilia|collection|classic/i; // вінтаж і колекції не беремо
const SKIP_HEAD = /automobilia|collection|vintage|tools & workshop|horticultural|petroliana/i;

/** Розбір сторінки зі списком аукціонів Cheffins. Експортується для тестів. */
export function parseList(html, now = new Date()) {
  const $ = load(html);
  // Поточна верстка (листопад 2026): картки .calmach-card з .cma-title / .cma-type / .ki__start / .ki__end / .ki__loc.
  // Підпис («Starts:») стоїть ПЕРЕД значенням у тому самому .ki, тому старий розбір по рядках брав не те.
  const cards = $('.calmach-card');
  if (cards.length) {
    const out = [];
    const seen = new Set();
    cards.each((_, c) => {
      const $c = $(c);
      const href = $c.find('a[href*="auctionmarts.com/"]').filter((_, a) => /catalogue/i.test($(a).text())).first().attr('href') || '';
      if (!/auctionmarts\.com\/(lots|sales)\//.test(href)) return;
      const url = href.split('?')[0];
      if (seen.has(url)) return;
      seen.add(url);
      const ki = (cls) => clean($c.find(`.${cls}`).first().clone().find('.ki-label').remove().end().text());
      const name = clean($c.find('.cma-title').first().text()) || 'Cheffins sale';
      const type = clean($c.find('.cma-type').first().text());
      const desc = clean($c.find('.cma-desc').first().text());
      if (SKIP.test(`${name} ${type}`) || /\bvintage|classic\b/i.test(desc) && !/machinery sale/i.test(name)) return;
      const startsAt = parseDate(ki('ki__start'));
      const endsAt = parseDate(ki('ki__end')) ?? startsAt;
      if (endsAt && endsAt < now.getTime() - 36 * 3600e3) return;
      const loc = ki('ki__loc');
      const live = /machinery sale|live|on-?site/i.test(`${name} ${type}`) && !/timed/i.test(type);
      out.push({
        id: auctionId('ch', name.replace(/['’]s\b/g, '').replace(/\b(ltd|limited|farms?|&|and|the)\b/gi, ' ').trim().split(/\s+/).slice(0, 3).join('-'), startsAt || endsAt),
        name,
        place: loc ? `${loc}, Англія` : 'Кембриджшир, Англія',
        startsAt,
        endsAt,
        live,
        url,
        currency: 'GBP',
        location: loc || 'Кембриджшир',
        _ref: { url, group: /\/sales\//.test(url), info: `${type}\n${desc}` },
      });
    });
    return out;
  }
  const res = new Map();
  $('a[href]').each((_, a) => {
    const href = $(a).attr('href') || '';
    if (!/auctionmarts\.com\/(lots|sales)\//.test(href) || !/catalogue/i.test($(a).text())) return;
    // піднімаємося до блоку з датами (як у старому скрипті: до 6 рівнів, поки не знайдемо STARTS:/DATE:)
    let $box = $(a);
    for (let i = 0; i < 6 && $box.parent().length; i++) {
      $box = $box.parent();
      if (/STARTS:|DATE:/i.test($box.text())) break;
    }
    const lines = $box.find('*').addBack().contents().filter((_, n) => n.type === 'text').map((_, n) => clean($(n).text())).get().filter(Boolean);
    const info = lines.join('\n');
    const url = href.split('?')[0];
    if (!res.has(url)) res.set(url, { url, info, lines });
  });
  const out = [];
  for (const r of res.values()) {
    if (SKIP.test(r.lines.slice(0, 3).join(' '))) continue;
    const startTxt = r.info.match(/(?:STARTS|DATE):\s*([^\n]+)/i)?.[1];
    const endTxt = r.info.match(/(?:ENDS|CLOSES|FINISHES):\s*([^\n]+)/i)?.[1];
    const startsAt = parseDate(startTxt);
    const endsAt = parseDate(endTxt) ?? startsAt;
    const name = r.lines.find((l) => !/^(STARTS|ENDS|DATE|VIEWING|LOCATION|VENUE):/i.test(l) && !/catalogue|register|bid now|view/i.test(l) && l.length > 3) || 'Cheffins sale';
    const loc = r.info.match(/(?:LOCATION|VENUE):\s*([^\n]+)/i)?.[1] || '';
    const live = /live|machinery sale|ring/i.test(r.info) && !/timed|online only/i.test(r.info);
    if (endsAt && endsAt < now.getTime() - 36 * 3600e3) continue;
    out.push({
      id: auctionId('ch', name.replace(/\b(ltd|limited|farms?|&|and|the)\b/gi, ' ').trim().split(/\s+/).slice(0, 3).join('-'), startsAt || endsAt),
      name,
      place: loc ? `${loc}, Англія` : 'Кембриджшир, Англія',
      startsAt,
      endsAt,
      live,
      url: r.url,
      currency: 'GBP',
      location: loc || 'Кембриджшир',
      _ref: { url: r.url, group: /\/sales\//.test(r.url), info: r.info },
    });
  }
  return out;
}

/** Розбір картки .lot-grid-item (текст + посилання) у сирий лот. Експортується для тестів. */
export function lotFromCard(row, auction, now = null) {
  const id = (row.href.match(/\/lot\/([A-Za-z0-9=_-]+)/) || [])[1] || '';
  const raw = String(row.text || '');
  const lines = raw.split(/\n+/).map((s) => clean(s)).filter(Boolean);
  // Службові рядки картки auctionmarts: «Live Auction», «Timed Auction», «SOLD», «LOT 1», «Final bid», «£60.00»,
  // «Ended at», «4/24/2026, 9:02:39 AM», «Buyer's Premium…», «LOG IN TO BID».
  const SERVICE = /^((live|timed|online)\s+auction|sold|unsold|passed|withdrawn|open|closed|ended|upcoming|in progress|not started|lot\s*\d+[a-z]?|\d+[a-z]?|final bid|current bid|starting bid|opening bid|winning bid|ended at|ends at|ends in|closes( at)?|closing|time left|vat rate|\d+(\.\d+)?%|estimate.*|buyer'?s premium.*|log in to .*|bid now|place bid|watch|£\s?[\d,.]+|\d+\s*bids?|\d{1,2}\/\d{1,2}\/\d{4}.*|\d+[dhms](\s+\d+[dhms])*)$/i;
  // «LOT 0 — IMPORTANT SALE INFORMATION» та подібні інформаційні картки — не лоти
  if (/important (sale )?information|terms (and|&) conditions|viewing (times|information)|collection (times|information)/i.test(raw)) return { auction: auction.id, item: '', original: '' };
  const lotno = (clean(row.lotno) || lines.find((l) => /^lot\s*\d/i.test(l)) || '').replace(/^lot\s*/i, '');
  const title = lines.find((l) => !SERVICE.test(l) && l.length > 3) || '';
  // auctionmarts пише дату в американському форматі M/D/YYYY, h:mm:ss AM
  const us = raw.match(/(?:ended at|ends at|closes(?: at)?|closing)\s*:?\s*\n?\s*(\d{1,2})\/(\d{1,2})\/(\d{4}),?\s*(\d{1,2}):(\d\d)(?::\d\d)?\s*(AM|PM)?/i);
  let endsAt = null;
  if (us) {
    let h = +us[4];
    if (us[6]?.toUpperCase() === 'PM' && h < 12) h += 12;
    if (us[6]?.toUpperCase() === 'AM' && h === 12) h = 0;
    endsAt = zonedToUtc(+us[3], +us[1] - 1, +us[2], h, +us[5]);
  }
  // торги з таймером: «Time left\n4d 23h» → приблизний час закриття від моменту збору
  const left = !endsAt && raw.match(/time left\s*\n?\s*((?:\d+\s*[dhms]\s*)+)/i);
  if (left) {
    const unit = { d: 864e5, h: 36e5, m: 6e4, s: 1e3 };
    const ms = [...left[1].matchAll(/(\d+)\s*([dhms])/gi)].reduce((s, [, n, u]) => s + +n * unit[u.toLowerCase()], 0);
    if (ms) endsAt = (now ? now.getTime() : Date.now()) + ms;
  }
  const sold = /^sold$/im.test(raw);
  const finalBid = toNum(raw.match(/final bid\s*\n?\s*£\s?([\d,]+(?:\.\d\d)?)/i)?.[1]);
  const currentBid = toNum(raw.match(/(?:current|winning) bid\s*:?\s*\n?\s*£\s?([\d,]+(?:\.\d\d)?)/i)?.[1]) ?? (sold ? null : finalBid);
  const ended = /^(sold|unsold|passed|ended|closed)$/im.test(raw) || /ended at/i.test(raw);
  return {
    auction: auction.id,
    item: id.slice(0, 40), // так само, як у lib/auction-cheffins.ts
    lot: lotno,
    original: title,
    // у евристики (години, пробіг) — лише назва й опис без службових рядків і часу закриття
    text: lines.filter((l) => !SERVICE.test(l) && l !== title).join('\n'),
    img: row.img,
    url: row.href.startsWith('http') ? row.href : MARTS + row.href,
    endsAt: endsAt ?? (auction.live ? auction.startsAt : auction.endsAt) ?? auction.startsAt ?? null,
    currentBid,
    ...(sold && finalBid ? { status: 'sold', soldPrice: finalBid } : ended ? { status: 'closed' } : {}),
    location: auction.location,
  };
}

/** Картки зі статичного HTML (якщо auctionmarts колись віддасть SSR) або вбудованого JSON. */
export function parseCatalogueHtml(html, auction) {
  const out = [];
  for (const j of embeddedJson(html)) for (const arr of findLotArrays(j, 3)) for (const o of arr) {
    const g = genericLot(o);
    out.push({ ...g, auction: auction.id, item: g.item.slice(0, 40), url: g.url || `${MARTS}/lot/${g.item}`, endsAt: parseDate(g.endsAt) ?? (auction.live ? auction.startsAt : auction.endsAt) });
  }
  if (out.length) return out;
  const $ = load(html);
  $('.lot-grid-item').each((_, c) => {
    const $c = $(c);
    const text = $c.find('*').addBack().contents().filter((_, n) => n.type === 'text').map((_, n) => clean($(n).text())).get().filter(Boolean).join('\n');
    const $img = $c.find('img').first();
    out.push(lotFromCard({ lotno: clean($c.find('.lotno').text()), text, href: $c.find('a').first().attr('href') || '', img: $img.attr('data-src') || $img.attr('src') || '' }, auction));
  });
  return out.filter((l) => l.item);
}

async function listAuctions(ctx) {
  return parseList(await ctx.fetchHtml(LIST), ctx.now);
}

async function catalogueUrls(auction, ctx) {
  if (!auction._ref.group) return [auction._ref.url];
  const html = await ctx.fetchHtml(auction._ref.url).catch(() => '');
  let urls = [...new Set([...html.matchAll(/href="([^"]*\/lots\/[^"?#]+)/g)].map((m) => new URL(m[1], MARTS).href))];
  if (!urls.length) {
    const b = await ctx.getBrowser();
    if (b) {
      const page = await b.newPage();
      try {
        await page.goto(auction._ref.url, { waitUntil: 'domcontentloaded', timeout: 90000 });
        for (let k = 0; k < 20; k++) { await page.waitForTimeout(1000); if (await page.locator('a[href*="/lots/"]').count()) break; }
        urls = await page.evaluate(() => [...new Set([...document.querySelectorAll('a[href*="/lots/"]')].map((a) => a.href.split('?')[0]))]);
      } finally { await page.close(); }
    }
  }
  ctx.log.info(`збірний аукціон ${auction.name}: каталогів ${urls.length}`);
  return urls;
}

/** Старий браузерний шлях: гортаємо сторінки по 60 карток, прокручуємо до кожної заради лінивих фото. */
async function catalogueViaBrowser(url, auction, ctx, limit) {
  const b = await ctx.getBrowser();
  if (!b) throw new Error('auctionmarts віддає каталог лише через JavaScript, а браузер недоступний (запустіть без --no-browser, потрібен playwright + chromium)');
  const page = await b.newPage({ locale: 'en-GB', viewport: { width: 1300, height: 900 } });
  const rows = [];
  try {
    let head = '';
    for (let p = 1; p < 200 && rows.length < limit; p++) {
      await page.goto(`${url}?page=${p}&pageSize=60`, { waitUntil: 'domcontentloaded', timeout: 90000 });
      let n = 0;
      for (let k = 0; k < 30; k++) { await page.waitForTimeout(1000); n = await page.locator('.lot-grid-item').count(); if (n) break; }
      if (p === 1) {
        head = await page.evaluate(() => (document.querySelector('main')?.innerText || '').slice(0, 600));
        if (SKIP_HEAD.test(head.slice(0, 120))) { ctx.log.info(`пропускаю каталог: ${head.split('\n')[0]}`); return []; }
      }
      await page.evaluate(async () => {
        for (const c of document.querySelectorAll('.lot-grid-item')) { c.scrollIntoView({ block: 'center' }); await new Promise((r) => setTimeout(r, 250)); }
      });
      await page.waitForTimeout(1000);
      const got = await page.evaluate(() => [...document.querySelectorAll('.lot-grid-item')].map((c) => ({
        lotno: (c.querySelector('.lotno')?.innerText || '').trim(), text: c.innerText, href: c.querySelector('a')?.href || '', img: c.querySelector('img')?.src || '',
      })));
      const before = rows.length;
      for (const r of got) if (!rows.some((x) => x.href === r.href)) rows.push(r);
      if (rows.length === before || got.length < 60) break;
    }
  } finally { await page.close(); }
  return rows.map((r) => lotFromCard(r, auction, ctx.now)).filter((l) => l.item);
}

async function listLots(auction, ctx) {
  const out = [];
  for (const c of await catalogueUrls(auction, ctx)) {
    if (out.length >= ctx.limit) break;
    let lots = [];
    try { lots = parseCatalogueHtml(await ctx.fetchHtml(`${c}?page=1&pageSize=60`), auction); } catch (e) { ctx.log.warn(`${c}: ${e.message}`); }
    if (!lots.length && !ctx.offline) lots = await catalogueViaBrowser(c, auction, ctx, ctx.limit - out.length);
    ctx.log.info(`каталог ${c.slice(-12)}: ${lots.length} лотів`);
    out.push(...lots);
  }
  return out.slice(0, ctx.limit);
}

export default defineSource({
  id: 'cheffins',
  house: 'Cheffins',
  name: 'Cheffins (Кембридж)',
  needsBrowser: true,
  currency: 'GBP',
  baseUrl: MARTS,
  listAuctions,
  listLots,
});
