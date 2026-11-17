import data from './auction-prices.json';

// Поточні ставки по лотах, оновлюються двічі на день (ранок і вечір) скриптом з браузера.
// Ключ: `${auction}:${lot}`.
export type LotPrice = { bid: number | null; bids: number };
export const PRICES_UPDATED_AT: string | null = (data as { updatedAt: string | null }).updatedAt;
const PRICES = (data as { prices: Record<string, LotPrice> }).prices;

export function lotPrice(auction: string, lot: string): LotPrice | null {
  if (!lot) return null;
  return PRICES[`${auction}:${lot}`] ?? null;
}
