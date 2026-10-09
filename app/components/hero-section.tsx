'use client';

import React from 'react';
import { ArrowRight, ShieldCheck, Truck, Clock, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function HeroSection() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';

  return (
    <section className="relative bg-slate-950 text-white pt-24 pb-20 overflow-hidden border-b border-slate-800">
      {/* Фоновий градієнт */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(220,38,38,0.15),rgba(255,255,255,0))]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Бейдж юридичної реєстрації в UK */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs sm:text-sm font-semibold mb-6 shadow-inner">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {isUk
                ? 'Офіційна британська компанія NoLimitGoods Ltd • Ковентрі, Англія'
                : 'Registered UK Supplier NoLimitGoods Ltd • Coventry, England'}
            </span>
          </div>

          {/* Головний заголовок: ХТО МИ Є */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight mb-6">
            {isUk ? (
              <>
                Постачання оригінальних запчастин <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">з Британії в Україну</span>
              </>
            ) : (
              <>
                Direct Machinery & Fleet Parts <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">from the UK</span>
              </>
            )}
          </h1>

          {/* Опис: Що ми робимо */}
          <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            {isUk
              ? 'Прямий доступ до британських складів Donaldson, Perkins, JCB, CAT, Rexroth без посередників. Офіційний експорт (EORI / VAT), повне митне оформлення та експрес-доставка палетами чи посилками прямо у ваше місто.'
              : 'Direct supply chain from UK distribution hubs. Genuine filters, hydraulics and powertrain components with full customs compliance and door-to-door delivery across Ukraine.'}
          </p>

          {/* Кнопки дій */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <a
              href="#rfq"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-base transition-all shadow-xl hover:shadow-red-600/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isUk ? 'Розрахувати вартість (RFQ)' : 'Instant RFQ Estimation'}</span>
              <ArrowRight className="w-5 h-5" />
            </a>

            <a
              href="#deliveries"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-base transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isUk ? 'Дивитись відео зі складу' : 'Watch Warehouse Video'}</span>
            </a>
          </div>

          {/* Ключові цифри та факти довіри */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left border-t border-slate-800/80 pt-10">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-red-500 font-bold text-2xl mb-1">100%</div>
              <div className="text-xs text-slate-400 font-medium">
                {isUk ? 'Оригінальні фільтри та OEM' : 'Genuine OEM Parts'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-red-500 font-bold text-2xl mb-1">5–8 {isUk ? 'днів' : 'days'}</div>
              <div className="text-xs text-slate-400 font-medium">
                {isUk ? 'Пряма експрес-доставка' : 'Direct UK Logistics'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-red-500 font-bold text-2xl mb-1">DOUANE</div>
              <div className="text-xs text-slate-400 font-medium">
                {isUk ? 'Повне митне очищення' : 'Full Customs Clearance'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-red-500 font-bold text-2xl mb-1">UK Ltd</div>
              <div className="text-xs text-slate-400 font-medium">
                {isUk ? 'Прямий британський інвойс' : 'Official UK Invoicing'}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
