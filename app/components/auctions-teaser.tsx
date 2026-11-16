'use client';

import React from 'react';
import Link from 'next/link';
import { Gavel, ArrowRight } from 'lucide-react';
import { AUCTIONS, AUCTION_LOTS, FEE } from '@/lib/auction-lots';

// Блок на головній: веде на сторінку аукціонів спецтехніки
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
            {AUCTION_LOTS.length} лотів з {AUCTIONS.map((a) => a.house).filter((v, i, arr) => arr.indexOf(v) === i).join(' та ')}:
            екскаватори, JCB 3CX, телескопи, трактори, генератори. Ставимо за вашим лімітом, комісія {FEE.highPct}–{FEE.lowPct}%,
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
    </section>
  );
}
