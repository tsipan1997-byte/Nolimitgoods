'use client';

// Спільні елементи лотів аукціонів: картка лота, блок ціни, форма заявки.
// Використовуються на /aukciony і на тематичних сторінках (пікапи, генератори, вантажівки…).

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Zap, Hammer, Wrench, HardHat, Forklift, Tractor, Truck, CarFront, Clock, MapPin, Gauge, Calendar, X,
  CheckCircle2, Sparkles, Send, Radio,
} from 'lucide-react';
import { CONTACT } from '@/lib/site-config';
import { AUCTIONS, AUCTION_META, FEE, pct, ourFee, minFee, rbFee, type AuctionCategory, type AuctionLot } from '@/lib/auction-lots';
import { lotPrice, PRICES_UPDATED_AT } from '@/lib/auction-prices';
import { stavok } from '@/lib/plural';
import { lotPhotoUrl } from '@/lib/lot-photos';
import { CONTACT_ERROR, CONTACT_LABEL, CONTACT_PLACEHOLDER, isPhoneOrTelegram } from '@/lib/contact-validation';
import { getFbc, trackLead, trafficTag } from '@/lib/meta-client';

export const CATEGORY_ICONS: Record<AuctionCategory, React.ComponentType<{ className?: string }>> = {
  energy: Zap,
  breakers: Hammer,
  attachments: Wrench,
  excavators: HardHat,
  telehandlers: Forklift,
  agro: Tractor,
  pickups: CarFront,
  trucks: Truck,
};

export const AUCTION_BY_ID = Object.fromEntries(AUCTIONS.map((a) => [a.id, a]));

// Час показуємо за Києвом: так зручніше клієнтам в Україні
const kyivFmt = new Intl.DateTimeFormat('uk-UA', {
  timeZone: 'Europe/Kyiv',
  weekday: 'short',
  day: 'numeric',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
});
const kyivDayFmt = new Intl.DateTimeFormat('uk-UA', { timeZone: 'Europe/Kyiv', weekday: 'short', day: 'numeric', month: 'long' });
export const formatKyiv = (ms: number) => kyivFmt.format(new Date(ms));
export const lotWhen = (l: AuctionLot) =>
  l.live ? `торги ${kyivDayFmt.format(new Date(l.endsAt))} (живий аукціон)` : `закриття ${formatKyiv(l.endsAt)}`;

export function timeLeft(ms: number, now: number) {
  const diff = ms - now;
  if (diff <= 0) return null;
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  if (h >= 48) return `${Math.floor(h / 24)} дн. ${h % 24} год`;
  if (h >= 1) return `${h} год ${m} хв`;
  return `${m} хв`;
}

export const gbp = (n: number) => `£${n.toLocaleString('uk-UA')}`;

export function isClosed(l: AuctionLot, now: number) {
  // Для живих торгів лот вважаємо закритим після кінця дня торгів
  return l.live ? l.endsAt + 10 * 3_600_000 <= now : l.endsAt <= now;
}

