'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Gavel,
  Zap,
  Hammer,
  Wrench,
  HardHat,
  Forklift,
  Tractor,
  Search,
  Clock,
  MapPin,
  Gauge,
  Calendar,
  ExternalLink,
  X,
  CheckCircle2,
  ShieldCheck,
  Truck,
  FileText,
  Wallet,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Send,
} from 'lucide-react';
import Header from '../components/header';
import Footer from '../components/footer';
import FloatingContact from '../components/floating-contact';
import { CONTACT } from '@/lib/site-config';
import {
  AUCTION,
  AUCTION_LOTS,
  CATEGORY_LABELS,
  type AuctionCategory,
  type AuctionLot,
} from '@/lib/auction-lots';

const CATEGORY_ICONS: Record<AuctionCategory, React.ComponentType<{ className?: string }>> = {
  energy: Zap,
  breakers: Hammer,
  attachments: Wrench,
  excavators: HardHat,
  telehandlers: Forklift,
  agro: Tractor,
};

const CATEGORY_ORDER: AuctionCategory[] = ['energy', 'breakers', 'attachments', 'excavators', 'telehandlers', 'agro'];

type SortKey = 'closing' | 'newest' | 'hours';

// Час закриття показуємо за Києвом: так зручніше клієнтам в Україні
const kyivFmt = new Intl.DateTimeFormat('uk-UA', {
  timeZone: 'Europe/Kyiv',
  weekday: 'short',
  day: 'numeric',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
});
const formatKyiv = (ms: number) => kyivFmt.format(new Date(ms));

function timeLeft(ms: number, now: number) {
  const diff = ms - now;
  if (diff <= 0) return null;
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  if (h >= 48) return `${Math.floor(h / 24)} дн. ${h % 24} год`;
  if (h >= 1) return `${h} год ${m} хв`;
  return `${m} хв`;
}

