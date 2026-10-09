import { NextResponse } from 'next/server';

export const maxDuration = 60;

// ============================================================================
// 1. СТРУКТУРИ ДАНИХ ТА ТИПИ
// ============================================================================
export interface PartCatalogItem {
  oemNumber: string;
  normalizedCode: string;
  brand: string;
  partNameUk: string;
  partNameEn: string;
  category: 'seal_hardware' | 'filtration' | 'electrical_belts' | 'engine_fuel' | 'hydraulics' | 'drivetrain_heavy';
  referencePriceGbp: number;
  unitWeightKg: number;
  dimensionsCm: { length: number; width: number; height: number };
  directStoreUrl: string;
  storeName: string;
  inStockUk: boolean;
}

export interface VerificationResult {
  isVerified: boolean;
  status: 'verified_instant' | 'verified_agent' | 'wait_for_rfq';
  partName: string;
  buyPriceGbp: number;
  weightKg: number;
  supplierUrl: string;
  supplierName: string;
  confidenceScore: number;
}

export interface LogisticsConsolidation {
  tierName: string;
  shippingCostGbp: number;
  actualWeightKg: number;
  volumetricWeightKg: number;
  billableWeightKg: number;
  boxesCount: number;
  palletRequired: boolean;
}

// ============================================================================
// 2. ВЕЛИКА ЕТАЛОННА БАЗА ДЕТАЛЕЙ ДЛЯ СПЕЦТЕХНІКИ В UK
// ============================================================================
const VERIFIED_MASTER_CATALOG: PartCatalogItem[] = [
  // --- JCB OEM Parts ---
  {
    oemNumber: '458/20403',
    normalizedCode: '45820403',
    brand: 'JCB',
    partNameUk: 'Кришка сальника маточини моста (Hub Seal Cover Plate)',
    partNameEn: 'JCB Axle Hub Seal Cover Plate',
    category: 'seal_hardware',
    referencePriceGbp: 4.87,
    unitWeightKg: 0.15,
    dimensionsCm: { length: 12, width: 12, height: 2 },
    directStoreUrl: 'https://vicaryplant.com/products/hub-seal-cover-plate-458-20403',
    storeName: 'Vicary Plant Spares UK',
    inStockUk: true,
  },
  {
    oemNumber: '332/Y3163',
    normalizedCode: '332y3163',
    brand: 'JCB',
    partNameUk: 'Ремінь багатоклиновий генератора та помпи',
    partNameEn: 'JCB Poly-V Engine Fan Belt',
    category: 'electrical_belts',
    referencePriceGbp: 48.00,
    unitWeightKg: 0.40,
    dimensionsCm: { length: 30, width: 10, height: 4 },
    directStoreUrl: 'https://vicaryplant.com/search?q=332%2FY3163',
    storeName: 'Vicary Plant Spares UK',
    inStockUk: true,
  },
  {
    oemNumber: '32/925682',
    normalizedCode: '32925682',
    brand: 'JCB',
    partNameUk: 'Фільтр гідравлічний напірний JCB',
    partNameEn: 'JCB Hydraulic Oil Filter Element',
    category: 'filtration',
    referencePriceGbp: 38.50,
    unitWeightKg: 1.10,
    dimensionsCm: { length: 25, width: 12, height: 12 },
    directStoreUrl: 'https://vicaryplant.com/search?q=32%2F925682',
    storeName: 'Vicary Plant Spares UK',
    inStockUk: true,
  },
  {
    oemNumber: '02/100073',
    normalizedCode: '02100073',
    brand: 'JCB',
    partNameUk: 'Водяна помпа системи охолодження двигуна Dieselmax',
    partNameEn: 'JCB Engine Water Pump Dieselmax 4.4L',
    category: 'engine_fuel',
    referencePriceGbp: 115.00,
    unitWeightKg: 3.40,
    dimensionsCm: { length: 22, width: 18, height: 16 },
    directStoreUrl: 'https://vicaryplant.com/search?q=02%2F100073',
    storeName: 'Vicary Plant Spares UK',
    inStockUk: true,
  },
  {
    oemNumber: '714/40159',
    normalizedCode: '71440159',
    brand: 'JCB',
    partNameUk: 'Генератор 12V 95A JCB EcoMAX',
    partNameEn: 'JCB Alternator 12V 95A',
    category: 'electrical_belts',
    referencePriceGbp: 165.00,
    unitWeightKg: 6.20,
    dimensionsCm: { length: 24, width: 20, height: 18 },
    directStoreUrl: 'https://vicaryplant.com/search?q=714%2F40159',
    storeName: 'Vicary Plant Spares UK',
    inStockUk: true,
  },
  {
    oemNumber: '320/06047',
    normalizedCode: '32006047',
    brand: 'JCB',
    partNameUk: 'Стартер двигуна 12V 4.2kW',
    partNameEn: 'JCB Starter Motor EcoMAX 12V',
    category: 'electrical_belts',
    referencePriceGbp: 285.00,
    unitWeightKg: 8.80,
    dimensionsCm: { length: 32, width: 20, height: 18 },
    directStoreUrl: 'https://vicaryplant.com/search?q=320%2F06047',
    storeName: 'Vicary Plant Spares UK',
    inStockUk: true,
  },

  // --- Donaldson Filtration ---
  {
    oemNumber: 'P553004',
    normalizedCode: 'p553004',
    brand: 'Donaldson',
    partNameUk: 'Фільтр паливний сепаратор води Spin-on',
    partNameEn: 'Donaldson P553004 Fuel Filter Water Separator',
    category: 'filtration',
    referencePriceGbp: 14.50,
    unitWeightKg: 0.60,
    dimensionsCm: { length: 20, width: 10, height: 10 },
    directStoreUrl: 'https://www.inlinefilters.co.uk/Filters-Fuel/SpinOn/FBW-BF1280',
    storeName: 'Inline Filters UK',
    inStockUk: true,
  },
  {
    oemNumber: 'P535114',
    normalizedCode: 'p535114',
    brand: 'Donaldson',
    partNameUk: 'Фільтр повітряний радіальний RadialSeal',
    partNameEn: 'Donaldson P535114 RadialSeal Air Filter',
    category: 'filtration',
    referencePriceGbp: 34.00,
    unitWeightKg: 1.80,
    dimensionsCm: { length: 38, width: 18, height: 18 },
    directStoreUrl: 'https://www.inlinefilters.co.uk/Filters-Air/RadialSeal/FIN-FA10815',
    storeName: 'Inline Filters UK',
    inStockUk: true,
  },
  {
    oemNumber: 'P550388',
    normalizedCode: 'p550388',
    brand: 'Donaldson',
    partNameUk: 'Фільтр масляний повнопотоковий',
    partNameEn: 'Donaldson P550388 Lube Filter Spin-On',
    category: 'filtration',
    referencePriceGbp: 12.80,
    unitWeightKg: 0.55,
    dimensionsCm: { length: 18, width: 10, height: 10 },
    directStoreUrl: 'https://www.inlinefilters.co.uk/Filters-Lube/SpinOn/FBW-BT230',
    storeName: 'Inline Filters UK',
    inStockUk: true,
  },

  // --- Perkins Engine Spares ---
  {
    oemNumber: '26561117',
    normalizedCode: '26561117',
    brand: 'Perkins',
    partNameUk: 'Фільтр тонкої очистки палива Perkins',
    partNameEn: 'Perkins 26561117 Secondary Fuel Filter Element',
    category: 'filtration',
    referencePriceGbp: 21.00,
    unitWeightKg: 0.65,
    dimensionsCm: { length: 22, width: 11, height: 11 },
    directStoreUrl: 'https://www.diperk.co.uk/part/26561117',
    storeName: 'DiPerk Power Solutions UK',
    inStockUk: true,
  },
  {
    oemNumber: '2654403',
    normalizedCode: '2654403',
    brand: 'Perkins',
    partNameUk: 'Фільтр масляний двигуна Perkins 1104',
    partNameEn: 'Perkins 2654403 Engine Oil Filter',
    category: 'filtration',
    referencePriceGbp: 16.50,
    unitWeightKg: 0.70,
    dimensionsCm: { length: 17, width: 11, height: 11 },
    directStoreUrl: 'https://www.diperk.co.uk/part/2654403',
    storeName: 'DiPerk Power Solutions UK',
    inStockUk: true,
  },
  {
    oemNumber: 'U5MK8267',
    normalizedCode: 'u5mk8267',
    brand: 'Perkins',
    partNameUk: 'Комплект корінних вкладишів колінвалу STD',
    partNameEn: 'Perkins U5MK8267 Main Bearing Kit STD',
    category: 'engine_fuel',
    referencePriceGbp: 95.00,
    unitWeightKg: 1.40,
    dimensionsCm: { length: 25, width: 15, height: 8 },
    directStoreUrl: 'https://www.diperk.co.uk/part/U5MK8267',
    storeName: 'DiPerk Power Solutions UK',
    inStockUk: true,
  },

  // --- Drivetrain & Hydraulics ---
  {
    oemNumber: '149298',
    normalizedCode: '149298',
    brand: 'Carraro',
    partNameUk: 'Шестерня планетарного редуктора маточини моста',
    partNameEn: 'Carraro 149298 Planetary Axle Hub Gear',
    category: 'drivetrain_heavy',
    referencePriceGbp: 145.00,
    unitWeightKg: 4.50,
    dimensionsCm: { length: 16, width: 16, height: 8 },
    directStoreUrl: 'https://carrarospares.com/products/149298',
    storeName: 'Carraro Spares UK Hub',
    inStockUk: true,
  },
  {
    oemNumber: 'A10VSO71',
    normalizedCode: 'a10vso71',
    brand: 'Rexroth',
    partNameUk: 'Гідравлічний аксіально-поршневий насос регульований',
    partNameEn: 'Rexroth A10VSO71 Variable Axial Piston Pump',
    category: 'hydraulics',
    referencePriceGbp: 620.00,
    unitWeightKg: 28.00,
    dimensionsCm: { length: 42, width: 28, height: 26 },
    directStoreUrl: 'https://www.hydraulicsonline.com/pumps/bosch-rexroth-a10vso',
    storeName: 'Hydraulics Online UK',
    inStockUk: true,
  },
  {
    oemNumber: '400508-00062',
    normalizedCode: '40050800062',
    brand: 'Doosan',
    partNameUk: 'Бортовий редуктор ходу з гідромотором у зборі',
    partNameEn: 'Doosan Final Drive Travel Motor Assembly',
    category: 'drivetrain_heavy',
    referencePriceGbp: 1250.00,
    unitWeightKg: 58.00,
    dimensionsCm: { length: 55, width: 55, height: 48 },
    directStoreUrl: 'https://www.plantsparesonline.com/final-drives/doosan',
    storeName: 'Plant Spares Online UK',
    inStockUk: true,
  },
];

