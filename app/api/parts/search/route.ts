export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import prisma from '@/lib/prisma';

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

// --- ФУНКЦІЯ МИТТЄВОГО СПОВІЩЕННЯ В TELEGRAM ---
async function sendTelegramAlert(data: {
  oem: string;
  title: string;
  supplier: string;
  supplierPriceGbp: number;
  finalPriceGbp: number;
  fromCache: boolean;
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('Telegram credentials not configured in Vercel environment');
    return;
  }

  const message = `🔔 <b>Новий пошук на NoLimitGoods!</b>\n\n` +
    `⚙️ <b>OEM:</b> <code>${data.oem}</code>\n` +
    `📦 <b>Деталь:</b> ${data.title}\n` +
    `🏢 <b>Склад:</b> ${data.supplier} ${data.fromCache ? '(з бази)' : '(живий парсинг)'}\n` +
    `📥 <b>Собівартість:</b> £${data.supplierPriceGbp.toFixed(2)}\n` +
    `💰 <b>Ціна для клієнта:</b> £${data.finalPriceGbp.toFixed(2)}\n` +
    `📈 <b>Ваш заробіток:</b> £${(data.finalPriceGbp - data.supplierPriceGbp - 6.5).toFixed(2)}\n` +
    `📍 <b>Хаб:</b> Coventry, UK`;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });
  } catch (err) {
    console.error('Failed to send Telegram alert:', err);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawOem = searchParams.get('oem');

  if (!rawOem) {
    return new NextResponse(
      JSON.stringify({ error: 'Вкажіть каталожний номер: ?oem=НОМЕР' }),
      { status: 400, headers: { 'content-type': 'application/json; charset=utf-8' } }
    );
  }

  const cleanOem = rawOem.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

  // 1. ПЕРЕВІРКА КЕШУ В БАЗІ ДАНИХ PRISMA
  try {
    const cached = await prisma.cachedPart.findUnique({
      where: { oem: cleanOem },
    });

    if (cached) {
      const now = new Date().getTime();
      const cachedTime = new Date(cached.updatedAt).getTime();
      const diffHours = (now - cachedTime) / (1000 * 60 * 60);

      if (diffHours < 24) {
        // Шлемо сповіщення в Telegram при запиті з кешу
        await sendTelegramAlert({
          oem: cached.oem,
          title: cached.title,
          supplier: cached.supplierName,
          supplierPriceGbp: cached.supplierPriceGbp,
          finalPriceGbp: cached.finalPriceGbp,
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
            supplierPriceGbp: cached.supplierPriceGbp,
            finalPriceGbp: cached.finalPriceGbp,
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
    console.warn('DB lookup skipped:', dbErr);
  }

  // 2. ПАРАЛЕЛЬНИЙ ПОШУК ПО 10 ХАБАХ ЄВРОПИ ТА ВЕЛИКОБРИТАНІЇ
  const searchHeaders = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept-Language': 'en-GB,en;q=0.9,pl;q=0.8,de;q=0.7',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  };

  const fetchTasks = [
    // 1. InlineFilters UK/EU
    async (): Promise<SupplierOffer | null> => {
      try {
        const res = await fetch(
          `https://www.inlinefilters.co.uk/index.php?main_page=advanced_search_result&search_in_description=1&keyword=${cleanOem}`,
          { headers: searchHeaders, next: { revalidate: 3600 } }
        );
        if (!res.ok) return null;
        const html = await res.text();
        const $ = cheerio.load(html);
        const title = $('.productListing-heading, .productName, h1').first().text().trim();
        const priceStr = $('.productSpecialPrice, .productBasePrice, .normalprice').first().text().trim();
        const match = priceStr.match(/[\d,.]+/);
        if (match) {
          const price = parseFloat(match[0].replace(',', ''));
          return {
            vendor: 'InlineFilters UK/EU',
            country: 'UK/EU',
            title: title || `Фільтр OEM ${cleanOem}`,
            originalPrice: price,
            originalCurrency: 'GBP',
            priceGbp: price,
            stock: true,
            link: `https://www.inlinefilters.co.uk/index.php?main_page=advanced_search_result&keyword=${cleanOem}`,
          };
        }
      } catch (e) {}
      return null;
    },

    // 2. MalpasOnline UK/EU
    async (): Promise<SupplierOffer | null> => {
      try {
        const res = await fetch(`https://www.malpasonline.co.uk/search?q=${cleanOem}`, {
          headers: searchHeaders,
          next: { revalidate: 3600 },
        });
        if (!res.ok) return null;
        const html = await res.text();
        const $ = cheerio.load(html);
        const title = $('.product-title, .title, h1').first().text().trim();
        const priceStr = $('.price, .money, .product-price').first().text().trim();
        const match = priceStr.match(/[\d,.]+/);
        if (match) {
          const price = parseFloat(match[0].replace(',', ''));
          return {
            vendor: 'MalpasOnline Heavy Parts',
            country: 'UK/EU',
            title: title || `Деталь спецтехніки ${cleanOem}`,
            originalPrice: price,
            originalCurrency: 'GBP',
            priceGbp: price,
            stock: true,
            link: `https://www.malpasonline.co.uk/search?q=${cleanOem}`,
          };
        }
      } catch (e) {}
      return null;
    },

    // 3. Wismet Filter Hub DE
    async (): Promise<SupplierOffer | null> => {
      try {
        const res = await fetch(`https://www.wismet.de/?suchbegriff=${cleanOem}`, {
          headers: searchHeaders,
          next: { revalidate: 3600 },
        });
        if (!res.ok) return null;
        const html = await res.text();
        const $ = cheerio.load(html);
        const title = $('.item-title, h1, .product--title').first().text().trim();
        const priceStr = $('.price--default, .product--price').first().text().trim();
        const match = priceStr.match(/[\d,.]+/);
        if (match) {
          const priceEur = parseFloat(match[0].replace(',', '.'));
          return {
            vendor: 'Wismet Filtration DE',
            country: 'Germany',
            title: title || `Wismet Cross OEM ${cleanOem}`,
            originalPrice: priceEur,
            originalCurrency: 'EUR',
            priceGbp: Number((priceEur * RATES_TO_GBP.EUR).toFixed(2)),
            stock: true,
            link: `https://www.wismet.de/?suchbegriff=${cleanOem}`,
          };
        }
      } catch (e) {}
      return null;
    },

    // 4. Digger Parts UK
    async (): Promise<SupplierOffer | null> => {
      try {
        const res = await fetch(`https://diggerpartsuk.co.uk/search?q=${cleanOem}`, {
          headers: searchHeaders,
          next: { revalidate: 3600 },
        });
        if (!res.ok) return null;
        const html = await res.text();
        const $ = cheerio.load(html);
        const title = $('.product-item__title, h1').first().text().trim();
        const priceStr = $('.price, .price-item--regular').first().text().trim();
        const match = priceStr.match(/[\d,.]+/);
        if (match) {
          const price = parseFloat(match[0].replace(',', ''));
          return {
            vendor: 'DiggerParts Plant Direct',
            country: 'UK',
            title: title || `Вузол екскаватора ${cleanOem}`,
            originalPrice: price,
            originalCurrency: 'GBP',
            priceGbp: price,
            stock: true,
            link: `https://diggerpartsuk.co.uk/search?q=${cleanOem}`,
          };
        }
      } catch (e) {}
      return null;
    },

    // 5. Allegro Heavy Machinery PL
    async (): Promise<SupplierOffer | null> => {
      try {
        const res = await fetch(
          `https://allegro.pl/kategoria/czesci-do-maszyn-czesci-do-maszyn-budowlanych-254146?string=${cleanOem}`,
          { headers: searchHeaders, next: { revalidate: 1800 } }
        );
        if (!res.ok) return null;
        const html = await res.text();
        const $ = cheerio.load(html);
        const title = $('h2, [data-analytics-clickable-element="true"]').first().text().trim();
        const priceStr = $('[data-box-name="Items"] span, .fee').first().text().trim();
        const match = priceStr.match(/[\d,.]+/);
        if (match) {
          const pricePln = parseFloat(match[0].replace(/\s/g, '').replace(',', '.'));
          return {
            vendor: 'Allegro Machinery PL',
            country: 'Poland',
            title: title || `Запчастина OEM ${cleanOem}`,
            originalPrice: pricePln,
            originalCurrency: 'PLN',
            priceGbp: Number((pricePln * RATES_TO_GBP.PLN).toFixed(2)),
            stock: true,
            link: `https://allegro.pl/listing?string=${cleanOem}`,
          };
        }
      } catch (e) {}
      return null;
    },

    // 6. UrParts EU
    async (): Promise<SupplierOffer | null> => {
      try {
        const res = await fetch(`https://www.urparts.com/index.cfm/page/parts?search=${cleanOem}`, {
          headers: searchHeaders,
          next: { revalidate: 3600 },
        });
        if (!res.ok) return null;
        const html = await res.text();
        const $ = cheerio.load(html);
        const title = $('.part-result, .part-name').first().text().trim();
        if (title || html.includes(cleanOem)) {
          return {
            vendor: 'UrParts EU Network',
            country: 'Europe',
            title: title || `Machinery Spares ${cleanOem}`,
            originalPrice: 45.0,
            originalCurrency: 'EUR',
            priceGbp: Number((45.0 * RATES_TO_GBP.EUR).toFixed(2)),
            stock: true,
            link: `https://www.urparts.com/`,
          };
        }
      } catch (e) {}
      return null;
    },

    // 7. Bepco Parts
    async (): Promise<SupplierOffer | null> => {
      try {
        const res = await fetch(`https://www.bepcoparts.com/en-gb/search?query=${cleanOem}`, {
          headers: searchHeaders,
          next: { revalidate: 3600 },
        });
        if (!res.ok) return null;
        const html = await res.text();
        const $ = cheerio.load(html);
        const title = $('.product-title, h1').first().text().trim();
        const priceStr = $('.price-tag').first().text().trim();
        const match = priceStr.match(/[\d,.]+/);
        if (match) {
          const price = parseFloat(match[0].replace(',', ''));
          return {
            vendor: 'Bepco Heavy Tractor Parts',
            country: 'EU/UK',
            title: title || `Компонент двигуна ${cleanOem}`,
            originalPrice: price,
            originalCurrency: 'GBP',
            priceGbp: price,
            stock: true,
            link: `https://www.bepcoparts.com/`,
          };
        }
      } catch (e) {}
      return null;
    },

    // 8. Hydraulic Parts Direct
    async (): Promise<SupplierOffer | null> => {
      try {
        const res = await fetch(`https://hydraulicpartsuk.com/?s=${cleanOem}&post_type=product`, {
          headers: searchHeaders,
          next: { revalidate: 3600 },
        });
        if (!res.ok) return null;
        const html = await res.text();
        const $ = cheerio.load(html);
        const title = $('.woocommerce-loop-product__title, h1').first().text().trim();
        const priceStr = $('.woocommerce-Price-amount, .price').first().text().trim();
        const match = priceStr.match(/[\d,.]+/);
        if (match) {
          const price = parseFloat(match[0].replace(',', ''));
          return {
            vendor: 'Hydraulic Spares Hub',
            country: 'EU/UK',
            title: title || `Гідравлічний клапан/насос ${cleanOem}`,
            originalPrice: price,
            originalCurrency: 'GBP',
            priceGbp: price,
            stock: true,
            link: `https://hydraulicpartsuk.com/`,
          };
        }
      } catch (e) {}
      return null;
    },

    // 9. Vicary Plant JCB
    async (): Promise<SupplierOffer | null> => {
      try {
        const res = await fetch(`https://vicaryplant.co.uk/search?q=${cleanOem}`, {
          headers: searchHeaders,
          next: { revalidate: 3600 },
        });
        if (!res.ok) return null;
        const html = await res.text();
        const $ = cheerio.load(html);
        const title = $('.product-item__title, h1').first().text().trim();
        const priceStr = $('.price, .money').first().text().trim();
        const match = priceStr.match(/[\d,.]+/);
        if (match) {
          const price = parseFloat(match[0].replace(',', ''));
          return {
            vendor: 'Vicary JCB Specialist',
            country: 'UK',
            title: title || `Запчастина JCB OEM ${cleanOem}`,
            originalPrice: price,
            originalCurrency: 'GBP',
            priceGbp: price,
            stock: true,
            link: `https://vicaryplant.co.uk/`,
          };
        }
      } catch (e) {}
      return null;
    },

    // 10. Kramp Parts
    async (): Promise<SupplierOffer | null> => {
      try {
        const res = await fetch(`https://www.kramp.com/shop-gb/en/search?text=${cleanOem}`, {
          headers: searchHeaders,
          next: { revalidate: 3600 },
        });
        if (!res.ok) return null;
        const html = await res.text();
        const $ = cheerio.load(html);
        const title = $('h1, .product-card__title').first().text().trim();
        const priceStr = $('.product-card__price, .price').first().text().trim();
        const match = priceStr.match(/[\d,.]+/);
        if (match) {
          const price = parseFloat(match[0].replace(',', ''));
          return {
            vendor: 'Kramp Agro/Plant EU',
            country: 'Netherlands',
            title: title || `Компонент Kramp ${cleanOem}`,
            originalPrice: price,
            originalCurrency: 'GBP',
            priceGbp: price,
            stock: true,
            link: `https://www.kramp.com/`,
          };
        }
      } catch (e) {}
      return null;
    },
  ];

  const settled = await Promise.allSettled(fetchTasks.map((fn) => fn()));
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
        message: 'Позицію не знайдено на 10 європейських складах. Оформіть запит менеджеру для індивідуального прорахунку.',
      }),
      { status: 200, headers: { 'content-type': 'application/json; charset=utf-8' } }
    );
  }

  // Обираємо мінімальну ціну
  validOffers.sort((a, b) => a.priceGbp - b.priceGbp);
  const bestOffer = validOffers[0];

  const transitFee = 6.5;
  const marginRatio = 1.25;
  const finalPriceGbp = Number(((bestOffer.priceGbp + transitFee) * marginRatio).toFixed(2));

  // 3. ЗБЕРЕЖЕННЯ В БАЗУ ДАНИХ
  try {
    await prisma.cachedPart.upsert({
      where: { oem: cleanOem },
      update: {
        title: bestOffer.title,
        supplierName: bestOffer.vendor,
        supplierCountry: bestOffer.country,
        supplierPriceGbp: bestOffer.priceGbp,
        finalPriceGbp: finalPriceGbp,
        inStock: true,
      },
      create: {
        oem: cleanOem,
        title: bestOffer.title,
        supplierName: bestOffer.vendor,
        supplierCountry: bestOffer.country,
        supplierPriceGbp: bestOffer.priceGbp,
        finalPriceGbp: finalPriceGbp,
        hubLocation: 'Coventry, UK / EU Transit',
        deliveryTransit: '5-8 робочих днів до України',
        inStock: true,
      },
    });
  } catch (saveErr) {
    console.error('Помилка збереження в базу:', saveErr);
  }

  // 4. ВІДПРАВКА СПОВІЩЕННЯ В TELEGRAM
  await sendTelegramAlert({
    oem: cleanOem,
    title: bestOffer.title,
    supplier: bestOffer.vendor,
    supplierPriceGbp: bestOffer.priceGbp,
    finalPriceGbp: finalPriceGbp,
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
      supplierPriceGbp: bestOffer.priceGbp,
      finalPriceGbp: finalPriceGbp,
      currency: 'GBP',
      hubLocation: 'Coventry, UK / EU Transit',
      deliveryTransit: '5-8 робочих днів до України',
      inStock: true,
      totalHubsScanned: 10,
      activeOffersFound: validOffers.length,
      allOffers: validOffers,
      updatedAt: new Date().toISOString(),
    }),
    { status: 200, headers: { 'content-type': 'application/json; charset=utf-8' } }
  );
}
