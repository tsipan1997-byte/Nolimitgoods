import { NextResponse } from 'next/server';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

function cleanPartNumber(pn: string): string {
  return pn.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().trim();
}

// 1. БАЗА ШВИДКИХ ПЕРЕВІРЕНИХ ЗАПЧАСТИН (0.01 сек)
const VERIFIED_OEM_CACHE: Record<
  string,
  { title: string; buyGbp: number; weightKg: number; supplier: string }
> = {
  // Fleetguard
  af25627nf: { title: 'Fleetguard AF25627NF Air Filter', buyGbp: 28.5, weightKg: 1.1, supplier: 'Fleetguard UK Hub' },
  fk11008nn: { title: 'Fleetguard FK11008NN NanoNet Fuel Filter Kit', buyGbp: 34.8, weightKg: 0.95, supplier: 'Cummins Power UK' },
  ab15803: { title: 'Fleetguard AB15803 Air Breather Filter', buyGbp: 16.2, weightKg: 0.45, supplier: 'Inline Filters UK' },
  lf16015: { title: 'Fleetguard LF16015 Lube Filter', buyGbp: 11.2, weightKg: 0.55, supplier: 'Fleetguard UK Depot' },
  fs19732: { title: 'Fleetguard FS19732 Fuel Water Separator', buyGbp: 22.4, weightKg: 0.8, supplier: 'Inline Filters UK' },

  // Donaldson
  p553004: { title: 'Donaldson P553004 Fuel Filter Water Separator', buyGbp: 14.5, weightKg: 0.6, supplier: 'Inline Filters UK' },
  p535114: { title: 'Donaldson P535114 Air Filter Primary Round', buyGbp: 175.4, weightKg: 8.08, supplier: 'FilterFinder UK' },
  p550388: { title: 'Donaldson P550388 Lube Filter Spin-On', buyGbp: 12.8, weightKg: 0.65, supplier: 'FilterFinder UK' },
  p550425: { title: 'Donaldson P550425 Hydraulic Filter', buyGbp: 24.1, weightKg: 0.9, supplier: 'FilterFinder UK' },

  // JCB Genuine
  '332y3163': { title: 'JCB 332/Y3163 Fan Alternator Poly-V Belt', buyGbp: 53.3, weightKg: 0.4, supplier: 'Holt JCB Parts' },
  '45820403': { title: 'JCB 458/20403 Axle Hub Seal Cover Plate', buyGbp: 4.87, weightKg: 0.15, supplier: 'Vicary Plant UK' },
  '32925682': { title: 'JCB 32/925682 Fuel Filter Element', buyGbp: 18.9, weightKg: 0.5, supplier: 'Vicary Plant UK' },
  '32925346': { title: 'JCB 32/925346 Hydraulic Filter High Pressure', buyGbp: 22.5, weightKg: 0.85, supplier: 'Vicary Plant UK' },
  '02100073': { title: 'JCB 02/100073 Oil Filter Element', buyGbp: 9.4, weightKg: 0.6, supplier: 'Vicary Plant UK' },

  // Perkins & Carraro
  '26561117': { title: 'Perkins 26561117 Secondary Fuel Filter Element', buyGbp: 21.0, weightKg: 0.65, supplier: 'DiPerk Power Solutions UK' },
  '26560201': { title: 'Perkins 26560201 Fuel Filter Water Separator', buyGbp: 26.5, weightKg: 0.75, supplier: 'DiPerk Power Solutions UK' },
  '149298': { title: 'Carraro 149298 Planetary Gear Hub', buyGbp: 75.0, weightKg: 2.3, supplier: 'IntaTrac UK' },
  '047702': { title: 'Carraro 047702 Oil Seal Cassette Hub', buyGbp: 18.2, weightKg: 0.25, supplier: 'IntaTrac UK' },
  a10vso71: { title: 'Bosch Rexroth A10VSO71 Hydraulic Pump', buyGbp: 890.0, weightKg: 33.0, supplier: 'Hydraulic Megastore UK' },
};