export default function AuctionsPage() {
  const [now, setNow] = useState<number | null>(null);
  const [cat, setCat] = useState<AuctionCategory | 'all'>('all');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<SortKey>('closing');
  const [onlyUnused, setOnlyUnused] = useState(false);
  const [selected, setSelected] = useState<AuctionLot | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  // Годинник запускаємо тільки в браузері, щоб не було розбіжностей із серверним рендером
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: AUCTION_LOTS.length };
    for (const l of AUCTION_LOTS) c[l.category] = (c[l.category] || 0) + 1;
    return c;
  }, []);

  const lots = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = AUCTION_LOTS.filter((l) => (cat === 'all' || l.category === cat) && (!onlyUnused || l.unused));
    if (needle) {
      list = list.filter((l) =>
        [l.title, l.original, l.make, l.model, l.lot, l.specs].join(' ').toLowerCase().includes(needle)
      );
    }
    const sorted = [...list];
    if (sort === 'closing') sorted.sort((a, b) => a.endsAt - b.endsAt);
    if (sort === 'newest') sorted.sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || a.endsAt - b.endsAt);
    if (sort === 'hours') sorted.sort((a, b) => (a.hours ?? 1e9) - (b.hours ?? 1e9));
    // Закриті лоти завжди в кінці списку
    if (now) sorted.sort((a, b) => Number(a.endsAt <= now) - Number(b.endsAt <= now));
    return sorted;
  }, [cat, q, sort, onlyUnused, now]);

  const nextClosing = useMemo(() => {
    if (!now) return null;
    return AUCTION_LOTS.filter((l) => l.endsAt > now).sort((a, b) => a.endsAt - b.endsAt)[0] ?? null;
  }, [now]);

  const allClosed = now !== null && !nextClosing;

  const openForm = (lot: AuctionLot | null) => {
    setSelected(lot);
    setFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-red-500 selection:text-white">
      <Header />

      {/* ГОЛОВНИЙ ЕКРАН */}
      <section className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/15 border border-red-500/30 text-red-300 text-xs font-bold uppercase tracking-wide">
            <Gavel className="w-4 h-4" /> Аукціони Великої Британії
          </div>
          <h1 className="mt-4 text-3xl md:text-5xl font-black leading-tight max-w-3xl">
            Купуємо техніку на британських аукціонах — під ваше замовлення
          </h1>
          <p className="mt-4 text-slate-300 text-base md:text-lg max-w-2xl">
            Ви обираєте лот і називаєте свою максимальну ціну. Ми ставимо за вас, викуповуємо, оформлюємо експорт і
            доставляємо в Україну.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3 max-w-4xl">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="text-xs text-slate-400 font-semibold uppercase">Зараз триває</div>
              <div className="mt-1 font-bold">
                {AUCTION.house} · {AUCTION.dates}
              </div>
              <div className="text-sm text-slate-400">{AUCTION.place}</div>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="text-xs text-slate-400 font-semibold uppercase">Без резервних цін</div>
              <div className="mt-1 font-bold">Кожен лот продається</div>
              <div className="text-sm text-slate-400">за найвищу ставку, навіть якщо вона мала</div>
            </div>
            <div className="rounded-2xl bg-red-600 p-4">
              <div className="text-xs text-red-100 font-semibold uppercase">Найближче закриття</div>
              {allClosed ? (
                <div className="mt-1 font-bold">Торги цього аукціону завершено</div>
              ) : nextClosing && now ? (
                <>
                  <div className="mt-1 text-2xl font-black">{timeLeft(nextClosing.endsAt, now)}</div>
                  <div className="text-sm text-red-100">лот {nextClosing.lot} · {formatKyiv(nextClosing.endsAt)} (Київ)</div>
                </>
              ) : (
                <div className="mt-1 font-bold">18 листопада, зранку</div>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#lots" className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-red-600 hover:bg-red-700 font-bold">
              Дивитися {AUCTION_LOTS.length} лотів <ArrowRight className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={() => openForm(null)}
              className="inline-flex items-center gap-2 h-12 px-6 rounded-xl border border-white/20 hover:bg-white/10 font-bold"
            >
              Знайти інший лот під мене
            </button>
          </div>
        </div>
      </section>

      {/* ЯК ЦЕ ПРАЦЮЄ */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-2xl font-black">Як це працює</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              ['Обираєте лот', 'Тиснете «Хочу цей лот» і пишете свою максимальну ціну. Вище за неї ми не ставимо.'],
              ['Вносите передоплату', 'Якщо лот не виграємо — повертаємо гроші повністю.'],
              ['Ставимо за вас', 'Торгуємось до вашого ліміту і викуповуємо лот, якщо ціна вкладається.'],
              ['Експорт і доставка', 'Забираємо з майданчика, оформлюємо експортні документи і веземо в Україну.'],
            ].map(([t, d], i) => (
              <li key={t} className="rounded-2xl bg-white border border-slate-200 p-5">
                <div className="w-9 h-9 rounded-full bg-red-600 text-white font-black flex items-center justify-center">{i + 1}</div>
                <div className="mt-3 font-bold">{t}</div>
                <p className="mt-1 text-sm text-slate-600">{d}</p>
              </li>
            ))}
          </ol>

          <div className="mt-6 rounded-2xl bg-white border border-slate-200 p-5 md:p-6">
            <div className="flex items-center gap-2 font-bold">
              <Wallet className="w-5 h-5 text-red-600" /> З чого складається ціна для вас
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              {[
                'Ціна лота на аукціоні',
                `+ комісія аукціону ${AUCTION.auctionFeePercent}%`,
                '+ наша послуга (фіксована, називаємо до ставки)',
                `+ експортні документи (~£${AUCTION.exportDocsGbp})`,
                '+ доставка в Україну',
              ].map((x) => (
                <span key={x} className="px-3 py-1.5 rounded-lg bg-slate-100 font-semibold text-slate-700">{x}</span>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Розмитнення в Україні оплачує покупець. Інвойс з усіма складовими отримуєте до оплати. Британський VAT при
              експорті не застосовується до вашого рахунку.
            </p>
          </div>
        </div>
      </section>

      {/* ЛОТИ */}
      <section id="lots" className="scroll-mt-28 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black">Лоти аукціону</h2>
            <p className="text-sm text-slate-500 mt-1">
              Відібрали {AUCTION_LOTS.length} з {AUCTION.totalLots.toLocaleString('uk-UA')} лотів — те, що найбільше
              потрібно в Україні. Час закриття вказано за Києвом.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="JCB, 540-140, 165 кВА, лот 442…"
                className="w-full h-11 pl-9 pr-3 rounded-xl border-2 border-slate-200 focus:border-red-500 outline-none text-sm"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-11 px-3 rounded-xl border-2 border-slate-200 text-sm font-semibold bg-white"
              aria-label="Сортування"
            >
              <option value="closing">Скоро закриття</option>
              <option value="newest">Новіші роки</option>
              <option value="hours">Менше мотогодин</option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          <button
            type="button"
            onClick={() => setCat('all')}
            className={`shrink-0 h-10 px-4 rounded-xl text-sm font-bold border ${cat === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'}`}
          >
            Усі · {counts.all}
          </button>
          {CATEGORY_ORDER.map((c) => {
            const Icon = CATEGORY_ICONS[c];
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={`shrink-0 flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-bold border ${cat === c ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-700 border-slate-200 hover:border-red-300'}`}
              >
                <Icon className="w-4 h-4" /> {CATEGORY_LABELS[c]} · {counts[c] || 0}
              </button>
            );
          })}
          <label className="shrink-0 flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-bold border border-slate-200 cursor-pointer">
            <input type="checkbox" checked={onlyUnused} onChange={(e) => setOnlyUnused(e.target.checked)} className="accent-red-600" />
            Тільки нове
          </label>
        </div>

        {lots.length === 0 ? (
          <div className="mt-8 rounded-2xl border-2 border-dashed border-slate-200 p-10 text-center">
            <p className="font-bold">Нічого не знайшли за цим запитом</p>
            <p className="text-sm text-slate-500 mt-1">Напишіть, що шукаєте, — підберемо лот на цьому або наступних аукціонах.</p>
            <button type="button" onClick={() => openForm(null)} className="mt-4 h-11 px-5 rounded-xl bg-red-600 text-white font-bold text-sm">
              Залишити запит
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lots.map((l) => (
              <LotCard key={l.item} lot={l} now={now} onRequest={() => openForm(l)} />
            ))}
          </div>
        )}
      </section>

      {/* УМОВИ */}
      <section className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            [ShieldCheck, 'Ставимо тільки до вашого ліміту', 'Максимальну ціну фіксуємо письмово. Якщо торги пішли вище — лот не купуємо і повертаємо передоплату.'],
            [AlertTriangle, 'Стан «як є»', 'Аукціон продає техніку без гарантії. Перед ставкою можемо оглянути лот на майданчику — окрема послуга.'],
            [FileText, 'Документи для митниці', 'Інвойс, експортна декларація та документи для розмитнення в Україні.'],
            [Truck, 'Доставка в Україну', 'Підбираємо транспорт під габарит: від палети з навісним до трала для екскаватора.'],
          ].map(([Icon, t, d]) => {
            const I = Icon as React.ComponentType<{ className?: string }>;
            return (
              <div key={t as string} className="rounded-2xl bg-white border border-slate-200 p-5">
                <I className="w-6 h-6 text-red-600" />
                <div className="mt-3 font-bold">{t as string}</div>
                <p className="mt-1 text-sm text-slate-600">{d as string}</p>
              </div>
            );
          })}
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <p className="text-xs text-slate-500 max-w-4xl">
            {AUCTION.house} — незалежний аукціонний дім. NoLimitGoods Ltd не є його представником: ми купуємо лоти як
            покупець на ваше замовлення. Список лотів сформовано 16.11.2026; актуальні ставки та наявність уточнюйте в
            менеджера.
          </p>
        </div>
      </section>

      <Footer />
      <FloatingContact />

      {formOpen && <RequestModal lot={selected} onClose={() => setFormOpen(false)} />}
    </div>
  );
}

function LotCard({ lot, now, onRequest }: { lot: AuctionLot; now: number | null; onRequest: () => void }) {
  const Icon = CATEGORY_ICONS[lot.category];
  const closed = now !== null && lot.endsAt <= now;
  const left = now !== null ? timeLeft(lot.endsAt, now) : null;
  const urgent = now !== null && lot.endsAt - now < 6 * 3_600_000 && !closed;

  return (
    <article className={`flex flex-col rounded-2xl border bg-white p-5 transition-shadow hover:shadow-lg ${closed ? 'opacity-60' : 'border-slate-200'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex flex-wrap justify-end gap-1.5">
          <span className="px-2 py-1 rounded-md bg-slate-900 text-white text-[11px] font-black">Лот {lot.lot}</span>
          {lot.unused && (
            <span className="px-2 py-1 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Нове
            </span>
          )}
          {lot.inoperable && (
            <span className="px-2 py-1 rounded-md bg-amber-100 text-amber-800 text-[11px] font-bold">Несправний</span>
          )}
        </div>
      </div>

      <h3 className="mt-3 font-black leading-snug">{lot.title}</h3>
      <p className="text-xs text-slate-400 mt-0.5">{lot.original}</p>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-700">
        {lot.year && (
          <span className="inline-flex items-center gap-1"><Calendar className="w-4 h-4 text-slate-400" /> {lot.year} р.</span>
        )}
        {lot.hours !== null && (
          <span className="inline-flex items-center gap-1"><Gauge className="w-4 h-4 text-slate-400" /> {lot.hours.toLocaleString('uk-UA')} мотогод.</span>
        )}
        <span className="inline-flex items-center gap-1"><MapPin className="w-4 h-4 text-slate-400" /> {lot.location}</span>
      </div>

      {lot.specs && <p className="mt-2 text-sm text-slate-500 line-clamp-3">{lot.specs}</p>}

      <div className={`mt-4 flex items-center gap-2 text-sm font-semibold ${closed ? 'text-slate-500' : urgent ? 'text-red-600' : 'text-slate-700'}`}>
        <Clock className="w-4 h-4" />
        {closed ? 'Торги завершено' : (
          <span>
            Закриття: {formatKyiv(lot.endsAt)}
            {left && <span className="font-black"> · {left}</span>}
          </span>
        )}
      </div>

      <div className="mt-auto pt-4 flex gap-2">
        <button
          type="button"
          onClick={onRequest}
          disabled={closed}
          className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white font-bold text-sm"
        >
          {closed ? 'Лот закрито' : 'Хочу цей лот'}
        </button>
        {AUCTION.showSourceLinks && (
          <a
            href={lot.url}
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 px-3 rounded-xl border border-slate-200 hover:border-slate-400 text-slate-700 text-sm font-semibold inline-flex items-center gap-1"
            title="Фото та звіт огляду на сайті аукціону"
          >
            Фото <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </article>
  );
}

function RequestModal({ lot, onClose }: { lot: AuctionLot | null; onClose: () => void }) {
  const [contact, setContact] = useState('');
  const [maxBid, setMaxBid] = useState('');
  const [comment, setComment] = useState('');
  const [hp, setHp] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;
    setStatus('sending');
    const leadId = `NLG-A${Date.now().toString().slice(-6)}`;
    const lines = lot
      ? [
          `АУКЦІОН ${AUCTION.house}: ${AUCTION.name} (${AUCTION.dates})`,
          `Лот ${lot.lot}: ${lot.title}`,
          `Оригінал: ${lot.original} (ID ${lot.item})`,
          `Закриття: ${formatKyiv(lot.endsAt)} (Київ)`,
          `Максимальна ціна клієнта: ${maxBid ? `£${maxBid}` : 'не вказав'}`,
          `Посилання: ${lot.url}`,
        ]
      : ['ЗАПИТ НА ПІДБІР ЛОТА З АУКЦІОНУ', `Бюджет: ${maxBid ? `£${maxBid}` : 'не вказав'}`];
    if (comment.trim()) lines.push(`Коментар: ${comment.trim()}`);

    const fd = new FormData();
    fd.append('leadId', leadId);
    fd.append('contact', contact.trim());
    fd.append('comment', lines.join('\n'));
    fd.append('partType', 'Викуп з аукціону');
    fd.append('source', 'Сторінка аукціонів');
    fd.append('page', '/aukciony');
    fd.append('website_hp', hp);
    if (lot) {
      fd.append('items', JSON.stringify([{ partNumber: `Лот ${lot.lot}`, machineModel: lot.title, quantity: 1 }]));
    }

    try {
      const res = await fetch('/api/lead', { method: 'POST', body: fd });
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
          <div>
            <div className="text-xs font-bold uppercase text-red-600">{lot ? `Заявка на лот ${lot.lot}` : 'Підбір лота'}</div>
            <h3 className="mt-1 text-xl font-black">{lot ? lot.title : 'Знайдемо техніку на аукціонах під вас'}</h3>
            {lot && <p className="text-sm text-slate-500 mt-1">Закриття: {formatKyiv(lot.endsAt)} (Київ)</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Закрити" className="p-2 rounded-xl hover:bg-slate-100">
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
              <span className="text-sm font-bold">Телефон, Telegram або email *</span>
              <input
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="+380… або @username"
                className="mt-1 w-full h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-red-500 outline-none"
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold">{lot ? 'Ваша максимальна ціна лота, £' : 'Бюджет, £'}</span>
              <input
                inputMode="numeric"
                value={maxBid}
                onChange={(e) => setMaxBid(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="Наприклад, 2500"
                className="mt-1 w-full h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-red-500 outline-none"
              />
              <span className="text-xs text-slate-500">
                {lot ? 'Без комісії та доставки — їх порахуємо окремо. Можна залишити порожнім, порадимо самі.' : 'Орієнтовно, щоб ми підбирали лоти у вашому діапазоні.'}
              </span>
            </label>
            <label className="block">
              <span className="text-sm font-bold">{lot ? 'Коментар' : 'Що шукаєте?'}</span>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder={lot ? 'Куди доставити, питання щодо стану…' : 'Наприклад: JCB 3CX 2015+, до 6000 мотогодин, доставка в Київ'}
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
              Ставку робимо лише після передоплати. Якщо лот не виграємо — повертаємо гроші повністю.{' '}
              <Link href="/privacy" className="underline">Конфіденційність</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
