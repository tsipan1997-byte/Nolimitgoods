'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, 
  Layers, 
  Gauge, 
  Cpu, 
  ArrowUpRight, 
  CheckCircle2, 
  Sparkles,
  Search,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

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
  popularOems: string[];
  gradient: string;
  accentBorder: string;
  bgGlow: string;
}

const CATEGORIES: BrandCategory[] = [
  { id: 'all', name: 'Всі бренди', icon: Layers },
  { id: 'hydraulics', name: 'Гідравліка', icon: Gauge },
  { id: 'engines', name: 'Двигуни та паливна', icon: Cpu },
  { id: 'filtration', name: 'Фільтрація', icon: Sparkles },
  { id: 'undercarriage', name: 'Ходова та мости', icon: Wrench },
];

const BRANDS: BrandItem[] = [
  {
    name: 'JCB Genuine Parts',
    category: 'undercarriage',
    origin: 'Rocester, UK',
    tagline: 'Оригінальні вузли екскаваторів, мости, гідроциліндри, пальці та ремені',
    badge: 'Офіційний хаб UK',
    popularOems: ['332/Y3163', '458/20403', '32/925682', '02/100073'],
    gradient: 'from-amber-500/20 via-yellow-500/5 to-transparent',
    accentBorder: 'group-hover:border-amber-500/50',
    bgGlow: 'bg-amber-500/10',
  },
  {
    name: 'Bosch Rexroth',
    category: 'hydraulics',
    origin: 'Lohr am Main, Germany',
    tagline: 'Аксіально-поршневі насоси A10VSO, A4VG, гідромотори ходу та клапани',
    badge: 'Німецька точність',
    popularOems: ['A10VSO71', 'A10VSO45', 'A4VG90', 'A2FE107'],
    gradient: 'from-blue-600/20 via-cyan-500/5 to-transparent',
    accentBorder: 'group-hover:border-blue-500/50',
    bgGlow: 'bg-blue-500/10',
  },
  {
    name: 'Danfoss Mobile',
    category: 'hydraulics',
    origin: 'Nordborg, Denmark',
    tagline: 'Гідростатичні трансмісії, гідрорулі серії OSPB, моноблоки PVG-32',
    badge: 'Північна якість',
    popularOems: ['OSPB 160', 'OMT 250', 'PVG 32', 'OMV 500'],
    gradient: 'from-red-600/20 via-orange-500/5 to-transparent',
    accentBorder: 'group-hover:border-red-500/50',
    bgGlow: 'bg-red-500/10',
  },
  {
    name: 'Perkins Engines',
    category: 'engines',
    origin: 'Peterborough, UK',
    tagline: 'Поршнекомплекти, форсунки Delphi, масляні насоси 1104D / 404D',
    badge: 'UK Master Hub',
    popularOems: ['26561117', '26560201', 'U5MK8267', 'T413847'],
    gradient: 'from-emerald-600/20 via-teal-500/5 to-transparent',
    accentBorder: 'group-hover:border-emerald-500/50',
    bgGlow: 'bg-emerald-500/10',
  },
  {
    name: 'Donaldson Filtration',
    category: 'filtration',
    origin: 'Leuven, Belgium',
    tagline: 'Сепаратори вологи, паливні елементи та повітряні блоки PowerCore',
    badge: 'Європейський склад',
    popularOems: ['P553004', 'P535114', 'P550388', 'P550425'],
    gradient: 'from-sky-500/20 via-blue-500/5 to-transparent',
    accentBorder: 'group-hover:border-sky-500/50',
    bgGlow: 'bg-sky-500/10',
  },
  {
    name: 'Carraro Drivetech',
    category: 'undercarriage',
    origin: 'Campodarsego, Italy',
    tagline: 'Сателіти бортових редукторів, диференціали та поворотні цапфи',
    badge: 'Трансмісії та Мости',
    popularOems: ['149298', '047702', '125196', '140643'],
    gradient: 'from-violet-600/20 via-purple-500/5 to-transparent',
    accentBorder: 'group-hover:border-violet-500/50',
    bgGlow: 'bg-violet-500/10',
  },
  {
    name: 'Fleetguard Cummins',
    category: 'filtration',
    origin: 'UK & EU Master Hubs',
    tagline: 'Системи NanoNet для сучасних дизельних паливних систем Common Rail',
    badge: 'OEM Специфікація',
    popularOems: ['AF25627NF', 'FK11008NN', 'LF16015', 'FS19732'],
    gradient: 'from-rose-600/20 via-pink-500/5 to-transparent',
    accentBorder: 'group-hover:border-rose-500/50',
    bgGlow: 'bg-rose-500/10',
  },
  {
    name: 'Caterpillar (CAT)',
    category: 'engines',
    origin: 'Western Europe Stocks',
    tagline: 'Турбокомпресори Garrett, насоси високого тиску, ремкомплекти C7.1',
    badge: 'Heavy Plant',
    popularOems: ['1R-0716', '1R-0749', '326-1644', '224-3238'],
    gradient: 'from-amber-600/20 via-yellow-500/5 to-transparent',
    accentBorder: 'group-hover:border-amber-400/50',
    bgGlow: 'bg-amber-400/10',
  },
];

