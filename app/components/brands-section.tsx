'use client';

import React from 'react';
import { ShieldCheck, Award } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function BrandsSection() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';

  const brands = [
    { name: 'Donaldson', category: isUk ? 'Фільтрація OEM' : 'OEM Filtration', country: 'USA / UK Hub' },
    { name: 'JCB', category: isUk ? 'Спецтехніка' : 'Heavy Equipment', country: 'Rochester, UK' },
    { name: 'Caterpillar', category: isUk ? 'Будівельна техніка' : 'Construction Fleet', country: 'Global OEM' },
    { name: 'Perkins', category: isUk ? 'Дизельні двигуни' : 'Diesel Engines', country: 'Peterborough, UK' },
    { name: 'Cummins', category: isUk ? 'Паливні системи' : 'Power Systems', country: 'Daventry, UK' },
    { name: 'Bosch Rexroth', category: isUk ? 'Гідравліка' : 'Hydraulics', country: 'Germany' },
    { name: 'Carraro', category: isUk ? 'Мости та редуктори' : 'Axles & Drives', country: 'Italy' },
    { name: 'Fleetguard', category: isUk ? 'Фільтрація' : 'Filtration', country: 'Global' },
  ];

  const handleBrandSelect = (brandName: string) => {
    // 1. Записуємо бренд у поле "Модель машини"
    const modelInput = document.getElementById('rfq-machine-input') as HTMLInputElement | null;
    if (modelInput) {
      modelInput.value = brandName;
      modelInput.dispatchEvent(new Event('input', { bubbles: true }));
      modelInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // 2. Очищаємо поле "Номер запчастини", щоб клієнт вписав свій артикул
    const partInput = document.getElementById('rfq-parts-input') as HTMLInputElement | null;
    if (partInput) {
      partInput.value = '';
      partInput.dispatchEvent(new Event('input', { bubbles: true }));
      partInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // 3. Плавно скролимо до форми та ставимо фокус на введення номера
    const rfq = document.getElementById('rfq');
    if (rfq) {
      rfq.scrollIntoView({ behavior: 'smooth' });
    }
    setTimeout(() => {
      if (partInput) {
        partInput.focus();
      }
    }, 400);
  };

  return (
    <section id="brands" className="py-20 bg-slate-950 text-white relative overflow-hidden border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Заголовок */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs sm:text-sm font-semibold mb-4">
            <Award className="w-4 h-4 text-amber-400" />
            <span>{isUk ? 'Прямі постачальники та заводи' : 'Direct Manufacturers Network'}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-white">
            {isUk ? (
              <>Бренди, з якими ми <span className="text-red-500">працюємо щодня</span></>
            ) : (
              <>Core Brands <span className="text-red-500">Supplied Weekly</span></>
            )}
          </h2>
          <p className="text-slate-400 text-base max-w-2xl mx-auto">
            {isUk
              ? 'Прямі контракти з дистриб’юторами в Англії. Натисніть на бренд для автоматичного підбору в формі розрахунку.'
              : 'Direct supply lines across the UK distribution network. Click any manufacturer to request component matching.'}
          </p>
        </div>

        {/* Галерея брендів */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {brands.map((b) => (
            <div
              key={b.name}
              onClick={() => handleBrandSelect(b.name)}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-red-500/60 transition-all duration-200 flex flex-col justify-between cursor-pointer group shadow-lg hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-slate-500 group-hover:text-amber-400 transition-colors">
                    {b.country}
                  </span>
                  <ShieldCheck className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                </div>
                <h3 className="text-xl font-black text-white group-hover:text-red-400 transition-colors">
                  {b.name}
                </h3>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-850 flex items-center justify-between text-xs text-slate-400">
                <span>{b.category}</span>
                <span className="text-red-500 font-bold group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
