'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, X, ChevronRight, PackageSearch } from 'lucide-react';
import Header from '../components/header';
import Footer from '../components/footer';
import FloatingContact from '../components/floating-contact';
import QuoteCart from '../components/quote-cart';
import ProductCard from '../components/product-card';
import InteractiveDiagram from '../components/interactive-diagram';
import { useLanguage } from '@/lib/language-context';
import { CATALOG, CATEGORIES, GROUPS, TYPE_LABEL, loadFullCatalog, MODEL_PAGES, type CatalogItem, type CategoryId, type GroupId, type PartType } from '@/lib/catalog';
import { clientPriceGbp, loadRates, type Rates } from '@/lib/pricing';

type Sort = 'popular' | 'price-asc' | 'price-desc';

export default function CatalogPage() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';
  const [rates, setRates] = useState<Rates | null>(null);
  const [cat, setCat] = useState<CategoryId | 'all'>('all');
  const [group, setGroup] = useState<GroupId | 'all'>('all');
  const [type, setType] = useState<PartType | 'all'>('all');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<Sort>('popular');
  const [all, setAll] = useState<CatalogItem[]>(CATALOG);
  const [limit, setLimit] = useState(48);

  useEffect(() => {
    loadRates().then(setRates);
    loadFullCatalog().then(setAll);
    // Параметри з посилання: /catalog?cat=agro&q=jcb
    try {
      const p = new URLSearchParams(window.location.search);
      const c = p.get('cat');
      if (c && CATEGORIES.some((x) => x.id === c)) setCat(c as CategoryId);
      const query = p.get('q');
      if (query) setQ(query);
    } catch {
      // ignore
    }
  }, []);

  // Тримаємо фільтри в адресі, щоб посиланням можна було поділитися
  useEffect(() => {
    const p = new URLSearchParams();
    if (cat !== 'all') p.set('cat', cat);
    if (q.trim()) p.set('q', q.trim());
    const qs = p.toString();
    window.history.replaceState(null, '', qs ? `/catalog?${qs}` : '/catalog');
  }, [cat, q]);

  const norm = (s: string) => s.toLowerCase().replace(/[\s/\-.]/g, '');

  const filtered = useMemo(() => {
    const nq = norm(q);
    const list = all.filter(
      (i) =>
        (cat === 'all' || i.category === cat) &&
        (group === 'all' || i.group === group) &&
        (type === 'all' || i.type === type) &&
        (!nq ||
          norm(`${i.partNumber} ${i.alt || ''} ${i.brand} ${i.titleUk} ${i.titleEn} ${i.fitsUk} ${i.fitsEn}`).includes(nq))
    );
    if (sort === 'popular') return list;
    const price = (i: CatalogItem) => clientPriceGbp(i, rates) ?? Number.MAX_SAFE_INTEGER;
    return [...list].sort((a, b) => (sort === 'price-asc' ? price(a) - price(b) : price(b) - price(a)));
  }, [all, cat, group, type, q, sort, rates]);

  // Нові фільтри — знову з першої сторінки
  useEffect(() => setLimit(48), [cat, group, type, q, sort]);

  const countIn = (c: CategoryId) => all.filter((i) => i.category === c).length;
  const groupsHere = GROUPS.filter((g) => all.some((i) => i.group === g.id && (cat === 'all' || i.category === cat)));

  const chip = (on: boolean) =>
    `px-3.5 py-2 rounded-full text-sm font-semibold border whitespace-nowrap transition-colors ${
      on ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
    }`;

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col">
      <Header />

      {/* Шапка каталогу */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
          <nav className="flex items-center gap-1 text-xs text-slate-500 mb-4">
            <Link href="/" className="hover:text-slate-900">{isUk ? 'Головна' : 'Home'}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-600">{isUk ? 'Каталог' : 'Catalog'}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">{isUk ? 'Каталог запчастин' : 'Parts catalog'}</h1>
          <p className="mt-3 text-slate-500 max-w-2xl">
            {isUk
              ? 'Ціни з нашою комісією, у фунтах і гривнях за курсом НБУ, плюс доставка в Україну за вагою. Додавайте в запит — підтвердимо наявність і точну ціну.'
              : 'Prices include our fee, in pounds and hryvnia (NBU rate), plus delivery by weight. Add to your quote — we confirm stock and exact price.'}
          </p>

          {/* Пошук */}
          <div className="mt-6 relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={isUk ? 'Артикул, бренд або назва: 320/B4420, Donaldson, помпа…' : 'Part number, brand or name…'}
              className="w-full pl-12 pr-10 py-4 rounded-2xl bg-white border border-slate-300 focus:border-red-500 outline-none text-base text-slate-900 placeholder-slate-400"
            />
            {q && (
              <button type="button" onClick={() => setQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-900" aria-label="Clear">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Категорії-плитки */}
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {CATEGORIES.map((c) => {
              const on = cat === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => { setCat(on ? 'all' : c.id); setGroup('all'); }}
                  className={`relative overflow-hidden text-left p-4 rounded-2xl border transition-colors ${
                    on ? 'border-red-500 bg-red-600/15' : 'border-slate-800 bg-slate-900/70 hover:border-slate-600'
                  }`}
                >
                  <div className="text-base font-black text-slate-900">{isUk ? c.uk : c.en}</div>
                  <div className="text-xs text-slate-500 mt-1 leading-snug">{isUk ? c.hintUk : c.hintEn}</div>
                  <div className="text-xs font-bold text-red-600 mt-2">{countIn(c.id)} {isUk ? 'позицій' : 'items'}</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Популярні моделі авто (SEO-сторінки) */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-1">{isUk ? 'Популярні авто:' : 'Popular cars:'}</span>
          {MODEL_PAGES.map((m) => (
            <Link key={m.slug} href={`/zapchastyny/${m.slug}`} className="px-3 py-1.5 rounded-full border border-slate-200 text-sm font-semibold text-slate-700 hover:border-red-500 hover:text-red-600">
              {m.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Фільтри + сітка */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            <button type="button" onClick={() => setGroup('all')} className={chip(group === 'all')}>{isUk ? 'Усі вузли' : 'All groups'}</button>
            {groupsHere.map((g) => (
              <button key={g.id} type="button" onClick={() => setGroup(g.id)} className={chip(group === g.id)}>
                {isUk ? g.uk : g.en}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => setType('all')} className={chip(type === 'all')}>{isUk ? 'Усі типи' : 'All types'}</button>
            {(['original', 'analog', 'new'] as PartType[]).map((t) => (
              <button key={t} type="button" onClick={() => setType(t)} className={chip(type === t)}>
                {isUk ? TYPE_LABEL[t].uk : TYPE_LABEL[t].en}
              </button>
            ))}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="ml-auto px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm text-slate-700"
              aria-label={isUk ? 'Сортування' : 'Sort'}
            >
              <option value="popular">{isUk ? 'Спочатку популярні' : 'Popular first'}</option>
              <option value="price-asc">{isUk ? 'Дешевші спочатку' : 'Price: low to high'}</option>
              <option value="price-desc">{isUk ? 'Дорожчі спочатку' : 'Price: high to low'}</option>
            </select>
          </div>
          <div className="text-sm text-slate-500">
            {isUk ? `Знайдено: ${filtered.length}` : `Found: ${filtered.length}`}
            {rates && <span className="ml-3 font-mono text-slate-500">£1 = {rates.uah.GBP.toFixed(2)} ₴ ({isUk ? 'НБУ' : 'NBU'} {rates.date})</span>}
          </div>
        </div>

        {filtered.length ? (
          <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {filtered.slice(0, limit).map((item) => (
              <ProductCard key={item.id} item={item} rates={rates} isUk={isUk} />
            ))}
          </div>
          {filtered.length > limit && (
            <div className="mt-8 text-center">
              <button type="button" onClick={() => setLimit((l) => l + 48)} className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 font-bold text-sm">
                {isUk ? `Показати ще (${filtered.length - limit})` : `Show more (${filtered.length - limit})`}
              </button>
            </div>
          )}
          </>
        ) : (
          <div className="p-8 rounded-2xl border border-dashed border-slate-300 text-center">
            <PackageSearch className="w-10 h-10 mx-auto text-slate-500" />
            <h3 className="mt-3 text-lg font-black text-slate-900">{isUk ? 'У каталозі цього немає — але ми знайдемо' : 'Not listed — but we will find it'}</h3>
            <p className="text-sm text-slate-500 mt-1">{isUk ? 'Надішліть артикул, VIN або фото — порахуємо оригінал, аналог і б/у.' : 'Send a part number, VIN or photo.'}</p>
            <Link href="/#parts-calculator" className="inline-block mt-4 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm">
              {isUk ? 'Запитати ціну' : 'Request a price'}
            </Link>
          </div>
        )}

        {/* Банер під запит */}
        <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-700 to-red-600 flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div>
            <h3 className="text-2xl font-black text-slate-900">{isUk ? 'Тут лише частина того, що ми возимо' : 'This is just part of what we supply'}</h3>
            <p className="text-red-50/90 text-sm mt-1">
              {isUk ? 'Будь-який бренд і артикул — від одного фільтра до палети.' : 'Any brand or part number — from one filter to a pallet.'}
            </p>
          </div>
          <Link href="/#parts-calculator" className="shrink-0 px-6 py-3.5 rounded-xl bg-slate-900 text-red-700 font-extrabold uppercase text-sm tracking-wide text-center">
            {isUk ? 'Надіслати свій список' : 'Send your list'}
          </Link>
        </div>
      </section>

      <InteractiveDiagram />

      <Footer />
      <FloatingContact />
      <QuoteCart />
    </div>
  );
}
