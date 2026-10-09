'use client';

import React, { useState } from 'react';
import { Search, ArrowRight, ShieldCheck, Truck, CheckCircle2, FileCheck2, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function HeroSection() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rfqElement = document.getElementById('rfq');
    if (rfqElement) {
      rfqElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sampleTags = ['P535114', 'JCB 332/Y3163', 'Perkins 26561117', 'CAT 1R-0716', 'Rexroth A10VSO'];

  return (
    <section className="relative bg-slate-950 text-white pt-28 pb-20 overflow-hidden border-b border-slate-800">
      {/* Індустріальна неонова підсвітка фону */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-red-600/15 via-red-950/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Статусний бейдж британського імпортера */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-slate-200 text-xs sm:text-sm font-semibold mb-6 shadow-xl backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {isUk
                ? 'Прямий хаб у Ковентрі (UK) • Офіційний експортний EORI / VAT'
                : 'Direct Coventry (UK) Hub • Verified Export EORI & VAT'}
            </span>
          </div>

          {/* Головний промисловий заголовок */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-5">
            {isUk ? (
              <>
                Оригінальні запчастини до спецтехніки{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-500">
                  напряму з Великобританії
                </span>
              </>
            ) : (
              <>
                Genuine Heavy Machinery Parts{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-500">
                  Direct from the UK
                </span>
              </>
            )}
          </h1>

          {/* Опис місії */}
          <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            {isUk
              ? 'Поставки фільтрів Donaldson, гідравліки та компонентів JCB, CAT, Perkins без посередницьких націнок. Офіційний інвойс, митне оформлення DOUANE, доставка палетами по Україні.'
              : 'Direct supply chain from UK distribution centers. Donaldson filtration, JCB, CAT, and Perkins OEM components with full customs compliance and door-to-door delivery.'}
          </p>

          {/* Інтерактивний рядок пошуку запчастини по артикулу */}
          <div className="max-w-2xl mx-auto mb-6">
            <form onSubmit={handleSearchSubmit} className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-amber-600 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-300" />
              <div className="relative flex items-center bg-slate-900 border border-slate-700 rounded-2xl p-2 shadow-2xl focus-within:border-red-500 transition-colors">
                <div className="pl-3 text-slate-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isUk
                      ? 'Введіть каталожний номер (напр. P535114, 332/Y3163)...'
                      : 'Enter part number or model (e.g. P535114, 332/Y3163)...'
                  }
                  className="w-full bg-transparent px-3 py-2 text-white placeholder-slate-400 focus:outline-none text-sm sm:text-base font-medium"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shrink-0 transition-colors shadow-lg cursor-pointer"
                >
                  <span>{isUk ? 'Знайти ціну' : 'Check Price'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Швидкі клікабельні теги */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-400">
              <span className="font-semibold text-slate-500">{isUk ? 'Популярні запити:' : 'Quick lookup:'}</span>
              {sampleTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSearchQuery(tag)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-600 hover:text-white transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* 4 індустріальні плашки довіри */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left pt-6 max-w-4xl mx-auto">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-2 text-red-500 font-black text-xl mb-1">
                <span>100%</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xs text-slate-300 font-medium">
                {isUk ? 'Оригінал Donaldson / OEM' : 'Genuine Donaldson & OEM'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-2 text-amber-500 font-black text-xl mb-1">
                <span>5–8 {isUk ? 'днів' : 'days'}</span>
                <Truck className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xs text-slate-300 font-medium">
                {isUk ? 'UK Склад ➔ Клієнт' : 'UK Hub ➔ Door Delivery'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-2 text-sky-400 font-black text-xl mb-1">
                <span>DOUANE</span>
                <FileCheck2 className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-xs text-slate-300 font-medium">
                {isUk ? 'Офіційне митне очищення' : 'Full Customs Clearance'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-2 text-emerald-400 font-black text-xl mb-1">
                <span>UK Ltd</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xs text-slate-300 font-medium">
                {isUk ? 'Прямий контракт та інвойс' : 'Official UK Direct Invoice'}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
