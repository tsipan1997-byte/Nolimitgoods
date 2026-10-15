'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, MapPin, Layers, Gauge, Cpu, Wrench, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/language-context';

interface PartShowcaseItem {
  id: string;
  nameUk: string;
  nameEn: string;
  oem: string;
  brand: string;
  originUk: string;
  originEn: string;
  category: 'hydraulics' | 'undercarriage' | 'engines' | 'filtration';
  image: string;
  popularOems: string[];
}

// 1. Головна вітрина (6 топових вузлів)
const SHOWCASE_FEATURED: PartShowcaseItem[] = [
  {
    id: 'jcb-pump',
    nameUk: 'Головний аксіально-поршневий насос JCB',
    nameEn: 'JCB Parker Main Hydraulic Pump',
    oem: '332/Y3163',
    brand: 'JCB Genuine',
    originUk: 'Рочестер, Велика Британія',
    originEn: 'Rocester, UK',
    category: 'hydraulics',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=700&q=80',
    popularOems: ['332/Y3163', '20/925327', '320/04186', '04/600786'],
  },
  {
    id: 'carraro-axle',
    nameUk: 'Тяжкий передній міст у зборі Carraro',
    nameEn: 'Carraro Heavy Duty Axle Assembly',
    oem: '149298',
    brand: 'Carraro Drivetech',
    originUk: 'Камподарсего, Італія',
    originEn: 'Campodarsego, Italy',
    category: 'undercarriage',
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=700&q=80',
    popularOems: ['149298', '047702', '125196', '140643'],
  },
  {
    id: 'rexroth-pump',
    nameUk: 'Регульований гідронасос Bosch Rexroth A10VSO',
    nameEn: 'Bosch Rexroth Variable Pump A10VSO',
    oem: 'A10VSO71DFR1',
    brand: 'Bosch Rexroth',
    originUk: 'Лор-ам-Майн, Німеччина',
    originEn: 'Lohr am Main, Germany',
    category: 'hydraulics',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=700&q=80',
    popularOems: ['A10VSO71DFR1', 'A10VSO45DFR1', 'A4VG90EP4D1', 'A2FE107/61W'],
  },
  {
    id: 'perkins-cr',
    nameUk: 'Паливні форсунки Perkins Common Rail Delphi',
    nameEn: 'Perkins Delphi Common Rail Injectors',
    oem: '2645A747',
    brand: 'Perkins Engines',
    originUk: 'Пітерборо, Велика Британія',
    originEn: 'Peterborough, UK',
    category: 'engines',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=700&q=80',
    popularOems: ['2645A747', 'U5MK8267', 'T413847', '2641A203'],
  },
  {
    id: 'cat-turbo',
    nameUk: 'Турбокомпресор Caterpillar Garrett C7/C9',
    nameEn: 'Caterpillar Garrett Turbocharger C7/C9',
    oem: '10R-7675',
    brand: 'Caterpillar (CAT)',
    originUk: 'Європейський хаб поставок',
    originEn: 'European Hub',
    category: 'engines',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=700&q=80',
    popularOems: ['10R-7675', '326-1644', '224-3238', '1R-0716'],
  },
  {
    id: 'donaldson-filter',
    nameUk: 'Промислові сепаратори палива Donaldson',
    nameEn: 'Donaldson Fuel Filtration System',
    oem: 'P553004',
    brand: 'Donaldson Filtration',
    originUk: 'Левен, Бельгія',
    originEn: 'Leuven, Belgium',
    category: 'filtration',
    image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=700&q=80',
    popularOems: ['P553004', 'P535114', 'P550388', 'DBA5024'],
  },
];

