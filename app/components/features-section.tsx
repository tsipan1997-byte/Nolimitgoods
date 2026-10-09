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

  const routeSteps = [
    {
      step: '01',
      icon: Warehouse,
      title: isUk ? 'Хаб у Ковентрі (UK)' : 'Coventry Hub (UK)',
      subtitle: '374 Hipsell Highway, CV2 5FR',
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
      subtitle: 'EORI GB079878335000',
      desc: isUk 
        ? 'Офіційний експортний інвойс NoLimitGoods Ltd, оформлення транзиту T1, нульова ставка VAT (0%).' 
        : 'Official UK export invoicing, T1 declarations and full customs compliance.',
      tag: isUk ? 'Без затримок' : 'Compliant',
      accent: 'border-amber-500/30 bg-amber-950/20 text-amber-400'
    },
    {
      step: '03',
      icon: Truck,
      title: isUk ? 'Експрес-логістика в Україну' : 'Cross-Border Logistics',
      subtitle: isUk ? 'Регулярні рейси' : 'Weekly freight',
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
      subtitle: isUk ? 'Нова Пошта або палета' : 'Nova Post or Pallet Freight',
      desc: isUk 
        ? 'Адресна доставка прямо на базу вашої техніки або найближче вантажне відділення.' 
        : 'Doorstep delivery to equipment bases or regional courier terminals.',
      tag: isUk ? 'До дверей' : 'Door-to-door',
      accent: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400'
    }
  ];

  return (
    <section id="services" className="py-24 bg-slate-900 text-white relative overflow-hidden border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
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
              ? 'Жодних посередників. Ви контролюєте кожен етап руху замовлення з моменту комплектації на складі в Ковентрі.'
              : 'Direct freight cycle managed by our UK corporate entity.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {routeSteps.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.step}
                className="relative bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl font-black text-slate-700 group-hover:text-red-500/80 transition-colors">
                      {item.step}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${item.accent}`}>
                      {item.tag}
                    </span>
                  </div>

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

        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-red-600/10 border border-red-500/20 text-red-400 shrink-0">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-1">
                {isUk ? 'NoLimitGoods Limited — Офіційний експортер спецзапчастин' : 'NoLimitGoods Limited — Official Machinery Parts Exporter'}
              </h4>
              <p className="text-sm text-slate-400 max-w-2xl">
                {isUk
                  ? 'Компанія зареєстрована в Реєстраційній палаті Англії та Уельсу (Company No. 13146899, VAT 372654187). Офіційний контракт, інвойси в GBP/EUR/USD, повна податкова чистота.'
                  : 'Incorporated in England and Wales (Company No. 13146899, VAT 372654187). Compliant export billing and international contracts.'}
              </p>
            </div>
          </div>

          <a
            href="#rfq"
            className="w-full lg:w-auto px-6 py-3.5
