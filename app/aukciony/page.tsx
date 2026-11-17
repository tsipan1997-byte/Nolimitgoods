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
  X,
  CheckCircle2,
  ShieldCheck,
  Truck,
  FileText,
  Wallet,
  Sparkles,
  ArrowRight,
  Send,
  Eye,
  Radio,
  ChevronDown,
} from 'lucide-react';
import Header from '../components/header';
import Footer from '../components/footer';
import FloatingContact from '../components/floating-contact';
import { CONTACT } from '@/lib/site-config';
import {
  AUCTIONS,
  AUCTION_CALENDAR,
  AUCTION_LOTS,
  AUCTION_META,
  CATEGORY_LABELS,
  FEE,
  ourFee,
  rbFee,
  type AuctionCategory,
  type AuctionLot,
} from '@/lib/auction-lots';
import { lotPrice, PRICES_UPDATED_AT } from '@/lib/auction-prices';
import { lotiv, stavok } from '@/lib/plural';

const CATEGORY_ICONS: Record<AuctionCategory, React.ComponentType<{ className?: string }>> = {
  energy: Zap,
  breakers: Hammer,
  attachments: Wrench,
  excavators: HardHat,
  telehandlers: Forklift,
  agro: Tractor,
};

const CATEGORY_ORDER: AuctionCategory[] = ['excavators', 'telehandlers', 'agro', 'energy', 'breakers', 'attachments'];
const AUCTION_BY_ID = Object.fromEntries(AUCTIONS.map((a) => [a.id, a]));
const PAGE_SIZE = 24;

type SortKey = 'closing' | 'newest' | 'hours';

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
const formatKyiv = (ms: number) => kyivFmt.format(new Date(ms));
const lotWhen = (l: AuctionLot) =>
  l.live ? `торги ${kyivDayFmt.format(new Date(l.endsAt))} (живий аукціон)` : `закриття ${formatKyiv(l.endsAt)}`;

function timeLeft(ms: number, now: number) {
  const diff = ms - now;
  if (diff <= 0) return null;
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  if (h >= 48) return `${Math.floor(h / 24)} дн. ${h % 24} год`;
  if (h >= 1) return `${h} год ${m} хв`;
  return `${m} хв`;
}

const gbp = (n: number) => `£${n.toLocaleString('uk-UA')}`;

// Питання й відповіді: показуються на сторінці та йдуть у розмітку FAQPage для Google
const FAQ: [string, string][] = [
  [
    'Як купити спецтехніку з аукціону у Великій Британії, якщо я в Україні?',
    'Обираєте лот на цій сторінці або на будь-якому британському аукціоні, називаєте максимальну ціну і вносите передоплату. NoLimitGoods Ltd — британська компанія з власним складом у Ковентрі: ми реєструємось на аукціоні як покупець, робимо ставки до вашого ліміту, оплачуємо лот, забираємо його, оформлюємо експорт і доставляємо в Україну.',
  ],
  [
    'Скільки коштує ваша послуга?',
    `${FEE.lowPct}% від ціни лота, якщо лот коштує до ${gbp(FEE.threshold)} (мінімум ${gbp(FEE.minGbp)}), і ${FEE.highPct}% — якщо дорожче. До цього додається комісія самого аукціону, експортні документи та доставка. Усе фіксуємо в інвойсі до оплати.`,
  ],
  [
    'Що буде, якщо лот не виграємо?',
    'Якщо торги пішли вище за вашу максимальну ціну, ми не купуємо лот і повертаємо передоплату повністю. Можемо одразу підібрати схожий лот на наступному аукціоні.',
  ],
  [
    'Чи можна оглянути техніку перед покупкою?',
    'Так. Наш склад у Ковентрі, до майданчиків Ritchie Bros (Мальтбі) і Euro Auctions (Лідс) — 1,5–2 години. За окрему плату приїдемо, зробимо фото й відео, запустимо двигун і перевіримо гідравліку до ставки.',
  ],
  [
    'Які аукціони техніки є у Великій Британії?',
    'Найбільші — Euro Auctions (Лідс, Дромор), Ritchie Bros (Мальтбі), Cheffins (Кембридж, сільгосптехніка), а також Malcolm Harrison, Wilsons, Watts & Associates, Sweeney Kincaid та інші. Купуємо на будь-якому з них.',
  ],
  [
    'Скільки часу займає доставка техніки з Англії в Україну?',
    'Після оплати лота аукціон зазвичай дає до двох тижнів, щоб забрати техніку. Дорога до кордону України — в середньому 5–10 днів залежно від габариту. Навісне та генератори везуть швидше, великі екскаватори — тралом.',
  ],
  [
    'Чи треба платити британський VAT?',
    'Ні. При експорті з Великої Британії британський VAT до вашого рахунку не застосовується. Розмитнення в Україні оплачує покупець, ми готуємо всі документи для митниці.',
  ],
];

