'use client';

import React, { useState } from 'react';
import { 
  Wrench, 
  Layers, 
  Gauge, 
  Cpu, 
  ArrowUpRight, 
  Sparkles, 
  Search, 
  Flame,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/language-context';

interface PopularItem {
  oem: string;
  descUk: string;
  descEn: string;
  hot?: boolean;
}

interface BrandItem {
  name: string;
  category: 'hydraulics' | 'engines' | 'filtration' | 'undercarriage';
  originUk: string;
  originEn: string;
  taglineUk: string;
  taglineEn: string;
  badgeUk: string;
  badgeEn: string;
  bgImage: string;
  glowColor: string;
  borderHover: string;
  popularOems: PopularItem[];
}

const BRANDS: BrandItem[] = [
  {
    name: 'JCB Genuine Parts',
    category: 'undercarriage',
    originUk: 'Рочестер, Велика Британія',
    originEn: 'Rocester, United Kingdom',
    taglineUk: 'Оригінальні гідронасоси Parker, поворотні кулаки, ремкомплекти супортів, мости 3CX / 4CX',
    taglineEn: 'Genuine Parker pumps, steering knuckles, caliper repair kits, 3CX / 4CX heavy axles',
    badgeUk: 'Прямий хаб UK',
    badgeEn: 'Direct UK Hub',
    bgImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    glowColor: 'rgba(234, 179, 8, 0.25)',
    borderHover: 'group-hover:border-amber-500/70',
    popularOems: [
      { oem: '332/Y3163', descUk: 'Головний насос Parker/JCB', descEn: 'Parker Main Hydraulic Pump', hot: true },
      { oem: '20/925327', descUk: 'Насос David Brown', descEn: 'David Brown Tandem Pump', hot: true },
      { oem: '458/20403', descUk: 'Поворотний кулак моста', descEn: 'Front Axle Steering Knuckle' },
      { oem: '320/04186', descUk: 'Маслонасос Dieselmax', descEn: 'Dieselmax Engine Oil Pump' },
      { oem: '04/600786', descUk: 'Гідротрансформатор КПП', descEn: 'Torque Converter Transmission' },
      { oem: '450/10206', descUk: 'Сателіт бортової передачі', descEn: 'Planetary Gear Satellite' },
      { oem: '320/09476', descUk: 'Комплект прокладок двигуна', descEn: 'Upper Cylinder Head Gasket Kit' },
      { oem: '714/40526', descUk: 'Редукторний стартер 4.2kW', descEn: 'Heavy Duty Starter 12V 4.2kW' },
    ],
  },
  {
    name: 'Bosch Rexroth',
    category: 'hydraulics',
    originUk: 'Лор-ам-Майн, Німеччина',
    originEn: 'Lohr am Main, Germany',
    taglineUk: 'Аксіально-поршневі регульовані гідронасоси A10VSO, мотори ходу A2FE, клапани',
    taglineEn: 'Variable axial piston pumps A10VSO, track drive motors A2FE, proportional valves',
    badgeUk: 'Німецька якість',
    badgeEn: 'German Quality',
    bgImage: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    glowColor: 'rgba(59, 130, 246, 0.3)',
    borderHover: 'group-hover:border-blue-500/70',
    popularOems: [
      { oem: 'A10VSO71DFR1', descUk: 'Головний насос 71cc', descEn: 'Variable Pump 71cc DFR1', hot: true },
      { oem: 'A10VSO45DFR1', descUk: 'Насос екскаватора 45cc', descEn: 'Excavator Pump 45cc DFR1', hot: true },
      { oem: 'A4VG90EP4D1', descUk: 'Насос замкненого контуру', descEn: 'Closed Circuit Travel Pump' },
      { oem: 'A2FE107/61W', descUk: 'Гідромотор приводу гусениць', descEn: 'Plug-In Track Drive Motor' },
      { oem: 'A10VSO28DR', descUk: 'Насос мобільних кранів', descEn: 'Mobile Crane Hydraulic Pump' },
      { oem: '4WE6D6X/EG24', descUk: 'Гідророзподільник 24V', descEn: 'Directional Valve 24V DC' },
    ],
  },
  {
    name: 'Danfoss Mobile',
    category: 'hydraulics',
    originUk: 'Норборг, Данія',
    originEn: 'Nordborg, Denmark',
    taglineUk: 'Гідростатичні трансмісії, рульові дозатори OSPB, секційні блоки PVG 32',
    taglineEn: 'Hydrostatic steering units OSPB, orbital motors OMT/OMV, proportional valves',
    badgeUk: 'Скандинавський стандарт',
    badgeEn: 'Nordic Standard',
    bgImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
    glowColor: 'rgba(239, 68, 68, 0.3)',
    borderHover: 'group-hover:border-red-500/70',
    popularOems: [
      { oem: 'OSPB 160 ON', descUk: 'Орбітрек рульовий 160cc', descEn: 'Steering Orbital Unit 160cc', hot: true },
      { oem: 'OSPB 200 ON', descUk: 'Посилений гідроруль 200cc', descEn: 'Heavy Steering Unit 200cc', hot: true },
      { oem: 'OMT 250', descUk: 'Планетарний гідромотор', descEn: 'Orbital Drive Motor 250' },
      { oem: 'OMV 500', descUk: 'Високомоментний гідромотор', descEn: 'High Torque Orbital Motor' },
      { oem: 'PVG 32 157B', descUk: 'Пропорційна секція', descEn: 'Proportional Valve Section' },
      { oem: 'OMS 160', descUk: 'Гідромотор приводу бура', descEn: 'Auger Drive Motor 160' },
    ],
  },
  {
    name: 'Perkins Engines',
    category: 'engines',
    originUk: 'Пітерборо, Велика Британія',
    originEn: 'Peterborough, United Kingdom',
    taglineUk: 'Оригінальна паливна апаратура Common Rail Delphi, гільзо-поршневі групи 1104 / 404',
    taglineEn: 'Genuine Delphi Common Rail injectors, piston kits & water pumps for 1104/404 series',
    badgeUk: 'Британський завод',
    badgeEn: 'UK Engine Hub',
    bgImage: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
    glowColor: 'rgba(16, 185, 129, 0.3)',
    borderHover: 'group-hover:border-emerald-500/70',
    popularOems: [
      { oem: '2645A747', descUk: 'Форсунка Common Rail Delphi', descEn: 'Delphi Common Rail Injector', hot: true },
      { oem: 'U5MK8267', descUk: 'Поршнекомплект STD 1104C', descEn: 'Piston Kit STD 1104C/D', hot: true },
      { oem: '26561117', descUk: 'Паливний картридж сепаратора', descEn: 'Secondary Fuel Element' },
      { oem: 'T413847', descUk: 'Водяна помпа ГРМ двигуна', descEn: 'Engine Timing Water Pump' },
      { oem: '2641A203', descUk: 'Механічна паливна підкачка', descEn: 'Mechanical Lift Fuel Pump' },
      { oem: 'U5PR0062', descUk: 'Комплект шатунних вкладишів', descEn: 'Connecting Rod Bearings Kit' },
    ],
  },
  {
    name: 'Carraro Drivetech',
    category: 'undercarriage',
    originUk: 'Камподарсего, Італія',
    originEn: 'Campodarsego, Italy',
    taglineUk: 'Головні конічні пари, диференціали, касетні сальники маточин Claas, Manitou, Case',
    taglineEn: 'Crown wheel & pinion sets, planetary gears, cassette seals for Manitou & Case axles',
    badgeUk: 'Мости та редуктори',
    badgeEn: 'Axles & Drivetrain',
    bgImage: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
    glowColor: 'rgba(168, 85, 247, 0.3)',
    borderHover: 'group-hover:border-purple-500/70',
    popularOems: [
      { oem: '149298', descUk: 'Касетний сальник маточини', descEn: 'Wheel Hub Cassette Seal', hot: true },
      { oem: '047702', descUk: 'Головна конічна пара моста', descEn: 'Crown Wheel & Bevel Pinion', hot: true },
      { oem: '125196', descUk: 'Подвійна хрестовина півосі', descEn: 'Double Cardan Universal Joint' },
      { oem: '140643', descUk: 'Сателіт бортового редуктора', descEn: 'Planetary Gear Satellite' },
      { oem: '068153', descUk: 'Фрикційний диск мокрого гальма', descEn: 'Wet Brake Friction Disc' },
      { oem: '149364', descUk: 'Шворінь поворотного кулака', descEn: 'Steering Swivel Kingpin' },
    ],
  },
  {
    name: 'Caterpillar (CAT)',
    category: 'engines',
    originUk: 'Європейська мережа поставок',
    originEn: 'European Supply Network',
    taglineUk: 'Турбіни Garrett CAT, паливні помпи високого тиску HEUI/CR, розпилювачі C7.1 / C9 / C13',
    taglineEn: 'Garrett CAT turbos, fuel injection pumps HEUI/CR, nozzles C7.1 / C9 / C13',
    badgeUk: 'Тяжка техніка',
    badgeEn: 'Heavy Plant',
    bgImage: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
    glowColor: 'rgba(245, 158, 11, 0.3)',
    borderHover: 'group-hover:border-amber-400/70',
    popularOems: [
      { oem: '326-1644', descUk: 'Паливний сепаратор C9/C13', descEn: 'Primary Fuel Water Separator', hot: true },
      { oem: '10R-7675', descUk: 'Турбокомпресор C7 Reman', descEn: 'Turbocharger C7 Garrett Reman', hot: true },
      { oem: '224-3238', descUk: 'Плунжерний ТНВД дизеля', descEn: 'High Pressure Fuel Pump' },
      { oem: '1R-0716', descUk: 'Фільтр тонкої очистки 2 mkr', descEn: 'High Efficiency Fuel Filter' },
      { oem: '387-9427', descUk: 'Форсунка дизеля C7.1 Acert', descEn: 'Fuel Injector C7.1 Acert' },
      { oem: '248-5513', descUk: 'Термостат важкого двигуна', descEn: 'Engine Coolant Thermostat' },
    ],
  },
  {
    name: 'Donaldson Filtration',
    category: 'filtration',
    originUk: 'Левен, Бельгія',
    originEn: 'Leuven, Belgium',
    taglineUk: 'Оригінальні картриджі фільтрації дизеля Spin-On, блоки PowerCore для важкої техніки',
    taglineEn: 'Genuine Spin-On diesel filters, PowerCore air filtration blocks for machinery',
    badgeUk: 'Експрес-поставка',
    badgeEn: 'Fast Dispatch',
    bgImage: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80',
    glowColor: 'rgba(14, 165, 233, 0.3)',
    borderHover: 'group-hover:border-sky-500/70',
    popularOems: [
      { oem: 'P553004', descUk: 'Паливний фільтр різьбовий', descEn: 'Spin-On Fuel Filter Element', hot: true },
      { oem: 'P535114', descUk: 'Повітряний блок PowerCore', descEn: 'PowerCore Air Filter Element', hot: true },
      { oem: 'P550388', descUk: 'Масляний фільтр гідравліки', descEn: 'Hydraulic Filter Spin-On' },
      { oem: 'P550425', descUk: 'Сепаратор води в дизелі', descEn: 'Fuel / Water Separator' },
      { oem: 'DBA5024', descUk: 'Фільтр Donaldson Blue', descEn: 'Donaldson Blue Air Cleaner' },
      { oem: 'P550777', descUk: 'Картридж системи охолодження', descEn: 'Coolant Treatment Filter' },
    ],
  },
  {
    name: 'Fleetguard Cummins',
    category: 'filtration',
    originUk: 'Склади UK та Європи',
    originEn: 'UK & European Hubs',
    taglineUk: 'Фільтруючі елементи NanoNet для паливних рамп під надвисоким тиском (Stage V)',
    taglineEn: 'NanoNet media filtration for ultra-high pressure Common Rail systems (Stage V)',
    badgeUk: 'OEM Специфікація',
    badgeEn: 'OEM Standard',
    bgImage: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80',
    glowColor: 'rgba(244, 63, 94, 0.3)',
    borderHover: 'group-hover:border-rose-500/70',
    popularOems: [
      { oem: 'FS19732', descUk: 'Сепаратор з датчиком води', descEn: 'Fuel Separator with Sensor', hot: true },
      { oem: 'FK11008NN', descUk: 'Комплект NanoNet Stage V', descEn: 'NanoNet Filter Set Stage V', hot: true },
      { oem: 'LF16015', descUk: 'Масляний фільтр Cummins', descEn: 'Lube Filter Cummins Engine' },
      { oem: 'AF25627NF', descUk: 'Повітряний радіальний фільтр', descEn: 'RadialSeal Air Filter Cleaner' },
      { oem: 'WF2075', descUk: 'Фільтр охолоджуючої рідини', descEn: 'Water Service Coolant Filter' },
      { oem: 'FS1000', descUk: 'Потужний дизельний водовіддільник', descEn: 'Heavy Duty Fuel Separator' },
    ],
  },
];

export default function BrandsCatalog({ onSelectOem }: { onSelectOem: (oem: string, brandName: string) => void }) {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: isUk ? 'Всі категорії поставок' : 'All Supply Categories', icon: Layers },
    { id: 'hydraulics', name: isUk ? 'Гідравліка та мотори' : 'Hydraulics & Motors', icon: Gauge },
    { id: 'engines', name: isUk ? 'Двигуни та Common Rail' : 'Engines & Fuel Systems', icon: Cpu },
    { id: 'undercarriage', name: isUk ? 'Мости, КПП та ходова' : 'Axles, Gears & Tracks', icon: Wrench },
    { id: 'filtration', name: isUk ? 'Преміум фільтрація' : 'Industrial Filtration', icon: Sparkles },
  ];

  const filteredBrands = activeCategory === 'all' 
    ? BRANDS 
    : BRANDS.filter((b) => b.category === activeCategory);

  return (
    <section className="relative w-full py-24 px-4 sm:px-6 lg:px-8 bg-[#06090E] overflow-hidden border-t border-slate-800/80">
      <div className="absolute top-1/4 left-1/4 w-[700px] h-[350px] bg-red-600/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[300px] bg-amber-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center space-y-4 mb-14">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(239,68,68,0.2)]"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            {isUk 
              ? 'Прямі європейські склади • 0% UK VAT • Швидкий розрахунок' 
              : 'Direct European Stocks • 0% UK VAT • Fast Calculation'}
          </motion.div>
          
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {isUk ? 'Каталог найбільш ходових ' : 'Bestselling European '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-amber-200">
              {isUk ? 'OEM-вузлів' : 'OEM Assemblies'}
            </span>
          </h2>
          
          <p className="max-w-3xl mx-auto text-slate-400 text-sm sm:text-base leading-relaxed">
            {isUk
              ? 'Виберіть потрібний артикул зі списку: номер і бренд автоматично підставляться у форму калькулятора специфікації.'
              : 'Select any part number below to instantly populate the calculation form with accurate OEM pricing.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-14">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'text-white bg-gradient-to-r from-red-600 to-red-700 shadow-[0_0_25px_rgba(239,68,68,0.4)] border border-red-400/50 scale-105'
                    : 'text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {cat.name}
              </button>
            );
          })}
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredBrands.map((brand, idx) => (
              <motion.div
                key={brand.name}
                layout
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className={`group relative rounded-2xl bg-slate-900/95 border border-slate-800/80 ${brand.borderHover} p-5 flex flex-col justify-between transition-all duration-500 hover:shadow-2xl overflow-hidden hover:-translate-y-1.5`}
                style={{
                  boxShadow: `0 10px 30px -15px ${brand.glowColor}`,
                }}
              >
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                  <img 
                    src={brand.bgImage} 
                    alt={brand.name} 
                    className="w-full h-36 object-cover object-center opacity-20 group-hover:opacity-35 group-hover:scale-110 transition-all duration-700 filter brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f17]/60 via-[#0b0f17]/95 to-[#0b0f17]" />
                </div>

                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-slate-300 flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm border border-white/5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {isUk ? brand.originUk : brand.originEn}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-red-500/10 border border-red-500/20 text-red-400">
                      {isUk ? brand.badgeUk : brand.badgeEn}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white group-hover:text-red-400 transition-colors flex items-center justify-between">
                      {brand.name}
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-red-400 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {isUk ? brand.taglineUk : brand.taglineEn}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 mt-5 pt-3.5 border-t border-slate-800/80">
                  <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-amber-400" />
                      {isUk ? 'Ходові позиції:' : 'Fast-Moving OEMs:'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {isUk ? 'клік для форми' : 'click to load'}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {brand.popularOems.map((item) => (
                      <button
                        key={item.oem}
                        onClick={() => onSelectOem(item.oem, brand.name)}
                        className="group/btn w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left bg-slate-950/70 hover:bg-red-600/20 border border-slate-800 hover:border-red-500/50 transition-all duration-200 cursor-pointer active:scale-98"
                        title={isUk ? `Підставити ${item.oem} у калькулятор` : `Calculate price for ${item.oem}`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {item.hot && (
                            <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-bounce" />
                          )}
                          <span className="font-mono text-xs font-bold text-slate-200 group-hover/btn:text-white">
                            {item.oem}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 group-hover/btn:text-slate-300 truncate pl-2">
                          {isUk ? item.descUk : item.descEn}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base font-bold text-white flex items-center gap-2 justify-center md:justify-start">
                {isUk ? 'Потрібен інший вузол або крос-номер?' : 'Need another spare part or cross-reference?'}
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/10 text-amber-400 border border-amber-400/30">
                  {isUk ? 'Прямі запити' : 'Direct RFQ'}
                </span>
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-0.5">
                {isUk 
                  ? 'Підтримуємо швидкий розрахунок для Komatsu, Volvo, Liebherr, Case, New Holland, Yanmar, Dana Spicer та ZF.'
                  : 'We supply genuine components for Komatsu, Volvo, Liebherr, Case, New Holland, Yanmar, Dana Spicer & ZF.'}
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => {
              const input = document.querySelector('input[type="text"]') as HTMLInputElement;
              if (input) {
                input.focus();
                window.scrollTo({ top: input.offsetTop - 120, behavior: 'smooth' });
              }
            }}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(239,68,68,0.35)] shrink-0 cursor-pointer active:scale-95"
          >
            {isUk ? 'Ввести свій артикул' : 'Enter Custom Part No'}
          </button>
        </div>
      </div>
    </section>
  );
}
