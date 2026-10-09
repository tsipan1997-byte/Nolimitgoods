'use client';

import React, { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  PackageCheck,
  Search,
  Cog,
  Filter,
  Gauge,
  Zap,
  Layers,
  Wrench
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

interface PartCard {
  id: string;
  code: string;
  brand: string;
  titleUk: string;
  titleEn: string;
  categoryUk: string;
  categoryEn: string;
  priceGbp: number;
  type: 'filter' | 'gear' | 'pump' | 'turbo' | 'starter' | 'valve';
  specs: string;
}

export default function PartsSection() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Ровно 9 ходовых запчастей = 3 ряда по 3 карточки
  const partsList: PartCard[] = [
    // РЯД 1
    {
      id: 'p1',
      code: 'P553004',
      brand: 'Donaldson Lube',
      titleUk: 'Масляний фільтр двигуна Donaldson Spin-on',
      titleEn: 'Donaldson Engine Oil Filter Spin-on',
      categoryUk: 'Фільтри ТО',
      categoryEn: 'Filtration',
      priceGbp: 18,
      type: 'filter',
      specs: 'Різьба M24x1.5 • JCB 3CX / Cummins / CAT',
    },
    {
      id: 'p2',
      code: 'P535114',
      brand: 'Donaldson RadialSeal',
      titleUk: 'Повітряний фільтр Donaldson RadialSeal',
      titleEn: 'Donaldson Air Primary RadialSeal',
      categoryUk: 'Фільтри ТО',
      categoryEn: 'Filtration',
      priceGbp: 42,
      type: 'filter',
      specs: 'Посилена сталева сітка • JCB 3CX, 4CX, Case',
    },
    {
      id: 'p3',
      code: '332/Y3163',
      brand: 'JCB Filtration',
      titleUk: 'Гідравлічний напірний картридж JCB High-Pressure',
      titleEn: 'JCB Genuine Hydraulic Filter Element',
      categoryUk: 'Фільтри ТО',
      categoryEn: 'Filtration',
      priceGbp: 64,
      type: 'filter',
      specs: 'Тонкість 5 мікрон • Захист клапанів та розподільника',
    },

    // РЯД 2
    {
      id: 'p4',
      code: '458/20403',
      brand: 'JCB Drivetrain',
      titleUk: 'Головна пара моста JCB (Pinion & Crown Wheel)',
      titleEn: 'JCB Crown Wheel & Pinion Axle Gear Set',
      categoryUk: 'Мости та КПП',
      categoryEn: 'Axles & Transmission',
      priceGbp: 340,
      type: 'gear',
      specs: 'JCB 3CX / 4CX • 33/9 зубів • Загартована сталь 18CrNiMo',
    },
    {
      id: 'p5',
      code: '149298',
      brand: 'Carraro Drivetrain',
      titleUk: 'Планетарна шестерня бортового редуктора Carraro',
      titleEn: 'Carraro Planetary Hub Reduction Gear',
      categoryUk: 'Мости та КПП',
      categoryEn: 'Axles & Transmission',
      priceGbp: 195,
      type: 'gear',
      specs: 'Оригінал Carraro UK • Сателіти моста тракторів',
    },
    {
      id: 'p6',
      code: 'A10VSO71',
      brand: 'Bosch Rexroth',
      titleUk: 'Аксіально-поршневий гідронасос Rexroth A10VSO',
      titleEn: 'Bosch Rexroth Axial Piston Pump',
      categoryUk: 'Гідравліка',
      categoryEn: 'Hydraulics',
      priceGbp: 820,
      type: 'pump',
      specs: 'Робочий тиск 315 bar • Головний насос екскаватора',
    },

    // РЯД 3
    {
      id: 'p7',
      code: '26561117',
      brand: 'Perkins Power',
      titleUk: 'Паливний фільтр-сепаратор Perkins Eco',
      titleEn: 'Perkins Fuel Water Separator Filter',
      categoryUk: 'Двигуни',
      categoryEn: 'Engines',
      priceGbp: 28,
      type: 'filter',
      specs: 'Двигуни серії Perkins 1104D / 1106D та CAT C4.4',
    },
    {
      id: 'p8',
      code: '320/06047',
      brand: 'Garrett / JCB',
      titleUk: 'Турбокомпресор (Турбіна) JCB Dieselmax GT25',
      titleEn: 'Turbocharger JCB Dieselmax GT25',
      categoryUk: 'Двигуни',
      categoryEn: 'Engines',
      priceGbp: 480,
      type: 'turbo',
      specs: 'Оригінальний Garrett UK • Екскаватори JCB 3CX, 4CX',
    },
    {
      id: 'p9',
      code: '714/40159',
      brand: 'JCB Electrical',
      titleUk: 'Стартер редукторний 12V 4.2kW JCB Dieselmax',
      titleEn: 'Starter Motor 12V 4.2kW JCB Dieselmax',
      categoryUk: 'Двигуни',
      categoryEn: 'Engines',
      priceGbp: 165,
      type: 'starter',
      specs: '10 зубів • Надійний холодний запуск двигунів 4.4L / 4.8L',
    },
  ];

  const handleOrderClick = (part: PartCard) => {
    const partInput = document.getElementById('rfq-parts-input') as HTMLInputElement | null;
    if (partInput) {
      partInput.value = part.code;
      partInput.dispatchEvent(new Event('input', { bubbles: true }));
      partInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    const machineInput = document.getElementById('rfq-machine-input') as HTMLInputElement | null;
    if (machineInput) {
      const partName = isUk ? part.titleUk : part.titleEn;
      machineInput.value = `${part.brand} — ${partName}`;
      machineInput.dispatchEvent(new Event('input', { bubbles: true }));
      machineInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    const rfq = document.getElementById('rfq');
    if (rfq) {
      rfq.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderPartIcon = (type: PartCard['type']) => {
    switch (type) {
      case 'filter':
        return <Filter className="w-14 h-14 text-red-500/80 stroke-[1.5]" />;
      case 'gear':
        return <Cog className="w-14 h-14 text-amber-500/80 stroke-[1.5]" />;
      case 'pump':
        return <Gauge className="w-14 h-14 text-sky-400/80 stroke-[1.5]" />;
      case 'turbo':
        return <Layers className="w-14 h-14 text-orange-500/80 stroke-[1.5]" />;
      case 'starter':
        return <Zap className="w-14 h-14 text-yellow-400/80 stroke-[1.5]" />;
      default:
        return <Wrench className="w-14 h-14 text-slate-400 stroke-[1.5]" />;
    }
  };

  const categories = [
    { key: 'all', labelUk: 'Усі позиції (9)', labelEn: 'All Parts (9)' },
    { key: 'Фільтри ТО', labelUk: 'Фільтрація ТО', labelEn: 'Filtration' },
    { key: 'Мости та КПП', labelUk: 'Мости та шестерні', labelEn: 'Axles & Gears' },
    { key: 'Гідравліка', labelUk: 'Гідравліка', labelEn: 'Hydraulics' },
    { key: 'Двигуни', labelUk: 'Двигуни та турбіни', labelEn: 'Engines' },
  ];

  const filteredParts = partsList.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.categoryUk === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.titleUk.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="parts" className="py-24 bg-slate-900 text-white relative overflow-hidden border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Заголовок */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs sm:text-sm font-semibold mb-4">
            <PackageCheck className="w-4 h-4 text-emerald-400" />
            <span>{isUk ? 'Прямі складські позиції Великобританії (Ковентрі)' : 'Coventry UK Hub Inventory'}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-white">
            {isUk ? (
              <>Каталог ходових запчастин <span className="text-red-500">із цінами</span></>
            ) : (
              <>Fast-Moving Machinery Parts <span className="text-red-500">with UK Pricing</span></>
            )}
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            {isUk
              ? 'Оригінальні фільтри Donaldson, турбіни Garrett, редуктори Carraro та компоненти JCB. Натисніть «Замовити цю деталь» для миттєвого прорахунку доставки.'
              : 'Direct supply lines across the UK distribution network. Click any component to calculate landed price.'}
          </p>
        </div>

        {/* Фильтры и поиск */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.key
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : 'bg-slate-950/80 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                {isUk ? cat.labelUk : cat.labelEn}
              </button>
            ))}
          </div>

          <div className="w-full md:w-64 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isUk ? 'Пошук за кодом або назвою...' : 'Search by code...'}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Ровно 3 ряда по 3 карточки (9 деталей) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParts.map((part) => {
            const priceUah = Math.round(part.priceGbp * 56).toLocaleString('uk-UA');

            return (
              <div
                key={part.id}
                className="bg-slate-950/90 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between group shadow-xl"
              >
                <div>
                  {/* Инженерный блок чертежа детали без легковых авто и битых ссылок */}
                  <div className="relative h-44 w-full bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800/80 flex items-center justify-center p-6 overflow-hidden">
                    {/* Фоновая координатная сетка чертежа */}
                    <div 
                      className="absolute inset-0 opacity-15 pointer-events-none" 
                      style={{
                        backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
                        backgroundSize: '16px 16px'
                      }}
                    />

                    {/* Центрированная иконка-схема узла */}
                    <div className="relative z-10 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-inner group-hover:scale-110 transition-transform duration-300">
                      {renderPartIcon(part.type)}
                    </div>

                    <div className="absolute top-3 left-3 bg-slate-950/95 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-xs font-mono font-bold text-amber-400">
                      {part.code}
                    </div>
                    <div className="absolute top-3 right-3 bg-emerald-500/90 text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 shadow-md">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>UK Stock</span>
                    </div>
                  </div>

                  {/* Описание детали */}
                  <div className="p-5">
                    <span className="text-[11px] font-bold text-red-500 uppercase tracking-wider block mb-1">
                      {part.brand}
                    </span>
                    <h3 className="text-base font-bold text-white mb-2 leading-snug group-hover:text-red-400 transition-colors">
                      {isUk ? part.titleUk : part.titleEn}
                    </h3>
                    <p className="text-xs text-slate-400 bg-slate-900/80 p-2.5 rounded-lg border border-slate-850 font-mono leading-relaxed">
                      {part.specs}
                    </p>
                  </div>
                </div>

                {/* Цены и кнопка заказа */}
                <div className="p-5 pt-0">
                  <div className="flex items-baseline justify-between mb-4 border-t border-slate-900 pt-3">
                    <div>
                      <span className="text-xs text-slate-400 block">{isUk ? 'Зі складу UK:' : 'UK Hub Price:'}</span>
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
                    className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer active:scale-95"
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
