import { NextResponse } from 'next/server';

export const maxDuration = 60;

function cleanString(str: string): string {
  return str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().trim();
}

interface RequestItem {
  partNumber: string;
  machineModel: string;
  quantity: number;
}

interface ProcessedItem {
  partNumber: string;
  machineModel: string;
  quantity: number;
  partTitle: string;
  supplierBuyPriceGbp: number;
  clientUnitPriceGbp: number;
  unitWeightKg: number;
  totalWeightKg: number;
  itemTotalGbp: number;
  storeName: string;
  purchaseUrl: string;
  found: boolean;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      items = [],
      country = 'Україна',
      contact = '',
      invoiceNumber = '',
    } = body;

    // Підтримка одиночного або масивного формату
    const rawItems: RequestItem[] = Array.isArray(items) && items.length > 0
      ? items
      : [{
          partNumber: String(body.partNumber || ''),
          machineModel: String(body.machineModel || ''),
          quantity: Math.max(1, parseInt(String(body.quantity), 10) || 1),
        }];

    // Обмеження до 10 позицій
    const validItems = rawItems.slice(0, 10).map((it) => ({
      partNumber: String(it.partNumber || '').trim(),
      machineModel: String(it.machineModel || '').trim(),
      quantity: Math.max(1, parseInt(String(it.quantity), 10) || 1),
    }));

    if (validItems.length === 0 || !validItems[0].partNumber) {
      return NextResponse.json({ error: 'Потрібно вказати хоча б один каталожний номер' }, { status: 400 });
    }

    const pplxKey = process.env.PERPLEXITY_API_KEY;
    const tgToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChatId = process.env.TELEGRAM_CHAT_ID;
    const xeroWebhook = process.env.XERO_WEBHOOK_URL;

    // Паралельна обробка кожної позиції
    const processedItems: ProcessedItem[] = await Promise.all(
      validItems.map(async (item) => {
        const cleaned = cleanString(item.partNumber);
        let partTitle = `${item.partNumber} ${item.machineModel}`.trim();
        let supplierBuyPriceGbp = 0;
        let unitWeightKg = 1.0;
        let storeName = 'Global Supply Hub';
        let purchaseUrl = 'https://www.google.com/search?q=' + encodeURIComponent(`${item.partNumber} parts`);
        let found = false;

        // 1. Пошук через Perplexity Sonar
        if (pplxKey) {
          try {
            const prompt = `Search live global and UK distributors (FilterFinder, Inline Filters, Vicary Plant, TVH, DiPerk, Kramp) for:
Part Number: "${item.partNumber}"
Equipment: "${item.machineModel}"

Return ONLY raw JSON:
{
  "found": true,
  "title": "Exact part name",
  "priceGbp": 12.50,
  "weightKg": 0.5,
  "url": "https://...",
  "supplier": "Store Name"
}`;

            const res = await fetch('https://api.perplexity.ai/chat/completions', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${pplxKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'sonar',
                messages: [
                  { role: 'system', content: 'Extract machinery parts pricing ex-VAT and weights. Output raw JSON only.' },
                  { role: 'user', content: prompt },
                ],
                temperature: 0.1,
              }),
            });

            if (res.ok) {
              const data = await res.json();
              const text = data.choices?.[0]?.message?.content || '{}';
              const clean = text.replace(/```json/gi, '').replace(/```/gi, '').trim();
              const parsed = JSON.parse(clean);

              if (parsed && Number(parsed.priceGbp) > 0) {
                supplierBuyPriceGbp = Math.round(Number(parsed.priceGbp) * 100) / 100;
                unitWeightKg = Number(parsed.weightKg) > 0 ? Number(parsed.weightKg) : 1.0;
                partTitle = parsed.title || partTitle;
                purchaseUrl = parsed.url && parsed.url.startsWith('http') ? parsed.url : purchaseUrl;
                storeName = parsed.supplier || 'UK/EU Supplier';
                found = true;
              }
            }
          } catch (e) {
            console.error(`PPLX error on ${item.partNumber}:`, e);
          }
        }

        // 2. Резервна перевірка відомих баз (якщо API дає збій)
        if (!found || supplierBuyPriceGbp <= 0) {
          if (cleaned.includes('45820403')) {
            partTitle = 'JCB Axle Hub Seal Cover Plate (Кришка сальника маточини)';
            supplierBuyPriceGbp = 4.87;
            unitWeightKg = 0.15;
            purchaseUrl = 'https://vicaryplant.com/products/hub-seal-cover-plate-458-20403';
            storeName = 'Vicary Plant UK Hub';
            found = true;
          } else if (cleaned.includes('p535114')) {
            partTitle = 'Donaldson P535114 Air Filter Primary Round';
            supplierBuyPriceGbp = 175.40;
            unitWeightKg = 8.08;
            purchaseUrl = 'https://filterfinder.co.uk/p535114-donaldson-air-filter-primary-round';
            storeName = 'FilterFinder UK';
            found = true;
          } else if (cleaned.includes('p553004')) {
            partTitle = 'Donaldson P553004 Fuel Filter Water Separator';
            supplierBuyPriceGbp = 14.50;
            unitWeightKg = 0.60;
            purchaseUrl = 'https://www.inlinefilters.co.uk/Filters-Fuel/SpinOn/FBW-BF1280';
            storeName = 'Inline Filters Global';
            found = true;
          } else if (cleaned.includes('26561117')) {
            partTitle = 'Perkins 26561117 Secondary Fuel Filter Element';
            supplierBuyPriceGbp = 21.00;
            unitWeightKg = 0.65;
            purchaseUrl = 'https://www.diperk.co.uk/part/26561117';
            storeName = 'DiPerk Power Solutions UK';
            found = true;
          }
        }

        // Націнка +20%
        const clientUnitPriceGbp = Math.round((supplierBuyPriceGbp * 1.20) * 100) / 100;
        const totalWeightKg = Math.round(unitWeightKg * item.quantity * 10) / 10;
        const itemTotalGbp = Math.round(clientUnitPriceGbp * item.quantity * 100) / 100;

        return {
          partNumber: item.partNumber,
          machineModel: item.machineModel,
          quantity: item.quantity,
          partTitle,
          supplierBuyPriceGbp,
          clientUnitPriceGbp,
          unitWeightKg,
          totalWeightKg,
          itemTotalGbp,
          storeName,
          purchaseUrl,
          found,
        };
      })
    );

    // Якщо хоча б одну деталь не знайдено — передаємо на RFQ перевірку
    const hasUnverified = processedItems.some((it) => !it.found || it.supplierBuyPriceGbp <= 0);

    if (hasUnverified) {
      if (tgToken && tgChatId) {
        const unverifiedList = processedItems
          .map((it, idx) => `${idx + 1}. <code>${it.partNumber}</code> (${it.machineModel || 'Спецтехніка'}) — ${it.quantity} шт ${it.found ? '✅' : '❌ не знайдено ціну'}`)
          .join('\n');

        const alertText = `⚠️ <b>МУЛЬТИ-СПЕЦИФІКАЦІЯ: ПОТРІБНА РУЧНА ОЦІНКА (WAIT FOR RFQ)</b>
━━━━━━━━━━━━━━━━━━━━━━━━
📋 <b>Перелік деталей (${processedItems.length} поз.):</b>
${unverifiedList}

👤 <b>Клієнт:</b> ${contact}
📍 <b>Локація:</b> ${country}`;

        await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: tgChatId, text: alertText, parse_mode: 'HTML' }),
        }).catch(() => {});
      }

      return NextResponse.json({
        found: false,
        status: 'wait_for_rfq',
        message: 'Частина позицій вимагає уточнення за каталогами в Ковентрі.',
      });
    }

    // 3. Загальна вага всієї партії для доставки Nova Post
    const totalOrderWeightKg = Math.round(
      processedItems.reduce((acc, curr) => acc + curr.totalWeightKg, 0) * 10
    ) / 10;

    let shippingCost = 27;
    let parcelType = `Nova Post Small (партія ${totalOrderWeightKg} кг)`;

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
      parcelType = `Nova Post Heavy (консолідація 2 місця • ${totalOrderWeightKg} кг)`;
    } else if (totalOrderWeightKg <= 150.0) {
      shippingCost = 165;
      parcelType = `Mini Pallet Freight (${totalOrderWeightKg} кг)`;
    } else {
      const pallets = Math.ceil(totalOrderWeightKg / 700);
      shippingCost = 240 * pallets;
      parcelType = `Full Euro-Pallet Freight (${pallets} пал. • ${totalOrderWeightKg} кг)`;
    }

    const itemsSubtotalGbp = Math.round(
      processedItems.reduce((acc, curr) => acc + curr.itemTotalGbp, 0) * 100
    ) / 100;
    const finalTotalGbp = Math.round((itemsSubtotalGbp + shippingCost) * 100) / 100;
    const totalProfitGbp = Math.round(
      processedItems.reduce((acc, curr) => acc + (curr.clientUnitPriceGbp - curr.supplierBuyPriceGbp) * curr.quantity, 0) * 100
    ) / 100;

    const invNum = invoiceNumber || `NLG-PI-${Math.floor(100000 + Math.random() * 900000)}`;

    // 4. Детальне сповіщення в Telegram
    if (tgToken && tgChatId) {
      const lines = processedItems
        .map(
          (it, idx) =>
            `${idx + 1}. <b>${it.partTitle}</b> [<code>${it.partNumber}</code>]\n   • ${it.quantity} шт × £${it.clientUnitPriceGbp.toFixed(2)} (Закупка: £${it.supplierBuyPriceGbp.toFixed(2)} у ${it.storeName})\n   • <a href="${it.purchaseUrl}">Купити в UK/EU</a>`
        )
        .join('\n\n');

      const tgMsg = `✅ <b>ВЕРИФІКОВАНА B2B СПЕЦИФІКАЦІЯ: ${invNum}</b>
━━━━━━━━━━━━━━━━━━━━━━━━
📋 <b>ПОЗИЦІЇ (${processedItems.length} шт):</b>
${lines}

━━━━━━━━━━━━━━━━━━━━━━━━
📦 <b>Сумарна вага партії:</b> <b>${totalOrderWeightKg} кг</b>
🚚 <b>Доставка Nova Post:</b> ${parcelType} — <b>£${shippingCost}</b>

👤 <b>Клієнт:</b> ${contact}
📍 <b>Країна:</b> ${country}

💰 <b>ФІНАНСОВИЙ ПІДСУМОК (+20% маржі):</b>
• Сума за деталі: <b>£${itemsSubtotalGbp.toFixed(2)}</b>
• Доставка: <b>£${shippingCost.toFixed(2)}</b>
• <b>РАЗОМ ДО СПЛАТИ КЛІЄНТОМ:</b> <b>£${finalTotalGbp.toFixed(2)}</b>
• <b>ТВІЙ ЧИСТИЙ ПРИБУТОК:</b> <b>£${totalProfitGbp.toFixed(2)}</b> 🔥`;

      fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: tgChatId,
          text: tgMsg,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      }).catch(() => {});
    }

    // 5. Синхронізація з Xero через Webhook
    if (xeroWebhook) {
      fetch(xeroWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceNumber: invNum,
          contactName: contact || 'Website Wholesale Customer',
          items: processedItems.map((it) => ({
            description: `${it.partTitle} [${it.partNumber}]`,
            quantity: it.quantity,
            unitAmount: it.clientUnitPriceGbp,
          })),
          shippingAmount: shippingCost,
          totalAmount: finalTotalGbp,
          currencyCode: 'GBP',
          date: new Date().toISOString().split('T')[0],
        }),
      }).catch(() => {});
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
    console.error('RFQ Multi Route Error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
