// Легка частина даних аукціонів: типи, комісії, назви категорій.
// Без масивів лотів — тож клієнтські компоненти можуть імпортувати це, не тягнучи в браузер ~1 МБ лотів.
// lib/auction-lots.ts реекспортує все звідси, старі імпорти працюють як раніше.

export type AuctionCategory = 'energy' | 'breakers' | 'attachments' | 'excavators' | 'telehandlers' | 'agro' | 'pickups' | 'trucks';

export type AuctionLot = {
  auction: string; // id аукціону з AUCTIONS
  lot: string; // номер лота (може бути ще не присвоєний)
  item: string; // ID позиції на сайті аукціону
  title: string; // назва українською
  original: string; // оригінальна назва англійською
  category: AuctionCategory;
  year: number | null;
  hours: number | null; // мотогодини
  miles?: number | null; // пробіг, км (для авто)
  specs: string;
  unused: boolean; // нове, не використовувалось
  inoperable: boolean; // несправне
  location: string;
  endsAt: number; // закриття торгів по лоту (або день живих торгів), мс UTC
  live: boolean; // живі торги: лот продається в день торгів, заявку треба дати напередодні
  img: string; // фото з каталогу аукціону
  gallery?: string[]; // усі фото лота (якщо є) — гортаються на картці
  engine?: string; // двигун і потужність за паспортом моделі — показується окремим рядком
  url: string; // сторінка лота (для менеджера, на сайті не показується)
};

export type AuctionInfo = {
  id: string; house: string; name: string; place: string; dates: string; format: string;
  totalLots: number; unreserved: boolean; url: string;
  currency?: 'GBP' | 'EUR'; // валюта торгів; за замовчуванням фунти
};

// Наша комісія: 2,99% якщо ціна лота до £40 000, 1,99% якщо дорожче.
// Мінімум за лот — 3 сходинки: лот до £5 000 → £150; до £10 000 → £299; від £10 000 → £799.
// Береться більше з двох: відсоток або мінімум.
export const FEE = {
  threshold: 40000,
  lowPct: 2.99,
  highPct: 1.99,
  minGbp: 150, // найменший мінімум (для коротких підписів «від £150»)
};
// Відсоток українською: 2.99 → «2,99»
export const pct = (n: number) => String(n).replace('.', ',');
// Мінімальна комісія для лота: до £5 000 включно — £150, до £10 000 — £299, від £10 000 — £799
export function minFee(hammerGbp: number) {
  if (hammerGbp <= 5000) return 150;
  if (hammerGbp < 10000) return 299;
  return 799;
}
export function ourFee(hammerGbp: number) {
  const pct = hammerGbp > FEE.threshold ? FEE.highPct : FEE.lowPct;
  return Math.max(minFee(hammerGbp), Math.round((hammerGbp * pct) / 100));
}
// Комісія Ritchie Bros для покупця у Британії: 10% до £6 500, далі £650 + 2.35% від суми понад £6 500
export function rbFee(hammerGbp: number) {
  return hammerGbp <= 6500 ? Math.round(hammerGbp * 0.1) : Math.round(650 + (hammerGbp - 6500) * 0.0235);
}

// Комісія Ritchie Bros для покупця в Європі (крім Британії), євро:
// до €5 500 — 15% (мін. €100); до €13 500 — 10% (мін. €825); до €79 000 — 4,85% (мін. €1 350); понад — €3 850
export function rbFeeEu(hammerEur: number) {
  if (hammerEur <= 5500) return Math.max(100, Math.round(hammerEur * 0.15));
  if (hammerEur <= 13500) return Math.max(825, Math.round(hammerEur * 0.1));
  if (hammerEur <= 79000) return Math.max(1350, Math.round(hammerEur * 0.0485));
  return 3850;
}

export const AUCTION_META = { exportDocsGbp: 70 };

export const CATEGORY_LABELS: Record<AuctionCategory, string> = {
  energy: 'Генератори та енергія',
  breakers: 'Гідромолоти',
  attachments: 'Грейфери, ножиці, подрібнювачі',
  excavators: 'Екскаватори, навантажувачі, бульдозери',
  telehandlers: 'Телескопічні навантажувачі',
  agro: 'Трактори, сільгосп і лісова техніка',
  pickups: 'Пікапи та позашляховики',
  trucks: 'Вантажівки та самоскиди',
};
