'use client';

import React from 'react';
import { MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function Footer() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800/60">
          
          {/* Лого та назва */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center font-black text-slate-950 tracking-tighter text-sm shadow-md">
              NLG
            </div>
            <div>
              <div className="text-base font-black tracking-tight text-white">
                NoLimitGoods <span className="text-red-600">LTD</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Coventry UK Hub • 0% UK Export VAT
              </div>
            </div>
          </div>

          {/* Реквізити в рядок */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-300 font-mono">
            <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md">UK Company No: 13146899</span>
            <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md">VAT: GB 372 6541 87</span>
            <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md">EORI: GB079878335000</span>
          </div>

          {/* Короткі контакти */}
          <div className="flex items-center gap-4 text-xs text-slate-300">
            <a href="tel:+447426826595" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono">+44 7426 826595</span>
            </a>
            <a href="mailto:sales@nolimitgoods.co.uk" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono">sales@nolimitgoods.co.uk</span>
            </a>
          </div>

        </div>

        {/* Нижній рядок */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 NoLimitGoods Limited. {isUk ? 'Всі права захищені.' : 'All rights reserved.'}
          </div>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>{isUk ? 'Прямий експортер запчастин з UK' : 'Direct UK Parts Exporter'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
