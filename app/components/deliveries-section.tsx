'use client';

import React from 'react';
import { CheckCircle2, ShieldCheck, MapPin, Truck, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function DeliveriesSection() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';

  return (
    <section id="deliveries" className="py-20 bg-slate-950 text-white relative overflow-hidden border-b border-slate-800">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-600/10 blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs sm:text-sm font-semibold mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{isUk ? 'Реальні поставки з Англії в Україну' : 'Real UK ➔ Ukraine Deliveries'}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-white">
            {isUk ? (
              <>Відеозвіт: <span className="text-red-500">посилку отримано</span> в Україні</>
            ) : (
              <>Delivery Report: <span className="text-red-500">Received by Clients</span></>
            )}
          </h2>
          <p className="text-slate-400 text-base max-w-2xl mx-auto">
            {isUk
              ? 'Безпечна логістика без посередників. Розвантаження палет фільтрів Donaldson на базі клієнта.'
              : 'Direct freight chain from Coventry stock to Ukrainian farms and service centers.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
          
          {/* Робочий плеєр Shorts без блокувань */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[320px] aspect-[9/16] rounded-2xl overflow-hidden border-2 border-red-500/40 shadow-2xl bg-black">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/69tvX5AiLz8?playsinline=1&rel=0&modestbranding=1"
                title="Поставка фільтрів Donaldson в Україну | NoLimitGoods LTD"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                {isUk ? 'Фактичне підтвердження вручення' : 'Proof of Delivery'}
              </span>
              <h3 className="text-2xl font-black text-white mb-3">
                {isUk ? 'Поставка фільтрів Donaldson в Україну' : 'Donaldson Filtration Freight in Ukraine'}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {isUk
                  ? 'Кожна палета маркується наліпками DOUANE, комплектується на складі в Ковентрі (374 Hipsell Highway), страхується на повну інвойсну вартість та доставляється клієнтам у цілості.'
                  : 'Palletized consignments with T1 transit documentation. Dispatched from Coventry and received directly at Ukrainian equipment terminals.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white mb-0.5">
                    {isUk ? 'Оригінальні пломби OEM' : 'OEM Factory Seals'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {isUk ? 'Заводські палети P535114, P535115' : 'Verified batch and part numbers'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                <Truck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white mb-0.5">
                    {isUk ? 'Палетна та експрес-доставка' : 'Pallet Freight Corridor'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {isUk ? 'Щотижневі прямі рейси UK ➔ UA' : 'Weekly UK ➔ UA Freight'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white mb-0.5">
                    {isUk ? 'Склад (Coventry, UK)' : 'Coventry Hub Direct'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    374 Hipsell Highway, CV2 5FR
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white mb-0.5">
                    {isUk ? 'Митниця DOUANE / 0% VAT' : 'Customs Cleared'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {isUk ? 'Повний пакет експортних документів' : 'Zero-rated UK VAT invoicing'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="#rfq"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-red-600/30"
              >
                <span>{isUk ? 'Замовити партію або деталь' : 'Request Freight Dispatch'}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
