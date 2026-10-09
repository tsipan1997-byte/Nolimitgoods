'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Menu, X, Globe, PhoneCall } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function Header() {
  const { language, setLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isUk = language === 'uk' || (language as string) === 'ua';

  // Динамічна зміна назви сторінки у вкладці браузера при зміні мови
  useEffect(() => {
    if (isUk) {
      document.title = 'NoLimitGoods | Запчастини до спецтехніки з Британії';
    } else {
      document.title = 'NoLimitGoods | UK Heavy Machinery Spare Parts';
    }
  }, [isUk]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleLanguage = () => {
    setLanguage(isUk ? 'en' : 'uk');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-2xl py-3'
          : 'bg-slate-950/70 backdrop-blur-sm border-b border-slate-900 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Логотип */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative h-10 w-36 sm:h-11 sm:w-44">
              <Image
                src="/logo.png"
                alt="NoLimitGoods Ltd"
                fill
                priority
                className="object-contain brightness-110 group-hover:scale-105 transition-transform duration-200"
              />
            </div>
          </div>

          {/* Десктопне меню */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <button
              onClick={() => scrollTo('parts')}
              className="hover:text-red-400 transition-colors cursor-pointer"
            >
              {isUk ? 'Каталог деталей' : 'Parts Catalog'}
            </button>
            <button
              onClick={() => scrollTo('rfq')}
              className="hover:text-red-400 transition-colors cursor-pointer"
            >
              {isUk ? 'Розрахунок вартості' : 'Quote Calculator'}
            </button>
            <button
              onClick={() => scrollTo('deliveries')}
              className="hover:text-red-400 transition-colors cursor-pointer"
            >
              {isUk ? 'Відео відвантажень' : 'Live Dispatch'}
            </button>
            <button
              onClick={() => scrollTo('brands')}
              className="hover:text-red-400 transition-colors cursor-pointer"
            >
              {isUk ? 'Бренди OEM' : 'OEM Brands'}
            </button>
            <button
              onClick={() => scrollTo('contact')}
              className="hover:text-red-400 transition-colors cursor-pointer"
            >
              {isUk ? 'Юридичні реквізити' : 'Legal & Contacts'}
            </button>
          </nav>

          {/* Праві кнопки: Телефон, Мова, Запит ціни */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
              title="Перемкнути мову"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{isUk ? '🇺🇦 UA' : '🇬🇧 EN'}</span>
            </button>

            <button
              onClick={() => scrollTo('rfq')}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-600/30 cursor-pointer active:scale-95"
            >
              {isUk ? 'Запит ціни' : 'Get Quote'}
            </button>
          </div>

          {/* Мобільна кнопка гамбургера */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200"
            >
              <span>{isUk ? '🇺🇦' : '🇬🇧'}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Мобільне меню */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/98 border-b border-slate-850 px-5 py-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-3 text-base font-semibold text-slate-200">
            <button
              onClick={() => scrollTo('parts')}
              className="text-left py-2 hover:text-red-400 transition-colors"
            >
              {isUk ? 'Каталог деталей' : 'Parts Catalog'}
            </button>
            <button
              onClick={() => scrollTo('rfq')}
              className="text-left py-2 hover:text-red-400 transition-colors"
            >
              {isUk ? 'Розрахунок вартості' : 'Quote Calculator'}
            </button>
            <button
              onClick={() => scrollTo('deliveries')}
              className="text-left py-2 hover:text-red-400 transition-colors"
            >
              {isUk ? 'Відео відвантажень' : 'Live Dispatch'}
            </button>
            <button
              onClick={() => scrollTo('brands')}
              className="text-left py-2 hover:text-red-400 transition-colors"
            >
              {isUk ? 'Бренди OEM' : 'OEM Brands'}
            </button>
            <button
              onClick={() => scrollTo('contact')}
              className="text-left py-2 hover:text-red-400 transition-colors"
            >
              {isUk ? 'Юридичні реквізити' : 'Legal & Contacts'}
            </button>
          </div>

          <div className="pt-4 border-t border-slate-850">
            <button
              onClick={() => scrollTo('rfq')}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm text-center shadow-lg cursor-pointer"
            >
              {isUk ? 'Запит ціни' : 'Get Quote'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
