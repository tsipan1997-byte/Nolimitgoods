// Розрахунок цін для каталогу, прикладів цін і схем.
import { MARKUP } from './site-config';

export type Currency = 'GBP' | 'USD' | 'EUR';
export type Rates = { date: string; uah: { GBP: number; USD: number; EUR: number } };

export interface Priced {
  supplierPrice: number;
  currency: Currency;
  supplierIncVat: boolean;
}

// Ціна клієнта у фунтах: ціна постачальника без VAT → у фунти за крос-курсом НБУ → × націнка.
// Для доларів/євро без курсу НБУ ціну не показуємо, щоб не вигадувати.
export function clientPriceGbp(p: Priced, rates: Rates | null): number | null {
  const net = p.supplierIncVat ? p.supplierPrice / 1.2 : p.supplierPrice;
  if (p.currency === 'GBP') return net * MARKUP;
  if (!rates) return null;
  return ((net * rates.uah[p.currency]) / rates.uah.GBP) * MARKUP;
}

// Доставка в Україну за вагою — та сама сітка, що й у розрахунку заявок (Nova Post Global).
export function shippingGbp(weightKg: number, oversized = false): number | null {
  if (oversized) return 150;
  if (weightKg <= 2) return 27;
  if (weightKg <= 10) return 41;
  if (weightKg <= 30) return 68;
  if (weightKg <= 60) return 115;
  return null; // палета / негабарит — рахуємо індивідуально
}

export const fmtGbp = (v: number) => '£' + (v >= 100 ? Math.round(v).toLocaleString('en-GB') : v.toFixed(2));

export const fmtUah = (v: number) =>
  (v >= 1000 ? Math.round(v / 10) * 10 : Math.round(v)).toLocaleString('uk-UA').replace(/[\s,]/g, ' ') + ' ₴';

// Курс НБУ з нашого API (кеш на годину), один запит на сторінку
let ratesPromise: Promise<Rates | null> | null = null;
export function loadRates(): Promise<Rates | null> {
  if (!ratesPromise) {
    ratesPromise = fetch('/api/rates')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => (d?.uah?.GBP ? (d as Rates) : null))
      .catch(() => null);
  }
  return ratesPromise;
}
