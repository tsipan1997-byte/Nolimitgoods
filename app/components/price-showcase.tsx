'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, RefreshCw, Info } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { SHOWCASE_ITEMS, type ShowcaseItem, type PartType } from '@/lib/showcase-prices';
import { MARKUP } from '@/lib/site-config';

type Rates = { date: string; uah: { GBP: number; USD: number; EUR: number } };

const TYPE_LABEL: Record<PartType, { uk: string; en: string; cls: string }> = {
  original: { uk: 'Оригінал', en: 'Genuine', cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  analog: { uk: 'Аналог', en: 'Aftermarket', cls: 'bg-sky-500/15 text-sky-300 border-sky-500/30' },
  used: { uk: 'Б/у', en: 'Used', cls: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
};

// Ціна клієнта у фунтах: ціна постачальника без VAT, у фунтах за крос-курсом НБУ, × націнка
function clientPriceGbp(item: ShowcaseItem, rates: Rates | null): number | null {
  const net = item.supplierIncVat ? item.supplierPrice / 1.2 : item.supplierPrice;
  let netGbp: number;
  if (item.currency === 'GBP') netGbp = net;
  else if (rates) netGbp = (net * rates.uah[item.currency]) / rates.uah.GBP;
  else return null; // без курсу не можемо чесно перевести долари у фунти
  return netGbp * MARKUP;
}

const fmtGbp = (v: number) =>
  '£' + (v >= 100 ? Math.round(v).toLocaleString('en-GB') : v.toFixed(2));

const fmtUah = (v: number) =>
  (v >= 1000 ? Math.round(v / 10) * 10 : Math.round(v)).toLocaleString('uk-UA').replace(/,/g, ' ') + ' ₴';

export default function PriceShowcase() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';
  const [rates, setRates] = useState<Rates | null>(null);
  const [ratesFailed, setRatesFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch('/api/rates')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: Rates) => {
        if (alive && data?.uah?.GBP) setRates(data);
      })
      .catch(() => alive && setRatesFailed(true));
    return () => {
      alive = false;
    };
  }, []);

  const cards = useMemo(
    () =>
      SHOWCASE_ITEMS.map((item) => {
        const gbp = clientPriceGbp(item, rates);
        const uah = gbp !== null && rates ? gbp * rates.uah.GBP : null;
        return { item, gbp, uah };
      }),
    [rates]
  );

  const askPrice = (item: ShowcaseItem) => {
    window.dispatchEvent(
      new CustomEvent('nlg:select-part', { detail: { oem: item.partNumber, brand: item.brand } })
    );
  };

  return (
    <section id="prices" className="relative py-20 sm:py-24 bg-[#06090E] border-b border-slate-800 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-400 mb-3">
              {isUk ? 'Приклади цін' : 'Price examples'}
            </p>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {isUk ? 'Скільки це коштує насправді' : 'What parts really cost'}
            </h2>
            <p className="mt-4 text-slate-400 text-base sm:text-lg">
              {isUk
                ? 'Реальні позиції, які ми возимо. Ціна вже з нашою комісією, у фунтах і в гривнях за сьогоднішнім курсом.'
                : 'Real items we supply. Prices include our fee, shown in pounds and in hryvnia at today’s rate.'}
            </p>
          </div>

          {/* Курс НБУ */}
          <div className="shrink-0 inline-flex items-center gap-3 self-start lg:self-auto px-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <RefreshCw className={`w-4 h-4 ${rates ? 'text-emerald-400' : 'text-slate-500 animate-spin'}`} />
            <div className="text-xs leading-tight">
              {rates ? (
                <>
                  <div className="text-white font-bold font-mono">£1 = {rates.uah.GBP.toFixed(2)} ₴</div>
                  <div className="text-slate-400 mt-0.5">
                    {isUk ? `Курс НБУ на ${rates.date}` : `NBU rate, ${rates.date}`}
                  </div>
                </>
              ) : ratesFailed ? (
                <div className="text-slate-400">{isUk ? 'Курс НБУ тимчасово недоступний' : 'NBU rate unavailable'}</div>
              ) : (
                <div className="text-slate-400">{isUk ? 'Завантажуємо курс НБУ…' : 'Loading NBU rate…'}</div>
              )}
            </div>
          </div>
        </div>

        {/* Картки */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {cards.map(({ item, gbp, uah }) => {
            const t = TYPE_LABEL[item.type];
            return (
              <article
                key={item.id}
                className="group flex flex-col rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-600 overflow-hidden transition-colors"
              >
                <div className="relative aspect-[4/3] bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={`${item.brand} ${item.partNumber}`}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-[1.03] transition-transform duration-300"
                  />
                  <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur ${t.cls}`}>
                    {isUk ? t.uk : t.en}
                  </span>
                  {item.imageIllustrative && (
                    <span className="absolute bottom-2 right-3 text-[10px] text-slate-500">
                      {isUk ? 'фото ілюстративне' : 'illustrative photo'}
                    </span>
                  )}
                </div>

                <div className="flex flex-col flex-1 p-4 sm:p-5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{item.brand}</div>
                  <div className="font-mono text-sm text-white mt-0.5">{item.partNumber}</div>
                  <h3 className="text-sm font-semibold text-slate-200 mt-2 leading-snug">
                    {isUk ? item.titleUk : item.titleEn}
                  </h3>
                  <div className="text-xs text-slate-500 mt-1">{isUk ? item.fitsUk : item.fitsEn}</div>

                  <div className="mt-auto pt-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-white">{gbp !== null ? fmtGbp(gbp) : '—'}</span>
                    </div>
                    <div className="text-sm font-semibold text-amber-300 mt-0.5 min-h-[1.25rem]">
                      {uah !== null ? `≈ ${fmtUah(uah)}` : ''}
                    </div>
                    <button
                      type="button"
                      onClick={() => askPrice(item)}
                      className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-red-600 border border-slate-700 hover:border-red-600 text-white text-sm font-bold transition-colors"
                    >
                      <span>{isUk ? 'Замовити' : 'Order'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

          {/* Картка «немає в списку» */}
          <article className="flex flex-col justify-between rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-red-600 to-red-700 text-white">
            <div>
              <h3 className="text-xl font-black leading-tight">
                {isUk ? 'Потрібної деталі тут немає?' : 'Not on the list?'}
              </h3>
              <p className="text-sm text-red-50/90 mt-3 leading-relaxed">
                {isUk
                  ? 'Це лише приклади. Знайдемо будь-яку позицію — оригінал, аналог або б/у. Надішліть артикул, VIN або фото.'
                  : 'These are just examples. We source any part — genuine, aftermarket or used. Send a part number, VIN or photo.'}
              </p>
            </div>
            <a
              href="#parts-calculator"
              className="mt-6 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-red-700 text-sm font-extrabold uppercase tracking-wide hover:bg-red-50 transition-colors"
            >
              <span>{isUk ? 'Отримати ціну' : 'Get a quote'}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </article>
        </div>

        {/* Примітка */}
        <div className="mt-8 flex items-start gap-2 text-xs text-slate-500 max-w-4xl">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <p>
            {isUk
              ? 'Ціна деталі з нашою комісією, без доставки в Україну. Ціни постачальників змінюються, тому точну ціну й термін ми підтверджуємо у відповідь на запит. Гривня рахується за курсом НБУ на сьогодні, остаточна сума фіксується в момент оплати.'
              : 'Part price including our fee, excluding delivery. Supplier prices change, so we confirm the exact price and lead time when you request it. Hryvnia uses today’s NBU rate; the final amount is fixed at payment.'}
          </p>
        </div>
      </div>
    </section>
  );
}
