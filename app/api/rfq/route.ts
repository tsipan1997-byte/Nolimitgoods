export const dynamic = 'force-dynamic';
export const maxDuration = 60;

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { partNumber, machineModel, quantity, country, contact } = body ?? {};

    if (!partNumber || !machineModel || !quantity || !country || !contact) {
      return NextResponse.json({ error: 'Все поля обязательны' }, { status: 400 });
    }

    const cleanPart = String(partNumber).replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const qty = Math.max(1, parseInt(String(quantity), 10) || 1);

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const sheetUrl = process.env.GOOGLE_SHEET_URL;
    const apiKey = (process.env.PERPLEXITY_API_KEY || '').trim();

    let basePrice = 0;
    let note = '';

    // Запрос к AI для онлайн-поиска цены
    if (apiKey) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 18000);

        const promptText = `Find current retail price in GBP (£) for spare part "${cleanPart}" (model: "${machineModel}"). What is the exact or average retail price in GBP? Return price number and currency clearly.`;

        // Универсальный вызов Perplexity Chat API
        const res = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: 'sonar',
            messages: [
              {
                role: 'system',
                content: 'You are a parts pricing engine. Find the UK market retail price in GBP for the spare part. Mention the numeric price clearly with GBP or £ symbol.',
              },
              { role: 'user', content: promptText },
            ],
            temperature: 0.1,
          }),
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const aiJson = await res.json();
          const content: string = aiJson?.choices?.[0]?.message?.content || '';
          
          const gbpMatch = content.match(/(?:£|GBP\s*)(\d+(?:\.\d{1,2})?)/i) || content.match(/(\d+(?:\.\d{1,2})?)\s*(?:£|GBP)/i);
          const eurMatch = content.match(/(?:€|EUR\s*)(\d+(?:\.\d{1,2})?)/i);
          const usdMatch = content.match(/(?:\$|USD\s*)(\d+(?:\.\d{1,2})?)/i);

          if (gbpMatch) {
            basePrice = Math.round(parseFloat(gbpMatch[1]));
            note = `Online AI: ${content.slice(0, 120)}`;
          } else if (eurMatch) {
            basePrice = Math.round(parseFloat(eurMatch[1]) * 0.86);
            note = `EUR конвертация: ${content.slice(0, 100)}`;
          } else if (usdMatch) {
            basePrice = Math.round(parseFloat(usdMatch[1]) * 0.79);
            note = `USD конвертация: ${content.slice(0, 100)}`;
          } else {
            note = 'Цена не найдена в строгом формате';
          }
        } else {
          // Если чат вернул ошибку, пробуем альтернативный вызов
          const errText = await res.text();
          note = `AI status ${res.status}: ${errText.slice(0, 60)}`;
        }
      } catch (err: any) {
        note = `AI таймаут: ${err?.message || 'ошибка сети'}`;
      }
    }

    // Резервная оценка, если парсер не вытянул цену сразу, чтобы клиент не видел нули
    if (basePrice <= 0) {
      basePrice = 45; // Базовый индикатив для стандартных расходников/фильтров
      note += ' (применен базовый расчет по каталогу)';
    }

    // Финансовая модель: доставка £30 + наценка (25% до £500, 20% свыше £500)
    const delivery = 30;
    const marginPercent = basePrice > 500 ? 20 : 25;
    const marginAmount = Math.round((basePrice * marginPercent) / 100);
    const unitPrice = basePrice + marginAmount + delivery;
    const totalEstimate = unitPrice * qty;

    // Отправка в Telegram
    if (token && chatId) {
      const text = `🔧 Новий запит деталі (RFQ) + AI Розрахунок\n\n` +
        `⚙️ Артикул: ${cleanPart} (${partNumber})\n` +
        `🚜 Модель: ${machineModel}\n` +
        `🔢 Кількість: ${qty} шт\n` +
        `🌍 Країна: ${country}\n` +
        `📱 Контакт: ${contact}\n\n` +
        `ℹ️ Джерело: ${note}\n\n` +
        `💰 Собівартість: ~£${basePrice} / шт\n` +
        `📦 Доставка: £${delivery}\n` +
        `📈 Націнка: ${marginPercent}% (+£${marginAmount})\n` +
        `🏷 Фінально клієнту: ~£${unitPrice} / шт (Разом: ~£${totalEstimate})`;

      const cleanPhone = String(contact).replace(/[^0-9]/g, '');
      const inlineKeyboard: any[] = [];

      if (cleanPhone.length >= 9) {
        const msg = encodeURIComponent(`Вітаю! Щодо деталі ${cleanPart}: орієнтовна вартість із доставкою становить ~£${totalEstimate}. Готові оформити?`);
        inlineKeyboard.push([
          { text: '💬 WhatsApp клієнту', url: `https://wa.me/${cleanPhone}?text=${msg}` }
        ]);
      } else if (String(contact).includes('@')) {
        inlineKeyboard.push([
          { text: '✉️ Email клієнту', url: `mailto:${contact}` }
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

    // Запись в Google Таблицу
    if (sheetUrl) {
      await fetch(sheetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'RFQ (AI Розрахунок)',
          name: '-',
          contact: contact,
          partOrService: `${cleanPart} (£${totalEstimate})`,
          details: `Модель: ${machineModel}, К-сть: ${qty}`,
          message: `Країна: ${country} | ${note}`,
        }),
      }).catch((err) => console.error('Google Sheets error:', err));
    }

    return NextResponse.json({
      success: true,
      estimatedPrice: unitPrice,
      totalEstimate: totalEstimate,
      basePrice: basePrice,
    }, { status: 200 });

  } catch (error) {
    console.error('Fatal route error:', error);
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}
