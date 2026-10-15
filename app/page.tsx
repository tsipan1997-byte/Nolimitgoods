'use client';

import React, { useState } from 'react';
import Header from './components/header';
import HeroSection from './components/hero-section';
import PartsSearchWidget from './components/parts-search-widget';
import RFQSection from './components/rfq-section';
import DeliveriesSection from './components/deliveries-section';
import PartsSection from './components/parts-section';
import Footer from './components/footer';
import FloatingContact from './components/floating-contact';
import { 
  ShieldCheck, 
  Building2, 
  MapPin, 
  Copy, 
  Check, 
  FileCheck, 
  Phone, 
  Mail,
  Wrench, 
  Layers, 
  Gauge, 
  Cpu, 
  ArrowUpRight, 
  Sparkles,
  Search,
  Flame,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/language-context';

/* =========================================================================
   РОЗШИРЕНИЙ ДИЗАЙН-КАТАЛОГ З РЕАЛЬНИМИ ФОТО ТА БЕСТСЕЛЕРАМИ
   ========================================================================= */

interface BrandCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface BrandItem {
  name: string;
  category: 'hydraulics' | 'engines' | 'filtration' | 'undercarriage';
  origin: string;
  tagline: string;
  badge: string;
  bgImage: string;
  glowColor: string;
  borderHover: string;
  popularOems: { oem: string; desc: string; hot?: boolean }[];
}

const CATEGORIES: BrandCategory[] = [
  { id: 'all', name: 'Всі напрямки (50 хабів)', icon: Layers },
  { id: 'hydraulics', name: 'Гідравліка та мотори', icon: Gauge },
  { id: 'engines', name: 'Двигуни та Common Rail', icon: Cpu },
  { id: 'undercarriage', name: 'Мости, КПП та ходова', icon: Wrench },
  { id: 'filtration', name: 'Преміум фільтрація', icon: Sparkles },
];

const BRANDS: BrandItem[] = [
  {
    name: 'JCB Genuine Parts',
    category: 'undercarriage',
    origin: 'Rocester, UK',
    tagline: 'Гідронасоси, бортові передачі, поворотні кулаки, ремкомплекти супортів 3CX / 4CX',
    badge: 'Прямий склад UK',
    bgImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    glowColor: 'rgba(234, 179, 8, 0.25)',
    borderHover: 'group-hover:border-amber-500/70',
    popularOems: [
      { oem: '332/Y3163', desc: 'Насос Parker/JCB', hot: true },
      { oem: '20/925327', desc: 'Насос David Brown', hot: true },
      { oem: '458/20403', desc: 'Поворотний кулак' },
      { oem: '320/04186', desc: 'Маслонасос Dieselmax' },
      { oem: '04/600786', desc: 'Гідротрансформатор' },
      { oem: '450/10206', desc: 'Сателіт бортової' },
      { oem: '320/09476', desc: 'Прокладки двигуна' },
      { oem: '714/40526', desc: 'Стартер 4.2kW' },
    ],
  },
  {
    name: 'Bosch Rexroth',
    category: 'hydraulics',
    origin: 'Lohr am Main, Germany',
    tagline: 'Аксіально-поршневі регульовані гідронасоси серій A10VSO, мотори ходу A2FE, клапани',
    badge: 'Висока маржа',
    bgImage: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    glowColor: 'rgba(59, 130, 246, 0.3)',
    borderHover: 'group-hover:border-blue-500/70',
    popularOems: [
      { oem: 'A10VSO71DFR1', desc: 'Головний насос 71cc', hot: true },
      { oem: 'A10VSO45DFR1', desc: 'Насос 45cc екскаватора', hot: true },
      { oem: 'A4VG90EP4D1', desc: 'Насос замкненого ходу' },
      { oem: 'A2FE107/61W', desc: 'Гідромотор гусениць' },
      { oem: 'A10VSO28DR', desc: 'Насос пресів та кранів' },
      { oem: '4WE6D6X/EG24', desc: 'Гідророзподільник 24V' },
    ],
  },
  {
    name: 'Danfoss Mobile',
    category: 'hydraulics',
    origin: 'Nordborg, Denmark',
    tagline: 'Гідростатичні трансмісії, рульові дозатори OSPB, секційні блоки PVG 32',
    badge: 'Nordic Quality',
    bgImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
    glowColor: 'rgba(239, 68, 68, 0.3)',
    borderHover: 'group-hover:border-red-500/70',
    popularOems: [
      { oem: 'OSPB 160 ON', desc: 'Орбітрек рульовий', hot: true },
      { oem: 'OSPB 200 ON', desc: 'Посилений гідроруль', hot: true },
      { oem: 'OMT 250', desc: 'Планетарний гідромотор' },
      { oem: 'OMV 500', desc: 'Низькообертовий мотор' },
      { oem: 'PVG 32 157B', desc: 'Пропорційна секція' },
      { oem: 'OMS 160', desc: 'Привід каретки бура' },
    ],
  },
  {
    name: 'Perkins Engines',
    category: 'engines',
    origin: 'Peterborough, UK',
    tagline: 'Оригінальна паливна апаратура Common Rail Delphi, гільзо-поршневі групи 1104 / 404',
    badge: 'UK Master Hub',
    bgImage: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
    glowColor: 'rgba(16, 185, 129, 0.3)',
    borderHover: 'group-hover:border-emerald-500/70',
    popularOems: [
      { oem: '2645A747', desc: 'Форсунка Common Rail', hot: true },
      { oem: 'U5MK8267', desc: 'Поршнекомплект STD', hot: true },
      { oem: '26561117', desc: 'Паливний картридж' },
      { oem: 'T413847', desc: 'Водяна помпа ГРМ' },
      { oem: '2641A203', desc: 'Паливна підкачка' },
      { oem: 'U5PR0062', desc: 'Вкладиші шатунні' },
    ],
  },
  {
    name: 'Carraro Drivetech',
    category: 'undercarriage',
    origin: 'Campodarsego, Italy',
    tagline: 'Головні пари конічних передач, диференціали, касетні сальники мостів Claas, Manitou, Case',
    badge: 'Трансмісії та Мости',
    bgImage: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
    glowColor: 'rgba(168, 85, 247, 0.3)',
    borderHover: 'group-hover:border-purple-500/70',
    popularOems: [
      { oem: '149298', desc: 'Касетний сальник маточини', hot: true },
      { oem: '047702', desc: 'Конічна пара моста', hot: true },
      { oem: '125196', desc: 'Подвійна хрестовина півосі' },
      { oem: '140643', desc: 'Сателіт бортової передачі' },
      { oem: '068153', desc: 'Фрикційний диск гальма' },
      { oem: '149364', desc: 'Шворінь поворотного кулака' },
    ],
  },
  {
    name: 'Caterpillar (CAT)',
    category: 'engines',
    origin: 'Europe Trade Network',
    tagline: 'Турбіни Garrett CAT, насоси високого тиску HEUI/Common Rail, розпилювачі C7.1 / C9 / C13',
    badge: 'Heavy Plant',
    bgImage: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
    glowColor: 'rgba(245, 158, 11, 0.3)',
    borderHover: 'group-hover:border-amber-400/70',
    popularOems: [
      { oem: '326-1644', desc: 'Паливний сепаратор C9', hot: true },
      { oem: '10R-7675', desc: 'Турбокомпресор C7 Reman', hot: true },
      { oem: '224-3238', desc: 'Плунжерний ТНВД CAT' },
      { oem: '1R-0716', desc: 'Фільтр тонкої очистки' },
      { oem: '387-9427', desc: 'Форсунка C7.1 Acert' },
      { oem: '248-5513', desc: 'Термостат важкого дизеля' },
    ],
  },
  {
    name: 'Donaldson Filtration',
    category: 'filtration',
    origin: 'Leuven, Belgium',
    tagline: 'Оригінальні картриджі фільтрації палива Spin-On, блоки PowerCore для кар’єрної та агротехніки',
    badge: 'Євросклад 24h',
    bgImage: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80',
    glowColor: 'rgba(14, 165, 233, 0.3)',
    borderHover: 'group-hover:border-sky-500/70',
    popularOems: [
      { oem: 'P553004', desc: 'Паливний фільтр різьбовий', hot: true },
      { oem: 'P535114', desc: 'Повітряний блок PowerCore', hot: true },
      { oem: 'P550388', desc: 'Масляний фільтр гідравліки' },
      { oem: 'P550425', desc: 'Сепаратор води в дизелі' },
      { oem: 'DBA5024', desc: 'Повітряний фільтр Donaldson Blue' },
      { oem: 'P550777', desc: 'Картридж системи охолодження' },
    ],
  },
  {
    name: 'Fleetguard Cummins',
    category: 'filtration',
    origin: 'UK & EU Stocks',
    tagline: 'Патентовані фільтруючі елементи NanoNet для паливних рамп під надвисоким тиском (Stage V)',
    badge: 'OEM Специфікація',
    bgImage: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80',
    glowColor: 'rgba(244, 63, 94, 0.3)',
    borderHover: 'group-hover:border-rose-500/70',
    popularOems: [
      { oem: 'FS19732', desc: 'Паливний сепаратор з датчиком', hot: true },
      { oem: 'FK11008NN', desc: 'Комплект NanoNet ISB', hot: true },
      { oem: 'LF16015', desc: 'Масляний фільтр Cummins' },
      { oem: 'AF25627NF', desc: 'Повітряний радіальний фільтр' },
      { oem: 'WF2075', desc: 'Фільтр охолоджуючої рідини' },
      { oem: 'FS1000', desc: 'Потужний дизельний водовіддільник' },
    ],
  },
];

function BrandsCatalogInline({ onSelectOem }: { onSelectOem: (oem: string, brandName: string) => void }) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredBrands = activeCategory === 'all' 
    ? BRANDS 
    : BRANDS.filter((b) => b.category === activeCategory);

  return (
    <section className="relative w-full py-24 px-4 sm:px-6 lg:px-8 bg-[#06090E] overflow-hidden border-t border-slate-800/80">
      {/* М'які неонові сфери на фоні */}
      <div className="absolute top-1/4 left-1/4 w-[700px] h-[350px] bg-red-600/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[300px] bg-amber-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Заголовок секції */}
        <div className="text-center space-y-4 mb-14">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(239,68,68,0.2)]"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Прямі європейські склади • -20% UK VAT • Швидкий клік
          </motion.div>
          
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Каталог найбільш ходових <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-amber-200">OEM-вузлів</span>
          </h2>
          
          <p className="max-w-3xl mx-auto text-slate-400 text-sm sm:text-base leading-relaxed">
            Виберіть потрібний артикул зі списку бестселерів нижче: номер і бренд автоматично підставляться у форму розрахунку закупівлі із доставкою з Великобританії.
          </p>
        </div>

        {/* Навігаційні таби категорій */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-14">
          {CATEGORIES.map((cat) => {
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

        {/* Сітка карток з фотографіями та підсвіткою */}
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
                {/* Фонове фото вузла з градієнтним затемненням */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                  <img 
                    src={brand.bgImage} 
                    alt={brand.name} 
                    className="w-full h-36 object-cover object-center opacity-20 group-hover:opacity-35 group-hover:scale-110 transition-all duration-700 filter brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f17]/60 via-[#0b0f17]/95 to-[#0b0f17]" />
                </div>

                {/* Верхня інформаційна частина */}
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-slate-300 flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm border border-white/5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {brand.origin}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-red-500/10 border border-red-500/20 text-red-400">
                      {brand.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white group-hover:text-red-400 transition-colors flex items-center justify-between">
                      {brand.name}
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-red-400 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {brand.tagline}
                    </p>
                  </div>
                </div>

                {/* Розширені кнопки OEM з описом та бейджами */}
                <div className="relative z-10 mt-5 pt-3.5 border-t border-slate-800/80">
                  <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-amber-400" />
                      Ходові позиції:
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">клік для форми</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {brand.popularOems.map((item) => (
                      <button
                        key={item.oem}
                        onClick={() => onSelectOem(item.oem, brand.name)}
                        className="group/btn w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left bg-slate-950/70 hover:bg-red-600/20 border border-slate-800 hover:border-red-500/50 transition-all duration-200 cursor-pointer active:scale-98"
                        title={`Підставити ${item.oem} у розрахунок`}
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
                          {item.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Нижня інформаційна плашка про розмитнення та наявність */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base font-bold text-white flex items-center gap-2 justify-center md:justify-start">
                Потрібен інший вузол або крос-номер?
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/10 text-amber-400 border border-amber-400/30">
                  Всі 50 хабів у пошуку
                </span>
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Система автоматично сканує склади Komatsu, Volvo, Liebherr, Case, New Holland, Yanmar, Dana Spicer та ZF.
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
            Ввести свій артикул
          </button>
        </div>

      </div>
    </section>
  );
}

/* =========================================================================
   ЮРИДИЧНА СЕКЦІЯ
   ========================================================================= */

function InlineLegalSection() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';
  const [copied, setCopied] = useState(false);

  const copyDetails = () => {
    const text = `NoLimitGoods Limited
UK Company No: 13146899
Director: Ivan Tsipan
Registered Address: 374 Hipsell Highway, Coventry, CV2 5FR, United Kingdom
VAT Number: GB 372 6541 87
EORI Number: GB079878335000
Phone: +44 7426 826595
Email: nolimitgoods@gmail.com`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="contacts" className="py-20 bg-slate-900/60 text-white relative border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-slate-300 text-xs sm:text-sm font-semibold mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{isUk ? 'Офіційні юридичні реквізити Великобританії' : 'Official UK Corporate Details'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            {isUk ? 'Юридична інформація та реквізити' : 'Legal & Corporate Credentials'}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            {isUk
              ? 'Прямі експортні контракти з Великобританії. 0% UK VAT, офіційний EORI та інвойси.'
              : 'Direct supply under UK trade law with official zero-rated VAT export status.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl">
            <Building2 className="w-6 h-6 text-red-500 mb-4" />
            <h3 className="font-bold text-white text-base mb-2">NoLimitGoods Limited</h3>
            <p className="text-xs text-slate-400 leading-relaxed space-y-1">
              <span className="block">UK Company No: <strong className="text-white">13146899</strong></span>
              <span className="block">Director: <strong className="text-white">Ivan Tsipan</strong></span>
              <span className="block">Status: <strong className="text-emerald-400">Active / Good Standing</strong></span>
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl">
            <FileCheck className="w-6 h-6 text-amber-400 mb-4" />
            <h3 className="font-bold text-white text-base mb-2">{isUk ? 'Митниця та податки' : 'Tax & Customs'}</h3>
            <p className="text-xs text-slate-400 leading-relaxed space-y-1 font-mono">
              <span className="block">VAT: <strong className="text-white">GB 372 6541 87</strong></span>
              <span className="block">EORI: <strong className="text-white">GB079878335000</strong></span>
              <span className="block text-emerald-400">Export VAT: 0% Zero-Rated</span>
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl">
            <MapPin className="w-6 h-6 text-sky-400 mb-4" />
            <h3 className="font-bold text-white text-base mb-2">{isUk ? 'Склад і зв’язок' : 'UK Hub & Contacts'}</h3>
            <p className="text-xs text-slate-400 leading-relaxed space-y-1">
              <span className="block">374 Hipsell Highway, Coventry, CV2 5FR</span>
              <span className="block flex items-center gap-1.5 text-slate-300 pt-1">
                <Phone className="w-3.5 h-3.5 text-red-500" />
                <a href="tel:+447426826595" className="hover:text-white transition-colors">+44 7426 826595</a>
              </span>
              <span className="block flex items-center gap-1.5 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-amber-500" />
                <a href="mailto:nolimitgoods@gmail.com" className="hover:text-white transition-colors">nolimitgoods@gmail.com</a>
              </span>
            </p>
          </div>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={copyDetails}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-750 text-slate-200 text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">{isUk ? 'Реквізити скопійовано в буфер!' : 'Copied to clipboard!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>{isUk ? 'Скопіювати повні реквізити для договору / оплати' : 'Copy Full Credentials for Invoice'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   ГОЛОВНИЙ КОМПОНЕНТ СТОРІНКИ
   ========================================================================= */

export default function Home() {
  const handleBrandOemSelect = (oem: string, brandName: string) => {
    // Шукаємо перше поле для каталожного номера OEM
    const oemInput = (document.querySelector('input[placeholder*="P535114"], input[name*="oem"], input[name*="partNumber"]') as HTMLInputElement) 
      || (document.querySelectorAll('input[type="text"]')[0] as HTMLInputElement);

    if (oemInput) {
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
      nativeSetter?.call(oemInput, oem);
      oemInput.dispatchEvent(new Event('input', { bubbles: true }));
      oemInput.dispatchEvent(new Event('change', { bubbles: true }));

      // Шукаємо поле бренду
      const brandInput = (document.querySelector('input[placeholder*="Donaldson"], input[name*="brand"]') as HTMLInputElement)
        || (document.querySelectorAll('input[type="text"]')[1] as HTMLInputElement);

      if (brandInput && brandName) {
        nativeSetter?.call(brandInput, brandName);
        brandInput.dispatchEvent(new Event('input', { bubbles: true }));
        brandInput.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // Плавний перехід до форми
      oemInput.focus();
      const formSection = oemInput.closest('section') || oemInput;
      formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-red-500 selection:text-white">
      <Header />
      <HeroSection />
      
      {/* Калькулятор специфікацій */}
      <section className="px-4 sm:px-6 lg:px-8 -mt-6 mb-12 relative z-10">
        <PartsSearchWidget />
      </section>

      {/* Оновлений преміальний каталог з картинками та бестселерами */}
      <BrandsCatalogInline onSelectOem={handleBrandOemSelect} />

      <RFQSection />
      <DeliveriesSection />
      <PartsSection />
      <InlineLegalSection />
      <Footer />
      <FloatingContact />
    </main>
  );
}
