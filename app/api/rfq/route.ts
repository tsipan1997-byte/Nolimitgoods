export const dynamic = 'force-dynamic';
export const maxDuration = 60;

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { partNumber, machineModel, quantity, country, contact } = body ?? {};

    if (!partNumber || !machineModel || !quantity || !country || !contact) {
      return NextResponse.json({ error: 'Всі поля обовʼязкові' }, { status: 400 });
    }

    const cleanPart = String(partNumber).replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const qty = Math.max(1, parseInt(String(quantity), 10) || 1);

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const sheetUrl = process.env.GOOGLE_SHEET_URL;
    const apiKey = (process.env.PERPLEXITY_API_KEY || '').trim();

    let basePrice = 0;
    let note = '';

    // 1. Прямий запит до Perplexity Agent API (/v1/responses)
    if (!apiKey) {
      note = 'Помилка: PERPLEXITY_API_KEY не знайдений';
    } else {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);

        const promptText = `Find the retail price in GBP (£) for spare part "${cleanPart}" (original query "${partNumber}") for machine "${machineModel}". What is the typical market price in GBP? Return price number and online store source briefly.`;

        const res = await fetch('https://api.perplexity.ai/v1/responses', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: 'sonar',
            input: promptText,
          }),
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          const errDetail = await res.text();
          note = `Помилка API (${res.status}): ${errDetail.slice(0, 100)}`;
        } else {
          const aiJson = await res.json();
          // Отримуємо відповідь з поля виводу Agent API
          const content: string =
            aiJson?.output_text ||
            aiJson?.response ||
            (Array.isArray(aiJson?.output) ? JSON.stringify(aiJson.output) : '') ||
            aiJson?.choices?.[0]?.message?.content ||
            JSON.stringify(aiJson);

          // Витягуємо ціну в GBP (£XX або XX GBP)
          const match = content.match(/(?:£|GBP\s*)(\d+(?:\.\d{1,2})?)/i) || content.match(/(\d+(?:\.\d{1,2})?)\s*(?:£|GBP)/i);
          if (match) {
            basePrice = Math.round(parseFloat(match[1]));
            note = content.slice(0, 140);
          } else {
            const eurMatch = content.match(/(?:€|EUR\s*)(\d+(?:\.\d{1,2})?)/i);
            const usdMatch = content.match(/(?:\$|USD\s*)(\d+(?:\.\d{1,2})?)/i);
            if (eurMatch) {
              basePrice = Math.round(parseFloat(eurMatch[1]) * 0.85);
              note = `Конвертовано з EUR: ${content.slice(0, 100)}`;
            } else if (usdMatch) {
              basePrice = Math.round(parseFloat(usdMatch[1]) * 0.78);
              note = `Конвертовано з USD: ${content.slice(0, 100)}`;
            } else {
              note = `Відповідь є, але суму не розпізнано: ${content.slice(0, 80)}`;
            }
          }
        }
      } catch (aiErr: any) {
        note = `Збій запиту: ${aiErr?.message || 'timeout'}`;
      }
    }

    // 2. Логіка розрахунку: £30 доставка + націнка (25% до £500, 20% від £500)
    const delivery = 30;
    const marginPercent = basePrice > 500 ? 20 : 25;
    const marginAmount = Math.round((basePrice * marginPercent) / 100);
    const unitPrice = basePrice > 0 ? basePrice + marginAmount + delivery : 0;
    const totalEstimate = unitPrice > 0 ? unitPrice * qty : 0;

    // 3. Відправка до Telegram
    if (token && chatId) {
      let priceInfo = '⚠️ Точну ціну не визначено онлайн (потрібен ручний прорахунок)';
      if (unitPrice > 0) {
        priceInfo = `💰 Оцінка собівартості: ~£${basePrice} / шт\n` +
          `📦 Буфер доставки: £${delivery}\n` +
          `📈 Націнка: ${marginPercent}% (+£${marginAmount})\n` +
          `🏷 Орієнтир клієнту: ~£${unitPrice} / шт (Разом: ~£${totalEstimate})`;
      }

      const text = `🔧 Новий запит деталі (RFQ) + AI Розрахунок\n\n` +
        `⚙️ Артикул: ${cleanPart} (${partNumber})\n` +
        `🚜 Модель: ${machineModel}\n` +
        `🔢 Кількість: ${qty} шт\n` +
        `🌍 Країна: ${country}\n` +
        `📱 Контакт: ${contact}\n\n` +
        `ℹ️ Статус AI: ${note}\n\n` +
        `${priceInfo}`;

      const cleanPhone = String(contact).replace(/[^0-9]/g, '');
      const inlineKeyboard: any[] = [];

      if (cleanPhone.length >= 9) {
        const msg = encodeURIComponent(`Вітаю! Щодо запиту на ${cleanPart}: орієнтовна вартість із доставкою становить ~£${totalEstimate || unitPrice}. Чи актуально?`);
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
          message: `Країна: ${country} | ${note}`,
        }),
      }).catch((err) => console.error('Google Sheets error:', err));
    }

    return NextResponse.json({
      success: true,
      estimatedPrice: unitPrice,
      totalEstimate: totalEstimate,
    }, { status: 200 });

  } catch (error) {
    console.error('Fatal route error:', error);
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}
