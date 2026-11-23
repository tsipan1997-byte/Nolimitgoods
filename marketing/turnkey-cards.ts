// Картки «ціна під ключ» для постів/сторіз: ціна молотка + під ключ в Україні прямо на фото.
// Запуск: npx tsx marketing/turnkey-cards.ts [outDir]
// Виходить: card_1..6.jpg (1080x1350, стрічка FB/IG) і story_1..6.jpg (1080x1920).
import { createCanvas, loadImage, GlobalFonts, type Image, type SKRSContext2D } from '@napi-rs/canvas';
import fs from 'fs';
import path from 'path';
import { allResults, type AuctionResult } from '../lib/auction-results';
import { rbFee, ourFee, AUCTION_META } from '../lib/auction-lots';
import { turnkeyGbp, transportGbp } from '../lib/turnkey';

const DIR = __dirname;
const OUT = process.argv[2] || path.join(DIR, '..', 'public', 'ads', '2026-11-23');
fs.mkdirSync(OUT, { recursive: true });
GlobalFonts.registerFromPath('/System/Library/Fonts/SFNS.ttf', 'SF');

const USD = 1.3, EUR = 1.17; // як у постах
const W = 1080, FEED_H = 1350, STORY_H = 1920;
const INK = '#0f172a', MUTED = '#64748b', RED = '#dc2626', GREEN = '#047857', GREEN_BG = '#ecfdf5', GREEN_BD = '#a7f3d0';

const sp = (n: number) => Math.round(n).toLocaleString('uk-UA').replace(/\s/g, ' ');
const r100 = (n: number) => Math.round(n / 100) * 100;
const r500 = (n: number) => Math.round(n / 500) * 500;
const usd = (t: [number, number]) => `$${sp(r500(t[0] * USD))} – ${sp(r500(t[1] * USD))}`;
const eur = (t: [number, number]) => `€${sp(r500(t[0] * EUR))} – ${sp(r500(t[1] * EUR))}`;

// Лоти для серії (перевірені результати Ritchie Bros 18.11.2026)
const R = allResults();
const find = (re: RegExp, hours: number) => R.find((r) => re.test(r.original) && r.hours === hours)!;
const LOTS: { r: AuctionResult; name: string }[] = [
  { r: find(/Kubota KX080/, 7658), name: 'Екскаватор Kubota KX080' },
  { r: find(/JCB 540-140/, 3387), name: 'Телескоп JCB 540-140' },
  { r: find(/Cat 313GC/, 3488), name: 'Екскаватор Cat 313GC' },
  { r: find(/New Holland T7\.300/, 4362), name: 'Трактор New Holland T7.300' },
];
for (const l of LOTS) if (!l.r) throw new Error('lot not found: ' + l.name);

async function img(url: string): Promise<Image> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return loadImage(Buffer.from(await res.arrayBuffer()));
}
let logo: Image;
let photos: Image[];

let ctx: SKRSContext2D;
const font = (size: number, weight = 800) => `${weight} ${size}px SF`;
function text(s: string, x: number, y: number, size: number, color = INK, weight = 800, align: CanvasTextAlign = 'left') {
  ctx.font = font(size, weight); ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'alphabetic'; ctx.fillText(s, x, y);
}
function fit(s: string, x: number, y: number, maxW: number, size: number, color = INK, weight = 800, align: CanvasTextAlign = 'left') {
  let sz = size;
  ctx.font = font(sz, weight);
  while (ctx.measureText(s).width > maxW && sz > 20) ctx.font = font(--sz, weight);
  text(s, x, y, sz, color, weight, align);
}
function rrect(x: number, y: number, w: number, h: number, r: number, fill?: string, stroke?: string, lw = 3) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
}
function cover(im: Image, x: number, y: number, w: number, h: number, r = 0) {
  const s = Math.max(w / im.width, h / im.height);
  const iw = im.width * s, ih = im.height * s;
  ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.clip();
  ctx.drawImage(im, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih); ctx.restore();
}
function pill(s: string, x: number, y: number, size: number, bg: string, color = '#fff', align: 'left' | 'right' = 'left') {
  ctx.font = font(size, 800);
  const w = ctx.measureText(s).width + size * 1.4, h = size * 1.9;
  const x0 = align === 'right' ? x - w : x;
  rrect(x0, y, w, h, h / 2, bg);
  text(s, x0 + w / 2, y + h * 0.68, size, color, 800, 'center');
}

