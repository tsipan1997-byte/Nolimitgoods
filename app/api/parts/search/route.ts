import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawOem = searchParams.get('oem');

  if (!rawOem) {
    return NextResponse.json(
      { error: 'Вкажіть артикул: ?oem=НОМЕР' },
      { status: 400 }
    );
  }

  // Очистка артикула от лишних знаков
  const cleanOem = rawOem.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

  try {
    // Реальный запрос к каталогу запчастей / фильтров в Великобритании
    const targetUrl = `https://www.inlinefilters.co.uk/index.php?main_page=advanced_search_result&search_in_description=1&keyword=${encodeURIComponent(cleanOem)}`;

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      next: { revalidate: 3600 } // Кэшируем на 1 час
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Сайт-донор тимчасово недоступний' },
        { status: 502 }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Парсим название и цену
    const productTitle = $('.productListing-heading, .productName, h1')
      .first()
      .text()
      .trim();

    const priceText = $('.productSpecialPrice, .productBasePrice, .normalprice')
      .first()
      .text()
      .trim();

    const rawPriceMatch = priceText.match(/[\d,.]+/);
    const supplierPrice = rawPriceMatch
      ? parseFloat(rawPriceMatch[0].replace(',', ''))
      : null;

    if (!supplierPrice) {
      return NextResponse.json({
        found: false,
        oem: cleanOem,
        message: 'Позицію за цим номером не знайдено',
      });
    }

    // Расчет финальной цены для покупателя:
    // (Цена поставщика + £6.00 доставка по UK) * наценка 25%
    const ukDeliveryFee = 6.0;
    const margin = 1.25;
    const finalPriceGbp = Number(((supplierPrice + ukDeliveryFee) * margin).toFixed(2));

    return NextResponse.json({
      found: true,
      oem: cleanOem,
      title: productTitle || `Запчастина ${cleanOem}`,
      supplierPriceGbp: supplierPrice,
      finalPriceGbp: finalPriceGbp,
      currency: 'GBP',
      hubLocation: 'Coventry, UK',
      inStock: true,
      updatedAt: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
