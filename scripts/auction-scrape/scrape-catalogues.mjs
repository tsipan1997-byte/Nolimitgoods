// Збирає каталоги аукціонів Cheffins і Brightwells (лоти, фото, ставки) у JSON-файли.
// Запуск з кореня проєкту: node scripts/auction-scrape/scrape-catalogues.mjs
// Результат: scripts/auction-scrape/out/cheffins.json, brightwells.json, log.txt
// Працює на домашньому ноутбуці через справжній Chrome (як і auto-bids).

import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.join(HERE, '..', 'auto-bids', 'package.json'));
const { chromium } = require('playwright-core');

const OUT = path.join(HERE, 'out');
fs.mkdirSync(OUT, { recursive: true });
const LOG = path.join(OUT, 'log.txt');
fs.writeFileSync(LOG, '');
const log = (...a) => { const s = `[${new Date().toISOString()}] ${a.join(' ')}`; console.log(s); fs.appendFileSync(LOG, s + '\n'); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Аукціони Brightwells (відділ Plant & Machinery): беремо всі майбутні з цього відділу
const BRIGHTWELLS_DEPT = 'https://www.brightwells.com/plant-machinery/';
// Cheffins: сторінка з усіма майбутніми аукціонами техніки
const CHEFFINS_LIST = 'https://www.cheffins.co.uk/machinery-vintage-auctions.htm';
const CHEFFINS_SKIP = /vintage|automobilia|collection|classic/i; // вінтаж і колекції не беремо
let prevHead = '';
const MATCH = (process.argv.find((a) => a.startsWith('--match=')) || '').slice(8);
const CHEFFINS_SKIP_HEAD = /automobilia|collection|vintage|tools & workshop|horticultural|petroliana/i;

async function brightwells(page) {
  await page.goto(BRIGHTWELLS_DEPT, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await sleep(4000);
  const sales = await page.evaluate(() =>
    [...new Set([...document.querySelectorAll('a')].map((a) => a.href).filter((h) => /\/department\/plant-machinery\/sale\/\d+$/.test(h)))]
  );
  log('brightwells sales:', sales.length);
  const out = [];
  for (const url of sales) {
    const id = url.match(/sale\/(\d+)$/)[1];
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await sleep(3000);
    // запит до API йде від імені браузера (ті самі cookies), але без обмежень CORS
    const r = await page.request.post(`https://api.brightwells.com/api/1/sales/${id}/lots/data`, {
      headers: { 'Content-Type': 'application/json', Origin: 'https://www.brightwells.com', Referer: url },
      data: { page: 1, perPage: 2000 },
    });
    const j = await r.json().catch(() => ({}));
    const data = { title: await page.title(), lots: j.lots || [] };
    log('brightwells', id, data.title, 'lots:', data.lots.length);
    out.push({ saleId: id, url, title: data.title, lots: data.lots });
  }
  fs.writeFileSync(path.join(OUT, 'brightwells.json'), JSON.stringify(out));
}

async function cheffinsCatalogue(page, url) {
  const lots = [];
  for (let p = 1; p < 200; p++) {
    const u = `${url.split('?')[0]}?page=${p}&pageSize=60`;
    await page.goto(u, { waitUntil: 'domcontentloaded', timeout: 90000 });
    let n = 0;
    for (let k = 0; k < 30; k++) { await sleep(1000); n = await page.locator('.lot-grid-item').count(); if (n) break; }
    await sleep(1500);
    // фото вантажаться ліниво — прокручуємо до кожної картки
    await page.evaluate(async () => {
      for (const c of document.querySelectorAll('.lot-grid-item')) { c.scrollIntoView({ block: 'center' }); await new Promise((r) => setTimeout(r, 350)); }
    });
    await sleep(1500);
    const rows = await page.evaluate(() =>
      [...document.querySelectorAll('.lot-grid-item')].map((c) => ({
        lotno: (c.querySelector('.lotno')?.innerText || '').trim(),
        text: c.innerText,
        href: c.querySelector('a')?.href || '',
        img: c.querySelector('img')?.src || '',
      }))
    );
    const before = lots.length;
    for (const r of rows) if (!lots.some((x) => x.href === r.href)) lots.push(r);
    if (lots.length === before || rows.length < 60) break;
  }
  return lots;
}

async function cheffins(page) {
  await page.goto(CHEFFINS_LIST, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await sleep(4000);
  // розкрити «Load more»
  for (let k = 0; k < 5; k++) {
    const more = page.getByText('Load more', { exact: true });
    if (!(await more.count())) break;
    try { await more.first().click({ timeout: 5000 }); await sleep(3000); } catch { break; }
  }
  const sales = await page.evaluate(() => {
    const res = [];
    for (const a of document.querySelectorAll('a')) {
      if (!/auctionmarts\.com\/(lots|sales)\//.test(a.href) || !/catalogue/i.test(a.innerText)) continue;
      let box = a; for (let i = 0; i < 6 && box.parentElement; i++) { box = box.parentElement; if (/STARTS:|DATE:/.test(box.innerText)) break; }
      res.push({ href: a.href, info: box.innerText });
    }
    return res;
  });
  log('cheffins catalogues on list page:', sales.length);
  const out = [];
  const seen = new Set();
  for (const s of sales) {
    if (seen.has(s.href)) continue; seen.add(s.href);
    if (CHEFFINS_SKIP.test(s.info.split('\n').slice(0, 3).join(' '))) { log('skip', s.info.split('\n').slice(0, 2).join(' / ')); continue; }
    let catalogues = [s.href];
    if (/\/sales\//.test(s.href)) {
      // збірний аукціон (Cambridge Machinery Sale) — кілька каталогів усередині
      await page.goto(s.href, { waitUntil: 'domcontentloaded', timeout: 90000 });
      for (let k = 0; k < 20; k++) { await sleep(1000); if (await page.locator('a[href*="/lots/"]').count()) break; }
      await sleep(2000);
      catalogues = await page.evaluate(() => [...new Set([...document.querySelectorAll('a[href*="/lots/"]')].map((a) => a.href.split('?')[0]))]);
      log('sale group', s.info.split('\n')[1] || '', 'catalogues:', catalogues.length);
    }
    for (const c of catalogues) {
      await page.goto(c, { waitUntil: 'domcontentloaded', timeout: 90000 });
      let head = '';
      for (let k = 0; k < 30; k++) {
        await sleep(1000);
        head = await page.evaluate(() => (document.querySelector('main')?.innerText || '').slice(0, 600));
        const first = head.split('\n')[0].trim();
        if (first && first !== 'Lots' && first !== prevHead && /Auction/.test(head)) break;
      }
      prevHead = head.split('\n')[0].trim();
      if (CHEFFINS_SKIP_HEAD.test(head.slice(0, 120))) { log('skip catalogue', head.split('\n')[0]); continue; }
      if (MATCH && !head.slice(0, 200).toLowerCase().includes(MATCH.toLowerCase())) { log('not matched', head.split('\n')[0]); continue; }
      const lots = await cheffinsCatalogue(page, c);
      log('cheffins', c.slice(-12), 'lots:', lots.length);
      out.push({ listInfo: s.info, catalogue: c, head, lots });
    }
  }
  fs.writeFileSync(path.join(OUT, MATCH ? `cheffins-${MATCH.toLowerCase()}.json` : 'cheffins.json'), JSON.stringify(out));
}

const HEADLESS = process.argv.includes('--headless');
const browser = await chromium.launch({
  channel: 'chrome', headless: HEADLESS,
  args: ['--window-position=-2400,0', '--window-size=1300,900', '--mute-audio',
    '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding', '--disable-background-timer-throttling',
    '--disable-features=CalculateNativeWinOcclusion'],
});
try {
  const ctx = await browser.newContext({ locale: 'en-GB', viewport: { width: 1300, height: 900 } });
  const page = await ctx.newPage();
  const only = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7);
  if (!only || only === 'brightwells') try { await brightwells(page); } catch (e) { log('brightwells ERROR', e.message); }
  if (!only || only === 'cheffins') try { await cheffins(page); } catch (e) { log('cheffins ERROR', e.message); }
} finally {
  await browser.close();
}
log('done');