const updatedFmt = new Intl.DateTimeFormat('uk-UA', { timeZone: 'Europe/Kyiv', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

export function PriceBox({ lot, closed }: { lot: AuctionLot; closed: boolean }) {
  const p = closed ? null : lotPrice(lot.auction, lot.lot);
  const updated = PRICES_UPDATED_AT ? updatedFmt.format(new Date(PRICES_UPDATED_AT)) : null;
  if (p && p.bid) {
    return (
      <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 px-3 py-2">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs text-slate-500">{closed ? 'Остання ставка' : 'Поточна ставка'}</span>
          <span className="text-xl font-black">£{p.bid.toLocaleString('en-GB')}</span>
        </div>
        <div className="text-[11px] text-slate-400">
          {p.bids} {stavok(p.bids)}
          {updated && ` · оновлено ${updated} (Київ)`} · без збору аукціону, комісії і доставки
        </div>
      </div>
    );
  }
  return (
    <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-500">
      {closed
        ? 'Торги завершено. Підберемо схожий лот на найближчих аукціонах.'
        : lot.live
          ? 'Ставки — в день живих торгів. Ваш ліміт подаємо заздалегідь.'
          : 'Ставок ще немає — можна зайти з мінімальної ціни.'}
    </div>
  );
}

export function LotCard({ lot, now, onRequest }: { lot: AuctionLot; now: number | null; onRequest: () => void }) {
  const Icon = CATEGORY_ICONS[lot.category];
  const a = AUCTION_BY_ID[lot.auction];
  const closed = now !== null && isClosed(lot, now);
  const left = now !== null && !lot.live ? timeLeft(lot.endsAt, now) : null;
  const urgent = now !== null && !closed && lot.endsAt - now < 24 * 3_600_000;
  // Фото: наша копія у сховищі → оригінал з аукціону → іконка
  const photos = [lotPhotoUrl(lot.auction, lot.item), lot.img].filter(Boolean) as string[];
  const [photoIdx, setPhotoIdx] = useState(0);
  const imgOk = photoIdx < photos.length;

  return (
    <article className={`flex flex-col rounded-xl sm:rounded-2xl border bg-white overflow-hidden transition-shadow hover:shadow-lg border-slate-200 ${closed ? 'bg-slate-50' : ''}`}>
      <div className="relative aspect-[4/3] bg-slate-100">
        {imgOk ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photos[photoIdx]}
            alt={`${lot.title}${lot.year ? `, ${lot.year}` : ''} — аукціон ${a?.house ?? ''}, Велика Британія`}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setPhotoIdx((n) => n + 1)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-300">
            <Icon className="w-16 h-16" />
          </div>
        )}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
          <span className="hidden sm:inline px-2 py-1 rounded-md bg-slate-900/85 text-white text-[11px] font-black">{a?.house}</span>
          {lot.lot && <span className="px-2 py-1 rounded-md bg-white/90 text-slate-900 text-[11px] font-black">Лот {lot.lot}</span>}
        </div>
        <div className="absolute top-2 right-2 flex flex-wrap justify-end gap-1.5">
          {lot.unused && (
            <span className="px-2 py-1 rounded-md bg-emerald-500 text-white text-[11px] font-bold inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Нове
            </span>
          )}
          {lot.inoperable && <span className="px-2 py-1 rounded-md bg-amber-500 text-white text-[11px] font-bold">Несправний</span>}
          {lot.live && (
            <span className="px-2 py-1 rounded-md bg-red-600 text-white text-[11px] font-bold inline-flex items-center gap-1">
              <Radio className="w-3 h-3" /> <span className="hidden sm:inline">Живі торги</span><span className="sm:hidden">Live</span>
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-2.5 sm:p-5">
        <h3 className="font-black leading-snug text-[13px] sm:text-base line-clamp-2 sm:line-clamp-none">{lot.title}</h3>
        <p className="hidden sm:block text-xs text-slate-400 mt-0.5 line-clamp-1">{lot.original}</p>

        <div className="mt-1.5 sm:mt-3 flex flex-wrap gap-x-3 sm:gap-x-4 gap-y-0.5 sm:gap-y-1 text-xs sm:text-sm text-slate-700">
          {lot.year && (
            <span className="inline-flex items-center gap-1"><Calendar className="w-4 h-4 text-slate-400" /> {lot.year} р.</span>
          )}
          {lot.miles ? (
            <span className="inline-flex items-center gap-1"><Gauge className="w-4 h-4 text-slate-400" /> {lot.miles.toLocaleString('uk-UA')} км</span>
          ) : null}
          {lot.hours !== null && (
            <span className="inline-flex items-center gap-1"><Gauge className="w-4 h-4 text-slate-400" /> {lot.hours.toLocaleString('uk-UA')} мотогод.</span>
          )}
          <span className="hidden sm:inline-flex items-center gap-1"><MapPin className="w-4 h-4 text-slate-400" /> {lot.location}</span>
        </div>

        {lot.specs && <p className="hidden sm:block mt-2 text-sm text-slate-500 line-clamp-3">{lot.specs}</p>}

        <div className="hidden sm:block"><PriceBox lot={lot} closed={closed} /></div>

        <div className={`mt-1.5 sm:mt-3 flex items-start gap-1.5 sm:gap-2 text-[11px] sm:text-sm font-semibold ${closed ? 'text-slate-500' : urgent ? 'text-red-600' : 'text-slate-700'}`}>
          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 shrink-0" />
          {closed ? (
            'Торги завершено'
          ) : (
            <span>
              {lotWhen(lot)}
              {left && <span className="font-black"> · {left}</span>}
            </span>
          )}
        </div>

        <div className="mt-auto pt-2.5 sm:pt-4">
          <button
            type="button"
            onClick={onRequest}
            className={`w-full h-9 sm:h-11 rounded-lg sm:rounded-xl text-white font-bold text-xs sm:text-sm ${closed ? 'bg-slate-900 hover:bg-slate-800' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {closed ? 'Хочу схожий' : 'Хочу цей лот'}
          </button>
        </div>
      </div>
    </article>
  );
}

export function RequestModal({ lot, onClose, page = '/aukciony', source = 'Сторінка аукціонів', topic }: { lot: AuctionLot | null; onClose: () => void; page?: string; source?: string; topic?: string }) {
  const [contact, setContact] = useState('');
  const [maxBid, setMaxBid] = useState('');
  const [comment, setComment] = useState('');
  const [hp, setHp] = useState('');
  const [contactError, setContactError] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const a = lot ? AUCTION_BY_ID[lot.auction] : null;
  const bid = parseInt(maxBid || '0', 10) || 0;
  const isRb = a?.house === 'Ritchie Bros';

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPhoneOrTelegram(contact)) {
      setContactError(true);
      return;
    }
    setStatus('sending');
    const leadId = `NLG-A${Date.now().toString().slice(-6)}`;
    const lines = lot && a
      ? [
          `АУКЦІОН ${a.house}: ${a.name} (${a.dates})`,
          `${lot.lot ? `Лот ${lot.lot}: ` : ''}${lot.title}`,
          `Оригінал: ${lot.original} (ID ${lot.item})`,
          `Торги: ${lotWhen(lot)} (Київ)`,
          `Максимальна ціна клієнта: ${bid ? gbp(bid) : 'не вказав'}${bid ? ` · наша комісія ${gbp(ourFee(bid))}` : ''}`,
          `Посилання: ${lot.url}`,
        ]
      : [topic ? `ЗАПИТ НА ПІДБІР: ${topic}` : 'ЗАПИТ НА ПІДБІР ТЕХНІКИ З АУКЦІОНІВ', `Бюджет: ${bid ? gbp(bid) : 'не вказав'}`];
    if (comment.trim()) lines.push(`Коментар: ${comment.trim()}`);

    const fd = new FormData();
    fd.append('leadId', leadId);
    fd.append('fbc', getFbc());
    fd.append('contact', contact.trim());
    fd.append('comment', lines.join('\n'));
    fd.append('partType', 'Викуп з аукціону');
    fd.append('source', `${source} ${trafficTag()}`.trim());
    fd.append('page', page);
    fd.append('website_hp', hp);
    if (lot) {
      fd.append('items', JSON.stringify([{ partNumber: lot.lot ? `Лот ${lot.lot}` : `ID ${lot.item}`, machineModel: lot.title, quantity: 1 }]));
    }

    try {
      const res = await fetch('/api/lead', { method: 'POST', body: fd });
      if (res.ok) {
        const w = window as any;
        if (typeof w.gtag === 'function') w.gtag('event', 'conversion', { send_to: 'AW-670192610/Sx8lCIG5m54dEOKnyb8C' });
        trackLead(leadId, { content_name: 'Auction lot', value: bid || undefined, currency: 'GBP' });
      }
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-950/60 p-0 sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xs font-bold uppercase text-red-600">
              {lot ? `${a?.house}${lot.lot ? ` · лот ${lot.lot}` : ''}` : 'Підбір техніки'}
            </div>
            <h3 className="mt-1 text-xl font-black">{lot ? lot.title : 'Знайдемо техніку на аукціонах під вас'}</h3>
            {lot && <p className="text-sm text-slate-500 mt-1">{lotWhen(lot)} (Київ)</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Закрити" className="p-2 rounded-xl hover:bg-slate-100 shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {status === 'done' ? (
          <div className="mt-6 text-center py-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <p className="mt-3 font-black text-lg">Заявку отримали</p>
            <p className="mt-1 text-sm text-slate-600">
              Менеджер напише вам найближчим часом з актуальною ставкою і повною ціною до України.
            </p>
            <button type="button" onClick={onClose} className="mt-5 h-11 px-6 rounded-xl bg-slate-900 text-white font-bold text-sm">
              Добре
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-5 space-y-4">
            <label className="block">
              <span className="text-sm font-bold">{CONTACT_LABEL}</span>
              <input
                required
                type="tel"
                autoComplete="tel"
                value={contact}
                onChange={(e) => {
                  setContact(e.target.value);
                  if (contactError) setContactError(false);
                }}
                placeholder={CONTACT_PLACEHOLDER}
                aria-invalid={contactError}
                className={`mt-1 w-full h-12 px-4 rounded-xl border-2 outline-none ${contactError ? 'border-red-500' : 'border-slate-200 focus:border-red-500'}`}
              />
              {contactError && <span className="mt-1 block text-xs font-semibold text-red-600">{CONTACT_ERROR}</span>}
            </label>
            <label className="block">
              <span className="text-sm font-bold">{lot ? 'Ваша максимальна ціна лота, £' : 'Бюджет, £'}</span>
              <input
                inputMode="numeric"
                value={maxBid}
                onChange={(e) => setMaxBid(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="Наприклад, 25000"
                className="mt-1 w-full h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-red-500 outline-none"
              />
            </label>

            {lot && bid > 0 && (
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm space-y-1">
                <div className="flex justify-between"><span>Ціна лота (максимум)</span><b>{gbp(bid)}</b></div>
                <div className="flex justify-between">
                  <span>Комісія аукціону</span>
                  <b>{isRb ? gbp(rbFee(bid)) : 'за тарифом аукціону'}</b>
                </div>
                <div className="flex justify-between">
                  <span>Наша послуга ({pct(bid > FEE.threshold ? FEE.highPct : FEE.lowPct)}%{ourFee(bid) === minFee(bid) ? `, мінімум для лота ${bid <= 5000 ? 'до £5 000' : bid < 10000 ? 'до £10 000' : 'від £10 000'}` : ''})</span>
                  <b>{gbp(ourFee(bid))}</b>
                </div>
                <div className="flex justify-between"><span>Експортні документи</span><b>~{gbp(AUCTION_META.exportDocsGbp)}</b></div>
                <div className="flex justify-between text-slate-500"><span>Доставка в Україну</span><span>порахуємо під габарит</span></div>
                {isRb && (
                  <div className="pt-2 mt-2 border-t border-slate-200 flex justify-between font-black">
                    <span>Разом без доставки</span>
                    <span>{gbp(bid + rbFee(bid) + ourFee(bid) + AUCTION_META.exportDocsGbp)}</span>
                  </div>
                )}
              </div>
            )}

            <label className="block">
              <span className="text-sm font-bold">{lot ? 'Коментар' : 'Що шукаєте?'}</span>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder={lot ? 'Куди доставити, потрібен огляд перед ставкою…' : 'Наприклад: JCB 3CX 2015+, до 6000 мотогодин, доставка в Київ'}
                className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-red-500 outline-none"
              />
            </label>
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={hp}
              onChange={(e) => setHp(e.target.value)}
              className="hidden"
              aria-hidden="true"
              name="website_hp"
            />
            {status === 'error' && (
              <p className="text-sm text-red-600 font-semibold">
                Не вдалося надіслати. Напишіть нам напряму:{' '}
                <a href={CONTACT.telegram} className="underline" target="_blank" rel="noopener noreferrer">Telegram</a> або{' '}
                <a href={CONTACT.whatsapp} className="underline" target="_blank" rel="noopener noreferrer">WhatsApp</a>.
              </p>
            )}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full h-12 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold inline-flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> {status === 'sending' ? 'Надсилаємо…' : 'Надіслати заявку'}
            </button>
            <p className="text-xs text-slate-500 text-center">
              Ставку робимо лише після передоплати. Не виграли — повертаємо гроші повністю.{' '}
              <Link href="/privacy" className="underline">Конфіденційність</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
