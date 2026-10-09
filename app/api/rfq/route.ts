import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { partNumber, machineModel, quantity, country, contact, invoiceNumber, total } = body;

    const qty = Math.max(1, parseInt(quantity, 10) || 1);

    // 1. Пряма відправка у Xero через Webhook (Make / Zapier / Xero bridge)
    const xeroWebhookUrl = process.env.XERO_WEBHOOK_URL;

    if (xeroWebhookUrl) {
      try {
        await fetch(xeroWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            invoiceNumber: invoiceNumber || `NLG-${Date.now()}`,
            contactName: contact || 'Website Lead',
            itemDescription: `${partNumber} - ${machineModel || 'Machinery part'}`,
            quantity: qty,
            unitAmount: (total ? Number(total) / qty : 100),
            currencyCode: 'GBP',
            taxType: 'NONE', // 0% UK Export VAT
            lineAmountType: 'Exclusive',
            reference: `Online RFQ - ${country || 'Ukraine'}`,
            date: new Date().toISOString().split('T')[0],
          }),
        });
      } catch (xeroErr) {
        console.error('Xero Webhook error:', xeroErr);
      }
    }

    // 2. Telegram сповіщення (якщо підключено)
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (botToken && chatId) {
      const msg = 
        `🚨 *Нова заявка NoLimitGoods*\n\n` +
        `🧾 *Invoice Ref:* \`${invoiceNumber}\`\n` +
        `📦 *Артикул:* ${partNumber}\n` +
        `🚜 *Модель/Бренд:* ${machineModel || 'Не вказано'}\n` +
        `🔢 *Кількість:* ${qty} шт\n` +
        `📞 *Контакт:* ${contact}\n` +
        `💷 *Сума:* £${total} (≈ ${Math.round(Number(total || 0) * 56)} грн)`;

      try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: 'Markdown' }),
        });
      } catch (err) {
        console.error('Telegram error:', err);
      }
    }

    return NextResponse.json({ success: true, invoiceNumber });
  } catch (error) {
    console.error('RFQ API Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
