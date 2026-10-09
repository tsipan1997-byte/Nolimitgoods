'use client';

import React from 'react';
import { 
  Warehouse, 
  Truck, 
  FileCheck, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Building2,
  Clock
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function FeaturesSection() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';

  const routeSteps = [
    {
      step: '01',
      icon: Warehouse,
      title: isUk ? 'Хаб у Ковентрі (UK)' : 'Coventry Hub (UK)',
      subtitle: isUk ? '374 Hipsell Highway, CV2 5FR' : '374 Hipsell Highway, CV2 5FR',
      desc: isUk 
        ? 'Пряма комплектація з заводських складів Donaldson, Perkins, JCB. Інспекція маркувань та пломбування палет.' 
        : 'Direct dispatch from OEM distribution points. Part verification and pallet sealing.',
      tag: isUk ? '1–2 дні' : '1–2 days',
      accent: 'border-red-500/30 bg-red-950/20 text-red-400'
    },
    {
      step: '02',
      icon: FileCheck,
      title: isUk ? 'Митне оформлення DOUANE' : 'Customs & DOUANE Transit',
      subtitle: isUk ? 'EORI GB079878335000' : 'EORI GB079878335000',
      desc: isUk 
        ? 'Офіційний експортний інвойс NoLimitGoods Ltd, оформлення транзиту T1, відшкодування/нульова ставка VAT (0%).' 
        : 'Official UK export invoicing, T1 declarations and full customs compliance.',
      tag: isUk ? 'Без затримок' : 'Compliant',
      accent: 'border-amber-500/30 bg-amber-950/20 text-amber-400'
    },
    {
      step: '03',
      icon: Truck,
      title: isUk ? 'Експрес-логістика в Україну' : 'Cross-Border Logistics',
      subtitle: isUk ? 'Регулярні рейси щотижня' : 'Weekly freight departures',
      desc: isUk 
        ? 'Прямий автотранспортний коридор. Вантаж застрахований на 100% вартості на весь період перевезення.' 
        : 'Dedicated road transport corridor with complete cargo insurance throughout transit.',
      tag: isUk ? '3–5 днів' : '3–5 days',
      accent: 'border-sky-500/30 bg-sky-950/20 text-sky-400'
    },
    {
      step: '04',
      icon: MapPin,
      title: isUk ? 'Видача у вашому місті' : 'Final Delivery in Ukraine',
      subtitle: isUk ? 'Нова Пошта або склад' : 'Nova Post or Pallet Freight',
      desc: isUk 
        ? 'Адресна доставка прямо на базу вашої техніки або найближче відділення з повним пакетом документів.' 
        : 'Doorstep delivery to equipment bases or regional courier terminals.',
      tag: isUk ? 'До дверей' : 'Door-to-door',
      accent: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400'
    }
  ];

  return (
    <section id="services" className="py-24 bg-slate-900 text-white relative overflow-hidden border-b border-slate-800">
      {/* М'яке індустріальне підсвічування */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Заголовок секції */}
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
              ? 'Жодних прихованих посередників і невизначеності. Ви бачите кожен етап руху замовлення з моменту комплектації на складі в Ковентрі.'
              : 'Clear, compliant and predictable freight cycle directly managed by our UK corporate entity.'}
          </p>
        </div>

        {/* 4 інтерактивні кроки логістичного треку */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {routeSteps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.step}
                className="relative bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group shadow-lg"
              >
                {/* Номер кроку та бейдж */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl font-black text-slate-700 group-hover:text-red-500/80 transition-colors">
                      {item.step}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${item.accent}`}>
                      {item.tag}
                    </span>
                  </div>

                  {/* Іконка */}
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-white group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6 text-red-500" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1">
                    {item.title}
                  </h3>
                  <div className="text-xs text-amber-400/90 font-medium mb-3">
                    {item.subtitle}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{isUk ? 'Статус контролю' : 'Status Check'}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Юридичний банер прозорості (VAT / EORI / Ковентрі) */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded
