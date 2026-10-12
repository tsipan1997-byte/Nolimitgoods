import { NextResponse } from 'next/server';

export const maxDuration = 60;

interface RequestItem {
  partNumber: string;
  machineModel: string;
  quantity: number;
}

interface CalculatedItem {
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

    // Збираємо всі введені позиції в єдиний масив
    const rawItems: any[] = Array.isArray(items) && items.length > 0
      ? items
      : [{
          partNumber: body.partNumber || '',
          machineModel: body.machineModel || '',
          quantity: body.quantity || 1,
        }];

    const validItems: RequestItem[] = rawItems
      .slice(0, 10)
      .filter((it) => String(it.partNumber || '').trim().length > 0)
      .map((it) => ({
        partNumber: String(it.partNumber).trim(),
        machineModel: String(it.machineModel || 'Heavy Equipment').trim(),
        quantity: Math.max(1, Number(it.quantity) || 1),
      }));

    if (validItems.length === 0) {
      return NextResponse.json({ error: 'Вкажіть хоча б одну деталь' }, { status: 400 });
    }

    const pplxKey = process.env.PERPLEXITY_API_KEY;
    const tgToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChatId = process.env.TELEGRAM_CHAT_ID;
    const xeroWebhook = process.env.XERO_WEBHOOK_URL;

    // Формуємо єдиний список для ШІ
    const itemsListPrompt = validItems
      .map((it, idx) => `${idx + 1}. Part Number: "${it.partNumber}", Equipment: "${it.machineModel}", Qty: ${it.quantity}`)
      .join('\n');

    let aiResults: any[] = [];

    // ЄДИНИЙ ПАКЕТНИЙ ПОШУК ПО ВСІХ ДЕТАЛЯХ ОДНОЧАСНО
    if (pplxKey) {
      try {
        const batchPrompt = `You are an automated B2B industrial machinery parts sourcing engine for the UK and European market.
Find the current distributor trade purchase price in GBP (£) EXCLUDING VAT and unit weight in kg for ALL of the following items at once across European and UK industrial parts stocks:

${itemsListPrompt}

Rules:
1. If a price is in EUR (€), convert to GBP using 0.85 rate.
2. Return prices EXCLUDING VAT (trade purchase price).
3. If an exact live catalog price is missing, provide a realistic UK distributor wholesale trade price estimate based on the OEM part category.
4. Output MUST be ONLY a valid raw JSON array containing an object for each part in exact order:
[
  {
    "partNumber": "string",
    "partTitle": "Official Part Description",
    "priceGbp": 0.00,
    "weightKg": 1.0,
    "supplier": "Distributor or Stock name"
  }
]`;

        const res = await fetch('https://api.perplexity.ai/chat/completions', {
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
                content: 'You return ONLY raw JSON arrays. No explanation, no markdown text, no conversation.',
              },
              { role: 'user', content: batchPrompt },
            ],
            temperature: 0.1,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const text = data.choices?.[0]?.message?.content || '';
          const jsonArrayMatch = text.match(/\[[\s\S]*\]/);
          if (jsonArrayMatch) {
            aiResults = JSON.parse(jsonArrayMatch[0]);
          }
        }
      } catch (err) {
        console.error('Batch sourcing error:', err);
      }
    }

    // Об'єднуємо знайдені дані та рахуємо маржу +20%
    const processedItems: CalculatedItem[] = validItems.map((item, index) => {
      const found = Array.isArray(aiResults) ? aiResults[index] : null;

      let supplierBuyPriceGbp = Number(found?.priceGbp);
      let unitWeightKg = Number(found?.weightKg);
      let partTitle = found?.partTitle || `${item.machineModel} ${item.partNumber}`;
      let storeName = found?.supplier || 'UK/European Hub';

      // Автоматичний захист від нульових цін
      if (isNaN(supplierBuyPriceGbp) || supplierBuyPriceGbp <= 0) {
        supplierBuyPriceGbp = 28.00; // Базова оцінка на випадок збою мережі
      }
      if (isNaN(unitWeightKg) || unitWeightKg <= 0) {
        unitWeightKg = 1.0;
      }

      // Націнка +20% до закупки
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
      };
    });

    // Сумарна вага всього замовлення для Nova Post Global
    const totalOrderWeightKg = Math.round(
      processedItems.reduce((sum, it) => sum + it.totalWeightKg, 0) * 10
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
    } else if (totalOrderWeightKg <= 150.0) {
      shippingCost = 165;
      parcelType = `Mini Pallet Freight (${totalOrderWeightKg} кг)`;
    } else {
      const pallets = Math.ceil(totalOrderWeightKg / 700);
      shippingCost = 240 * pallets;
      parcelType = `Full Euro-Pallet (${pallets} пал. • ${totalOrderWeightKg} кг)`;
    }

    const itemsSubtotalGbp = Math.round(
      processedItems.reduce((sum, it) => sum + it.itemTotalGbp, 0) * 100
    ) / 100;
    const finalTotalGbp = Math.round((itemsSubtotalGbp + shippingCost) * 100) / 100;
    const totalProfitGbp = Math.round(
      processedItems.reduce((sum, it) => sum + (it.clientUnitPriceGbp - it.supplierBuyPriceGbp) * it.quantity, 0) * 100
    ) / 100;

    const invNum = invoiceNumber || `NLG-PI-${Math.floor(100000 + Math.random() * 900000)}`;

    // Сповіщення в Telegram
    if (tgToken && tgChatId) {
      const lines = processedItems
        .map(
          (it, idx) =>
            `${idx + 1}. <b>${it.partTitle}</b> [<code>${it.partNumber}</code>]\n   • ${it.quantity} шт × £${it.clientUnitPriceGbp.toFixed(2)} (Закупка: £${it.supplierBuyPriceGbp.toFixed(2)} / <i>${it.storeName}</i>)`
        )
        .join('\n\n');

      const tgMsg = `⚡️ <b>ПАКЕТНИЙ РОЗРАХУНОК СПЕЦИФІКАЦІЇ: ${invNum}</b>
━━━━━━━━━━━━━━━━━━━━━━━━
📋 <b>Знайдено разом (${processedItems.length} позицій):</b>
${lines}

━━━━━━━━━━━━━━━━━━━━━━━━
📦 <b>Загальна вага замовлення:</b> <b>${totalOrderWeightKg} кг</b>
🚚 <b>Доставка Nova Post:</b> ${parcelType} — <b>£${shippingCost}</b>

👤 <b>Клієнт:</b> ${contact}
📍 <b>Країна:</b> ${country}

💰 <b>ФІНАНСИ (+20% маржі):</b>
• Запчастини: <b>£${itemsSubtotalGbp.toFixed(2)}</b>
• Доставка: <b>£${shippingCost.toFixed(2)}</b>
• <b>РАЗОМ ДО СПЛАТИ:</b> <b>£${finalTotalGbp.toFixed(2)}</b>
• <b>ЧИСТИЙ ПРИБУТОК:</b> <b>£${totalProfitGbp.toFixed(2)}</b> 🔥`;

      fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: tgChatId,
          text: tgMsg,
          parse_mode: 'HTML',
        }),
      }).catch(() => {});
    }

    // Синхронізація з Xero через Make.com
    if (xeroWebhook) {
      fetch(xeroWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceNumber: invNum,
          contactName: contact || 'Website Customer',
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

    // Повертаємо готовий результат — сайт одразу показує інвойс
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
    console.error('Batch RFQ Route Error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
