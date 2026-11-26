#!/usr/bin/env node
// Сповіщення в Telegram про проблеми автопарсера.
//   node scripts/parsers/alert-telegram.mjs [шлях до lots.json] [--max-age-hours=6] [--dry-run] [--always] [--fail-on-problem]
//
// Перевіряє out/lots.json: файл є і читається; не старший за N годин; немає джерел з помилкою;
// немає джерел з 0 лотів; загалом є активні лоти. Якщо є проблеми — шле повідомлення.
// Надсилання лише коли задано ОБИДВІ змінні: TELEGRAM_ALERT_BOT_TOKEN і TELEGRAM_ALERT_CHAT_ID
// і немає --dry-run. Інакше — dry-run: текст лише друкується в консоль.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const flag = (n) => argv.find((a) => a === `--${n}` || a.startsWith(`--${n}=`));
const val = (n, d) => { const f = flag(n); return f && f.includes('=') ? f.split('=').slice(1).join('=') : d; };
const file = path.resolve(argv.find((a) => !a.startsWith('--')) || path.join(HERE, 'out', 'lots.json'));
const maxAgeH = +val('max-age-hours', process.env.ALERT_MAX_AGE_HOURS || 6);

/** Повертає список проблем (рядки українською). Експортується для тестів. */
export function checkFeed(feed, { now = Date.now(), maxAgeHours = 6 } = {}) {
  const problems = [];
  if (!feed) return ['файл lots.json відсутній або не читається'];
  const age = (now - Date.parse(feed.generatedAt || 0)) / 3600e3;
  if (!Number.isFinite(age) || age > maxAgeHours) problems.push(`дані застарілі: оновлено ${Number.isFinite(age) ? age.toFixed(1) + ' год тому' : 'невідомо коли'} (поріг ${maxAgeHours} год)`);
  for (const [id, s] of Object.entries(feed.sources || {})) {
    if (!s.ok) problems.push(`джерело ${id} впало: ${String(s.error || 'невідома помилка').slice(0, 200)}`);
    else if (!s.count) problems.push(`джерело ${id}: 0 лотів (змінилася розмітка сайту?)`);
  }
  const active = (feed.lots || []).filter((l) => l.status === 'active').length;
  if (!active) problems.push('загалом 0 активних лотів');
  return problems;
}

export function formatMessage(problems, feed) {
  const run = process.env.GITHUB_RUN_ID ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}` : '';
  const lines = [
    problems.length ? '⚠️ Автопарсер лотів: проблеми' : '✅ Автопарсер лотів: усе гаразд',
    ...problems.map((p) => `• ${p}`),
    feed ? `Лотів: ${(feed.lots || []).length}, активних: ${(feed.lots || []).filter((l) => l.status === 'active').length}, аукціонів: ${(feed.auctions || []).length}` : '',
    feed?.generatedAt ? `Оновлено: ${feed.generatedAt}` : '',
    run ? `Запуск: ${run}` : '',
  ];
  return lines.filter(Boolean).join('\n');
}

async function main() {
  let feed = null;
  try { feed = JSON.parse(fs.readFileSync(file, 'utf8')); } catch { /* обробляється в checkFeed */ }
  const problems = checkFeed(feed, { maxAgeHours: maxAgeH });
  if (!problems.length && !flag('always')) { console.log(`OK: ${file} без проблем`); return; }
  const text = formatMessage(problems, feed);
  const token = process.env.TELEGRAM_ALERT_BOT_TOKEN;
  const chat = process.env.TELEGRAM_ALERT_CHAT_ID;
  if (!token || !chat || flag('dry-run')) {
    console.log(`[dry-run: ${!token || !chat ? 'немає TELEGRAM_ALERT_BOT_TOKEN/TELEGRAM_ALERT_CHAT_ID' : '--dry-run'}] повідомлення:\n${text}`);
  } else {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text, disable_web_page_preview: true }),
    });
    if (!r.ok) { console.error(`Telegram відповів ${r.status}: ${(await r.text()).slice(0, 300)}`); process.exitCode = 1; }
    else console.log('надіслано в Telegram');
  }
  if (problems.length && flag('fail-on-problem')) process.exitCode = 3;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