// Плашка про ПДВ Англії: платиться на аукціоні, повертається після експорту
function ukVat(x: number, y: number, w: number, r: AuctionResult) {
  const v = r100((r.bid + rbFee(r.bid)) * 0.2);
  rrect(x, y, w, 134, 20, '#fffbeb', '#fcd34d', 3);
  fit(`+ ПДВ Англії 20% ≈ £${sp(v)}`, x + 18, y + 38, w - 36, 26, '#b45309', 900);
  fit('повертається після експорту,', x + 18, y + 74, w - 36, 24, '#92400e', 700);
  fit('умови — індивідуально', x + 18, y + 108, w - 36, 24, '#92400e', 700);
}

// Шапка: лого + червона плашка; 0..130
function header(y: number) {
  const lw = 230, lh = (lw * logo.height) / logo.width;
  ctx.drawImage(logo, 48, y + 34, lw, lh);
  pill('АУКЦІОНИ АНГЛІЇ → УКРАЇНА', W - 48, y + 44, 26, RED, '#fff', 'right');
}
// Низ: контакти; висота 150
function footer(y: number) {
  rrect(48, y, W - 96, 150, 28, INK);
  text('Назвіть модель і бюджет — порахуємо під ключ', W / 2, y + 52, 32, '#fff', 800, 'center');
  text('t.me/nolimitgoods  ·  nolimitgoods.com', W / 2, y + 96, 28, '#cbd5e1', 600, 'center');
  text('+44 7426 826595  ·  +380 50 140 0245', W / 2, y + 134, 28, '#cbd5e1', 600, 'center');
}

// Слайд з одним лотом. Контент займає 1350 px, починаючи з y0.
function lotSlide(y0: number, i: number, slideNo: string) {
  const { r, name } = LOTS[i];
  const t = turnkeyGbp(r, r.bid);
  header(y0);
  fit('Скільки коштує під ключ в Україні', 48, y0 + 182, W - 96, 48, INK, 900);
  cover(photos[i], 48, y0 + 212, W - 96, 520, 28);
  pill('ПРОДАНО · Ritchie Bros, 18.11.2026', 72, y0 + 236, 24, '#059669');
  pill(slideNo, W - 72, y0 + 236, 24, 'rgba(15,23,42,.75)', '#fff', 'right');

  fit(name, 48, y0 + 800, W - 96, 54, INK, 900);
  text(`${r.year} р.  ·  ${sp(r.hours ?? 0)} мотогодин`, 48, y0 + 848, 32, MUTED, 600);

  // Ціна на аукціоні
  text('Ціна на аукціоні', 48, y0 + 912, 28, MUTED, 700);
  text(`£${sp(r.bid)}`, 48, y0 + 968, 56, INK, 900);
  text(`≈ $${sp(r500(r.bid * USD))}`, 48, y0 + 1006, 28, MUTED, 600);
  ukVat(48, y0 + 1030, 328, r);

  // Під ключ — головне
  const bx = 400, bw = W - 48 - bx;
  rrect(bx, y0 + 876, bw, 288, 28, GREEN_BG, GREEN_BD, 4);
  text('ПІД КЛЮЧ В УКРАЇНІ ≈', bx + 30, y0 + 926, 28, GREEN, 900);
  fit(usd(t), bx + 30, y0 + 1010, bw - 60, 68, GREEN, 900);
  text(eur(t), bx + 30, y0 + 1058, 32, GREEN, 700);
  text('з доставкою, розмитненням,', bx + 30, y0 + 1104, 26, '#065f46', 600);
  text('ПДВ 20% і нашою комісією', bx + 30, y0 + 1138, 26, '#065f46', 600);

  footer(y0 + 1180);
}

// Обкладинка: лінійка бюджетів
function coverSlide(y0: number) {
  header(y0);
  text('Скільки коштує техніка', 48, y0 + 200, 64, INK, 900);
  text('з Англії', 48, y0 + 272, 64, INK, 900);
  ctx.font = font(64, 900);
  const w1 = ctx.measureText('з Англії ').width;
  text('ПІД КЛЮЧ', 48 + w1, y0 + 272, 64, GREEN, 900);
  text('в Україні?', 48, y0 + 344, 64, INK, 900);
  text('Реальні продажі на Ritchie Bros, 18.11.2026', 48, y0 + 392, 30, MUTED, 600);
  fit('+ ПДВ Англії 20% — повертається після експорту, умови обговорюємо індивідуально', 48, y0 + 428, W - 96, 26, '#b45309', 800);

  LOTS.forEach(({ r, name }, i) => {
    const y = y0 + 446 + i * 182;
    const t = turnkeyGbp(r, r.bid);
    rrect(48, y, W - 96, 166, 24, '#ffffff', '#e2e8f0', 3);
    cover(photos[i], 60, y + 12, 200, 142, 18);
    fit(name.replace(/^(Екскаватор|Телескоп|Трактор) /, ''), 284, y + 56, 330, 34, INK, 900);
    text(`${r.year} р. · ${sp(r.hours ?? 0)} м/г`, 284, y + 96, 24, MUTED, 600);
    text(`молоток £${sp(r.bid)}`, 284, y + 136, 26, MUTED, 700);
    text('під ключ ≈', W - 72, y + 62, 24, GREEN, 800, 'right');
    fit(usd(t), W - 72, y + 116, 380, 44, GREEN, 900, 'right');
  });
  footer(y0 + 1190);
}

