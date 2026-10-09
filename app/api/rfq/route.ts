import { NextResponse } from 'next/server';

export const maxDuration = 60; // Дозволяємо до 60 секунд на глибокий аналіз ринку UK

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      partNumber,
      machineModel,
      quantity,
      country,
      contact,
      invoiceNumber,
    } = body;

    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    const pplxKey = process.env.PERPLEXITY_API_KEY;
    const tgToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChatId = process.env.TELEGRAM_CHAT_ID;
    const xeroWebhook = process.env.XERO_WEBHOOK_URL;

    // 1. АГЕНТСЬКИЙ ПОШУК РЕАЛЬНОГО ДЖЕРЕЛА ТА ЦІНИ В UK
    let supplierPrice = 0;
    let supplierSourceUrl = '';
    let supplierTitle = `${partNumber} ${machineModel || ''}`.trim();
    let weightKgPerUnit = 1.0;
    let supplierStoreName = 'UK Parts Distributor';

    if (pplxKey) {
      try {
        const agentPrompt = `
Search live UK spare parts suppliers, distributors, and stores (such as Vicary Plant, Holt JCB, Plant Spares Online, AP Air Europe, Agriline Diesel, eBay UK, or Donaldson UK distributors) for:
Part Number: "${partNumber}"
Machine/Application: "${machineModel || 'Heavy machinery'}"

Find:
1. Current actual UK purchase price in British Pounds (GBP £).
2. The specific direct URL or store website where this exact or equivalent part can be bought right now.
3. Realistic physical weight per unit in kilograms (kg).
4. Full OEM or aftermarket product name.
5. Name of the UK supplier/store.

Return ONLY a valid JSON object without markdown fences, commentary, or backticks:
{
  "buyPriceGbp": 45.50,
  "sourceUrl": "https://...",
  "weightKg": 1.2,
  "productName": "Donaldson P553004 Fuel Filter Water Separator",
  "storeName": "Vicary Plant Spares UK"
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
                  'You are an expert UK machinery procurement agent. Search and extract verified real-world pricing and direct purchase links in the UK. Output raw valid JSON only.',
              },
              { role: 'user', content: agentPrompt },
            ],
            temperature: 0.1,
          }),
        });

        if (pplxRes.ok) {
          const pplxData = await pplxRes.json();
          const rawText = pplxData.choices?.[0]?.message?.content || '{}';
          const cleanJson = rawText
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();

          const parsed = JSON.parse(cleanJson);

          if (parsed.buyPriceGbp && Number(parsed.buyPriceGbp) > 0) {
            supplierPrice = Math.round(Number(parsed.buyPriceGbp) * 100) / 100;
          }
          if (parsed.sourceUrl && parsed.sourceUrl.startsWith('http')) {
            supplierSourceUrl = parsed.sourceUrl;
          }
          if (parsed.weightKg && Number(parsed.weightKg) > 0) {
            weightKgPerUnit = Math.round(Number(parsed.weightKg) * 10) / 10;
          }
          if (parsed.productName) {
            supplierTitle = parsed.productName;
          }
          if (parsed.storeName) {
            supplierStoreName = parsed.storeName;
          }
        }
      } catch (err) {
        console.error('Perplexity Agent search error:', err);
      }
    }

    // Резервна верифікація за базою, якщо API повернув 0
    if (supplierPrice <= 0) {
      const fallbackCatalog: Record<string, { price: number; kg: number; title: string }> = {
        'p553004': { price: 14.5, kg: 0.6, title: 'Фільтр Donaldson P553004' },
        'p535114': { price: 34.0, kg: 1.8, title: 'Фільтр Donaldson P535114 RadialSeal' },
        '26561117': { price: 21.0, kg: 0.65, title: 'Фільтр паливний Perkins 26561117' },
        '332/y3163': { price: 48.0, kg: 0.4, title: 'Ремінь привідний JCB 332/Y3163' },
        '458/20403': { price: 260.0, kg: 16.0, title: 'Головна пара моста JCB 458/20403' },
        '149298': { price: 145.0, kg: 4.5, title: 'Шестерня планетарна Carraro 149298' },
        'a10vso71': { price: 620.0, kg: 28.0, title: 'Гідронасос Rexroth A10VSO71' },
      };

      const cleanCode = partNumber.toLowerCase().trim();
      if (fallbackCatalog[cleanCode]) {
        supplierPrice = fallbackCatalog[cleanCode].price;
        weightKgPerUnit = fallbackCatalog[cleanCode].kg;
        supplierTitle = fallbackCatalog[cleanCode].title;
      } else {
        // Динамічний базовий орієнтир ринку
        supplierPrice = 45.0;
        weightKgPerUnit = 1.2;
      }

      supplierSourceUrl = `https://www.google.co.uk/search?q=${encodeURIComponent(
        `${partNumber}${machineModel || ''} buy UK machinery parts`
      )}`;
      supplierStoreName = 'Google UK Industrial Search';
    }

    // 2. КОМЕРЦІЙНА НАЦІНКА ТА ЗАХИСТ ВІД МІНУСУ
    // Комерційна маржа 30% (але не менше £12 на позиції)
    const marginPerUnit = Math.max(12, Math.round(supplierPrice * 0.3));
    const clientUnitPrice = Math.round(supplierPrice + marginPerUnit);

    // 3. ПОВНА КОНСОЛІДАЦІЯ ЛОГІСТИКИ NOVA POST GLOBAL
    const totalBatchWeightKg = Math.round(weightKgPerUnit * qty * 10) / 10;
    let shippingCost = 27;
    let parcelType = 'Nova Post Small (до 2 кг)';

    if (totalBatchWeightKg <= 2.0) {
      shippingCost = 27;
      parcelType = `Nova Post Small (${totalBatchWeightKg} кг)`;
    } else if (totalBatchWeightKg <= 10.0) {
      shippingCost = 41;
      parcelType = `Nova Post Medium (${totalBatchWeightKg} кг)`;
    } else if (totalBatchWeightKg <= 30.0) {
      shippingCost = 68;
      parcelType = `Nova Post Large (${totalBatchWeightKg} кг)`;
    } else if (totalBatchWeightKg <= 60.0) {
      shippingCost = 115;
      parcelType = `Nova Post Heavy 2-Box (${totalBatchWeightKg} кг)`;
    } else if (totalBatchWeightKg <= 150.0) {
      shippingCost = 165;
      parcelType = `Mini Pallet Freight (${totalBatchWeightKg} кг)`;
    } else {
      shippingCost = 240;
      parcelType = `Euro-Pallet Freight (${totalBatchWeightKg} кг)`;
    }

    const clientTotal = clientUnitPrice * qty + shippingCost;
    const totalEstimatedProfit = marginPerUnit * qty;

    // 4. МИТТЄВА ВІДПРАВКА КАРТКИ ЗАКУПІВЛІ В TELEGRAM
    if (tgToken && tgChatId) {
      const cleanUrl = supplierSourceUrl.startsWith('http')
        ? supplierSourceUrl
        : `https://www.google.co.uk/search?q=${encodeURIComponent(`${partNumber} UK buy`)}`;

      const tgMessage = `🚨 <b>НОВИЙ B2B ЗАПИТ: ${invoiceNumber || 'NLG-ORDER'}</b>
━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ <b>Артикул:</b> <code>${partNumber}</code>
🚜 <b>Техніка / Вузол:</b> ${machineModel || 'Спецтехніка'}
🏷 <b>Опис:</b> ${supplierTitle}
📦 <b>Партія:</b> ${qty} шт | Сумарна вага: <b>${totalBatchWeightKg} кг</b>
🚚 <b>Логістика:</b> ${parcelType} — <b>£${shippingCost}</b>

👤 <b>Клієнт:</b> ${contact}
📍 <b>Країна доставки:</b> ${country || 'Україна'}

💰 <b>РОЗРАХУНОК ФІНАНСІВ:</b>
• Ціна в інвойсі клієнту: <b>£${clientUnitPrice}</b> / шт
• Всього до сплати клієнтом: <b>£${clientTotal}</b> (з доставкою)
• Орієнтир закупки в UK: <b>£${supplierPrice}</b> / шт
• Джерело / магазин: <b>${supplierStoreName}</b>
• <b>ТВІЙ ЧИСТИЙ ПРИБУТОК:</b> <b>£${totalEstimatedProfit}</b> 🔥

🛒 <b>ДЕ КУПИТИ В АНГЛІЇ (ПРЯМЕ ПОСИЛАННЯ):</b>
👉 <a href="${cleanUrl}">Відкрити сторінку закупівлі товару</a>`;

      try {
        await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: tgChatId,
            text: tgMessage,
            parse_mode: 'HTML',
            disable_web_page_preview: false,
          }),
        });
      } catch (tgErr) {
        console.error('Telegram API notification error:', tgErr);
      }
    }

    // 5. ДУБЛЮВАННЯ В XERO ЧЕРЕЗ WEBHOOK MAKE
    if (xeroWebhook) {
      try {
        await fetch(xeroWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            invoiceNumber: invoiceNumber || `NLG-${Date.now()}`,
            contactName: contact || 'Website Client',
            itemDescription: `${supplierTitle} (${partNumber}) x${qty}`,
            quantity: qty,
            unitAmount: clientUnitPrice,
            shippingAmount: shippingCost,
            currencyCode: 'GBP',
            date: new Date().toISOString().split('T')[0],
          }),
        });
      } catch (xeroErr) {
        console.error('Xero Webhook error:', xeroErr);
      }
    }

    // Відповідь клієнтській частині
    return NextResponse.json({
      success: true,
      unitPrice: clientUnitPrice,
      shippingCost,
      parcelType,
      totalWeightKg: totalBatchWeightKg,
      categoryLabel: supplierTitle,
      total: clientTotal,
    });
  } catch (error) {
    console.error('B2B Agent Route Error:', error);
    return NextResponse.json({ error: 'Server internal error' }, { status: 500 });
  }
}