// ============================================================================
// 3. ДОПОМІЖНІ ФУНКЦІЇ НОРМАЛІЗАЦІЇ ТА ВАЛІДАЦІЇ
// ============================================================================
function sanitizeCode(input: string): string {
  if (!input) return '';
  return input.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().trim();
}

function classifyPartCategory(text: string): {
  category: PartCatalogItem['category'];
  maxAllowedPrice: number;
  maxAllowedWeightKg: number;
  defaultPrice: number;
  defaultWeightKg: number;
} {
  const t = text.toLowerCase();

  if (t.match(/seal|cover|plate|o-ring|gasket|washer|ring|bush|bushing|shim|кришк|сальник|кільц|прокладк|шайб|втулк|болт|гайк/)) {
    return {
      category: 'seal_hardware',
      maxAllowedPrice: 28.0,
      maxAllowedWeightKg: 1.0,
      defaultPrice: 4.87,
      defaultWeightKg: 0.15,
    };
  }
  if (t.match(/filter|element|separator|фільтр|сепарат|вкладка/)) {
    return {
      category: 'filtration',
      maxAllowedPrice: 95.0,
      maxAllowedWeightKg: 4.0,
      defaultPrice: 22.0,
      defaultWeightKg: 0.8,
    };
  }
  if (t.match(/belt|sensor|switch|relay|alternator|starter|ремін|датчик|реле|стартер|генератор|електр/)) {
    return {
      category: 'electrical_belts',
      maxAllowedPrice: 320.0,
      maxAllowedWeightKg: 10.0,
      defaultPrice: 55.0,
      defaultWeightKg: 1.5,
    };
  }
  if (t.match(/pump|valve|hydro|hydraulic|cylinder|rexroth|гідро|насос|розподіл|циліндр/)) {
    return {
      category: 'hydraulics',
      maxAllowedPrice: 1800.0,
      maxAllowedWeightKg: 65.0,
      defaultPrice: 450.0,
      defaultWeightKg: 18.0,
    };
  }
  if (t.match(/axle|gear|differential|transmission|drive|carraro|zf|міст|мост|редуктор|шестерн|вал/)) {
    return {
      category: 'drivetrain_heavy',
      maxAllowedPrice: 2500.0,
      maxAllowedWeightKg: 120.0,
      defaultPrice: 320.0,
      defaultWeightKg: 15.0,
    };
  }

  return {
    category: 'engine_fuel',
    maxAllowedPrice: 400.0,
    maxAllowedWeightKg: 15.0,
    defaultPrice: 65.0,
    defaultWeightKg: 2.0,
  };
}

