'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

interface PartItem {
  brand: 'DONALDSON' | 'JCB' | 'CARRARO' | 'REXROTH';
  badge: string;
  partNumber: string;
  titleUk: string;
  titleEn: string;
  specUk: string;
  specEn: string;
  priceGbp: number;
}

const partsList: PartItem[] = [
  {
    brand: 'DONALDSON',
    badge: 'Bestseller',
    partNumber: 'P553004',
    titleUk: 'Фільтр паливний сепаратор',
    titleEn: 'Fuel Filter Water Separator',
    specUk: '10 Micron • High Flow',
    specEn: '10 Micron • High Flow',
    priceGbp: 18,
  },
  {
    brand: 'DONALDSON',
    badge: 'Stock UK',
    partNumber: 'P535114',
    titleUk: 'Фільтр повітряний радіальний',
    titleEn: 'Radial Air Filter',
    specUk: 'Primary Outer • Heavy Duty',
    specEn: 'Primary Outer • Heavy Duty',
    priceGbp: 42,
  },
  {
    brand: 'JCB',
    badge: 'OEM Genuine',
    partNumber: '332/Y3163',
    titleUk: 'Ремінь генератора багатоклиновий',
    titleEn: 'Alternator Poly-V Belt',
    specUk: 'JCB EcoMAX 3CX / 4CX',
    specEn: 'JCB EcoMAX 3CX / 4CX',
    priceGbp: 64,
  },
  {
    brand: 'JCB',
    badge: 'Transmission',
    partNumber: '458/20403',
    titleUk: 'Головна пара моста переднього',
    titleEn: 'Crown Wheel & Pinion',
    specUk: '13x38 Gear Ratio • JCB Axle',
    specEn: '13x38 Gear Ratio • JCB Axle',
    priceGbp: 89,
  },
  {
    brand: 'CARRARO',
    badge: 'OEM Carraro',
    partNumber: '149298',
    titleUk: 'Шестерня планетарного редуктора',
    titleEn: 'Planetary Gear Hub',
    specUk: 'Carraro 709 / 710 Axle Hub',
    specEn: 'Carraro 709 / 710 Axle Hub',
    priceGbp: 75,
  },
  {
    brand: 'REXROTH',
    badge: 'Hydraulics',
    partNumber: 'A10VSO71',
    titleUk: 'Гідравлічний аксіально-поршневий насос',
    titleEn: 'Axial Piston Hydraulic Pump',
    specUk: 'DR/31R-PPA12N00 • 350 Bar',
    specEn: 'DR/31R-PPA12N00 • 350 Bar',
    priceGbp: 890,
  },
];

// Векторні логотипи світових брендів без залежності від сторонніх сайтів
function BrandLogoSvg({ brand }: { brand: PartItem['brand'] }) {
  switch (brand) {
    case 'JCB':
      return (
        <div className="w-full h-full bg-[#FFB800] flex items-center justify-center p-6 transition-transform duration-300 group-hover:scale-105">
          <div className="bg-black text-[#FFB800] font-black tracking-tighter text-4xl px-6 py-2.5 rounded-lg border-2 border-black flex items-center justify-center shadow-lg transform -skew-x-6">
            JCB
          </div>
        </div>
      );

    case 'DONALDSON':
      return (
        <div className="w-full h-full bg-white flex flex-col items-center justify-center p-6 transition-transform duration-300 group-hover:scale-105">
          <div className="flex items-center gap-2">
            <svg className="w-9 h-9 text-[#00488D]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
            <span className="text-[#00488D] font-black text-2xl tracking-tight uppercase font-sans">
              Donaldson<span className="text-red-600 font-extrabold text-xl">.</span>
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-1">
            FILTRATION SOLUTIONS
          </span>
        </div>
      );

    case 'CARRARO':
      return (
        <div className="w-full h-full bg-slate-900 border-b border-slate-800 flex flex-col items-center justify-center p-6 transition-transform duration-300 group-hover:scale-105">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500 flex items-center justify-center">
              <div className="w-3.5 h-3.5 bg-emerald-500 rounded-sm transform rotate-45" />
            </div>
            <span className="text-white font-black text-2xl tracking-widest uppercase">
              CARRARO
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase mt-1">
            DRIVELINE SYSTEMS
          </span>
        </div>
      );

    case 'REXROTH':
      return (
        <div className="w-full h-full bg-white flex flex-col items-center justify-center p-6 transition-transform duration-300 group-hover:scale-105">
          <div className="flex items-center gap-1.5">
            <span className="text-[#002B49] font-black text-xl tracking-tight uppercase">
              BOSCH
            </span>
            <div className="h-4 w-[2px] bg-red-600 mx-1" />
            <span className="text-red-600 font-black text-xl tracking-tight uppercase">
              REXROTH
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-1">
            A BOSCH COMPANY • HYDRAULICS
          </span>
        </div>
      );

    default:
      return null;
  }
}

export default function PartsSection() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';

  const scrollToRfq = (partNumber: string) => {
    const rfqSection = document.getElementById('rfq');
    if (rfqSection) {
      rfqSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="parts" className="py-24 bg-slate-950 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-red-500 font-bold uppercase tracking-widest text-xs">
            {isUk ? 'Прямі складські запаси UK' : 'Direct UK Warehouse Stock'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mt-2 mb-4">
            {isUk ? 'Каталог деталей' : 'Genuine Spares Catalog'}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            {isUk
              ? 'Оригінальні фільтри, ремені, шестерні та гідравліка зі складу в Ковентрі з прямою доставкою в Україну.'
              : 'Original filters, belts, gears and hydraulics from Coventry hub with direct freight to Ukraine.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partsList.map((item) => (
            <div
              key={item.partNumber}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-300 flex flex-col justify-between group shadow-xl"
            >
              {/* Шапка картки */}
              <div className="p-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-900">
                <span className="font-black text-xs tracking-wider text-red-500 bg-red-950/40 border border-red-800/40 px-2.5 py-1 rounded-md">
                  {item.brand}
                </span>
                <span className="text-[11px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700/60">
                  {item.badge}
                </span>
              </div>

              {/* Вбудований векторний блок бренду (гарантовано працює завжди) */}
              <div className="relative h-44 w-full overflow-hidden flex items-center justify-center">
                <BrandLogoSvg brand={item.brand} />
              </div>

              {/* Інформація про деталь */}
              <div className="p-5 flex-1 flex flex-col justify-between bg-slate-900 border-t border-slate-800/60">
                <div>
                  <div className="text-xs font-mono font-bold text-amber-400 mb-1">
                    PN: {item.partNumber}
                  </div>
                  <h3 className="font-bold text-base text-white group-hover:text-red-400 transition-colors line-clamp-1 mb-1">
                    {isUk ? item.titleUk : item.titleEn}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                    {isUk ? item.specUk : item.specEn}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      {isUk ? 'Орієнтир ціни UK:' : 'UK Trade Est:'}
                    </span>
                    <span className="text-xl font-black text-white">
                      £{item.priceGbp}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => scrollToRfq(item.partNumber)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-900/40 border border-red-800/50 px-3.5 py-2 rounded-xl transition-all cursor-pointer active:scale-95"
                  >
                    <span>{isUk ? 'Розрахувати' : 'Quote'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
