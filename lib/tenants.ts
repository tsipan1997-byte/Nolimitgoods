// ============================================================================
// WHITE LABEL: конфіг партнерів (дистриб'юторів) за доменом.
//
// Один код — багато брендів. Партнер визначається за host (див. middleware.ts
// і lib/tenant-server.ts). Без збігу з host — завжди NoLimitGoods (DEFAULT_TENANT),
// тому основний сайт без конфігу партнера працює рівно як раніше.
//
// Секрети (токени, chat id, вебхуки) тут НЕ зберігаються: у конфігу лише НАЗВИ
// змінних середовища (…Env), а значення лежать у Vercel → Environment Variables.
// Специфікація: docs/white-label-spec.md
// ============================================================================

import { CONTACT, SOCIAL, COMPANY, REELS } from './site-config';

/** RGB-трійки «r g b» для CSS-змінних --brand-50…--brand-950 (див. globals.css, tailwind.config.ts). */
export type BrandPalette = Record<'50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950', string>;

export type TenantContact = {
  phone: string; // основний номер (дзвінки)
  phoneUk: string;
  phoneUa: string; // WhatsApp / Viber
  waNumber: string;
  waDisplay: string;
  whatsapp: string;
  viber: string;
  telegram: string;
  email: string;
  personalEmail: string;
  personName: string;
};

export type TenantSocial = {
  instagram: string;
  instagramHandle: string;
  telegramChannel: string;
  telegramChannelHandle: string;
  facebook: string;
};

export type TenantCompany = {
  /** Коротка назва юрособи, напр. «NoLimitGoods Ltd» або «ТОВ "Демо Техніка"». */
  legalName: string;
  /** Повна назва для юридичних текстів, напр. «NoLimitGoods Limited». */
  legalNameFull: string;
  /** Реєстраційний номер (Company No / ЄДРПОУ / РНОКПП ФОП). */
  number: string;
  /** Підпис номера: «Company No», «ЄДРПОУ», «РНОКПП». */
  numberLabel: string;
  since: number;
  vat: string; // VAT / ІПН платника ПДВ; '' — не показувати
  address: string;
  street: string;
  city: string;
  postalCode: string;
  countryCode: string; // ISO-2 для schema.org
  /** Юрисдикція для політики конфіденційності, напр. «Англії та Уельсі» / «Україні». */
  jurisdictionUk: string;
  jurisdictionEn: string;
  registryUrl: string;
  /** Email для запитів щодо персональних даних. */
  privacyEmail: string;
};

export type TenantAnalytics = {
  metaPixelId?: string; // Meta Pixel; без нього піксель не підключається
  googleAdsId?: string; // AW-…; без нього gtag не підключається (якщо немає і ga4Id)
  ga4Id?: string; // G-…
  /** send_to конверсії «Lead» у Google Ads, напр. 'AW-…/label'. Без нього подія не шлеться. */
  googleAdsLeadConversion?: string;
  /** Назва env зі значенням токена Meta Conversions API. */
  metaCapiTokenEnv?: string;
};

export type TenantLeads = {
  /** Префікс номера заявки (NLG-123456 / DEMO-123456). */
  idPrefix: string;
  /** Назва env з токеном бота. За замовчуванням TELEGRAM_BOT_TOKEN. */
  telegramBotTokenEnv?: string;
  /** Назва env з chat id партнера (куди йде повна заявка). */
  telegramChatIdEnv?: string;
  /** Назва env з URL Google Apps Script партнера. */
  googleSheetUrlEnv?: string;
  /** Назва env з URL вебхука CRM партнера (POST JSON). */
  crmWebhookUrlEnv?: string;
  /** Назва env із секретом підпису вебхука (HMAC-SHA256 у заголовку X-Signature). */
  crmWebhookSecretEnv?: string;
  /** Чи слати NoLimitGoods коротке повідомлення без контактів клієнта (Non-Circumvention). */
  notifyOwner: boolean;
  /** Назва env з токеном доступу до експорту заявок у CSV (/api/leads/export). */
  csvExportTokenEnv?: string;
};

