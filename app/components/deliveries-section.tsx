'use client';

import React from 'react';
import { Truck, CheckCircle2, ShieldCheck, Box, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function DeliveriesSection() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';

  return (
    <section id="deliveries" className="py-20 bg-slate-950 text-white relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Заголовок */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 text-red-400 text-sm font-semibold mb-4 border border-red-500/30">
            <Truck className="w-4 h-4" />
            <span>{isUk ? 'Реальні поставки з Англії в Україну' : 'Real Shipments from the UK to Ukraine'}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-white">
            {isUk ? 'Відео розвантаження та поставок' : 'Warehouse Video Report'}
          </h2>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
            {isUk
              ? 'Живе підтвердження нашої роботи: оригінальні фільтри Donaldson, спецпалети з маркуванням UK, пломби DOUANE та розвантаження на складі в Україні.'
              : 'Direct supply: watch genuine Donaldson filtration pallets arrive from the UK with verified customs seals.'}
          </p>
        </div>

        {/* Контейнер: Одне відео по центру + блок переваг */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center max-w-5xl mx-auto">
          
          {/* Вертикальний плеєр YouTube Shorts */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-[340px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-800 bg-black group hover:border-red-600/50 transition-colors">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/69tvX5AiLz8"
                title="Поставка фільтрів Donaldson в Україну | NoLimitGoods"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* Пункти довіри */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2.5">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <span>{isUk ? 'Гарантія якості та прозорості' : 'Verified Quality & Origin'}</span>
              </h3>

              <ul className="space-y-4">
                <li className="flex items-start gap-3.5">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-100 text-base">
                      {isUk ? '100% Оригінал Donaldson & OEM' : '100% Genuine Donaldson & OEM'}
                    </h4>
                    <p className="text-sm text-slate-400 mt-0.5">
                      {isUk
                        ? 'Поставки фільтрів (P535114, P535115, P558792) напряму з британських хабів без посередників.'
                        : 'Genuine filters shipped directly from UK distribution hubs without middlemen.'}
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 shrink-0 mt-0.5">
                    <Box className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-100 text-base">
                      {isUk ? 'Митне оформлення (DOUANE)' : 'Official Customs Clearance'}
                    </h4>
                    <p className="text-sm text-slate-400 mt-0.5">
                      {isUk
                        ? 'Офіційні декларації, заводські палети та цілісність маркування вантажів UK.'
                        : 'Official export/import declarations, factory pallets and intact seals.'}
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="p-2 rounded-lg bg-red-500/10 text-red-400 shrink-0 mt-0.5">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-100 text-base">
                      {isUk ? 'Швидка видача по Україні' : 'Fast Delivery Across Ukraine'}
                    </h4>
                    <p className="text-sm text-slate-400 mt-0.5">
                      {isUk
                        ? 'Розвантаження на складі, адресна доставка Новою Поштою або палетний довіз вантажу.'
                        : 'Prompt dispatch via Nova Post or direct pallet delivery to client facilities.'}
                    </p>
                  </div>
                </li>
              </ul>

              <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <a
                  href="#rfq"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors shadow-lg cursor-pointer"
                >
                  <span>{isUk ? 'Замовити партію' : 'Request Quotation'}</span>
                </a>

                <a
                  href="https://youtube.com/shorts/69tvX5AiLz8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <span>{isUk ? 'Дивитись на YouTube' : 'Watch on YouTube'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