// Розбір ціни для JCB 540-140
function breakdownSlide(y0: number) {
  const { r } = LOTS[1];
  const [t0, t1] = transportGbp(r);
  const fee = ourFee(r.bid), prem = rbFee(r.bid), docs = AUCTION_META.exportDocsGbp;
  const base0 = r.bid + prem + fee + docs + t0, base1 = r.bid + prem + fee + docs + t1;
  const t = turnkeyGbp(r, r.bid);
  header(y0);
  text('З чого складається', 48, y0 + 196, 60, INK, 900);
  text('ціна під ключ', 48, y0 + 264, 60, GREEN, 900);
  cover(photos[1], 48, y0 + 300, W - 96, 300, 28);
  pill('JCB 540-140 · 2022 · 3 387 м/г', 72, y0 + 324, 26, 'rgba(15,23,42,.8)');
  const rows: [string, string][] = [
    ['Ціна молотка', `£${sp(r.bid)}`],
    ['ПДВ Англії 20% (повертається)', `£${sp(r100((r.bid + prem) * 0.2))} → £0`],
    ['Збір аукціону Ritchie Bros', `£${sp(prem)}`],
    ['Наша комісія 2,99%', `£${sp(fee)}`],
    ['Експортні документи', `£${sp(docs)}`],
    ['Доставка Англія → Україна', `£${sp(t0)}–${sp(t1)}`],
    ['ПДВ 20% на кордоні', `£${sp(r100(base0 * 0.2))}–${sp(r100(base1 * 0.2))}`],
    ['Мито (0–5%) і брокер', `£${sp(r100(t[0] - base0 * 1.2))}–${sp(r100(t[1] - base1 * 1.2))}`],
  ];
  rows.forEach(([a, b], i) => {
    const y = y0 + 650 + i * 47;
    const amber = i === 1;
    text(a, 60, y, 30, amber ? '#b45309' : i === 0 ? INK : '#334155', i === 0 || amber ? 800 : 600);
    text(b, W - 60, y, 30, amber ? '#b45309' : INK, 800, 'right');
    ctx.fillStyle = '#e2e8f0'; ctx.fillRect(60, y + 15, W - 120, 2);
  });
  text('ПДВ Англії повертається після експорту. Умови обговорюємо з кожним клієнтом індивідуально.', W / 2, y0 + 1024, 21, '#92400e', 700, 'center');
  rrect(48, y0 + 1040, W - 96, 124, 28, GREEN_BG, GREEN_BD, 4);
  text('РАЗОМ ПІД КЛЮЧ ≈', 78, y0 + 1092, 30, GREEN, 900);
  text(`£${sp(r500(t[0]))}–${sp(r500(t[1]))}`, 78, y0 + 1138, 34, GREEN, 700);
  fit(usd(t), W - 78, y0 + 1126, 520, 64, GREEN, 900, 'right');
  footer(y0 + 1180);
}

const SLIDES: ((y0: number) => void)[] = [
  coverSlide,
  (y) => lotSlide(y, 0, '2/6'),
  (y) => lotSlide(y, 1, '3/6'),
  (y) => lotSlide(y, 2, '4/6'),
  (y) => lotSlide(y, 3, '5/6'),
  breakdownSlide,
];

async function main() {
logo = await loadImage(path.join(DIR, '..', 'public', 'logo.png'));
photos = await Promise.all(LOTS.map((l) => img(l.r.img)));
for (const [kind, H] of [['card', FEED_H], ['story', STORY_H]] as const) {
  for (let i = 0; i < SLIDES.length; i++) {
    const c = createCanvas(W, H);
    ctx = c.getContext('2d');
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
    const y0 = H === FEED_H ? 0 : 210; // у сторіз — відступ під рамку Instagram зверху й знизу
    SLIDES[i](y0);
    if (H === STORY_H) text('Натисніть на посилання нижче ↓', W / 2, y0 + 1420, 30, MUTED, 600, 'center');
    fs.writeFileSync(path.join(OUT, `${kind}_${i + 1}.jpg`), c.toBuffer('image/jpeg', 90));
  }
}
console.log('ok →', OUT);
}
main().catch((e) => { console.error(e); process.exit(1); });
