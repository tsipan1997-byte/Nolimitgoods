'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MousePointerClick, ShoppingCart, MessageSquare, X } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { JCB_444_ENGINE, type Diagram, type Hotspot } from '@/lib/diagrams';
import { CATALOG, TYPE_LABEL } from '@/lib/catalog';
import { clientPriceGbp, fmtGbp, fmtUah, loadRates, shippingGbp, type Rates } from '@/lib/pricing';
import { addToCart } from './quote-cart';

export default function InteractiveDiagram({ diagram = JCB_444_ENGINE }: { diagram?: Diagram }) {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';
  const [rates, setRates] = useState<Rates | null>(null);
  const [active, setActive] = useState<Hotspot | null>(null);
  const [added, setAdded] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // На телефоні панель під картинкою — підгортаємо до неї
  const pick = (h: Hotspot) => {
    setActive(h);
    if (window.innerWidth < 1024) {
      setTimeout(() => panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
    }
  };

  useEffect(() => {
    loadRates().then(setRates);
  }, []);

  const item = active?.catalogId ? CATALOG.find((c) => c.id === active.catalogId) : undefined;
  const gbp = item ? clientPriceGbp(item, rates) : null;
  const ship = item ? shippingGbp(item.weightKg, item.oversized) : null;

  const askPrice = (h: Hotspot) => {
    window.dispatchEvent(
      new CustomEvent('nlg:select-part', { detail: { oem: `${h.uk} — ${diagram.machineUk}`, brand: diagram.machineUk } })
    );
    // На сторінці каталогу форми немає — ведемо на головну до форми
    if (!document.getElementById('parts-calculator')) {
      window.location.href = '/#parts-calculator';
    }
  };

  const panel = active && (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase font-bold tracking-wider text-red-400">{isUk ? diagram.machineUk : diagram.machineEn}</p>
          <h3 className="text-xl font-black text-white mt-1">{isUk ? active.uk : active.en}</h3>
        </div>
        <button type="button" onClick={() => setActive(null)} className="p-1 text-slate-500 hover:text-white" aria-label="Close">
          <X className="w-5 h-5" />
        </button>
      </div>
      <p className="text-sm text-slate-400 mt-2">{isUk ? active.descUk : active.descEn}</p>

      {item ? (
        <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${TYPE_LABEL[item.type].cls}`}>
              {isUk ? TYPE_LABEL[item.type].uk : TYPE_LABEL[item.type].en}
            </span>
            <span className="font-mono text-sm text-white">{item.partNumber}</span>
          </div>
          <div className="mt-3 flex items-baseline gap-3 flex-wrap">
            <span className="text-sm text-slate-400">{isUk ? 'від' : 'from'}</span>
            <span className="text-3xl font-black text-white">{gbp !== null ? fmtGbp(gbp) : '—'}</span>
            {gbp !== null && rates && <span className="text-amber-300 font-semibold">≈ {fmtUah(gbp * rates.uah.GBP)}</span>}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {ship !== null ? (isUk ? `+ доставка в Україну ${fmtGbp(ship)}` : `+ delivery ${fmtGbp(ship)}`) : ''}
          </div>
          <button
            type="button"
            onClick={() => {
              addToCart(item.id);
              setAdded(true);
              setTimeout(() => setAdded(false), 1500);
            }}
            className={`mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white ${
              added ? 'bg-emerald-600' : 'bg-red-600 hover:bg-red-500'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {added ? (isUk ? 'Додано в запит' : 'Added') : isUk ? 'Додати в запит' : 'Add to quote'}
          </button>
          <p className="text-[11px] text-slate-500 mt-2">
            {isUk ? 'Є оригінал і інші аналоги — уточнимо у відповідь.' : 'Genuine and other options available on request.'}
          </p>
        </div>
      ) : (
        <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="text-lg font-black text-white">{isUk ? 'Ціна на запит' : 'Price on request'}</div>
          <p className="text-xs text-slate-400 mt-1">
            {isUk ? 'Порахуємо оригінал, аналог і б/у під ваш серійний номер двигуна.' : 'We quote genuine, aftermarket and used for your engine serial.'}
          </p>
          <button
            type="button"
            onClick={() => askPrice(active)}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-sm font-bold text-white"
          >
            <MessageSquare className="w-4 h-4" />
            {isUk ? 'Запитати ціну' : 'Request price'}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <section id="diagram" className="py-20 sm:py-24 bg-slate-950 border-b border-slate-800 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-400 mb-3">{isUk ? 'Інтерактивна схема' : 'Interactive diagram'}</p>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">{isUk ? diagram.titleUk : diagram.titleEn}</h2>
          <p className="mt-4 text-slate-400 text-base sm:text-lg flex items-center gap-2">
            <MousePointerClick className="w-5 h-5 text-red-400 shrink-0" />
            {isUk ? 'Натисніть на червону точку — побачите назву деталі й ціну.' : 'Tap a red dot to see the part name and price.'}
          </p>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_380px] gap-8 items-start">
          <div className="relative mx-auto w-full max-w-[640px] rounded-2xl overflow-hidden border border-slate-800 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={diagram.image} alt={isUk ? diagram.titleUk : diagram.titleEn} width={diagram.width} height={diagram.height} className="w-full h-auto block" />
            {diagram.hotspots.map((h) => {
              const on = active?.id === h.id;
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => pick(h)}
                  style={{ left: `${h.x}%`, top: `${h.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  aria-label={isUk ? h.uk : h.en}
                >
                  <span className={`absolute inset-0 rounded-full bg-red-500/50 ${on ? '' : 'animate-ping'}`} />
                  <span
                    className={`relative flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white shadow-lg text-[10px] font-black text-white ${
                      on ? 'bg-slate-900 scale-125' : 'bg-red-600'
                    } transition-transform`}
                  >
                    {h.catalogId ? '£' : '+'}
                  </span>
                  <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-1 whitespace-nowrap px-2 py-0.5 rounded bg-slate-900 text-white text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    {isUk ? h.uk : h.en}
                  </span>
                </button>
              );
            })}
            <span className="absolute bottom-2 right-3 text-[10px] text-slate-500 bg-white/80 px-1.5 rounded">
              {isUk ? 'схема ілюстративна' : 'illustrative diagram'}
            </span>
          </div>

          <div ref={panelRef} className="lg:sticky lg:top-24 space-y-4">
            {panel || (
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-dashed border-slate-700 text-slate-400 text-sm">
                {isUk
                  ? 'Оберіть деталь на схемі. Точки з «£» мають ціну в каталозі, з «+» — рахуємо під запит.'
                  : 'Pick a part on the diagram. “£” dots have a catalog price; “+” dots are quoted on request.'}
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              {diagram.hotspots.filter((h) => h.catalogId).map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setActive(h)}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                    active?.id === h.id ? 'bg-red-600 border-red-600 text-white' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {isUk ? h.uk : h.en}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
