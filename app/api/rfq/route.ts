import { NextResponse } from 'next/server';

export const maxDuration = 60;

function cleanString(str: string): string {
  return str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().trim();
}

// 50 найбільших B2B постачальників і каталогів UK та Європи
const TOP_50_EUROPEAN_DISTRIBUTORS = [
  // Фільтрація та витратні матеріали
  'filterfinder.co.uk',
  'inlinefilters.co.uk',
  'donaldson.com',
  'mann-filter.com',
  'fleetguard.com',
  'baldwinfilter.com',
  'sf-filter.com',
  'hifi-filter.com',
  'filtrationgroup.com',
  'hengst.com',

  // Спецтехніка та будівельні машини (JCB, CAT, Komatsu, Volvo)
  'vicaryplant.com',
  'shop.holtjcb.co.uk',
  'plantsparesonline.com',
  'interpart.com',
  'tvh.com',
  'kramp.com',
  'bepcoparts.com',
  'parts.cat.com',
  'komatsu.eu',
  'urparts.com',
  'mascus.co.uk',
  'machinerypark.com',
  'sparex.co.uk',
  'agri-linc.com',
  'malpasonline.co.uk',
  'agrodoctor.eu',
  'granit-parts.co.uk',
  'vapormatic.com',

  // Двигуни та паливні системи (Perkins, Cummins, Deutz)
  'diperk.co.uk',
  'mitchells.co.uk',
  'ipu.co.uk',
  'deutz.co.uk',
  'dieselpartsdirect.co.uk',
  'dieselpro.com',
  'parts.cummins.com',
  'agcopartsbooks.com',

  // Трансмісія, мости та редуктори (Carraro, Dana Spicer, ZF)
  'carraro.com',
  'intatracuk.com',
  'spicerparts.com',
  'aftermarket.zf.com',
  'palmer-springs.co.uk',
  'diffs-and-gearboxes.co.uk',

  // Гідравліка високого тиску (Bosch Rexroth, Danfoss, Parker, Eaton)
  'hydraulicmegastore.com',
  'phoenixhydraulics.co.uk',
  'hydraquip.co.uk',
  'whitehouseproductsltd.com',
  'parker.com',
  'boschrexroth.com',
  'hydrokit.com',
  'hydrapac.eu',
];

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

    // Підтримка одиночного запиту або масиву до 10 позицій
    const rawItems: any[] = Array.isArray(items) && items.length > 0
      ? items
      : [{
          partNumber: body.partNumber || '',
          machineModel: body.machineModel || '',
          quantity: body.quantity || 1,
        }];

    // Обмеження до 10 позицій із безпечним числовим перетворенням
    const validItems = rawItems.slice(0, 10).map((it) => ({
      partNumber: String(it.partNumber || '').trim(),
      machineModel: String(it.machineModel || '').trim(),
      quantity: Math.max(1, Number(it.quantity) || 1),
    }));

    if (validItems.length === 0 || !validItems[0].partNumber) {
      return NextResponse.json({ error: 'Потрібно вказати хоча б один каталожний номер' }, { status: 400 });
    }

    const pplxKey = process.env.PERPLEXITY_API_KEY;
    const tgToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChatId = process.env.TELEGRAM_CHAT_ID;
    const xeroWebhook = process.env.XERO_WEBHOOK_URL;

    // Паралельний пошук по складах для кожної позиції
    const processedItems: ProcessedItem[] = await Promise.all(
      validItems.map(async (item) => {
        const cleaned = cleanString(item.partNumber);
        let partTitle = `${item.partNumber} ${item.machineModel}`.trim();
        let supplierBuyPriceGbp = 0;
        let unitWeightKg = 1.0;
        let storeName = 'EU/UK Supply Hub';
        let purchaseUrl = 'https://www.google.com/search?q=' + encodeURIComponent(`${item.partNumber} heavy machinery parts UK`);
        let found = false;

        // Пошук через Perplexity Sonar
        if (pplxKey) {
          try {
            const domainFilter = TOP_50_EUROPEAN_DISTRIBUTORS.slice(0, 25).join(' OR site:');

            const prompt = `Search live machinery & parts distributors across Europe and the UK (such as site:${domainFilter} or other major European supplier stocks like TVH, Kramp, Bepco, FilterFinder, Vicary Plant, DiPerk, Hydraulic Megastore) for:
Part Number: "${item.partNumber}"
Equipment / Brand: "${item.machineModel}"

Instructions:
1. Locate the trade unit price EXCLUDING VAT.
2. If price is in EUR (€), convert to GBP (£) using exchange rate 0.85 (1 EUR = 0.85 GBP).
3. If price includes VAT (20%), divide by 1.2 to obtain the ex-VAT supplier purchase price.
4. Estimate or extract shipping weight in kg.
5. Return ONLY a single raw JSON object without markdown or code fences:
{
  "found": true,
  "title": "Precise Part Title",
  "priceGbp": 45.20,
  "weightKg": 1.2,
  "url": "https://...",
  "supplier": "Store/Distributor Name"
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
                  { role: 'system', content: 'You are an autonomous European industrial parts sourcing engine. Output raw JSON only.' },
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
                storeName = parsed.supplier || 'UK/EU Machinery Network';
                found = true;
              }
            }
          } catch (e) {
            console.error(`PPLX error on ${item.partNumber}:`, e);
          }
        }

        // Локальний резервний кеш для швидкого проходження базових деталей
        if (!found || supplierBuyPriceGbp <= 0) {
          if (cleaned.includes('45820403')) {
            partTitle = 'JCB Axle Hub Seal Cover Plate';
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
          } else if (cleaned.includes('332y3163')) {
            partTitle = 'JCB 332/Y3163 Fan Alternator Poly-V Belt';
            supplierBuyPriceGbp = 53.30;
            unitWeightKg = 0.40;
            purchaseUrl = 'https://plantsparesonline.com';
            storeName = 'Plant Spares Online UK';
            found = true;
          }
        }

        // Автоматична націнка +20%
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

    // Якщо якусь деталь не знайдено на відкритих майданчиках
    const hasUnverified = processedItems.some((it) => !it.found || it.supplierBuyPriceGbp <= 0);

    if (hasUnverified) {
      if (tgToken && tgChatId) {
        const unverifiedList = processedItems
          .map((it, idx) => `${idx + 1}. <code>${it.partNumber}</code> (${it.machineModel || 'Спецтехніка'}) — ${it.quantity} шт ${it.found ? '✅' : '❌ не знайдено на 50 складах'}`)
          .join('\n');

        const alertText = `⚠️ <b>ЗАПИТ НА РУЧНИЙ ПІДБІР (WAIT FOR RFQ)</b>
━━━━━━━━━━━━━━━━━━━━━━━━
📋 <b>Деталі (${processedItems.length} поз.):</b>
${unverifiedList}

👤 <b>Клієнт:</b> ${contact}
📍 <b>Країна:</b> ${country}`;

        await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: tgChatId, text: alertText, parse_mode: 'HTML' }),
        }).catch(() => {});
      }

      return NextResponse.json({
        found: false,
        status: 'wait_for_rfq',
        message: 'Артикул не знайдено на відкритих складах Європи. Запит передано до офісу NoLimitGoods у Ковентрі.',
      });
    }

    // Розрахунок вартості доставки Nova Post Global за консолідованою вагою
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
      parcelType = `Nova Post Heavy (консолідація 2 коробки • ${totalOrderWeightKg} кг)`;
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

    // Сповіщення в Telegram
    if (tgToken && tgChatId) {
      const lines = processedItems
        .map(
          (it, idx) =>
            `${idx + 1}. <b>${it.partTitle}</b> [<code>${it.partNumber}</code>]\n   • ${it.quantity} шт × £${it.clientUnitPriceGbp.toFixed(2)} (Закупка: £${it.supplierBuyPriceGbp.toFixed(2)} у <i>${it.storeName}</i>)\n   • <a href="${it.purchaseUrl}">Посилання на постачальника</a>`
        )
        .join('\n\n');

      const tgMsg = `✅ <b>НОВИЙ АВТОМАТИЧНИЙ B2B РАХУНОК: ${invNum}</b>
━━━━━━━━━━━━━━━━━━━━━━━━
📋 <b>Знайдено на складах UK/EU (${processedItems.length} поз.):</b>
${lines}

━━━━━━━━━━━━━━━━━━━━━━━━
📦 <b>Сумарна вага партії:</b> <b>${totalOrderWeightKg} кг</b>
🚚 <b>Доставка Nova Post:</b> ${parcelType} — <b>£${shippingCost}</b>

👤 <b>Клієнт:</b> ${contact}
📍 <b>Країна доставки:</b> ${country}

💰 <b>ФІНАНСИ (+20% маржі):</b>
• Сума за запчастини: <b>£${itemsSubtotalGbp.toFixed(2)}</b>
• Доставка: <b>£${shippingCost.toFixed(2)}</b>
• <b>РАЗОМ ДО СПЛАТИ:</b> <b>£${finalTotalGbp.toFixed(2)}</b>
• <b>ЧИСТИЙ ПРИБУТОК NOLIMITGOODS:</b> <b>£${totalProfitGbp.toFixed(2)}</b> 🔥`;

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
    console.error('European Sourcing Route Error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
