'use client';

import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

interface PartItem {
  brand: string;
  badge: string;
  partNumber: string;
  titleUk: string;
  titleEn: string;
  specUk: string;
  specEn: string;
  priceGbp: number;
  imageUrl: string;
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
    // Реальне фото паливного фільтра-сепаратора
    imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
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
    // Фото циліндричного повітряного фільтра спецтехніки
    imageUrl: 'https://images.unsplash.com/photo-1580983218765-f663bec07b37?auto=format&fit=crop&w=600&q=80',
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
    // Фото приводного ременя / агрегатів
    imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
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
    // Фото шестерень головної передачі / моста
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
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
    // Фото планетарної шестерні приводу
    imageUrl: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&w=600&q=80',
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
    // Фото гідравлічного насоса високого тиску
    imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80',
  },
];

function PartImageWithFallback({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-500 font-mono text-xs">
        NoLimitGoods Coventry Hub
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setError(true)}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    />
  );
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
              className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-300 flex flex-col justify-between group shadow-xl"
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

              {/* Блок з фотографією деталі */}
              <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                <PartImageWithFallback src={item.imageUrl} alt={item.partNumber} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Інформація про деталь */}
              <div className="p-5 flex-1 flex flex-col justify-between">
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
