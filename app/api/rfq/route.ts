export const dynamic = 'force-dynamic';
export const maxDuration = 60;

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { partNumber, machineModel, quantity, country, contact } = body ?? {};

    if (!partNumber || !machineModel || !quantity || !country || !contact) {
      return NextResponse.json({ error: 'Всі поля обов’язкові' }, { status: 400 });
    }

    const cleanPart = String(partNumber).replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const rawInput = `${partNumber} ${machineModel}`.toLowerCase();
    const qty = Math.max(1, parseInt(String(quantity), 10) || 1);

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const sheetUrl = process.env.GOOGLE_SHEET_URL;
    const apiKey = (process.env.PERPLEXITY_API_KEY || '').trim();

    let basePrice = 0;
    let note = '';

    // Перевірка на категорію товару (фільтри, розхідники, дрібні деталі)
    const isFilterOrConsumable =
      cleanPart.startsWith('P55') || // Donaldson класичні фільтри P55...
      cleanPart.startsWith('P50') ||
      cleanPart.startsWith('P77') ||
      cleanPart.startsWith('HF') ||
      cleanPart.startsWith('LF') ||
      cleanPart.startsWith('FF') ||
      rawInput.includes('filter') ||
      rawInput.includes('фільтр') ||
      rawInput.includes('фильтр') ||
      rawInput.includes('donaldson') ||
      rawInput.includes('mann') ||
      rawInput.includes('fleetguard') ||
      rawInput.includes('baldwin');

    // Запит до AI для пошуку реальної британської ціни
    if (apiKey) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 18000);

        const promptText = `Find current retail price in GBP (£) for spare part "${cleanPart}" (model/brand: "${machineModel}"). What is the exact price in the UK? Return price number and currency GBP clearly.`;

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
                content:
                  'You are a machinery spare parts pricing engine. Find the UK market retail price in GBP for the exact part. Return numeric price clearly with £ or GBP.',
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

          const gbpMatch =
            content.match(/(?:£|GBP\s*)(\d+(?:\.\d{1,2})?)/i) ||
            content.match(/(\d+(?:\.\d{1,2})?)\s*(?:£|GBP)/i);
          const eurMatch = content.match(/(?:€|EUR\s*)(\d+(?:\.\d{1,2})?)/i);
          const usdMatch = content.match(/(?:\$|USD\s*)(\d+(?:\.\d{1,2})?)/i);

          if (gbpMatch) {
            basePrice = Math.round(parseFloat(gbpMatch[1]));
            note = `AI UK: £${basePrice}`;
          } else if (eurMatch) {
            basePrice = Math.round(parseFloat(eurMatch[1]) * 0.86);
            note = `AI EUR: ~£${basePrice}`;
          } else if (usdMatch) {
            basePrice = Math.round(parseFloat(usdMatch[1]) * 0.79);
            note = `AI USD: ~£${basePrice}`;
          } else {
            note = 'AI не повернув чіткого формату ціни';
          }
        } else {
          note = `AI відповідь зі статусом ${res.status}`;
        }
      } catch (err: any) {
        note = `AI таймаут: ${err?.message || 'мережа'}`;
      }
    }

    // Розумний дефолт, якщо парсер не зміг знайти ціну онлайн
    if (basePrice <= 0) {
      if (isFilterOrConsumable) {
        basePrice = 9; // Реальна оптова/роздрібна база для Donaldson/фільтрів у UK (~£7-£12)
        note += ' (застосовано базовий тариф для фільтрів/розхідників: £9)';
      } else {
        basePrice = 35; // Середня база для типових вузлів техніки
        note += ' (застосовано стандартний базовий каталог)';
      }
    }

    // КОМЕРЦІЙНИЙ РОЗРАХУНОК:
    // Доставка рахується НА ПАРТІЮ, а не за кожну штуку окремо!
    const baseShipment = isFilterOrConsumable ? 15 : 25; // Базова посилка з UK в UA
    const extraShipmentPerItem = isFilterOrConsumable ? 1.5 : 4; // Доплата за додаткову вагу/об'єм кожної наступної штуки
    const totalDelivery = Math.round(baseShipment + (qty - 1) * extraShipmentPerItem);

    // Маржа (25% на обсяг до £400, 18% вище)
    const totalPartsCost = basePrice * qty;
    const marginPercent = totalPartsCost > 400 ? 18 : 25;
    const marginAmount = Math.round((totalPartsCost * marginPercent) / 100);

    // Підсумкова ціна
    const totalEstimate = totalPartsCost + marginAmount + totalDelivery;
    const unitPrice = Math.round((totalEstimate / qty) * 10) / 10;

    // Відправка в Telegram
    if (token && chatId) {
      const text =
        `🔧 Новий запит деталі (RFQ) + Розрахунок\n\n` +
        `⚙️ Артикул: ${cleanPart} (${partNumber})\n` +
        `🚜 Модель: ${machineModel}\n` +
        `🔢 Кількість: ${qty} шт\n` +
        `🌍 Країна: ${country}\n` +
        `📱 Контакт: ${contact}\n\n` +
        `ℹ️ Аналіз: ${note}\n\n` +
        `💰 Собівартість деталей: £${basePrice} / шт (Разом: £${totalPartsCost})\n` +
        `📦 Доставка замовлення: £${totalDelivery}\n` +
        `📈 Націнка компанії: ${marginPercent}% (+£${marginAmount})\n` +
        `🏷 ДО СПЛАТИ КЛІЄНТУ: ~£${unitPrice} / шт (Всього: ~£${totalEstimate} / ≈ ${Math.round(totalEstimate * 56)} грн)`;

      const cleanPhone = String(contact).replace(/[^0-9]/g, '');
      const inlineKeyboard: any[] = [];

      if (cleanPhone.length >= 9) {
        const msg = encodeURIComponent(
          `Вітаю! Щодо деталі ${cleanPart}: орієнтовна вартість ${qty} шт з доставкою становить ~£${totalEstimate} (≈ ${Math.round(totalEstimate * 56)} грн). Готові оформити?`
        );
        inlineKeyboard.push([
          { text: '💬 WhatsApp клієнту', url: `https://wa.me/${cleanPhone}?text=${msg}` },
        ]);
      } else if (String(contact).includes('@')) {
        inlineKeyboard.push([{ text: '✉️ Email клієнту', url: `mailto:${contact}` }]);
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

    // Запис у Google Таблицю
    if (sheetUrl) {
      await fetch(sheetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'RFQ (Онлайн Розрахунок)',
          name: '-',
          contact: contact,
          partOrService: `${cleanPart} (£${totalEstimate})`,
          details: `Модель: ${machineModel}, К-сть: ${qty}`,
          message: `Країна: ${country} | ${note}`,
        }),
      }).catch((err) => console.error('Google Sheets error:', err));
    }

    return NextResponse.json(
      {
        success: true,
        estimatedPrice: unitPrice,
        totalEstimate: totalEstimate,
        basePrice: basePrice,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fatal route error:', error);
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}
