'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Menu,
  X,
  Globe,
  ArrowRight,
  UserCheck,
  Search,
  ShoppingCart,
  Phone,
  Truck,
  MapPin,
  Tractor,
  HardHat,
  Car,
  Wrench,
  Tag,
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import B2BRegisterModal from './b2b-register-modal';
import { SOCIAL, CONTACT } from '@/lib/site-config';
import { InstagramIcon, FacebookIcon } from './social-icons';
import { useCart } from './quote-cart';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isB2BModalOpen, setIsB2BModalOpen] = useState(false);
  const [q, setQ] = useState('');
  const { language, setLanguage } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';
  const cart = useCart();
  const cartCount = cart.reduce((a, l) => a + l.qty, 0);

  const toggleLanguage = () => setLanguage(isUk ? 'en' : 'uk');

  const categories = [
    { href: '/catalog?cat=agro', icon: Tractor, uk: 'Агро і трактори', en: 'Farm & tractors' },
    { href: '/catalog?cat=construction', icon: HardHat, uk: 'Спецтехніка', en: 'Construction' },
    { href: '/catalog?cat=trucks', icon: Truck, uk: 'Вантажівки', en: 'Trucks' },
    { href: '/catalog?cat=cars', icon: Car, uk: 'Легкові авто', en: 'Cars' },
    { href: '/#diagram', icon: Wrench, uk: 'Схема двигуна', en: 'Engine diagram' },
    { href: '/#prices', icon: Tag, uk: 'Приклади цін', en: 'Price examples' },
  ];

  const scrollToCalculator = () => {
    const el = document.getElementById('parts-calculator');
    if (!el) {
      window.location.href = '/#parts-calculator';
      return;
    }
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => el.querySelector('input')?.focus({ preventScroll: true }), 500);
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const v = q.trim();
    window.location.href = v ? `/catalog?q=${encodeURIComponent(v)}` : '/catalog';
  };

  const openCart = () => window.dispatchEvent(new Event('nlg:open-cart'));

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white shadow-[0_1px_0_rgba(15,23,42,0.08)]">
        {/* 1. Верхня смуга: контакти */}
        <div className="hidden md:block bg-slate-900 text-slate-300 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-4">
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                {isUk ? 'Власний хаб у Ковентрі, Велика Британія' : 'Own hub in Coventry, UK'}
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-red-500" />
                {isUk ? 'Доставка в Україну 5–14 робочих днів' : 'Delivery 5–14 working days'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`} className="flex items-center gap-1.5 hover:text-white">
                <Phone className="w-3.5 h-3.5" /> {CONTACT.phone}
              </a>
              <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp</a>
              <a href={CONTACT.telegram} target="_blank" rel="noopener noreferrer" className="hover:text-white">Telegram</a>
              <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-white">
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>
              {SOCIAL.facebook && (
                <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-white">
                  <FacebookIcon className="w-3.5 h-3.5" />
                </a>
              )}
              <button type="button" onClick={toggleLanguage} className="flex items-center gap-1 hover:text-white">
                <Globe className="w-3.5 h-3.5" /> {isUk ? 'UA' : 'EN'}
              </button>
            </div>
          </div>
        </div>

        {/* 2. Основна панель: лого, пошук, дії */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 sm:gap-6 h-16 md:h-20">
            <Link href="/" className="flex items-center shrink-0" aria-label="NoLimitGoods">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="NoLimitGoods Ltd" className="h-9 md:h-12 w-auto object-contain" />
            </Link>

            <form onSubmit={submitSearch} className="hidden md:flex flex-1 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={isUk ? 'Артикул, бренд, модель техніки або авто…' : 'Part number, brand, machine or car…'}
                  className="w-full h-12 pl-12 pr-4 rounded-l-xl border-2 border-r-0 border-slate-200 focus:border-red-500 outline-none text-[15px] text-slate-900 placeholder-slate-400"
                />
              </div>
              <button type="submit" className="h-12 px-6 rounded-r-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm">
                {isUk ? 'Знайти' : 'Search'}
              </button>
            </form>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={() => setIsB2BModalOpen(true)}
                className="hidden lg:flex flex-col items-center px-3 py-1 text-slate-600 hover:text-slate-900"
              >
                <UserCheck className="w-5 h-5" />
                <span className="text-[11px] font-semibold mt-0.5">{isUk ? 'B2B кабінет' : 'B2B'}</span>
              </button>

              <button
                type="button"
                onClick={openCart}
                className="relative flex flex-col items-center px-3 py-1 text-slate-600 hover:text-slate-900"
                aria-label={isUk ? 'Кошик запиту' : 'Quote cart'}
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden sm:block text-[11px] font-semibold mt-0.5">{isUk ? 'Запит' : 'Quote'}</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 right-1 min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-[11px] font-black flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={scrollToCalculator}
                className="hidden sm:flex items-center gap-2 h-11 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm"
              >
                <span>{isUk ? 'Отримати ціну' : 'Get a quote'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Пошук на телефоні */}
          <form onSubmit={submitSearch} className="md:hidden flex pb-3">
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={isUk ? 'Артикул, бренд або модель…' : 'Part number, brand or model…'}
              className="flex-1 h-11 px-4 rounded-l-xl border-2 border-r-0 border-slate-200 focus:border-red-500 outline-none text-base text-slate-900 placeholder-slate-400"
            />
            <button type="submit" className="h-11 px-4 rounded-r-xl bg-red-600 text-white" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* 3. Меню категорій */}
        <nav className="hidden lg:block border-t border-slate-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center gap-1">
            <Link href="/catalog" className="flex items-center gap-2 h-9 px-4 mr-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold">
              <Menu className="w-4 h-4" /> {isUk ? 'Каталог' : 'Catalog'}
            </Link>
            {categories.map((c) => (
              <Link key={c.href} href={c.href} className="flex items-center gap-2 h-9 px-3 rounded-lg text-sm font-semibold text-slate-700 hover:text-red-600 hover:bg-red-50">
                <c.icon className="w-4 h-4" /> {isUk ? c.uk : c.en}
              </Link>
            ))}
            <Link href="/#contacts" className="ml-auto text-sm font-semibold text-slate-500 hover:text-slate-900">
              {isUk ? 'Контакти' : 'Contacts'}
            </Link>
          </div>
        </nav>

        {/* Мобільне меню */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 px-4 pt-3 pb-6 space-y-3 shadow-lg">
            <nav className="flex flex-col">
              <Link href="/catalog" onClick={() => setMobileMenuOpen(false)} className="px-3 py-3 rounded-lg text-base font-bold text-red-600">
                {isUk ? 'Увесь каталог' : 'Full catalog'}
              </Link>
              {categories.map((c) => (
                <Link key={c.href} href={c.href} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-50">
                  <c.icon className="w-5 h-5 text-slate-400" /> {isUk ? c.uk : c.en}
                </Link>
              ))}
              <Link href="/#contacts" onClick={() => setMobileMenuOpen(false)} className="px-3 py-3 rounded-lg text-base font-semibold text-slate-800">
                {isUk ? 'Контакти' : 'Contacts'}
              </Link>
            </nav>
            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => { setMobileMenuOpen(false); setIsB2BModalOpen(true); }} className="py-3 rounded-xl border border-slate-200 text-slate-800 font-bold text-sm">
                {isUk ? 'B2B кабінет' : 'B2B'}
              </button>
              <button type="button" onClick={toggleLanguage} className="py-3 rounded-xl border border-slate-200 text-slate-800 font-bold text-sm">
                {isUk ? '🇬🇧 English' : '🇺🇦 Українська'}
              </button>
              <button type="button" onClick={() => { setMobileMenuOpen(false); scrollToCalculator(); }} className="col-span-2 py-3.5 rounded-xl bg-red-600 text-white font-bold text-sm">
                {isUk ? 'Отримати ціну' : 'Get a quote'}
              </button>
            </div>
          </div>
        )}
      </header>

      <B2BRegisterModal isOpen={isB2BModalOpen} onClose={() => setIsB2BModalOpen(false)} />
    </>
  );
}
