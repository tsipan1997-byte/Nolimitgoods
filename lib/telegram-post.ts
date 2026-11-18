// Тексти постів для Telegram-каналу: новий лот і «продано за £X».
// Формат HTML (Telegram parse_mode=HTML). Обидва телефони — завжди в кожному пості.

import { AUCTIONS, FEE, pct, type AuctionLot } from './auction-lots';
import type { AuctionResult } from './auction-results';
import { LANDINGS } from './landings';
import { CONTACT } from './site-config';
import { lotPhotoUrl } from './lot-photos';

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
    `💷 Ставимо за ваш ліміт. Комісія ${pct(FEE.highPct)}–${pct(FEE.lowPct)}%, не виграли — повертаємо передоплату.`,
    '',
    phones(),
    HASHTAGS[l.category] ? `${HASHTAGS[l.category]} #аукціонианглії` : '#аукціонианглії',
  ]
    .filter((x, i, arr) => x !== '' || (arr[i - 1] !== '' && i > 0))
    .join('\n');
  return { key: `lot:${l.auction}:${l.item}`, photo: lotPhotoUrl(l.auction, l.item) || l.img, caption, url, button: 'Хочу цей лот' };
}

export function soldPost(r: AuctionResult) {
  const facts = [r.year && `${r.year} р.`, r.hours && `${r.hours.toLocaleString('uk-UA')} мотогод.`, r.miles && `${r.miles.toLocaleString('uk-UA')} км`].filter(Boolean);
  const url = utm('/rezultaty-aukcioniv', `sold-${r.item}`);
  const caption = [
    `✅ <b>Продано: ${esc(r.title)}</b>`,
    facts.length ? esc(facts.join(' · ')) : '',
    '',
    `💷 Ціна молотка: <b>£${r.bid.toLocaleString('en-GB')}</b> (${r.bids} ставок) — ${esc(r.house)}, ${dayFmt.format(new Date(r.closedAt))}`,
    'Хочете таку саму техніку? Назвіть модель і ліміт — поставимо на найближчому аукціоні.',
    '',
    phones(),
    '#результатиаукціонів #аукціонианглії',
  ]
    .filter((x, i, arr) => x !== '' || (arr[i - 1] !== '' && i > 0))
    .join('\n');
  return { key: `sold:${r.auction}:${r.item}`, photo: lotPhotoUrl(r.auction, r.item) || r.img, caption, url, button: 'Усі результати' };
}

export type TgPost = ReturnType<typeof lotPost>;
