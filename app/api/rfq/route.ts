export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

interface PriceCalculation {
  basePrice: number;
  delivery: number;
  marginPercent: number;
  marginAmount: number;
  finalPrice: number;
  currency: string;
  sourceNote: string;
}

async function findPriceWithAI(partNumber: string, machineModel: string, country: string): Promise<PriceCalculation> {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  const cleanPart = partNumber.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

  if (!apiKey) {
    return {
      basePrice: 0,
      delivery: 30,
      marginPercent: 25,
      marginAmount: 0,
      finalPrice: 0,
      currency: 'GBP',
      sourceNote: 'API ключ не налаштовано',
    };
  }

  try {
    const prompt = `You are a spare parts procurement specialist. Search the web for current retail/market price for:
Part Number: "${cleanPart}" (Original query: "${partNumber}")
Machine Model: "${machineModel || 'Any'}"
Target delivery to: "${country || 'UK/Europe'}".

Find the current market price in GBP (£). If price is in EUR or USD, convert to GBP at current rates.
Respond ONLY with a valid raw JSON object without markdown formatting:
{
  "estimatedPriceGBP": number,
  "found": boolean,
  "summary": "short note about where found or estimated range"
}`;

    const res = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          { role: 'system', content: 'You are an accurate auto and machinery parts pricing engine. Always return strict JSON.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.1,
      }),
    });

    if (!res.ok) {
      throw new Error(`Perplexity API responded with status ${res.status}`);
    }

    const aiData = await res.json();
    const content = aiData?.choices?.[0]?.message?.content || '{}';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    const basePrice = Math.round(Number(parsed.estimatedPriceGBP) || 0);
    const delivery = 30; // стандартний орієнтовний буфер доставки
    const marginPercent = basePrice > 500 ? 20 : 25;
    const marginAmount = Math.round((basePrice * marginPercent) / 100);
    const finalPrice = basePrice > 0 ? basePrice + marginAmount + delivery : 0;

    return {
      basePrice,
      delivery,
      marginPercent,
      marginAmount,
      finalPrice,
      currency: 'GBP',
      sourceNote: parsed.summary || 'Знайдено у відкритих каталогах',
    };
  } catch (error: any) {
    console.error('AI Search Error:', error);
    return {
      basePrice: 0,
      delivery: 30,
      marginPercent: 25,
      marginAmount: 0,
      finalPrice: 0,
      currency: 'GBP',
      sourceNote: 'Помилка онлайн-пошуку або деталь під індивідуальний запит',
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { partNumber, machineModel, quantity, country, contact } = body ?? {};

    if (!partNumber || !machineModel || !quantity || !country || !contact) {
      return NextResponse.json({ error: 'Всі поля обовʼязкові' }, { status: 400 });
    }

    const cleanPart = String(partNumber).replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const qty = Math.max(1, parseInt(String(quantity), 10) || 1);

    // 1. Пошук орієнтовної ціни через ШІ
    const pricing = await findPriceWithAI(partNumber, machineModel, country);
    const totalEstimate = pricing.finalPrice > 0 ? pricing.finalPrice * qty : 0;

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const sheetUrl = process.env.GOOGLE_SHEET_URL;

    // 2. Надсилання детального розрахунку в Telegram
    if (token && chatId) {
      let priceSection = '⚠️ Точну ціну не знайдено автоматично (потрібен ручний запит постачальникам)';
      if (pricing.finalPrice > 0) {
        priceSection = `💰 *Оцінка собівартості:* ~£${pricing.basePrice} / шт\n` +
          `📦 *Буфер логістики:* £${pricing.delivery}\n` +
          `📈 *Націнка:* ${pricing.marginPercent}% (+£${pricing.marginAmount})\n` +
          `🏷 *Клієнту названо:* ~£${pricing.finalPrice} / шт (Разом: ~£${totalEstimate})`;
      }

      const text = `🔧 Новий запит деталі (RFQ) + AI Розрахунок\n\n` +
        `⚙️ Артикул: ${cleanPart} (було: ${partNumber})\n` +
        `🚜 Модель: ${machineModel}\n` +
        `🔢 Кількість: ${qty} шт\n` +
        `🌍 Країна: ${country}\n` +
        `📱 Контакт: ${contact}\n\n` +
        `ℹ️ Джерела / примітка: ${pricing.sourceNote}\n\n` +
        `${priceSection}`;

      const cleanPhone = String(contact).replace(/[^0-9]/g, '');
      const inlineKeyboard: any[] = [];

      if (cleanPhone.length >= 9) {
        const msg = encodeURIComponent(`Вітаю! Щодо вашого запиту на деталь ${cleanPart}: орієнтовна вартість із доставкою становить ~£${totalEstimate || pricing.finalPrice}. Чи актуальне замовлення?`);
        inlineKeyboard.push([
          { text: '💬 WhatsApp (з готовим КП)', url: `https://wa.me/${cleanPhone}?text=${msg}` }
        ]);
      } else if (String(contact).includes('@')) {
        inlineKeyboard.push([
          { text: '✉️ Відповісти на Email', url: `mailto:${contact}` }
        ]);
      }

      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          reply_markup: inlineKeyboard.length > 0 ? { inline_keyboard: inlineKeyboard } : undefined,
        }),
      }).catch((err) => console.error('Telegram error:', err));
    }

    // 3. Запис у Google Таблицю
    if (sheetUrl) {
      await fetch(sheetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'RFQ (AI Розрахунок)',
          name: '-',
          contact: contact,
          partOrService: `${cleanPart} (Орієнтир: £${totalEstimate || 'Уточнюється'})`,
          details: `Модель: ${machineModel}, К-сть: ${qty}`,
          message: `Країна: ${country} | Примітка: ${pricing.sourceNote}`,
        }),
      }).catch((err) => console.error('Google Sheets error:', err));
    }

    return NextResponse.json({
      success: true,
      estimatedPrice: pricing.finalPrice,
      totalEstimate: totalEstimate,
      currency: pricing.currency,
      note: pricing.sourceNote,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: 'Помилка обробки' }, { status: 500 });
  }
}
