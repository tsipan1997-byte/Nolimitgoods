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
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/language-context';

/* =========================================================================
   МОДЕРНІЗОВАНИЙ КАТАЛОГ OEM БРЕНДІВ
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
  popularOems: string[];
  gradient: string;
  accentBorder: string;
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
    tagline: 'Оригінальні пальці, мости, ремкомплекти супортів, втулки та ремені',
    badge: 'Хаб Велика Британія',
    popularOems: ['332/Y3163', '458/20403', '32/925682', '02/100073'],
    gradient: 'from-amber-500/20 via-yellow-500/5 to-transparent',
    accentBorder: 'hover:border-amber-500/50',
  },
  {
    name: 'Bosch Rexroth',
    category: 'hydraulics',
    origin: 'Lohr am Main, Germany',
    tagline: 'Аксіально-поршневі насоси A10VSO, A4VG, гідромотори ходу та клапани',
    badge: 'Німецька точність',
    popularOems: ['A10VSO71', 'A10VSO45', 'A4VG90', 'A2FE107'],
    gradient: 'from-blue-600/20 via-cyan-500/5 to-transparent',
    accentBorder: 'hover:border-blue-500/50',
  },
  {
    name: 'Danfoss Mobile',
    category: 'hydraulics',
    origin: 'Nordborg, Denmark',
    tagline: 'Гідростатичні трансмісії, насосні вузли, дозатори рульові OSPB',
    badge: 'Nordic Quality',
    popularOems: ['OSPB 160', 'OMT 250', 'PVG 32', 'OMV 500'],
    gradient: 'from-red-600/20 via-orange-500/5 to-transparent',
    accentBorder: 'hover:border-red-500/50',
  },
  {
    name: 'Perkins Engines',
    category: 'engines',
    origin: 'Peterborough, UK',
    tagline: 'Поршнекомплекти, форсунки Delphi, вкладиші та помпи 1104D / 404D',
    badge: 'UK Master Hub',
    popularOems: ['26561117', '26560201', 'U5MK8267', 'T413847'],
    gradient: 'from-emerald-600/20 via-teal-500/5 to-transparent',
    accentBorder: 'hover:border-emerald-500/50',
  },
  {
    name: 'Donaldson Filtration',
    category: 'filtration',
    origin: 'Leuven, Belgium',
    tagline: 'Промислові сепаратори, картриджі очистки палива, блоки PowerCore',
    badge: 'Європейський склад',
    popularOems: ['P553004', 'P535114', 'P550388', 'P550425'],
    gradient: 'from-sky-500/20 via-blue-500/5 to-transparent',
    accentBorder: 'hover:border-sky-500/50',
  },
  {
    name: 'Carraro Drivetech',
    category: 'undercarriage',
    origin: 'Campodarsego, Italy',
    tagline: 'Сателіти бортових передач, головні пари редукторів, поворотні кулаки',
    badge: 'Трансмісії та Мости',
    popularOems: ['149298', '047702', '125196', '140643'],
    gradient: 'from-violet-600/20 via-purple-500/5 to-transparent',
    accentBorder: 'hover:border-violet-500/50',
  },
  {
    name: 'Fleetguard Cummins',
    category: 'filtration',
    origin: 'UK & EU Stocks',
    tagline: 'Фільтри NanoNet для паливних систем Common Rail під надвисоким тиском',
    badge: 'OEM Стандарт',
    popularOems: ['AF25627NF', 'FK11008NN', 'LF16015', 'FS19732'],
    gradient: 'from-rose-600/20 via-pink-500/5 to-transparent',
    accentBorder: 'hover:border-rose-500/50',
  },
  {
    name: 'Caterpillar (CAT)',
    category: 'engines',
    origin: 'Western Europe Stocks',
    tagline: 'Турбокомпресори Garrett, датчики тиску, ремкомплекти двигунів C7.1',
    badge: 'Heavy Plant',
    popularOems: ['1R-0716', '1R-0749', '326-1644', '224-3238'],
    gradient: 'from-amber-600/20 via-yellow-500/5 to-transparent',
    accentBorder: 'hover:border-amber-400/50',
  },
];

function BrandsCatalogInline({ onSelectOem }: { onSelectOem: (oem: string, brandName: string) => void }) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredBrands = activeCategory === 'all' 
    ? BRANDS 
    : BRANDS.filter((b) => b.category === activeCategory);

  return (
    <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-slate-950 overflow-hidden border-t border-slate-800">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[300px] bg-red-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Прямі склади Великобританії та Європи
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Каталог провідних <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-amber-200">OEM-виробників</span>
          </h2>
          
          <p className="max-w-2xl mx-auto text-slate-400 text-sm sm:text-base leading-relaxed">
            Швидкий підбір за каталожними артикулами безпосередньо з хабу в Ковентрі (UK) з поверненням 20% UK VAT.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'text-white bg-gradient-to-r from-red-600 to-red-700 shadow-[0_0_20px_rgba(239,68,68,0.35)] border border-red-400/40'
                    : 'text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800'
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
                className={`group relative rounded-2xl bg-slate-900/90 border border-slate-800 ${brand.accentBorder} p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl overflow-hidden`}
              >
                <div className={`absolute inset-0 bg-gradient-to-b ${brand.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {brand.origin}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-slate-800 border border-slate-700 text-slate-300">
                      {brand.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors flex items-center justify-between">
                      {brand.name}
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-red-400 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {brand.tagline}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 mt-6 pt-4 border-t border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Search className="w-3 h-3 text-red-400" />
                    Ходові OEM (клік для розрахунку):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {brand.popularOems.map((oem) => (
                      <button
                        key={oem}
                        onClick={() => onSelectOem(oem, brand.name)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium bg-slate-950 text-slate-300 hover:text-white hover:bg-red-600 hover:border-red-500 border border-slate-800 transition-all duration-150 cursor-pointer active:scale-95"
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

        <div className="mt-12 p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Шукаєте деталь іншого бренду?</div>
              <div className="text-xs text-slate-400">Система шукає за каталожними номерами Komatsu, Volvo, Liebherr, Case, New Holland, Yanmar та десятків інших.</div>
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
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] shrink-0 cursor-pointer"
          >
            Ввести свій номер
          </button>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   ЮРИДИЧНІ ДАНІ КОМПАНІЇ
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
    // 1. Пошук поля для номера OEM
    const oemInput = (document.querySelector('input[placeholder*="P535114"], input[name*="oem"], input[name*="partNumber"]') as HTMLInputElement) 
      || (document.querySelectorAll('input[type="text"]')[0] as HTMLInputElement);

    if (oemInput) {
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
      nativeSetter?.call(oemInput, oem);
      oemInput.dispatchEvent(new Event('input', { bubbles: true }));
      oemInput.dispatchEvent(new Event('change', { bubbles: true }));

      // 2. Пошук поля бренду/техніки
      const brandInput = (document.querySelector('input[placeholder*="Donaldson"], input[name*="brand"]') as HTMLInputElement)
        || (document.querySelectorAll('input[type="text"]')[1] as HTMLInputElement);

      if (brandInput && brandName) {
        nativeSetter?.call(brandInput, brandName);
        brandInput.dispatchEvent(new Event('input', { bubbles: true }));
        brandInput.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // 3. Плавний фокус та скрол
      oemInput.focus();
      const formSection = oemInput.closest('section') || oemInput;
      formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-red-500 selection:text-white">
      <Header />
      <HeroSection />
      
      {/* Калькулятор специфікацій та пошук */}
      <section className="px-4 sm:px-6 lg:px-8 -mt-6 mb-12 relative z-10">
        <PartsSearchWidget />
      </section>

      {/* Каталог провідних OEM брендів */}
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
