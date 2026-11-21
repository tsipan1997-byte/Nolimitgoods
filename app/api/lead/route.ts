export const dynamic = 'force-dynamic';
export const maxDuration = 30;

import { NextResponse } from 'next/server';
import { sendMetaEvent } from '@/lib/meta-capi';

// ============================================================================
// ПРИЙОМ ЗАЯВОК RFQ
// Заявка йде в Telegram ОДРАЗУ, ще до будь-яких розрахунків цін,
// тому вона не губиться, навіть якщо пошук цін довгий або падає.
// Приймає: артикули, VIN / список текстом, фото деталі (до 3 шт.), контакт.
// ============================================================================

const MAX_PHOTOS = 3;
const MAX_PHOTO_BYTES = 4 * 1024 * 1024; // 4 MB на фото (фронтенд стискає до ~0.5 MB)

type LeadItem = { partNumber: string; machineModel: string; quantity: number };

// Telegram у режимі HTML ламається на <, > і &, тому екрануємо все від клієнта
function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function cut(value: string, max: number): string {
  return value.length > max ? value.slice(0, max) + '…' : value;
}

// Кнопки під повідомленням: написати клієнту в один клік
function contactButtons(contact: string) {
  const row: { text: string; url: string }[] = [];
  const c = contact.trim();

  const tgUser = c.match(/^@([a-zA-Z0-9_]{4,32})$/) || c.match(/t\.me\/([a-zA-Z0-9_]{4,32})/);
  if (tgUser) {
    row.push({ text: '✈️ Telegram', url: `https://t.me/${tgUser[1]}` });
  }

  const isEmail = /\S+@\S+\.\S+/.test(c);
  const digits = c.replace(/[^0-9]/g, '');
  if (!isEmail && !tgUser && digits.length >= 9 && digits.length <= 15) {
    row.push({ text: '💬 WhatsApp', url: `https://wa.me/${digits}` });
  }

  return row.length ? { inline_keyboard: [row] } : undefined;
}

