'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search, ShieldCheck, Truck, Clock, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function HeroSection() {
  const { t, language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';
  const [partInput, setPartInput] = useState('');

  const handleQuickSearch = (code: string) => {
    setPartInput(code);
    const rfqInput = document.getElementById('rfq-parts-input') as HTMLInputElement | null;
    if (rfqInput) {
      rfqInput.value = code;
      rfqInput.dispatchEvent(new Event('input', { bubbles: true }));
      rfqInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
    const rfq = document.getElementById('rfq');
    if (rfq) {
      rfq.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (partInput) {
      handleQuickSearch(partInput);
    } else {
      const rfq = document.getElementById('rfq');
      if (rfq) rfq.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-slate-950 text-white pt-24 pb-16 overflow-hidden border-b border-slate-800">
      {/* Індустріальні фонові ефекти та світіння */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-950/25 via-slate-950/80 to-slate-950 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-red-600/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center py-10">
        
        {/* Верхній офіційний статус */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-slate-200 text-xs sm:text-sm font-semibold mb-6 shadow-xl backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>
            {isUk 
              ? 'NoLimitGoods Ltd • Прямий експорт з Великобританії (Coventry Hub)' 
              : 'NoLimitGoods Ltd • Official UK Export Hub & Logistics Solutions'}
          </span>
        </div>

        {/* Головний заголовок: Heavy Machinery & Automotive Spare Parts */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6 max-w-5xl mx-auto">
          {isUk ? (
            <>
              Запчастини до спецтехніки та авто{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-500">
                напряму з Великобританії
              </span>
            </>
          ) : (
            <>
              Heavy Machinery & Automotive Spare Parts{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-500">
                Directly from the UK
              </span>
            </>
          )}
        </h1>

        {/* Підзаголовок: Logistics Solutions & OEM Supply */}
        <p className="text-slate-300 text-base sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
          {isUk
            ? 'Повний цикл логістики та прямі поставки деталей Donaldson, JCB, CAT, Perkins без посередницьких націнок. Офіційний інвойс, митне очищення DOUANE та експрес-доставка в Україну.'
            : 'End-to-end logistics solutions, T1 transit customs clearance, and direct supply of genuine Donaldson, JCB, CAT, and Perkins components to your doorstep.'}
        </p>

        {/* Рядок швидкого підбору за каталожним номером */}
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSearchSubmit} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-amber-600 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-300" />
            <div className="relative flex items-center bg-slate-900 border border-slate-700 rounded-2xl p-2 shadow-2xl focus-within:border-red-500">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={partInput}
                onChange={(e) => setPartInput(e.target.value)}
                placeholder={
                  isUk 
                    ? 'Введіть номер деталі або модель (P553004, 332/Y3163, Perkins)...' 
                    : 'Search part number or equipment model (e.g. P553004, 332/Y3163)...'
                }
                className="w-full bg-transparent px-3 py-2 text-white placeholder-slate-400 focus:outline-none text-sm sm:text-base font-medium"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shrink-0 transition-colors shadow-lg cursor-pointer"
              >
                <span>{isUk ? 'Знайти ціну' : 'Get Quote'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Швидкі кнопки */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-400">
            <span className="text-slate-500 font-semibold">{isUk ? 'Ходові коди:' : 'Popular:'}</span>
            {['P553004', 'P535114', 'JCB 458/20403', 'Perkins 26561117', 'Carraro 149298'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleQuickSearch(tag)}
                className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-red-500 hover:text-white transition-colors cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Основні CTA-кнопки */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <button
            onClick={() => scrollTo('rfq')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm tracking-wide transition-all shadow-xl shadow-red-600/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isUk ? 'Розрахувати вартість замовлення' : 'Request Instant Quotation'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollTo('parts')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-200 font-bold text-sm tracking-wide transition-colors cursor-pointer"
          >
            {isUk ? 'Переглянути каталог деталей' : 'Explore Parts Catalog'}
          </button>
        </div>

        {/* 4 ключові плашки переваг */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 text-red-500 font-black text-xl mb-1">
              <span>100%</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xs text-slate-300 font-medium">
              {isUk ? 'Оригінальні деталі OEM' : 'Genuine OEM Equipment'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 text-amber-500 font-black text-xl mb-1">
              <span>5–8 {isUk ? 'днів' : 'days'}</span>
              <Truck className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xs text-slate-300 font-medium">
              {isUk ? 'Експрес-рейси щотижня' : 'Weekly UK ➔ UA Freight'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 text-sky-400 font-black text-xl mb-1">
              <span>DOUANE</span>
              <ShieldCheck className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-xs text-slate-300 font-medium">
              {isUk ? 'Офіційне митне очищення' : 'T1 Transit & Customs'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 font-black text-xl mb-1">
              <span>0% VAT</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xs text-slate-300 font-medium">
              {isUk ? 'UK Ltd експортний інвойс' : 'Official UK Direct Invoice'}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
