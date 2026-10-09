'use client';

import React from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  MessageSquare, 
  Clock, 
  ShieldCheck, 
  FileText,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function ContactSection() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';

  return (
    <section id="contact" className="py-24 bg-slate-950 text-white relative overflow-hidden border-b border-slate-800">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-600/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Заголовок */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs sm:text-sm font-semibold mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{isUk ? 'Офіційні контакти та юридичні реквізити' : 'Official Corporate Contacts & UK Legal Data'}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-white">
            {isUk ? (
              <>Звʼяжіться з нашим <span className="text-red-500">хабом у Великобританії</span></>
            ) : (
              <>Direct Contact with <span className="text-red-500">Our UK Hub</span></>
            )}
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            {isUk
              ? 'Консультуємо щодо підбору номерів деталей Donaldson, JCB, Perkins, узгоджуємо контракти та відвантажуємо щотижня.'
              : 'Direct liaison with our Coventry dispatch office. Fast quoting, T1 documentation, and European transit support.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Ліва колонка: Юридичний паспорт компанії NoLimitGoods Limited */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">NoLimitGoods Limited</h3>
                  <p className="text-xs text-amber-400 font-mono">Incorporated in England & Wales</p>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Active / Verified
              </span>
            </div>

            {/* Таблиця реквізитів */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-850">
                <span className="text-slate-500 block text-[11px] font-semibold uppercase tracking-wider mb-0.5">
                  Company Number (UK):
                </span>
                <span className="text-white font-mono font-bold text-sm">13146899</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-850">
                <span className="text-slate-500 block text-[11px] font-semibold uppercase tracking-wider mb-0.5">
                  UK VAT Registration:
                </span>
                <span className="text-white font-mono font-bold text-sm">GB 372 6541 87</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-850">
                <span className="text-slate-500 block text-[11px] font-semibold uppercase tracking-wider mb-0.5">
                  EORI Number (Customs):
                </span>
                <span className="text-white font-mono font-bold text-sm">GB079878335000</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-850">
                <span className="text-slate-500 block text-[11px] font-semibold uppercase tracking-wider mb-0.5">
                  Managing Director:
                </span>
                <span className="text-white font-bold text-sm">Ivan Tsipan</span>
              </div>
            </div>

            {/* Адреса */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-850 flex items-start gap-3.5 mb-6">
              <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  {isUk ? 'Юридична та складська адреса:' : 'Registered Office & Dispatch Hub:'}
                </span>
                <p className="text-sm font-medium text-slate-200">
                  374 Hipsell Highway, Coventry, West Midlands, CV2 5FR, United Kingdom
                </p>
              </div>
            </div>

            {/* Податковий статус */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
              <span className="font-bold text-amber-300">Прямий експорт (0% UK VAT): </span>
              {isUk 
                ? 'Для українських підприємств рахунки виставляються за нульовою ставкою британського ПДВ (0% Export VAT) на підставі митної декларації T1 / DOUANE.'
                : 'Zero-rated VAT applicable for compliant export freights outside the UK jurisdiction.'}
            </div>
          </div>

          {/* Права колонка: Швидкі кнопки прямого звʼязку */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Телефон / WhatsApp */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
              <h4 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{isUk ? 'Миттєвий звʼязок з менеджером' : 'Direct Dispatch Desk'}</span>
              </h4>

              <div className="space-y-3">
                <a
                  href="tel:+447426826595"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-white transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block font-medium">Телефон хабу (UK):</span>
                      <span className="font-mono font-bold text-sm text-white group-hover:text-red-400 transition-colors">
                        +44 7426 826595
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                </a>

                <a
                  href="mailto:nolimitgoods@gmail.com"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-white transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block font-medium">Офіційний Email:</span>
                      <span className="font-mono font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
                        nolimitgoods@gmail.com
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                </a>
              </div>

              {/* Месенджери в 3 кнопки */}
              <div className="mt-5 pt-5 border-t border-slate-850">
                <span className="text-xs text-slate-400 font-semibold block mb-3">
                  {isUk ? 'Напишіть у зручний месенджер:' : 'Chat directly in messenger:'}
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <a
                    href="viber://chat?number=%2B447426826595"
                    className="py-3 rounded-xl bg-[#7360f2] hover:bg-[#6350e0] text-white font-bold text-xs flex flex-col items-center justify-center gap-1 transition-transform active:scale-95 shadow-md"
                  >
                    <span className="text-sm">🟣</span>
                    <span>Viber</span>
                  </a>

                  <a
                    href="https://wa.me/447426826595"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex flex-col items-center justify-center gap-1 transition-transform active:scale-95 shadow-md"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href="https://t.me/+447426826595"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 rounded-xl bg-[#229ED9] hover:bg-[#1d8dbf] text-white font-bold text-xs flex flex-col items-center justify-center gap-1 transition-transform active:scale-95 shadow-md"
                  >
                    <span className="text-sm">🔵</span>
                    <span>Telegram</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Бейдж графіка роботи */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Графік комплектації: Пн–Пт, 08:00–18:00 (GMT)</span>
              </div>
              <span className="font-mono text-slate-500">Coventry, UK</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
