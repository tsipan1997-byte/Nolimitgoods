export const dynamic = 'force-dynamic';

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
    let note = 'Потрібен індивідуальний запит постачальникам';

    // 1. Швидкий запит до Perplexity (таймаут 10 секунд)
    if (apiKey) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const promptText = `Find current retail price in GBP for part number "${cleanPart}" (model: "${machineModel}"). Return just the estimated price number in GBP and short source name.`;

        const aiRes = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: 'sonar',
            messages: [
              { role: 'system', content: 'You are a spare parts price assistant. Keep answers very short with prices in GBP.' },
              { role: 'user', content: promptText }
            ],
            temperature: 0.1,
          }),
        });

        clearTimeout(timeoutId);

        if (aiRes.ok) {
          const aiJson = await aiRes.json();
          const content = aiJson?.choices?.[0]?.message?.content || '';
          
          const match = content.match(/(?:£|GBP\s*)(\d+(?:\.\d{1,2})?)/i) || content.match(/(\d+(?:\.\d{1,2})?)\s*(?:£|GBP)/i);
          if (match) {
            basePrice = Math.round(parseFloat(match[1]));
            note = content.split('\n')[0].slice(0, 120);
          }
        }
      } catch (aiErr) {
        console.error('AI lookup skipped or timed out:', aiErr);
      }
    }

    // 2. Розрахунок доставки та націнки
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

      const text = `🔧 Новий запит деталі (RFQ)\n\n` +
        `⚙️ Артикул: ${cleanPart} (${partNumber})\n` +
        `🚜 Модель: ${machineModel}\n` +
        `🔢 Кількість: ${qty} шт\n` +
        `🌍 Країна: ${country}\n` +
        `📱 Контакт: ${contact}\n\n` +
        `ℹ️ Статус: ${note}\n\n` +
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
          type: 'RFQ (Запит деталі)',
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
