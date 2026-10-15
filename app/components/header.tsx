'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Globe, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';

  const toggleLanguage = () => {
    setLanguage(isUk ? 'en' : 'uk');
  };

  const navLinks = [
    { href: '#parts-calculator', labelUk: 'Каталог деталей', labelEn: 'Parts Catalog' },
    { href: '#parts-calculator', labelUk: 'Розрахунок вартості', labelEn: 'Quote Calculator' },
    { href: '#deliveries', labelUk: 'Відео відвантажень', labelEn: 'Live Dispatch' },
    { href: '#oem-brands', labelUk: 'Бренди OEM', labelEn: 'OEM Brands' },
    { href: '#contacts', labelUk: 'Юридичні реквізити', labelEn: 'Legal & Contacts' },
  ];

  const scrollToCalculator = () => {
    const el = document.getElementById('parts-calculator') || document.querySelector('input[type="text"]');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const input = el.tagName === 'INPUT' ? (el as HTMLInputElement) : el.querySelector('input');
      input?.focus();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* 1. БЛОК ЛОГОТИПУ НА КОНТРАСТНОМУ БІЛОМУ ФОНІ */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center bg-white px-3 py-1.5 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] border border-slate-200 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(255,255,255,0.35)]">
              {/* Автоматична перевірка: картинка логотипу або стильний знак NLG */}
              <img 
                src="/logo.png" 
                alt="NoLimitGoods" 
                onError={(e) => {
                  // Якщо logo.png немає в public, плавно замінюємо на векторний бейдж
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling;
                  if (fallback) fallback.classList.remove('hidden');
                }}
                className="h-8 sm:h-9 w-auto object-contain"
              />
              <span className="hidden text-slate-950 font-black text-xl tracking-tighter flex items-center gap-0.5">
                <span className="text-red-600">n</span>lg
              </span>
            </div>
            
            <div className="hidden sm:flex flex-col">
              <span className="text-base font-black tracking-tight text-white group-hover:text-red-400 transition-colors">
                NoLimitGoods
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase -mt-0.5">
                Coventry, UK Hub
              </span>
            </div>
          </Link>

          {/* 2. ДЕСКТОПНЕ МЕНЮ НАВІГАЦІЇ */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.labelUk}
                href={link.href}
                className="text-xs font-semibold text-slate-300 hover:text-white transition-colors tracking-wide"
              >
                {isUk ? link.labelUk : link.labelEn}
              </a>
            ))}
          </nav>

          {/* 3. КНОПКИ ДІЇ ТА МУЛЬТИМОВНІСТЬ */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Перемикач мови UA / EN */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-200 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
              title={isUk ? 'Змінити мову на English' : 'Switch language to Ukrainian'}
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{isUk ? '🇺🇦 UA' : '🇬🇧 EN'}</span>
            </button>

            {/* Червона кнопка замовлення розрахунку */}
            <button
              onClick={scrollToCalculator}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(239,68,68,0.35)] flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>{isUk ? 'Запит ціни' : 'Get Quote'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* МОБІЛЬНА КНОПКА МЕНЮ */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-white flex items-center gap-1.5"
            >
              <span>{isUk ? '🇺🇦 UA' : '🇬🇧 EN'}</span>
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

      {/* 4. ВИПАДАЮЧЕ МЕНЮ ДЛЯ МОБІЛЬНИХ ПРИСТРОЇВ */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.labelUk}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
              >
                {isUk ? link.labelUk : link.labelEn}
              </a>
            ))}
          </nav>
          
          <div className="pt-2 border-t border-slate-800/80">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                scrollToCalculator();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>{isUk ? 'Запит ціни' : 'Get Quote'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
