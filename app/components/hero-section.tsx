'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, ArrowRight, Camera, Search, Tag, Star } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

// Головний екран у стилі великого магазину: світлий, з фото справжньої відправки.
export default function HeroSection() {
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
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
      {/* делікатна сітка і червоне світіння */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 60% 50% at 85% 10%, rgba(220,38,38,0.10), transparent 60%),' +
            'linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px)',
          backgroundSize: 'auto, 48px 48px, 48px 48px',
          maskImage: 'linear-gradient(to bottom, black 60%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 lg:pt-16 lg:pb-20 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs sm:text-sm font-semibold text-slate-700"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            {isUk ? 'NoLimitGoods Ltd • хаб у Ковентрі, Велика Британія' : 'NoLimitGoods Ltd • hub in Coventry, UK'}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.05]"
          >
            {isUk ? (
              <>
                Знайдемо і привеземо <span className="text-red-600">будь-яку запчастину</span>
              </>
            ) : (
              <>
                We find it and deliver it. <span className="text-red-600">Any part.</span>
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-5 max-w-xl text-slate-600 text-base sm:text-lg leading-relaxed"
          >
            {isUk
              ? 'Спецтехніка, сільгосптехніка, вантажівки й легкові авто. Шукаємо по складах Великої Британії, Європи та США і доставляємо в Україну — від одного фільтра до палети.'
              : 'Construction and farm machinery, trucks and cars. We search UK, EU and US stock and deliver to your door — from one filter to a pallet.'}
          </motion.p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {(isUk
              ? [['Оригінал', 'bg-emerald-50 text-emerald-700 border-emerald-200'], ['Якісний аналог', 'bg-sky-50 text-sky-700 border-sky-200'], ['Б/у', 'bg-amber-50 text-amber-700 border-amber-200']]
              : [['Genuine OEM', 'bg-emerald-50 text-emerald-700 border-emerald-200'], ['Aftermarket', 'bg-sky-50 text-sky-700 border-sky-200'], ['Used', 'bg-amber-50 text-amber-700 border-amber-200']]
            ).map(([label, cls]) => (
              <span key={label} className={`px-3.5 py-1.5 rounded-full border text-sm font-semibold ${cls}`}>{label}</span>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={scrollToCalculator}
              className="h-14 px-8 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm tracking-wider uppercase shadow-[0_12px_30px_rgba(220,38,38,0.30)] flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {isUk ? 'Отримати ціну' : 'Get a quote'} <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              href="/catalog"
              className="h-14 px-7 rounded-xl bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-900 font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2"
            >
              <Tag className="w-4 h-4 text-red-600" /> {isUk ? 'Каталог і ціни' : 'Catalog & prices'}
            </Link>
          </div>
        </div>

        {/* Фото справжньої відправки */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative"
        >
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-[0_30px_60px_-20px_rgba(15,23,42,0.35)] ring-1 ring-slate-200 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/hero-collage.jpg" alt={isUk ? 'Запчастини NoLimitGoods' : 'NoLimitGoods parts'} className="w-full h-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-900/70 to-transparent" />
            <div className="absolute left-4 bottom-4 right-4 flex items-end justify-between text-white">
              <div>
                <div className="text-xs uppercase tracking-wider text-white/80">{isUk ? 'Каталог' : 'Catalog'}</div>
                <div className="text-lg font-black">{isUk ? '790+ позицій з цінами' : '790+ priced parts'}</div>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-white/15 backdrop-blur text-xs font-bold">£ + ₴</div>
            </div>
          </div>
          <div className="absolute -left-4 sm:-left-6 top-6 hidden sm:flex items-center gap-3 px-4 py-3 rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <Star className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-sm font-black text-slate-900">{isUk ? 'Оригінал, аналог, б/у' : 'Genuine, aftermarket, used'}</div>
              <div className="text-xs text-slate-500">{isUk ? 'рахуємо всі варіанти' : 'we quote every option'}</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Переваги */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {benefits.map((b) => (
            <div key={b.title} className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
                <b.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-black text-slate-900">{b.title}</div>
                <div className="text-xs text-slate-500 leading-snug mt-0.5">{b.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
