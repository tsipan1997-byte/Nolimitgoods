export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request?.json?.();

    const { name, email, company, phone, service, message } = body ?? {};

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email ?? '')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Save to database
    const submission = await prisma?.contactSubmission?.create?.({
      data: {
        name: String(name ?? ''),
        email: String(email ?? ''),
        company: company ? String(company) : null,
        phone: phone ? String(phone) : null,
        service: service ? String(service) : null,
        message: String(message ?? ''),
      },
    });

    // Send email notification
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
          <p style="color: #666; font-size: 12px;">
            Submitted at / Надіслано: ${new Date().toLocaleString('uk-UA', { timeZone: 'Europe/London' })}
          </p>
        </div>
      `;

      const appUrl = process.env.NEXTAUTH_URL || '';
      
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
          sender_email: appUrl ? `noreply@${new URL(appUrl).hostname}` : 'noreply@nolimitgoods.com',
          sender_alias: 'NOLIMITGOODS',
        }),
      });
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Continue even if email fails
    }

    return NextResponse.json(
      { success: true, id: submission?.id ?? '' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}
