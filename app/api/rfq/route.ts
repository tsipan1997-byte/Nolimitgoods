import { NextResponse } from 'next/server';

export const maxDuration = 60;

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

    const pplxKey = process.env.PERPLEXITY_API_KEY;
    const tgToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChatId = process.env.TELEGRAM_CHAT_ID;
    const xeroWebhook = process.env.XERO_WEBHOOK_URL;

    let found = false;
    let supplierBuyPrice = 0;
    let unitWeightKg = 0;
    let partTitle = `${rawPart} ${rawModel}`.trim();
    let purchaseUrl = '';
    let storeName = '';

    // 1. ПРЯМИЙ ПОШУК ЧЕРЕЗ АГЕНТА В РЕАЛЬНОМУ ЧАСІ В UK
    if (pplxKey) {
      try {
        const agentPrompt = `
Search live UK industrial distributors and specialist stores (such as FilterFinder UK, Inline Filters UK, Vicary Plant, Watling JCB, Holt JCB, DiPerk, AP Air Europe, eBay UK) for:
Part Number: "${rawPart}"
Application/Brand: "${rawModel}"

CRITICAL INSTRUCTIONS:
1. Extract the actual current price in GBP (£) EXCLUDING VAT (trade price).
2. Extract the actual product physical weight in kilograms (kg) from the technical specification table.
3. Provide the direct URL to the exact UK product page.
4. If exact part is not found or no verified UK store URL exists, set "found": false.

Return ONLY a raw JSON object without markdown fences, commentary, or backticks:
{
  "found": boolean,
  "productName": "string",
  "buyPriceGbpExVat": number,
  "weightKg": number,
  "purchaseUrl": "string",
  "storeName": "string"
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
                  'You are a strict UK heavy machinery parts sourcing agent. Extract exact trade prices (ex VAT) and technical spec weights from UK stores. Never estimate or guess. Output raw JSON only.',
              },
              { role: 'user', content: agentPrompt },
            ],
            temperature: 0.05,
          }),
        });

        if (pplxRes.ok) {
          const pplxData = await pplxRes.json();
          const rawText = pplxData.choices?.[0]?.message?.content || '{}';
          const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanJson);

          if (
            parsed.found &&
            Number(parsed.buyPriceGbpExVat) > 0 &&
            parsed.purchaseUrl &&
            parsed.purchaseUrl.startsWith('http')
          ) {
            found = true;
            supplierBuyPrice = Math.round(Number(parsed.buyPriceGbpExVat) * 100) / 100;
            unitWeightKg = Number(parsed.weightKg) > 0 ? Math.round(Number(parsed.weightKg) * 100) / 100 : 1.5;
            partTitle = parsed.productName || `${rawPart} ${rawModel}`;
            purchaseUrl = parsed.purchaseUrl;
            storeName = parsed.storeName || 'UK Parts Supplier';
          }
        }
      } catch (err) {
        console.error('Agent lookup error:', err);
      }
    }

    // 2. ЯКЩО АГЕНТ НЕ ЗНАЙШОВ ТОЧНОЇ ЦІНИ — ПЕРЕХОДИМО В СТАТУС "WAIT FOR RFQ"
    if (!found || supplierBuyPrice <= 0) {
      if (tgToken && tgChatId) {
        const rfqAlert = `⚠️ <b>НОВИЙ ЗАПИТ: ПОТРІБНА РУЧНА ОЦІНКА (WAIT FOR RFQ)</b>
━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ <b>Артикул:</b> <code>${rawPart}</code>
🚜 <b>Техніка:</b> ${rawModel || 'Не вказано'}
📦 <b>Кількість:</b> ${qty} шт
👤 <b>Клієнт:</b> ${contact}
📍 <b>Локація:</b> ${country}

ℹ️ <i>Агент не знайшов прямого підтвердженого джерела в UK. Інвойс клієнту НЕ згенеровано, щоб уникнути збитків. Перевірте ціну вручну та зв'яжіться з замовником!</i>`;

        try {
          await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: tgChatId, text: rfqAlert, parse_mode: 'HTML' }),
          });
        } catch (tgErr) {
          console.error('Telegram notification error:', tgErr);
        }
      }

      return NextResponse.json({
        found: false,
        status: 'wait_for_rfq',
        message: 'Артикул передано черговому фахівцю в Ковентрі для ручного розрахунку специфікації.',
      });
    }

    // 3. РОЗРАХУНОК КОМЕРЦІЙНОЇ МАРЖІ
    let marginPerUnit = 0;
    if (supplierBuyPrice <= 15) {
      marginPerUnit = 3.50;
    } else if (supplierBuyPrice <= 50) {
      marginPerUnit = Math.max(8.0, Math.round(supplierBuyPrice * 0.35));
    } else if (supplierBuyPrice <= 200) {
      marginPerUnit = Math.max(25.0, Math.round(supplierBuyPrice * 0.25));
    } else {
      marginPerUnit = Math.max(50.0, Math.round(supplierBuyPrice * 0.20));
    }

    const clientUnitPrice = Math.round((supplierBuyPrice + marginPerUnit) * 100) / 100;

    // 4. КОНСОЛІДАЦІЯ ЛОГІСТИКИ NOVA POST ЗА РЕАЛЬНОЮ ВАГОЮ
    const totalBatchWeightKg = Math.round(unitWeightKg * qty * 10) / 10;
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
      parcelType = `Nova Post Large (консолідований ящик до 30 кг • ${totalBatchWeightKg} кг)`;
    } else if (totalBatchWeightKg <= 60.0) {
      shippingCost = 115;
      parcelType = `Nova Post Heavy (консолідація 2 місця • ${totalBatchWeightKg} кг)`;
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

    // 5. НАДСИЛАННЯ В TELEGRAM ІЗ РЕАЛЬНИМ ЛІНКОМ
    if (tgToken && tgChatId) {
      const msg = `✅ <b>ВЕРИФІКОВАНИЙ B2B РАХУНОК: ${invNumber}</b>
━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ <b>Артикул:</b> <code>${rawPart}</code>
🏷 <b>Опис:</b> ${partTitle}
📦 <b>Партія:</b> ${qty} шт | Сумарна вага: <b>${totalBatchWeightKg} кг</b> (по ${unitWeightKg} кг/шт)
🚚 <b>Логістика:</b> ${parcelType} — <b>£${shippingCost}</b>

👤 <b>Клієнт:</b> ${contact}
📍 <b>Країна:</b> ${country}

💰 <b>ФІНАНСИ:</b>
• Ціна клієнту: <b>£${clientUnitPrice.toFixed(2)}</b> / шт
• Всього інвойс: <b>£${clientTotal.toFixed(2)}</b>
• Закупка в UK: <b>£${supplierBuyPrice.toFixed(2)}</b> / шт (${storeName})
• <b>ТВІЙ ПРИБУТОК:</b> <b>£${totalProfit.toFixed(2)}</b> 🔥

🛒 <b>ПРЯМЕ ПОСИЛАННЯ НА ЗАКУПІВЛЮ:</b>
👉 <a href="${purchaseUrl}">Перейти до магазину в UK</a>`;

      try {
        await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: tgChatId, text: msg, parse_mode: 'HTML' }),
        });
      } catch (tgErr) {
        console.error('Telegram notification error:', tgErr);
      }
    }

    // 6. XERO WEBHOOK
    if (xeroWebhook) {
      try {
        await fetch(xeroWebhook, {
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
        });
      } catch (xeroErr) {
        console.error('Xero error:', xeroErr);
      }
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
  } catch (error) {
    console.error('RFQ Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
