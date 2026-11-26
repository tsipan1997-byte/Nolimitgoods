#!/usr/bin/env node
// Автопарсер лотів аукціонів. Запуск з кореня репозиторію:
//   node scripts/parsers/run.mjs [--source=euroauctions,wilsons] [--limit=N] [--offline=<dir>] [--save=<dir>]
//                                [--publish=lib/lots-feed.json] [--strict] [--no-browser] [--verbose] [--out=<dir>]
// Результат: scripts/parsers/out/<source>.json, out/lots.json (злиття), out/archive.json (закриті > 30 днів).
// Детально — у scripts/parsers/README.md. Це лише CLI: не імпортуйте цей файл (логіка — у lib/runner.mjs).

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { SOURCES, BANNED_HOUSES } from './sources/index.mjs';
import { logger, runSource, readJson, writeJson, withTimeout } from './lib/runner.mjs';
import { mergeFeed, appendArchive } from './lib/merge.mjs';
import { browserPool } from './lib/browser.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const a = {};
  for (const s of argv) {
    const m = s.match(/^--([\w-]+)(?:=(.*))?$/);
    if (m) a[m[1]] = m[2] ?? true;
  }
  return a;
}

const args = parseArgs(process.argv.slice(2));

// Проксі: Node ≥ 22.21 читає HTTPS_PROXY сам, якщо NODE_USE_ENV_PROXY=1 — перезапускаємо себе з цим прапором.
{
  const [maj, min] = process.versions.node.split('.').map(Number);
  const supports = maj >= 24 || (maj === 22 && min >= 21);
  if ((process.env.HTTPS_PROXY || process.env.https_proxy) && !args.offline && supports && process.env.NODE_USE_ENV_PROXY !== '1') {
    const r = spawnSync(process.execPath, process.argv.slice(1), { stdio: 'inherit', env: { ...process.env, NODE_USE_ENV_PROXY: '1', NODE_NO_WARNINGS: '1' } });
    process.exit(r.status ?? 1);
  }
}

const OUT = path.resolve(args.out || path.join(HERE, 'out'));
const LIMIT = args.limit ? Math.max(1, +args.limit) : Infinity;
if (args.verbose) process.env.PARSERS_VERBOSE = '1';
const TIMEOUT = +(args.timeout || 15 * 60e3);

async function main() {
  const log = logger('runner');
  const wanted = args.source ? String(args.source).split(',').map((s) => s.trim()).filter(Boolean) : null;
  const unknown = (wanted || []).filter((w) => !SOURCES.some((s) => s.id === w));
  if (unknown.length) { log.error(`невідомі джерела: ${unknown.join(', ')}. Є: ${SOURCES.map((s) => s.id).join(', ')}`); process.exit(2); }
  const sources = SOURCES.filter((s) => (wanted ? wanted.includes(s.id) : s.enabled) && !BANNED_HOUSES.has(s.house));
  const browser = browserPool({ allowed: !args['no-browser'], log });
  const offlineDir = args.offline ? path.resolve(String(args.offline)) : null;
  const saveDir = args.save ? path.resolve(String(args.save)) : null;
  const now = args.now ? new Date(String(args.now)) : new Date();
  log.info(`джерела: ${sources.map((s) => s.id).join(', ')}; limit=${LIMIT}; offline=${offlineDir || 'ні'}; out=${OUT}`);

  const results = [];
  try {
    for (const src of sources) {
      const slog = logger(src.id);
      const r = await withTimeout(runSource(src, { limit: LIMIT, offlineDir, saveDir, browser, now, log: slog }), TIMEOUT, src.id)
        .catch((e) => ({ source: src.id, house: src.house, name: src.name, ok: false, error: e.message, durationMs: TIMEOUT, counts: {}, auctions: [], lots: [] }));
      slog.info(`${r.ok ? 'OK' : 'FAIL'} аукціонів ${r.auctions.length}, лотів ${r.lots.length} (під попит ${r.lots.filter((l) => l.category).length}) за ${(r.durationMs / 1000).toFixed(1)} с${r.error ? ' — ' + r.error : ''}`);
      writeJson(path.join(OUT, `${src.id}.json`), r);
      results.push(r);
    }
  } finally {
    await browser.close();
  }

  // злиття з попереднім lots.json
  const feedPath = path.join(OUT, 'lots.json');
  const archivePath = path.join(OUT, 'archive.json');
  const prev = readJson(feedPath);
  const { feed, archived, stats } = mergeFeed(prev, results.map((r) => ({ id: r.source, ok: r.ok, error: r.error, durationMs: r.durationMs, lots: r.lots, auctions: r.auctions })), { now, banned: BANNED_HOUSES });
  writeJson(feedPath, feed);
  if (archived.length) writeJson(archivePath, appendArchive(readJson(archivePath), archived, now));
  log.info(`lots.json: лотів ${feed.lots.length} (активних ${feed.lots.filter((l) => l.status === 'active').length}), аукціонів ${feed.auctions.length}; ${JSON.stringify(stats)}`);

  if (args.publish) {
    const dest = path.resolve(String(args.publish));
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(feedPath, dest);
    log.info(`опубліковано → ${dest}`);
  }

  const failed = results.filter((r) => !r.ok);
  if (results.length && failed.length === results.length) { log.error('усі джерела впали'); process.exitCode = 1; }
  else if (args.strict && failed.length) { log.error(`--strict: впали ${failed.map((r) => r.source).join(', ')}`); process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exit(1); });