async function tg(method: string, body: BodyInit, isJson: boolean) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: isJson ? { 'Content-Type': 'application/json' } : undefined,
    body,
  });
  if (!res.ok) {
    console.error(`Telegram ${method} error:`, await res.text());
  }
  return res.ok;
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();

    // Антиспам: приховане поле, яке заповнюють тільки боти
    if (String(form.get('website_hp') || '').trim()) {
      return NextResponse.json({ success: true });
    }

    const leadId = cut(String(form.get('leadId') || `NLG-${Date.now().toString().slice(-6)}`), 20);
    const contact = cut(String(form.get('contact') || '').trim(), 200);
    const comment = cut(String(form.get('comment') || '').trim(), 2500);
    const country = cut(String(form.get('country') || 'Україна').trim(), 60);
    const partType = cut(String(form.get('partType') || '').trim(), 100);
    const source = cut(String(form.get('source') || '').trim(), 300);
    const page = cut(String(form.get('page') || '').trim(), 200);

    let items: LeadItem[] = [];
    try {
      const parsed = JSON.parse(String(form.get('items') || '[]'));
      if (Array.isArray(parsed)) {
        items = parsed
          .slice(0, 20)
          .map((it: any) => ({
            partNumber: cut(String(it?.partNumber || '').trim(), 60),
            machineModel: cut(String(it?.machineModel || '').trim(), 80),
            quantity: Math.max(1, Math.min(9999, parseInt(String(it?.quantity), 10) || 1)),
          }))
          .filter((it) => it.partNumber.length > 0);
      }
    } catch {
      items = [];
    }

    const photos = form
      .getAll('photos')
      .filter((f): f is File => typeof f === 'object' && f !== null && 'arrayBuffer' in f && (f as File).size > 0)
      .filter((f) => f.size <= MAX_PHOTO_BYTES)
      .slice(0, MAX_PHOTOS);

    if (!contact) {
      return NextResponse.json({ error: 'contact_required' }, { status: 400 });
    }
    if (items.length === 0 && !comment && photos.length === 0) {
      return NextResponse.json({ error: 'empty_request' }, { status: 400 });
    }

    // ---------- 1. Повідомлення в Telegram ----------
    const itemLines = items.length
      ? items
          .map(
            (it, i) =>
              `${i + 1}. <code>${esc(it.partNumber)}</code>` +
              (it.machineModel ? ` — ${esc(it.machineModel)}` : '') +
              ` × ${it.quantity} шт`
          )
          .join('\n')
      : '— (артикулів немає, див. опис / фото)';

    const text =
      `🆕 <b>НОВИЙ ЗАПИТ ${esc(leadId)}</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 <b>Контакт:</b> ${esc(contact)}\n` +
      `🌍 <b>Доставка:</b> ${esc(country)}\n` +
      (partType ? `🔧 <b>Цікавить:</b> ${esc(partType)}\n` : '') +
      `\n📋 <b>Деталі (${items.length}):</b>\n${itemLines}\n` +
      (comment ? `\n💬 <b>VIN / опис / список:</b>\n${esc(comment)}\n` : '') +
      (photos.length ? `\n📷 <b>Фото:</b> ${photos.length} шт. (нижче)\n` : '') +
      (source || page ? `\n🔎 <i>${esc([source, page].filter(Boolean).join(' | '))}</i>` : '');

    const hasTelegram = Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
    const chatId = process.env.TELEGRAM_CHAT_ID as string;
    let telegramOk = false;

    if (hasTelegram) {
      telegramOk = await tg(
        'sendMessage',
        JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
          reply_markup: contactButtons(contact),
        }),
        true
      );

      // Якщо HTML з якоїсь причини не пройшов — шлемо простим текстом, аби заявка точно дійшла
      if (!telegramOk) {
        telegramOk = await tg(
          'sendMessage',
          JSON.stringify({ chat_id: chatId, text: text.replace(/<[^>]+>/g, '') }),
          true
        );
      }

      // Фото окремими повідомленнями з підписом номера запиту
      for (let i = 0; i < photos.length; i++) {
        const fd = new FormData();
        fd.append('chat_id', chatId);
        fd.append('caption', `📷 ${leadId} — фото ${i + 1}/${photos.length}`);
        fd.append('photo', photos[i], photos[i].name || `photo-${i + 1}.jpg`);
        const ok = await tg('sendPhoto', fd, false);
        if (!ok) {
          // Деякі формати Telegram не приймає як фото — тоді файлом
          const fd2 = new FormData();
          fd2.append('chat_id', chatId);
          fd2.append('caption', `📎 ${leadId} — файл ${i + 1}/${photos.length}`);
          fd2.append('document', photos[i], photos[i].name || `file-${i + 1}.jpg`);
          await tg('sendDocument', fd2, false);
        }
      }
    }

    // ---------- 2. Рядок у Google Таблицю (як у контактній формі) ----------
    let sheetOk = false;
    const sheetUrl = process.env.GOOGLE_SHEET_URL;
    if (sheetUrl) {
      try {
        const res = await fetch(sheetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: `RFQ ${leadId}`,
            name: contact,
            contact,
            partOrService: items.map((it) => `${it.partNumber} x${it.quantity}`).join('; ') || 'Без артикула',
            details: [country, partType, photos.length ? `${photos.length} фото` : ''].filter(Boolean).join(' | '),
            message: [comment, source].filter(Boolean).join('\n'),
          }),
        });
        sheetOk = res.ok;
      } catch (err) {
        console.error('Google Sheets error:', err);
      }
    }

    if (!telegramOk && !sheetOk) {
      return NextResponse.json({ error: 'delivery_failed' }, { status: 502 });
    }

    // ---------- 3. Подія Lead у Meta з сервера (працює і без згоди на cookie) ----------
    // event_id = leadId, той самий, що піксель отримує в eventID → Meta не задвоює.
    await sendMetaEvent({
      eventName: 'Lead',
      eventId: leadId,
      page,
      request,
      fbc: cut(String(form.get('fbc') || ''), 300),
      contact,
      customData: { content_name: partType || source || 'Lead', num_items: items.length || undefined },
    });

    return NextResponse.json({ success: true, leadId });
  } catch (error: any) {
    console.error('Lead API error:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
