// Довідкові сторінки, на які ведуть бейджі, картки й кроки на сайті.
// Кожна сторінка — окрема папка app/<slug>/page.tsx, що викликає шаблон app/components/info-page.tsx.
// Додати сторінку: допишіть об'єкт у PAGES_PARTS / PAGES_TRADE, створіть папку app/<slug>/page.tsx (3 рядки, як у сусідів).

import { LANDINGS } from './landings';
import { PAGES_PARTS } from './info-pages-parts';
import { PAGES_TRADE } from './info-pages-trade';

export type InfoBlock = { h: string; p?: string[]; list?: string[]; links?: string[] };

export type InfoPage = {
  slug: string;
  title: string; // <title>
  description: string; // meta description
  keywords: string[];
  kicker: string; // коротка назва: бейдж, хлібні крихти, підпис посилань
  h1: string;
  intro: string;
  parent?: { name: string; href: string };
  facts?: [string, string][];
  blocks: InfoBlock[];
  faq?: [string, string][];
  sources?: { label: string; url: string }[];
  related: string[]; // слаги (нові й наявні сторінки)
  cta: 'parts' | 'auction';
  legalNote?: boolean;
  updated: string; // YYYY-MM-DD
};

export const INFO_PAGES: InfoPage[] = [...PAGES_PARTS, ...PAGES_TRADE];
export const INFO_BY_SLUG: Record<string, InfoPage> = Object.fromEntries(INFO_PAGES.map((p) => [p.slug, p]));

// Підписи для наявних сторінок сайту, на які посилаються довідкові
const STATIC_LABELS: Record<string, string> = {
  catalog: 'Каталог запчастин з цінами',
  aukciony: 'Аукціони Великої Британії',
  'aukciony#lots': 'Лоти з фото',
  'rezultaty-aukcioniv': 'Ціни продажу на аукціонах',
  spectehnika: 'Запчастини до спецтехніки',
  '#parts-calculator': 'Форма запиту',
  vidguk: 'Залишити відгук',
};

export function linkLabel(slug: string): string {
  return INFO_BY_SLUG[slug]?.kicker ?? STATIC_LABELS[slug] ?? LANDINGS.find((l) => l.slug === slug)?.kicker ?? slug;
}
