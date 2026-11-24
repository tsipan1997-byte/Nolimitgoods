'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, ArrowRight, Camera, Search, Tag } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { CATALOG } from '@/lib/catalog';
import { KRAMP_COUNTS } from '@/lib/catalog-stats';
import HeroQuickForm from './hero-quick-form';

// Скільки позицій з цінами реально в каталозі (округлено вниз до сотень)
const CATALOG_TOTAL_ROUNDED = Math.floor((CATALOG.length + Object.values(KRAMP_COUNTS).reduce((a, b) => a + b, 0)) / 100) * 100;

// Головний екран у стилі великого магазину: світлий, з фото справжньої відправки.
// Кількість лотів передає сервер (app/page.tsx), щоб не тягнути в браузер весь масив лотів
export default function HeroSection({ lotsTotal }: { lotsTotal: number }) {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';

  const scrollToCalculator = () => {
    const el = document.getElementById('parts-calculator');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => el?.querySelector('input')?.focus({ preventScroll: true }), 500);
  };

  const benefits = isUk
    ? [
        { icon: Search, title: 'Знайдемо', text: 'Навіть рідкісний OEM — за VIN або фото' },
        { icon: Truck, title: '5–14 роб. днів', text: 'Типовий термін доставки в Україну' },
        { icon: Camera, title: 'Фотозвіт', text: 'Фото й відео деталі перед відправкою' },
        { icon: ShieldCheck, title: 'UK Ltd', text: 'Офіційний інвойс британської компанії' },
      ]
    : [
        { icon: Search, title: 'We find it', text: 'Even rare OEM — by VIN or photo' },
        { icon: Truck, title: '5–14 days', text: 'Typical delivery time' },
        { icon: Camera, title: 'Photo report', text: 'Photos and video before dispatch' },
        { icon: ShieldCheck, title: 'UK Ltd', text: 'Official invoice from a UK company' },
      ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-6 lg:pt-12 lg:pb-12 grid lg:grid-cols-[1.1fr_0.9fr] gap-6 lg:gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            {isUk ? 'NoLimitGoods Ltd · Ковентрі, Велика Британія' : 'NoLimitGoods Ltd · Coventry, UK'}
          </div>

          <h1 className="mt-3 text-[28px] sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.08]">
            {isUk ? (
              <>
                Запчастини і техніка з Англії — <span className="text-red-600">з реальними цінами</span>
              </>
            ) : (
              <>
                Parts and machinery from the UK — <span className="text-red-600">with real prices</span>
              </>
            )}
          </h1>

          <p className="mt-3 max-w-xl text-slate-600 text-[15px] sm:text-lg leading-relaxed">
            {isUk
              ? 'Запчастини до спецтехніки, сільгосптехніки, вантажівок і авто — та викуп техніки з аукціонів Великої Британії. Доставка в Україну.'
              : 'Parts for construction, farm machinery, trucks and cars — plus buying machinery at UK auctions. Delivery to Ukraine.'}
          </p>

          {/* Лічильники (варіант A) */}
          <div className="mt-4 grid grid-cols-3 gap-2 max-w-xl">
            <Link href="/catalog" className="rounded-2xl border border-slate-200 bg-white p-3 hover:border-red-300">
              <div className="text-[10px] sm:text-[11px] font-semibold uppercase text-slate-500">{isUk ? 'Позицій з цінами' : 'Priced parts'}</div>
              <div className="font-mono text-lg sm:text-2xl font-bold text-slate-900">{CATALOG_TOTAL_ROUNDED}+</div>
            </Link>
            <Link href="/aukciony" className="rounded-2xl border border-slate-200 bg-white p-3 hover:border-red-300">
              <div className="text-[10px] sm:text-[11px] font-semibold uppercase text-slate-500">{isUk ? 'Лотів аукціонів' : 'Auction lots'}</div>
              <div className="font-mono text-lg sm:text-2xl font-bold text-slate-900">{lotsTotal}</div>
            </Link>
            <div className="rounded-2xl bg-red-600 p-3 text-white">
              <div className="text-[10px] sm:text-[11px] font-semibold uppercase text-red-100">{isUk ? 'Доставка' : 'Delivery'}</div>
              <div className="font-mono text-lg sm:text-2xl font-bold whitespace-nowrap">5–14 {isUk ? 'дн' : 'd'}</div>
            </div>
          </div>

          <HeroQuickForm />

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <Link href="/catalog" className="inline-flex items-center gap-1.5 font-bold text-slate-900 hover:text-red-600">
              <Tag className="w-4 h-4 text-red-600" /> {isUk ? 'Каталог і ціни' : 'Catalog & prices'}
            </Link>
            <button type="button" onClick={scrollToCalculator} className="inline-flex items-center gap-1.5 font-bold text-slate-900 hover:text-red-600">
              <ArrowRight className="w-4 h-4 text-red-600" /> {isUk ? 'Кілька деталей одразу' : 'Several parts at once'}
            </button>
          </div>
        </div>

        {/* Фото справжньої відправки — тільки на великих екранах, щоб на телефоні форма була одразу */}
        <div className="relative hidden lg:block">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-[0_30px_60px_-20px_rgba(15,23,42,0.35)] ring-1 ring-slate-200 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/hero-collage.jpg" alt={isUk ? 'Запчастини NoLimitGoods' : 'NoLimitGoods parts'} className="w-full h-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-900/70 to-transparent" />
            <div className="absolute left-4 bottom-4 right-4 flex items-end justify-between text-white">
              <div>
                <div className="text-xs uppercase tracking-wider text-white/80">{isUk ? 'Оригінал, аналог, б/у' : 'Genuine, aftermarket, used'}</div>
                <div className="text-lg font-black">{isUk ? `${CATALOG_TOTAL_ROUNDED}+ позицій з цінами` : `${CATALOG_TOTAL_ROUNDED}+ priced parts`}</div>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-white/15 backdrop-blur text-xs font-bold">£ + ₴</div>
            </div>
          </div>
        </div>
      </div>

      {/* Переваги */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {benefits.map((b) => (
            <div key={b.title} className="flex items-start gap-2.5 p-3 sm:p-4 rounded-2xl bg-white border border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <b.icon className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <div className="text-sm font-black text-slate-900">{b.title}</div>
                <div className="text-[11px] sm:text-xs text-slate-500 leading-snug mt-0.5">{b.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
