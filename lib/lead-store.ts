// Сховище заявок для експорту в CSV (White Label).
// Працює через REST API Upstash Redis / Vercel KV (без залежностей): потрібні
// KV_REST_API_URL і KV_REST_API_TOKEN (Vercel → Storage → KV/Upstash додає їх сам).
// Без цих змінних нічого не зберігається, а експорт віддає порожній CSV з поясненням.

export type StoredLead = {
  leadId: string;
  tenantId: string;
  createdAt: string; // ISO
  contact: string;
  country: string;
  partType: string;
  items: { partNumber: string; machineModel: string; quantity: number }[];
  comment: string;
  source: string;
  page: string;
  photos: number;
};

const MAX_PER_TENANT = 5000;

function kv(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ''), token } : null;
}

export function leadStoreConfigured(): boolean {
  return kv() !== null;
}

async function command(args: (string | number)[]): Promise<unknown> {
  const c = kv();
  if (!c) return null;
  const res = await fetch(c.url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${c.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`KV ${args[0]} ${res.status}`);
  const data = (await res.json()) as { result?: unknown };
  return data.result;
}

const key = (tenantId: string) => `leads:${tenantId}`;

/** Зберегти заявку. Ніколи не кидає помилку: заявка вже пішла в Telegram/CRM. */
export async function saveLead(lead: StoredLead): Promise<boolean> {
  if (!kv()) return false;
  try {
    await command(['LPUSH', key(lead.tenantId), JSON.stringify(lead)]);
    await command(['LTRIM', key(lead.tenantId), 0, MAX_PER_TENANT - 1]);
    return true;
  } catch (err: any) {
    console.error('Lead store error:', err?.message || 'error');
    return false;
  }
}

export async function listLeads(tenantId: string): Promise<StoredLead[]> {
  const raw = (await command(['LRANGE', key(tenantId), 0, MAX_PER_TENANT - 1])) as string[] | null;
  if (!Array.isArray(raw)) return [];
  const out: StoredLead[] = [];
  for (const r of raw) {
    try {
      out.push(JSON.parse(r));
    } catch {
      /* пропускаємо пошкоджений запис */
    }
  }
  return out;
}

const CSV_COLUMNS: { title: string; get: (l: StoredLead) => string | number }[] = [
  { title: 'lead_id', get: (l) => l.leadId },
  { title: 'created_at', get: (l) => l.createdAt },
  { title: 'contact', get: (l) => l.contact },
  { title: 'country', get: (l) => l.country },
  { title: 'type', get: (l) => l.partType },
  { title: 'items', get: (l) => l.items.map((i) => `${i.partNumber}${i.machineModel ? ` (${i.machineModel})` : ''} x${i.quantity}`).join('; ') },
  { title: 'comment', get: (l) => l.comment },
  { title: 'photos', get: (l) => l.photos },
  { title: 'source', get: (l) => l.source },
  { title: 'page', get: (l) => l.page },
];

function csvCell(v: string | number): string {
  let s = String(v ?? '');
  // захист від CSV-ін'єкцій у Excel/Google Sheets
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n\r;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function leadsToCsv(leads: StoredLead[]): string {
  const head = CSV_COLUMNS.map((c) => c.title).join(',');
  const rows = leads.map((l) => CSV_COLUMNS.map((c) => csvCell(c.get(l))).join(','));
  // BOM, щоб Excel правильно відкрив кирилицю
  return '﻿' + [head, ...rows].join('\r\n') + '\r\n';
}
