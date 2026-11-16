'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, ArrowRight, Camera, Search, Tag } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function HeroSection() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';

  const scrollToCalculator = () => {
    const el = document.getElementById('parts-calculator') || document.querySelector('input[type="text"]');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const input = el.tagName === 'INPUT' ? (el as HTMLInputElement) : el.querySelector('input');
      input?.focus();
    }
  };

  const scrollToPrices = () => {
    document.getElementById('prices')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="relative min-h-[640px] lg:min-h-[720px] flex items-center justify-center overflow-hidden bg-[#06090E] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      {/* 1. ФОН: СВІТІННЯ + ІНЖЕНЕРНА СІТКА + ГЛОБУС З МАРШРУТАМИ */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Кольорове світіння */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(224,36,36,0.22), transparent 60%),' +
              'radial-gradient(ellipse 45% 40% at 95% 95%, rgba(245,158,11,0.10), transparent 70%),' +
              'radial-gradient(ellipse 45% 45% at 0% 85%, rgba(56,189,248,0.08), transparent 70%)',
          }}
        />

        {/* Інженерна сітка, що розчиняється до країв */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(148,163,184,0.07) 1px, transparent 1px),' +
              'linear-gradient(90deg, rgba(148,163,184,0.07) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 45%, black, transparent)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 45%, black, transparent)',
          }}
        />

        {/* Каркас глобуса з маршрутами до хабу */}
        <svg
          viewBox="0 0 600 600"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[760px] sm:w-[900px] sm:h-[900px] opacity-40"
          style={{
            maskImage: 'radial-gradient(circle at 50% 50%, black 35%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 35%, transparent 70%)',
          }}
          fill="none"
        >
          <g stroke="rgba(148,163,184,0.35)" strokeWidth="0.8">
            <circle cx="300" cy="300" r="270" />
            {[60, 120, 180, 230].map((ry) => (
              <ellipse key={`lat-${ry}`} cx="300" cy="300" rx="270" ry={ry} />
            ))}
            {[70, 140, 210].map((rx) => (
              <ellipse key={`lon-${rx}`} cx="300" cy="300" rx={rx} ry="270" />
            ))}
            <line x1="300" y1="30" x2="300" y2="570" />
            <line x1="30" y1="300" x2="570" y2="300" />
          </g>

          {/* Маршрути: з різних точок світу — до хабу */}
          {[
            { from: [110, 380], ctrl: [170, 200] },
            { from: [480, 420], ctrl: [460, 260] },
            { from: [520, 190], ctrl: [430, 120] },
            { from: [190, 130], ctrl: [240, 110] },
            { from: [350, 500], ctrl: [400, 340] },
          ].map((r, i) => (
            <g key={`route-${i}`}>
              <motion.path
                d={`M ${r.from[0]} ${r.from[1]} Q ${r.ctrl[0]} ${r.ctrl[1]} 320 215`}
                stroke="#E02424"
                strokeWidth="1.6"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: [0, 1, 1], opacity: [0, 0.9, 0] }}
                transition={{ duration: 4, delay: i * 0.8, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
              />
              <circle cx={r.from[0]} cy={r.from[1]} r="3" fill="#F59E0B" opacity="0.8" />
            </g>
          ))}

          {/* Хаб */}
          <motion.circle
            cx="320"
            cy="215"
            r="6"
            fill="none"
            stroke="#E02424"
            strokeWidth="1.5"
            animate={{ r: [6, 18], opacity: [0.9, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />
          <circle cx="320" cy="215" r="4.5" fill="#E02424" />
        </svg>

        {/* Плавний перехід у наступну секцію */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#06090E]" />
      </div>

      {/* 2. ГОЛОВНИЙ КОНТЕНТ */}
      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">

        {/* Бейдж UK-хабу */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-[0_0_20px_rgba(239,68,68,0.25)]"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-xs sm:text-sm font-semibold text-slate-200 tracking-wide">
            {isUk
              ? 'NoLimitGoods Ltd • Власний хаб у Ковентрі, Велика Британія'
              : 'NoLimitGoods Ltd • Own hub in Coventry, United Kingdom'}
          </span>
        </motion.div>

        {/* Головний заголовок */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05]"
        >
          {isUk ? (
            <>
              Знайдемо і привеземо <br />
              <span className="text-[#E02424]">будь-яку запчастину.</span>
            </>
          ) : (
            <>
              We find it. We deliver it. <br />
              <span className="text-[#E02424]">Any part, anywhere.</span>
            </>
          )}
        </motion.h1>

        {/* Опис */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto text-slate-300 text-base sm:text-lg leading-relaxed"
        >
          {isUk
            ? 'Спецтехніка, сільгосптехніка, вантажівки й легкові авто. Шукаємо по складах Великої Британії, Європи та США і доставляємо в Україну — від одного фільтра до палети.'
            : 'Construction and farm machinery, trucks and cars. We search stock across the UK, Europe and the USA and deliver to your door — from a single filter to a full pallet.'}
        </motion.p>

        {/* Оригінал / аналог / б/у */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {(isUk
            ? [
                ['Оригінал', 'border-emerald-500/40 text-emerald-300'],
                ['Якісний аналог', 'border-sky-500/40 text-sky-300'],
                ['Б/у', 'border-amber-500/40 text-amber-300'],
              ]
            : [
                ['Genuine OEM', 'border-emerald-500/40 text-emerald-300'],
                ['Quality aftermarket', 'border-sky-500/40 text-sky-300'],
                ['Used', 'border-amber-500/40 text-amber-300'],
              ]
          ).map(([label, cls]) => (
            <span key={label} className={`px-4 py-1.5 rounded-full border bg-slate-950/60 text-sm font-semibold ${cls}`}>
              {label}
            </span>
          ))}
          <span className="text-sm text-slate-400 ml-1">
            {isUk ? '— порахуємо всі варіанти' : '— we quote every option'}
          </span>
        </motion.div>

        {/* Кнопки дій */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
        >
          <button
            onClick={scrollToCalculator}
            className="w-full sm:w-auto px-9 py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm tracking-wider uppercase transition-all shadow-[0_10px_30px_rgba(220,38,38,0.45)] hover:shadow-[0_14px_35px_rgba(220,38,38,0.6)] flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>{isUk ? 'Отримати ціну' : 'Get a quote'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={scrollToPrices}
            className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm tracking-wider uppercase border border-slate-700/80 transition-all flex items-center justify-center gap-2 backdrop-blur-md cursor-pointer active:scale-95"
          >
            <Tag className="w-4 h-4 text-amber-400" />
            <span>{isUk ? 'Приклади цін' : 'See prices'}</span>
          </button>
        </motion.div>

        {/* 3. ПЕРЕВАГИ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-8"
        >
          {(isUk
            ? [
                { icon: Search, color: 'text-white', title: 'Знайдемо', text: 'Навіть рідкісний OEM-номер — по VIN або фото' },
                { icon: Truck, color: 'text-amber-400', title: '5–14 роб. днів', text: 'Типовий термін доставки в Україну' },
                { icon: Camera, color: 'text-sky-400', title: 'Фотозвіт', text: 'Фото й відео деталі перед відправкою' },
                { icon: ShieldCheck, color: 'text-emerald-400', title: 'UK Ltd', text: 'Офіційний інвойс від британської компанії' },
              ]
            : [
                { icon: Search, color: 'text-white', title: 'We find it', text: 'Even rare OEM numbers — by VIN or photo' },
                { icon: Truck, color: 'text-amber-400', title: '5–14 working days', text: 'Typical delivery time' },
                { icon: Camera, color: 'text-sky-400', title: 'Photo report', text: 'Photos and video before dispatch' },
                { icon: ShieldCheck, color: 'text-emerald-400', title: 'UK Ltd', text: 'Official invoice from a UK company' },
              ]
          ).map((f) => (
            <div key={f.title} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-md text-left">
              <div className={`text-lg sm:text-xl font-black flex items-center gap-1.5 ${f.color}`}>
                <f.icon className="w-4 h-4 inline" /> {f.title}
              </div>
              <div className="text-xs text-slate-400 mt-1 leading-snug">{f.text}</div>
            </div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}