export type TenantPricing = {
  /**
   * 'nlg' — як зараз на nolimitgoods.com: комісія NoLimitGoods ourFee() (2,99% / 1,99%, мін. £150/£299/£799).
   * 'partner' — комісія (маржа імпорту) партнера за ставками нижче; з неї наша частка ownerShare*.
   */
  mode: 'nlg' | 'partner';
  /** Маржа імпорту партнера (комісія клієнту), частка від молотка (0.05 = 5%). */
  partnerMarginPct: number;
  /** Мінімальна маржа партнера на лот, £. */
  partnerMarginMinGbp: number;
  /** Наша частка маржі імпорту (0.5 = 50%). */
  ownerSharePct: number;
  /** Мінімум нашої частки залежно від молотка: [до £, мінімум £]; останній рядок — «від». */
  ownerShareMinGbp: [number, number][];
  /** Експортні документи, £ на лот. */
  exportDocsGbp: number;
  /** Показувати окремим рядком «депозит UK VAT 20%» для лотів з Великої Британії. */
  showUkVatDeposit: boolean;
  /** Ставка UK VAT на молоток і збір аукціону (депозит, повертається після експорту). */
  ukVatDepositRate: number;
  /** Графік оплати клієнта, частки (20/50/30). */
  paymentSchedule: number[];
};

export type Tenant = {
  id: string;
  /** Точні host-и (без порту). Перший — канонічний. */
  hosts: string[];
  /** Канонічний URL сайту без «/» в кінці. */
  siteUrl: string;
  isDefault: boolean;
  brand: {
    name: string; // «NoLimitGoods» — у заголовках, alt, текстах
    nameLegal: string; // «NoLimitGoods Ltd» — у siteName, підписах
    tagline: string; // підпис під лого у футері
    logo: string; // шлях до лого (світлий фон)
    ogImage: string; // OG за замовчуванням 1200×630
    ogAuctionsImage: string; // OG для /aukciony і лендингів
    favicon?: string;
    /** null — стандартні кольори (червоний NoLimitGoods). */
    palette: BrandPalette | null;
  };
  contact: TenantContact;
  social: TenantSocial;
  company: TenantCompany;
  analytics: TenantAnalytics;
  leads: TenantLeads;
  pricing: TenantPricing;
  features: {
    /** Розділи запчастин (каталог, /part, /zapchastyny, /spectehnika). Для партнерів — тільки аукціонний портал. */
    parts: boolean;
    /** Reels NoLimitGoods на головній. */
    reels: string[];
    /** Блок «Telegram-канал» з лотами. */
    telegramChannelCta: boolean;
    /** Показувати назви аукціонних домів і посилання на оригінальний лот. У партнерів — приховані. */
    showAuctionHouses: boolean;
  };
  seo: {
    /** Індексувати сайт (robots). Для демо — false. */
    indexable: boolean;
  };
};

/** Публічна частина конфігу (без назв env і налаштувань маршрутизації заявок) — передається в браузер. */
export type PublicTenant = Omit<Tenant, 'leads'>;

// Мінімум нашої частки з договору: £150 (лот до £5k) / £299 (до £10k) / £799 (від £10k).
export const OWNER_SHARE_MIN_GBP: [number, number][] = [
  [5000, 150],
  [10000, 299],
  [Number.MAX_SAFE_INTEGER, 799],
];

// Стандартна палітра Tailwind red — значення за замовчуванням у globals.css.
export const DEFAULT_PALETTE: BrandPalette = {
  '50': '254 242 242',
  '100': '254 226 226',
  '200': '254 202 202',
  '300': '252 165 165',
  '400': '248 113 113',
  '500': '239 68 68',
  '600': '220 38 38',
  '700': '185 28 28',
  '800': '153 27 27',
  '900': '127 29 29',
  '950': '69 10 10',
};

