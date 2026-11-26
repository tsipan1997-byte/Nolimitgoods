// Офлайн-тести парсерів: node scripts/parsers/test.mjs
// Не ходить у мережу: усі відповіді беруться з scripts/parsers/fixtures/<source>/manifest.json.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { categorize, parseDate, parseKm, parseHours, makeTitle, validateLot, uaDateRange } from './lib/model.mjs';
import { runSource } from './lib/runner.mjs';
import { mergeFeed, appendArchive } from './lib/merge.mjs';
import { SOURCES } from './sources/index.mjs';
import { checkFeed } from './alert-telegram.mjs';
import { parseAuctionSlug } from './sources/euroauctions.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIX = path.join(HERE, 'fixtures');
const NOW = new Date('2026-11-26T09:00:00Z');
const quiet = { info() {}, warn() {}, error() {}, debug() {} };
const src = (id) => SOURCES.find((s) => s.id === id);
const run = (id, now = NOW) => runSource(src(id), { offlineDir: FIX, now, log: quiet });

test('категорії: евристика за ключовими словами', () => {
  const cases = {
    '2021 Hitachi ZX210LC-6 — 700mm Pads, CV, QH, Piped': 'excavators',
    '2015 JCB 3CX P21 ECO — Backhoe Loader': 'excavators',
    'Unused 2026 JWB JWB2000 — Hydraulic Breaker 80mm Pin to suit 20 Ton Excavator': 'breakers',
    'Unused 2026 KBKC SS-300 — Hydraulic Shear 90mm Pin to suit 30 Ton Excavator': 'attachments',
    'Pramac GRW280V — 286kVA Generator, Volvo Engine': 'energy',
    '2022 JCB 540-180 Telehandler': 'telehandlers',
    '2017 NEW HOLLAND T7.210 AutoCommand 4wd 40kph TRACTOR': 'agro',
    '2016 Isuzu D-Max E/C Twin Turbo TD': 'pickups',
    '2012 DAF LF45-160': 'trucks',
    '2021 Volvo A25G — 6x6 Articulated Dumptruck': 'excavators',
    'Ifor Williams B4G Twin Axle Plant Trailer': 'trucks',
    '2018 Ford Transit Custom Panel Van': null,
    'Box of hand tools': null,
    'Pallet of Fencing Panels': null,
  };
  for (const [t, c] of Object.entries(cases)) assert.equal(categorize(t).category, c, t);
});

test('дати: Лондон GMT/BST → UTC, різні формати', () => {
  assert.equal(new Date(parseDate('01/12/2026 10:00')).toISOString(), '2026-12-01T10:00:00.000Z'); // GMT
  assert.equal(new Date(parseDate('15/07/2026 10:00')).toISOString(), '2026-07-15T09:00:00.000Z'); // BST
  assert.equal(new Date(parseDate('Tuesday 1st December 2026 11:00am')).toISOString(), '2026-12-01T11:00:00.000Z');
  assert.equal(new Date(parseDate('26th November 2026 at 09:00')).toISOString(), '2026-11-26T09:00:00.000Z');
  assert.equal(new Date(parseDate('2026-11-26T08:54:00Z')).toISOString(), '2026-11-26T08:54:00.000Z');
  assert.equal(new Date(parseDate('10/12/2026 10:00', 'Europe/Madrid')).toISOString(), '2026-12-10T09:00:00.000Z');
  assert.equal(uaDateRange(Date.UTC(2026, 10, 25, 10), Date.UTC(2026, 10, 28, 10)), '25–28 листопада 2026');
  assert.deepEqual(parseAuctionSlug('leeds-25th-26th-27th-28th-november-2026'), { placeKey: 'leeds', days: [25, 26, 27, 28], month: 10, year: 2026 });
});

test('числа й назва', () => {
  assert.equal(parseKm('56,825 miles'), 91451);
  assert.equal(parseKm('211,630 km'), 211630);
  assert.equal(parseHours('Hours: 7,845'), 7845);
  assert.equal(parseHours('6,385 hrs'), 6385);
  assert.equal(makeTitle('Unused 2026 Mustang RH12 — Hydraulic Rotating Pulveriser', 'Подрібнювач', true), 'Подрібнювач Mustang RH12, новий');
});

