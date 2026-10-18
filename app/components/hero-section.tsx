'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, ArrowRight, Layers, Sparkles, Activity } from 'lucide-react';
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

  const scrollToCatalog = () => {
    const catalogSection = document.getElementById('catalog');
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative min-h-[640px] lg:min-h-[720px] flex items-center justify-center overflow-hidden bg-[#06090E] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      {/* 1. ФОНОВИЙ ВІДЕО-БЛОК ІЗ КІНЕМАТОГРАФІЧНИМ ОВЕРЛЕЄМ */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center opacity-30 filter brightness-75 contrast-125 scale-105"
        >
          {/* Якісний оптимізований фоновий стрім важкої техніки / логістичного хабу */}
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-heavy-industrial-machinery-operating-in-a-quarry-41551-large.mp4"
            type="video/mp4"
          />
        </video>
        {/* Градієнтне затемнення: безшовний плавний перехід у темну тему сайту */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#06090E]/80 via-[#06090E]/60 to-[#06090E]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[750px] h-[350px] bg-red-600/15 blur-[160px] rounded-full" />
      </div>

      {/* 2. ГОЛОВНИЙ КОНТЕНТ */}
      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        
        {/* Статус-бейдж UK хабу з пульсацією */}
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
              ? 'NoLimitGoods Ltd • Прямий експорт з Великобританії (Coventry Hub)'
              : 'NoLimitGoods Ltd • Direct Export from United Kingdom (Coventry Hub)'}
          </span>
        </motion.div>

        {/* Головний заголовок */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight"
        >
          {isUk ? (
            <>
              Запчастини до спецтехніки та авто <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-amber-200">
                напряму з Великобританії
              </span>
            </>
          ) : (
            <>
              Heavy Machinery & Commercial Parts <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-amber-200">
                Direct from the United Kingdom
              </span>
            </>
          )}
        </motion.h1>

        {/* Опис */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed font-normal"
        >
          {isUk
            ? 'Повний цикл логістики, офіційний статус експорту 0% UK VAT, консолідація вантажів у Ковентрі та прямі контракти без посередницьких націнок.'
            : 'End-to-end logistics solutions, T1 transit customs clearance, and zero-rated 0% UK export status directly to your enterprise.'}
        </motion.p>

        {/* Кнопки виклику дій */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
        >
          <button
            onClick={scrollToCalculator}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 via-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_30px_rgba(239,68,68,0.4)] flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>{isUk ? 'Розрахувати вартість замовлення' : 'Calculate Order Quote'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={scrollToCatalog}
            className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm tracking-wider uppercase border border-slate-700/80 transition-all flex items-center justify-center gap-2 backdrop-blur-md cursor-pointer active:scale-95"
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>{isUk ? 'Переглянути каталог деталей' : 'Explore OEM Catalog'}</span>
          </button>
        </motion.div>

        {/* 3. ПЕРЕВАГИ (4 ПЛАШКИ) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-8"
        >
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-md text-left">
            <div className="text-lg sm:text-xl font-black text-white flex items-center gap-1.5">
              100% <ShieldCheck className="w-4 h-4 text-emerald-400 inline" />
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {isUk ? 'Оригінальні деталі OEM' : 'Genuine OEM Equipment'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-md text-left">
            <div className="text-lg sm:text-xl font-black text-amber-400 flex items-center gap-1.5">
              5–14 {isUk ? 'роб. днів' : 'working days'} <Truck className="w-4 h-4 text-amber-400 inline" />
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {isUk
                ? 'Експрес-замовлення (до 1 міс. для великих партій)'
                : 'Express orders (up to 1 mo. for bulk)'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-md text-left">
            <div className="text-lg sm:text-xl font-black text-sky-400 flex items-center gap-1.5">
              DOUANE <Sparkles className="w-4 h-4 text-sky-400 inline" />
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {isUk ? 'Офіційне митне очищення' : 'T1 Transit & Customs'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-md text-left">
            <div className="text-lg sm:text-xl font-black text-emerald-400 flex items-center gap-1.5">
              0% VAT <Activity className="w-4 h-4 text-emerald-400 inline" />
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {isUk ? 'UK Ltd експортний інвойс' : 'Official UK Direct Invoice'}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
