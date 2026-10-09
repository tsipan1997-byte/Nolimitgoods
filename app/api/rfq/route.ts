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
    let purchaseUrl = 'https://www.google.com/search?q=' + encodeURIComponent(`${rawPart} spare parts price catalog`);
    let found = false;

    // 1. ГЛОБАЛЬНИЙ ПОШУК ЧЕРЕЗ АГЕНТА PERPLEXITY (ВЕСЬ СВІТ: ЄВРОПА, США, UK)
    if (pplxKey) {
      try {
        const globalSearchPrompt = `
You are a global B2B procurement agent for heavy machinery and industrial equipment spare parts (JCB, CAT, Donaldson, Perkins, Komatsu, Volvo, Carraro, Bosch Rexroth).
Search worldwide distributors, OEM portals, European platforms (Germany, Poland, Netherlands, UK), and US suppliers for:
Part Number: "${rawPart}"
Model/Brand: "${rawModel}"

TASK:
1. Search across global inventory and major distributors (e.g. FilterFinder, Inline Filters, Kramp, TVH, Granit Parts, Diesel Power, DiPerk, Vicary Plant, RockAuto, eBay global).
2. Extract the actual trade/purchase price EXCLUDING VAT. If found in EUR or USD, convert to GBP (£) at realistic rates (1 EUR ≈ 0.85 GBP, 1 USD ≈ 0.78 GBP).
3. Extract the exact physical unit weight in kg from technical specs or catalogue data.
4. Extract the direct product URL where it can be purchased or inspected.

Output ONLY a raw JSON object (no markdown, no backticks, no commentary):
{
  "found": true,
  "title": "Exact full part name",
  "priceGbp": 175.40,
  "weightKg": 8.08,
  "url": "https://...",
  "supplier": "Distributor Name and Country (e.g. FilterFinder UK or TVH Europe)"
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
              {
                role: 'system',
                content:
                  'You are a global spare parts procurement agent. Search online worldwide for exact ex-VAT trade prices, weight in kg, and direct store URLs. Return valid raw JSON only.',
              },
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
            unitWeightKg = Number(parsed.weightKg) > 0 ? Number(parsed.weightKg) : 1.5;
            partTitle = parsed.title || partTitle;
            purchaseUrl = parsed.url && parsed.url.startsWith('http') ? parsed.url : purchaseUrl;
            storeName = parsed.supplier || 'Global Supplier Hub';
            found = true;
          }
        }
      } catch (e) {
        console.error('Perplexity Global Search error:', e);
      }
    }

    // 2. РЕЗЕРВНИЙ ЗАХИСТ СПЕЦИФІКАЦІЙ (ЯКЩО API ТИМЧАСОВО НЕДОСТУПНИЙ АБО ДОВГО ВІДПОВІДАЄ)
    if (!found || supplierBuyPriceGbp <= 0) {
      if (cleanedCode.includes('p535114')) {
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
      } else if (cleanedCode.includes('45820403')) {
        partTitle = 'JCB Axle Hub Seal Cover Plate (Кришка сальника маточини)';
        supplierBuyPriceGbp = 4.87;
        unitWeightKg = 0.15;
        purchaseUrl = 'https://vicaryplant.com/products/hub-seal-cover-plate-458-20403';
        storeName = 'Vicary Plant UK Hub';
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

    // 3. СТАТУС WAIT FOR RFQ (Якщо артикул не знайдено навіть у глобальних базах)
    if (!found || supplierBuyPriceGbp <= 0) {
      if (tgToken && tgChatId) {
        const rfqMsg = `⚠️ <b>НОВИЙ ЗАПИТ: ПОТРІБНА РУЧНА ОЦІНКА (WAIT FOR RFQ)</b>
━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ <b>Артикул:</b> <code>${rawPart}</code>
🚜 <b>Техніка:</b> ${rawModel || 'Спецтехніка'}
📦 <b>Кількість:</b> ${qty} шт
👤 <b>Клієнт:</b> ${contact}
📍 <b>Локація:</b> ${country}

ℹ️ <i>Глобальний агент не знайшов відкритої біржової ціни або деталь доступна лише під спецзамовлення. Зв'яжіться з замовником!</i>`;

        await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: tgChatId, text: rfqMsg, parse_mode: 'HTML' }),
        }).catch(() => {});
      }

      return NextResponse.json({
        found: false,
        status: 'wait_for_rfq',
      });
    }

    // 4. ДИНАМІЧНА МАРЖА БРИТАНСЬКОГО ХАБУ
    let margin = 0;
    if (supplierBuyPriceGbp <= 15) {
      margin = 3.50;
    } else if (supplierBuyPriceGbp <= 50) {
      margin = Math.max(8.0, Math.round(supplierBuyPriceGbp * 0.35));
    } else if (supplierBuyPriceGbp <= 200) {
      margin = Math.max(25.0, Math.round(supplierBuyPriceGbp * 0.22));
    } else {
      margin = Math.max(50.0, Math.round(supplierBuyPriceGbp * 0.18));
    }

    const clientUnitPrice = Math.round((supplierBuyPriceGbp + margin) * 100) / 100;
    const totalBatchWeightKg = Math.round(unitWeightKg * qty * 10) / 10;

    // 5. КОНСОЛІДАЦІЯ ЛОГІСТИКИ NOVA POST
    let shippingCost = 27;
    let parcelType = `Nova Post Small (${totalBatchWeightKg} кг)`;

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
    const totalProfit = Math.round(margin * qty * 100) / 100;
    const invNumber = invoiceNumber || `NLG-PI-${Math.floor(100000 + Math.random() * 900000)}`;

    // 6. ПОВІДОМЛЕННЯ В TELEGRAM ІЗ ПОСИЛАННЯМ НА ЗАКУПІВЛЮ
    if (tgToken && tgChatId) {
      const tgSuccess = `✅ <b>ВЕРИФІКОВАНИЙ B2B РАХУНОК: ${invNumber}</b>
━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ <b>Артикул:</b> <code>${rawPart}</code>
🏷 <b>Опис:</b> ${partTitle}
📦 <b>Партія:</b> ${qty} шт | Сумарна вага: <b>${totalBatchWeightKg} кг</b> (по ${unitWeightKg} кг/шт)
🚚 <b>Доставка:</b> ${parcelType} — <b>£${shippingCost}</b>

👤 <b>Клієнт:</b> ${contact}
📍 <b>Країна:</b> ${country}

💰 <b>ФІНАНСИ:</b>
• Ціна клієнту: <b>£${clientUnitPrice.toFixed(2)}</b> / шт
• Всього інвойс: <b>£${clientTotal.toFixed(2)}</b>
• Закупка (Global): <b>£${supplierBuyPriceGbp.toFixed(2)}</b> / шт (${storeName})
• <b>ТВІЙ ПРИБУТОК:</b> <b>£${totalProfit.toFixed(2)}</b> 🔥

🛒 <b>ПОСИЛАННЯ НА ТОВАР:</b>
👉 <a href="${purchaseUrl}">Відкрити сторінку товару</a>`;

      await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: tgChatId, text: tgSuccess, parse_mode: 'HTML' }),
      }).catch(() => {});
    }

    // 7. СТВОРЕННЯ РАХУНКУ В XERO
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
