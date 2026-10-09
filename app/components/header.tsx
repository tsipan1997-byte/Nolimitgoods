'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import LanguageSwitcher from './language-switcher';
import { useLanguage } from '@/lib/language-context';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-slate-950/90 backdrop-blur-md border-slate-800 shadow-2xl py-2'
          : 'bg-slate-950/70 backdrop-blur-sm border-slate-850 py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Логотип */}
          <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Image
              src="/logo.png"
              alt="No Limit Goods Ltd"
              width={160}
              height={50}
              className="h-10 sm:h-11 w-auto brightness-110 drop-shadow"
              priority
            />
          </div>

          {/* Десктоп-меню */}
          <nav className="hidden md:flex items-center gap-7">
            <button
              onClick={() => scrollToSection('services')}
              className="text-slate-300 hover:text-white transition-colors text-sm font-semibold tracking-wide"
            >
              {t.nav.services}
            </button>
            <button
              onClick={() => scrollToSection('parts')}
              className="text-slate-300 hover:text-white transition-colors text-sm font-semibold tracking-wide"
            >
              {t.nav.parts}
            </button>
            <button
              onClick={() => scrollToSection('brands')}
              className="text-slate-300 hover:text-white transition-colors text-sm font-semibold tracking-wide"
            >
              {t.nav.brands}
            </button>
            <button
              onClick={() => scrollToSection('deliveries')}
              className="text-slate-300 hover:text-white transition-colors text-sm font-semibold tracking-wide"
            >
              Відеозвіт
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-slate-300 hover:text-white transition-colors text-sm font-semibold tracking-wide"
            >
              {t.nav.contact}
            </button>

            {/* Акцентна кнопка RFQ */}
            <button
              onClick={() => scrollToSection('rfq')}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-red-600/30 cursor-pointer"
            >
              {t.nav.rfq}
            </button>

            {/* Перемикач мови */}
            <LanguageSwitcher />
          </nav>

          {/* Мобільна кнопка */}
          <div className="md:hidden flex items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-300 hover:text-white p-2 rounded-lg border border-slate-800 bg-slate-900"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Мобільне розкривне меню */}
        {isMenuOpen && (
          <nav className="md:hidden py-5 border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl rounded-b-2xl mt-2 px-2 animate-in slide-in-from-top-2">
            <div className="flex flex-col gap-3">
              <button
                onClick={() => scrollToSection('services')}
                className="text-slate-300 hover:text-white hover:bg-slate-900 transition-colors font-medium text-left px-3 py-2 rounded-lg text-sm"
              >
                {t.nav.services}
              </button>
              <button
                onClick={() => scrollToSection('parts')}
                className="text-slate-300 hover:text-white hover:bg-slate-900 transition-colors font-medium text-left px-3 py-2 rounded-lg text-sm"
              >
                {t.nav.parts}
              </button>
              <button
                onClick={() => scrollToSection('brands')}
                className="text-slate-300 hover:text-white hover:bg-slate-900 transition-colors font-medium text-left px-3 py-2 rounded-lg text-sm"
              >
                {t.nav.brands}
              </button>
              <button
                onClick={() => scrollToSection('deliveries')}
                className="text-slate-300 hover:text-white hover:bg-slate-900 transition-colors font-medium text-left px-3 py-2 rounded-lg text-sm"
              >
                Відеозвіт
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-slate-300 hover:text-white hover:bg-slate-900 transition-colors font-medium text-left px-3 py-2 rounded-lg text-sm"
              >
                {t.nav.contact}
              </button>
              <button
                onClick={() => scrollToSection('rfq')}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-bold transition-colors text-center text-sm shadow-md mt-2"
              >
                {t.nav.rfq}
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
