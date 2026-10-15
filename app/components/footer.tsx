'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function Footer() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';

  return (
    <footer className="w-full bg-[#04060A] text-slate-400 text-xs border-t border-slate-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* 1. БЛОК ЛОГОТИПУ НА БІЛІЙ ПІДКЛАДЦІ */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center bg-white px-3 py-1.5 rounded-xl shadow-md border border-slate-200">
                <img 
                  src="/logo.png" 
                  alt="NoLimitGoods Logo" 
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling;
                    if (fallback) fallback.classList.remove('hidden');
                  }}
                  className="h-7 w-auto object-contain"
                />
                <span className="hidden text-slate-950 font-black text-lg tracking-tighter">
                  <span className="text-red-600">n</span>lg
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-white tracking-wide">
                  NoLimitGoods Limited
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                  Coventry, UK Hub
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm max-w-md leading-relaxed">
              {isUk
                ? 'Прямий експортер оригінальних запчастин до сільськогосподарської, будівельної та спеціальної техніки з Великобританії в Україну. Власний хаб у Ковентрі, офіційні інвойси, DOUANE митне оформлення.'
                : 'Direct exporter of genuine spare parts for agricultural, construction, and heavy machinery from the UK. Dedicated Coventry hub, official zero-rated export invoices, T1 customs clearance.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-2 font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                UK Company No: 13146899
              </span>
              <span>•</span>
              <span>VAT: GB 372 6541 87</span>
              <span>•</span>
              <span>EORI: GB079878335000</span>
            </div>
          </div>

          {/* 2. РОЗДІЛИ ТА НАВІГАЦІЯ */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              {isUk ? 'Розділи' : 'Navigation'}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#parts-calculator" className="hover:text-white transition-colors">
                  {isUk ? 'Каталог деталей з цінами' : 'Parts Catalog & Pricing'}
                </a>
              </li>
              <li>
                <a href="#parts-calculator" className="hover:text-white transition-colors">
                  {isUk ? 'Калькулятор вартості' : 'Quote Calculator'}
                </a>
              </li>
              <li>
                <a href="#deliveries" className="hover:text-white transition-colors">
                  {isUk ? 'Відеозвіт відвантажень' : 'Live Dispatch Videos'}
                </a>
              </li>
              <li>
                <a href="#oem-brands" className="hover:text-white transition-colors">
                  {isUk ? 'Бренди (Donaldson, JCB, CAT)' : 'OEM Brands (Donaldson, JCB)'}
                </a>
              </li>
              <li>
                <a href="#contacts" className="hover:text-white transition-colors">
                  {isUk ? 'Юридичні реквізити' : 'Legal & Corporate Details'}
                </a>
              </li>
            </ul>
          </div>

          {/* 3. СКЛАД ТА КОНТАКТИ */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              {isUk ? 'Склад у Великобританії' : 'UK Dispatch Hub'}
            </h4>
            <div className="space-y-2.5 text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>374 Hipsell Highway, Coventry, West Midlands, CV2 5FR, UK</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <a href="tel:+447426826595" className="hover:text-white transition-colors">
                  +44 7426 826595
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <a href="mailto:nolimitgoods@gmail.com" className="hover:text-white transition-colors">
                  nolimitgoods@gmail.com
                </a>
              </p>
            </div>
          </div>

        </div>

        {/* НИЖНІЙ БАР */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © 2026 NoLimitGoods Limited. {isUk ? 'Всі права захищені.' : 'All rights reserved.'}
          </div>
          <div className="flex items-center gap-4">
            <span>Coventry, England</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">
              {isUk ? 'Офіційний експортер UK' : 'UK Verified Exporter'}
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
