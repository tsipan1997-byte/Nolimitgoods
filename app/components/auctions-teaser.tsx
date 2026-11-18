'use client';

import React from 'react';
import Link from 'next/link';
import { Gavel, ArrowRight } from 'lucide-react';
import { AUCTIONS, AUCTION_LOTS, FEE, pct } from '@/lib/auction-lots';
import { lotiv } from '@/lib/plural';

// Блок на головній: веде на сторінку аукціонів спецтехніки
// Плитки напрямків з фото: ведуть на тематичні сторінки
const TILES: { href: string; label: string; pick: (l: (typeof AUCTION_LOTS)[number]) => boolean }[] = [
  { href: '/pikapy-z-anglii', label: 'Пікапи', pick: (l) => /Hilux/.test(l.original) && (l.year ?? 0) >= 2022 },
  { href: '/pikapy-dlia-zsu', label: 'Пікапи для ЗСУ', pick: (l) => /Navara|L200/.test(l.original) && (l.year ?? 0) >= 2019 },
  { href: '/heneratory-z-anglii', label: 'Генератори', pick: (l) => l.category === 'energy' && !!l.year },
  { href: '/samoskydy-z-anglii', label: 'Самоскиди', pick: (l) => l.category === 'trucks' && (l.year ?? 0) >= 2021 },
  { href: '/traktory-z-anglii', label: 'Трактори', pick: (l) => l.category === 'agro' && /Tractor/.test(l.original) },
  { href: '/teleskopichni-navantazhuvachi-z-anglii', label: 'Телескопи', pick: (l) => l.category === 'telehandlers' },
  { href: '/jcb-3cx-z-anglii', label: 'JCB 3CX', pick: (l) => /3CX/.test(l.original) },
  { href: '/ekskavatory-z-anglii', label: 'Екскаватори', pick: (l) => l.category === 'excavators' && /Excavator/.test(l.original) },
];
const TILE_LOTS = TILES.map((t) => ({ ...t, lot: AUCTION_LOTS.find((l) => l.img && t.pick(l)) })).filter((t) => t.lot);

const PREVIEW = ['ea-leeds-nov', 'rb-nov', 'rb-agri-dec']
  .map((id) => AUCTION_LOTS.find((l) => l.auction === id && l.img && l.year && l.year >= 2021))
  .filter(Boolean) as typeof AUCTION_LOTS;

export default function AuctionsTeaser() {
  return (
    <section className="bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid gap-6 lg:grid-cols-[1.1fr_1fr] items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/15 border border-red-500/30 text-red-300 text-xs font-bold uppercase tracking-wide">
            <Gavel className="w-4 h-4" /> Нове: аукціони Великої Британії
          </div>
          <h2 className="mt-3 text-2xl md:text-3xl font-black leading-tight">
            Спецтехніка з аукціонів Англії — купуємо під ваше замовлення
          </h2>
          <p className="mt-3 text-slate-300">
            {AUCTION_LOTS.length} {lotiv(AUCTION_LOTS.length)} з {AUCTIONS.map((a) => a.house).filter((v, i, arr) => arr.indexOf(v) === i).join(' та ')}:
            пікапи, самоскиди, екскаватори, JCB 3CX, телескопи, трактори, генератори. Ставимо за вашим лімітом, комісія {pct(FEE.highPct)}–{pct(FEE.lowPct)}%,
            доставка в Україну.
          </p>
          <Link
            href="/aukciony"
            className="mt-5 inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-red-600 hover:bg-red-700 font-bold"
          >
            Дивитися лоти <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <Link href="/aukciony" className="grid grid-cols-3 gap-2" aria-label="Лоти аукціонів спецтехніки">
          {PREVIEW.map((l) => (
            <div key={l.item} className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={l.img} alt={l.title} loading="lazy" referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-2 text-[11px] font-bold leading-tight">
                {l.title}
                {l.year ? `, ${l.year}` : ''}
              </div>
            </div>
          ))}
        </Link>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">Напрямки</div>
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-2 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-4 lg:grid-cols-8 scrollbar-hide">
          {TILE_LOTS.map((t) => (
            <Link key={t.href} href={t.href} className="group snap-start shrink-0 w-36 sm:w-auto relative aspect-[4/5] rounded-xl overflow-hidden bg-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.lot!.img} alt={`${t.label} з аукціонів Англії`} loading="lazy" referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-2.5">
                <div className="font-black text-sm leading-tight">{t.label}</div>
                <div className="text-[11px] text-slate-300 inline-flex items-center gap-1">з Англії <ArrowRight className="w-3 h-3" /></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