// 2. ЗАПИТ ДО PERPLEXITY SONAR ДЛЯ НЕВІДОМИХ ДЕТАЛЕЙ
async function queryPerplexityForPart(
  partNumber: string,
  brandOrModel: string,
  apiKey: string
): Promise<{ title: string; priceGbp: number; weightKg: number; supplier: string }> {
  const prompt = `Task: Sourcing heavy machinery OEM spare part.
Part Number: "${partNumber}"
Brand/Equipment: "${brandOrModel}"

Find current live European or UK trade supplier price EXCLUDING VAT.
Suppliers to search: FilterFinder, Inline Filters, TVH, Kramp, Vicary Plant, Holt JCB, DiPerk, Plant Spares Online, Cummins dealers.
If the price is in EUR (€), convert to GBP using 1 EUR = 0.85 GBP.
If price includes 20% VAT, divide by 1.2.
Estimate parcel shipping weight in kg.

Respond ONLY with valid JSON:
{
  "title": "Exact OEM Part Name",
  "priceGbp": 0.00,
  "weightKg": 1.0,
  "supplier": "Store/Distributor Name"
}`;

  const res = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'sonar',
      messages: [
        {
          role: 'system',
          content: 'You are an autonomous European B2B industrial procurement system. Output ONLY a raw JSON object. No explanation, no markdown ticks.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.1,
    }),
  });

  if (!res.ok) {
    throw new Error(`Perplexity API HTTP error: ${res.status}`);
  }

  const json = await res.json();
  const rawText: string = json.choices?.[0]?.message?.content || '';

  let parsed: any = null;
  const jsonMatch = rawText.match(/\{[\s\S]*?\}/);
  if (jsonMatch) {
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch {}
  }

  let price = Number(parsed?.priceGbp);
  if (isNaN(price) || price <= 0) {
    const priceRegex = /(?:£|GBP|\bprice\b[^\d]*)\s*([0-9]+(?:\.[0-9]{1,2})?)/i;
    const match = rawText.match(priceRegex);
    if (match && match[1]) {
      price = parseFloat(match[1]);
    }
  }

  let weight = Number(parsed?.weightKg);
  if (isNaN(weight) || weight <= 0) {
    const weightMatch = /([0-9]+(?:\.[0-9]+)?)\s*kg/i.exec(rawText);
    weight = weightMatch ? parseFloat(weightMatch[1]) : 1.2;
  }

  if (isNaN(price) || price <= 0) {
    throw new Error(`Price not found for ${partNumber}`);
  }

  return {
    title: parsed?.title || `${brandOrModel} ${partNumber}`.trim(),
    priceGbp: Math.round(price * 100) / 100,
    weightKg: Math.round(weight * 10) / 10,
    supplier: parsed?.supplier || 'UK/EU Machinery Network',
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items = [], country = 'Україна', contact = '', invoiceNumber = '' } = body;

    const rawItems: any[] =
      Array.isArray(items) && items.length > 0
        ? items
        : [{ partNumber: body.partNumber || '', machineModel: body.machineModel || '', quantity: body.quantity || 1 }];

    const validItems = rawItems
      .slice(0, 10)
      .filter((it) => String(it.partNumber || '').trim().length > 0)
      .map((it) => ({
        partNumber: String(it.partNumber).trim(),
        machineModel: String(it.machineModel || 'Heavy Equipment').trim(),
        quantity: Math.max(1, Number(it.quantity) || 1),
      }));

    if (validItems.length === 0) {
      return NextResponse.json({ error: 'Вкажіть хоча б один артикул' }, { status: 400 });
    }

    const pplxKey = process.env.PERPLEXITY_API_KEY;
    const tgToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChatId = process.env.TELEGRAM_CHAT_ID;
    const xeroWebhook = process.env.XERO_WEBHOOK_URL;

    // Обробка кожної деталі в специфікації
    const processedItems = await Promise.all(
      validItems.map(async (item) => {
        const cleaned = cleanPartNumber(item.partNumber);

        let buyPriceGbp = 0;
        let unitWeightKg = 1.0;
        let partTitle = `${item.machineModel} ${item.partNumber}`.trim();
        let storeName = 'UK Distribution Hub';

        if (VERIFIED_OEM_CACHE[cleaned]) {
          const cached = VERIFIED_OEM_CACHE[cleaned];
          buyPriceGbp = cached.buyGbp;
          unitWeightKg = cached.weightKg;
          partTitle = cached.title;
          storeName = cached.supplier;
        } else if (pplxKey) {
          try {
            const found = await queryPerplexityForPart(item.partNumber, item.machineModel, pplxKey);
            buyPriceGbp = found.priceGbp;
            unitWeightKg = found.weightKg;
            partTitle = found.title;
            storeName = found.supplier;
          } catch (e) {
            console.warn(`Perplexity fallback for ${item.partNumber}:`, e);
          }
        }

        if (buyPriceGbp <= 0) {
          buyPriceGbp = 32.0;
          unitWeightKg = 1.5;
          storeName = 'Coventry OEM Hub';
        }

        const clientUnitPriceGbp = Math.round(buyPriceGbp * 1.20 * 100) / 100;
        const totalWeightKg = Math.round(unitWeightKg * item.quantity * 10) / 10;
        const itemTotalGbp = Math.round(clientUnitPriceGbp * item.quantity * 100) / 100;

        return {
          partNumber: item.partNumber,
          machineModel: item.machineModel,
          quantity: item.quantity,
          partTitle,
          supplierBuyPriceGbp: buyPriceGbp,
          clientUnitPriceGbp,
          unitWeightKg,
          totalWeightKg,
          itemTotalGbp,
          storeName,
        };
      })
    );

    // Розрахунок доставки Nova Post Global
    const totalOrderWeightKg = Math.round(
      processedItems.reduce((acc, curr) => acc + curr.totalWeightKg, 0) * 10
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
      processedItems.reduce((acc, curr) => acc + curr.itemTotalGbp, 0) * 100
    ) / 100;
    const finalTotalGbp = Math.round((itemsSubtotalGbp + shippingCost) * 100) / 100;
    const totalProfitGbp = Math.round(
      processedItems.reduce((acc, curr) => acc + (curr.clientUnitPriceGbp - curr.supplierBuyPriceGbp) * curr.quantity, 0) * 100
    ) / 100;

    const invNum = invoiceNumber || `NLG-PI-${Math.floor(100000 + Math.random() * 900000)}`;

    // ВИПРАВЛЕНА ВІДПРАВКА В TELEGRAM (без зайвого знака $)
    if (tgToken && tgChatId) {
      const lines = processedItems
        .map(
          (it, idx) =>
            `${idx + 1}. <b>${it.partTitle}</b> [<code>${it.partNumber}</code>]\n   • ${it.quantity} шт × £${it.clientUnitPriceGbp.toFixed(2)} (Закупка: £${it.supplierBuyPriceGbp.toFixed(2)} / <i>${it.storeName}</i>)`
        )
        .join('\n\n');

      const tgMsg = `🚀 <b>НОВИЙ B2B РАХУНОК: ${invNum}</b>
━━━━━━━━━━━━━━━━━━━━━━━━
📋 <b>Специфікація (${processedItems.length} поз.):</b>
${lines}

━━━━━━━━━━━━━━━━━━━━━━━━
📦 <b>Загальна вага:</b> <b>${totalOrderWeightKg} кг</b>
🚚 <b>Доставка Nova Post:</b> ${parcelType} — <b>£${shippingCost}</b>

👤 <b>Клієнт:</b> ${contact || 'Не вказано'}
📍 <b>Країна:</b> ${country}

💰 <b>ФІНАНСИ (+20% маржі):</b>
- Запчастини: <b>£${itemsSubtotalGbp.toFixed(2)}</b>
- Доставка: <b>£${shippingCost.toFixed(2)}</b>
- <b>РАЗОМ ДО СПЛАТИ:</b> <b>£${finalTotalGbp.toFixed(2)}</b>
- <b>ЧИСТИЙ ПРИБУТОК:</b> <b>£${totalProfitGbp.toFixed(2)}</b> 🔥`;

      try {
        await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: tgChatId, text: tgMsg, parse_mode: 'HTML' }),
        });
      } catch (tgErr) {
        console.error('Помилка відправки в Telegram:', tgErr);
      }
    } else {
      console.warn('TELEGRAM_BOT_TOKEN або TELEGRAM_CHAT_ID не налаштовані у Vercel!');
    }

    // СИНХРОНІЗАЦІЯ З XERO (через Make.com)
    if (xeroWebhook) {
      try {
        await fetch(xeroWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            invoiceNumber: invNum,
            contactName: contact || 'B2B Client',
            country,
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
        });
      } catch (xeroErr) {
        console.error('Помилка відправки в Xero Webhook:', xeroErr);
      }
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
    console.error('B2B Sourcing Route Fatal Error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
