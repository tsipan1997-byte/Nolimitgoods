'use client';

import React from 'react';
import { ArrowUpRight, Check, Package, Cpu, Gauge, Disc, Cog } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function PartsSection() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';

  const parts = [
    {
      code: 'P553004',
      brand: 'Donaldson',
      nameUk: 'Фільтр паливний сепаратор',
      nameEn: 'Fuel Filter Water Separator',
      specs: '10 Micron • High Flow',
      price: '£18',
      leadTime: 'В наявності UK',
      icon: <Disc className="w-12 h-12 text-red-500" />,
      badge: 'Bestseller',
    },
    {
      code: 'P535114',
      brand: 'Donaldson',
      nameUk: 'Фільтр повітряний радіальний',
      nameEn: 'RadialSeal Air Filter',
      specs: 'Primary Outer • Heavy Duty',
      price: '£42',
      leadTime: 'В наявності UK',
      icon: <Package className="w-12 h-12 text-amber-500" />,
      badge: 'Stock UK',
    },
    {
      code: '332/Y3163',
      brand: 'JCB',
      nameUk: 'Ремінь генератора багатоклиновий',
      nameEn: 'Serpentine Fan Belt',
      specs: 'JCB EcoMAX 3CX / 4CX',
      price: '£64',
      leadTime: 'В наявності UK',
      icon: <Cog className="w-12 h-12 text-amber-400" />,
      badge: 'OEM Genuine',
    },
    {
      code: '458/20403',
      brand: 'JCB',
      nameUk: 'Головна пара моста переднього',
      nameEn: 'Crown Wheel & Pinion',
      specs: '13x38 Gear Ratio • JCB Axle',
      price: '£340',
      leadTime: 'В наявності UK',
      icon: <Gauge className="w-12 h-12 text-sky-400" />,
      badge: 'Transmission',
    },
    {
      code: '149298',
      brand: 'Carraro',
      nameUk: 'Шестерня планетарного редуктора',
      nameEn: 'Planetary Gear Wheel',
      specs: 'Carraro 709 / 710 Axle Hub',
      price: '£195',
      leadTime: 'В наявності UK',
      icon: <Cog className="w-12 h-12 text-emerald-400" />,
      badge: 'OEM Carraro',
    },
    {
      code: 'A10VSO71',
      brand: 'Rexroth',
      nameUk: 'Гідравлічний аксіально-поршневий насос',
      nameEn: 'Axial Piston Variable Pump',
      specs: 'DR/31R-PPA12N00 • 350 Bar',
      price: '£820',
      leadTime: '3-4 дні UK',
      icon: <Cpu className="w-12 h-12 text-purple-400" />,
      badge: 'Hydraulics',
    },
    {
      code: '26561117',
      brand: 'Perkins',
      nameUk: 'Фільтр тонкої очистки палива',
      nameEn: 'Secondary Fuel Filter',
      specs: 'Perkins 1104D / 1106C Series',
      price: '£28',
      leadTime: 'В наявності UK',
      icon: <Disc className="w-12 h-12 text-red-400" />,
      badge: 'Perkins OEM',
    },
    {
      code: '320/06047',
      brand: 'JCB',
      nameUk: 'Стартер двигуна 12V 4.2kW',
      nameEn: 'Starter Motor 12V',
      specs: 'EcoMAX Engine 55kW-81kW',
      price: '£480',
      leadTime: 'В наявності UK',
      icon: <Cpu className="w-12 h-12 text-orange-400" />,
      badge: 'Electrical',
    },
    {
      code: '714/40159',
      brand: 'JCB',
      nameUk: 'Генератор 14V 95A',
      nameEn: 'Alternator 14V 95A',
      specs: 'Direct Replacement JCB JS / 3CX',
      price: '£165',
      leadTime: 'В наявності UK',
      icon: <Cpu className="w-12 h-12 text-cyan-400" />,
      badge: 'Electrical',
    },
  ];

  const selectPart = (brand: string, code: string) => {
    const partInput = document.getElementById('rfq-parts-input') as HTMLInputElement | null;
    const machineInput = document.getElementById('rfq-machine-input') as HTMLInputElement | null;

    if (partInput) {
      partInput.value = code;
      partInput.dispatchEvent(new Event('input', { bubbles: true }));
      partInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
    if (machineInput) {
      machineInput.value = brand;
      machineInput.dispatchEvent(new Event('input', { bubbles: true }));
      machineInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    const rfq = document.getElementById('rfq');
    if (rfq) {
      rfq.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="parts" className="py-24 bg-slate-950 text-white relative border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs sm:text-sm font-semibold mb-4">
            <Package className="w-4 h-4 text-red-500" />
            <span>{isUk ? 'Ходові складські позиції Великобританії' : 'UK In-Stock Components'}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            {isUk ? 'Каталог оригінальних запчастин' : 'Genuine Parts Catalog'}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            {isUk
              ? 'Натисніть на будь-яку деталь, щоб автоматично розрахувати вартість експрес-доставки Nova Post та отримати Proforma Invoice.'
              : 'Click any component to calculate live Nova Post freight rates and export quotation.'}
          </p>
        </div>

        {/* Рівна сітка 3х3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parts.map((p) => (
            <div
              key={p.code}
              onClick={() => selectPart(p.brand, p.code)}
              className="group bg-slate-900/80 border border-slate-800 hover:border-red-500/80 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-red-950/30 cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-28 h-28 bg-red-600/5 rounded-bl-full pointer-events-none group-hover:bg-red-600/10 transition-colors" />

              <div>
                {/* Бейдж та бренд */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-black uppercase tracking-wider text-red-400 bg-red-950/60 border border-red-900/60 px-2.5 py-1 rounded-md">
                    {p.brand}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-full">
                    {p.badge}
                  </span>
                </div>

                {/* Графічний блок вузла (SVG — вантажиться завжди без збоїв) */}
                <div className="h-32 rounded-xl bg-slate-950/90 border border-slate-800/80 flex items-center justify-center mb-5 group-hover:scale-[1.02] transition-transform">
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                    {p.icon}
                  </div>
                </div>

                {/* Код та назва */}
                <div className="text-xs font-mono font-bold text-amber-400 mb-1">
                  PN: {p.code}
                </div>
                <h3 className="font-bold text-white text-base leading-snug mb-2 group-hover:text-red-400 transition-colors">
                  {isUk ? p.nameUk : p.nameEn}
                </h3>
                <p className="text-xs text-slate-400 mb-4 line-clamp-1">
                  {p.specs}
                </p>
              </div>

              {/* Ціна та дія */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">Орієнтир ціни UK:</span>
                  <span className="text-xl font-black text-white">{p.price}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 group-hover:text-red-300">
                  <span>{isUk ? 'Розрахувати' : 'Quote'}</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
