'use client';

import React from 'react';
import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function Footer() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Лого і опис */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <Image
                src="/logo.png"
                alt="No Limit Goods Ltd"
                width={150}
                height={45}
                className="h-10 w-auto brightness-110"
              />
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-4">
              {isUk
                ? 'Прямий експортер оригінальних запчастин до сільськогосподарської, будівельної та спеціальної техніки з Великобританії в Україну. Власний хаб у Ковентрі, офіційні інвойси, DOUANE митне оформлення.'
                : 'Direct UK exporter of genuine heavy machinery and agricultural equipment spare parts. Hub in Coventry, T1 transit declarations and European logistics.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>UK Company No. 13146899 • VAT 372654187</span>
            </div>
          </div>

          {/* Навігація */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              {isUk ? 'Розділи' : 'Navigation'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => scrollTo('parts')} className="hover:text-white transition-colors cursor-pointer">
                  {isUk ? 'Каталог деталей з цінами' : 'Parts Catalog'}
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('rfq')} className="hover:text-white transition-colors cursor-pointer">
                  {isUk ? 'Калькулятор вартості' : 'Price Calculator'}
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('deliveries')} className="hover:text-white transition-colors cursor-pointer">
                  {isUk ? 'Відеозвіт відвантажень' : 'Live Dispatch Video'}
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('brands')} className="hover:text-white transition-colors cursor-pointer">
                  {isUk ? 'Бренди (Donaldson, JCB, CAT)' : 'OEM Brands'}
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('contact')} className="hover:text-white transition-colors cursor-pointer">
                  {isUk ? 'Юридичні реквізити' : 'Legal & Contacts'}
                </button>
              </li>
            </ul>
          </div>

          {/* Склад у Ковентрі */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              {isUk ? 'Склад у Великобританії' : 'Coventry Hub'}
            </h4>
            <address className="not-italic text-xs text-slate-400 space-y-2">
              <p className="text-slate-300 font-medium">374 Hipsell Highway, Coventry</p>
              <p>West Midlands, CV2 5FR, UK</p>
              <p className="pt-2 text-slate-300 font-mono">+44 7426 826595</p>
              <p className="text-amber-400">nolimitgoods@gmail.com</p>
            </address>
          </div>

        </div>

        {/* Нижня стрічка копірайту */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} NoLimitGoods Limited. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Coventry, England</span>
            <span>•</span>
            <span>EORI: GB079878335000</span>
            <span>•</span>
            <span className="text-emerald-500 font-semibold">UK Verified Exporter</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
