'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  ShieldCheck, 
  ArrowRight, 
  ExternalLink, 
  CheckCircle2, 
  PackageCheck,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

interface PartCard {
  id: string;
  code: string;
  titleUk: string;
  titleEn: string;
  categoryUk: string;
  categoryEn: string;
  priceGbp: number;
  imageUrl: string;
  specs: string;
}

export default function PartsSection() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const partsList: PartCard[] = [
    {
      id: 'p1',
      code: 'P553004',
      titleUk: 'Фільтр масляний Donaldson',
      titleEn: 'Donaldson Lube Filter',
      categoryUk: 'Фільтрація',
      categoryEn: 'Filtration',
      priceGbp: 18,
      imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
      specs: 'M24x1.5 • JCB / Cummins / CAT',
    },
    {
      id: 'p2',
      code: 'P535114',
      titleUk: 'Фільтр повітряний Donaldson RadialSeal',
      titleEn: 'Donaldson Air Primary RadialSeal',
      categoryUk: 'Фільтрація',
      categoryEn: 'Filtration',
      priceGbp: 42,
      imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80',
      specs: 'Високий ресурс • Спецтехніка AG & CE',
    },
    {
      id: 'p3',
      code: 'JCB 458/20403',
      titleUk: 'Головна пара моста / шестерні диференціалу',
      titleEn: 'Crown Wheel & Pinion Axle Kit',
      categoryUk: 'Мости та КПП',
      categoryEn: 'Axles & Transmission',
      priceGbp: 340,
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      specs: 'JCB 3CX / 4CX • Гартована сталь OEM',
    },
    {
      id: 'p4',
      code: 'Carraro 149298',
      titleUk: 'Шестерня редуктора та сателіти моста Carraro',
      titleEn: 'Carraro Planetary Gear Set',
      categoryUk: 'Мости та КПП',
      categoryEn: 'Axles & Transmission',
      priceGbp: 195,
      imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80',
      specs: 'Оригінал Carraro UK Hub • Бортовий редуктор',
    },
    {
      id: 'p5',
      code: 'Perkins 26561117',
      titleUk: 'Паливний фільтр-сепаратор Perkins',
      titleEn: 'Perkins Fuel Water Separator',
      categoryUk: 'Двигуни',
      categoryEn: 'Engines',
      priceGbp: 28,
      imageUrl: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=600&q=80',
      specs: 'Двигуни серії 1104D / 1106D',
    },
    {
      id: 'p6',
      code: 'Rexroth A10VSO',
      titleUk: 'Гідронасос аксіально-поршневий',
      titleEn: 'Axial Piston Hydraulic Pump',
      categoryUk: 'Гідравліка',
      categoryEn: 'Hydraulics',
      priceGbp: 820,
      imageUrl: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&w=600&q=80',
      specs: '315 bar • Гідросистеми екскаваторів',
    },
  ];

  const handleOrderClick = (part: PartCard) => {
    // Вставляємо в інпут форми швидкого розрахунку
    const input = document.getElementById('rfq-parts-input') as HTMLInputElement | null;
    if (input) {
      input.value = `${part.code} (${isUk ? part.titleUk : part.titleEn})`;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    const rfq = document.getElementById('rfq');
    if (rfq) {
      rfq.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const categories = [
    { key: 'all', labelUk: 'Усі позиції', labelEn: 'All Parts' },
    { key: 'Фільтрація', labelUk: 'Фільтри ТО', labelEn: 'Filtration' },
    { key: 'Мости та КПП', labelUk: 'Мости та шестерні', labelEn: 'Axles & Gears' },
    { key: 'Двигуни', labelUk: 'Двигуни', labelEn: 'Engines' },
    { key: 'Гідравліка', labelUk: 'Гідравліка', labelEn: 'Hydraulics' },
  ];

  const filteredParts = selectedCategory === 'all' 
    ? partsList 
    : partsList.filter(p => p.categoryUk === selectedCategory);

  return (
    <section id="parts" className="py-24 bg-slate-900 text-white relative overflow-hidden border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Верхній блок */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs sm:text-sm font-semibold mb-4">
            <PackageCheck className="w-4 h-4 text-emerald-400" />
            <span>{isUk ? 'Прямі складські пропозиції з UK' : 'Direct UK Warehouse Stock'}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-white">
            {isUk ? (
              <>Каталог ходових позицій <span className="text-red-500">із цінами</span></>
            ) : (
              <>Fast-Moving Machinery Parts <span className="text-red-500">with UK Pricing</span></>
            )}
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            {isUk
              ? 'Реальні приклади вузлів, які ми доставляємо з Ковентрі. Натисніть «Замовити деталь», щоб отримати миттєвий фінальний рахунок.'
              : 'Verified parts shipped weekly from our Coventry facility. Click any item to request an export invoice.'}
          </p>
        </div>

        {/* Фільтр категорій */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedCategory === cat.key
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'bg-slate-950/80 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {isUk ? cat.labelUk : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Сітка карток деталей з фото та цінами */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParts.map((part) => {
            const priceUah = Math.round(part.priceGbp * 56).toLocaleString('uk-UA');

            return (
              <div
                key={part.id}
                className="bg-slate-950/90 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between group shadow-xl"
              >
                <div>
                  {/* Фото деталі */}
                  <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                    <Image
                      src={part.imageUrl}
                      alt={part.code}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-700 text-xs font-mono font-bold text-amber-400">
                      {part.code}
                    </div>
                    <div className="absolute top-3 right-3 bg-emerald-500/90 text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 shadow-md">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{isUk ? 'В наявності UK' : 'In Stock UK'}</span>
                    </div>
                  </div>

                  {/* Опис і характеристики */}
                  <div className="p-5">
                    <span className="text-[11px] font-bold text-red-500 uppercase tracking-wider block mb-1">
                      {isUk ? part.categoryUk : part.categoryEn}
                    </span>
                    <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-red-400 transition-colors">
                      {isUk ? part.titleUk : part.titleEn}
                    </h3>
                    <p className="text-xs text-slate-400 mb-4 bg-slate-900/60 p-2.5 rounded-lg border border-slate-850 font-mono">
                      {part.specs}
                    </p>
                  </div>
                </div>

                {/* Ціновий блок і кнопка дії */}
                <div className="p-5 pt-0">
                  <div className="flex items-baseline justify-between mb-4 border-t border-slate-900 pt-3">
                    <div>
                      <span className="text-xs text-slate-400 block">{isUk ? 'Орієнтовно зі складу:' : 'UK Hub Estimate:'}</span>
                      <span className="text-2xl font-black text-white">~£{part.priceGbp}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-500 block">{isUk ? 'в гривні:' : 'in UAH:'}</span>
                      <span className="text-base font-bold text-amber-400">≈ {priceUah} грн</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOrderClick(part)}
                    className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <span>{isUk ? 'Замовити цю деталь' : 'Order This Part'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
