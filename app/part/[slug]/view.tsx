'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ShoppingCart, Check, MessageCircle, Truck, Camera, Repeat, ShieldCheck } from 'lucide-react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import FloatingContact from '../../components/floating-contact';
import QuoteCart, { addToCart } from '../../components/quote-cart';
import { TYPE_LABEL, illustrationFor, type CatalogItem } from '@/lib/catalog';
import { clientPriceGbp, fmtGbp, fmtUah, loadRates, shippingGbp, type Rates } from '@/lib/pricing';
import { CONTACT } from '@/lib/site-config';

type Related = { slug: string; brand: string; partNumber: string; titleUk: string; price: number | null };

const TYPE_CLS: Record<CatalogItem['type'], string> = {
  original: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  analog: 'bg-sky-50 text-sky-700 border-sky-200',
  new: 'bg-slate-100 text-slate-700 border-slate-200',
  used: 'bg-amber-50 text-amber-700 border-amber-200',
};

export default function PartView({
  item,
  categoryName,
  groupName,
  related,
}: {
  item: CatalogItem;
  categoryName: string;
  groupName: string;
  related: Related[];
}) {
  const [rates, setRates] = useState<Rates | null>(null);
  const [added, setAdded] = useState(false);
  useEffect(() => {
    loadRates().then(setRates);
  }, []);

  const gbp = clientPriceGbp(item, rates);
  const uah = gbp !== null && rates ? gbp * rates.uah.GBP : null;
  const ship = shippingGbp(item.weightKg, item.oversized);
  const label = TYPE_LABEL[item.type];
  const waText = encodeURIComponent(`Добрий день! Цікавить ${item.brand} ${item.partNumber} (${item.titleUk}). Є в наявності?`);

  const add = () => {
    addToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <nav className="flex flex-wrap items-center gap-1 text-xs text-slate-500 mb-5">
          <Link href="/" className="hover:text-slate-900">Головна</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/catalog?cat=${item.category}`} className="hover:text-slate-900">{categoryName}</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/catalog?cat=${item.category}&q=${encodeURIComponent(item.brand)}`} className="hover:text-slate-900">{item.brand}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-700 font-mono">{item.partNumber}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="relative aspect-[4/3] rounded-3xl border border-slate-200 bg-white overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image ?? illustrationFor(item)}
              alt={`${item.titleUk} ${item.brand} ${item.partNumber}`}
              className={`absolute inset-0 w-full h-full ${item.image ? 'object-contain p-8' : 'object-cover'}`}
            />
            {(!item.image || item.imageIllustrative) && (
              <span className="absolute bottom-3 right-4 text-[11px] text-slate-400">
                {item.image ? 'фото ілюстративне' : 'ілюстрація'}
              </span>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${TYPE_CLS[item.type]}`}>{label.uk}</span>
              {groupName && <span className="px-2.5 py-1 rounded-full text-xs font-semibold border border-slate-200 text-slate-600">{groupName}</span>}
            </div>
            <h1 className="mt-3 text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              {item.titleUk} {item.brand} <span className="font-mono">{item.partNumber}</span>
            </h1>
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
              <dt className="text-slate-500">Виробник</dt>
              <dd className="font-semibold">{item.brand}</dd>
              <dt className="text-slate-500">Номер</dt>
              <dd className="font-mono font-semibold">{item.partNumber}</dd>
              {item.alt && (
                <>
                  <dt className="text-slate-500">Інший запис</dt>
                  <dd className="font-mono">{item.alt}</dd>
                </>
              )}
              <dt className="text-slate-500">Застосування</dt>
              <dd>{item.fitsUk}</dd>
              <dt className="text-slate-500">Вага</dt>
              <dd>≈ {item.weightKg} кг</dd>
            </dl>

            <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200">
              {gbp !== null ? (
                <>
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-4xl font-black">{fmtGbp(gbp)}</span>
                    <span className="text-lg font-bold text-amber-600 min-h-[1.75rem]">{uah !== null ? `≈ ${fmtUah(uah)}` : ''}</span>
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    {ship !== null ? `+ доставка в Україну ${fmtGbp(ship)}` : '+ доставка (рахуємо окремо, великогабарит)'}
                  </div>
                </>
              ) : (
                <div className="text-2xl font-black">Ціна на запит</div>
              )}
              <div className="mt-4 grid sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={add}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-extrabold uppercase text-white transition-colors ${
                    added ? 'bg-emerald-600' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                  {added ? 'Додано в запит' : 'Замовити'}
                </button>
                <a
                  href={`${CONTACT.whatsapp}?text=${waText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-extrabold uppercase border border-slate-300 bg-white hover:border-slate-900"
                >
                  <MessageCircle className="w-4 h-4" /> Запитати
                </a>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                Ціна постачальника на {item.checkedAt ? new Date(item.checkedAt).toLocaleDateString('uk-UA') : 'останню перевірку'} з нашою комісією.
                Точну ціну й наявність підтверджуємо у відповідь, гривня — за курсом НБУ на сьогодні.
              </p>
            </div>

            <ul className="mt-6 grid sm:grid-cols-2 gap-3 text-sm">
              {[
                { icon: Repeat, t: 'Оригінал, аналог або б/у', d: 'Запропонуємо дешевші варіанти, якщо є' },
                { icon: Truck, t: '5–14 робочих днів', d: 'Відправка з Великої Британії в Україну' },
                { icon: Camera, t: 'Фотозвіт', d: 'Фото деталі й номера перед відправкою' },
                { icon: ShieldCheck, t: 'Британська компанія', d: 'NoLimitGoods Ltd, Ковентрі' },
              ].map((b) => (
                <li key={b.t} className="flex gap-3 p-3 rounded-xl border border-slate-200">
                  <b.icon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">{b.t}</div>
                    <div className="text-xs text-slate-500">{b.d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="text-xl sm:text-2xl font-black mb-4">Схожі позиції</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/part/${r.slug}`}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-red-500 hover:shadow-sm transition"
                >
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{r.brand}</div>
                  <div className="font-mono text-sm font-semibold mt-0.5">{r.partNumber}</div>
                  <div className="text-sm text-slate-700 mt-1 line-clamp-2">{r.titleUk}</div>
                  <div className="mt-2 font-black">{r.price !== null ? fmtGbp(r.price) : 'Ціна на запит'}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-12 p-6 sm:p-8 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black">Не та деталь або потрібно кілька?</h2>
            <p className="text-slate-300 text-sm mt-1">Надішліть номери, VIN або фото — порахуємо оригінал, аналог і б/у.</p>
          </div>
          <Link href="/#parts-calculator" className="shrink-0 inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 font-extrabold uppercase text-sm">
            Отримати ціну
          </Link>
        </section>
      </main>

      <Footer />
      <FloatingContact />
      <QuoteCart />
    </div>
  );
}
