// Тексти постів для Telegram-каналу: новий лот і «продано за £X».
// Формат HTML (Telegram parse_mode=HTML). Обидва телефони — завжди в кожному пості.

import { AUCTIONS, FEE, pct, type AuctionLot } from './auction-lots';
import type { AuctionResult } from './auction-results';
import { LANDINGS } from './landings';
import { CONTACT } from './site-config';
import { lotPhotoUrl } from './lot-photos';
import { lotPrice } from './auction-prices';
import { markupText, turnkeyGbp, turnkeyText } from './turnkey';

const SITE = 'https://www.nolimitgoods.com';
const AUCTION_BY_ID = Object.fromEntries(AUCTIONS.map((a) => [a.id, a]));
const dayFmt = new Intl.DateTimeFormat('uk-UA', { timeZone: 'Europe/Kyiv', day: 'numeric', month: 'long' });

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const utm = (path: string, content: string) => `${SITE}${path}?utm_source=telegram&utm_medium=channel&utm_campaign=autopost&utm_content=${content}`;

// Найкраща тематична сторінка для лота (щоб людина побачила схожі лоти)
function pageFor(l: Pick<AuctionLot, 'category' | 'original'>): string {
  const best = LANDINGS.find((p) => p.cat === l.category && p.filter(l as AuctionLot) && /z-anglii$/.test(p.slug));
  return best ? `/${best.slug}` : `/aukciony`;
}

const HASHTAGS: Record<string, string> = {
  pickups: '#пікапи', trucks: '#вантажівки #самоскиди', excavators: '#екскаватори #спецтехніка', telehandlers: '#телескопи #спецтехніка',
  agro: '#трактори #агро', energy: '#генератори', breakers: '#гідромолоти', attachments: '#навісне',
};

const phones = () => `📞 ${CONTACT.phoneUk} (UK, Telegram) · ${CONTACT.phoneUa} (UA, WhatsApp/Viber)`;

// Орієнтовна ціна під ключ: від оцінки аукціону або поточної ставки; якщо ціни ще немає — формула надбавки
export function priceLine(l: AuctionLot): string {
  const est = l.specs?.match(/оцінка аукціону ≈ £([\d\s\u00a0]+)/);
  if (est) {
    const g = Number(est[1].replace(/\D/g, ''));
    if (g) return `💰 Оцінка аукціону £${g.toLocaleString('uk-UA').replace(/\u00a0/g, ' ')} → під ключ в Україні ${turnkeyText(turnkeyGbp(l, g))}`;
  }
  const p = lotPrice(l.auction, l.lot);
  if (p?.bid && p.bids >= 5 && p.bid >= 1000) {
    return `💰 Зараз ставка £${p.bid.toLocaleString('uk-UA').replace(/\u00a0/g, ' ')} → при такій ціні під ключ в Україні ${turnkeyText(turnkeyGbp(l, p.bid))}`;
  }
  return `💰 Під ключ в Україні: ${markupText(l)}`;
}

export function lotPost(l: AuctionLot) {
  const a = AUCTION_BY_ID[l.auction];
  const facts = [
    l.year && `${l.year} р.`,
    l.hours && `${l.hours.toLocaleString('uk-UA')} мотогод.`,
    l.miles && `${l.miles.toLocaleString('uk-UA')} км`,
    l.unused && 'нове, не використовувалось',
    l.inoperable && 'несправне / на запчастини',
  ].filter(Boolean);
  const when = l.live ? `живі торги ${dayFmt.format(new Date(l.endsAt))}` : `закриття ${dayFmt.format(new Date(l.endsAt))}`;
  const url = utm(pageFor(l), `lot-${l.item}`);
  const caption = [
    `🔨 <b>${esc(l.title)}</b>`,
    facts.length ? esc(facts.join(' · ')) : '',
    l.specs ? esc(l.specs.slice(0, 220)) : '',
    '',
    `📍 ${esc(a?.house ?? '')}, ${esc(l.location)} — ${when}`,
    esc(priceLine(l)),
    `💷 Ставимо за ваш ліміт. Комісія ${pct(FEE.highPct)}–${pct(FEE.lowPct)}%, не виграли — повертаємо передоплату. Точну ціну під ключ рахуємо до торгів.`,
    '',
    phones(),
    HASHTAGS[l.category] ? `${HASHTAGS[l.category]} #аукціонианглії` : '#аукціонианглії',
  ]
    .filter((x, i, arr) => x !== '' || (arr[i - 1] !== '' && i > 0))
    .join('\n');
  return { key: `lot:${l.auction}:${l.item}`, photo: lotPhotoUrl(l.auction, l.item) || l.img, caption, url, button: 'Хочу цей лот', title: l.original as string | undefined };
}

