// Статичні рекламні картинки в стилі креативу, що приносить ліди (темний фон, великий заголовок,
// біла плашка з кнопкою). Квадрат 1080x1080 і сторі 1080x1920.
// Запуск: node marketing/static-ads.mjs  → public/ads/2026-11-23/
import { createCanvas, GlobalFonts } from '@napi-rs/canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(dir, '..', 'public', 'ads', '2026-11-23-v2');
fs.mkdirSync(OUT, { recursive: true });
GlobalFonts.registerFromPath('/System/Library/Fonts/SFNS.ttf', 'SF');

const RED = '#e11d2e', PINK = '#f87171', MUTED = '#cbd5e1', DIM = '#94a3b8', WHITE = '#ffffff', INK = '#0b1220';

// Без Ritchie Bros: їхні правила забороняють експорт в Україну. Без конкретних цін,
// доки немає перевірених результатів інших аукціонів.
const ADS = [
  {
    id: 'a_auctions',
    pill: 'АУКЦІОНИ АНГЛІЇ',
    head: ['Спецтехніка', 'з аукціонів'],
    accent: 'Великої Британії',
    lines: ['Екскаватори · JCB 3CX · телескопи', 'трактори · самоскиди · пікапи'],
    bold: 'Ставимо за вашим лімітом — комісія від 1,99%',
    cardTitle: 'Leeds 25–28 листопада',
    cardSub: '9 000+ лотів · доставка в Україну',
    cta: 'Обрати лот →',
  },
  {
    id: 'b_jcb3cx',
    pill: 'ЕКСКАВАТОРИ-НАВАНТАЖУВАЧІ',
    head: ['JCB 3CX'],
    accent: 'з аукціону Англії',
    lines: ['підберемо лот під ваш бюджет', 'ставимо за вашим лімітом'],
    bold: 'Доставка під ключ в Україну',
    cardTitle: 'Підбір з аукціонів Англії',
    cardSub: 'торги щотижня · тисячі лотів',
    cta: 'Отримати підбір →',
  },
  {
    id: 'c_kubota',
    pill: 'ЕКСКАВАТОРИ',
    head: ['Kubota · Volvo', 'JCB · CAT'],
    accent: 'з аукціонів Англії',
    lines: ['мініекскаватори та гусеничні 5–20 т', 'фото, мотогодини й стан до торгів'],
    bold: 'Знайдемо лот під ваш ліміт',
    cardTitle: 'Торги щотижня',
    cardSub: 'аукціон · експорт · доставка',
    cta: 'Підібрати →',
  },
  {
    id: 'd_telehandlers',
    pill: 'ТЕЛЕСКОПИ',
    head: ['Manitou та JCB'],
    accent: 'з аукціонів Англії',
    lines: ['телескопічні навантажувачі 2018–2024', 'для ферм і будівництва'],
    bold: 'Ставимо за вашим лімітом — комісія від 1,99%',
    cardTitle: 'Під ключ в Україну',
    cardSub: 'аукціон · експорт · доставка',
    cta: 'Обрати лот →',
  },
];

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

// Зменшує шрифт, поки рядок не влізе по ширині
function fit(ctx, str, maxW, size, weight = 800) {
  let s = size;
  do { ctx.font = `${weight} ${s}px SF`; s -= 2; } while (ctx.measureText(str).width > maxW && s > 20);
  return s + 2;
}

function draw(ad, W, H) {
  const c = createCanvas(W, H), ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, H, W, 0);
  g.addColorStop(0, '#0b1020'); g.addColorStop(0.55, '#1a1424'); g.addColorStop(1, '#5a1a22');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(255,255,255,0.035)'; ctx.lineWidth = 2;
  for (let i = -H; i < W; i += 28) { ctx.beginPath(); ctx.moveTo(i, H); ctx.lineTo(i + H, 0); ctx.stroke(); }

  const story = H > W;
  const X = 70, maxW = W - 2 * X;
  let y = story ? 420 : 70;

  ctx.font = '800 34px SF';
  const pw = ctx.measureText(ad.pill).width + 64;
  rr(ctx, X, y, pw, 68, 34); ctx.fillStyle = RED; ctx.fill();
  ctx.fillStyle = WHITE; ctx.textBaseline = 'middle'; ctx.fillText(ad.pill, X + 32, y + 36);
  ctx.textBaseline = 'alphabetic';
  y += 68 + (story ? 150 : 120);

  const hs = Math.min(...[...ad.head, ad.accent].map((s) => fit(ctx, s, maxW, story ? 104 : 96)));
  for (const s of ad.head) { ctx.font = `800 ${hs}px SF`; ctx.fillStyle = WHITE; ctx.fillText(s, X, y); y += hs * 1.08; }
  ctx.font = `800 ${hs}px SF`; ctx.fillStyle = PINK; ctx.fillText(ad.accent, X, y);
  y += story ? 110 : 80;

  for (const s of ad.lines) { const z = fit(ctx, s, maxW, 38, 500); ctx.font = `500 ${z}px SF`; ctx.fillStyle = MUTED; ctx.fillText(s, X, y); y += 56; }
  const bz = fit(ctx, ad.bold, maxW, 36, 800); ctx.font = `800 ${bz}px SF`; ctx.fillStyle = WHITE; ctx.fillText(ad.bold, X, y);

  const cardH = 144, cardY = story ? H - 420 : H - 278;
  rr(ctx, X, cardY, maxW, cardH, 28); ctx.fillStyle = WHITE; ctx.fill();
  ctx.font = '800 36px SF';
  const bw = ctx.measureText(ad.cta).width + 64, bx = X + maxW - bw - 36;
  rr(ctx, bx, cardY + 30, bw, 84, 16); ctx.fillStyle = RED; ctx.fill();
  ctx.fillStyle = WHITE; ctx.textBaseline = 'middle'; ctx.fillText(ad.cta, bx + 32, cardY + 74); ctx.textBaseline = 'alphabetic';
  const tw = bx - X - 72;
  const t1 = fit(ctx, ad.cardTitle, tw, 36, 800); ctx.font = `800 ${t1}px SF`; ctx.fillStyle = INK; ctx.fillText(ad.cardTitle, X + 36, cardY + 64);
  const t2 = fit(ctx, ad.cardSub, tw, 28, 500); ctx.font = `500 ${t2}px SF`; ctx.fillStyle = '#475569'; ctx.fillText(ad.cardSub, X + 36, cardY + 108);

  ctx.font = '700 34px SF'; ctx.fillStyle = DIM;
  ctx.fillText('nolimitgoods.com/aukciony', X, cardY + cardH + 74);
  if (story) { ctx.font = '600 30px SF'; ctx.fillText('+44 7426 826595 · +380 50 140 0245', X, cardY + cardH + 124); }
  return c.toBuffer('image/jpeg', 92);
}

for (const ad of ADS) {
  fs.writeFileSync(path.join(OUT, `${ad.id}_feed.jpg`), draw(ad, 1080, 1080));
  fs.writeFileSync(path.join(OUT, `${ad.id}_story.jpg`), draw(ad, 1080, 1920));
}
console.log('saved to', OUT, fs.readdirSync(OUT));