// 2. Підгрупи (рівно по 4 представники на кожну сферу)
const SUBGROUP_PARTS: PartShowcaseItem[] = [
  // ФІЛЬТРАЦІЯ (4 бренди)
  {
    id: 'filt-donaldson',
    nameUk: 'Donaldson: Повітряні блоки PowerCore & Spin-On',
    nameEn: 'Donaldson: PowerCore & Spin-On Filtration',
    oem: 'P535114',
    brand: 'Donaldson Filtration',
    originUk: 'Левен, Бельгія',
    originEn: 'Leuven, Belgium',
    category: 'filtration',
    image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=700&q=80',
    popularOems: ['P553004', 'P535114', 'P550388', 'P550425'],
  },
  {
    id: 'filt-fleetguard',
    nameUk: 'Fleetguard: NanoNet фільтри високого тиску Cummins',
    nameEn: 'Fleetguard Cummins: NanoNet Stage V Filtration',
    oem: 'FS19732',
    brand: 'Fleetguard Cummins',
    originUk: 'Склади UK та Європи',
    originEn: 'UK & European Hubs',
    category: 'filtration',
    image: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=700&q=80',
    popularOems: ['FS19732', 'FK11008NN', 'LF16015', 'AF25627NF'],
  },
  {
    id: 'filt-mann',
    nameUk: 'Mann-Filter: Промислова гідравліка та масляна очистка',
    nameEn: 'Mann-Filter: Industrial Lube & Hydraulic Media',
    oem: 'WD13145',
    brand: 'Mann-Filter Hummel',
    originUk: 'Людвігсбург, Німеччина',
    originEn: 'Ludwigsburg, Germany',
    category: 'filtration',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=700&q=80',
    popularOems: ['WD13145', 'WK950/21', 'HD1047', 'C25710'],
  },
  {
    id: 'filt-pall',
    nameUk: 'Pall Corporation: Надвисока прецизійна фільтрація',
    nameEn: 'Pall Corporation: Ultra-Precision Core Filters',
    oem: 'HC9600FKS16H',
    brand: 'Pall Industrial',
    originUk: 'Портсмут, Велика Британія',
    originEn: 'Portsmouth, UK',
    category: 'filtration',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=700&q=80',
    popularOems: ['HC9600FKS16H', 'UE319AS20H', 'HC8314FKN39H', 'HC9021FDT8Z'],
  },

  // ДВИГУНИ (4 бренди)
  {
    id: 'eng-perkins',
    nameUk: 'Perkins Engines: Поршнекомплекти, форсунки, помпи',
    nameEn: 'Perkins: Pistons, Delphi Injectors & Pumps',
    oem: 'U5MK8267',
    brand: 'Perkins UK',
    originUk: 'Пітерборо, Велика Британія',
    originEn: 'Peterborough, UK',
    category: 'engines',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=700&q=80',
    popularOems: ['2645A747', 'U5MK8267', 'T413847', 'U5PR0062'],
  },
  {
    id: 'eng-cat',
    nameUk: 'Caterpillar (CAT): Плунжерні ТНВД, турбіни та ГРМ',
    nameEn: 'Caterpillar: High-Pressure Fuel Pumps & Turbos',
    oem: '224-3238',
    brand: 'CAT Heavy Power',
    originUk: 'Дистрибуція ЄС та UK',
    originEn: 'EU & UK Distribution',
    category: 'engines',
    image: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=700&q=80',
    popularOems: ['10R-7675', '326-1644', '224-3238', '387-9427'],
  },
  {
    id: 'eng-cummins',
    nameUk: 'Cummins: Паливні модулі ISB/QSB, датчики тиску',
    nameEn: 'Cummins: ISB/QSB Fuel Injection & Electronics',
    oem: '5263262',
    brand: 'Cummins Genuine',
    originUk: 'Дарлінгтон, Велика Британія',
    originEn: 'Darlington, UK',
    category: 'engines',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=700&q=80',
    popularOems: ['5263262', '4937766', '4089744', '2872277'],
  },
  {
    id: 'eng-deutz',
    nameUk: 'Deutz AG: Гільзо-поршнева група 2011/2012/1013',
    nameEn: 'Deutz AG: Engine Liner Kits & Cylinder Heads',
    oem: '04284142',
    brand: 'Deutz AG',
    originUk: 'Кельн, Німеччина',
    originEn: 'Cologne, Germany',
    category: 'engines',
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=700&q=80',
    popularOems: ['04284142', '04287047', '02937441', '04207588'],
  },

  // ГІДРАВЛІКА (4 бренди)
  {
    id: 'hyd-rexroth',
    nameUk: 'Bosch Rexroth: Головні поршневі насоси та клапани',
    nameEn: 'Bosch Rexroth: Axial Piston Pumps & Valves',
    oem: 'A10VSO71DFR1',
    brand: 'Bosch Rexroth',
    originUk: 'Лор-ам-Майн, Німеччина',
    originEn: 'Lohr am Main, Germany',
    category: 'hydraulics',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=700&q=80',
    popularOems: ['A10VSO71DFR1', 'A10VSO45DFR1', 'A4VG90EP4D1', '4WE6D6X/EG24'],
  },
  {
    id: 'hyd-danfoss',
    nameUk: 'Danfoss: Рульові орбітроли OSPB та секції PVG 32',
    nameEn: 'Danfoss: Steering OSPB Units & Proportional PVG',
    oem: 'OSPB 160 ON',
    brand: 'Danfoss Mobile',
    originUk: 'Норборг, Данія',
    originEn: 'Nordborg, Denmark',
    category: 'hydraulics',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=700&q=80',
    popularOems: ['OSPB 160 ON', 'OSPB 200 ON', 'OMT 250', 'PVG 32 157B'],
  },
  {
    id: 'hyd-parker',
    nameUk: 'Parker Hannifin: Шестеренні та тандемні гідронасоси',
    nameEn: 'Parker Hannifin: Tandem Gear Pumps & Motors',
    oem: 'PGP511A0190',
    brand: 'Parker UK / US',
    originUk: 'Ворік, Велика Британія',
    originEn: 'Warwick, UK',
    category: 'hydraulics',
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=700&q=80',
    popularOems: ['PGP511A0190', 'F12-060-MF-IV-D', 'PV046R1K1T1', 'D1VW001CNJW'],
  },
  {
    id: 'hyd-eaton',
    nameUk: 'Eaton Vickers: Лопатеві насоси та гідророзподільники',
    nameEn: 'Eaton Vickers: Vane Pumps & Heavy Motors',
    oem: '25V21A1A22R',
    brand: 'Eaton Vickers',
    originUk: 'Хавенберг, Велика Британія',
    originEn: 'Havant, UK',
    category: 'hydraulics',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=700&q=80',
    popularOems: ['25V21A1A22R', '35V38A1A22R', 'DG4V-3-2A-M-U-H7-60', 'PVH098R'],
  },

  // МОСТИ ТА ХОДОВА (4 бренди)
  {
    id: 'und-carraro',
    nameUk: 'Carraro Drivetech: Головні пари, сателіти, шворні',
    nameEn: 'Carraro: Crown Wheel Pinions & Planetaries',
    oem: '149298',
    brand: 'Carraro Drivetech',
    originUk: 'Камподарсего, Італія',
    originEn: 'Campodarsego, Italy',
    category: 'undercarriage',
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=700&q=80',
    popularOems: ['149298', '047702', '125196', '140643'],
  },
  {
    id: 'und-zf',
    nameUk: 'ZF Friedrichshafen: Редуктори мостів та фрикціони КПП',
    nameEn: 'ZF: Axle Planetary Reducers & Clutch Packs',
    oem: '0501.216.002',
    brand: 'ZF Friedrichshafen',
    originUk: 'Фрідріхсгафен, Німеччина',
    originEn: 'Friedrichshafen, Germany',
    category: 'undercarriage',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=700&q=80',
    popularOems: ['0501.216.002', '0501.322.845', '4143.040.001', '0734.319.418'],
  },
  {
    id: 'und-spicer',
    nameUk: 'Dana Spicer: Карданні хрестовини, диференціали',
    nameEn: 'Dana Spicer: Cardan Joints & Limited Slip Diffs',
    oem: '213.12.012.01',
    brand: 'Dana Spicer',
    originUk: 'Монселіче, Італія',
    originEn: 'Monselice, Italy',
    category: 'undercarriage',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=700&q=80',
    popularOems: ['213.12.012.01', '012.052.02', '212.09.045', '311.08.019'],
  },
  {
    id: 'und-jcb',
    nameUk: 'JCB Heavy Undercarriage: Поворотні кулаки, редуктори 3CX',
    nameEn: 'JCB Undercarriage: Steering Knuckles & 3CX Planetary',
    oem: '458/20403',
    brand: 'JCB Parts UK',
    originUk: 'Рочестер, Велика Британія',
    originEn: 'Rocester, UK',
    category: 'undercarriage',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=700&q=80',
    popularOems: ['458/20403', '450/10206', '04/600786', '714/40526'],
  },
];