interface BrandsCatalogProps {
  onSelectOem?: (oem: string) => void;
}

export default function BrandsCatalog({ onSelectOem }: BrandsCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredBrands = activeCategory === 'all' 
    ? BRANDS 
    : BRANDS.filter((b) => b.category === activeCategory);

  const handleSelectOem = (oem: string) => {
    if (onSelectOem) {
      onSelectOem(oem);
      return;
    }
    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = oem;
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      searchInput.focus();
      window.scrollTo({ top: searchInput.offsetTop - 100, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full py-24 px-4 sm:px-6 lg:px-8 bg-[#070A0F] overflow-hidden border-t border-white/5">
      {/* Динамічні фонові кулі підсвічування */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[250px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Заголовний блок */}
        <div className="text-center space-y-4 mb-14">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Прямі склади Великобританії та Європи
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Каталог перевірених <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-amber-200">OEM-виробників</span>
          </h2>
          
          <p className="max-w-2xl mx-auto text-gray-400 text-sm sm:text-base leading-relaxed">
            Швидкий пошук і доставка запчастин безпосередньо з хабу в Ковентрі (UK) з поверненням 20% UK VAT та консолідацією в Україну.
          </p>
        </div>

        {/* Перемикач категорій */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'text-white bg-gradient-to-r from-red-600 to-red-700 shadow-[0_0_20px_rgba(239,68,68,0.35)] border border-red-400/40'
                    : 'text-gray-400 hover:text-white bg-[#0F141F] hover:bg-[#161D2B] border border-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Сітка карток */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredBrands.map((brand, idx) => (
              <motion.div
                key={brand.name}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className={`group relative rounded-2xl bg-[#0D121B] border border-white/5 ${brand.accentBorder} p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl overflow-hidden`}
              >
                {/* Підсвітка при наведенні */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-b ${brand.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} 
                />

                <div className="relative z-10 space-y-4">
                  {/* Верхня плашка */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {brand.origin}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-white/5 border border-white/10 text-gray-300">
                      {brand.badge}
                    </span>
                  </div>

                  {/* Назва та опис */}
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors flex items-center justify-between">
                      {brand.name}
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-red-400 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </h3>
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                      {brand.tagline}
                    </p>
                  </div>
                </div>

                {/* Ходові позиції для швидкого кліку */}
                <div className="relative z-10 mt-6 pt-4 border-t border-white/5">
                  <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Search className="w-3 h-3 text-red-400" />
                    Ходові OEM (клік для розрахунку):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {brand.popularOems.map((oem) => (
                      <button
                        key={oem}
                        onClick={() => handleSelectOem(oem)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium bg-[#141A26] text-gray-300 hover:text-white hover:bg-red-600 hover:border-red-500 border border-white/5 transition-all duration-150"
                        title="Знайти на британських та європейських хабах"
                      >
                        {oem}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Інформаційна плашка знизу */}
        <div className="mt-12 p-6 rounded-2xl bg-[#0F141F] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Шукаєте деталь іншого виробника?</div>
              <div className="text-xs text-gray-400">Система підтримує крос-номери та артикули для Komatsu, Volvo, Liebherr, Case, New Holland та ще понад 40 брендів.</div>
            </div>
          </div>
          <button 
            onClick={() => {
              const input = document.querySelector('input[type="text"]') as HTMLInputElement;
              if (input) {
                input.focus();
                window.scrollTo({ top: input.offsetTop - 100, behavior: 'smooth' });
              }
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] shrink-0"
          >
            Ввести свій номер
          </button>
        </div>
      </div>
    </section>
  );
}