test('Euro Auctions: HTML-картки + вбудований JSON, пагінація, валюта', async () => {
  const r = await run('euroauctions');
  assert.equal(r.ok, true, r.error);
  assert.deepEqual(r.auctions.map((a) => a.id).sort(), ['ea-dromore-2026-12', 'ea-leeds-2026-11', 'ea-zaragoza-2026-12']);
  const leeds = r.auctions.find((a) => a.id === 'ea-leeds-2026-11');
  assert.equal(leeds.totalLots, 9479);
  assert.equal(leeds.dates, '25–28 листопада 2026');
  assert.equal(r.auctions.find((a) => a.id === 'ea-zaragoza-2026-12').currency, 'EUR');
  assert.equal(r.lots.length, 10); // 6 з Лідса (2 сторінки, дубль прибрано) + 4 з Дромора (JSON)
  const hitachi = r.lots.find((l) => l.item === '140566690');
  assert.equal(hitachi.category, 'excavators');
  assert.equal(hitachi.year, 2021);
  assert.equal(hitachi.hours, 5210);
  assert.equal(hitachi.endsAt, Date.UTC(2026, 10, 26, 10)); // Sale Day 2 = 26.11 10:00
  assert.match(hitachi.img, /^https:\/\/images\.euroauctionslive\.com\/auction-1050\/140566690\//);
  assert.match(hitachi.url, /^https:\/\/www\.euroauctions\.com\/en\/equipment-search\/product\/140566690\//);
  const zx350 = r.lots.find((l) => l.item === '140510935');
  assert.equal(zx350.unused, true);
  assert.equal(zx350.gallery.length, 2);
  assert.equal(zx350.endsAt, Date.UTC(2026, 11, 12, 10));
  assert.equal(r.lots.find((l) => l.item === '140570001').category, null); // фургон
  assert.equal(r.lots.find((l) => l.item === '100399999').category, null); // палета
  for (const l of r.lots) assert.deepEqual(validateLot(l), [], l.sourceId);
});

test('Wilsons: список аукціонів (фільтр техніки, минулі відкинуто), картки лотів', async () => {
  const r = await run('wilsons');
  assert.equal(r.ok, true, r.error);
  assert.deepEqual(r.auctions.map((a) => a.id), ['wilsons-belfast-2026-12-6301', 'wilsons-dublin-2026-12-6310']);
  assert.equal(r.auctions[0].format, 'Живі торги + онлайн-ставки');
  assert.equal(r.auctions[1].currency, 'EUR');
  const komatsu = r.lots.find((l) => l.item === '554112');
  assert.equal(komatsu.lot, '151');
  assert.equal(komatsu.hours, 6385);
  assert.equal(komatsu.category, 'excavators');
  assert.equal(komatsu.endsAt, Date.UTC(2026, 11, 1, 11));
  assert.match(komatsu.specs, /оцінка аукціону ≈ £20 000/);
  assert.equal(r.lots.find((l) => l.item === '540274').miles, 91451);
  assert.equal(r.lots.find((l) => l.item === '555621').category, 'breakers');
  assert.equal(r.lots.find((l) => l.item === '549999').category, null);
  assert.equal(r.lots.find((l) => l.item === '560001').currency, 'EUR');
});

test('Cheffins: список (вінтаж пропущено), збірний аукціон, картки .lot-grid-item', async () => {
  const r = await run('cheffins');
  assert.equal(r.ok, true, r.error);
  assert.equal(r.auctions.length, 2);
  assert.ok(!r.auctions.some((a) => /vintage/i.test(a.name)));
  const cms = r.auctions.find((a) => a.name === 'Cambridge Machinery Sale');
  assert.equal(cms.format, 'Живі торги + онлайн-ставки');
  const nh = r.lots.find((l) => l.lot === '1');
  assert.equal(nh.item, 'OTg2MzM1YTYtMTYyYS00MGNjLTk1ZDUtNjM4MGMy');
  assert.equal(nh.category, 'agro');
  assert.equal(nh.hours, 6120);
  assert.equal(nh.endsAt, Date.UTC(2026, 11, 1, 10));
  assert.equal(r.lots.find((l) => l.lot === '1040').auction, cms.id);
  assert.equal(r.lots.find((l) => l.lot === '3').category, null);
});

test('Brightwells: API лотів, ставки, продані, несправні', async () => {
  const r = await run('brightwells');
  assert.equal(r.ok, true, r.error);
  assert.equal(r.auctions.length, 2);
  assert.equal(r.auctions.find((a) => a.id.endsWith('6092')).totalLots, 1531);
  const gen = r.lots.find((l) => l.item === '926132');
  assert.equal(gen.lot, '207');
  assert.equal(gen.currentBid, 420);
  assert.equal(gen.bids, 5);
  assert.equal(gen.hours, 1234);
  assert.equal(gen.gallery.length, 2);
  assert.equal(gen.url, 'https://www.brightwells.com/department/plant-machinery/sale/6092/lot/926132');
  assert.equal(r.lots.find((l) => l.item === '926133').inoperable, true);
  const sold = r.lots.find((l) => l.item === '926050');
  assert.equal(sold.status, 'sold');
  assert.equal(sold.soldPrice, 10200);
  assert.equal(r.lots.find((l) => l.item === '926001').category, null); // бетономішалка не під попит
});

test('злиття: зникли з каталогу → closed/sold, минув час → closed, архів > 30 днів, падіння джерела не стирає лоти', async () => {
  const ea = await run('euroauctions');
  const bw = await run('brightwells');
  const res = (r, ok = true) => ({ id: r.source, ok, error: ok ? undefined : 'boom', durationMs: 1, lots: ok ? r.lots : [], auctions: ok ? r.auctions : [] });
  const first = mergeFeed(null, [res(ea), res(bw)], { now: NOW });
  assert.ok(first.feed.lots.every((l) => l.category));
  assert.equal(first.feed.lots.find((l) => l.item === '140560297').status, 'closed'); // Day 1 (25.11) уже минув
  assert.equal(first.feed.sources.euroauctions.count, 8);

  // другий запуск через годину: з EA зник Hitachi, Brightwells впав
  const later = new Date(NOW.getTime() + 3600e3);
  const ea2 = { ...res(ea), lots: ea.lots.filter((l) => l.item !== '140566690').map((l) => ({ ...l, firstSeenAt: later.toISOString() })) };
  const second = mergeFeed(first.feed, [ea2, res(bw, false)], { now: later });
  const hitachi = second.feed.lots.find((l) => l.item === '140566690');
  assert.equal(hitachi.status, 'closed');
  assert.equal(second.feed.lots.find((l) => l.item === '100379418').firstSeenAt, NOW.toISOString()); // firstSeenAt зберігся
  assert.ok(second.feed.lots.some((l) => l.source === 'brightwells' && l.status === 'active')); // лоти впалого джерела лишились
  assert.equal(second.feed.sources.brightwells.ok, false);
  assert.ok(second.feed.auctions.some((a) => a.source === 'brightwells'));

  // через 50 днів (Дромор 12.12 + 30 днів < 15.01): усе, що закрилось/минуло, іде в архів
  const much = new Date(NOW.getTime() + 50 * 86400e3);
  const third = mergeFeed(second.feed, [{ id: 'euroauctions', ok: true, durationMs: 1, lots: [], auctions: [] }], { now: much });
  assert.ok(third.archived.some((l) => l.item === '140566690'));
  assert.ok(!third.feed.lots.some((l) => l.source === 'euroauctions'));
  const arch = appendArchive({ lots: [third.archived[0]] }, third.archived, much);
  assert.equal(arch.lots.length, third.archived.length);
});

test('алерт: проблеми у фіді', () => {
  const ok = { generatedAt: NOW.toISOString(), sources: { a: { ok: true, count: 3 } }, lots: [{ status: 'active' }] };
  assert.deepEqual(checkFeed(ok, { now: NOW.getTime() }), []);
  const bad = { generatedAt: new Date(NOW.getTime() - 10 * 3600e3).toISOString(), sources: { a: { ok: false, error: 'HTTP 403' }, b: { ok: true, count: 0 } }, lots: [] };
  const p = checkFeed(bad, { now: NOW.getTime(), maxAgeHours: 6 });
  assert.equal(p.length, 4);
  assert.deepEqual(checkFeed(null), ['файл lots.json відсутній або не читається']);
});

test('CLI: run.mjs --offline пише <source>.json і lots.json; alert dry-run', () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'parsers-'));
  const pub = path.join(out, 'pub', 'lots-feed.json');
  const env = { ...process.env, TELEGRAM_ALERT_BOT_TOKEN: '', TELEGRAM_ALERT_CHAT_ID: '' };
  const r = spawnSync(process.execPath, [path.join(HERE, 'run.mjs'), `--offline=${FIX}`, `--out=${out}`, '--now=2026-11-26T09:00:00Z', '--limit=3', `--publish=${pub}`, '--strict'], { encoding: 'utf8', env });
  assert.equal(r.status, 0, r.stderr + r.stdout);
  for (const f of ['euroauctions', 'wilsons', 'cheffins', 'brightwells', 'lots']) assert.ok(fs.existsSync(path.join(out, `${f}.json`)), f);
  const feed = JSON.parse(fs.readFileSync(pub, 'utf8'));
  assert.deepEqual(Object.keys(feed).sort(), ['auctions', 'generatedAt', 'lots', 'sources']);
  assert.ok(feed.lots.length > 0);
  assert.ok(JSON.parse(fs.readFileSync(path.join(out, 'euroauctions.json'), 'utf8')).lots.length <= 3);
  // невідоме джерело → exit 2; заглушка BCA → усі впали → exit 1
  assert.equal(spawnSync(process.execPath, [path.join(HERE, 'run.mjs'), '--source=nope', `--out=${out}`], { encoding: 'utf8' }).status, 2);
  assert.equal(spawnSync(process.execPath, [path.join(HERE, 'run.mjs'), '--source=bca', `--offline=${FIX}`, `--out=${out}`], { encoding: 'utf8' }).status, 1);
  const a = spawnSync(process.execPath, [path.join(HERE, 'alert-telegram.mjs'), path.join(out, 'lots.json'), '--max-age-hours=1000000'], { encoding: 'utf8', env });
  assert.equal(a.status, 0, a.stderr);
  assert.match(a.stdout, /dry-run/); // bca впав → є проблема → лише друк, без відправки
  fs.rmSync(out, { recursive: true, force: true });
});
