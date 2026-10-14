export const dynamic = 'force-dynamic';
export const maxDuration = 60;

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

// Курси конвертації валют до GBP
const RATES_TO_GBP: Record<string, number> = {
  GBP: 1.0,
  EUR: 0.85,
  PLN: 0.20,
  USD: 0.78,
};

// Відправка сповіщення у Telegram-бот
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

  const msg = `🔍 <b>ПОШУК ДЕТАЛІ (20 ХАБІВ): ${data.oem}</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `📦 <b>Найменування:</b> ${data.title}\n` +
    `🏢 <b>Постачальник:</b> ${data.supplier} ${data.fromCache ? '(з бази)' : '(живий пошук)'}\n` +
    `💵 <b>Прайс вітрини (Gross):</b> £${data.grossPriceGbp.toFixed(2)}\n` +
    `🏷 <b>Ціна клієнту (+5%):</b> <b>£${data.clientPriceGbp.toFixed(2)}</b>\n` +
    `📉 <b>Собівартість після VAT (80%):</b> £${data.effectiveBuyCostGbp.toFixed(2)}\n` +
    `💰 <b>Загальний прибуток (25%):</b> <b>£${data.profitGbp.toFixed(2)}</b> 🔥\n` +
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

  // 1. ПЕРЕВІРКА КЕШУ PRISMA (PostgreSQL)
  try {
    const cached = await prisma.cachedPart.findUnique({
      where: { oem: cleanOem },
    });

    if (cached) {
      const now = new Date().getTime();
      const cachedTime = new Date(cached.updatedAt).getTime();
      const diffHours = (now - cachedTime) / (1000 * 60 * 60);

      if (diffHours < 24) {
        const clientPrice = Number((cached.supplierPriceGbp * 1.05).toFixed(2));
        const effectiveCost = Number((cached.supplierPriceGbp * 0.80).toFixed(2));
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

  // 2. СКАСУВАННЯ ТАЙМАУТІВ ТА ПАРАЛЕЛЬНИЙ ПОШУК ПО 20 ХАБАХ
  const searchHeaders = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept-Language': 'en-GB,en;q=0.9,de;q=0.8,pl;q=0.7',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  };

  const fetchTasks = [
    // === 1-й ЕШЕЛОН (БАЗОВІ СКЛАДИ) ===

    // 1. InlineFilters UK
    async (): Promise<SupplierOffer | null> => {
      try {
        const res = await fetch(`https://www.inlinefilters.co.uk/index.php?main_page=advanced_search_result&search_in_description=1&keyword=${cleanOem}`, { headers: searchHeaders, next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const $ = cheerio.load(await res.text());
        const title = $('.productListing-heading, .productName, h1').first().text().trim();
        const priceStr = $('.productSpecialPrice, .productBasePrice, .normalprice').first().text().trim();
        const match = priceStr.match(/[\d,.]+/);
        if (match) {
          const price = parseFloat(match[0].replace(',', ''));
          return { vendor: 'InlineFilters UK', country: 'UK', title: title || `Filter OEM ${cleanOem}`, originalPrice: price, originalCurrency: 'GBP', priceGbp: price, stock: true, link: 'https://www.inlinefilters.co.uk' };
        }
      } catch (e) {}
      return null;
    },

    // 2. MalpasOnline UK
    async (): Promise<SupplierOffer | null> => {
      try {
        const res = await fetch(`https://www.malpasonline.co.uk/search?q=${cleanOem}`, { headers: searchHeaders, next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const $ = cheerio.load(await res.text());
        const title = $('.product-title, .title, h1').first().text().trim();
        const priceStr = $('.price, .money, .product-price').first().text().trim();
        const match = priceStr.match(/[\d,.]+/);
        if (match) {
          const price = parseFloat(match[0].replace(',', ''));
          return { vendor: 'MalpasOnline Heavy Parts', country: 'UK', title: title || `Spares ${cleanOem}`, originalPrice: price, originalCurrency: 'GBP', priceGbp: price, stock: true, link: 'https://www.malpasonline.co.uk' };
        }
      } catch (e) {}
      return null;
    },

    // 3. Wismet Filter Hub DE
    async (): Promise<SupplierOffer | null> => {
      try {
        const res = await fetch(`https://www.wismet.de/?suchbegriff=${cleanOem}`, { headers: searchHeaders, next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const $ = cheerio.load(await res.text());
        const title = $('.item-title, h1, .product--title').first().text().trim();
        const priceStr = $('.price--default, .product--price').first().text().trim();
        const match = priceStr.match(/[\d,.]+/);
        if (match) {
          const priceEur = parseFloat(match[0].replace(',', '.'));
          return { vendor: 'Wismet Filtration DE', country: 'Germany', title: title || `Wismet Cross ${cleanOem}`, originalPrice: priceEur, originalCurrency: 'EUR', priceGbp: Number((priceEur * RATES_TO_GBP.EUR).toFixed(2)), stock: true, link: 'https://www.wismet.de' };
        }
      } catch (e) {}
      return null;
    },

    // 4. Digger Parts UK
    async (): Promise<SupplierOffer | null> => {
      try {
        const res = await fetch(`https://diggerpartsuk.co.uk/search?q=${cleanOem}`, { headers: searchHeaders, next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const $ = cheerio.load(await res.text());
        const title = $('.product-item__title, h1').first().text().trim();
        const priceStr = $('.price, .price-item--regular').first().text().trim();
        const match = priceStr.match(/[\d,.]+/);
        if (match) {
          const price = parseFloat(match[0].replace(',', ''));
          return { vendor: 'DiggerParts UK', country: 'UK', title: title || `Plant Part ${cleanOem}`, originalPrice: price, originalCurrency: 'GBP', priceGbp: price, stock: true, link: 'https://diggerpartsuk.co.uk' };
        }
      } catch (e) {}
      return null;
    },

    // 5. Allegro PL Heavy Equipment
    async (): Promise<SupplierOffer | null> => {
      try {
        const res = await fetch(`https://allegro.pl/kategoria/czesci-do-maszyn-czesci-do-maszyn-budowlanych-254146?string=${cleanOem}`, { headers: searchHeaders, next: { revalidate: 1800 } });
        if (!res.ok) return null;
        const $ = cheerio.load(await res.text());
        const title = $('h2, [data-analytics-clickable-element="true"]').first().text().trim();
        const priceStr = $('[data-box-name="Items"] span, .fee').first().text().trim();
        const match = priceStr.match(/[\d,.]+/);
        if (match) {
          const pricePln = parseFloat(match[0].replace(/\s/g, '').replace(',', '.'));
          return { vendor: 'Allegro PL Hub', country: 'Poland', title: title || `Część OEM ${cleanOem}`, originalPrice: pricePln, originalCurrency: 'PLN', priceGbp: Number((pricePln * RATES_TO_GBP.PLN).toFixed(2)), stock: true, link: 'https://allegro.pl' };
        }
      } catch (e) {}
      return null;
    },

    // 6. UrParts EU
    async (): Promise<SupplierOffer | null> => {
      try {
        const res = await fetch(`https://www.urparts.com/index.cfm/page/parts?search=${cleanOem}`, { headers: searchHeaders, next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const html = await res.text();
        if (html.includes(cleanOem)) {
          return { vendor: 'UrParts EU Network', country: 'Europe', title: `Heavy Machinery Spares ${cleanOem}`, originalPrice: 50.0, originalCurrency: 'EUR', priceGbp: Number((50.0 * RATES_TO_GBP.EUR).toFixed(2)), stock: true, link: 'https://www.urparts.com' };
        }
      } catch (e) {}
      return null;
    },

    // 7. Bepco Parts
    async (): Promise<SupplierOffer | null> => {
      try {
        const res = await fetch(`https://www.bepcoparts.com/en-gb/search?query=${cleanOem}`, { headers: searchHeaders, next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const $ = cheerio.load(await res.text());
        const title = $('.product-title, h1').first().text().trim();
        const priceStr = $('.price-tag').first().text().trim();
        const match = priceStr.match(/[\d,.]+/);
        if (match) {
          const price = parseFloat(match[0].replace(',', ''));
          return { vendor: 'Bepco Agricultural & Plant', country: 'EU/UK', title: title || `Bepco Component ${cleanOem}`, originalPrice: price, originalCurrency: 'GBP', priceGbp: price, stock: true, link: 'https://www.bepcoparts.com' };
        }
      } catch (e) {}
      return null;
    },

    // 8. Hydraulic Parts Direct UK
    async (): Promise<SupplierOffer | null> => {
      try {
        const res = await fetch(`https://hydraulicpartsuk.com/?s=${cleanOem}&post_type=product`, { headers: searchHeaders, next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const $ = cheerio.load(await res.text());
        const title = $('.woocommerce-loop-product__title, h1').first().text().trim();
        const priceStr = $('.woocommerce-Price-amount, .price').first().text().trim();
        const match = priceStr.match(/[\d,.]+/);
        if (match) {
          const price = parseFloat(match[0].replace(',', ''));
          return { vendor: 'Hydraulic Parts UK', country: 'UK', title: title || `Hydraulic Valve ${cleanOem}`, originalPrice: price, originalCurrency: 'GBP', priceGbp: price, stock: true, link: 'https://hydraulicpartsuk.com' };
        }
      } catch (e) {}
      return null;
    },

    // 9. Vicary Plant JCB
    async (): Promise<SupplierOffer | null> => {
      try {
        const res = await fetch(`https://vicaryplant.co.uk/search?q=${cleanOem}`, { headers: searchHeaders, next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const $ = cheerio.load(await res.text());
        const title = $('.product-item__title, h1').first().text().trim();
        const priceStr = $('.price, .money').first().text().trim();
        const match = priceStr.match(/[\d,.]+/);
        if (match) {
          const price = parseFloat(match[0].replace(',', ''));
          return { vendor: 'Vicary JCB Plant UK', country: 'UK', title: title || `JCB Part ${cleanOem}`, originalPrice: price, originalCurrency: 'GBP', priceGbp: price, stock: true, link: 'https://vicaryplant.co.uk' };
        }
      } catch (e) {}
      return null;
    },

    // 10. Kramp Parts
    async (): Promise<SupplierOffer | null> => {
      try {
        const res = await fetch(`https://www.kramp.com/shop-gb/en/search?text=${cleanOem}`, { headers: searchHeaders, next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const $ = cheerio.load(await res.text());
        const title = $('h1, .product-card__title').first().text().trim();
        const priceStr = $('.product-card__price, .price').first().text().trim();
        const match = priceStr.match(/[\d,.]+/);
        if (match) {
          const price = parseFloat(match[0].replace(',', ''));
          return { vendor: 'Kramp EU Depot', country: 'Netherlands', title: title || `Kramp Component ${cleanOem}`, originalPrice: price, originalCurrency: 'GBP', priceGbp: price, stock: true, link: 'https://www.kramp.com' };
        }
      } catch (e) {}
      return null;
    },

    // === 2-й ЕШЕЛОН (СПЕЦІАЛІЗОВАНА ГІДРАВЛІКА, МОТОРИ ТА ТРАНСМІСІЇ) ===

    // 11. HydraStore UK (Danfoss / Kawasaki / Webtec Гідравліка)
    async (): Promise<SupplierOffer | null> => {
      try {
        const res = await fetch(`https://www.hydrastore.co.uk/catalogsearch/result/?q=${cleanOem}`, { headers: searchHeaders, next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const $ = cheerio.load(await res.text());
        const title = $('.product-item-link, h1.page-title').first().text().trim();
        const priceStr = $('.price-wrapper .price, .special-price .price').first().text().trim();
        const match = priceStr.match(/[\d,.]+/);
        if (match) {
          const price = parseFloat(match[0].replace(',', ''));
          return { vendor: 'HydraStore Danfoss Hub', country: 'UK', title: title || `Hydraulic Motor/Pump ${cleanOem}`, originalPrice: price, originalCurrency: 'GBP', priceGbp: price, stock: true, link: 'https://www.hydrastore.co.uk' };
        }
      } catch (e) {}
      return null;
    },

    // 12. Hydraulic Megastore UK (Фітинги, клапани, промислова гідравліка)
    async (): Promise<SupplierOffer | null> => {
      try {
        const res = await fetch(`https://www.hydraulicmegastore.com/?s=${cleanOem}&post_type=product`, { headers: searchHeaders, next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const $ = cheerio.load(await res.text());
        const title = $('.woocommerce-loop-product__title, h1.product_title').first().text().trim();
        const priceStr = $('.price .amount, ins .amount').first().text().trim();
        const match = priceStr.match(/[\d,.]+/);
        if (match) {
          const price = parseFloat(match[0].replace(',', ''));
          return { vendor: 'Hydraulic Megastore UK', country: 'UK', title: title || `Hydraulic Component ${cleanOem}`, originalPrice: price, originalCurrency: 'GBP', priceGbp: price, stock: true, link: 'https://www.hydraulicmegastore.com' };
        }
      } catch (e) {}
      return null;
    },

    // 13. White House Products UK (Насоси Rexroth / Danfoss / Casappa)
    async (): Promise<SupplierOffer | null> => {
      try {
        const res = await fetch(`https://www.whitehouseproductsltd.com/search?keyword=${cleanOem}`, { headers: searchHeaders, next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const $ = cheerio.load(await res.text());
        const title = $('.search-result-item h3, h1').first().text().trim();
        const priceStr = $('.item-price, .price').first().text().trim();
        const match = priceStr.match(/[\d,.]+/);
        if (match) {
          const price = parseFloat(match[0].replace(',', ''));
          return { vendor: 'White House Pumps UK', country: 'UK', title: title || `Gear/Piston Pump ${cleanOem}`, originalPrice: price, originalCurrency: 'GBP', priceGbp: price, stock: true, link: 'https://www.whitehouseproductsltd.com' };
        }
      } catch (e) {}
      return null;
    },

    // 14. Plant Parts 4U UK (Ходова частина екскаваторів, зірочки, котки)
    async (): Promise<SupplierOffer | null> => {
      try {
        const res = await fetch(`https://plantparts4u.co.uk/search?q=${cleanOem}`, { headers: searchHeaders, next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const $ = cheerio.load(await res.text());
        const title = $('.product-title, h1').first().text().trim();
        const priceStr = $('.price, .money').first().text().trim();
        const match = priceStr.match(/[\d,.]+/);
        if (match) {
          const price = parseFloat(match[0].replace(',', ''));
          return { vendor: 'Plant Parts 4U Undercarriage', country: 'UK', title: title || `Undercarriage Part ${cleanOem}`, originalPrice: price, originalCurrency: 'GBP', priceGbp: price, stock: true, link: 'https://plantparts4u.co.uk' };
        }
      } catch (e) {}
      return null;
    },

    // 15. IntaTrac UK (Мости та коробки Carraro, Dana Spicer, ZF)
    async (): Promise<SupplierOffer | null> => {
      try {
        const res = await fetch(`https://www.intatracuk.com/search?q=${cleanOem}`, { headers: searchHeaders, next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const $ = cheerio.load(await res.text());
        const title = $('.product_name, h1').first().text().trim();
        const priceStr = $('.current_price, .price').first().text().trim();
        const match = priceStr.match(/[\d,.]+/);
        if (match) {
          const price = parseFloat(match[0].replace(',', ''));
          return { vendor: 'IntaTrac Carraro/ZF Spares', country: 'UK', title: title || `Axle Transmission Part ${cleanOem}`, originalPrice: price, originalCurrency: 'GBP', priceGbp: price, stock: true, link: 'https://www.intatracuk.com' };
        }
      } catch (e) {}
      return null;
    },

    // 16. DiPerk Power Solutions UK (Авторизований центр Perkins Engines)
    async (): Promise<SupplierOffer | null> => {
      try {
        const res = await fetch(`https://www.diperk.com/search?keyword=${cleanOem}`, { headers: searchHeaders, next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const $ = cheerio.load(await res.text());
        const title = $('.part-name, h1').first().text().trim();
        const priceStr = $('.part-price, .price').first().text().trim();
        const match = priceStr.match(/[\d,.]+/);
        if (match) {
          const price = parseFloat(match[0].replace(',', ''));
          return { vendor: 'DiPerk Perkins Master Hub', country: 'UK', title: title || `Perkins Engine Genuine Part ${cleanOem}`, originalPrice: price, originalCurrency: 'GBP', priceGbp: price, stock: true, link: 'https://www.diperk.com' };
        }
      } catch (e) {}
      return null;
    },

    // 17. Diesel Parts Direct EU/UK (Паливні форсунки, турбіни Cummins/CAT)
    async (): Promise<SupplierOffer | null> => {
      try {
        const res = await fetch(`https://www.dieselpartsdirect.co.uk/search?q=${cleanOem}`, { headers: searchHeaders, next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const $ = cheerio.load(await res.text());
        const title = $('.product-title, h1').first().text().trim();
        const priceStr = $('.price, .money').first().text().trim();
        const match = priceStr.match(/[\d,.]+/);
        if (match) {
          const price = parseFloat(match[0].replace(',', ''));
          return { vendor: 'Diesel Parts Direct UK', country: 'UK', title: title || `Diesel Injector/Turbo ${cleanOem}`, originalPrice: price, originalCurrency: 'GBP', priceGbp: price, stock: true, link: 'https://www.dieselpartsdirect.co.uk' };
        }
      } catch (e) {}
      return null;
    },

    // 18. Interpart JCB Spares UK (Спеціалізовані ОЕМ компоненти JCB)
    async (): Promise<SupplierOffer | null> => {
      try {
        const res = await fetch(`https://www.interpart.com/en/search?q=${cleanOem}`, { headers: searchHeaders, next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const $ = cheerio.load(await res.text());
        const title = $('.part-title, h1').first().text().trim();
        const priceStr = $('.part-price, .price').first().text().trim();
        const match = priceStr.match(/[\d,.]+/);
        if (match) {
          const price = parseFloat(match[0].replace(',', ''));
          return { vendor: 'Interpart Genuine JCB Spares', country: 'UK', title: title || `JCB OEM Assembly ${cleanOem}`, originalPrice: price, originalCurrency: 'GBP', priceGbp: price, stock: true, link: 'https://www.interpart.com' };
        }
      } catch (e) {}
      return null;
    },

    // 19. Kastens & Knauer DE (Німецький склад гідравліки та вузлів)
    async (): Promise<SupplierOffer | null> => {
      try {
        const res = await fetch(`https://www.kastens-knauer.de/suche?q=${cleanOem}`, { headers: searchHeaders, next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const $ = cheerio.load(await res.text());
        const title = $('.product--title, h1').first().text().trim();
        const priceStr = $('.product--price, .price--default').first().text().trim();
        const match = priceStr.match(/[\d,.]+/);
        if (match) {
          const priceEur = parseFloat(match[0].replace(',', '.'));
          return { vendor: 'Kastens & Knauer DE', country: 'Germany', title: title || `European Machinery Spares ${cleanOem}`, originalPrice: priceEur, originalCurrency: 'EUR', priceGbp: Number((priceEur * RATES_TO_GBP.EUR).toFixed(2)), stock: true, link: 'https://www.kastens-knauer.de' };
        }
      } catch (e) {}
      return null;
    },

    // 20. Agri-Linc Heavy Attachments UK (Ножі, зуби ковшів, адаптери)
    async (): Promise<SupplierOffer | null> => {
      try {
        const res = await fetch(`https://www.agri-linc.com/catalogsearch/result/?q=${cleanOem}`, { headers: searchHeaders, next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const $ = cheerio.load(await res.text());
        const title = $('.product-item-link, h1').first().text().trim();
        const priceStr = $('.price-wrapper .price, .price').first().text().trim();
        const match = priceStr.match(/[\d,.]+/);
        if (match) {
          const price = parseFloat(match[0].replace(',', ''));
          return { vendor: 'Agri-Linc Attachments Hub', country: 'UK', title: title || `Heavy Wear Part ${cleanOem}`, originalPrice: price, originalCurrency: 'GBP', priceGbp: price, stock: true, link: 'https://www.agri-linc.com' };
        }
      } catch (e) {}
      return null;
    },
  ];

  // Одночасний запуск усіх 20 потоків
  const settled = await Promise.allSettled(fetchTasks.map((fn) => fn()));
  const validOffers: SupplierOffer[] = [];

  for (const item of settled) {
    if (item.status === 'fulfilled' && item.value && item.value.priceGbp > 0) {
      validOffers.push(item.value);
    }
  }

  // Якщо деталь не знайдена автоматично
  if (validOffers.length === 0) {
    return new NextResponse(
      JSON.stringify({
        found: false,
        oem: cleanOem,
        message: 'Позицію не знайдено на 20 європейських складах. Оформіть запит на ручний підбір інженеру.',
      }),
      { status: 200, headers: { 'content-type': 'application/json; charset=utf-8' } }
    );
  }

  // Сортування: беремо найкращу ціну постачальника
  validOffers.sort((a, b) => a.priceGbp - b.priceGbp);
  const bestOffer = validOffers[0];

  // ФОРМУЛА: Клієнту +5% націнки, собівартість 80% (після повернення 20% VAT)
  const grossPriceGbp = bestOffer.priceGbp;
  const clientPriceGbp = Number((grossPriceGbp * 1.05).toFixed(2));
  const effectiveBuyCostGbp = Number((grossPriceGbp * 0.80).toFixed(2));
  const totalProfitGbp = Number((clientPriceGbp - effectiveBuyCostGbp).toFixed(2));

  // 3. ЗБЕРЕЖЕННЯ / ОНОВЛЕННЯ В БАЗІ ДАНИХ (Prisma Upsert)
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

  // 4. СПОВІЩЕННЯ В TELEGRAM
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
      totalHubsScanned: 20,
      activeOffersFound: validOffers.length,
      allOffers: validOffers,
      updatedAt: new Date().toISOString(),
    }),
    { status: 200, headers: { 'content-type': 'application/json; charset=utf-8' } }
  );
}
