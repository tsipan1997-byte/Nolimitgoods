// Українська множина: 1 позиція, 2–4 позиції, 5+ позицій (11–14 — завжди «позицій»).
export function pluralUk(n: number, one: string, few: string, many: string): string {
  const abs = Math.abs(n) % 100;
  const last = abs % 10;
  if (abs >= 11 && abs <= 14) return many;
  if (last === 1) return one;
  if (last >= 2 && last <= 4) return few;
  return many;
}

export const pozytsiy = (n: number) => pluralUk(n, 'позиція', 'позиції', 'позицій');
export const lotiv = (n: number) => pluralUk(n, 'лот', 'лоти', 'лотів');
export const stavok = (n: number) => pluralUk(n, 'ставка', 'ставки', 'ставок');
