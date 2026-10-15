'use client';

import React from 'react';
import { ShieldCheck, Truck, Clock, Award, Star, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function TrustBanner() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';

  const metrics = [
    {
      icon: ShieldCheck,
      title: isUk ? '0% UK Export VAT' : '0% UK Export VAT',
      desc: isUk ? 'Офіційний нульовий експортний статус' : 'Zero-rated UK tax invoicing',
    },
    {
      icon: Truck,
      title: isUk ? 'Nova Post Global' : 'Nova Post Global',
      desc: isUk ? 'Прямі щотижневі рейси Ковентрі ➔ Україна' : 'Weekly UK ➔ UA dispatch corridor',
    },
    {
      icon: Award,
      title: isUk ? 'Понад 200 замовлень' : '200+ Dispatched Orders',
      desc: isUk ? 'Досвід прямих поставок запчастин з UK' : 'Proven track record of UK-UA logistics',
    },
    {
      icon: Clock,
      title: isUk ? 'Швидкий розрахунок' : 'Instant RFQ Sourcing',
      desc: isUk ? 'Сканування 50+ хабів за лічені секунди' : 'Scanning 50+ hubs live',
    },
  ];

  return (
    <section className="bg-slate-900 border-y border-slate-800/80 py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Блок показників */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/60 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/20 text-red-500 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-0.5">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Безпечний блок відгуків клієнтів та гарантій */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-600/10 border border-red-500/30 flex items-center justify-center shrink-0 text-red-500">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-white font-bold text-sm tracking-tight">
                  {isUk ? 'Перевірений B2B-партнер' : 'Verified B2B Partner'}
                </span>
                <span className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 text-[10px] font-mono font-bold">
                  UK Hub Coventry
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isUk ? 'Прямі контракти, митна документація Т1, повне страхування.' : 'Direct contracts, T1 customs, full insurance.'}
              </p>
            </div>
          </div>

          <div className="text-center md:text-right text-xs text-slate-400 max-w-xl">
            <p className="italic text-slate-300">
              {isUk 
                ? '«Замовляємо оригінальні фільтри та гідравліку безпосередньо на склад. Доставка через хаб у Ковентрі чітко за графіком, інвойси нульові.»'
                : '«Direct supply of OEM filters and hydraulic spares. Execution on schedule with zero-rated invoices.»'}
            </p>
            <span className="block mt-1 text-[11px] font-mono text-slate-500">— Agro & Plant Equipment Logistics, Ukraine</span>
          </div>
        </div>

      </div>
    </section>
  );
}
