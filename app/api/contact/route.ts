export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, phone, service, message } = body ?? {};

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Заповніть обовʼязкові поля' }, { status: 400 });
    }

    const text = `📬 *Нове повідомлення з сайту*\n\n` +
      `👤 *Імʼя:* ${name}\n` +
      `📧 *Email:* \`${email}\`\n` +
      `🏢 *Компанія:* ${company || '-'}\n` +
      `📞 *Телефон:* ${phone ? `\`${phone}\`` : '-'}\n` +
      `🛠 *Послуга:* ${service || '-'}\n` +
      `💬 *Текст:*\n${message}`;

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const inlineKeyboard: any[] = [];
    const buttonsRow: any[] = [];

    if (phone) {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      if (cleanPhone.length >= 9) {
        buttonsRow.push({ text: '💬 WhatsApp', url: `https://wa.me/${cleanPhone}` });
      }
    }
    if (email) {
      buttonsRow.push({ text: '✉️ Написати Email', url: `mailto:${email}` });
    }

    if (buttonsRow.length > 0) {
      inlineKeyboard.push(buttonsRow);
    }

    if (token && chatId) {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'Markdown',
          reply_markup: inlineKeyboard.length > 0 ? { inline_keyboard: inlineKeyboard } : undefined,
        }),
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Помилка відправки' }, { status: 500 });
  }
}