// ============================================================================
// 4. КОНСОЛІДАЦІЯ ТАРИФІВ NOVA POST GLOBAL UK ➔ UA
// ============================================================================
function calculateConsolidatedLogistics(weightKg: number, qty: number): LogisticsConsolidation {
  const actualWeightKg = Math.round(weightKg * qty * 10) / 10;
  const volumetricWeightKg = Math.round((actualWeightKg * 1.15) * 10) / 10;
  const billableWeightKg = Math.max(actualWeightKg, volumetricWeightKg);

  if (billableWeightKg <= 2.0) {
    return {
      tierName: `Nova Post Small (до 2 кг • факт ${actualWeightKg} кг)`,
      shippingCostGbp: 27,
      actualWeightKg,
      volumetricWeightKg,
      billableWeightKg,
      boxesCount: 1,
      palletRequired: false,
    };
  }
  if (billableWeightKg <= 10.0) {
    return {
      tierName: `Nova Post Medium (до 10 кг • факт ${actualWeightKg} кг)`,
      shippingCostGbp: 41,
      actualWeightKg,
      volumetricWeightKg,
      billableWeightKg,
      boxesCount: 1,
      palletRequired: false,
    };
  }
  if (billableWeightKg <= 30.0) {
    return {
      tierName: `Nova Post Large Box (консолідація до 30 кг • факт ${actualWeightKg} кг)`,
      shippingCostGbp: 68,
      actualWeightKg,
      volumetricWeightKg,
      billableWeightKg,
      boxesCount: 1,
      palletRequired: false,
    };
  }
  if (billableWeightKg <= 60.0) {
    return {
      tierName: `Nova Post Multi-Box Heavy (2 вантажні місця • факт ${actualWeightKg} кг)`,
      shippingCostGbp: 115,
      actualWeightKg,
      volumetricWeightKg,
      billableWeightKg,
      boxesCount: 2,
      palletRequired: false,
    };
  }
  if (billableWeightKg <= 150.0) {
    return {
      tierName: `Mini Pallet Freight (четвертна європалета • факт ${actualWeightKg} кг)`,
      shippingCostGbp: 165,
      actualWeightKg,
      volumetricWeightKg,
      billableWeightKg,
      boxesCount: 1,
      palletRequired: true,
    };
  }

  const pallets = Math.ceil(billableWeightKg / 700);
  return {
    tierName: `Full Euro-Pallet Freight (${pallets} пал. • факт ${actualWeightKg} кг)`,
    shippingCostGbp: 240 * pallets,
    actualWeightKg,
    volumetricWeightKg,
    billableWeightKg,
    boxesCount: pallets,
    palletRequired: true,
  };
}

