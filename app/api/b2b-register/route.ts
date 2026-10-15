export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // 🛡️ Honeypot захист від спам-ботів
    if (data.website_hp) {
      return NextResponse.json({ success: true, status: 'filtered' });
    }

    const {
      companyName = '',
      taxId = '',
      contactPerson = '',
      email = '',
      phone = '',
      country = 'Україна',
      cityAddress = '',
      machineryFleet = '',
      notes = '',
    } = data;

    if (!companyName || !phone) {
      return NextResponse.json({ error: 'Заповніть назву компанії та телефон' }, { status: 400 });
    }

    const tgToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChatId = process.env.TELEGRAM_CHAT_ID;
    const googleSheetUrl =
      process.env.GOOGLE_SHEET_URL ||
      process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
      process.env.MAKE_WEBHOOK_URL;

    const dateNow = new Date().toLocaleString('uk-UA', { timeZone: 'Europe/London' });

    // 1. Запис у Google Таблицю (лист B2B_Clients)
    if (googleSheetUrl) {
      try {
        await fetch(googleSheetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            event: 'b2b_registration',
            date: dateNow,
            companyName,
            taxId,
            contactPerson,
            email,
            phone,
            country,
            cityAddress,
            machineryFleet,
            notes,
          }),
          redirect: 'follow',
        });
      } catch (err) {
        console.error('Google Sheets B2B dispatch error:', err);
      }
    }

    // 2. Сповіщення в Telegram
    if (tgToken && tgChatId) {
      const tgMsg =
        `🏢 <b>НОВА РЕЄСТРАЦІЯ B2B-КЛІЄНТА (0% VAT)</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `🏛 <b>Компанія:</b> ${companyName}\n` +
        `📑 <b>ЄДРПОУ / VAT:</b> <code>${taxId || '—'}</code>\n` +
        `👤 <b>Контакт:</b> ${contactPerson}\n` +
        `📞 <b>Телефон:</b> <code>${phone}</code>\n` +
        `✉️ <b>Email:</b> ${email}\n` +
        `📍 <b>Адреса:</b> ${country}, ${cityAddress}\n` +
        `🚜 <b>Парк:</b> ${machineryFleet || 'Не вказано'}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `🕒 <i>Час (UK Hub): ${dateNow}</i>`;

      try {
        await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: tgChatId,
            text: tgMsg,
            parse_mode: 'HTML',
          }),
        });
      } catch (err) {
        console.error('Telegram B2B notify error:', err);
      }
    }

    return NextResponse.json({ success: true, status: 'registered' });
  } catch (error: any) {
    console.error('B2B Register Error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
