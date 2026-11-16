export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

// Відгук клієнта → Telegram. На сайт потрапляє тільки після вашої перевірки.
const esc = (v: unknown) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const cut = (v: string, n: number) => (v.length > n ? v.slice(0, n) + '…' : v);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (body.website_hp) return NextResponse.json({ ok: true }); // бот

  const name = cut(String(body.name ?? '').trim(), 80);
  const city = cut(String(body.city ?? '').trim(), 80);
  const part = cut(String(body.part ?? '').trim(), 200);
  const text = cut(String(body.text ?? '').trim(), 2000);
  const rating = Math.min(5, Math.max(1, Number(body.rating) || 5));
  const contact = cut(String(body.contact ?? '').trim(), 120);
  const publish = Boolean(body.publish);
  if (!name || text.length < 5) return NextResponse.json({ ok: false, error: 'empty' }, { status: 400 });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return NextResponse.json({ ok: false }, { status: 500 });

  const msg =
    `⭐ <b>Новий відгук</b> ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}\n\n` +
    `<b>Ім'я:</b> ${esc(name)}${city ? `, ${esc(city)}` : ''}\n` +
    (part ? `<b>Що замовляв:</b> ${esc(part)}\n` : '') +
    (contact ? `<b>Контакт:</b> ${esc(contact)}\n` : '') +
    `\n${esc(text)}\n\n` +
    (publish ? '✅ Дозволив публікацію на сайті' : '🚫 Публікувати не можна');

  const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chat, text: msg, parse_mode: 'HTML', disable_web_page_preview: true }),
  }).catch(() => null);

  return NextResponse.json({ ok: Boolean(r?.ok) }, { status: r?.ok ? 200 : 502 });
}
