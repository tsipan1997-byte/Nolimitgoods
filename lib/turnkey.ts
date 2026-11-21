// Орієнтовна ціна «під ключ» в Україні: ціна молотка + збір аукціону + наша комісія + документи
// + доставка до України + розмитнення (мито, ПДВ 20%) + брокер. Це орієнтир для клієнта, а не оферта:
// точний розрахунок робимо під конкретний лот перед торгами.

import { AUCTION_META, FEE, ourFee, rbFee, type AuctionLot } from './auction-lots';

export const GBP_USD = 1.3; // орієнтовний курс для постів, округлюємо результат

type Range = [number, number];

// Доставка Велика Британія → Україна, £ (від–до)
export function transportGbp(l: Pick<AuctionLot, 'category' | 'title' | 'original'>): Range {
  const t = `${l.title} ${l.original}`;
  switch (l.category) {
    case 'attachments':
    case 'breakers':
      return [500, 1200];
    case 'energy':
      return [1500, 3000];
    case 'pickups':
      return [1200, 1800];
    case 'telehandlers':
      return [3000, 4500];
    case 'agro':
      return [3000, 5000];
    case 'trucks':
      return [2000, 3500];
    case 'excavators': {
      if (/міні|mini|dumper|думпер|\b[1-5](\.\d)? ?(t|т|tonne)\b/i.test(t)) return [1200, 2500];
      if (/20 ?т\+|\b(2[0-9]|3[0-9]|4[0-9]) ?(t|т|tonne)\b|ZX3|PC3|EC3|336|330|350/i.test(t)) return [5500, 8000];
      return [3500, 6000];
    }
    default:
      return [2000, 4000];
  }
}

// Розмитнення: мито (частка) і акциз (£) — від–до
function customs(l: Pick<AuctionLot, 'category'>): { duty: Range; excise: Range } {
  if (l.category === 'pickups') return { duty: [0.1, 0.1], excise: [300, 900] };
  if (l.category === 'trucks') return { duty: [0.05, 0.1], excise: [200, 800] };
  return { duty: [0, 0.05], excise: [0, 0] };
}

function premium(auction: string, hammer: number): Range {
  if (auction.startsWith('rb-')) {
    const f = rbFee(hammer);
    return [f, f];
  }
  return [hammer * 0.05, hammer * 0.1];
}

// Ціна під ключ в Україні, £ (від–до)
export function turnkeyGbp(l: Pick<AuctionLot, 'auction' | 'category' | 'title' | 'original'>, hammer: number): Range {
  const fee = ourFee(hammer);
  const [p0, p1] = premium(l.auction, hammer);
  const [t0, t1] = transportGbp(l);
  const { duty, excise } = customs(l);
  const broker: Range = [400, 700];
  const calc = (p: number, t: number, d: number, e: number, b: number) => {
    const base = hammer + p + fee + AUCTION_META.exportDocsGbp + t; // митна вартість на кордоні
    return (base * (1 + d) + e) * 1.2 + b; // ПДВ 20% на вартість + мито + акциз
  };
  return [calc(p0, t0, duty[0], excise[0], broker[0]), calc(p1, t1, duty[1], excise[1], broker[1])];
}

const round = (n: number, step: number) => Math.round(n / step) * step;
const k = (n: number) => n.toLocaleString('uk-UA').replace(/ /g, ' ');

// «≈ £31 000–35 000 (≈ $40 000–45 500)»
export function turnkeyText(r: Range): string {
  const step = r[1] > 20000 ? 1000 : 500;
  const g0 = round(r[0], step), g1 = Math.max(round(r[1], step), g0 + step);
  const u0 = round(r[0] * GBP_USD, step), u1 = Math.max(round(r[1] * GBP_USD, step), u0 + step);
  return `≈ £${k(g0)}–${k(g1)} (≈ $${k(u0)}–${k(u1)})`;
}

// Надбавка до ціни молотка без доставки, у % (від–до) і доставка — для постів, де ціни ще немає
export function markupText(l: Pick<AuctionLot, 'auction' | 'category' | 'title' | 'original'>): string {
  const { duty } = customs(l);
  const prem: Range = l.auction.startsWith('rb-') ? [0.03, 0.1] : [0.05, 0.1];
  const lo = Math.round(((1 + prem[0] + FEE.highPct / 100) * (1 + duty[0]) * 1.2 - 1) * 100 / 5) * 5;
  const hi = Math.round(((1 + prem[1] + FEE.lowPct / 100) * (1 + duty[1]) * 1.2 - 1) * 100 / 5) * 5;
  const [t0, t1] = transportGbp(l);
  return `ціна молотка + ≈${lo}–${hi}% (ПДВ 20%, ${duty[1] ? 'мито, ' : ''}збори, комісія) + доставка ≈ £${k(round(t0, 100))}–${k(round(t1, 100))}`;
}
