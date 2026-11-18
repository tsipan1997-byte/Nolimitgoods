// Автооновлення ставок Ritchie Bros для nolimitgoods.com/aukciony.
// Працює на домашньому комп'ютері (Windows), бо Ritchie Bros (Akamai) блокує сервери й хмару.
// Запуск: node scripts/auto-bids/update-bids.mjs   (Планувальник завдань запускає run.cmd)
//
// Що робить:
//  1. Бере з lib/auction-lots.ts усі аукціони Ritchie Bros, торги яких ще не закінчились.
//  2. Відкриває їхні сторінки у справжньому Chrome (через playwright-core) і збирає «Lot N → £ставка, N bids».
//  3. Записує ставки тільки для лотів, що є на сайті, у lib/auction-prices.json.
//  4. git pull → commit → push. Сайт на Vercel перезбирається сам.
// Якщо щось пішло не так (сторінка не відкрилась, 0 ставок) — нічого не пушить, старі ставки лишаються.

import { chromium } from 'playwright-core';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const LOTS_TS = path.join(ROOT, 'lib', 'auction-lots.ts');
const PRICES = path.join(ROOT, 'lib', 'auction-prices.json');
const LOG = path.join(ROOT, 'scripts', 'auto-bids', 'last-run.log');
const DRY = process.argv.includes('--dry');

const log = (...a) => {
  const line = `[${new Date().toISOString()}] ${a.join(' ')}`;
  console.log(line);
  fs.appendFileSync(LOG, line + '\n');
};
const sh = (cmd) => execSync(cmd, { cwd: ROOT, stdio: 'pipe' }).toString().trim();

function readSiteData() {
  const src = fs.readFileSync(LOTS_TS, 'utf8');
  const aStart = src.indexOf('export const AUCTIONS');
  const aJson = src.slice(src.indexOf('= [', aStart) + 2, src.indexOf('];', aStart) + 1);
  const auctions = JSON.parse(aJson);
  // лоти: беремо пари auction/lot/endsAt регулярками (файл великий, але структура стабільна)
  const lots = [];
  const re = /"auction":\s*"([^"]+)",\s*"lot":\s*"([^"]*)"[\s\S]*?"endsAt":\s*(\d+)/g;
  let m;
  while ((m = re.exec(src))) lots.push({ auction: m[1], lot: m[2], endsAt: +m[3] });
  return { auctions, lots };
}

// Виконується всередині сторінки rbauction: гортає каталог через iframe і читає текст карток.
async function scrapeInPage(page, slug) {
  return page.evaluate(async (slug) => {
    const out = {};
    const parse = (t) => {
      for (const seg of t.split(/\n(?=Lot \d+\n)/)) {
        const m = seg.match(/^Lot (\d+)\n/);
        if (!m) continue;
        const bid = (seg.match(/£([\d,]+)\s*\n?GBP/) || [])[1];
        const bids = (seg.match(/(\d+) bids?\b/) || [])[1];
        out[m[1]] = { bid: bid ? +bid.replace(/,/g, '') : null, bids: bids ? +bids : 0 };
      }
    };
    for (let from = 0; from < 3000; from += 60) {
      const f = document.createElement('iframe');
      f.style.cssText = 'position:fixed;left:-3000px;width:1300px;height:2000px';
      f.src = `/heavy-equipment-auctions/${slug}?from=${from}`;
      document.body.appendChild(f);
      await new Promise((r) => { f.onload = r; setTimeout(r, 30000); });
      let txt = '';
      for (let k = 0; k < 20; k++) {
        await new Promise((r) => setTimeout(r, 1000));
        try { txt = f.contentDocument.body.innerText; } catch { txt = ''; }
        if ((txt.match(/\nLot \d+\n/g) || []).length >= 5 && /£[\d,]+/.test(txt)) break;
      }
      const before = Object.keys(out).length;
      parse('\n' + txt);
      f.remove();
      if (Object.keys(out).length === before) break; // далі сторінок немає
    }
    return out;
  }, slug);
}

async function main() {
  log('--- start', DRY ? '(dry run)' : '');
  try { sh('git pull --rebase --autostash'); } catch (e) { log('git pull failed:', e.message.split('\n')[0]); }

  const { auctions, lots } = readSiteData();
  const now = Date.now();
  const targets = auctions
    .filter((a) => a.house === 'Ritchie Bros' && /heavy-equipment-auctions\/([^/?#]+)/.test(a.url))
    .map((a) => ({ id: a.id, slug: a.url.match(/heavy-equipment-auctions\/([^/?#]+)/)[1] }))
    .filter((a) => lots.some((l) => l.auction === a.id && l.endsAt > now - 3600e3));
  if (!targets.length) { log('no active Ritchie Bros auctions — nothing to do'); return; }

  const browser = await chromium.launch({
    channel: 'chrome', // справжній Chrome, встановлений на комп'ютері
    headless: false, // Akamai часто блокує headless; вікно відкривається за межами екрана
    args: ['--window-position=-2400,0', '--window-size=1300,900', '--mute-audio'],
  });
  const fresh = {};
  try {
    const ctx = await browser.newContext({ locale: 'en-GB', viewport: { width: 1300, height: 900 } });
    const page = await ctx.newPage();
    for (const t of targets) {
      await page.goto(`https://www.rbauction.co.uk/heavy-equipment-auctions/${t.slug}`, { waitUntil: 'domcontentloaded', timeout: 90000 });
      await page.waitForTimeout(5000);
      const body = await page.evaluate(() => document.body.innerText.slice(0, 300));
      if (/Access Denied/i.test(body)) { log(t.id, 'ACCESS DENIED'); continue; }
      const res = await scrapeInPage(page, t.slug);
      const n = Object.keys(res).length;
      log(t.id, t.slug, 'lots read:', n);
      for (const [lot, v] of Object.entries(res)) fresh[`${t.id}:${lot}`] = v;
    }
  } finally {
    await browser.close();
  }

  // лише лоти, які є на сайті, і лише зі ставками
  const onSite = new Set(lots.map((l) => `${l.auction}:${l.lot}`));
  const got = Object.entries(fresh).filter(([k, v]) => onSite.has(k) && v.bid && v.bids > 0);
  if (!got.length) { log('0 bids collected — leaving site unchanged'); process.exitCode = 1; return; }

  const prev = fs.existsSync(PRICES) ? JSON.parse(fs.readFileSync(PRICES, 'utf8')) : { prices: {} };
  // зливаємо: свіжі ставки поверх старих; лот, який цього разу не прочитався, зберігає попередню ставку
  const prices = { ...(prev.prices || {}) };
  for (const [k, v] of got) prices[k] = { bid: v.bid, bids: v.bids };

  const changed = JSON.stringify(prices) !== JSON.stringify(prev.prices || {});
  if (!changed) { log('no bid changes — nothing to push'); return; }

  const updatedAt = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
  fs.writeFileSync(PRICES, JSON.stringify({ updatedAt, prices }, null, 0) + '\n');
  log('written', Object.keys(prices).length, 'lots, updatedAt', updatedAt);
  if (DRY) { log('dry run — not committing'); return; }

  sh('git add lib/auction-prices.json');
  sh(`git commit -m "Auctions: bid update ${updatedAt.slice(0, 16).replace('T', ' ')} UTC (home PC)"`);
  sh('git push');
  log('pushed');
}

main().catch((e) => { log('ERROR', e.stack || e.message); process.exitCode = 1; });
