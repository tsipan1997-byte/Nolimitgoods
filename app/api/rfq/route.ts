export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { partNumber, machineModel, quantity, country, contact } = body;

    if (!partNumber || !machineModel || !quantity || !country || !contact) {
      return NextResponse.json({ error: 'Всі поля обовʼязкові' }, { status: 400 });
    }

    const text = `🔧 *Новий запит запчастини (RFQ)*\n\n` +
      `⚙️ *Артикул:* ${partNumber}\n` +
      `🚜 *Модель техніки:* ${machineModel}\n` +
      `🔢 *Кількість:* ${quantity}\n` +
      `🌍 *Країна:* ${country}\n` +
      `📱 *Контакт:* ${contact}`;

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (token && chatId) {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'Markdown',
        }),
      });
    }

    return NextResponse.json({ message: 'Успішно відправлено' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Помилка обробки' }, { status: 500 });
  }
}