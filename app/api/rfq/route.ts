export const maxDuration = 60;
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import prisma from '@/lib/prisma';

// Очищення артикула від пробілів, слешів та дефісів ("332/Y3163" -> "332Y3163")
function cleanPartNumber(pn: string): string {
  return String(pn || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().trim();
}

export interface SourcedOffer {
  storeName: string;
  storeUrl: string;
  title: string;
  rawPriceGbp: number;
  hasVat: boolean;
  netBaseGbp: number;
  clientPriceGbp: number;
  weightKg: number;
  isOversized?: boolean;
  isKnownPrice?: boolean;
}

const FX_RATES: Record<string, number> = {
  GBP: 1.0,
  EUR: 0.85,
  PLN: 0.20,
  USD: 0.78,
};

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'en-GB,en;q=0.9,de;q=0.8,pl;q=0.7',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

// Перелік великогабаритних деталей (двері, скло, капоти), де рахується об'ємна вага
const OVERSIZED_PARTS = new Set(['2811196']);

// ============================================================================
// 1. ЗОЛОТА БАЗА ПЕРЕВІРЕНИХ ІНВОЙСІВ ТА ХАБІВ UK/EU (МИТТЄВА ВІДДАЧА)
// ============================================================================
const EXACT_SOURCED_OFFERS: Record<string, SourcedOffer> = {
  // --- JCB PARKER HYDRAULICS (3CX / 4CX) ---
  '332Y3163': {
    storeName: 'JCB UK Central Depot',
    storeUrl: 'https://vicaryplant.co.uk/search?q=332/Y3163',
    title: 'JCB Parker Main Hydraulic Gear Pump 3CX/4CX (332/Y3163)',
    rawPriceGbp: 1100.0,
    hasVat: false,
    netBaseGbp: 880.0,
    clientPriceGbp: 1100.0,
    weightKg: 18.5,
    isKnownPrice: true,
  },
  '20925327': {
    storeName: 'JCB UK Central Depot',
    storeUrl: 'https://vicaryplant.co.uk/search?q=20/925327',
    title: 'JCB Parker Dual Hydraulic Pump 36/29cc (20/925327)',
    rawPriceGbp: 950.0,
    hasVat: false,
    netBaseGbp: 760.0,
    clientPriceGbp: 950.0,
    weightKg: 17.0,
    isKnownPrice: true,
  },
  '333G5390': {
    storeName: 'JCB UK Central Depot',
    storeUrl: 'https://vicaryplant.co.uk/search?q=333/G5390',
    title: 'JCB Parker Hydraulic Twin Pump (333/G5390)',
    rawPriceGbp: 950.0,
    hasVat: false,
    netBaseGbp: 760.0,
    clientPriceGbp: 950.0,
    weightKg: 17.5,
    isKnownPrice: true,
  },
  '332F9030': {
    storeName: 'JCB UK Central Depot',
    storeUrl: 'https://vicaryplant.co.uk/search?q=332/F9030',
    title: 'JCB Parker Hydraulic Gear Pump Unit (332/F9030)',
    rawPriceGbp: 908.0,
    hasVat: false,
    netBaseGbp: 726.4,
    clientPriceGbp: 908.0,
    weightKg: 16.5,
    isKnownPrice: true,
  },
  '45820403': {
    storeName: 'JCB World Parts Centre',
    storeUrl: 'https://vicaryplant.co.uk/search?q=458/20403',
    title: 'JCB Lift Ram Seal Kit / Ремкомплект гідроциліндра (458/20403)',
    rawPriceGbp: 85.0,
    hasVat: true,
    netBaseGbp: 70.83,
    clientPriceGbp: 88.54,
    weightKg: 1.5,
    isKnownPrice: true,
  },
  '32925682': {
    storeName: 'JCB Direct UK',
    storeUrl: 'https://vicaryplant.co.uk/search?q=32/925682',
    title: 'JCB Pivot Pin / Палець стріли екскаватора (32/925682)',
    rawPriceGbp: 48.0,
    hasVat: true,
    netBaseGbp: 40.0,
    clientPriceGbp: 50.0,
    weightKg: 3.2,
    isKnownPrice: true,
  },
  '02100073': {
    storeName: 'JCB Direct UK',
    storeUrl: 'https://vicaryplant.co.uk/search?q=02/100073',
    title: 'JCB Hub Oil Seal / Сальник бортового редуктора (02/100073)',
    rawPriceGbp: 18.5,
    hasVat: true,
    netBaseGbp: 15.42,
    clientPriceGbp: 19.28,
    weightKg: 0.3,
    isKnownPrice: true,
  },

  // --- REXROTH & DONALDSON / FILTRATION ---
  'A10VSO71': {
    storeName: 'Bosch Rexroth Germany Hub',
    storeUrl: 'https://www.boschrexroth.com',
    title: 'Bosch Rexroth Axial Piston Pump A10VSO71',
    rawPriceGbp: 1450.0,
    hasVat: true,
    netBaseGbp: 1208.33,
    clientPriceGbp: 1510.41,
    weightKg: 32.0,
    isKnownPrice: true,
  },
  'P553004': {
    storeName: 'Donaldson Europe NV (Belgium)',
    storeUrl: 'https://www.inlinefilters.co.uk/index.php?main_page=advanced_search_result&keyword=P553004',
    title: 'Donaldson Hydraulic Spin-On Filter (P553004)',
    rawPriceGbp: 42.0,
    hasVat: true,
    netBaseGbp: 35.0,
    clientPriceGbp: 43.75,
    weightKg: 1.1,
    isKnownPrice: true,
  },
  'SH60187': {
    storeName: 'Inline Filters UK Hub',
    storeUrl: 'https://www.inlinefilters.co.uk/index.php?main_page=advanced_search_result&keyword=SH60187',
    title: 'HiFi Hydraulic Filter SH 60187',
    rawPriceGbp: 32.26,
    hasVat: true,
    netBaseGbp: 26.88,
    clientPriceGbp: 33.6,
    weightKg: 1.5,
    isKnownPrice: true,
  },

  // --- CASE IH (NLG-PI-365554) ---
  '87643472': {
    storeName: 'Case IH / CNH Europe Hub',
    storeUrl: 'https://agrilineproducts.com/case-international',
    title: 'Case IH AccuBoom Boom Control Unit Module (87643472)',
    rawPriceGbp: 2800.0,
    hasVat: false,
    netBaseGbp: 2240.0,
    clientPriceGbp: 2800.0,
    weightKg: 4.5,
    isKnownPrice: true,
  },
  '47773024': {
    storeName: 'Case IH / Sanden EU Hub',
    storeUrl: 'https://agrilineproducts.com/case-international',
    title: 'Case Stackcruiser Sanden AC Compressor Assembly (47773024)',
    rawPriceGbp: 650.0,
    hasVat: false,
    netBaseGbp: 520.0,
    clientPriceGbp: 650.0,
    weightKg: 8.2,
    isKnownPrice: true,
  },

  // --- CATERPILLAR CAB DOOR GROUP (NLG-PI-339006) ---
  '2811196': {
    storeName: 'Finning CAT UK Logistics',
    storeUrl: 'https://parts.cat.com',
    title: 'Caterpillar Operator Cab Door Shell Assembly (281-1196)',
    rawPriceGbp: 1063.75,
    hasVat: false,
    netBaseGbp: 851.0,
    clientPriceGbp: 1063.75,
    weightKg: 22.0,
    isOversized: true,
    isKnownPrice: true,
  },
  '2811199': {
    storeName: 'Finning CAT UK Logistics',
    storeUrl: 'https://parts.cat.com',
    title: 'Caterpillar Cab Door Center Roller Bracket (281-1199)',
    rawPriceGbp: 393.66,
    hasVat: false,
    netBaseGbp: 314.93,
    clientPriceGbp: 393.66,
    weightKg: 3.5,
    isKnownPrice: true,
  },
  '2933116': {
    storeName: 'Finning CAT UK Logistics',
    storeUrl: 'https://parts.cat.com',
    title: 'Caterpillar Operator Cabin Door Rod Guide (293-3116)',
    rawPriceGbp: 482.25,
    hasVat: false,
    netBaseGbp: 385.8,
    clientPriceGbp: 482.25,
    weightKg: 2.8,
    isKnownPrice: true,
  },
  '2807548': {
    storeName: 'Finning CAT UK Logistics',
    storeUrl: 'https://parts.cat.com',
    title: 'Caterpillar Cabin Door Lock Mechanism Assembly (280-7548)',
    rawPriceGbp: 219.36,
    hasVat: false,
    netBaseGbp: 175.49,
    clientPriceGbp: 219.36,
    weightKg: 1.4,
    isKnownPrice: true,
  },
  '1961441': {
    storeName: 'Finning CAT UK Logistics',
    storeUrl: 'https://parts.cat.com',
    title: 'Caterpillar Cabin Secondary Door Latch Lock (196-1441)',
    rawPriceGbp: 198.98,
    hasVat: false,
    netBaseGbp: 159.18,
    clientPriceGbp: 198.98,
    weightKg: 1.2,
    isKnownPrice: true,
  },
  '2807544': {
    storeName: 'Finning CAT UK Logistics',
    storeUrl: 'https://parts.cat.com',
    title: 'Caterpillar 110mm Push Cab Handle with Levers (280-7544)',
    rawPriceGbp: 187.5,
    hasVat: false,
    netBaseGbp: 150.0,
    clientPriceGbp: 187.5,
    weightKg: 0.9,
    isKnownPrice: true,
  },
  '1327625': {
    storeName: 'Finning CAT UK Logistics',
    storeUrl: 'https://parts.cat.com',
    title: 'Caterpillar Window Lock Latch Catch Assembly (132-7625)',
    rawPriceGbp: 119.85,
    hasVat: false,
    netBaseGbp: 95.88,
    clientPriceGbp: 119.85,
    weightKg: 0.6,
    isKnownPrice: true,
  },
  '2776031': {
    storeName: 'Finning CAT UK Logistics',
    storeUrl: 'https://parts.cat.com',
    title: 'Caterpillar 18.5mm Width Door Handle Internal Part (277-6031)',
    rawPriceGbp: 116.75,
    hasVat: false,
    netBaseGbp: 93.4,
    clientPriceGbp: 116.75,
    weightKg: 0.5,
    isKnownPrice: true,
  },
  '2813650': {
    storeName: 'Finning CAT UK Logistics',
    storeUrl: 'https://parts.cat.com',
    title: 'Caterpillar 3mm Thick Operator Cabin Door Seal (281-3650)',
    rawPriceGbp: 50.23,
    hasVat: false,
    netBaseGbp: 40.18,
    clientPriceGbp: 50.23,
    weightKg: 1.1,
    isKnownPrice: true,
  },
  '2776030': {
    storeName: 'Finning CAT UK Logistics',
    storeUrl: 'https://parts.cat.com',
    title: 'Caterpillar Cab Door Handle Lever Base (277-6030)',
    rawPriceGbp: 36.0,
    hasVat: false,
    netBaseGbp: 28.8,
    clientPriceGbp: 36.0,
    weightKg: 0.6,
    isKnownPrice: true,
  },
  '2811200': {
    storeName: 'Finning CAT UK Logistics',
    storeUrl: 'https://parts.cat.com',
    title: 'Caterpillar Cab Door Lower Roller Bracket (281-1200)',
    rawPriceGbp: 50.0,
    hasVat: false,
    netBaseGbp: 40.0,
    clientPriceGbp: 50.0,
    weightKg: 2.2,
    isKnownPrice: true,
  },
  '2807552': {
    storeName: 'Finning CAT UK Logistics',
    storeUrl: 'https://parts.cat.com',
    title: 'Caterpillar Door Lock Retainer Plate (280-7552)',
    rawPriceGbp: 22.0,
    hasVat: false,
    netBaseGbp: 17.6,
    clientPriceGbp: 22.0,
    weightKg: 0.4,
    isKnownPrice: true,
  },
  '2816262': {
    storeName: 'Finning CAT UK Logistics',
    storeUrl: 'https://parts.cat.com',
    title: 'Caterpillar Metric Special Screw (281-6262)',
    rawPriceGbp: 5.5,
    hasVat: false,
    netBaseGbp: 4.4,
    clientPriceGbp: 5.5,
    weightKg: 0.1,
    isKnownPrice: true,
  },
  '2816263': {
    storeName: 'Finning CAT UK Logistics',
    storeUrl: 'https://parts.cat.com',
    title: 'Caterpillar Metric Mounting Screw (281-6263)',
    rawPriceGbp: 5.5,
    hasVat: false,
    netBaseGbp: 4.4,
    clientPriceGbp: 5.5,
    weightKg: 0.1,
    isKnownPrice: true,
  },
  '2816264': {
    storeName: 'Finning CAT UK Logistics',
    storeUrl: 'https://parts.cat.com',
    title: 'Caterpillar Metric Guide Screw (281-6264)',
    rawPriceGbp: 5.5,
    hasVat: false,
    netBaseGbp: 4.4,
    clientPriceGbp: 5.5,
    weightKg: 0.1,
    isKnownPrice: true,
  },
  '5C2890': {
    storeName: 'Finning CAT UK Logistics',
    storeUrl: 'https://parts.cat.com',
    title: 'Caterpillar Lock Nut Fastener (5C-2890)',
    rawPriceGbp: 3.5,
    hasVat: false,
    netBaseGbp: 2.8,
    clientPriceGbp: 3.5,
    weightKg: 0.05,
    isKnownPrice: true,
  },
};

// ============================================================================
// 2. МАТЕМАТИКА ЦІНОУТВОРЕННЯ (ЗНЯТТЯ 20% VAT + НАЦІНКА 25%)
// ============================================================================
function buildSourcedOffer(params: {
  storeName: string;
  storeUrl: string;
  title: string;
  rawPrice: number;
  currency: 'GBP' | 'EUR' | 'PLN' | 'USD';
  hasVat: boolean;
  weightKg?: number;
  oem: string;
}): SourcedOffer {
  const rate = FX_RATES[params.currency] || 1.0;
  const rawPriceGbp = Math.round(params.rawPrice * rate * 100) / 100;

  // Якщо ціна донора включає ПДВ (Inc. VAT), ділимо на 1.20. Інакше беремо чисту.
  const netBaseGbp = params.hasVat
    ? Math.round((rawPriceGbp / 1.20) * 100) / 100
    : rawPriceGbp;

  // Наша ціна для клієнта = Чиста база без VAT * 1.25 (+25% заробітку)
  const clientPriceGbp = Math.round(netBaseGbp * 1.25 * 100) / 100;

  return {
    storeName: params.storeName,
    storeUrl: params.storeUrl,
    title: params.title || `OEM Component ${params.oem}`,
    rawPriceGbp,
    hasVat: params.hasVat,
    netBaseGbp,
    clientPriceGbp,
    weightKg: params.weightKg || 1.5,
    isOversized: OVERSIZED_PARTS.has(params.oem),
    isKnownPrice: true,
  };
}

// ============================================================================
// 3. ЕШЕЛОН 1: ПАРАЛЕЛЬНИЙ ПАРСИНГ ТОП-10 ЄВРОПЕЙСЬКИХ ТА БРИТАНСЬКИХ ХАБІВ
// ============================================================================
function getTier1Tasks(oem: string) {
  return [
    // 1. Inline Filters UK (Donaldson, Fleetguard, Baldwin, HiFi)
    async (): Promise<SourcedOffer | null> => {
      try {
        const url = `https://www.inlinefilters.co.uk/index.php?main_page=advanced_search_result&search_in_description=1&keyword=${oem}`;
        const res = await fetch(url, { headers: HEADERS, next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const $ = cheerio.load(await res.text());
        const priceStr = $('.productSpecialPrice, .productBasePrice, .normalprice').first().text();
        const m = priceStr.match(/[\d,.]+/);
        if (m) {
          const raw = parseFloat(m[0].replace(',', ''));
          if (raw > 0) {
            return buildSourcedOffer({
              storeName: 'Inline Filters UK',
              storeUrl: url,
              title: $('.productListing-heading, .productName, h1').first().text().trim() || `Filter OEM ${oem}`,
              rawPrice: raw,
              currency: 'GBP',
              hasVat: true,
              weightKg: 1.2,
              oem,
            });
          }
        }
      } catch {}
      return null;
    },

    // 2. MalpasOnline Heavy Parts UK (Агро, трактори, гідравліка)
    async (): Promise<SourcedOffer | null> => {
      try {
        const url = `https://www.malpasonline.co.uk/search?q=${oem}`;
        const res = await fetch(url, { headers: HEADERS, next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const $ = cheerio.load(await res.text());
        const priceStr = $('.price, .money, .product-price').first().text();
        const m = priceStr.match(/[\d,.]+/);
        if (m) {
          const raw = parseFloat(m[0].replace(',', ''));
          if (raw > 0) {
            return buildSourcedOffer({
              storeName: 'MalpasOnline UK',
              storeUrl: url,
              title: $('.product-title, .title, h1').first().text().trim() || `Spares ${oem}`,
              rawPrice: raw,
              currency: 'GBP',
              hasVat: true,
              weightKg: 1.5,
              oem,
            });
          }
        }
      } catch {}
      return null;
    },

    // 3. Wismet Filtration Germany (Німецький промисловий хаб)
    async (): Promise<SourcedOffer | null> => {
      try {
        const url = `https://www.wismet.de/?suchbegriff=${oem}`;
        const res = await fetch(url, { headers: HEADERS, next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const $ = cheerio.load(await res.text());
        const priceStr = $('.price--default, .product--price').first().text();
        const m = priceStr.match(/[\d,.]+/);
        if (m) {
          const rawEur = parseFloat(m[0].replace(',', '.'));
          if (rawEur > 0) {
            return buildSourcedOffer({
              storeName: 'Wismet Filtration DE',
              storeUrl: url,
              title: $('.item-title, h1, .product--title').first().text().trim() || `Wismet DE ${oem}`,
              rawPrice: rawEur,
              currency: 'EUR',
              hasVat: true,
              weightKg: 1.1,
              oem,
            });
          }
        }
      } catch {}
      return null;
    },

    // 4. Digger Parts UK (JCB, CAT, Volvo, Komatsu)
    async (): Promise<SourcedOffer | null> => {
      try {
        const url = `https://diggerpartsuk.co.uk/search?q=${oem}`;
        const res = await fetch(url, { headers: HEADERS, next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const $ = cheerio.load(await res.text());
        const priceStr = $('.price, .price-item--regular').first().text();
        const m = priceStr.match(/[\d,.]+/);
        if (m) {
          const raw = parseFloat(m[0].replace(',', ''));
          if (raw > 0) {
            return buildSourcedOffer({
              storeName: 'Digger Parts UK',
              storeUrl: url,
              title: $('.product-item__title, h1').first().text().trim() || `Digger Part ${oem}`,
              rawPrice: raw,
              currency: 'GBP',
              hasVat: true,
              weightKg: 2.0,
              oem,
            });
          }
        }
      } catch {}
      return null;
    },

    // 5. Vicary Plant JCB UK (Спеціалізований JCB хаб)
    async (): Promise<SourcedOffer | null> => {
      try {
        const url = `https://vicaryplant.co.uk/search?q=${oem}`;
        const res = await fetch(url, { headers: HEADERS, next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const $ = cheerio.load(await res.text());
        const priceStr = $('.price, .money').first().text();
        const m = priceStr.match(/[\d,.]+/);
        if (m) {
          const raw = parseFloat(m[0].replace(',', ''));
          if (raw > 0) {
            return buildSourcedOffer({
              storeName: 'Vicary Plant JCB UK',
              storeUrl: url,
              title: $('.product-item__title, h1').first().text().trim() || `JCB UK ${oem}`,
              rawPrice: raw,
              currency: 'GBP',
              hasVat: true,
              weightKg: 1.5,
              oem,
            });
          }
        }
      } catch {}
      return null;
    },

    // 6. Agri-Linc Heavy Attachments UK (Ковші, адаптери, пальці, втулки)
    async (): Promise<SourcedOffer | null> => {
      try {
        const url = `https://www.agri-linc.com/catalogsearch/result/?q=${oem}`;
        const res = await fetch(url, { headers: HEADERS, next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const $ = cheerio.load(await res.text());
        const priceStr = $('.price-wrapper .price, .price').first().text();
        const m = priceStr.match(/[\d,.]+/);
        if (m) {
          const raw = parseFloat(m[0].replace(',', ''));
          if (raw > 0) {
            return buildSourcedOffer({
              storeName: 'Agri-Linc Attachments UK',
              storeUrl: url,
              title: $('.product-item-link, h1').first().text().trim() || `Heavy Wear Part ${oem}`,
              rawPrice: raw,
              currency: 'GBP',
              hasVat: true,
              weightKg: 2.2,
              oem,
            });
          }
        }
      } catch {}
      return null;
    },

    // 7. Agriline Products UK/EU (Case IH, New Holland, John Deere, Perkins)
    async (): Promise<SourcedOffer | null> => {
      try {
        const url = `https://agrilineproducts.com/catalogsearch/result/?q=${oem}`;
        const res = await fetch(url, { headers: HEADERS, next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const $ = cheerio.load(await res.text());
        const priceStr = $('.price-box .price, .price').first().text();
        const m = priceStr.match(/[\d,.]+/);
        if (m) {
          const raw = parseFloat(m[0].replace(',', ''));
          if (raw > 0) {
            return buildSourcedOffer({
              storeName: 'Agriline Products UK',
              storeUrl: url,
              title: $('.product-item-link, h1').first().text().trim() || `Agri OEM ${oem}`,
              rawPrice: raw,
              currency: 'GBP',
              hasVat: true,
              weightKg: 1.8,
              oem,
            });
          }
        }
      } catch {}
      return null;
    },

    // 8. L&S Engineers UK (JCB, Kubota, Yanmar, Terex)
    async (): Promise<SourcedOffer | null> => {
      try {
        const url = `https://www.lsengineers.co.uk/catalogsearch/result/?q=${oem}`;
        const res = await fetch(url, { headers: HEADERS, next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const $ = cheerio.load(await res.text());
        const priceStr = $('.price-excluding-tax .price, .price').first().text();
        const m = priceStr.match(/[\d,.]+/);
        if (m) {
          const raw = parseFloat(m[0].replace(',', ''));
          if (raw > 0) {
            return buildSourcedOffer({
              storeName: 'L&S Plant Engineers UK',
              storeUrl: url,
              title: $('.product-item-link, h1').first().text().trim() || `Plant Spares ${oem}`,
              rawPrice: raw,
              currency: 'GBP',
              hasVat: true,
              weightKg: 1.4,
              oem,
            });
          }
        }
      } catch {}
      return null;
    },
  ];
}

// ============================================================================
// 4. ЕШЕЛОН 2: AI-РОЗВІДКА ЧЕРЕЗ PERPLEXITY SONAR (30 ХАБІВ ЄВРОПИ)
// ============================================================================
async function queryTier2HubsWithAI(
  oem: string,
  machineModel: string,
  apiKey: string
): Promise<SourcedOffer | null> {
  try {
    const prompt = `Find current UK or European price for heavy machinery OEM part number "${oem}" (${machineModel}). Check Finning CAT, Kramp, TVH, Bepco, Allegro PL, Hydraulic megastores. Return ONLY valid JSON: {"title": "part name", "priceGbp": number, "hasVat": boolean, "weightKg": number, "supplier": "store name", "url": "direct url"}`;

    const res = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          { role: 'system', content: 'You are an industrial OEM parts pricing engine. Respond strictly with JSON.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.1,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);
    const price = Number(parsed.priceGbp);
    if (!price || price <= 0) return null;

    return buildSourcedOffer({
      storeName: parsed.supplier || 'European OEM Hub (AI Verified)',
      storeUrl: parsed.url || `https://www.google.com/search?q=${encodeURIComponent(oem + ' OEM part')}`,
      title: parsed.title || `${machineModel} OEM ${oem}`,
      rawPrice: price,
      currency: 'GBP',
      hasVat: Boolean(parsed.hasVat ?? true),
      weightKg: Number(parsed.weightKg) || 1.5,
      oem,
    });
  } catch {
    return null;
  }
}

// ============================================================================
// 5. КАСКАДНИЙ ПОШУК ОДНІЄЇ ДЕТАЛІ (ІНВОЙСИ -> PRISMA -> ПАРСЕР -> AI -> FALLBACK)
// ============================================================================
async function resolveBestOffer(oem: string, machineModel: string): Promise<SourcedOffer> {
  const cleanOem = cleanPartNumber(oem);

  // КРОК 1: Миттєва перевірка в золотій базі інвойсів
  if (EXACT_SOURCED_OFFERS[cleanOem]) {
    return EXACT_SOURCED_OFFERS[cleanOem];
  }

  // КРОК 2: Перевірка 24-годинного кешу в базі даних Prisma
  try {
    const cached = await prisma.cachedPart.findUnique({ where: { oem: cleanOem } });
    if (cached) {
      const ageHours = (Date.now() - new Date(cached.updatedAt).getTime()) / (1000 * 60 * 60);
      if (ageHours < 24 && cached.supplierPriceGbp > 0) {
        const netBase = Math.round((cached.finalPriceGbp / 1.25) * 100) / 100;
        return {
          storeName: cached.supplierName || 'Coventry OEM Cache',
          storeUrl: `https://www.google.com/search?q=${encodeURIComponent(cached.supplierName + ' ' + cleanOem)}`,
          title: cached.title,
          rawPriceGbp: cached.supplierPriceGbp,
          hasVat: false,
          netBaseGbp: netBase,
          clientPriceGbp: cached.finalPriceGbp,
          weightKg: OVERSIZED_PARTS.has(cleanOem) ? 22.0 : 1.5,
          isOversized: OVERSIZED_PARTS.has(cleanOem),
          isKnownPrice: true,
        };
      }
    }
  } catch (e) {
    console.warn('Prisma cache read bypassed:', e);
  }

  // КРОК 3: Паралельний живий парсинг Топ-10 хабів (1-й ешелон)
  let bestOffer: SourcedOffer | null = null;
  const tasks = getTier1Tasks(cleanOem);
  const settled = await Promise.allSettled(tasks.map((fn) => fn()));
  const validOffers: SourcedOffer[] = [];

  for (const res of settled) {
    if (res.status === 'fulfilled' && res.value && res.value.netBaseGbp > 0) {
      validOffers.push(res.value);
    }
  }

  if (validOffers.length > 0) {
    validOffers.sort((a, b) => a.netBaseGbp - b.netBaseGbp);
    bestOffer = validOffers[0];
  }

  // КРОК 4: Якщо парсери не знайшли — вмикаємо Perplexity AI (2-й ешелон)
  const pplxKey = process.env.PERPLEXITY_API_KEY;
  if (!bestOffer && pplxKey) {
    bestOffer = await queryTier2HubsWithAI(cleanOem, machineModel, pplxKey);
  }

  // КРОК 5: Якщо знайшли живу ціну — кешуємо в Prisma для миттєвого відкриття наступного разу
  if (bestOffer) {
    try {
      await prisma.cachedPart.upsert({
        where: { oem: cleanOem },
        update: {
          title: bestOffer.title,
          supplierName: bestOffer.storeName,
          supplierCountry: 'UK/EU',
          supplierPriceGbp: bestOffer.netBaseGbp,
          finalPriceGbp: bestOffer.clientPriceGbp,
          inStock: true,
        },
        create: {
          oem: cleanOem,
          title: bestOffer.title,
          supplierName: bestOffer.storeName,
          supplierCountry: 'UK/EU',
          supplierPriceGbp: bestOffer.netBaseGbp,
          finalPriceGbp: bestOffer.clientPriceGbp,
          hubLocation: 'Coventry Hub, UK',
          deliveryTransit: '5-8 робочих днів до України',
          inStock: true,
        },
      });
    } catch (e) {
      console.warn('Prisma cache write bypassed:', e);
    }
    return bestOffer;
  }

  // КРОК 6: Безпечний індустріальний Fallback, щоб клієнт ніколи не губився
  const fallbackNet = 45.0;
  return {
    storeName: 'TVH / UK Central Logistics Hub',
    storeUrl: `https://www.google.com/search?q=${encodeURIComponent('TVH OEM ' + cleanOem)}`,
    title: `${machineModel} OEM Component (${oem})`,
    rawPriceGbp: 54.0,
    hasVat: true,
    netBaseGbp: fallbackNet,
    clientPriceGbp: Math.round(fallbackNet * 1.25 * 100) / 100, // £56.25
    weightKg: 1.5,
    isOversized: false,
    isKnownPrice: false,
  };
}

// ============================================================================
// 6. РОЗУМНА ЛОГІСТИКА (ФАКТИЧНА + ОБ'ЄМНА ВАГА ДЛЯ ДВЕРЕЙ/НЕГАБАРИТУ)
// ============================================================================
function calculateSmartShipping(
  actualWeightKg: number,
  hasOversizedItem: boolean,
  country: string
) {
  // Якщо є двері кабіни (135x75x25 см), об'ємна вага становить мінімум 50.6 кг
  const effectiveWeightKg = hasOversizedItem
    ? Math.max(actualWeightKg, 50.6)
    : actualWeightKg;

  const isEuDestination = /чех|czech|poland|польщ|germany|німеч|eu|єс/i.test(country);

  // Спеціальний тариф для негабариту (двері кабіни, рами, скло)
  if (hasOversizedItem) {
    if (isEuDestination) {
      return {
        shippingCost: 110,
        effectiveWeightKg,
        parcelType: `Oversized Euro Freight (Негабарит >120см • Факт: ${actualWeightKg} кг / Об'ємна: ${effectiveWeightKg} кг)`,
      };
    }
    return {
      shippingCost: 150,
      effectiveWeightKg,
      parcelType: `Nova Post Global Oversized (Решетування дверей >120см • Факт: ${actualWeightKg} кг / Об'ємна: ${effectiveWeightKg} кг)`,
    };
  }

  // Стандартна тарифна сітка Nova Post Global / T1 Консолідація
  if (effectiveWeightKg <= 2.0) {
    return {
      shippingCost: 27,
      effectiveWeightKg,
      parcelType: `Nova Post Small (до 2 кг • ${actualWeightKg} кг)`,
    };
  } else if (effectiveWeightKg <= 10.0) {
    return {
      shippingCost: 41,
      effectiveWeightKg,
      parcelType: `Nova Post Medium (до 10 кг • ${actualWeightKg} кг)`,
    };
  } else if (effectiveWeightKg <= 30.0) {
    return {
      shippingCost: 68,
      effectiveWeightKg,
      parcelType: `Nova Post Large (консолідований ящик до 30 кг • ${actualWeightKg} кг)`,
    };
  } else if (effectiveWeightKg <= 60.0) {
    return {
      shippingCost: 115,
      effectiveWeightKg,
      parcelType: `Nova Post Heavy (консолідація 2 ящики • ${actualWeightKg} кг)`,
    };
  } else if (effectiveWeightKg <= 150.0) {
    return {
      shippingCost: 165,
      effectiveWeightKg,
      parcelType: `Mini Pallet Freight (${actualWeightKg} кг)`,
    };
  } else {
    const pallets = Math.ceil(effectiveWeightKg / 700);
    return {
      shippingCost: 240 * pallets,
      effectiveWeightKg,
      parcelType: `Full Euro-Pallet T1 (${pallets} пал. • ${actualWeightKg} кг)`,
    };
  }
}

// ============================================================================
// 7. GET-ОБРОБНИК (ДЛЯ МИТТЄВОЇ ПЕРЕВІРКИ ЦІНИ НА КАРТЦІ ТОВАРУ: ?oem=...)
// ============================================================================
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawOem = searchParams.get('oem');

  if (!rawOem) {
    return NextResponse.json(
      { error: 'Вкажіть каталожний номер: ?oem=НОМЕР' },
      { status: 400 }
    );
  }

  const cleanOem = cleanPartNumber(rawOem);
  const offer = await resolveBestOffer(cleanOem, 'Heavy Machinery');
  const profit = Math.round((offer.clientPriceGbp - offer.netBaseGbp) * 100) / 100;

  return NextResponse.json({
    found: true,
    oem: cleanOem,
    title: offer.title,
    cheapestSupplier: offer.storeName,
    storeUrl: offer.storeUrl,
    hasVat: offer.hasVat,
    grossPriceGbp: offer.rawPriceGbp,
    effectiveBuyCostGbp: offer.netBaseGbp,
    clientPriceGbp: offer.clientPriceGbp,
    totalProfitGbp: profit,
    weightKg: offer.weightKg,
    isOversized: Boolean(offer.isOversized),
    currency: 'GBP',
    hubLocation: 'Coventry Hub, UK',
    deliveryTransit: '5-8 робочих днів',
    inStock: true,
    updatedAt: new Date().toISOString(),
  });
}

// ============================================================================
// 8. POST-ОБРОБНИК (КАЛЬКУЛЯТОР СПЕЦИФІКАЦІЙ, PROFORMA INVOICE, XERO, TELEGRAM)
// ============================================================================
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Антиспам Honeypot
    if (body.website_hp) {
      return NextResponse.json({ success: true, status: 'filtered' });
    }

    const { items = [], country = 'Україна', contact = '', invoiceNumber = '' } = body;

    const rawItems: any[] =
      Array.isArray(items) && items.length > 0
        ? items
        : [
            {
              partNumber: body.partNumber || '',
              machineModel: body.machineModel || '',
              quantity: body.quantity || 1,
            },
          ];

    const validItems = rawItems
      .slice(0, 20) // До 20 позицій в одному інвойсі (включно з 16 позиціями кабіни CAT)
      .filter((it) => String(it.partNumber || '').trim().length > 0)
      .map((it) => ({
        rawPartNumber: String(it.partNumber).trim(),
        partNumber: cleanPartNumber(String(it.partNumber)),
        machineModel: String(it.machineModel || 'Heavy Equipment').trim(),
        quantity: Math.max(1, parseInt(String(it.quantity), 10) || 1),
      }));

    if (validItems.length === 0) {
      return NextResponse.json(
        { error: 'Вкажіть хоча б один каталожний номер' },
        { status: 400 }
      );
    }

    // Отримуємо найкращі пропозиції паралельно по всіх позиціях замовлення
    const processedItems = await Promise.all(
      validItems.map(async (item) => {
        const bestOffer = await resolveBestOffer(item.partNumber, item.machineModel);

        const totalWeightKg = Math.round(bestOffer.weightKg * item.quantity * 10) / 10;
        const itemTotalGbp = Math.round(bestOffer.clientPriceGbp * item.quantity * 100) / 100;

        return {
          partNumber: item.rawPartNumber,
          cleanOem: item.partNumber,
          machineModel: item.machineModel,
          quantity: item.quantity,
          partTitle: bestOffer.title,
          supplierRawPriceGbp: bestOffer.rawPriceGbp,
          hasVat: bestOffer.hasVat,
          supplierBuyPriceGbp: bestOffer.netBaseGbp,     // Чиста собівартість без ПДВ
          clientUnitPriceGbp: bestOffer.clientPriceGbp,  // Ціна клієнта (+25% маржі)
          unitWeightKg: bestOffer.weightKg,
          totalWeightKg,
          itemTotalGbp,
          storeName: bestOffer.storeName,
          storeUrl: bestOffer.storeUrl,
          isOversized: Boolean(bestOffer.isOversized),
          isKnownPrice: Boolean(bestOffer.isKnownPrice),
        };
      })
    );

    // Підрахунок ваги та перевірка наявності негабариту (наприклад, дверей 281-1196)
    const totalOrderWeightKg =
      Math.round(processedItems.reduce((acc, curr) => acc + curr.totalWeightKg, 0) * 10) / 10;
    const hasOversized = processedItems.some((it) => it.isOversized);

    const { shippingCost, parcelType, effectiveWeightKg } = calculateSmartShipping(
      totalOrderWeightKg,
      hasOversized,
      country
    );

    const itemsSubtotalGbp =
      Math.round(processedItems.reduce((acc, curr) => acc + curr.itemTotalGbp, 0) * 100) / 100;
    const finalTotalGbp = Math.round((itemsSubtotalGbp + shippingCost) * 100) / 100;

    // Чистий прибуток компанії (+25% від бази Ex. VAT)
    const totalProfitGbp =
      Math.round(
        processedItems.reduce(
          (acc, curr) => acc + (curr.clientUnitPriceGbp - curr.supplierBuyPriceGbp) * curr.quantity,
          0
        ) * 100
      ) / 100;

    const invNum = invoiceNumber || `NLG-PI-${Math.floor(100000 + Math.random() * 900000)}`;
    const invoiceDate = new Date().toISOString().split('T')[0];

    // Відправка даних у Make.com / Xero / Google Sheets
    const webhookUrl =
      process.env.MAKE_WEBHOOK_URL ||
      process.env.GOOGLE_SHEET_URL ||
      process.env.GOOGLE_SHEETS_WEBHOOK_URL;

    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'proforma_invoice_created',
            invoiceNumber: invNum,
            invoiceDate,
            taxStatus: '0% UK Export VAT (Zero-Rated Income)',
            accountCode: '200 - Sales',
            contact,
            country,
            totalItems: processedItems.length,
            actualWeightKg: totalOrderWeightKg,
            volumetricWeightKg: effectiveWeightKg,
            shippingCostGbp: shippingCost,
            parcelType,
            itemsSubtotalGbp,
            totalAmountGbp: finalTotalGbp,
            estimatedProfitGbp: totalProfitGbp,
            items: processedItems,
            specificationSummary: processedItems
              .map(
                (it) =>
                  `${it.partNumber} (${it.partTitle}) x${it.quantity} = £${it.itemTotalGbp.toFixed(2)}`
              )
              .join('; '),
          }),
        });
      } catch (err) {
        console.error('Webhook sync error:', err);
      }
    }

    // Миттєвий розширений звіт у Telegram
    const tgToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChatId = process.env.TELEGRAM_CHAT_ID;

    if (tgToken && tgChatId) {
      const lines = processedItems
        .map(
          (it, idx) =>
            `${idx + 1}. <b>${it.partTitle}</b> [<code>${it.partNumber}</code>]\n` +
            `   • Клієнту: ${it.quantity} шт × <b>£${it.clientUnitPriceGbp.toFixed(2)}</b> = £${it.itemTotalGbp.toFixed(2)}\n` +
            `   • Прайс донора: £${it.supplierRawPriceGbp.toFixed(2)} (${it.hasVat ? 'Inc. 20% VAT' : 'Ex. VAT'})\n` +
            `   • Чиста база (собівартість): <b>£${it.supplierBuyPriceGbp.toFixed(2)}</b>\n` +
            `   🏪 <b>Де купити:</b> <a href="${it.storeUrl}"><b>${it.storeName}</b> 🔗</a>`
        )
        .join('\n\n');

      const tgMsg =
        `⚡️ <b>PROFORMA INVOICE: ${invNum}</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `👤 <b>Клієнт:</b> ${contact || 'Не вказано'} | 🌍 <b>Країна:</b> ${country}\n` +
        `📋 <b>Специфікація (${processedItems.length} поз.):</b>\n\n` +
        `${lines}\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `📦 <b>Логістика:</b> ${parcelType}\n` +
        `💵 <b>Запчастини:</b> £${itemsSubtotalGbp.toFixed(2)} | 🚚 <b>Доставка:</b> £${shippingCost.toFixed(2)}\n` +
        `💰 <b>РАЗОМ ДО СПЛАТИ (0% VAT):</b> <b>£${finalTotalGbp.toFixed(2)}</b>\n` +
        `🔥 <b>ЧИСТИЙ ПРИБУТОК (+25%):</b> <b>£${totalProfitGbp.toFixed(2)}</b>`;

      try {
        await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: tgChatId,
            text: tgMsg,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
          }),
        });
      } catch (err) {
        console.error('Telegram send error:', err);
      }
    }

    return NextResponse.json({
      found: true,
      status: 'success',
      invoiceNumber: invNum,
      invoiceDate,
      taxNote: 'UK EXPORT — 0% VAT ZERO-RATED',
      items: processedItems,
      itemsSubtotal: itemsSubtotalGbp,
      shippingCost,
      parcelType,
      parcelTypeLabel: parcelType,
      totalWeightKg: totalOrderWeightKg,
      effectiveWeightKg,
      total: finalTotalGbp,
      estimatedProfitGbp: totalProfitGbp,
      country,
      contact,
    });
  } catch (error: any) {
    console.error('RFQ API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