// ============================================================================
// 5. ДИНАМІЧНА ГРАДАЦІЯ МАРЖІ ТА ЗАХИСТ ВІД ЗБИТКУ
// ============================================================================
function calculateCommercialMargin(basePriceGbp: number): { marginGbp: number; finalPriceGbp: number } {
  let margin = 0;

  if (basePriceGbp <= 8.0) {
    margin = 3.50;
  } else if (basePriceGbp <= 25.0) {
    margin = 6.00;
  } else if (basePriceGbp <= 70.0) {
    margin = Math.max(12.0, Math.round(basePriceGbp * 0.35));
  } else if (basePriceGbp <= 250.0) {
    margin = Math.max(25.0, Math.round(basePriceGbp * 0.28));
  } else if (basePriceGbp <= 800.0) {
    margin = Math.max(60.0, Math.round(basePriceGbp * 0.22));
  } else {
    margin = Math.max(120.0, Math.round(basePriceGbp * 0.18));
  }

  const finalPriceGbp = Math.round((basePriceGbp + margin) * 100) / 100;
  return { margin, finalPriceGbp };
}

// ============================================================================
// 6. ГОЛОВНИЙ ОБРОБНИК МАРШРУТУ POST
// ============================================================================
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const {
      partNumber = '',
      machineModel = '',
      quantity = 1,
      country = 'Україна',
      contact = '',
      invoiceNumber = '',
    } = payload;

    const rawPart = String(partNumber).trim();
    const rawModel = String(machineModel).trim();
    const qty = Math.max(1, parseInt(String(quantity), 10) || 1);
    const sanitizedPart = sanitizeCode(rawPart);

    const pplxApiKey = process.env.PERPLEXITY_API_KEY;
    const tgBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChatId = process.env.TELEGRAM_CHAT_ID;
    const xeroWebhookUrl = process.env.XERO_WEBHOOK_URL;

    let verification: VerificationResult = {
      isVerified: false,
      status: 'wait_for_rfq',
      partName: `${rawPart} ${rawModel}`.trim(),
      buyPriceGbp: 0,
      weightKg: 1.0,
      supplierUrl: '',
      supplierName: '',
      confidenceScore: 0,
    };

    // ФАЗА А: Миттєва перевірка за офіційним еталонним каталогом
    const exactCatalogMatch = VERIFIED_MASTER_CATALOG.find(
      (item) => item.normalizedCode === sanitizedPart || sanitizedPart.includes(item.normalizedCode)
    );

    if (exactCatalogMatch) {
      verification = {
        isVerified: true,
        status: 'verified_instant',
        partName: `${exactCatalogMatch.partNameUk} (${exactCatalogMatch.brand})`,
        buyPriceGbp: exactCatalogMatch.referencePriceGbp,
        weightKg: exactCatalogMatch.unitWeightKg,
        supplierUrl: exactCatalogMatch.directStoreUrl,
        supplierName: exactCatalogMatch.storeName,
        confidenceScore: 1.0,
      };
    }

    // ФАЗА Б: Агентський пошук через Perplexity Sonar у разі відсутності в базі
    if (!verification.isVerified && pplxApiKey) {
      try {
        const categoryBounds = classifyPartCategory(`${rawPart} ${rawModel}`);

        const agentSystemPrompt = `
You are an expert UK heavy plant and machinery procurement officer (JCB, CAT, Perkins, Donaldson, Komatsu, Volvo CE).
Search real-time UK parts suppliers (Vicary Plant, Watling JCB, Holt JCB, Inline Filters, DiPerk, Carraro Spares UK, Hydraulics Online, eBay UK).
Identify the EXACT component, real UK retail/trade price in GBP (£), direct purchase URL, and item weight.
Return strictly a RAW JSON object with NO markdown formatting, NO backticks, NO commentary:
{
  "found": true,
  "exactPartName": "string",
  "buyPriceGbp": 12.50,
  "weightKg": 0.5,
  "purchaseUrl": "https://...",
  "storeName": "string",
  "confidenceScore": 0.95
}
If the part cannot be verified with a real UK purchasing link, return {"found": false}.`;

        const agentUserPrompt = `
Query: Part Number "${rawPart}", Machine/Model: "${rawModel}".
Expected Category Rules:
- If this is a seal, plate, cover, o-ring, washer: Price MUST be under £${categoryBounds.maxAllowedPrice}, Weight under ${categoryBounds.maxAllowedWeightKg}kg.
- Check actual UK stock availability right now.`;

        const pplxResponse = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${pplxApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'sonar',
            messages: [
              { role: 'system', content: agentSystemPrompt },
              { role: 'user', content: agentUserPrompt },
            ],
            temperature: 0.05,
          }),
        });

        if (pplxResponse.ok) {
          const apiData = await pplxResponse.json();
          const responseText = apiData.choices?.[0]?.message?.content || '{}';
          const cleanJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanJsonString);

          if (parsed.found && parsed.buyPriceGbp > 0 && parsed.purchaseUrl && parsed.purchaseUrl.startsWith('http')) {
            const rawApiPrice = Number(parsed.buyPriceGbp);
            const rawApiWeight = Number(parsed.weightKg) || categoryBounds.defaultWeightKg;

            // Захисний фільтр: валідація проти аномалій
            const safePrice = Math.min(rawApiPrice, categoryBounds.maxAllowedPrice);
            const safeWeight = Math.min(rawApiWeight, categoryBounds.maxAllowedWeightKg);

            verification = {
              isVerified: true,
              status: 'verified_agent',
              partName: parsed.exactPartName || `${rawPart} ${rawModel}`,
              buyPriceGbp: Math.round(safePrice * 100) / 100,
              weightKg: Math.round(safeWeight * 100) / 100,
              supplierUrl: parsed.purchaseUrl,
              supplierName: parsed.storeName || 'UK Equipment Supplier',
              confidenceScore: Number(parsed.confidenceScore) || 0.85,
            };
          }
        }
      } catch (agentErr) {
        console.error('Agent lookup failure:', agentErr);
      }
    }

    // ФАЗА В: Обробка статусу WAIT FOR RFQ (Якщо деталі немає у вільному доступі)
    if (!verification.isVerified || verification.buyPriceGbp <= 0) {
      if (tgBotToken && tgChatId) {
        const pendingTgNotification = `⚠️ <b>НОВИЙ ЗАПИТ: ПОТРІБНА РУЧНА ОЦІНКА (WAIT FOR RFQ)</b>
━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ <b>Артикул:</b> <code>${rawPart}</code>
🚜 <b>Техніка:</b> ${rawModel || 'Не вказано'}
📦 <b>Кількість:</b> ${qty} шт
👤 <b>Клієнт:</b> ${contact || 'Анонімний лід'}
📍 <b>Локація:</b> ${country}

ℹ️ <i>Агент не знайшов гарантованого лінка в UK або артикул вимагає перевірки за VIN-кодом. Клієнту відображено статус очікування інвойсу. Зв'яжіться з замовником!</i>`;

        try {
          await fetch(`https://api.telegram.org/bot${tgBotToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: tgChatId,
              text: pendingTgNotification,
              parse_mode: 'HTML',
            }),
          });
        } catch (tgErr) {
          console.error('Telegram dispatch error:', tgErr);
        }
      }

      return NextResponse.json({
        found: false,
        status: 'wait_for_rfq',
        message: 'Артикул передано черговому фахівцю в Ковентрі для ручного прорахунку специфікації.',
      });
    }

    // ФАЗА Г: Фінансовий розрахунок та консолідація доставки
    const pricing = calculateCommercialMargin(verification.buyPriceGbp);
    const logistics = calculateConsolidatedLogistics(verification.weightKg, qty);

    const clientTotal = Math.round((pricing.finalPriceGbp * qty + logistics.shippingCostGbp) * 100) / 100;
    const netProfitGbp = Math.round(pricing.marginGbp * qty * 100) / 100;
    const invNumber = invoiceNumber || `NLG-PI-${Math.floor(100000 + Math.random() * 900000)}`;

    // ФАЗА Д: Миттєве сповіщення в Telegram із посиланням на закупівлю
    if (tgBotToken && tgChatId) {
      const verifiedTgMessage = `✅ <b>ВЕРИФІКОВАНИЙ B2B РАХУНОК: ${invNumber}</b>
━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ <b>Каталожний номер:</b> <code>${rawPart}</code>
🏷 <b>Найменування OEM:</b> ${verification.partName}
📦 <b>Партія:</b> ${qty} шт | Вага партії: <b>${logistics.actualWeightKg} кг</b>
🚚 <b>Логістика Nova Post:</b> ${logistics.tierName} — <b>£${logistics.shippingCostGbp}</b>

👤 <b>Клієнт:</b> ${contact}
📍 <b>Країна доставки:</b> ${country}

💰 <b>ФІНАНСОВИЙ РОЗКЛАД:</b>
• Ціна в інвойсі клієнту: <b>£${pricing.finalPriceGbp.toFixed(2)}</b> / шт
• Разом до сплати клієнтом: <b>£${clientTotal.toFixed(2)}</b>
• Закупівельна ціна в UK: <b>£${verification.buyPriceGbp.toFixed(2)}</b>
• Постачальник у Британії: <b>${verification.supplierName}</b>
• <b>ТВІЙ ЧИСТИЙ ПРИБУТОК:</b> <b>£${netProfitGbp.toFixed(2)}</b> 🔥

🛒 <b>ДЕ КУПИТИ В АНГЛІЇ (ПРЯМЕ ПОСИЛАННЯ):</b>
👉 <a href="${verification.supplierUrl}">Перейти в магазин постачальника</a>`;

      try {
        await fetch(`https://api.telegram.org/bot${tgBotToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: tgChatId,
            text: verifiedTgMessage,
            parse_mode: 'HTML',
            disable_web_page_preview: false,
          }),
        });
      } catch (tgSendErr) {
        console.error('Telegram push failed:', tgSendErr);
      }
    }

    // ФАЗА Е: Створення інвойсу в Xero через Make.com Webhook
    if (xeroWebhookUrl) {
      try {
        await fetch(xeroWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            invoiceNumber: invNumber,
            contactName: contact || 'Website Wholesale Customer',
            itemDescription: `${verification.partName} [${rawPart}] x${qty}`,
            quantity: qty,
            unitAmount: pricing.finalPriceGbp,
            shippingAmount: logistics.shippingCostGbp,
            totalAmount: clientTotal,
            currencyCode: 'GBP',
            date: new Date().toISOString().split('T')[0],
            reference: `Online B2B Portal - ${country}`,
          }),
        });
      } catch (xeroPostErr) {
        console.error('Xero webhook push failed:', xeroPostErr);
      }
    }

    // ФАЗА Ж: Успішна відповідь клієнтській частині
    return NextResponse.json({
      found: true,
      status: 'success',
      unitPrice: pricing.finalPriceGbp,
      shippingCost: logistics.shippingCostGbp,
      parcelType: logistics.tierName,
      totalWeightKg: logistics.actualWeightKg,
      categoryLabel: verification.partName,
      total: clientTotal,
      invoiceNumber: invNumber,
    });
  } catch (globalErr) {
    console.error('Fatal RFQ Route Handler Error:', globalErr);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
