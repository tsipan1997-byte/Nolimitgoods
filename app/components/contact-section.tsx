'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Building2, Check, Copy, ExternalLink, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function ContactSection() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';
  const [copied, setCopied] = useState(false);

  const copyDetails = () => {
    const text = `NoLimitGoods Limited
Company No: 13146899
VAT ID: GB 372 6541 87
EORI: GB079878335000
Address: 374 Hipsell Highway, Coventry, West Midlands, CV2 5FR, United Kingdom
Email: sales@nolimitgoods.co.uk
Phone: +44 7426 826595`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="contacts" className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 border-t border-slate-800 scroll-mt-20">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Заголовок */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            {isUk ? 'Офіційні реквізити юрособи UK' : 'Official UK Legal Entity Details'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {isUk ? 'Контакти та реєстрація компанії' : 'Company Contacts & Registration'}
          </h2>
          <p className="max-w-2xl mx-auto text-slate-400 text-sm sm:text-base">
            {isUk 
              ? 'Працюємо за прямими B2B зовнішньоекономічними договорами з 0% UK Export VAT.'
              : 'Direct B2B export contracts from Coventry Hub with 0% UK Export VAT.'}
          </p>
        </div>

        {/* Картки контактів і реквізитів */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Склад і комунікація */}
          <div className="bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" />
              {isUk ? 'Склад і звʼязок' : 'Warehouse & Hub'}
            </h3>
            
            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-1" />
                <div>
                  <div className="font-bold text-white">374 Hipsell Highway, Coventry</div>
                  <div className="text-slate-400">West Midlands, CV2 5FR, United Kingdom</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                <a href="tel:+447426826595" className="hover:text-white transition-colors">
                  +44 7426 826595 (WhatsApp / Direct)
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <a href="mailto:sales@nolimitgoods.co.uk" className="text-white hover:text-red-400 font-semibold transition-colors">
                  sales@nolimitgoods.co.uk
                </a>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{isUk ? 'Прямий експортер запчастин з UK' : 'Verified UK Spare Parts Exporter'}</span>
            </div>
          </div>

          {/* Юридичні реєстраційні дані */}
          <div className="bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-500" />
                  NoLimitGoods Limited
                </h3>
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono font-bold text-slate-300">
                  Active
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500">Company No:</span>
                  <span className="text-white font-bold">13146899</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500">VAT ID:</span>
                  <span className="text-white font-bold">GB 372 6541 87</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500">EORI Number:</span>
                  <span className="text-white font-bold">GB079878335000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500">Zero-Rated VAT:</span>
                  <span className="text-emerald-400 font-bold">0% Export Status</span>
                </div>
              </div>
            </div>

            <button
              onClick={copyDetails}
              className="w-full mt-4 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{isUk ? 'Реквізити скопійовано!' : 'Details Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>{isUk ? 'Скопіювати повні реквізити для договору' : 'Copy Full Company Details'}</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
