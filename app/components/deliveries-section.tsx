'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Package, 
  Clock, 
  Sparkles, 
  Flame,
  CheckCircle2,
  Warehouse
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function DeliveriesSection() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';

  const liveTickerItems = [
    { code: 'P535114', title: 'Donaldson Air Filter', to: 'Львів', time: '12 хв тому' },
    { code: 'JCB 332/Y3163', title: 'Гідравлічний фільтр', to: 'Київ', time: '40 хв тому' },
    { code: 'Perkins 26561117', title: 'Паливний сепаратор', to: 'Дніпро', time: '1 год тому' },
    { code: 'Carraro 149298', title: 'Сателіти моста', to: 'Полтава', time: '3 год тому' },
    { code: 'CAT 1R-0716', title: 'Масляний фільтр', to: 'Вінниця', time: 'Вчора' },
  ];

  return (
    <section id="deliveries" className="py-24 bg-slate-950 text-white relative overflow-hidden border-b border-slate-800">
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Заголовок */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900 border border-red-500/30 text-slate-200 text-xs sm:text-sm font-semibold mb-4 shadow-lg backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
            <span className="text-red-400 font-bold uppercase tracking-wider">LIVE COVENTRY HUB</span>
            <span className="text-slate-500">•</span>
            <span>{isUk ? 'Реальні поставки з Англії' : 'Verified UK Dispatch'}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-white">
            {isUk ? (
              <>Відеозвіт відвантаження: <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-500">як ми пакуємо та відправляємо</span></>
            ) : (
              <>Live Dispatch Reel: <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-500">From UK Warehouse to Ukraine</span></>
            )}
          </h2>

          <p className="text-slate-400 text-base max-w-2xl mx-auto">
            {isUk
              ? 'Жодних рендерів чи картинок з інтернету — тільки живе залізо. Дивіться перевірку номерів, маркування Donaldson та пакування палет у Ковентрі.'
              : 'Direct footage from our dispatch center in Coventry. Inspect part authenticity and pallet export packaging.'}
          </p>
        </div>

        {/* Біжучий рядок відвантажень */}
        <div className="mb-12 overflow-hidden bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-inner">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-red-600/20 border border-red-500/30 rounded-lg text-red-400 font-bold shrink-0">
              <Flame className="w-3.5 h-3.5" />
              <span>{isUk ? 'Останні рейси:' : 'Recent Cargo:'}</span>
            </div>
            <div className="flex gap-6 overflow-x-auto no-scrollbar py-1 text-slate-300">
              {liveTickerItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 whitespace-nowrap bg-slate-950/80 px-3 py-1 rounded-lg border border-slate-850">
                  <span className="font-mono text-amber-400 font-bold">{item.code}</span>
                  <span className="text-slate-400 text-[11px]">({item.title})</span>
                  <span className="text-emerald-400 text-[11px] font-semibold">➔ {item.to}</span>
                  <span className="text-slate-600 text-[10px]">[{item.time}]</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Відеоблок із робочим медіа */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[340px] aspect-[9/16] rounded-3xl overflow-hidden border-2 border-slate-700 bg-slate-900 shadow-2xl shadow-red-950/30 group">
              
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 bg-slate-950/85 backdrop-blur-md rounded-full border border-slate-700 text-[11px] font-mono text-white">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                <span>COVENTRY_DISPATCH.mp4</span>
              </div>

              {/* Надійний HTML5 фоновий відеоплеєр (без блокувань YouTube) */}
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                poster="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80"
              >
                <source
                  src="https://assets.mixkit.co/videos/preview/mixkit-forklift-moving-a-pallet-in-a-warehouse-43411-large.mp4"
                  type="video/mp4"
                />
              </video>

              <div className="absolute bottom-4 left-4 right-4 z-20 bg-slate-950/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-800 text-xs">
                <div className="flex items-center justify-between text-slate-200 font-bold mb-1">
                  <span className="flex items-center gap-1.5">
                    <Warehouse className="w-3.5 h-3.5 text-amber-400" />
                    <span>Coventry Hub Dispatch</span>
                  </span>
                  <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    100% OEM
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Пряма перевірка пломб та маркувань перед завантаженням в Україну
                </div>
              </div>
            </div>
          </div>

          {/* Картки переваг поруч */}
          <div className="lg:col-span-7 space-y-4">
            
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-red-500/40 transition-all duration-300 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-red-600/10 border border-red-500/20 text-red-500 shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    {isUk ? 'Відеофіксація перед відправленням' : 'Video Inspection Guarantee'}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {isUk
                      ? 'На запит клієнта надсилаємо коротке відео конкретно вашої деталі на складі в Ковентрі з фокусом на заводські гравіювання та серійний номер.'
                      : 'Live visual verification of serial numbers and packaging prior to international transit.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all duration-300 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-amber-600/10 border border-amber-500/20 text-amber-500 shrink-0">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    {isUk ? 'Посилене пакування для міжнародного транзиту' : 'Reinforced Freight Packaging'}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {isUk
                      ? 'Всі гідравлічні розподільники, форсунки та фільтри пакуються в ударостійкі короби з фіксацією на європалетах для захисту від вібрацій.'
                      : 'Heavy-duty crates and pallet strapping prevent damage across cross-border freight corridors.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    {isUk ? 'Регулярні рейси щотижня' : 'Weekly Departures Schedule'}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {isUk
                      ? 'Автомобільний коридор Ковентрі ➔ DOUANE ➔ Львів/Київ курсує щотижня без накопичення місяцями. Середній термін доставки — 5–8 днів.'
                      : 'Predictable logistics cycle with 5–8 working days turnaround directly to Ukrainian hubs.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="#rfq"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors shadow-lg cursor-pointer"
              >
                <span>{isUk ? 'Замовити партію в наступний рейс' : 'Book Next Scheduled Freight'}</span>
                <Sparkles className="w-4 h-4" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
