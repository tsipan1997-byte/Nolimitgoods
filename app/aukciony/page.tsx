'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Gavel, Search, ShieldCheck, Truck, FileText, Wallet, ArrowRight, Eye, ChevronDown, TrendingUp } from 'lucide-react';
import Header from '../components/header';
import Footer from '../components/footer';
import FloatingContact from '../components/floating-contact';
import { AUCTIONS, AUCTION_CALENDAR, AUCTION_LOTS, AUCTION_META, CATEGORY_LABELS, FEE, pct, type AuctionCategory, type AuctionLot } from '@/lib/auction-lots';
import { lotiv } from '@/lib/plural';
import TelegramChannelCta from '../components/telegram-channel-cta';
import { CATEGORY_ICONS, LotCard, RequestModal, isClosed, timeLeft, gbp } from '../components/auction-lot-ui';


const CATEGORY_ORDER: AuctionCategory[] = ['excavators', 'telehandlers', 'agro', 'pickups', 'trucks', 'energy', 'breakers', 'attachments'];
const PAGE_SIZE = 24;

type SortKey = 'closing' | 'newest' | 'hours';


// Питання й відповіді: показуються на сторінці та йдуть у розмітку FAQPage для Google
const FAQ: [string, string][] = [
  [
    'Як купити спецтехніку з аукціону у Великій Британії, якщо я в Україні?',
    'Обираєте лот на цій сторінці або на будь-якому британському аукціоні, називаєте максимальну ціну і вносите передоплату. NoLimitGoods Ltd — британська компанія з власним складом у Ковентрі: ми реєструємось на аукціоні як покупець, робимо ставки до вашого ліміту, оплачуємо лот, забираємо його, оформлюємо експорт і доставляємо в Україну.',
  ],
  [
    'Скільки коштує ваша послуга?',
    `${pct(FEE.lowPct)}% від ціни лота, якщо лот коштує до ${gbp(FEE.threshold)}, і ${pct(FEE.highPct)}% — якщо дорожче. Мінімальна комісія за лот: £150 — якщо лот до £5 000, £299 — до £10 000, £799 — від £10 000. Береться більша сума: відсоток або мінімум. До цього додається комісія самого аукціону, експортні документи та доставка. Усе фіксуємо в інвойсі до оплати.`,
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
    'Ні. При експорті з Великої Британії британський VAT до вашого рахунку не застосовується. Працюємо під ключ: ціну з доставкою і розмитненням в Україні рахуємо до торгів, розмитнення беремо на себе.',
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

  // Посилання з тематичних сторінок: /aukciony?cat=pickups#lots
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get('cat');
    if (c && c in CATEGORY_LABELS) setCat(c as AuctionCategory);
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

  // Лічильник на головному екрані — тільки лоти, торги яких ще не закінчились
  const openStats = useMemo(() => {
    const open = now ? AUCTION_LOTS.filter((l) => !isClosed(l, now)) : AUCTION_LOTS;
    return { lots: open.length, auctions: new Set(open.map((l) => l.auction)).size };
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
      <section className="bg-slate-50 border-b border-slate-200 text-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-wide">
            <Gavel className="w-4 h-4" /> Аукціони спецтехніки Великої Британії
          </div>
          <h1 className="mt-3 text-[26px] md:text-5xl font-black leading-tight max-w-4xl">
            Купуємо спецтехніку на аукціонах Англії — під ваше замовлення, з доставкою в Україну
          </h1>
          <p className="mt-4 text-slate-600 text-base md:text-lg max-w-3xl">
            Екскаватори, JCB 3CX, телескопічні навантажувачі, трактори John Deere і New Holland, генератори, гідромолоти.
            Ви обираєте лот і називаєте максимальну ціну — ми ставимо за вас на Ritchie Bros, Euro Auctions та інших аукціонах,
            викуповуємо, оформлюємо експорт і доставляємо.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3 max-w-4xl">
            <div className="rounded-2xl bg-white border border-slate-200 p-4">
              <div className="text-xs text-slate-500 font-semibold uppercase">На сторінці зараз</div>
              <div className="mt-1 text-2xl font-black">{openStats.lots} {lotiv(openStats.lots)}</div>
              <div className="text-sm text-slate-500">з {openStats.auctions} аукціонів, з фото</div>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-4">
              <div className="text-xs text-slate-500 font-semibold uppercase">Наша комісія</div>
              <div className="mt-1 text-2xl font-black">
                {pct(FEE.highPct)}–{pct(FEE.lowPct)}%
              </div>
              <div className="text-sm text-slate-500">від ціни лота, без прихованих доплат</div>
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
            <a href="#lots" className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold">
              Дивитися лоти <ArrowRight className="w-4 h-4" />
            </a>
            <Link href="/rezultaty-aukcioniv" className="inline-flex items-center gap-2 h-12 px-6 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold">
              <TrendingUp className="w-4 h-4" /> За скільки продали і ціна під ключ
            </Link>
            <button
              type="button"
              onClick={() => openForm(null)}
              className="inline-flex items-center gap-2 h-12 px-6 rounded-xl border border-slate-300 bg-white hover:border-red-300 font-bold"
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
            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3">
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

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-8">
        <TelegramChannelCta />
      </div>

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
                <div className="font-black text-lg">{pct(FEE.lowPct)}%</div>
                <div className="text-slate-600">наша послуга, якщо лот до {gbp(FEE.threshold)}</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="font-black text-lg">{pct(FEE.highPct)}%</div>
                <div className="text-slate-600">наша послуга, якщо лот дорожче {gbp(FEE.threshold)}</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 md:col-span-3">
                <div className="font-bold">Мінімальна комісія за лот</div>
                <div className="mt-1 grid grid-cols-3 gap-2 text-slate-600">
                  <div><b className="text-slate-900">£150</b><br />лот до £5 000</div>
                  <div><b className="text-slate-900">£299</b><br />лот £5 000–10 000</div>
                  <div><b className="text-slate-900">£799</b><br />лот від £10 000</div>
                </div>
                <div className="mt-2 text-xs text-slate-500">Береться більша сума: відсоток або мінімум.</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="font-black text-lg">+ аукціон і доставка</div>
                <div className="text-slate-600">
                  комісія аукціону за його тарифом, експортні документи (~{gbp(AUCTION_META.exportDocsGbp)}), транспорт до України
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Британський VAT при експорті до вашого рахунку не застосовується. Ціну під ключ — з доставкою і розмитненням в Україні — рахуємо до торгів.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              [ShieldCheck, 'Тільки до вашого ліміту', 'Максимальну ціну фіксуємо письмово. Вище — не купуємо і повертаємо передоплату.'],
              [Eye, 'Огляд перед ставкою', 'Склад у Ковентрі — 1,5–2 години до Мальтбі та Лідса. Фото, відео, запуск двигуна.'],
              [FileText, 'Під ключ з розмитненням', 'Експортні документи у Великій Британії і розмитнення в Україні — беремо на себе.'],
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
          <div className="mt-8 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 p-6 flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div>
              <div className="font-black text-lg">Не знайшли потрібну техніку?</div>
              <div className="text-sm text-slate-600">Опишіть, що шукаєте, — підберемо лот на найближчих аукціонах.</div>
            </div>
            <button type="button" onClick={() => openForm(null)} className="h-12 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold">
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
