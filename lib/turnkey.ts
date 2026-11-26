// Орієнтовна ціна «під ключ» в Україні: ціна молотка + збір аукціону + наша комісія + документи
// + доставка до України + розмитнення (мито, ПДВ 20%) + брокер. Це орієнтир для клієнта, а не оферта:
// точний розрахунок робимо під конкретний лот перед торгами.

import { AUCTIONS, AUCTION_META, FEE, ourFee, pct, rbFee, type AuctionLot } from './auction-lots';
import type { TenantPricing } from './tenants';

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

// ============================================================================
// WHITE LABEL: ціна для партнера (ставки з lib/tenants.ts → pricing, а не константи).
// Для NoLimitGoods (pricing.mode = 'nlg') усе як вище: turnkeyGbp(l, hammer) без змін.
// ============================================================================


type PriceLot = Pick<AuctionLot, 'auction' | 'category' | 'title' | 'original'>;

/** Лот з британського аукціону (торги у фунтах) → на молоток і збір нараховується UK VAT 20% (депозит). */
export function isUkLot(l: Pick<AuctionLot, 'auction'>): boolean {
  const a = AUCTIONS.find((x) => x.id === l.auction);
  return (a?.currency ?? 'GBP') === 'GBP';
}

/**
 * Підписи комісії для інтерфейсу. NoLimitGoods — «1,99–2,99%»; партнер — його маржа з конфігу (lib/tenants.ts → pricing).
 * Нашу частку (50% маржі або мінімум £150/£299/£799) клієнту партнера не показуємо — це внутрішній розподіл.
 */
export function feeLabels(p: Pick<TenantPricing, 'mode' | 'partnerMarginPct' | 'partnerMarginMinGbp'>): { range: string; from: string; min: string; isPartner: boolean } {
  if (p.mode === 'nlg') return { range: `${pct(FEE.highPct)}–${pct(FEE.lowPct)}%`, from: `${pct(FEE.highPct)}%`, min: '£150', isPartner: false };
  const v = `${pct(+(p.partnerMarginPct * 100).toFixed(2))}%`;
  return { range: v, from: v, min: `£${p.partnerMarginMinGbp.toLocaleString('en-GB')}`, isPartner: true };
}

/** Мінімум нашої частки за молотком (£150 / £299 / £799). */
export function ownerShareMin(p: Pick<TenantPricing, 'ownerShareMinGbp'>, hammer: number): number {
  for (const [upTo, min] of p.ownerShareMinGbp) if (hammer < upTo) return min;
  return p.ownerShareMinGbp[p.ownerShareMinGbp.length - 1]?.[1] ?? 0;
}

/**
 * Маржа імпорту (комісія клієнту) і її розподіл.
 *  nlg:     комісія = ourFee(hammer), уся наша.
 *  partner: комісія = max(молоток × partnerMarginPct, partnerMarginMinGbp, мінімум нашої частки);
 *           наша частка = max(комісія × ownerSharePct, мінімум £150/£299/£799); решта — партнеру.
 */
export function importMargin(p: TenantPricing, hammer: number): { total: number; owner: number; partner: number } {
  if (p.mode === 'nlg') {
    const fee = ourFee(hammer);
    return { total: fee, owner: fee, partner: 0 };
  }
  const min = ownerShareMin(p, hammer);
  const total = Math.max(Math.round(hammer * p.partnerMarginPct), p.partnerMarginMinGbp, min);
  const owner = Math.min(total, Math.max(Math.round(total * p.ownerSharePct), min));
  return { total, owner, partner: total - owner };
}

/** Депозит UK VAT: ставка × (молоток + збір аукціону), від–до. Повертається після експорту. */
export function ukVatDepositGbp(p: TenantPricing, l: PriceLot, hammer: number): Range | null {
  if (!isUkLot(l)) return null;
  const [p0, p1] = premium(l.auction, hammer);
  return [(hammer + p0) * p.ukVatDepositRate, (hammer + p1) * p.ukVatDepositRate];
}

/** Ціна під ключ з урахуванням конфігу партнера. Для mode 'nlg' = turnkeyGbp(l, hammer). */
export function turnkeyGbpFor(p: TenantPricing, l: PriceLot, hammer: number): Range {
  if (p.mode === 'nlg') return turnkeyGbp(l, hammer);
  const fee = importMargin(p, hammer).total;
  const [p0, p1] = premium(l.auction, hammer);
  const [t0, t1] = transportGbp(l);
  const { duty, excise } = customs(l);
  const broker: Range = [400, 700];
  const calc = (pr: number, t: number, d: number, e: number, b: number) => {
    const base = hammer + pr + fee + p.exportDocsGbp + t;
    return (base * (1 + d) + e) * 1.2 + b;
  };
  return [calc(p0, t0, duty[0], excise[0], broker[0]), calc(p1, t1, duty[1], excise[1], broker[1])];
}

export type PriceRow = { key: string; label: string; gbp: Range; note?: string; refundable?: boolean };

/** Розбивка ціни по рядках — для картки лота / калькулятора партнера. */
export function turnkeyBreakdown(p: TenantPricing, l: PriceLot, hammer: number): { rows: PriceRow[]; total: Range; deposit: Range | null } {
  const fee = importMargin(p, hammer).total;
  const prem = premium(l.auction, hammer);
  const tr = transportGbp(l);
  const total = turnkeyGbpFor(p, l, hammer);
  const deposit = p.showUkVatDeposit ? ukVatDepositGbp(p, l, hammer) : null;
  const rows: PriceRow[] = [
    { key: 'hammer', label: 'Ціна молотка', gbp: [hammer, hammer] },
    { key: 'premium', label: 'Збір аукціону', gbp: prem },
    { key: 'fee', label: p.mode === 'nlg' ? 'Наша комісія' : 'Комісія за викуп і супровід', gbp: [fee, fee] },
    { key: 'docs', label: 'Експортні документи', gbp: [p.exportDocsGbp, p.exportDocsGbp] },
    { key: 'transport', label: 'Доставка у Україну', gbp: tr },
    { key: 'customs', label: 'Розмитнення (ПДВ 20%, мито, брокер)', gbp: [0, 0] },
  ];
  const before: Range = [rows.reduce((a, r) => a + r.gbp[0], 0), rows.reduce((a, r) => a + r.gbp[1], 0)];
  rows[rows.length - 1].gbp = [Math.max(0, total[0] - before[0]), Math.max(0, total[1] - before[1])];
  if (deposit) {
    rows.push({
      key: 'ukVatDeposit',
      label: `Депозит UK VAT ${Math.round(p.ukVatDepositRate * 100)}%`,
      gbp: deposit,
      note: 'на молоток і збір аукціону; повертається після експорту',
      refundable: true,
    });
  }
  return { rows, total, deposit };
}
