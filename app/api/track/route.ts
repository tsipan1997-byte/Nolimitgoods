export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { sendMetaEvent } from '@/lib/meta-capi';

// Клік по Telegram / WhatsApp / Viber / телефону / email → подія Contact у Meta
// з сервера. Без персональних даних: лише IP, браузер і fbclid з реклами.
const METHODS = new Set(['telegram', 'whatsapp', 'viber', 'phone', 'email']);

export async function POST(request: Request) {
  try {
    const body = JSON.parse((await request.text()).slice(0, 2000) || '{}');
    const method = String(body.method || '');
    const eventId = String(body.eventId || '').slice(0, 64);
    if (!METHODS.has(method) || !eventId) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    await sendMetaEvent({
      eventName: 'Contact',
      eventId,
      page: String(body.page || '').slice(0, 300),
      request,
      fbc: String(body.fbc || '').slice(0, 300),
      customData: { contact_method: method },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
