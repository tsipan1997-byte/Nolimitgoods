// JCB 16C-1 reel: 1080x1920, 30 fps. Renders frames with canvas and pipes them to ffmpeg.
import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import ffmpegPath from 'ffmpeg-static';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const OUT = process.argv[2] || path.join(dir, 'reel.mp4');
const STILLS = process.argv[3] === 'stills';
GlobalFonts.registerFromPath('/System/Library/Fonts/SFNS.ttf', 'SF');

const W = 1080, H = 1920, FPS = 30;
const BG = '#0b1426', CARD = '#13203a', RED = '#e11d2e', MUTED = '#94a3b8', WHITE = '#ffffff';

const photos = await Promise.all([
  '941469fe-b9dc-4bb0-b86d-5f11253d7f53.jpg',
  '1826b83e-f5f4-4cf3-b7be-4eb035448722.jpg',
  '698568f3-cd96-4f3d-87b1-4d8aee267ffd.jpg',
].map((f) => loadImage(path.join(dir, 'img', f))));
const logo = await loadImage('/Users/tsipa/Documents/GitHub/Nolimitgoods/public/logo.png');

const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (t) => 1 - Math.pow(1 - clamp(t), 3);
const font = (size, weight = 800) => `${weight} ${size}px SF`;

function cover(img, x, y, w, h, zoom = 1) {
  const s = Math.max(w / img.width, h / img.height) * zoom;
  const iw = img.width * s, ih = img.height * s;
  ctx.save();
  ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.drawImage(img, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
  ctx.restore();
}
function text(str, x, y, size, color = WHITE, weight = 800, align = 'center', alpha = 1) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.font = font(size, weight); ctx.fillStyle = color;
  ctx.textAlign = align; ctx.textBaseline = 'alphabetic'; ctx.fillText(str, x, y); ctx.restore();
}
function rrect(x, y, w, h, r, fill, stroke) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 4; ctx.stroke(); }
}
function fadeBottom(y0) {
  const g = ctx.createLinearGradient(0, y0, 0, y0 + 420);
  g.addColorStop(0, 'rgba(11,20,38,0)'); g.addColorStop(1, BG);
  ctx.fillStyle = g; ctx.fillRect(0, y0, W, 420);
  ctx.fillStyle = BG; ctx.fillRect(0, y0 + 420, W, H);
}
function logoBadge(x = 48, y = 150, w = 270) {
  const h = w * logo.height / logo.width;
  rrect(x - 14, y - 14, w + 28, h + 28, 22, '#ffffff');
  ctx.drawImage(logo, x, y, w, h);
}
const gbp = (n) => '£' + Math.round(n).toLocaleString('uk-UA').replace(/ /g, ' ');

