export const dynamic = 'force-dynamic';
export const maxDuration = 30;

import { createHmac } from 'crypto';
import { NextResponse } from 'next/server';
import { sendMetaEvent } from '@/lib/meta-capi';
import { envOf, type Tenant } from '@/lib/tenants';
import { getTenantFromRequest } from '@/lib/tenant-server';
import { saveLead } from '@/lib/lead-store';

// ============================================================================
// ПРИЙОМ ЗАЯВОК RFQ
// Заявка йде в Telegram ОДРАЗУ, ще до будь-яких розрахунків цін,
// тому вона не губиться, навіть якщо пошук цін довгий або падає.
// Приймає: артикули, VIN / список текстом, фото деталі (до 3 шт.), контакт.
//
// WHITE LABEL: партнер визначається за Host (lib/tenant-server.ts). Повна заявка йде
// в Telegram / Google Sheet / CRM-вебхук ПАРТНЕРА (назви env — у lib/tenants.ts → leads).
// Нам (NoLimitGoods) — окреме коротке повідомлення без контактів клієнта (Non-Circumvention).
// Для NoLimitGoods усе як раніше: TELEGRAM_CHAT_ID і GOOGLE_SHEET_URL.
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

async function tg(token: string, method: string, body: BodyInit, isJson: boolean) {
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
    const tenant = getTenantFromRequest(request);
    const form = await request.formData();

    // Антиспам: приховане поле, яке заповнюють тільки боти
    if (String(form.get('website_hp') || '').trim()) {
      return NextResponse.json({ success: true });
    }

    const prefix = tenant.leads.idPrefix;
    let leadId = cut(String(form.get('leadId') || `${prefix}-${Date.now().toString().slice(-6)}`), 20);
    // Фронт генерує NLG-…; у партнера — його префікс (DEMO-…)
    if (prefix !== 'NLG') leadId = leadId.replace(/^NLG-/, `${prefix}-`);
    const createdAt = new Date().toISOString();
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

    const tgCfg = telegramTarget(tenant);
    let telegramOk = false;

    if (tgCfg) {
      const fullText = tgCfg.fallback
        ? `⚠️ <b>Партнер «${esc(tenant.brand.name)}» (${esc(tenant.id)}): канал заявок не налаштовано.</b>\n` +
          `Перешліть заявку партнеру. Клієнту напряму не пишемо (Non-Circumvention).\n\n` + text
        : text;
      telegramOk = await sendTelegramLead(tgCfg.token, tgCfg.chatId, fullText, contact, photos, leadId);
    }

    // ---------- 2. Рядок у Google Таблицю (як у контактній формі) ----------
    let sheetOk = false;
    const sheetUrl = envOf(tenant.leads.googleSheetUrlEnv);
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

    // ---------- 2б. CRM-вебхук партнера (POST JSON, підпис HMAC-SHA256 у X-Signature) ----------
    const crmOk = await sendCrmWebhook(tenant, {
      event: 'lead.created',
      leadId,
      tenant: tenant.id,
      createdAt,
      contact,
      country,
      type: partType,
      items,
      comment,
      photos: photos.length,
      source,
      page,
    });

    // ---------- 2в. Сховище заявок (для CSV-експорту партнера), якщо налаштовано KV ----------
    const storedOk = tenant.leads.csvExportTokenEnv && envOf(tenant.leads.csvExportTokenEnv) ? await saveLead({
      leadId,
      tenantId: tenant.id,
      createdAt,
      contact,
      country,
      partType,
      items,
      comment,
      source,
      page,
      photos: photos.length,
    }) : false;

    if (!telegramOk && !sheetOk && !crmOk && !storedOk) {
      return NextResponse.json({ error: 'delivery_failed' }, { status: 502 });
    }

    // ---------- 2г. Коротке повідомлення нам (NoLimitGoods) без контактів клієнта ----------
    if (!tenant.isDefault && tenant.leads.notifyOwner) {
      await notifyOwner(tenant, leadId, partType, items, page);
    }

    // ---------- 3. Подія Lead у Meta з сервера (працює і без згоди на cookie) ----------
    // event_id = leadId, той самий, що піксель отримує в eventID → Meta не задвоює.
    await sendMetaEvent(
      {
      eventName: 'Lead',
      eventId: leadId,
      page,
      request,
      fbc: cut(String(form.get('fbc') || ''), 300),
      contact,
      customData: { content_name: partType || source || 'Lead', num_items: items.length || undefined },
      },
      tenant
    );

    return NextResponse.json({ success: true, leadId });
  } catch (error: any) {
    console.error('Lead API error:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

// ---------- Маршрутизація заявок партнера ----------

/** Куди слати повну заявку в Telegram. fallback=true — у партнера канал не налаштовано, шлемо нам з позначкою. */
function telegramTarget(tenant: Tenant): { token: string; chatId: string; fallback: boolean } | null {
  const token = envOf(tenant.leads.telegramBotTokenEnv) || envOf('TELEGRAM_BOT_TOKEN');
  if (!token) return null;
  const chatId = envOf(tenant.leads.telegramChatIdEnv);
  if (chatId) return { token, chatId, fallback: false };
  if (tenant.isDefault) return null;
  // Партнер без жодного каналу (ні Telegram, ні Sheet, ні CRM) — щоб заявка не загубилась, шлемо нам
  const hasOther = envOf(tenant.leads.googleSheetUrlEnv) || envOf(tenant.leads.crmWebhookUrlEnv);
  const ownerChat = envOf('TELEGRAM_CHAT_ID');
  if (!hasOther && ownerChat) return { token, chatId: ownerChat, fallback: true };
  return null;
}

async function sendTelegramLead(token: string, chatId: string, text: string, contact: string, photos: File[], leadId: string) {
  let ok = await tg(
    token,
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
  if (!ok) {
    ok = await tg(token, 'sendMessage', JSON.stringify({ chat_id: chatId, text: text.replace(/<[^>]+>/g, '') }), true);
  }

  // Фото окремими повідомленнями з підписом номера запиту
  for (let i = 0; i < photos.length; i++) {
    const fd = new FormData();
    fd.append('chat_id', chatId);
    fd.append('caption', `📷 ${leadId} — фото ${i + 1}/${photos.length}`);
    fd.append('photo', photos[i], photos[i].name || `photo-${i + 1}.jpg`);
    const sent = await tg(token, 'sendPhoto', fd, false);
    if (!sent) {
      // Деякі формати Telegram не приймає як фото — тоді файлом
      const fd2 = new FormData();
      fd2.append('chat_id', chatId);
      fd2.append('caption', `📎 ${leadId} — файл ${i + 1}/${photos.length}`);
      fd2.append('document', photos[i], photos[i].name || `file-${i + 1}.jpg`);
      await tg(token, 'sendDocument', fd2, false);
    }
  }
  return ok;
}

async function sendCrmWebhook(tenant: Tenant, payload: Record<string, unknown>): Promise<boolean> {
  const url = envOf(tenant.leads.crmWebhookUrlEnv);
  if (!url) return false;
  const body = JSON.stringify(payload);
  const headers: Record<string, string> = { 'Content-Type': 'application/json', 'X-Lead-Id': String(payload.leadId) };
  const secret = envOf(tenant.leads.crmWebhookSecretEnv);
  if (secret) headers['X-Signature'] = `sha256=${createHmac('sha256', secret).update(body).digest('hex')}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, { method: 'POST', headers, body, signal: controller.signal });
    if (!res.ok) console.error(`CRM webhook ${tenant.id} ${res.status}`);
    return res.ok;
  } catch (err: any) {
    console.error(`CRM webhook ${tenant.id} failed:`, err?.name || 'error');
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/** Нам — лише партнер, номер заявки і лоти/артикули. Без контакту, коментаря і фото клієнта. */
async function notifyOwner(tenant: Tenant, leadId: string, partType: string, items: LeadItem[], page: string) {
  const token = envOf('TELEGRAM_BOT_TOKEN');
  const chatId = envOf('OWNER_TELEGRAM_CHAT_ID') || envOf('TELEGRAM_CHAT_ID');
  if (!token || !chatId) return false;
  const lots = items.length
    ? items.map((it, i) => `${i + 1}. ${esc(it.partNumber)}${it.machineModel ? ` — ${esc(it.machineModel)}` : ''}`).join('\n')
    : '— (підбір без конкретного лота)';
  const text =
    `🤝 <b>Заявка партнера ${esc(tenant.brand.name)}</b> (${esc(tenant.id)})\n` +
    `№ ${esc(leadId)}${partType ? ` · ${esc(partType)}` : ''}\n` +
    `\n${lots}\n` +
    (page ? `\n🔎 <i>${esc(page)}</i>\n` : '') +
    `\n<i>Контакти клієнта в партнера (Non-Circumvention).</i>`;
  return tg(token, 'sendMessage', JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }), true);
}
