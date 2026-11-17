'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Building2, Check, Copy, ExternalLink, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { CONTACT } from '@/lib/site-config';

export default function ContactSection() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';
  const [copied, setCopied] = useState(false);

  const copyDetails = () => {
    const text = `NoLimitGoods Limited
Company No: 13146899
VAT ID: GB 372 6541 87
EORI: GB079878335000
Address: 374 Hipswell Highway, Coventry, West Midlands, CV2 5FR, United Kingdom
Email: ${CONTACT.email}
Phone: ${CONTACT.phoneUk}${CONTACT.phoneUa ? `\nWhatsApp/Viber: ${CONTACT.phoneUa}` : ''}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="contacts" className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Заголовок */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-300 text-slate-600 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            {isUk ? 'Офіційні реквізити юрособи UK' : 'Official UK Legal Entity Details'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {isUk ? 'Контакти та реєстрація компанії' : 'Company Contacts & Registration'}
          </h2>
          <p className="max-w-2xl mx-auto text-slate-500 text-sm sm:text-base">
            {isUk 
              ? 'Працюємо як британська компанія: договір, інвойс і всі документи для митного оформлення.'
              : 'We operate as a UK company: contract, invoice and full customs paperwork.'}
          </p>
        </div>

        {/* Картки контактів і реквізитів */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Склад і комунікація */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" />
              {isUk ? 'Склад і звʼязок' : 'Warehouse & Hub'}
            </h3>
            
            <div className="space-y-4 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-1" />
                <div>
                  <div className="font-bold text-slate-900">374 Hipswell Highway, Coventry</div>
                  <div className="text-slate-500">West Midlands, CV2 5FR, United Kingdom</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                <a href={`tel:${CONTACT.phoneUk.replace(/\s/g, '')}`} className="hover:text-slate-900 transition-colors">
                  {CONTACT.phoneUk} ({CONTACT.phoneUa ? (isUk ? 'дзвінки / Telegram' : 'Calls / Telegram') : 'WhatsApp / Telegram / Direct'})
                </a>
              </div>

              {CONTACT.phoneUa && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                  <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">
                    {CONTACT.phoneUa} (WhatsApp / Viber)
                  </a>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <a href={`mailto:${CONTACT.email}`} className="text-slate-900 hover:text-red-600 font-semibold transition-colors">
                  {CONTACT.email}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <a href={`mailto:${CONTACT.personalEmail}`} className="hover:text-slate-900 transition-colors">
                  {CONTACT.personalEmail} <span className="text-slate-400">({CONTACT.personName})</span>
                </a>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center gap-2 text-xs text-emerald-600">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{isUk ? 'Прямий експортер запчастин з UK' : 'Verified UK Spare Parts Exporter'}</span>
            </div>
          </div>

          {/* Юридичні реєстраційні дані */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-500" />
                  NoLimitGoods Limited
                </h3>
                <span className="px-2.5 py-1 rounded bg-white border border-slate-200 text-[11px] font-mono font-bold text-slate-600">
                  Active
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Company No:</span>
                  <span className="text-slate-900 font-bold">13146899</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">VAT ID:</span>
                  <span className="text-slate-900 font-bold">GB 372 6541 87</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">EORI Number:</span>
                  <span className="text-slate-900 font-bold">GB079878335000</span>
                </div>
              </div>
            </div>

            <button
              onClick={copyDetails}
              className="w-full mt-4 py-2.5 px-4 rounded-xl bg-white hover:bg-slate-200 border border-slate-300 text-slate-900 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{isUk ? 'Реквізити скопійовано!' : 'Details Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
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
