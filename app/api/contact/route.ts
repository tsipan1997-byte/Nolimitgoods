export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, phone, service, message } = body ?? {};

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Заповніть обовʼязкові поля' }, { status: 400 });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const sheetUrl = process.env.GOOGLE_SHEET_URL;

    // 1. Надсилання до Telegram (звичайний текст без Markdown, щоб не було збоїв через спецсимволи)
    if (token && chatId) {
      const text = `📬 Нове повідомлення з сайту\n\n` +
        `👤 Імʼя: ${name}\n` +
        `📧 Email: ${email}\n` +
        `🏢 Компанія: ${company || '-'}\n` +
        `📞 Телефон: ${phone || '-'}\n` +
        `🛠 Послуга: ${service || '-'}\n` +
        `💬 Текст:\n${message}`;

      const inlineKeyboard: any[] = [];
      const buttonsRow: any[] = [];

      if (phone) {
        const cleanPhone = String(phone).replace(/[^0-9]/g, '');
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

      const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          reply_markup: inlineKeyboard.length > 0 ? { inline_keyboard: inlineKeyboard } : undefined,
        }),
      });

      if (!tgRes.ok) {
        const errDetails = await tgRes.text();
        console.error('Telegram API error:', errDetails);
      }
    }

    // 2. Запис у Google Таблицю
    if (sheetUrl) {
      await fetch(sheetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'Контактна форма',
          name: company ? `${name} (${company})` : name,
          contact: phone ? `${phone} / ${email}` : email,
          partOrService: service || 'Загальне звернення',
          details: '-',
          message: message,
        }),
      }).catch((err) => console.error('Google Sheets error:', err));
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Помилка відправки' }, { status: 500 });
  }
}
