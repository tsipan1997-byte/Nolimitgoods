'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';
import { SOCIAL } from '@/lib/site-config';
import { InstagramIcon, FacebookIcon } from './social-icons';
import { useLanguage } from '@/lib/language-context';

export default function Footer() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';

  const openCookieSettings = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('nlg:open-cookie-settings'));
    }
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Колонка 1: Оригінальний логотип як у шапці */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="flex items-center justify-center bg-white px-3.5 py-1.5 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.15)] border border-slate-200">
                <img 
                  src="/logo.png" 
                  alt="NoLimitGoods" 
                  className="h-8 sm:h-9 w-auto object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-black tracking-tight text-white leading-tight">
                  NoLimitGoods
                </span>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
                  COVENTRY, UK HUB
                </span>
              </div>
            </Link>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {isUk 
                ? 'Знайдемо і привеземо запчастини для спецтехніки, сільгосптехніки та авто: оригінал, аналог або б/у.'
                : 'We find and deliver parts for machinery, farm equipment and vehicles: genuine, aftermarket or used.'}
            </p>
            <div className="flex items-center gap-2">
              <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-pink-500/60 flex items-center justify-center text-slate-300 hover:text-pink-400 transition-colors">
                <InstagramIcon className="w-4 h-4" />
              </a>
              {SOCIAL.facebook && (
                <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/60 flex items-center justify-center text-slate-300 hover:text-blue-400 transition-colors">
                  <FacebookIcon className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Колонка 2: Навігація */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              {isUk ? 'Навігація' : 'Navigation'}
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <a href="#parts-calculator" className="hover:text-white transition-colors">
                  {isUk ? 'Запит ціни' : 'Get a Quote'}
                </a>
              </li>
              <li>
                <a href="#prices" className="hover:text-white transition-colors">
                  {isUk ? 'Приклади цін' : 'Price examples'}
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-white transition-colors">
                  {isUk ? 'Каталог вузлів OEM' : 'OEM Catalog'}
                </a>
              </li>
              <li>
                <a href="#deliveries" className="hover:text-white transition-colors">
                  {isUk ? 'Відео відвантажень' : 'Live Dispatch'}
                </a>
              </li>
              <li>
                <a href="#contacts" className="hover:text-white transition-colors">
                  {isUk ? 'Юридичні реквізити' : 'Legal & Contacts'}
                </a>
              </li>
            </ul>
          </div>

          {/* Колонка 3: Контакти хабу */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              {isUk ? 'Хаб у Великобританії' : 'UK Hub Contacts'}
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>374 Hipsell Highway, Coventry, CV2 5FR</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>+44 7426 826595</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>sales@nolimitgoods.co.uk</span>
              </li>
            </ul>
          </div>

          {/* Колонка 4: Юридичні реквізити */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              {isUk ? 'Юридична інформація' : 'Legal Compliance'}
            </h4>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1 text-[11px]">
              <div className="text-white font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>NoLimitGoods Limited</span>
              </div>
              <div>Company No: <span className="font-mono text-slate-300">13146899</span></div>
              <div>VAT: <span className="font-mono text-slate-300">GB 372 6541 87</span></div>
              <div>EORI: <span className="font-mono text-slate-300">GB079878335000</span></div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 NoLimitGoods Limited. {isUk ? 'Всі права захищені.' : 'All rights reserved.'}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link href="/privacy" className="hover:text-white transition-colors underline underline-offset-4">
              {isUk ? 'Політика конфіденційності' : 'Privacy Policy'}
            </Link>
            <button
              type="button"
              onClick={openCookieSettings}
              className="hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
            >
              {isUk ? 'Налаштування cookie' : 'Cookie settings'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
