import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

interface SupplierResult {
  supplier: string;
  title: string;
  price: number;
  currency: string;
  url: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawOem = searchParams.get('oem');

  if (!rawOem) {
    return NextResponse.json(
      { error: 'Вкажіть каталожний номер: ?oem=НОМЕР' },
      { status: 400 }
    );
  }

  const cleanOem = rawOem.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const results: SupplierResult[] = [];

  // 1. Джерело: Inline Filters UK (Фільтри Donaldson, Fleetguard, Baldwin)
  try {
    const res = await fetch(
      `https://www.inlinefilters.co.uk/index.php?main_page=advanced_search_result&search_in_description=1&keyword=${encodeURIComponent(cleanOem)}`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        next: { revalidate: 1800 },
      }
    );

    if (res.ok) {
      const html = await res.text();
      const $ = cheerio.load(html);
      const title = $('.productListing-heading, .productName, h1').first().text().trim();
      const priceText = $('.productSpecialPrice, .productBasePrice, .normalprice').first().text().trim();
      const match = priceText.match(/[\d,.]+/);

      if (match) {
        results.push({
          supplier: 'InlineFilters UK',
          title: title || `Part OEM ${cleanOem}`,
          price: parseFloat(match[0].replace(',', '')),
          currency: 'GBP',
          url: `https://www.inlinefilters.co.uk/index.php?main_page=advanced_search_result&keyword=${encodeURIComponent(cleanOem)}`,
        });
      }
    }
  } catch (err) {
    console.error('Error fetching from InlineFilters:', err);
  }

  // 2. Джерело: MalpasOnline UK (Запчастини до спец- та агротехніки)
  try {
    const res = await fetch(
      `https://www.malpasonline.co.uk/search?q=${encodeURIComponent(cleanOem)}`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        next: { revalidate: 1800 },
      }
    );

    if (res.ok) {
      const html = await res.text();
      const $ = cheerio.load(html);
      const title = $('.product-title, .title, h1').first().text().trim();
      const priceText = $('.price, .money, .product-price').first().text().trim();
      const match = priceText.match(/[\d,.]+/);

      if (match) {
        results.push({
          supplier: 'MalpasOnline UK',
          title: title || `Machinery Part ${cleanOem}`,
          price: parseFloat(match[0].replace(',', '')),
          currency: 'GBP',
          url: `https://www.malpasonline.co.uk/search?q=${encodeURIComponent(cleanOem)}`,
        });
      }
    }
  } catch (err) {
    console.error('Error fetching from MalpasOnline:', err);
  }

  // Якщо жоден донор не повернув інформації
  if (results.length === 0) {
    return NextResponse.json({
      found: false,
      oem: cleanOem,
      message: 'За даним артикулом деталі на партнерських складах не знайдено',
    });
  }

  // Зворотний фільтр: обираємо пропозицію з найнижчою собівартістю
  results.sort((a, b) => a.price - b.price);
  const bestOffer = results[0];

  // Формула розрахунку ціни під клієнта:
  const localUkShipping = 6.0; // Внутрішня доставка до складу в Ковентрі
  const marginMultiplier = 1.25; // 25% націнка
  const finalPriceGbp = Number(((bestOffer.price + localUkShipping) * marginMultiplier).toFixed(2));

  return NextResponse.json({
    found: true,
    oem: cleanOem,
    title: bestOffer.title,
    bestSupplier: bestOffer.supplier,
    supplierPriceGbp: bestOffer.price,
    finalPriceGbp: finalPriceGbp,
    currency: 'GBP',
    hub: 'Coventry, UK',
    deliveryTime: '5-8 робочих днів до України',
    inStock: true,
    totalSourcesChecked: 2,
    updatedAt: new Date().toISOString(),
  });
}
