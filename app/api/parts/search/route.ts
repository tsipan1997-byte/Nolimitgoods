export const dynamic = 'force-dynamic';
export const maxDuration = 60;

import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import prisma from '@/lib/prisma';

function cleanPartNumber(pn: string): string {
  return pn.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().trim();
}

interface SourcedOffer {
  storeName: string;
  storeUrl: string;
  title: string;
  rawPriceGbp: number;
  hasVat: boolean;
  netBaseGbp: number;
  clientPriceGbp: number;
  weightKg: number;
}

interface SupplierOffer {
  vendor: string;
  country: string;
  title: string;
  originalPrice: number;
  originalCurrency: string;
  priceGbp: number;
  stock: boolean;
  link: string;
}

const RATES_TO_GBP: Record<string, number> = {
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

// ==========================================
// 1. БАЗА ТОЧНИХ ЦІН ІЗ РЕАЛЬНИХ ІНВОЙСІВ ТА СКЛАДІВ UK
// ==========================================
const EXACT_SOURCED_OFFERS: Record<string, SourcedOffer> = {
  // JCB PARKER (3CX / 4CX)
  '332Y3163': {
    storeName: 'JCB UK Central Depot',
    storeUrl: 'https://vicaryplant.co.uk/search?q=332/Y3163',
    title: 'JCB Parker Main Hydraulic Gear Pump 3CX/4CX (332/Y3163)',
    rawPriceGbp: 1100.0,
    hasVat: false,
    netBaseGbp: 880.0,
    clientPriceGbp: 1100.0,
    weightKg: 18.5,
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
  },

  // CASE IH (NLG-PI-365554)
  '87643472': {
    storeName: 'Case IH / CNH Europe Hub',
    storeUrl: 'https://agrilineproducts.com/case-international',
    title: 'Case IH AccuBoom Boom Control Unit Module (87643472)',
    rawPriceGbp: 2800.0,
    hasVat: false,
    netBaseGbp: 2240.0,
    clientPriceGbp: 2800.0,
    weightKg: 4.5,
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
  },

  // CATERPILLAR CAB (NLG-PI-339006)
  '2811196': {
    storeName: 'Finning CAT UK Logistics',
    storeUrl: 'https://parts.cat.com',
    title: 'Caterpillar Operator Cab Door Shell Assembly (281-1196)',
    rawPriceGbp: 1063.75,
    hasVat: false,
    netBaseGbp: 851.0,
    clientPriceGbp: 1063.75,
    weightKg: 22.0,
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
  },
};

// ==========================================
// 2. СПОВІЩЕННЯ В TELEGRAM
// ==========================================
async function sendTelegramAlert(data: {
  oem: string;
  title: string;
  supplier: string;
  grossPriceGbp: number;
  clientPriceGbp: number;
  effectiveBuyCostGbp: number;
  profitGbp: number;
  fromCache: boolean;
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return;

  const msg =
    `🔍 <b>ПОШУК ДЕТАЛІ (ХАБИ UK/ЄС): ${data.oem}</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `📦 <b>Найменування:</b> ${data.title}\n` +
    `🏢 <b>Постачальник:</b> ${data.supplier} ${data.fromCache ? '(з бази)' : '(живий пошук)'}\n` +
    `💵 <b>Прайс вітрини (Gross):</b> £${data.grossPriceGbp.toFixed(2)}\n` +
    `🏷 <b>Ціна клієнту (+25%):</b> <b>£${data.clientPriceGbp.toFixed(2)}</b>\n` +
    `📉 <b>Собівартість Ex. VAT:</b> £${data.effectiveBuyCostGbp.toFixed(2)}\n` +
    `💰 <b>Чистий прибуток:</b> <b>£${data.profitGbp.toFixed(2)}</b> 🔥\n` +
    `📍 <b>Маршрут:</b> Coventry Hub -> Україна`;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: 'HTML' }),
    });
  } catch (err) {
    console.error('Telegram notification error:', err);
  }
}

// ==========================================
// 3. ПОШУК ПО 20 ХАБАХ
// ==========================================
function getTier1Tasks(cleanOem: string) {
  return [
    async (): Promise<SupplierOffer | null> => {
      try {
        const url = `https://www.inlinefilters.co.uk/index.php?main_page=advanced_search_result&search_in_description=1&keyword=${cleanOem}`;
        const res = await fetch(url, { headers: HEADERS, next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const $ = cheerio.load(await res.text());
        const title = $('.productListing-heading, .productName, h1').first().text().trim();
        const priceStr = $('.productSpecialPrice, .productBasePrice, .normalprice').first().text().trim();
        const match = priceStr.match(/[\d,.]+/);
        if (match) {
          const price = parseFloat(match[0].replace(',', ''));
          return { vendor: 'InlineFilters UK', country: 'UK', title: title || `Filter OEM ${cleanOem}`, originalPrice: price, originalCurrency: 'GBP', priceGbp: price, stock: true, link: url };
        }
      } catch (e) {}
      return null;
    },
    async (): Promise<SupplierOffer | null> => {
      try {
        const url = `https://www.malpasonline.co.uk/search?q=${cleanOem}`;
        const res = await fetch(url, { headers: HEADERS, next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const $ = cheerio.load(await res.text());
        const title = $('.product-title, .title, h1').first().text().trim();
        const priceStr = $('.price, .money, .product-price').first().text().trim();
        const match = priceStr.match(/[\d,.]+/);
        if (match) {
          const price = parseFloat(match[0].replace(',', ''));
          return { vendor: 'MalpasOnline Heavy Parts', country: 'UK', title: title || `Spares ${cleanOem}`, originalPrice: price, originalCurrency: 'GBP', priceGbp: price, stock: true, link: url };
        }
      } catch (e) {}
      return null;
    },
    async (): Promise<SupplierOffer | null> => {
      try {
        const url = `https://www.wismet.de/?suchbegriff=${cleanOem}`;
        const res = await fetch(url, { headers: HEADERS, next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const $ = cheerio.load(await res.text());
        const title = $('.item-title, h1, .product--title').first().text().trim();
        const priceStr = $('.price--default, .product--price').first().text().trim();
        const match = priceStr.match(/[\d,.]+/);
        if (match) {
          const priceEur = parseFloat(match[0].replace(',', '.'));
          return { vendor: 'Wismet Filtration DE', country: 'Germany', title: title || `Wismet Cross ${cleanOem}`, originalPrice: priceEur, originalCurrency: 'EUR', priceGbp: Number((priceEur * RATES_TO_GBP.EUR).toFixed(2)), stock: true, link: url };
        }
      } catch (e) {}
      return null;
    },
    async (): Promise<SupplierOffer | null> => {
      try {
        const url = `https://diggerpartsuk.co.uk/search?q=${cleanOem}`;
        const res = await fetch(url, { headers: HEADERS, next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const $ = cheerio.load(await res.text());
        const title = $('.product-item__title, h1').first().text().trim();
        const priceStr = $('.price, .price-item--regular').first().text().trim();
        const match = priceStr.match(/[\d,.]+/);
        if (match) {
          const price = parseFloat(match[0].replace(',', ''));
          return { vendor: 'DiggerParts UK', country: 'UK', title: title || `Plant Part ${cleanOem}`, originalPrice: price, originalCurrency: 'GBP', priceGbp: price, stock: true, link: url };
        }
      } catch (e) {}
      return null;
    },
    async (): Promise<SupplierOffer | null> => {
      try {
        const url = `https://vicaryplant.co.uk/search?q=${cleanOem}`;
        const res = await fetch(url, { headers: HEADERS, next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const $ = cheerio.load(await res.text());
        const title = $('.product-item__title, h1').first().text().trim();
        const priceStr = $('.price, .money').first().text().trim();
        const match = priceStr.match(/[\d,.]+/);
        if (match) {
          const price = parseFloat(match[0].replace(',', ''));
          return { vendor: 'Vicary JCB Plant UK', country: 'UK', title: title || `JCB Part ${cleanOem}`, originalPrice: price, originalCurrency: 'GBP', priceGbp: price, stock: true, link: url };
        }
      } catch (e) {}
      return null;
    },
  ];
}

// ==========================================
// 4. GET ROUTE (Швидкий пошук за 1 артикулом)
// ==========================================
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawOem = searchParams.get('oem');

  if (!rawOem) {
    return new NextResponse(
      JSON.stringify({ error: 'Вкажіть каталожний номер: ?oem=НОМЕР' }),
      { status: 400, headers: { 'content-type': 'application/json; charset=utf-8' } }
    );
  }

  const cleanOem = cleanPartNumber(rawOem);

  // Перевірка інвойсів та локальної бази
  if (EXACT_SOURCED_OFFERS[cleanOem]) {
    const offer = EXACT_SOURCED_OFFERS[cleanOem];
    const profit = Number((offer.clientPriceGbp - offer.netBaseGbp).toFixed(2));

    await sendTelegramAlert({
      oem: cleanOem,
      title: offer.title,
      supplier: offer.storeName,
      grossPriceGbp: offer.rawPriceGbp,
      clientPriceGbp: offer.clientPriceGbp,
      effectiveBuyCostGbp: offer.netBaseGbp,
      profitGbp: profit,
      fromCache: true,
    });

    return new NextResponse(
      JSON.stringify({
        found: true,
        fromCache: true,
        oem: cleanOem,
        title: offer.title,
        cheapestSupplier: offer.storeName,
        supplierCountry: 'UK Hub',
        grossPriceGbp: offer.rawPriceGbp,
        clientPriceGbp: offer.clientPriceGbp,
        effectiveBuyCostGbp: offer.netBaseGbp,
        totalProfitGbp: profit,
        currency: 'GBP',
        hubLocation: 'Coventry Hub, UK',
        deliveryTransit: '5-8 робочих днів до України',
        inStock: true,
        updatedAt: new Date().toISOString(),
      }),
      { status: 200, headers: { 'content-type': 'application/json; charset=utf-8' } }
    );
  }

  // Перевірка кешу Prisma
  try {
    const cached = await prisma.cachedPart.findUnique({
      where: { oem: cleanOem },
    });

    if (cached) {
      const now = new Date().getTime();
      const cachedTime = new Date(cached.updatedAt).getTime();
      if ((now - cachedTime) / (1000 * 60 * 60) < 24) {
        const clientPrice = cached.finalPriceGbp;
        const effectiveCost = cached.supplierPriceGbp;
        const profit = Number((clientPrice - effectiveCost).toFixed(2));

        await sendTelegramAlert({
          oem: cached.oem,
          title: cached.title,
          supplier: cached.supplierName,
          grossPriceGbp: cached.supplierPriceGbp,
          clientPriceGbp: clientPrice,
          effectiveBuyCostGbp: effectiveCost,
          profitGbp: profit,
          fromCache: true,
        });

        return new NextResponse(
          JSON.stringify({
            found: true,
            fromCache: true,
            oem: cached.oem,
            title: cached.title,
            cheapestSupplier: cached.supplierName,
            supplierCountry: cached.supplierCountry,
            grossPriceGbp: cached.supplierPriceGbp,
            clientPriceGbp: clientPrice,
            effectiveBuyCostGbp: effectiveCost,
            totalProfitGbp: profit,
            currency: 'GBP',
            hubLocation: cached.hubLocation,
            deliveryTransit: cached.deliveryTransit,
            inStock: cached.inStock,
            updatedAt: cached.updatedAt,
          }),
          { status: 200, headers: { 'content-type': 'application/json; charset=utf-8' } }
        );
      }
    }
  } catch (dbErr) {
    console.warn('Prisma lookup bypassed:', dbErr);
  }

  // Живий пошук у хабах
  const tasks = getTier1Tasks(cleanOem);
  const settled = await Promise.allSettled(tasks.map((fn) => fn()));
  const validOffers: SupplierOffer[] = [];

  for (const item of settled) {
    if (item.status === 'fulfilled' && item.value && item.value.priceGbp > 0) {
      validOffers.push(item.value);
    }
  }

  if (validOffers.length === 0) {
    return new NextResponse(
      JSON.stringify({
        found: false,
        oem: cleanOem,
        message: 'Позицію не знайдено на складах. Оформіть запит на ручний підбір інженеру.',
      }),
      { status: 200, headers: { 'content-type': 'application/json; charset=utf-8' } }
    );
  }

  validOffers.sort((a, b) => a.priceGbp - b.priceGbp);
  const bestOffer = validOffers[0];

  const grossPriceGbp = bestOffer.priceGbp;
  const clientPriceGbp = Number((grossPriceGbp * 1.25).toFixed(2));
  const effectiveBuyCostGbp = grossPriceGbp;
  const totalProfitGbp = Number((clientPriceGbp - effectiveBuyCostGbp).toFixed(2));

  // Збереження в Prisma
  try {
    await prisma.cachedPart.upsert({
      where: { oem: cleanOem },
      update: {
        title: bestOffer.title,
        supplierName: bestOffer.vendor,
        supplierCountry: bestOffer.country,
        supplierPriceGbp: grossPriceGbp,
        finalPriceGbp: clientPriceGbp,
        inStock: true,
      },
      create: {
        oem: cleanOem,
        title: bestOffer.title,
        supplierName: bestOffer.vendor,
        supplierCountry: bestOffer.country,
        supplierPriceGbp: grossPriceGbp,
        finalPriceGbp: clientPriceGbp,
        hubLocation: 'Coventry Hub, UK',
        deliveryTransit: '5-8 робочих днів до України',
        inStock: true,
      },
    });
  } catch (saveErr) {
    console.error('Prisma upsert error:', saveErr);
  }

  await sendTelegramAlert({
    oem: cleanOem,
    title: bestOffer.title,
    supplier: bestOffer.vendor,
    grossPriceGbp,
    clientPriceGbp,
    effectiveBuyCostGbp,
    profitGbp: totalProfitGbp,
    fromCache: false,
  });

  return new NextResponse(
    JSON.stringify({
      found: true,
      fromCache: false,
      oem: cleanOem,
      title: bestOffer.title,
      cheapestSupplier: bestOffer.vendor,
      supplierCountry: bestOffer.country,
      grossPriceGbp,
      clientPriceGbp,
      effectiveBuyCostGbp,
      totalProfitGbp,
      currency: 'GBP',
      hubLocation: 'Coventry Hub, UK',
      deliveryTransit: '5-8 робочих днів до України',
      inStock: true,
      activeOffersFound: validOffers.length,
      updatedAt: new Date().toISOString(),
    }),
    { status: 200, headers: { 'content-type': 'application/json; charset=utf-8' } }
  );
}

// ==========================================
// 5. POST ROUTE (Прорахунок кошика / форми специфікацій)
// ==========================================
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.website_hp) {
      return NextResponse.json({ success: true, status: 'filtered' });
    }

    const { items = [], country = 'Україна', contact = '', invoiceNumber = '' } = body;

    const rawItems: any[] =
      Array.isArray(items) && items.length > 0
        ? items
        : [{ partNumber: body.partNumber || '', machineModel: body.machineModel || '', quantity: body.quantity || 1 }];

    const validItems = rawItems
      .slice(0, 10)
      .filter((it) => String(it.partNumber || '').trim().length > 0)
      .map((it) => ({
        partNumber: cleanPartNumber(String(it.partNumber)),
        machineModel: String(it.machineModel || 'Heavy Equipment').trim(),
        quantity: Math.max(1, Number(it.quantity) || 1),
      }));

    if (validItems.length === 0) {
      return NextResponse.json({ error: 'Вкажіть хоча б один каталожний номер' }, { status: 400 });
    }

    const tgToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChatId = process.env.TELEGRAM_CHAT_ID;
    const googleSheetUrl =
      process.env.GOOGLE_SHEET_URL ||
      process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
      process.env.MAKE_WEBHOOK_URL;

    const processedItems = await Promise.all(
      validItems.map(async (item) => {
        let bestOffer: SourcedOffer | null = null;

        // 1. ПЕРЕВІРКА В БАЗІ ІНВОЙСІВ
        if (EXACT_SOURCED_OFFERS[item.partNumber]) {
          bestOffer = EXACT_SOURCED_OFFERS[item.partNumber];
        }

        // 2. ПАРСИНГ ХАБІВ
        if (!bestOffer) {
          const tasks = getTier1Tasks(item.partNumber);
          const settled = await Promise.allSettled(tasks.map((fn) => fn()));
          const validOffers: SourcedOffer[] = [];

          for (const res of settled) {
            if (res.status === 'fulfilled' && res.value && res.value.priceGbp > 0) {
              const val = res.value;
              validOffers.push({
                storeName: val.vendor,
                storeUrl: val.link,
                title: val.title,
                rawPriceGbp: val.priceGbp,
                hasVat: false,
                netBaseGbp: val.priceGbp,
                clientPriceGbp: Math.round(val.priceGbp * 1.25 * 100) / 100,
                weightKg: 2.0,
              });
            }
          }

          if (validOffers.length > 0) {
            validOffers.sort((a, b) => a.netBaseGbp - b.netBaseGbp);
            bestOffer = validOffers[0];
          }
        }

        // 3. FALLBACK
        if (!bestOffer) {
          const fallbackNet = 45.0;
          bestOffer = {
            storeName: 'UK Central Logistics Hub',
            storeUrl: `https://www.google.com/search?q=${encodeURIComponent('UK OEM ' + item.partNumber)}`,
            title: `${item.machineModel} OEM ${item.partNumber}`,
            rawPriceGbp: 56.25,
            hasVat: false,
            netBaseGbp: fallbackNet,
            clientPriceGbp: Math.round(fallbackNet * 1.25 * 100) / 100,
            weightKg: 2.0,
          };
        }

        const totalWeightKg = Math.round(bestOffer.weightKg * item.quantity * 10) / 10;
        const itemTotalGbp = Math.round(bestOffer.clientPriceGbp * item.quantity * 100) / 100;

        return {
          partNumber: item.partNumber,
          machineModel: item.machineModel,
          quantity: item.quantity,
          partTitle: bestOffer.title,
          supplierRawPriceGbp: bestOffer.rawPriceGbp,
          supplierBuyPriceGbp: bestOffer.netBaseGbp,
          clientUnitPriceGbp: bestOffer.clientPriceGbp,
          unitWeightKg: bestOffer.weightKg,
          totalWeightKg,
          itemTotalGbp,
          storeName: bestOffer.storeName,
          storeUrl: bestOffer.storeUrl,
        };
      })
    );

    // Розрахунок доставки Nova Post
    const totalOrderWeightKg = Math.round(
      processedItems.reduce((acc, curr) => acc + curr.totalWeightKg, 0) * 10
    ) / 10;

    let shippingCost = 27;
    let parcelType = `Nova Post Small (${totalOrderWeightKg} кг)`;

    if (totalOrderWeightKg <= 2.0) {
      shippingCost = 27;
      parcelType = `Nova Post Small (до 2 кг • ${totalOrderWeightKg} кг)`;
    } else if (totalOrderWeightKg <= 10.0) {
      shippingCost = 41;
      parcelType = `Nova Post Medium (до 10 кг • ${totalOrderWeightKg} кг)`;
    } else if (totalOrderWeightKg <= 30.0) {
      shippingCost = 68;
      parcelType = `Nova Post Large (консолідований ящик до 30 кг • ${totalOrderWeightKg} кг)`;
    } else if (totalOrderWeightKg <= 60.0) {
      shippingCost = 115;
      parcelType = `Nova Post Heavy (консолідація 2 ящики • ${totalOrderWeightKg} кг)`;
    } else {
      shippingCost = 165;
      parcelType = `Pallet Freight (${totalOrderWeightKg} кг)`;
    }

    const itemsSubtotalGbp = Math.round(
      processedItems.reduce((acc, curr) => acc + curr.itemTotalGbp, 0) * 100
    ) / 100;
    const finalTotalGbp = Math.round((itemsSubtotalGbp + shippingCost) * 100) / 100;
    const totalProfitGbp = Math.round(
      processedItems.reduce(
        (acc, curr) => acc + (curr.clientUnitPriceGbp - curr.supplierBuyPriceGbp) * curr.quantity,
        0
      ) * 100
    ) / 100;

    const invNum = invoiceNumber || `NLG-PI-${Math.floor(100000 + Math.random() * 900000)}`;

    // Запис у Google Таблицю
    if (googleSheetUrl) {
      try {
        await fetch(googleSheetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            event: 'search_quote',
            invoiceNumber: invNum,
            date: new Date().toISOString(),
            contact,
            country,
            totalItems: processedItems.length,
            totalWeightKg: totalOrderWeightKg,
            shippingCostGbp: shippingCost,
            itemsSubtotalGbp,
            totalAmountGbp: finalTotalGbp,
            estimatedProfitGbp: totalProfitGbp,
            specificationSummary: processedItems
              .map((it) => `${it.partNumber} [${it.machineModel}] x${it.quantity} (£${it.itemTotalGbp.toFixed(2)})`)
              .join('; '),
          }),
          redirect: 'follow',
        });
      } catch (err) {}
    }

    // Сповіщення в Telegram
    if (tgToken && tgChatId) {
      const lines = processedItems
        .map(
          (it, idx) =>
            `${idx + 1}. <b>${it.partTitle}</b>\n` +
            `   • Артикул: <code>${it.partNumber}</code>\n` +
            `   • ${it.quantity} шт × £${it.clientUnitPriceGbp.toFixed(2)} (Закупка: £${it.supplierBuyPriceGbp.toFixed(2)})\n` +
            `   🏪 <b>Хаб:</b> <a href="${it.storeUrl}"><b>${it.storeName}</b> 🔗</a>`
        )
        .join('\n\n');

      const tgMsg =
        `⚡️ <b>ШВИДКИЙ ПОШУК / ПРОРАХУНОК: ${invNum}</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `📋 <b>Специфікація (${processedItems.length} поз.):</b>\n\n` +
        `${lines}\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `📦 <b>Вага:</b> ${totalOrderWeightKg} кг | 🚚 <b>Доставка:</b> £${shippingCost} (${parcelType})\n` +
        `👤 <b>Клієнт:</b> ${contact || 'Не вказано'} | 📍 <b>Країна:</b> ${country}\n` +
        `💰 <b>РАЗОМ ДО СПЛАТИ:</b> <b>£${finalTotalGbp.toFixed(2)}</b> (Прибуток: £${totalProfitGbp.toFixed(2)}) 🔥`;

      try {
        await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: tgChatId, text: tgMsg, parse_mode: 'HTML', disable_web_page_preview: true }),
        });
      } catch (err) {}
    }

    return NextResponse.json({
      found: true,
      status: 'success',
      items: processedItems,
      itemsSubtotal: itemsSubtotalGbp,
      shippingCost,
      parcelType,
      totalWeightKg: totalOrderWeightKg,
      total: finalTotalGbp,
      invoiceNumber: invNum,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