export function soldPost(r: AuctionResult) {
  const facts = [r.year && `${r.year} р.`, r.hours && `${r.hours.toLocaleString('uk-UA')} мотогод.`, r.miles && `${r.miles.toLocaleString('uk-UA')} км`].filter(Boolean);
  const url = utm('/rezultaty-aukcioniv', `sold-${r.item}`);
  const caption = [
    `✅ <b>Продано: ${esc(r.title)}</b>`,
    facts.length ? esc(facts.join(' · ')) : '',
    '',
    `💷 Продано за <b>£${r.bid.toLocaleString('en-GB')}</b>${r.bids ? ` (${r.bids} ставок)` : ''} — ${esc(r.house)}, ${dayFmt.format(new Date(r.closedAt))}`,
    esc(`💰 Така сама під ключ в Україні ${turnkeyText(turnkeyGbp(r, r.bid))}`),
    'Хочете таку саму техніку? Назвіть модель і ліміт — поставимо на найближчому аукціоні.',
    '',
    phones(),
    '#результатиаукціонів #аукціонианглії',
  ]
    .filter((x, i, arr) => x !== '' || (arr[i - 1] !== '' && i > 0))
    .join('\n');
  return { key: `sold:${r.auction}:${r.item}`, photo: lotPhotoUrl(r.auction, r.item) || r.img, caption, url, button: 'Усі результати', title: undefined as string | undefined };
}

export type TgPost = ReturnType<typeof lotPost>;

// Зведений пост «за скільки пішла техніка + ціна під ключ в Україні» по одному аукціону.
// picks — номери лотів у порядку показу (вибрані вручну: популярні моделі, різні категорії).
const SUMMARY_GROUPS: [string, string[]][] = [
  ['🚜 <b>Екскаватори</b>', ['excavators']],
  ['🏗 <b>Телескопічні навантажувачі</b>', ['telehandlers']],
  ['🌾 <b>Трактори</b>', ['agro']],
  ['⚡ <b>Генератори</b>', ['energy']],
];

export function summaryPost(results: AuctionResult[], auction: string, picks: string[]) {
  const a = AUCTION_BY_ID[auction];
  const byLot = new Map(results.filter((r) => r.auction === auction).map((r) => [r.lot, r]));
  const chosen = picks.map((p) => byLot.get(p)).filter(Boolean) as AuctionResult[];
  const total = results.filter((r) => r.auction === auction).length;
  const line = (r: AuctionResult) => {
    const name = r.original.replace(/^(Unused\s+)?\d{4}\s+/i, '').replace(/\s+(Tracked Excavator|Telehandler|4WD Tractor|Generator Set|Backhoe Loader)$/i, '');
    const facts = [r.year, r.hours && `${r.hours.toLocaleString('uk-UA').replace(/ /g, ' ')} м/г`].filter(Boolean).join(', ');
    return `• ${esc(name)}${facts ? ` (${esc(String(facts))})` : ''} — <b>£${r.bid.toLocaleString('uk-UA').replace(/\u00a0/g, ' ')}</b> → під ключ ${esc(turnkeyText(turnkeyGbp(r, r.bid)))}`;
  };
  const blocks = SUMMARY_GROUPS.map(([head, cats]) => {
    const rs = chosen.filter((r) => cats.includes(r.category));
    return rs.length ? [head, ...rs.map(line)].join('\n') : '';
  }).filter(Boolean);
  const text = [
    `📊 <b>За скільки пішла техніка: ${esc(a?.house ?? '')}, ${esc(a?.dates ?? '')}</b>`,
    'Ціна молотка на аукціоні в Англії → орієнтовна ціна під ключ в Україні (збір аукціону, наша комісія, документи, доставка, мито і ПДВ 20% — усе включено).',
    '',
    blocks.join('\n\n'),
    '',
    `Аукціон без резервних цін — усе продано за ці ставки. Повний список ${total} результатів — за кнопкою.`,
    'Хочете таку техніку? Назвіть модель і ліміт — поставимо на найближчому аукціоні. Не виграли — повертаємо передоплату.',
    '',
    phones(),
    '#результатиаукціонів #аукціонианглії #спецтехніка',
  ].join('\n');
  return { key: `summary:${auction}`, text, url: utm('/rezultaty-aukcioniv', `summary-${auction}`), button: 'Усі результати' };
}
