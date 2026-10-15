'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, MapPin } from 'lucide-react';
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

const SHOWCASE_PARTS: PartShowcaseItem[] = [
  {
    id: 'jcb-pump',
    nameUk: 'Головний гідронасос JCB Parker',
    nameEn: 'JCB Parker Main Hydraulic Pump',
    oem: '332/Y3163',
    brand: 'JCB Genuine',
    originUk: 'Рочестер, Велика Британія',
    originEn: 'Rocester, UK',
    category: 'hydraulics',
    // Студійне фото гідравлічного шестеренного насоса
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=700&q=80',
    popularOems: ['332/Y3163', '20/925327', '320/04186'],
  },
  {
    id: 'carraro-axle',
    nameUk: 'Передній міст та редуктор Carraro',
    nameEn: 'Carraro Front Axle & Differential',
    oem: '149298',
    brand: 'Carraro Drivetech',
    originUk: 'Камподарсего, Італія',
    originEn: 'Campodarsego, Italy',
    category: 'undercarriage',
    // Студійний важкий міст / трансмісійний вузол
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=700&q=80',
    popularOems: ['149298', '047702', '125196'],
  },
  {
    id: 'rexroth-pump',
    nameUk: 'Гідронасос регульований Bosch Rexroth',
    nameEn: 'Bosch Rexroth Axial Piston Pump',
    oem: 'A10VSO71DFR1',
    brand: 'Bosch Rexroth',
    originUk: 'Лор-ам-Майн, Німеччина',
    originEn: 'Lohr am Main, Germany',
    category: 'hydraulics',
    // Високоточний аксіально-поршневий промисловий насос
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=700&q=80',
    popularOems: ['A10VSO71DFR1', 'A10VSO45DFR1', 'A4VG90EP4D1'],
  },
  {
    id: 'perkins-cr',
    nameUk: 'Паливна форсунка Perkins Common Rail',
    nameEn: 'Perkins Common Rail Delphi Injector',
    oem: '2645A747',
    brand: 'Perkins Engines',
    originUk: 'Пітерборо, Велика Британія',
    originEn: 'Peterborough, UK',
    category: 'engines',
    // Дизельний блок / високоточна форсунка
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=700&q=80',
    popularOems: ['2645A747', 'U5MK8267', 'T413847'],
  },
  {
    id: 'cat-turbo',
    nameUk: 'Турбокомпресор Caterpillar C7 Acert',
    nameEn: 'Caterpillar C7 Acert Turbocharger',
    oem: '10R-7675',
    brand: 'Caterpillar (CAT)',
    originUk: 'Європейський дистрибʼютор',
    originEn: 'European Hub',
    category: 'engines',
    // Турбіна / металевий компресор
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=700&q=80',
    popularOems: ['10R-7675', '326-1644', '224-3238'],
  },
  {
    id: 'donaldson-filter',
    nameUk: 'Блок фільтрації дизеля Donaldson',
    nameEn: 'Donaldson Heavy Fuel Filtration Unit',
    oem: 'P553004',
    brand: 'Donaldson Filtration',
    originUk: 'Левен, Бельгія',
    originEn: 'Leuven, Belgium',
    category: 'filtration',
    // Промисловий фільтр / сепаратор
    image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=700&q=80',
    popularOems: ['P553004', 'P535114', 'P550388'],
  },
];

export default function BrandsCatalog({ onSelectOem }: { onSelectOem: (oem: string, brandName: string) => void }) {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';
  const [activeTab, setActiveTab] = useState<string>('all');

  const filteredParts = activeTab === 'all' 
    ? SHOWCASE_PARTS 
    : SHOWCASE_PARTS.filter(p => p.category === activeTab);

  return (
    <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Заголовок шоуруму */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            {isUk ? 'Прямі відвантаження з Ковентрі (UK)' : 'Direct UK Dispatches (Coventry Hub)'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {isUk ? 'Шоурум та каталог запчастин' : 'Showroom & Parts Showcase'}
          </h2>
          <p className="max-w-2xl mx-auto text-slate-600 text-sm sm:text-base">
            {isUk 
              ? 'Оберіть потрібний вузол або артикул для миттєвого заповнення форми калькулятора зі спеціальною ціною експорту 0% VAT.'
              : 'Select any machinery component below to instantly populate the calculation form with zero-rated 0% UK export status.'}
          </p>
        </div>

        {/* Фільтри категорій */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { id: 'all', labelUk: 'Всі вузли', labelEn: 'All Components' },
            { id: 'hydraulics', labelUk: 'Гідравліка', labelEn: 'Hydraulics' },
            { id: 'undercarriage', labelUk: 'Мости та редуктори', labelEn: 'Axles & Gears' },
            { id: 'engines', labelUk: 'Двигуни та CR', labelEn: 'Engines & Fuel' },
            { id: 'filtration', labelUk: 'Фільтри', labelEn: 'Filtration' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {isUk ? tab.labelUk : tab.labelEn}
            </button>
          ))}
        </div>

        {/* Світла сітка карток із фото деталей */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredParts.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                {/* Фотографія агрегата */}
                <div className="relative w-full h-56 bg-slate-100 p-2 flex items-center justify-center overflow-hidden border-b border-slate-100">
                  <img
                    src={item.image}
                    alt={item.nameEn}
                    className="w-full h-full object-cover object-center rounded-xl group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // Якщо фото не завантажилось, підставляємо надійний технічний бекап
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=700&q=80';
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200/80 shadow-xs flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{isUk ? 'В наявності UK' : 'In Stock UK'}</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-slate-900/90 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                    0% VAT
                  </div>
                </div>

                {/* Інформація */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{isUk ? item.originUk : item.originEn}</span>
                      <span>•</span>
                      <strong className="text-slate-800">{item.brand}</strong>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-red-600 transition-colors">
                      {isUk ? item.nameUk : item.nameEn}
                    </h3>
                  </div>

                  {/* Кнопки ходових номерів */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      {isUk ? 'Ходові коди вузла:' : 'Popular OEM codes:'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.popularOems.map((code) => (
                        <button
                          key={code}
                          onClick={() => onSelectOem(code, item.brand)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-800 hover:text-red-600 font-mono text-xs font-bold transition-colors border border-slate-200/80 cursor-pointer"
                          title={isUk ? `Вставити ${code}` : `Insert ${code}`}
                        >
                          {code}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Кнопка швидкого підбору */}
                  <button
                    onClick={() => onSelectOem(item.oem, item.brand)}
                    className="w-full mt-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-red-600 text-white font-bold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
                  >
                    <span>{isUk ? 'Розрахувати цей вузол' : 'Get Quote for Part'}</span>
                    <ArrowRight className="w-4 h-4" />
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
