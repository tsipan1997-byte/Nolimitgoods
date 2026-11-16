'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, RefreshCw, Info } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { FEATURED, CATALOG } from '@/lib/catalog';
import { KRAMP_COUNTS } from '@/lib/catalog-stats';
import { loadRates, type Rates } from '@/lib/pricing';
import ProductCard from './product-card';

export default function PriceShowcase() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';
  const [rates, setRates] = useState<Rates | null>(null);
  const [ratesFailed, setRatesFailed] = useState(false);

  useEffect(() => {
    loadRates().then((r) => (r ? setRates(r) : setRatesFailed(true)));
  }, []);

  return (
    <section id="prices" className="relative py-20 sm:py-24 bg-slate-50 border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-600 mb-3">{isUk ? 'Приклади цін' : 'Price examples'}</p>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {isUk ? 'Скільки це коштує насправді' : 'What parts really cost'}
            </h2>
            <p className="mt-4 text-slate-500 text-base sm:text-lg">
              {isUk
                ? 'Реальні позиції, які ми возимо. Ціна вже з нашою комісією, у фунтах і в гривнях за сьогоднішнім курсом, плюс доставка в Україну за вагою.'
                : 'Real items we supply. Prices include our fee, in pounds and hryvnia at today’s rate, plus delivery by weight.'}
            </p>
          </div>

          <div className="shrink-0 inline-flex items-center gap-3 self-start lg:self-auto px-4 py-3 rounded-2xl bg-white border border-slate-200">
            <RefreshCw className={`w-4 h-4 ${rates ? 'text-emerald-600' : 'text-slate-500 animate-spin'}`} />
            <div className="text-xs leading-tight">
              {rates ? (
                <>
                  <div className="text-slate-900 font-bold font-mono">£1 = {rates.uah.GBP.toFixed(2)} ₴</div>
                  <div className="text-slate-500 mt-0.5">{isUk ? `Курс НБУ на ${rates.date}` : `NBU rate, ${rates.date}`}</div>
                </>
              ) : ratesFailed ? (
                <div className="text-slate-500">{isUk ? 'Курс НБУ тимчасово недоступний' : 'NBU rate unavailable'}</div>
              ) : (
                <div className="text-slate-500">{isUk ? 'Завантажуємо курс НБУ…' : 'Loading NBU rate…'}</div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {FEATURED.map((item) => (
            <ProductCard key={item.id} item={item} rates={rates} isUk={isUk} />
          ))}

          <article className="flex flex-col justify-between rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-red-600 to-red-700 text-white">
            <div>
              <h3 className="text-xl font-black leading-tight">
                {(() => { const n = CATALOG.length + Object.values(KRAMP_COUNTS).reduce((a, b) => a + b, 0) - FEATURED.length; return isUk ? `Ще ${n}+ позицій у каталозі` : `${n}+ more in the catalog`; })()}
              </h3>
              <p className="text-sm text-red-50/90 mt-3 leading-relaxed">
                {isUk
                  ? 'Агро, спецтехніка, вантажівки, легкові. А якщо потрібної деталі немає — знайдемо під запит: оригінал, аналог або б/у.'
                  : 'Farm, construction, trucks, cars. Not listed? We source it on request: genuine, aftermarket or used.'}
              </p>
            </div>
            <Link
              href="/catalog"
              className="mt-6 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-red-700 text-sm font-extrabold uppercase tracking-wide hover:bg-red-50 transition-colors"
            >
              <span>{isUk ? 'Відкрити каталог' : 'Open catalog'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </article>
        </div>

        <div className="mt-8 flex items-start gap-2 text-xs text-slate-500 max-w-4xl">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <p>
            {isUk
              ? 'Ціна деталі з нашою комісією; доставка в Україну показана окремо за вагою. Ціни постачальників змінюються, тому точну ціну й термін ми підтверджуємо у відповідь на запит. Гривня рахується за курсом НБУ на сьогодні, остаточна сума фіксується в момент оплати.'
              : 'Part price includes our fee; delivery is shown separately by weight. Supplier prices change, so we confirm exact price and lead time on request. Hryvnia uses today’s NBU rate; the final amount is fixed at payment.'}
          </p>
        </div>
      </div>
    </section>
  );
}
