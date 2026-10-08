export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Дозволяє Vercel чекати до 60 секунд

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
      sourceNote: 'API ключ не вказано',
    };
  }

  // Контролер таймауту на 15 секунд
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const prompt = `Part Number: "${cleanPart}". Model: "${machineModel || 'Any'}". Target region: "${country || 'UK'}". 
Find the estimated market price in GBP (£).
Return ONLY a valid JSON: {"estimatedPriceGBP": number, "summary": "short note"}`;

    const res = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          { role: 'system', content: 'You are an auto/machinery parts price finder. Output strictly valid JSON.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.1,
      }),
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Perplexity status: ${res.status}`);
    }

    const aiData = await res.json();
    const content = aiData?.choices?.[0]?.message?.content || '{}';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    const basePrice = Math.round(Number(parsed.estimatedPriceGBP) || 0);
    const delivery = 30;
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
      sourceNote: parsed.summary || 'Знайдено в онлайн-каталогах',
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error('AI Search Warning/Timeout:', error.message);
    return {
      basePrice: 0,
      delivery: 30,
      marginPercent: 25,
      marginAmount: 0,
      finalPrice: 0,
      currency: 'GBP',
      sourceNote: 'Потрібен індивідуальний запит постачальникам',
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

    // 1. Пошук орієнтовної ціни (з контролем таймауту)
    const pricing = await findPriceWithAI(partNumber, machineModel, country);
    const totalEstimate = pricing.finalPrice > 0 ? pricing.finalPrice * qty : 0;

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const sheetUrl = process.env.GOOGLE_SHEET_URL;

    // 2. Формування тексту для Telegram
    let priceSection = '⚠️ Точну ціну не визначено онлайн (потрібен ручний прорахунок)';
    if (pricing.finalPrice > 0) {
      priceSection = `💰 Оцінка собівартості: ~£${pricing.basePrice} / шт\n` +
        `📦 Буфер доставки: £${pricing.delivery}\n` +
        `📈 Націнка: ${pricing.marginPercent}% (+£${pricing.marginAmount})\n` +
        `🏷 Орієнтир клієнту: ~£${pricing.finalPrice} / шт (Разом: ~£${totalEstimate})`;
    }

    const text = `🔧 Новий запит деталі (RFQ) + AI Розрахунок\n\n` +
      `⚙️ Артикул: ${cleanPart} (${partNumber})\n` +
      `🚜 Модель: ${machineModel}\n` +
      `🔢 Кількість: ${qty} шт\n` +
      `🌍 Країна: ${country}\n` +
      `📱 Контакт: ${contact}\n\n` +
      `ℹ️ Статус: ${pricing.sourceNote}\n\n` +
      `${priceSection}`;

    const cleanPhone = String(contact).replace(/[^0-9]/g, '');
    const inlineKeyboard: any[] = [];

    if (cleanPhone.length >= 9) {
      const msg = encodeURIComponent(`Вітаю! Щодо запиту на ${cleanPart}: орієнтовна вартість із доставкою становить ~£${totalEstimate || pricing.finalPrice}. Чи актуально?`);
      inlineKeyboard.push([
        { text: '💬 WhatsApp (з готовим КП)', url: `https://wa.me/${cleanPhone}?text=${msg}` }
      ]);
    } else if (String(contact).includes('@')) {
      inlineKeyboard.push([
        { text: '✉️ Відповісти на Email', url: `mailto:${contact}` }
      ]);
    }

    // 3. Відправка до Telegram
    if (token && chatId) {
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

    // 4. Запис у Google Таблицю
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
          message: `Країна: ${country} | ${pricing.sourceNote}`,
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
    console.error('Fatal route error:', error);
    return NextResponse.json({ error: 'Помилка обробки' }, { status: 500 });
  }
}
