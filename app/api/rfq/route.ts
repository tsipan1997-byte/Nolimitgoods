import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { partNumber, machineModel, quantity, country, contact } = body;

    // Validate required fields
    if (!partNumber || !machineModel || !quantity || !country || !contact) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Save to database
    await prisma.rFQSubmission.create({
      data: {
        partNumber,
        machineModel,
        quantity,
        country,
        contact,
      },
    });

    // Send email notification
    try {
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #DC2626; border-bottom: 2px solid #DC2626; padding-bottom: 10px;">
            🔧 New RFQ Request / Новий запит ціни
          </h2>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Part Number / Номер запчастини:</strong> ${partNumber}</p>
            <p style="margin: 10px 0;"><strong>Machine Model / Модель машини:</strong> ${machineModel}</p>
            <p style="margin: 10px 0;"><strong>Quantity / Кількість:</strong> ${quantity}</p>
            <p style="margin: 10px 0;"><strong>Country / Країна:</strong> ${country}</p>
            <p style="margin: 10px 0;"><strong>Contact / Контакт:</strong> ${contact}</p>
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
          notification_id: process.env.NOTIF_ID_RFQ_REQUEST,
          subject: `New RFQ: ${partNumber} - ${machineModel}`,
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
      { message: 'RFQ submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing RFQ:', error);
    return NextResponse.json(
      { error: 'Failed to process RFQ' },
      { status: 500 }
    );
  }
}