export default function AuctionsPage() {
  const [now, setNow] = useState<number | null>(null);
  const [cat, setCat] = useState<AuctionCategory | 'all'>('all');
  const [auction, setAuction] = useState<string>('all');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<SortKey>('closing');
  const [onlyUnused, setOnlyUnused] = useState(false);
  const [shown, setShown] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<AuctionLot | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  // Годинник тільки в браузері, щоб не було розбіжностей із серверним рендером
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => setShown(PAGE_SIZE), [cat, auction, q, sort, onlyUnused]);

  const base = useMemo(
    () => AUCTION_LOTS.filter((l) => (auction === 'all' || l.auction === auction) && (!onlyUnused || l.unused)),
    [auction, onlyUnused]
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: base.length };
    for (const l of base) c[l.category] = (c[l.category] || 0) + 1;
    return c;
  }, [base]);

  const lots = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = base.filter((l) => cat === 'all' || l.category === cat);
    if (needle) {
      list = list.filter((l) => [l.title, l.original, l.lot, l.specs].join(' ').toLowerCase().includes(needle));
    }
    const sorted = [...list];
    if (sort === 'closing') sorted.sort((a, b) => a.endsAt - b.endsAt);
    if (sort === 'newest') sorted.sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || a.endsAt - b.endsAt);
    if (sort === 'hours') sorted.sort((a, b) => (a.hours ?? 1e9) - (b.hours ?? 1e9));
    if (now) sorted.sort((a, b) => Number(isClosed(a, now)) - Number(isClosed(b, now)));
    return sorted;
  }, [base, cat, q, sort, now]);

  const nextClosing = useMemo(() => {
    if (!now) return null;
    return AUCTION_LOTS.filter((l) => !isClosed(l, now)).sort((a, b) => a.endsAt - b.endsAt)[0] ?? null;
  }, [now]);

  const openForm = (lot: AuctionLot | null) => {
    setSelected(lot);
    setFormOpen(true);
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(([q2, a]) => ({ '@type': 'Question', name: q2, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };
  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Купівля спецтехніки на аукціонах Великої Британії з доставкою в Україну',
    provider: { '@type': 'Organization', name: 'NoLimitGoods Ltd', url: 'https://www.nolimitgoods.com' },
    areaServed: ['UA', 'GB'],
    serviceType: 'Агент з купівлі техніки на аукціонах',
    description:
      'Купуємо екскаватори, телескопічні навантажувачі, трактори, генератори та навісне на аукціонах Ritchie Bros, Euro Auctions, Cheffins та інших у Великій Британії. Ставка за вашим лімітом, експорт і доставка в Україну.',
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-red-500 selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <Header />

      {/* ГОЛОВНИЙ ЕКРАН */}
      <section className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/15 border border-red-500/30 text-red-300 text-xs font-bold uppercase tracking-wide">
            <Gavel className="w-4 h-4" /> Аукціони спецтехніки Великої Британії
          </div>
          <h1 className="mt-4 text-3xl md:text-5xl font-black leading-tight max-w-4xl">
            Купуємо спецтехніку на аукціонах Англії — під ваше замовлення, з доставкою в Україну
          </h1>
          <p className="mt-4 text-slate-300 text-base md:text-lg max-w-3xl">
            Екскаватори, JCB 3CX, телескопічні навантажувачі, трактори John Deere і New Holland, генератори, гідромолоти.
            Ви обираєте лот і називаєте максимальну ціну — ми ставимо за вас на Ritchie Bros, Euro Auctions та інших аукціонах,
            викуповуємо, оформлюємо експорт і доставляємо.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3 max-w-4xl">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="text-xs text-slate-400 font-semibold uppercase">На сторінці зараз</div>
              <div className="mt-1 text-2xl font-black">{AUCTION_LOTS.length} {lotiv(AUCTION_LOTS.length)}</div>
              <div className="text-sm text-slate-400">з {AUCTIONS.length} аукціонів, з фото</div>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="text-xs text-slate-400 font-semibold uppercase">Наша комісія</div>
              <div className="mt-1 text-2xl font-black">
                {FEE.highPct}–{FEE.lowPct}%
              </div>
              <div className="text-sm text-slate-400">від ціни лота, без прихованих доплат</div>
            </div>
            <div className="rounded-2xl bg-red-600 p-4">
              <div className="text-xs text-red-100 font-semibold uppercase">Найближче закриття</div>
              {nextClosing && now ? (
                <>
                  <div className="mt-1 text-2xl font-black">{timeLeft(nextClosing.endsAt, now)}</div>
                  <div className="text-sm text-red-100 line-clamp-1">{nextClosing.title}</div>
                </>
              ) : (
                <div className="mt-1 font-bold">Нові лоти щотижня</div>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#lots" className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-red-600 hover:bg-red-700 font-bold">
              Дивитися лоти <ArrowRight className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={() => openForm(null)}
              className="inline-flex items-center gap-2 h-12 px-6 rounded-xl border border-white/20 hover:bg-white/10 font-bold"
            >
              Підібрати техніку під мене
            </button>
          </div>
        </div>
      </section>

      {/* КАЛЕНДАР АУКЦІОНІВ */}
      <section id="calendar" className="scroll-mt-28 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-2xl font-black">Календар аукціонів техніки у Британії на місяць</h2>
          <p className="text-sm text-slate-500 mt-1">
            Купуємо на будь-якому з них. Лоти позначених аукціонів уже є на цій сторінці, по решті — підберемо за запитом.
          </p>
          <div className="mt-5 grid gap-2 md:grid-cols-2">
            {AUCTION_CALENDAR.map((c) => (
              <div key={c.date + c.house + c.title} className="flex items-center gap-4 rounded-xl border border-slate-200 p-3">
                <div className="w-24 shrink-0 text-sm font-black text-red-600">{c.date}</div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm truncate">{c.house} · {c.title}</div>
                  <div className="text-xs text-slate-500 truncate">
                    {c.place}
                    {c.lots ? ` · ${c.lots}` : ''}
                  </div>
                </div>
                {c.onSite && c.auction ? (
                  <a
                    href="#lots"
                    onClick={() => setAuction(c.auction as string)}
                    className="shrink-0 h-9 px-3 rounded-lg bg-slate-900 text-white text-xs font-bold inline-flex items-center"
                  >
                    Лоти
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => openForm(null)}
                    className="shrink-0 h-9 px-3 rounded-lg border border-slate-200 text-xs font-bold"
                  >
                    Запит
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ЛОТИ */}
      <section id="lots" className="scroll-mt-28 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black">Лоти з аукціонів Великої Британії</h2>
            <p className="text-sm text-slate-500 mt-1">
              Відібрали техніку, яку найчастіше купують в Україну. Час вказано за Києвом.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="JCB 3CX, John Deere, 300 кВА…"
                className="w-full h-11 pl-9 pr-3 rounded-xl border-2 border-slate-200 focus:border-red-500 outline-none text-sm"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-11 px-3 rounded-xl border-2 border-slate-200 text-sm font-semibold bg-white"
              aria-label="Сортування"
            >
              <option value="closing">Скоро торги</option>
              <option value="newest">Новіші роки</option>
              <option value="hours">Менше мотогодин</option>
            </select>
          </div>
        </div>

        {/* Аукціон */}
        <div className="mt-5 flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          <button
            type="button"
            onClick={() => setAuction('all')}
            className={`shrink-0 h-10 px-4 rounded-xl text-sm font-bold border ${auction === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200'}`}
          >
            Усі аукціони
          </button>
          {AUCTIONS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setAuction(a.id)}
              className={`shrink-0 h-10 px-4 rounded-xl text-sm font-bold border ${auction === a.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200'}`}
            >
              {a.house} · {a.dates.replace(' 2026', '')}
            </button>
          ))}
        </div>

        {/* Категорія */}
        <div className="mt-2 flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          <button
            type="button"
            onClick={() => setCat('all')}
            className={`shrink-0 h-10 px-4 rounded-xl text-sm font-bold border ${cat === 'all' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-700 border-slate-200'}`}
          >
            Усе · {counts.all || 0}
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
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {lots.slice(0, shown).map((l) => (
                <LotCard key={l.auction + l.item} lot={l} now={now} onRequest={() => openForm(l)} />
              ))}
            </div>
            {shown < lots.length && (
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => setShown((s) => s + PAGE_SIZE)}
                  className="h-12 px-6 rounded-xl border-2 border-slate-900 font-bold inline-flex items-center gap-2"
                >
                  Показати ще {Math.min(PAGE_SIZE, lots.length - shown)} з {lots.length - shown} <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ЯК ЦЕ ПРАЦЮЄ + ЦІНА */}
      <section id="how" className="scroll-mt-28 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-2xl font-black">Як купити техніку з аукціону Англії через нас</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              ['Обираєте лот', 'Тиснете «Хочу цей лот» і пишете максимальну ціну. Вище за неї ми не ставимо.'],
              ['Вносите передоплату', 'Якщо лот не виграємо — повертаємо гроші повністю.'],
              ['Ставимо і викуповуємо', 'Торгуємось до вашого ліміту. Можемо оглянути лот до торгів.'],
              ['Експорт і доставка', 'Забираємо з майданчика, оформлюємо експорт, веземо в Україну.'],
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
              <Wallet className="w-5 h-5 text-red-600" /> Ціна для вас: прозоро, з інвойсом
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-3 text-sm">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="font-black text-lg">{FEE.lowPct}%</div>
                <div className="text-slate-600">наша послуга, якщо лот до {gbp(FEE.threshold)} (мінімум {gbp(FEE.minGbp)})</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="font-black text-lg">{FEE.highPct}%</div>
                <div className="text-slate-600">наша послуга, якщо лот дорожче {gbp(FEE.threshold)}</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="font-black text-lg">+ аукціон і доставка</div>
                <div className="text-slate-600">
                  комісія аукціону за його тарифом, експортні документи (~{gbp(AUCTION_META.exportDocsGbp)}), транспорт до України
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Британський VAT при експорті до вашого рахунку не застосовується. Розмитнення в Україні оплачує покупець.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              [ShieldCheck, 'Тільки до вашого ліміту', 'Максимальну ціну фіксуємо письмово. Вище — не купуємо і повертаємо передоплату.'],
              [Eye, 'Огляд перед ставкою', 'Склад у Ковентрі — 1,5–2 години до Мальтбі та Лідса. Фото, відео, запуск двигуна.'],
              [FileText, 'Документи для митниці', 'Інвойс, експортна декларація та пакет для розмитнення в Україні.'],
              [Truck, 'Доставка будь-якого габариту', 'Від палети з навісним до трала для 30-тонного екскаватора.'],
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
        </div>
      </section>

      {/* SEO-ТЕКСТ */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-8 lg:grid-cols-2 text-sm text-slate-700 leading-relaxed">
          <div>
            <h2 className="text-xl font-black text-slate-900">Спецтехніка з аукціонів Англії: чому це вигідно</h2>
            <p className="mt-3">
              Британія — один із найбільших ринків вживаної спецтехніки в Європі. Прокатні компанії регулярно оновлюють парк
              і продають на аукціонах екскаватори Hitachi, Komatsu, CAT, Volvo, JCB, телескопічні навантажувачі JCB 540-140,
              531-70, Manitou, Merlo, трактори John Deere, New Holland, Massey Ferguson, генератори 60–500 кВА. Техніка
              обслуговується дилерами, а аукціони без резервних цін дають ціну нижчу за дилерську.
            </p>
            <h3 className="mt-5 font-black text-slate-900">Купити екскаватор, JCB 3CX чи трактор з аукціону — з України</h3>
            <p className="mt-2">
              Щоб купити на британському аукціоні самостійно, потрібна реєстрація, депозит до 25% від суми ставок, оплата
              протягом тижня і вивіз з майданчика. NoLimitGoods Ltd бере це на себе: ставимо за вас, оплачуємо, забираємо
              і доставляємо екскаватор, екскаватор-навантажувач, бульдозер, телескопічний навантажувач або трактор в Україну.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Аукціони Ritchie Bros, Euro Auctions, Cheffins</h2>
            <p className="mt-3">
              Ritchie Bros проводить онлайн-торги в Мальтбі щомісяця, Euro Auctions — великі живі аукціони в Лідсі та
              Дроморі, Cheffins — щомісячні аукціони сільгосптехніки біля Кембриджа. Ми відстежуємо їх усі та додаємо на цю
              сторінку лоти, які найчастіше потрібні в Україні: будівельну техніку для відбудови, сільгосптехніку для
              агрохолдингів, генератори для бізнесу, гідромолоти й грейфери для демонтажу.
            </p>
            <h3 className="mt-5 font-black text-slate-900">Запчастини до техніки — теж до нас</h3>
            <p className="mt-2">
              Купили техніку — потрібні фільтри, гідравліка, ходова. Ми знаходимо і привозимо оригінальні запчастини,
              якісні аналоги та б/у до JCB, CAT, Komatsu, John Deere, New Holland.{' '}
              <Link href="/catalog" className="text-red-600 font-semibold underline">
                Каталог запчастин
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-28 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-2xl font-black">Питання про купівлю техніки з аукціонів</h2>
          <div className="mt-5 space-y-2">
            {FAQ.map(([qq, a]) => (
              <details key={qq} className="group rounded-xl bg-white border border-slate-200 p-4">
                <summary className="cursor-pointer font-bold list-none flex items-center justify-between gap-3">
                  {qq} <ChevronDown className="w-4 h-4 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-2 text-sm text-slate-600">{a}</p>
              </details>
            ))}
          </div>
          <div className="mt-8 rounded-2xl bg-slate-950 text-white p-6 flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div>
              <div className="font-black text-lg">Не знайшли потрібну техніку?</div>
              <div className="text-sm text-slate-300">Опишіть, що шукаєте, — підберемо лот на найближчих аукціонах.</div>
            </div>
            <button type="button" onClick={() => openForm(null)} className="h-12 px-6 rounded-xl bg-red-600 hover:bg-red-700 font-bold">
              Підібрати техніку
            </button>
          </div>
          <p className="mt-6 text-xs text-slate-500">
            Ritchie Bros, Euro Auctions, Cheffins та інші — незалежні аукціонні доми. NoLimitGoods Ltd не є їхнім
            представником: ми купуємо лоти як покупець на ваше замовлення. Фото та описи — з каталогів аукціонів; актуальні
            ставки та наявність уточнюйте в менеджера.
          </p>
        </div>
      </section>

      <Footer />
      <FloatingContact />

      {formOpen && <RequestModal lot={selected} onClose={() => setFormOpen(false)} />}
    </div>
  );
}

function isClosed(l: AuctionLot, now: number) {
  // Для живих торгів лот вважаємо закритим після кінця дня торгів
  return l.live ? l.endsAt + 10 * 3_600_000 <= now : l.endsAt <= now;
}

const updatedFmt = new Intl.DateTimeFormat('uk-UA', { timeZone: 'Europe/Kyiv', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

function PriceBox({ lot, closed }: { lot: AuctionLot; closed: boolean }) {
  const p = lotPrice(lot.auction, lot.lot);
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
      {lot.live ? 'Ставки — в день живих торгів. Ваш ліміт подаємо заздалегідь.' : 'Ставок ще немає — можна зайти з мінімальної ціни.'}
    </div>
  );
}

function LotCard({ lot, now, onRequest }: { lot: AuctionLot; now: number | null; onRequest: () => void }) {
  const Icon = CATEGORY_ICONS[lot.category];
  const a = AUCTION_BY_ID[lot.auction];
  const closed = now !== null && isClosed(lot, now);
  const left = now !== null && !lot.live ? timeLeft(lot.endsAt, now) : null;
  const urgent = now !== null && !closed && lot.endsAt - now < 24 * 3_600_000;
  const [imgOk, setImgOk] = useState(Boolean(lot.img));

  return (
    <article className={`flex flex-col rounded-2xl border bg-white overflow-hidden transition-shadow hover:shadow-lg ${closed ? 'opacity-60' : 'border-slate-200'}`}>
      <div className="relative aspect-[4/3] bg-slate-100">
        {imgOk ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={lot.img}
            alt={`${lot.title}${lot.year ? `, ${lot.year}` : ''} — аукціон ${a?.house ?? ''}, Велика Британія`}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setImgOk(false)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-300">
            <Icon className="w-16 h-16" />
          </div>
        )}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
          <span className="px-2 py-1 rounded-md bg-slate-900/85 text-white text-[11px] font-black">{a?.house}</span>
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
              <Radio className="w-3 h-3" /> Живі торги
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-black leading-snug">{lot.title}</h3>
        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{lot.original}</p>

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

        <PriceBox lot={lot} closed={closed} />

        <div className={`mt-3 flex items-start gap-2 text-sm font-semibold ${closed ? 'text-slate-500' : urgent ? 'text-red-600' : 'text-slate-700'}`}>
          <Clock className="w-4 h-4 mt-0.5 shrink-0" />
          {closed ? (
            'Торги завершено'
          ) : (
            <span>
              {lotWhen(lot)}
              {left && <span className="font-black"> · {left}</span>}
            </span>
          )}
        </div>

        <div className="mt-auto pt-4">
          <button
            type="button"
            onClick={onRequest}
            disabled={closed}
            className="w-full h-11 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white font-bold text-sm"
          >
            {closed ? 'Лот закрито' : 'Хочу цей лот'}
          </button>
        </div>
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
    if (!contact.trim()) return;
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
      : ['ЗАПИТ НА ПІДБІР ТЕХНІКИ З АУКЦІОНІВ', `Бюджет: ${bid ? gbp(bid) : 'не вказав'}`];
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
      fd.append('items', JSON.stringify([{ partNumber: lot.lot ? `Лот ${lot.lot}` : `ID ${lot.item}`, machineModel: lot.title, quantity: 1 }]));
    }

    try {
      const res = await fetch('/api/lead', { method: 'POST', body: fd });
      if (res.ok) {
        const w = window as any;
        if (typeof w.gtag === 'function') w.gtag('event', 'conversion', { send_to: 'AW-670192610/Sx8lCIG5m54dEOKnyb8C' });
        if (typeof w.fbq === 'function') w.fbq('track', 'Lead', { content_name: 'Auction lot', value: bid || undefined, currency: 'GBP' });
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
                  <span>Наша послуга ({bid > FEE.threshold ? FEE.highPct : FEE.lowPct}%{ourFee(bid) === FEE.minGbp ? ', мінімум' : ''})</span>
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