// Scenes: [start, end, draw(t, localSeconds)]
const scenes = [
  [0, 3.5, (p, s) => { // hook
    cover(photos[0], 0, 0, W, 1350, 1.05 + 0.06 * p);
    fadeBottom(930); logoBadge();
    text('JCB 16C-1', W / 2, 1450, 150, WHITE, 900, 'center', ease(s / 0.5));
    text('Англія vs Україна:', W / 2, 1570, 70, WHITE, 700, 'center', ease((s - 0.4) / 0.5));
    text('скільки коштує насправді?', W / 2, 1660, 70, RED, 800, 'center', ease((s - 0.7) / 0.5));
  }],
  [3.5, 8.5, (p, s) => { // UK auction price
    cover(photos[1], 0, 0, W, 1200, 1.04 + 0.05 * p);
    fadeBottom(780); logoBadge();
    text('🔨 Аукціон в Англії', W / 2, 1230, 64, MUTED, 700);
    text(gbp(7000 * ease(s / 1.2)), W / 2, 1430, 230, RED, 900);
    text('2019 р. · 775–1 368 м/год', W / 2, 1560, 56, WHITE, 700, 'center', ease((s - 1) / 0.5));
    text('Brightwells, торги 11.04.2025', W / 2, 1640, 46, MUTED, 600, 'center', ease((s - 1.3) / 0.5));
  }],
  [8.5, 13, (p, s) => { // four real results
    ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H); logoBadge(48, 90, 230);
    text('Реальні результати торгів', W / 2, 420, 66, WHITE, 800);
    text('JCB 16C-1, 2019 р.', W / 2, 500, 50, MUTED, 600);
    const rows = [['775 м/год', 7000], ['1 041 м/год', 7000], ['1 182 м/год', 7061], ['1 368 м/год', 7051]];
    rows.forEach(([h, price], i) => {
      const a = ease((s - 0.3 - i * 0.45) / 0.4); if (a <= 0) return;
      const y = 600 + i * 230 + (1 - a) * 40;
      ctx.save(); ctx.globalAlpha = a; rrect(80, y, W - 160, 190, 30, CARD, '#24324f'); ctx.restore();
      text(h, 130, y + 120, 60, WHITE, 700, 'left', a);
      text(gbp(price), W - 130, y + 125, 84, RED, 900, 'right', a);
    });
    text('ціна молотка, Brightwells (Англія)', W / 2, 1620, 44, MUTED, 600, 'center', ease((s - 2.3) / 0.5));
  }],
  [13, 17.5, (p, s) => { // Ukraine prices
    ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H); logoBadge(48, 90, 230);
    text('А в Україні? 🇺🇦', W / 2, 520, 96, WHITE, 900, 'center', ease(s / 0.5));
    text('16C-1 майже немає в продажу.', W / 2, 620, 52, MUTED, 600, 'center', ease((s - 0.3) / 0.5));
    text('Найближчі аналоги на OLX:', W / 2, 690, 52, MUTED, 600, 'center', ease((s - 0.3) / 0.5));
    [['JCB 15C-1 · 2018', '€15 500'], ['JCB 8016 · 2018', '€22 000']].forEach(([n, pr], i) => {
      const a = ease((s - 0.9 - i * 0.6) / 0.45); if (a <= 0) return;
      const y = 800 + i * 330;
      ctx.save(); ctx.globalAlpha = a; rrect(80, y, W - 160, 280, 34, CARD, '#24324f'); ctx.restore();
      text(n, W / 2, y + 95, 58, WHITE, 700, 'center', a);
      text(pr, W / 2, y + 225, 120, '#fbbf24', 900, 'center', a);
    });
    text('ціни продавців, розмитнені', W / 2, 1530, 44, MUTED, 600, 'center', ease((s - 2.3) / 0.5));
  }],
  [17.5, 21.5, (p, s) => { // costs
    ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H); logoBadge(48, 90, 230);
    text('Що додається до ціни', W / 2, 470, 70, WHITE, 800);
    const items = [['Мито на екскаватори', '0%'], ['ПДВ', '20%'], ['Наша комісія', 'від 1,99%'], ['Збір аукціону + доставка', 'під лот']];
    items.forEach(([k, v], i) => {
      const a = ease((s - 0.3 - i * 0.4) / 0.4); if (a <= 0) return;
      const y = 560 + i * 200;
      ctx.save(); ctx.globalAlpha = a; rrect(80, y, W - 160, 160, 28, CARD); ctx.restore();
      text(k, 130, y + 100, 50, WHITE, 600, 'left', a);
      text(v, W - 130, y + 104, 62, i === 0 ? '#22c55e' : i === 1 ? WHITE : RED, 900, 'right', a);
    });
    text('Порахуємо «під ключ» безкоштовно', W / 2, 1480, 50, WHITE, 800, 'center', ease((s - 2.1) / 0.5));
  }],
  [21.5, 25.5, (p, s) => { // upcoming auction
    cover(photos[2], 0, 0, W, 1250, 1.03 + 0.05 * p);
    fadeBottom(830); logoBadge();
    text('25–28 листопада', W / 2, 1300, 100, WHITE, 900, 'center', ease(s / 0.5));
    text('Euro Auctions · Лідс', W / 2, 1400, 62, MUTED, 700, 'center', ease((s - 0.3) / 0.5));
    const a = ease((s - 0.7) / 0.5);
    ctx.save(); ctx.globalAlpha = a; rrect(170, 1480, W - 340, 150, 75, 'rgba(225,29,46,0.15)', RED); ctx.restore();
    text('11 × JCB 16C-1 на торгах', W / 2, 1578, 60, WHITE, 800, 'center', a);
  }],
  [25.5, 29, (p, s) => { // CTA
    ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
    const lw = 520, lh = lw * logo.height / logo.width;
    rrect((W - lw) / 2 - 30, 430 - 30, lw + 60, lh + 60, 36, '#ffffff');
    ctx.drawImage(logo, (W - lw) / 2, 430, lw, lh);
    text('Напишіть свій бюджет —', W / 2, 960, 72, WHITE, 800, 'center', ease(s / 0.5));
    text('підберемо лот', W / 2, 1050, 72, RED, 900, 'center', ease(s / 0.5));
    text('Купуємо за вас і привозимо в Україну', W / 2, 1150, 48, MUTED, 600, 'center', ease((s - 0.3) / 0.5));
    const a = ease((s - 0.6) / 0.5);
    ctx.save(); ctx.globalAlpha = a; rrect(120, 1250, W - 240, 150, 75, RED); ctx.restore();
    text('+44 7426 826595', W / 2, 1347, 70, WHITE, 900, 'center', a);
    text('WhatsApp · Telegram', W / 2, 1470, 48, MUTED, 600, 'center', a);
    text('nolimitgoods.com/aukciony', W / 2, 1560, 56, WHITE, 700, 'center', a);
  }],
];
const TOTAL = scenes[scenes.length - 1][1];

function drawFrame(t) {
  const sc = scenes.find(([a, b]) => t >= a && t < b) || scenes[scenes.length - 1];
  const [a, b, fn] = sc;
  fn((t - a) / (b - a), t - a);
  // short fade-in at each cut
  const k = clamp((t - a) / 0.25);
  if (k < 1) { ctx.save(); ctx.globalAlpha = 1 - k; ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H); ctx.restore(); }
}

if (STILLS) {
  const fs = await import('fs');
  for (const [i, [a, b]] of scenes.entries()) {
    drawFrame(Math.min(b - 0.05, a + 2.6));
    fs.writeFileSync(path.join(dir, `still_${i + 1}.jpg`), canvas.toBuffer('image/jpeg', 85));
  }
  console.log('stills written');
  process.exit(0);
}

const ff = spawn(ffmpegPath, [
  '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-r', String(FPS), '-i', '-',
  '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100',
  '-shortest', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'medium', '-crf', '20',
  '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', OUT,
], { stdio: ['pipe', 'ignore', 'inherit'] });

const frames = Math.round(TOTAL * FPS);
for (let f = 0; f < frames; f++) {
  drawFrame(f / FPS);
  const buf = canvas.data();
  if (!ff.stdin.write(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength))) {
    await new Promise((r) => ff.stdin.once('drain', r));
  }
}
ff.stdin.end();
await new Promise((r) => ff.on('close', r));
console.log('done', OUT, frames, 'frames');
