'use client';

import React from 'react';
import { ArrowRight, ShieldCheck, Factory } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

interface BrandItem {
  id: string;
  name: string;
  hubLocationUk: string;
  categoryUk: string;
  categoryEn: string;
  badgeBg: string;
  badgeTextColor: string;
  symbol: React.ReactNode;
}

const brandsData: BrandItem[] = [
  {
    id: 'donaldson',
    name: 'Donaldson',
    hubLocationUk: 'USA / UK Hub',
    categoryUk: 'Фільтрація OEM',
    categoryEn: 'OEM Filtration',
    badgeBg: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
    badgeTextColor: 'text-sky-400',
    symbol: (
      <span className="font-black text-xs tracking-tighter text-sky-400 border border-sky-400/40 rounded px-1.5 py-0.5">
        D•F
      </span>
    ),
  },
  {
    id: 'jcb',
    name: 'JCB',
    hubLocationUk: 'Rochester, UK',
    categoryUk: 'Спецтехніка',
    categoryEn: 'Heavy Equipment',
    badgeBg: 'bg-[#FFB800]/10 border-[#FFB800]/30 text-[#FFB800]',
    badgeTextColor: 'text-[#FFB800]',
    symbol: (
      <span className="bg-[#FFB800] text-black font-black text-[11px] px-1.5 py-0.5 rounded font-mono shadow-sm">
        JCB
      </span>
    ),
  },
  {
    id: 'caterpillar',
    name: 'Caterpillar',
    hubLocationUk: 'Global OEM',
    categoryUk: 'Будівельна техніка',
    categoryEn: 'Construction OEM',
    badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    badgeTextColor: 'text-amber-400',
    symbol: (
      <div className="flex items-center gap-1 bg-neutral-900 border border-amber-400/50 px-1.5 py-0.5 rounded">
        <span className="text-amber-400 font-black text-xs tracking-tight">CAT</span>
        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
      </div>
    ),
  },
  {
    id: 'perkins',
    name: 'Perkins',
    hubLocationUk: 'Peterborough, UK',
    categoryUk: 'Дизельні двигуни',
    categoryEn: 'Diesel Engines',
    badgeBg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    badgeTextColor: 'text-blue-400',
    symbol: (
      <span className="font-serif font-black text-xs text-blue-400 border border-blue-400/40 rounded px-1.5 py-0.5">
        P
      </span>
    ),
  },
  {
    id: 'cummins',
    name: 'Cummins',
    hubLocationUk: 'Daventry, UK',
    categoryUk: 'Паливні системи',
    categoryEn: 'Fuel Systems',
    badgeBg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
    badgeTextColor: 'text-rose-400',
    symbol: (
      <span className="bg-rose-600 text-white font-black text-[11px] px-1.5 py-0.5 rounded shadow-sm">
        C
      </span>
    ),
  },
  {
    id: 'bosch-rexroth',
    name: 'Bosch Rexroth',
    hubLocationUk: 'Germany / UK',
    categoryUk: 'Гідравліка 350 Bar',
    categoryEn: 'High Pressure Hydraulics',
    badgeBg: 'bg-red-500/10 border-red-500/30 text-red-400',
    badgeTextColor: 'text-red-400',
    symbol: (
      <div className="flex items-center gap-1 border border-red-500/40 rounded px-1.5 py-0.5">
        <span className="text-[10px] font-black text-slate-300">BOSCH</span>
        <span className="text-[10px] font-black text-red-500">REX</span>
      </div>
    ),
  },
  {
    id: 'carraro',
    name: 'Carraro',
    hubLocationUk: 'Italy / UK',
    categoryUk: 'Мости та редуктори',
    categoryEn: 'Axles & Transmissions',
    badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    badgeTextColor: 'text-emerald-400',
    symbol: (
      <div className="flex items-center gap-1 border border-emerald-400/40 px-1.5 py-0.5 rounded">
        <span className="w-2 h-2 rounded-full border border-emerald-400 bg-emerald-400/20" />
        <span className="text-[10px] font-bold text-emerald-300 tracking-wider">CAR</span>
      </div>
    ),
  },
  {
    id: 'fleetguard',
    name: 'Fleetguard',
    hubLocationUk: 'Global Hub',
    categoryUk: 'Фільтри важкої серії',
    categoryEn: 'Heavy Duty Filtration',
    badgeBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
    badgeTextColor: 'text-cyan-400',
    symbol: (
      <span className="font-mono font-black text-xs text-cyan-400 border border-cyan-400/40 rounded px-1.5 py-0.5">
        FG
      </span>
    ),
  },
];

export default function BrandsSection() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';

  const selectBrand = (brandName: string) => {
    const rfqSection = document.getElementById('rfq');
    if (rfqSection) {
      rfqSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="brands" className="py-24 bg-slate-950 text-white relative border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Заголовок */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold mb-4">
            <Factory className="w-3.5 h-3.5 text-red-500" />
            <span>{isUk ? 'Прямі постачальники та заводи' : 'Direct UK & Global Hubs'}</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            {isUk ? (
              <>
                Бренди, з якими ми <span className="text-red-500">працюємо щодня</span>
              </>
            ) : (
              <>
                OEM Brands We <span className="text-red-500">Supply Daily</span>
              </>
            )}
          </h2>

          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            {isUk
              ? 'Прямі контракти з дистриб\'юторами в Англії. Натисніть на бренд для автоматичного підбору в формі розрахунку.'
              : 'Direct procurement channels with UK and European distributors. Select any brand to request a quote.'}
          </p>
        </div>

        {/* Сітка брендів 4x2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {brandsData.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => selectBrand(item.name)}
              className="w-full text-left p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all duration-300 group shadow-lg flex flex-col justify-between hover:shadow-red-500/5 cursor-pointer active:scale-[0.98]"
            >
              <div>
                {/* Верхній рядок: Локація + Емблема бренду */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[11px] font-mono text-slate-400 truncate">
                    {item.hubLocationUk}
                  </span>
                  
                  {/* Стильна мікро-емблема бренду */}
                  <div className="flex-shrink-0">
                    {item.symbol}
                  </div>
                </div>

                {/* Назва бренду */}
                <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-red-400 transition-colors tracking-tight mb-3">
                  {item.name}
                </h3>
              </div>

              {/* Роздільна лінія */}
              <div className="w-full h-[1px] bg-slate-800/80 group-hover:bg-slate-700 transition-colors my-2" />

              {/* Нижній рядок: Категорія + Стрілка */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-400 font-medium">
                  {isUk ? item.categoryUk : item.categoryEn}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
