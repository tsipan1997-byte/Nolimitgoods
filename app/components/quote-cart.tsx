'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingCart, X, Trash2, Loader2, CheckCircle2, Minus, Plus } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import type { CatalogItem } from '@/lib/catalog';
import { clientPriceGbp, fmtGbp, loadRates, shippingGbp, type Rates } from '@/lib/pricing';
import { CONTACT } from '@/lib/site-config';

// ============================================================================
// КОШИК ЗАПИТУ (B2B): клієнт додає деталі з каталогу, лишає контакт —
// і весь список приходить вам у Telegram одним запитом через /api/lead.
// ============================================================================

type CartLine = { id: string; qty: number; item: CatalogItem };
const KEY = 'nlg_quote_cart_v2';
const EVT = 'nlg:cart-changed';

function read(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((l) => l && l.item && l.item.partNumber) : [];
  } catch {
    return [];
  }
}

function write(lines: CartLine[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    // приватний режим — кошик живе до перезавантаження сторінки
  }
  memory = lines;
  window.dispatchEvent(new Event(EVT));
}

let memory: CartLine[] | null = null;

export function addToCart(item: CatalogItem) {
  const lines = memory ?? read();
  const found = lines.find((l) => l.id === item.id);
  write(found ? lines.map((l) => (l.id === item.id ? { ...l, qty: l.qty + 1 } : l)) : [...lines, { id: item.id, qty: 1, item }]);
}

export function useCart() {
  const [lines, setLines] = useState<CartLine[]>([]);
  useEffect(() => {
    const sync = () => setLines(memory ?? read());
    sync();
    window.addEventListener(EVT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);
  return lines;
}

export default function QuoteCart() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';
  const lines = useCart();
  const [open, setOpen] = useState(false);
  const [rates, setRates] = useState<Rates | null>(null);
  const [contact, setContact] = useState('');
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [leadId, setLeadId] = useState('');

  useEffect(() => {
    loadRates().then(setRates);
    const openCart = () => setOpen(true);
    window.addEventListener('nlg:open-cart', openCart);
    return () => window.removeEventListener('nlg:open-cart', openCart);
  }, []);

  const items = lines.map((l) => ({ line: l, item: l.item }));
  const count = lines.reduce((a, l) => a + l.qty, 0);

  const partsTotal = items.reduce((acc, { line, item }) => {
    const p = clientPriceGbp(item, rates);
    return p === null || acc === null ? null : acc + p * line.qty;
  }, 0 as number | null);
  const weight = items.reduce((a, { line, item }) => a + item.weightKg * line.qty, 0);
  const oversized = items.some(({ item }) => item.oversized);
  const ship = items.length ? shippingGbp(weight, oversized) : 0;

  const setQty = (id: string, qty: number) =>
    write((memory ?? read()).map((l) => (l.id === id ? { ...l, qty: Math.max(1, qty) } : l)));
  const remove = (id: string) => write((memory ?? read()).filter((l) => l.id !== id));

  const submit = async () => {
    if (!contact.trim() || !items.length) return;
    const id = `NLG-${Date.now().toString().slice(-6)}`;
    setLeadId(id);
    setStatus('sending');
    const fd = new FormData();
    fd.append('leadId', id);
    fd.append('contact', contact.trim());
    fd.append('country', isUk ? 'Україна' : 'Ukraine');
    fd.append('partType', 'Кошик з каталогу');
    fd.append(
      'comment',
      [
        comment.trim(),
        partsTotal !== null ? `Сума на сайті: ${fmtGbp(partsTotal)} + доставка ${ship !== null ? fmtGbp(ship) : 'індивідуально'}` : '',
      ]
        .filter(Boolean)
        .join('\n')
    );
    fd.append('source', 'catalog-cart');
    fd.append('page', window.location.pathname);
    fd.append(
      'items',
      JSON.stringify(items.map(({ line, item }) => ({ partNumber: item.partNumber, machineModel: `${item.brand} — ${item.titleUk}`, quantity: line.qty })))
    );
    try {
      const res = await fetch('/api/lead', { method: 'POST', body: fd });
      if (!res.ok) throw new Error(String(res.status));
      const w = window as any;
      if (typeof w.gtag === 'function') w.gtag('event', 'conversion', { send_to: 'AW-670192610/Sx8lCIG5m54dEOKnyb8C' });
      if (typeof w.fbq === 'function') w.fbq('track', 'Lead', { content_name: 'Catalog cart', num_items: count });
      write([]);
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  if (!count && !open) return null;

  return (
    <>
      {/* Плаваюча кнопка кошика */}
      {count > 0 && !open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 left-5 z-50 flex items-center gap-2 pl-4 pr-5 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold shadow-[0_10px_30px_rgba(220,38,38,0.5)] transition-colors"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>{isUk ? 'Запит' : 'Quote'}</span>
          <span className="min-w-6 h-6 px-1.5 rounded-full bg-white text-red-600 text-xs font-black flex items-center justify-center">{count}</span>
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="relative w-full max-w-md h-full bg-white border-l border-slate-200 flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-red-500" />
                {isUk ? 'Кошик запиту' : 'Quote cart'}
              </h3>
              <button type="button" onClick={() => setOpen(false)} className="p-2 text-slate-500 hover:text-slate-900" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            {status === 'done' ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6 gap-4">
                <CheckCircle2 className="w-14 h-14 text-emerald-600" />
                <h4 className="text-xl font-black text-slate-900">{isUk ? `Запит ${leadId} надіслано` : `Request ${leadId} sent`}</h4>
                <p className="text-sm text-slate-500">
                  {isUk ? 'Менеджер підтвердить наявність, точну ціну й термін і звʼяжеться з вами.' : 'We will confirm stock, exact price and lead time and contact you.'}
                </p>
                <button type="button" onClick={() => { setStatus('idle'); setOpen(false); }} className="mt-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-900 text-sm font-bold">
                  {isUk ? 'Закрити' : 'Close'}
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                  {!items.length && <p className="text-sm text-slate-500">{isUk ? 'Кошик порожній.' : 'Cart is empty.'}</p>}
                  {items.map(({ line, item }) => {
                    const p = clientPriceGbp(item, rates);
                    return (
                      <div key={item.id} className="flex gap-3 p-3 rounded-xl bg-white border border-slate-200">
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] uppercase font-bold text-slate-500">{item.brand}</div>
                          <div className="font-mono text-sm text-slate-900">{item.partNumber}</div>
                          <div className="text-xs text-slate-500 truncate">{isUk ? item.titleUk : item.titleEn}</div>
                          <div className="mt-2 flex items-center gap-2">
                            <button type="button" onClick={() => setQty(item.id, line.qty - 1)} className="w-7 h-7 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center" aria-label="-"><Minus className="w-3.5 h-3.5" /></button>
                            <span className="w-6 text-center text-sm text-slate-900 font-mono">{line.qty}</span>
                            <button type="button" onClick={() => setQty(item.id, line.qty + 1)} className="w-7 h-7 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center" aria-label="+"><Plus className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <button type="button" onClick={() => remove(item.id)} className="text-slate-500 hover:text-red-600" aria-label="Remove"><Trash2 className="w-4 h-4" /></button>
                          <div className="text-sm font-bold text-slate-900">{p !== null ? fmtGbp(p * line.qty) : '—'}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {items.length > 0 && (
                  <div className="border-t border-slate-200 px-5 py-4 space-y-3">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between text-slate-600"><span>{isUk ? 'Деталі' : 'Parts'}</span><span className="font-bold text-slate-900">{partsTotal !== null ? fmtGbp(partsTotal) : '—'}</span></div>
                      <div className="flex justify-between text-slate-600">
                        <span>{isUk ? `Доставка в Україну (~${weight.toFixed(1)} кг)` : `Delivery (~${weight.toFixed(1)} kg)`}</span>
                        <span className="font-bold text-slate-900">{ship !== null ? fmtGbp(ship) : isUk ? 'індивідуально' : 'on request'}</span>
                      </div>
                      {partsTotal !== null && ship !== null && rates && (
                        <div className="flex justify-between pt-1 border-t border-slate-200 text-slate-900 font-black">
                          <span>{isUk ? 'Разом орієнтовно' : 'Estimated total'}</span>
                          <span>{fmtGbp(partsTotal + ship)} <span className="text-amber-600 font-bold text-xs">≈ {Math.round((partsTotal + ship) * rates.uah.GBP).toLocaleString('uk-UA')} ₴</span></span>
                        </div>
                      )}
                    </div>
                    <input
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder={isUk ? 'Телефон / @telegram / email *' : 'Phone / @telegram / email *'}
                      className="w-full px-4 py-3 bg-white text-slate-900 placeholder-slate-400 border border-slate-300 rounded-xl text-base focus:border-red-500 outline-none"
                    />
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={isUk ? 'Коментар: VIN, модель техніки (необовʼязково)' : 'Comment: VIN, machine (optional)'}
                      className="w-full px-4 py-3 bg-white text-slate-900 placeholder-slate-400 border border-slate-300 rounded-xl text-base sm:text-sm focus:border-red-500 outline-none"
                    />
                    {status === 'error' && (
                      <p className="text-xs text-amber-600">{isUk ? `Не вдалося надіслати. Спробуйте ще раз або напишіть у WhatsApp ${CONTACT.waDisplay}.` : `Could not send. Try again or WhatsApp ${CONTACT.waDisplay}.`}</p>
                    )}
                    <button
                      type="button"
                      onClick={submit}
                      disabled={!contact.trim() || status === 'sending'}
                      className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-extrabold uppercase tracking-wide flex items-center justify-center gap-2"
                    >
                      {status === 'sending' && <Loader2 className="w-4 h-4 animate-spin" />}
                      {isUk ? 'Надіслати запит' : 'Send request'}
                    </button>
                    <p className="text-[11px] text-slate-500 text-center">
                      {isUk ? 'Без оплати. Підтвердимо наявність і точну ціну.' : 'No payment now. We confirm stock and exact price.'}
                    </p>
                  </div>
                )}
              </>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
