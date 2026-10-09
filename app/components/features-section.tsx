'use client';

import React from 'react';
import { 
  Warehouse, 
  Truck, 
  FileCheck, 
  MapPin, 
  CheckCircle2, 
  Building2, 
  Clock, 
  ArrowRight 
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function FeaturesSection() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';

  return (
    <section id="services" className="py-24 bg-slate-900 text-white relative overflow-hidden border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Заголовок */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs sm:text-sm font-semibold mb-4">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{isUk ? 'Прозорий ланцюг поставок' : 'Verified Supply Chain Timeline'}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-white">
            {isUk ? (
              <>Як деталь потрапляє <span className="text-red-500">з Британії до вашої техніки</span></>
            ) : (
              <>Direct Route <span className="text-red-500">from UK Stock to Your Fleet</span></>
            )}
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            {isUk
              ? 'Жодних прихованих посередників. Ви контролюєте кожен етап руху замовлення з моменту комплектації на складі в Ковентрі.'
              : 'Direct freight cycle managed by our UK corporate entity.'}
          </p>
        </div>

        {/* 4 кроки доставки */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          
          {/* Крок 1 */}
          <div className="relative bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group shadow-lg">
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="text-3xl font-black text-slate-700 group-hover:text-red-500/80 transition-colors">01</span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full border border-red-500/30 bg-red-950/20 text-red-400">
                  {isUk ? '1–2 дні' : '1–2 days'}
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-white group-hover:scale-105 transition-transform">
                <Warehouse className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                {isUk ? 'Хаб у Ковентрі (UK)' : 'Coventry Hub (UK)'}
              </h3>
              <div className="text-xs text-amber-400/90 font-medium mb-3">
                374 Hipsell Highway, CV2 5FR
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isUk 
                  ? 'Пряма комплектація з заводських складів Donaldson, Perkins, JCB. Інспекція маркувань та пломбування палет.' 
                  : 'Direct dispatch from OEM distribution points. Part verification and pallet sealing.'}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
              <span>{isUk ? 'Статус контролю' : 'Status Check'}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
          </div>

          {/* Крок 2 */}
          <div className="relative bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group shadow-lg">
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="text-3xl font-black text-slate-700 group-hover:text-red-500/80 transition-colors">02</span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full border border-amber-500/30 bg-amber-950/20 text-amber-400">
                  {isUk ? 'Без затримок' : 'Compliant'}
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-white group-hover:scale-105 transition-transform">
                <FileCheck className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                {isUk ? 'Митне оформлення DOUANE' : 'Customs & Transit'}
              </h3>
              <div className="text-xs text-amber-400/90 font-medium mb-3">
                EORI GB079878335000
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isUk 
                  ? 'Офіційний експортний інвойс NoLimitGoods Ltd, оформлення транзиту T1, нульова ставка VAT (0%).' 
                  : 'Official UK export invoicing, T1 declarations and full customs compliance.'}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
              <span>{isUk ? 'Статус контролю' : 'Status Check'}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
          </div>

          {/* Крок 3 */}
          <div className="relative bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group shadow-lg">
            <div>
              <div className="flex items
