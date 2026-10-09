import { NextResponse } from 'next/server';

export const maxDuration = 60;

function cleanString(str: string): string {
  return str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().trim();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      partNumber = '',
      machineModel = '',
      quantity = 1,
      country = 'Україна',
      contact = '',
      invoiceNumber = '',
    } = body;

    const rawPart = String(partNumber).trim();
    const rawModel = String(machineModel).trim();
    const qty = Math.max(1, parseInt(String(quantity), 10) || 1);
    const cleanedCode = cleanString(rawPart);

    const pplxKey = process.env.PERPLEXITY_API_KEY;
    const tgToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChatId = process.env.TELEGRAM_CHAT_ID;
    const xeroWebhook = process.env.XERO_WEBHOOK_URL;

    let partTitle = `${rawPart} ${rawModel}`.trim();
    let supplierBuyPriceGbp = 0;
    let unitWeightKg = 0;
    let storeName = 'Global Supply Hub';
    let purchaseUrl = 'https://www.google.com/search?q=' + encodeURIComponent(`${rawPart} spare parts price`);
    let found = false;

    // 1. ПОШУК ЧЕРЕЗ PERPLEXITY
    if (pplxKey) {
      try {
        const globalSearchPrompt = `
Search worldwide distributors (FilterFinder, Inline Filters, Vicary Plant, DiPerk, TVH, Kramp, eBay) for:
Part Number: "${rawPart}"
Model/Brand: "${rawModel}"

TASK:
1. Extract actual trade price EXCLUDING VAT. If found in EUR/USD, convert to GBP (1 EUR ≈ 0.85 GBP, 1 USD ≈ 0.78 GBP).
2. Extract physical unit weight in kg.
3. Extract direct purchase URL.

Return raw JSON only:
{
  "found": true,
  "title": "Exact full part name",
  "priceGbp": 175.40,
  "weightKg": 8.08,
  "url": "https://...",
  "supplier": "Store Name"
}`;

        const pplxRes = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${pplxKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'sonar',
            messages: [
              { role: 'system', content: 'You extract spare parts prices ex VAT, weight, and URLs. Output raw JSON only.' },
              { role: 'user', content: globalSearchPrompt },
            ],
            temperature: 0.1,
          }),
        });

        if (pplxRes.ok) {
          const resData = await pplxRes.json();
          const content = resData.choices?.[0]?.message?.content || '{}';
          const cleanJson = content.replace(/```json/gi, '').replace(/```/gi, '').trim();
          const parsed = JSON.parse(cleanJson);

          if (parsed && Number(parsed.priceGbp) > 0) {
            supplierBuyPriceGbp = Math.round(Number(parsed.priceGbp) * 100) / 100;
            unitWeightKg = Number(parsed.weightKg) > 0 ? Number(parsed.weightKg) : 0.5;
            partTitle = parsed.title || partTitle;
            purchaseUrl = parsed.url && parsed.url.startsWith('http') ? parsed.url : purchaseUrl;
            storeName = parsed.supplier || 'Global Supplier Hub';
            found = true;
          }
        }
      } catch (e) {
        console.error('Perplexity search error:', e);
      }
    }

    // 2. БАЗОВІ СПЕЦИФІКАЦІЇ (Якщо API затримується)
    if (!found || supplierBuyPriceGbp <= 0) {
      if (cleanedCode.includes('45820403')) {
        partTitle = 'JCB Axle Hub Seal Cover Plate (Кришка сальника маточини)';
        supplierBuyPriceGbp = 4.87;
        unitWeightKg = 0.15;
        purchaseUrl = 'https://vicaryplant.com/products/hub-seal-cover-plate-458-20403';
        storeName = 'Vicary Plant UK Hub';
        found = true;
      } else if (cleanedCode.includes('p535114')) {
        partTitle = 'Donaldson P535114 Air Filter Primary Round';
        supplierBuyPriceGbp = 175.40;
        unitWeightKg = 8.08;
        purchaseUrl = 'https://filterfinder.co.uk/p535114-donaldson-air-filter-primary-round';
        storeName = 'FilterFinder UK / Europe';
        found = true;
      } else if (cleanedCode.includes('p553004')) {
        partTitle = 'Donaldson P553004 Fuel Filter Water Separator';
        supplierBuyPriceGbp = 14.50;
        unitWeightKg = 0.60;
        purchaseUrl = 'https://www.inlinefilters.co.uk/Filters-Fuel/SpinOn/FBW-BF1280';
        storeName = 'Inline Filters Global';
        found = true;
      } else if (cleanedCode.includes('26561117')) {
        partTitle = 'Perkins 26561117 Secondary Fuel Filter Element';
        supplierBuyPriceGbp = 21.00;
        unitWeightKg = 0.65;
        purchaseUrl = 'https://www.diperk.co.uk/part/26561117';
        storeName = 'DiPerk Power Solutions EU/UK';
        found = true;
      }
    }

    if (!found || supplierBuyPriceGbp <= 0) {
      return NextResponse.json({ found: false, status: 'wait_for_rfq' });
    }

    // 3. РОЗРАХУНОК МАРЖІ: РІВНО 20%
    const marginPercent = 0.20; // 20% націнка
    const marginPerUnit = Math.round(supplierBuyPriceGbp * marginPercent * 100) / 100;
    const clientUnitPrice = Math.round((supplierBuyPriceGbp + marginPerUnit) * 100) / 100;

    // 4. ДОСТАВКА NOVA POST ОКРЕМО
    const totalBatchWeightKg = Math.round(unitWeightKg * qty * 10) / 10;
    let shippingCost = 27;
    let parcelType = `Nova Post Small (до 2 кг • ${totalBatchWeightKg} кг)`;

    if (totalBatchWeightKg <= 2.0) {
      shippingCost = 27;
      parcelType = `Nova Post Small (до 2 кг • ${totalBatchWeightKg} кг)`;
    } else if (totalBatchWeightKg <= 10.0) {
      shippingCost = 41;
      parcelType = `Nova Post Medium (до 10 кг • ${totalBatchWeightKg} кг)`;
    } else if (totalBatchWeightKg <= 30.0) {
      shippingCost = 68;
      parcelType = `Nova Post Large (ящик до 30 кг • ${totalBatchWeightKg} кг)`;
    } else if (totalBatchWeightKg <= 60.0) {
      shippingCost = 115;
      parcelType = `Nova Post Heavy (${totalBatchWeightKg} кг)`;
    } else if (totalBatchWeightKg <= 150.0) {
      shippingCost = 165;
      parcelType = `Mini Pallet Freight (${totalBatchWeightKg} кг)`;
    } else {
      const pallets = Math.ceil(totalBatchWeightKg / 700);
      shippingCost = 240 * pallets;
      parcelType = `Full Euro-Pallet Freight (${pallets} пал. • ${totalBatchWeightKg} кг)`;
    }

    const clientTotal = Math.round((clientUnitPrice * qty + shippingCost) * 100) / 100;
    const totalProfit = Math.round(marginPerUnit * qty * 100) / 100;
    const invNumber = invoiceNumber || `NLG-PI-${Math.floor(100000 + Math.random() * 900000)}`;

    // 5. ВІДПРАВКА В TELEGRAM
    if (tgToken && tgChatId) {
      const tgSuccess = `✅ <b>ВЕРИФІКОВАНИЙ B2B РАХУНОК: ${invNumber}</b>
━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ <b>Артикул:</b> <code>${rawPart}</code>
🏷 <b>Опис:</b> ${partTitle}
📦 <b>Партія:</b> ${qty} шт (${totalBatchWeightKg} кг)
🚚 <b>Доставка окремо:</b> ${parcelType} — <b>£${shippingCost}</b>

💰 <b>ФІНАНСИ (+20% маржі):</b>
• Закупка: <b>£${supplierBuyPriceGbp.toFixed(2)}</b> / шт (${storeName})
• Клієнту (+20%): <b>£${clientUnitPrice.toFixed(2)}</b> / шт
• Всього інвойс: <b>£${clientTotal.toFixed(2)}</b>
• <b>ТВІЙ ПРИБУТОК:</b> <b>£${totalProfit.toFixed(2)}</b> 🔥

🛒 <b>ПОСИЛАННЯ НА ТОВАР:</b>
👉 <a href="${purchaseUrl}">Відкрити сторінку товару</a>`;

      fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: tgChatId, text: tgSuccess, parse_mode: 'HTML' }),
      }).catch(() => {});
    }

    // 6. XERO WEBHOOK
    if (xeroWebhook) {
      fetch(xeroWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceNumber: invNumber,
          contactName: contact || 'Website Lead',
          itemDescription: `${partTitle} [${rawPart}] x${qty}`,
          quantity: qty,
          unitAmount: clientUnitPrice,
          shippingAmount: shippingCost,
          currencyCode: 'GBP',
          date: new Date().toISOString().split('T')[0],
        }),
      }).catch(() => {});
    }

    return NextResponse.json({
      found: true,
      unitPrice: clientUnitPrice,
      shippingCost,
      parcelType,
      totalWeightKg: totalBatchWeightKg,
      categoryLabel: partTitle,
      total: clientTotal,
    });
  } catch (error: any) {
    console.error('Fatal route error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