// ---------------------------------------------------------------------------
// NoLimitGoods — значення з lib/site-config.ts (основний сайт, як було)
// ---------------------------------------------------------------------------
export const DEFAULT_TENANT: Tenant = {
  id: 'nolimitgoods',
  hosts: ['www.nolimitgoods.com', 'nolimitgoods.com', 'localhost'],
  siteUrl: 'https://www.nolimitgoods.com',
  isDefault: true,
  brand: {
    name: 'NoLimitGoods',
    nameLegal: 'NoLimitGoods Ltd',
    tagline: 'COVENTRY, UK HUB',
    logo: '/logo.png',
    ogImage: '/og-nlg.png',
    ogAuctionsImage: '/ads/og_aukciony_nlg.jpg',
    palette: null,
  },
  contact: { ...CONTACT },
  social: { ...SOCIAL },
  company: {
    legalName: COMPANY.legalName,
    legalNameFull: 'NoLimitGoods Limited',
    number: COMPANY.number,
    numberLabel: 'Company No',
    since: COMPANY.since,
    vat: COMPANY.vat,
    address: COMPANY.address,
    street: '374 Hipswell Highway',
    city: 'Coventry',
    postalCode: 'CV2 5FR',
    countryCode: 'GB',
    jurisdictionUk: 'Англії та Уельсі',
    jurisdictionEn: 'England and Wales',
    registryUrl: COMPANY.registryUrl,
    privacyEmail: CONTACT.email,
  },
  analytics: {
    metaPixelId: '1667641475157850',
    googleAdsId: 'AW-670192610',
    googleAdsLeadConversion: 'AW-670192610/Sx8lCIG5m54dEOKnyb8C',
    metaCapiTokenEnv: 'META_CAPI_TOKEN',
  },
  leads: {
    idPrefix: 'NLG',
    telegramBotTokenEnv: 'TELEGRAM_BOT_TOKEN',
    telegramChatIdEnv: 'TELEGRAM_CHAT_ID',
    googleSheetUrlEnv: 'GOOGLE_SHEET_URL',
    notifyOwner: false, // ми самі і є власник
  },
  pricing: {
    mode: 'nlg',
    partnerMarginPct: 0,
    partnerMarginMinGbp: 0,
    ownerSharePct: 1,
    ownerShareMinGbp: OWNER_SHARE_MIN_GBP,
    exportDocsGbp: 70,
    showUkVatDeposit: false,
    ukVatDepositRate: 0.2,
    paymentSchedule: [0.2, 0.5, 0.3],
  },
  features: {
    parts: true,
    reels: REELS,
    telegramChannelCta: true,
    showAuctionHouses: true,
  },
  seo: { indexable: true },
};

// ---------------------------------------------------------------------------
// ДЕМО-партнер (вигаданий): demo.localhost — для локальної перевірки White Label.
// Назва, контакти й юрособа вигадані. Аналітики немає — піксель/gtag не підключаються.
// ---------------------------------------------------------------------------
const DEMO_PHONE = '+380 44 000 0000';
const DEMO_DIGITS = DEMO_PHONE.replace(/[^0-9]/g, '');

