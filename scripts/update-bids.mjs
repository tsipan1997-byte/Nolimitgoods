// Оновлює lib/auction-prices.json поточними ставками з публічних сторінок Ritchie Bros.
// Запуск: node scripts/update-bids.mjs  (потрібен playwright з chromium)
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const src = fs.readFileSync(path.join(root, 'lib/auction-lots.ts'), 'utf8');

// аукціони Ritchie Bros і лоти з сайту
const auctions = [...src.matchAll(/"id": "([^"]+)",\s*"house": "Ritchie Bros"[\s\S]*?"url": "([^"]+)"/g)].map((m) => ({
  id: m[1],
  slug: m[2].split('/').pop(),
}));
const lots = [...src.matchAll(/"auction": "([^"]+)",\s*"lot": "(\d*)"[\s\S]*?"endsAt": (\d+)/g)].map((m) => ({
  auction: m[1], lot: m[2], endsAt: +m[3],
}));
const now = Date.now();
const open = auctions.filter((a) => lots.some((l) => l.auction === a.id && l.lot && l.endsAt > now));
if (!open.length) { console.log('немає відкритих торгів'); process.exit(0); }

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1300, height: 2000 },
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36' });
const out = {};
for (const a of open) {
  const want = new Set(lots.filter((l) => l.auction === a.id && l.lot).map((l) => l.lot));
  for (let from = 0; from < 3000; from += 60) {
    await page.goto(`https://www.rbauction.co.uk/heavy-equipment-auctions/${a.slug}?from=${from}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForFunction(() => document.querySelectorAll('a[href*="/pdp/"]').length >= 5 && /£[\d,]+/.test(document.body.innerText), null, { timeout: 30000 }).catch(() => {});
    const got = await page.evaluate(() => {
      const res = {}; const seen = new Set();
      for (const a of document.querySelectorAll('a[href*="/pdp/"]')) {
        let c = a;
        for (let i = 0; i < 8 && c && !/^Lot \d+/.test(c.innerText || ''); i++) c = c.parentElement;
        if (!c) continue;
        const t = c.innerText; const lot = (t.match(/Lot (\d+)/) || [])[1];
        if (!lot || seen.has(lot)) continue; seen.add(lot);
        const bid = (t.match(/£([\d,]+)/) || [])[1]; const bids = (t.match(/(\d+) bids?/) || [])[1];
        res[lot] = { bid: bid ? +bid.replace(/,/g, '') : null, bids: bids ? +bids : 0 };
      }
      return res;
    });
    const keys = Object.keys(got);
    if (!keys.length) break;
    for (const k of keys) if (want.has(k)) out[`${a.id}:${k}`] = got[k];
    console.log(a.id, 'from', from, keys.length, 'cards');
    if (keys.length < 30) break;
  }
}
await browser.close();
if (!Object.keys(out).length) { console.error('Не отримано жодної ставки — сторінка могла не завантажитись'); process.exit(1); }
const tmp = path.join(root, '.prices.tmp.json');
fs.writeFileSync(tmp, JSON.stringify(out));
execFileSync('python3', [path.join(root, 'scripts/apply-prices.py'), tmp], { stdio: 'inherit' });
fs.unlinkSync(tmp);
