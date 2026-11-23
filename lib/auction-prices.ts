import data from './auction-prices.json';

// Поточні ставки по лотах, оновлюються двічі на день (ранок і вечір) скриптом з браузера.
// Ключ: `${auction}:${lot}`.
export type LotPrice = { bid: number | null; bids: number };
export const PRICES_UPDATED_AT: string | null = (data as { updatedAt: string | null }).updatedAt;
const PRICES = (data as { prices: Record<string, LotPrice> }).prices;

// Лоти без номера (або з аукціонів, яких скрипт не читає) можна записати за ID позиції: `${auction}:#${item}`.
export function lotPrice(auction: string, lot: string, item?: string): LotPrice | null {
  return (lot ? PRICES[`${auction}:${lot}`] : null) ?? (item ? PRICES[`${auction}:#${item}`] : null) ?? null;
}
