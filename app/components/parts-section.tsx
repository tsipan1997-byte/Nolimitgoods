'use client';

import React, { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  PackageCheck,
  Search
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
  imageUrl: string;
  specs: string;
}

export default function PartsSection() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const partsList: PartCard[] = [
    {
      id: 'p1',
      code: 'P553004',
      brand: 'Donaldson OEM',
      titleUk: 'Масляний фільтр двигуна Donaldson Spin-on',
      titleEn: 'Donaldson Engine Lube Filter Spin-on',
      categoryUk: 'Фільтри ТО',
      categoryEn: 'Filtration',
      priceGbp: 18,
      imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
      specs: 'Різьба M24x1.5 • JCB 3CX / Cummins B5.9 / CAT',
    },
    {
      id: 'p2',
      code: 'P535114',
      brand: 'Donaldson RadialSeal',
      titleUk: 'Фільтр повітряний Donaldson RadialSeal Primary',
      titleEn: 'Donaldson Air Filter RadialSeal Primary',
      categoryUk: 'Фільтри ТО',
      categoryEn: 'Filtration',
      priceGbp: 42,
      imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80',
      specs: 'Посилена сталева сітка • Екскаватори JCB, Case, New Holland',
    },
    {
      id: 'p3',
      code: '458/20403',
      brand: 'JCB Drivetrain',
      titleUk: 'Головна пара моста JCB (Pinion & Crown Wheel)',
      titleEn: 'JCB Crown Wheel & Pinion Axle Gear Set',
      categoryUk: 'Мости та КПП',
      categoryEn: 'Axles & Transmission',
      priceGbp: 340,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Spiral-bevel-gear.jpg/640px-Spiral-bevel-gear.jpg',
      specs: 'JCB 3CX / 4CX • 33/9 зубів • Загартована сталь 18CrNiMo',
    },
    {
      id: 'p4',
      code: '149298',
      brand: 'Carraro Drivetrain',
      titleUk: 'Планетарна шестерня бортового редуктора Carraro',
      titleEn: 'Carraro Planetary Hub Reduction Gear',
      categoryUk: 'Мости та КПП',
      categoryEn: 'Axles & Transmission',
      priceGbp: 195,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Epicyclic_gearing.jpg/640px-Epicyclic_gearing.jpg',
      specs: 'Оригінал Carraro UK • Сателіти моста тракторів та навантажувачів',
    },
    {
      id: 'p5',
      code: '26561117',
      brand: 'Perkins Power',
      titleUk: 'Паливний фільтр-сепаратор Perkins Eco',
      titleEn: 'Perkins Genuine Fuel Water Separator Filter',
      categoryUk: 'Двигуни',
      categoryEn: 'Engines',
      priceGbp: 28,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Fuel_filter_opened.jpg/640px-Fuel_filter_opened.jpg',
      specs: 'Для дизелів серії Perkins 1104D / 1106D та CAT C4.4',
    },
    {
      id: 'p6',
      code: 'A10VSO71',
      brand: 'Bosch Rexroth',
      titleUk: 'Аксіально-поршневий гідронасос Rexroth A10VSO',
      titleEn: 'Bosch Rexroth Axial Piston Variable Pump',
      categoryUk: 'Гідравліка',
      categoryEn: 'Hydraulics',
      priceGbp: 820,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Axial_piston_pump.jpg/640px-Axial_piston_pump.jpg',
      specs: 'Тиск 315 bar • Головний насос гідросистеми екскаваторів',
    },
    {
      id: 'p7',
      code: '714/40159',
      brand: 'JCB Electrical',
      titleUk: 'Стартер редукторний 12V 4.2kW JCB Dieselmax',
      titleEn: 'Starter Motor 12V 4.2kW JCB Dieselmax',
      categoryUk: 'Двигуни',
      categoryEn: 'Engines',
      priceGbp: 165,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Starter_motor.jpg/640px-Starter_motor.jpg',
      specs: 'Посилений бендикс 10 зубів • Запуск двигунів JCB 4.4L / 4.8L',
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
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Garrett_turbocharger_cutaway.jpg/640px-Garrett_turbocharger_cutaway.jpg',
      specs: 'Оригінальний Garrett UK • Екскаватори JCB 3CX, 4CX, JS200',
    },
    {
      id: 'p9',
      code: '1U3352',
      brand: 'Caterpillar GET',
      titleUk: 'Зуб ковша екскаватора CAT J350 з пальцем і замком',
      titleEn: 'Caterpillar J350 Bucket Tooth with Pin',
      categoryUk: 'Ходова та навісне',
      categoryEn: 'Undercarriage & Wear Parts',
      priceGbp: 38,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Excavator_bucket_teeth.jpg/640px-Excavator_bucket_teeth.jpg',
      specs: 'Зносостійка лита сталь Hardox • Екскаватори CAT 320 / JCB JS220',
    },
    {
      id: 'p10',
      code: '332/Y3163',
      brand: 'JCB Filtration',
      titleUk: 'Гідравлічний напірний фільтр JCB High-Pressure',
      titleEn: 'JCB Genuine High-Pressure Hydraulic Filter',
      categoryUk: 'Фільтри ТО',
      categoryEn: 'Filtration',
      priceGbp: 64,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Hydraulic_filter_cartridge.jpg/640px-Hydraulic_filter_cartridge.jpg',
      specs: 'Тонкість фільтрації 5 мікрон • Захист клапанів та розподільника',
    },
  ];

  const handleOrderClick = (part: PartCard) => {
    // 1. Вставляємо номер запчастини
    const partInput = document.getElementById('rfq-parts-input') as HTMLInputElement | null;
    if (partInput) {
      partInput.value = part.code;
      partInput.dispatchEvent(new Event('input', { bubbles: true }));
      partInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // 2. Вставляємо марку та опис у поле "Модель машини"
    const machineInput = document.getElementById('rfq-machine-input') as HTMLInputElement | null;
    if (machineInput) {
      const partName = isUk ? part.titleUk : part.titleEn;
      machineInput.value = `${part.brand} — ${partName}`;
      machineInput.dispatchEvent(new Event('input', { bubbles: true }));
      machineInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // 3. Плавно скролимо до форми
    const rfq = document.getElementById('rfq');
    if (rfq) {
      rfq.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const categories = [
    { key: 'all', labelUk: 'Усі деталі (10)', labelEn: 'All Parts (10)' },
    { key: 'Фільтри ТО', labelUk: 'Фільтри ТО', labelEn: 'Filtration' },
    { key: 'Двигуни', labelUk: 'Двигуни й турбіни', labelEn: 'Engines' },
    { key: 'Мости та КПП', labelUk: 'Мости та шестерні', labelEn: 'Axles & Gears' },
    { key: 'Гідравліка', labelUk: 'Гідравліка', labelEn: 'Hydraulics' },
    { key: 'Ходова та навісне', labelUk: 'Зуби та навісне', labelEn: 'Wear Parts' },
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
            <span>{isUk ? 'Реальний склад у Великобританії (Ковентрі)' : 'Coventry UK Hub Inventory'}</span>
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
              ? 'Фільтрація Donaldson, турбіни Garrett, редуктори Carraro та компоненти JCB. Натисніть «Замовити цю деталь» для миттєвого прорахунку рейсу.'
              : 'Direct supply lines across the UK distribution network. Click any component to calculate landed price.'}
          </p>
        </div>

        {/* Швидкий фільтр категорій та пошук по каталогу */}
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
              placeholder={isUk ? 'Фільтр за кодом...' : 'Search by code...'}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Сітка 10 карток деталей */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredParts.map((part) => {
            const priceUah = Math.round(part.priceGbp * 56).toLocaleString('uk-UA');

            return (
              <div
                key={part.id}
                className="bg-slate-950/90 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between group shadow-xl"
              >
                <div>
                  {/* Контейнер фото деталі */}
                  <div className="relative h-44 w-full bg-slate-900 border-b border-slate-800 flex items-center justify-center p-3 overflow-hidden">
                    <img
                      src={part.imageUrl}
                      alt={`${part.brand} ${part.code}`}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-slate-950/90 backdrop-blur-md px-2.5 py-0.5 rounded-lg border border-slate-700 text-[11px] font-mono font-bold text-amber-400">
                      {part.code}
                    </div>
                    <div className="absolute top-2.5 right-2.5 bg-emerald-500/90 text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-md">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>UK Stock</span>
                    </div>
                  </div>

                  {/* Інформація про деталь */}
                  <div className="p-4">
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block mb-1">
                      {part.brand}
                    </span>
                    <h3 className="text-sm font-bold text-white mb-2 leading-snug line-clamp-2 group-hover:text-red-400 transition-colors">
                      {isUk ? part.titleUk : part.titleEn}
                    </h3>
                    <p className="text-[11px] text-slate-400 bg-slate-900/80 p-2 rounded-lg border border-slate-850 font-mono leading-relaxed">
                      {part.specs}
                    </p>
                  </div>
                </div>

                {/* Ціна і кнопка замовлення в 1 клік */}
                <div className="p-4 pt-0">
                  <div className="flex items-baseline justify-between mb-3 border-t border-slate-900 pt-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block">{isUk ? 'Зі складу UK:' : 'UK Hub:'}</span>
                      <span className="text-xl font-black text-white">~£{part.priceGbp}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">{isUk ? 'в гривні:' : 'in UAH:'}</span>
                      <span className="text-xs font-bold text-amber-400">≈ {priceUah} грн</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOrderClick(part)}
                    className="w-full py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer active:scale-95"
                  >
                    <span>{isUk ? 'Замовити цю деталь' : 'Order Part'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