export default function BrandsCatalog({ onSelectOem }: { onSelectOem: (oem: string, brandName: string) => void }) {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';
  const [activeTab, setActiveTab] = useState<string>('all');

  const tabs = [
    { id: 'all', labelUk: 'Всі вузли (Топ-6)', labelEn: 'Featured (Top 6)', icon: Layers },
    { id: 'filtration', labelUk: 'Фільтрація (4 лідери)', labelEn: 'Filtration (4 Hubs)', icon: Filter },
    { id: 'engines', labelUk: 'Двигуни та CR (4 заводи)', labelEn: 'Engines & CR (4 Hubs)', icon: Cpu },
    { id: 'hydraulics', labelUk: 'Гідравліка (4 бренди)', labelEn: 'Hydraulics (4 Hubs)', icon: Gauge },
    { id: 'undercarriage', labelUk: 'Мости та КПП (4 бренди)', labelEn: 'Axles & Gears (4 Hubs)', icon: Wrench },
  ];

  const displayedList = activeTab === 'all'
    ? SHOWCASE_FEATURED
    : SUBGROUP_PARTS.filter(p => p.category === activeTab);

  return (
    <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Шапка шоуруму */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            {isUk ? 'Прямі склади Великобританії та ЄС • 0% VAT' : 'Direct UK & European Stocks • 0% VAT'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {isUk ? 'Шоурум оригінальних вузлів та брендів' : 'Showroom & OEM Parts Catalog'}
          </h2>
          <p className="max-w-2xl mx-auto text-slate-600 text-sm sm:text-base">
            {isUk 
              ? 'Оберіть групу або клікніть на каталожний номер: деталь підставиться у форму калькулятора зі спеціальною ціною експорту.'
              : 'Select any category or click an OEM code to instantly calculate dispatch costs from Coventry.'}
          </p>
        </div>

        {/* Навігація по категоріях та підгрупах */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-red-600 text-white shadow-md shadow-red-500/20 scale-102'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                {isUk ? tab.labelUk : tab.labelEn}
              </button>
            );
          })}
        </div>

        {/* Біла вітрина карток у стилі Apple */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {displayedList.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                {/* Фотографія агрегата */}
                <div className="relative w-full h-48 bg-slate-100 p-2 flex items-center justify-center overflow-hidden border-b border-slate-100">
                  <img
                    src={item.image}
                    alt={item.nameEn}
                    className="w-full h-full object-cover object-center rounded-xl group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=700&q=80';
                    }}
                  />
                  <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-lg border border-slate-200/80 shadow-xs flex items-center gap-1.5 text-[10px] font-bold text-slate-800">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>{isUk ? 'В наявності UK' : 'In Stock UK'}</span>
                  </div>
                  <div className="absolute top-2.5 right-2.5 bg-slate-900/90 text-white px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                    0% VAT
                  </div>
                </div>

                {/* Інформаційна частина картки */}
                <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-slate-500 text-[11px] mb-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{isUk ? item.originUk : item.originEn}</span>
                    </div>

                    <div className="text-[11px] font-bold text-red-600 uppercase tracking-wider mb-0.5">
                      {item.brand}
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
                      {isUk ? item.nameUk : item.nameEn}
                    </h3>
                  </div>

                  {/* Ходові коди */}
                  <div className="space-y-1 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      {isUk ? 'Ходові коди:' : 'Popular OEM:'}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {item.popularOems.map((code) => (
                        <button
                          key={code}
                          onClick={() => onSelectOem(code, item.brand)}
                          className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-red-50 text-slate-800 hover:text-red-600 font-mono text-[11px] font-bold transition-colors border border-slate-200/80 cursor-pointer"
                          title={isUk ? `Розрахувати ${code}` : `Calculate ${code}`}
                        >
                          {code}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Кнопка розрахунку */}
                  <button
                    onClick={() => onSelectOem(item.oem, item.brand)}
                    className="w-full mt-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-red-600 text-white font-bold text-[11px] tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
                  >
                    <span>{isUk ? 'Розрахувати вартість' : 'Get Quote'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