export const DEMO_TENANT: Tenant = {
  id: 'demo',
  hosts: ['demo.localhost', 'auction.demo-tekhnika.ua'],
  siteUrl: 'http://demo.localhost:3000',
  isDefault: false,
  brand: {
    name: 'АгроТех Аукціон',
    nameLegal: 'ТОВ «АгроТех Демо»',
    tagline: 'ТЕХНІКА З АУКЦІОНІВ ЄВРОПИ',
    logo: '/tenants/demo/logo.svg',
    ogImage: '/tenants/demo/og.png',
    ogAuctionsImage: '/tenants/demo/og.png',
    favicon: '/tenants/demo/logo.svg',
    // Teal (Tailwind teal-*)
    palette: {
      '50': '240 253 250',
      '100': '204 251 241',
      '200': '153 246 228',
      '300': '94 234 212',
      '400': '45 212 191',
      '500': '20 184 166',
      '600': '13 148 136',
      '700': '15 118 110',
      '800': '17 94 89',
      '900': '19 78 74',
      '950': '4 47 46',
    },
  },
  contact: {
    phone: DEMO_PHONE,
    phoneUk: DEMO_PHONE,
    phoneUa: DEMO_PHONE,
    waNumber: DEMO_DIGITS,
    waDisplay: DEMO_PHONE,
    whatsapp: `https://wa.me/${DEMO_DIGITS}`,
    viber: `viber://chat?number=%2B${DEMO_DIGITS}`,
    telegram: 'https://t.me/agrotech_demo',
    email: 'sales@demo-tekhnika.ua',
    personalEmail: 'manager@demo-tekhnika.ua',
    personName: 'Менеджер АгроТех',
  },
  social: {
    instagram: '',
    instagramHandle: '',
    telegramChannel: '',
    telegramChannelHandle: '',
    facebook: '',
  },
  company: {
    legalName: 'ТОВ «АгроТех Демо»',
    legalNameFull: 'Товариство з обмеженою відповідальністю «АгроТех Демо»',
    number: '00000000',
    numberLabel: 'ЄДРПОУ',
    since: 2020,
    vat: '',
    address: 'вул. Прикладна, 1, Київ, 01001, Україна',
    street: 'вул. Прикладна, 1',
    city: 'Київ',
    postalCode: '01001',
    countryCode: 'UA',
    jurisdictionUk: 'Україні',
    jurisdictionEn: 'Ukraine',
    registryUrl: '',
    privacyEmail: 'privacy@demo-tekhnika.ua',
  },
  analytics: {},
  leads: {
    idPrefix: 'DEMO',
    telegramBotTokenEnv: 'TELEGRAM_BOT_TOKEN',
    telegramChatIdEnv: 'TENANT_DEMO_TELEGRAM_CHAT_ID',
    googleSheetUrlEnv: 'TENANT_DEMO_GOOGLE_SHEET_URL',
    crmWebhookUrlEnv: 'TENANT_DEMO_CRM_WEBHOOK_URL',
    crmWebhookSecretEnv: 'TENANT_DEMO_CRM_WEBHOOK_SECRET',
    notifyOwner: true,
    csvExportTokenEnv: 'TENANT_DEMO_CSV_TOKEN',
  },
  pricing: {
    mode: 'partner',
    partnerMarginPct: 0.06,
    partnerMarginMinGbp: 400,
    ownerSharePct: 0.5,
    ownerShareMinGbp: OWNER_SHARE_MIN_GBP,
    exportDocsGbp: 70,
    showUkVatDeposit: true,
    ukVatDepositRate: 0.2,
    paymentSchedule: [0.2, 0.5, 0.3],
  },
  features: {
    parts: false,
    reels: [],
    telegramChannelCta: false,
    showAuctionHouses: false,
  },
  seo: { indexable: false },
};

export const TENANTS: Tenant[] = [DEFAULT_TENANT, DEMO_TENANT];

export function tenantById(id: string | null | undefined): Tenant {
  return TENANTS.find((t) => t.id === id) ?? DEFAULT_TENANT;
}

/** Host без порту, у нижньому регістрі. */
export function normalizeHost(host: string | null | undefined): string {
  return String(host || '').toLowerCase().split(',')[0].trim().replace(/:\d+$/, '');
}

export function tenantByHost(host: string | null | undefined): Tenant {
  const h = normalizeHost(host);
  if (!h) return DEFAULT_TENANT;
  return TENANTS.find((t) => t.hosts.includes(h)) ?? DEFAULT_TENANT;
}

export function toPublicTenant(t: Tenant): PublicTenant {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { leads, ...pub } = t;
  return pub;
}

/** Абсолютний URL на сайті партнера. */
export function absUrl(t: Pick<Tenant, 'siteUrl'>, path = ''): string {
  if (!path) return t.siteUrl;
  if (/^https?:\/\//.test(path)) return path;
  return `${t.siteUrl}${path.startsWith('/') ? '' : '/'}${path}`;
}

/** Значення env за назвою з конфігу (тільки на сервері). */
export function envOf(name: string | undefined): string | undefined {
  if (!name) return undefined;
  const v = process.env[name];
  return v && v.trim() ? v.trim() : undefined;
}

/** Шляхи розділу запчастин — вимикаються для партнерів з features.parts = false. */
export const PARTS_PATH_PREFIXES = ['/catalog', '/part', '/zapchastyny', '/spectehnika', '/vidguk'];
