export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request?.json?.();
    const { name, email, company, phone, service, message } = body ?? {};

    // Валідація полів
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Відправка листа на пошту
    try {
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #DC2626; border-bottom: 2px solid #DC2626; padding-bottom: 10px;">
            📧 New Contact Form / Нова форма зв'язку
          </h2>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Name / Ім'я:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${company ? `<p style="margin: 10px 0;"><strong>Company / Компанія:</strong> ${company}</p>` : ''}
            ${phone ? `<p style="margin: 10px 0;"><strong>Phone / Телефон:</strong> ${phone}</p>` : ''}
            <p style="margin: 10px 0;"><strong>Message / Повідомлення:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #DC2626;">
              ${message}
            </div>
          </div>
        </div>
      `;

      if (process.env.ABACUSAI_API_KEY) {
        await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            deployment_token: process.env.ABACUSAI_API_KEY,
            app_id: process.env.WEB_APP_ID,
            notification_id: process.env.NOTIF_ID_CONTACT_FORM,
            subject: `New Contact: ${name} - ${company || 'Individual'}`,
            body: htmlBody,
            is_html: true,
            recipient_email: 'tsipan1997@gmail.com',
            sender_email: 'noreply@nolimitgoods.co.uk',
            sender_alias: 'NOLIMITGOODS',
          }),
        });
      }
    } catch (e) {
      console.error('Notification error:', e);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 });
  }
}