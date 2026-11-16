'use client';

import React, { useState } from 'react';
import { ShoppingCart, Check, Wrench } from 'lucide-react';
import { TYPE_LABEL, GROUPS, type CatalogItem } from '@/lib/catalog';
import { clientPriceGbp, fmtGbp, fmtUah, shippingGbp, type Rates } from '@/lib/pricing';
import { addToCart } from './quote-cart';

export default function ProductCard({ item, rates, isUk }: { item: CatalogItem; rates: Rates | null; isUk: boolean }) {
  const [added, setAdded] = useState(false);
  const t = TYPE_LABEL[item.type];
  const gbp = clientPriceGbp(item, rates);
  const uah = gbp !== null && rates ? gbp * rates.uah.GBP : null;
  const ship = shippingGbp(item.weightKg, item.oversized);
  const group = GROUPS.find((g) => g.id === item.group);

  const add = () => {
    addToCart(item.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article className="group flex flex-col rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-600 overflow-hidden transition-colors">
      <div className="relative aspect-[4/3] bg-white">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt={`${item.brand} ${item.partNumber}`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-[1.03] transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500">
            <Wrench className="w-10 h-10 mb-2 text-slate-400" />
            <span className="font-mono text-lg font-bold text-slate-700">{item.partNumber}</span>
            <span className="text-[11px] uppercase tracking-wider mt-1">{group ? (isUk ? group.uk : group.en) : ''}</span>
          </div>
        )}
        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur ${t.cls}`}>
          {isUk ? t.uk : t.en}
        </span>
        {item.imageIllustrative && (
          <span className="absolute bottom-2 right-3 text-[10px] text-slate-500">{isUk ? 'фото ілюстративне' : 'illustrative photo'}</span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{item.brand}</div>
        <div className="font-mono text-sm text-white mt-0.5">{item.partNumber}</div>
        <h3 className="text-sm font-semibold text-slate-200 mt-2 leading-snug">{isUk ? item.titleUk : item.titleEn}</h3>
        <div className="text-xs text-slate-500 mt-1">{isUk ? item.fitsUk : item.fitsEn}</div>

        <div className="mt-auto pt-4">
          <div className="text-2xl font-black text-white">{gbp !== null ? fmtGbp(gbp) : '—'}</div>
          <div className="text-sm font-semibold text-amber-300 min-h-[1.25rem]">{uah !== null ? `≈ ${fmtUah(uah)}` : ''}</div>
          <div className="text-xs text-slate-400 mt-1">
            {ship !== null
              ? isUk ? `+ доставка в Україну ${fmtGbp(ship)}` : `+ delivery ${fmtGbp(ship)}`
              : isUk ? '+ доставка (рахуємо окремо)' : '+ delivery (quoted)'}
          </div>
          <button
            type="button"
            onClick={add}
            className={`mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors border ${
              added ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-slate-800 hover:bg-red-600 border-slate-700 hover:border-red-600 text-white'
            }`}
          >
            {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
            <span>{added ? (isUk ? 'Додано в запит' : 'Added') : isUk ? 'Додати в запит' : 'Add to quote'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
