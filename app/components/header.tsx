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
      setIsScrolled(window.scrollY > 50);
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${
        isScrolled ? 'shadow-lg' : 'shadow-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="No Limit Goods Ltd"
              width={160}
              height={50}
              className="h-12 w-auto"
              priority
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('services')}
              className="text-gray-700 hover:text-red-600 transition-colors font-medium"
            >
              {t.nav.services}
            </button>
            <button
              onClick={() => scrollToSection('parts')}
              className="text-gray-700 hover:text-red-600 transition-colors font-medium"
            >
              {t.nav.parts}
            </button>
            <button
              onClick={() => scrollToSection('brands')}
              className="text-gray-700 hover:text-red-600 transition-colors font-medium"
            >
              {t.nav.brands}
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-gray-700 hover:text-red-600 transition-colors font-medium"
            >
              {t.nav.contact}
            </button>
            <button
              onClick={() => scrollToSection('rfq')}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold transition-colors"
            >
              {t.nav.rfq}
            </button>
            <LanguageSwitcher />
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection('services')}
                className="text-gray-700 hover:text-red-600 transition-colors font-medium text-left py-2"
              >
                {t.nav.services}
              </button>
              <button
                onClick={() => scrollToSection('parts')}
                className="text-gray-700 hover:text-red-600 transition-colors font-medium text-left py-2"
              >
                {t.nav.parts}
              </button>
              <button
                onClick={() => scrollToSection('brands')}
                className="text-gray-700 hover:text-red-600 transition-colors font-medium text-left py-2"
              >
                {t.nav.brands}
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-gray-700 hover:text-red-600 transition-colors font-medium text-left py-2"
              >
                {t.nav.contact}
              </button>
              <button
                onClick={() => scrollToSection('rfq')}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold transition-colors text-center"
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
