'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarDays, Images } from 'lucide-react';
import { AUCTION_CALENDAR, AUCTION_LOTS } from '@/lib/auction-lots';
import { publicPlace } from '@/lib/auction-public';

// Блок на головній: найближчі аукціони техніки за датами (без назв аукціонних домів) —
// перехід до лотів з фото і до календаря на сторінці аукціонів.

const LOTS_BY_AUCTION = AUCTION_LOTS.reduce<Record<string, number>>((m, l) => ((m[l.auction] = (m[l.auction] || 0) + 1), m), {});
const today = () => new Date().toISOString().slice(0, 10);

export default function UpcomingAuctions() {
  // Дату «сьогодні» беремо в браузері, щоб минулі торги зникали без перезбирання сайту
  const [now, setNow] = useState('2026-11-23');
  useEffect(() => setNow(today()), []);
  const items = AUCTION_CALENDAR.filter((c) => c.until >= now)
    .sort((a, b) => Number(b.onSite && !!LOTS_BY_AUCTION[b.auction ?? '']) - Number(a.onSite && !!LOTS_BY_AUCTION[a.auction ?? '']) || 0)
    .slice(0, 8)
    .sort((a, b) => a.until.localeCompare(b.until));
  const totalLots = AUCTION_LOTS.length;

  if (!items.length) return null;

  return (
    <section id="upcoming" className="scroll-mt-28 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-wide">
              <CalendarDays className="w-4 h-4" /> Найближчі аукціони
            </div>
            <h2 className="mt-3 text-2xl md:text-4xl font-black leading-tight text-slate-900">Майбутні торги техніки в Англії, Шотландії та Ірландії</h2>
            <p className="mt-2 text-slate-600 text-[15px] md:text-base max-w-3xl">
              Оберіть лот і назвіть свій ліміт — поставимо за вас. На сайті зараз {totalLots} лотів з фото, ціна під ключ рахується під кожен.
            </p>
          </div>
          <Link href="/aukciony#lots" className="hidden md:inline-flex h-12 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold items-center gap-2 shrink-0">
            Усі лоти з фото <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-5 -mx-4 px-4 sm:mx-0 sm:px-0 flex sm:grid gap-2 sm:grid-cols-2 lg:grid-cols-4 overflow-x-auto snap-x snap-mandatory pb-1">
          {items.map((c) => {
            const n = c.auction ? LOTS_BY_AUCTION[c.auction] || 0 : 0;
            const href = n ? `/aukciony?auction=${c.auction}#lots` : '/aukciony#calendar';
            return (
              <Link key={c.date + c.house + c.title} href={href} className="snap-start shrink-0 w-[62%] sm:w-auto rounded-2xl border border-slate-200 hover:border-red-300 p-4 flex flex-col gap-1">
                <div className="text-lg font-black text-red-600">{c.date}</div>
                <div className="font-bold text-sm text-slate-900 line-clamp-2">{c.title}</div>
                <div className="text-xs text-slate-500">{publicPlace(c.place)}</div>
                <div className="mt-auto pt-2 text-xs font-bold">
                  {n ? (
                    <span className="inline-flex items-center gap-1 text-terra-700"><Images className="w-3.5 h-3.5" /> {n} лотів з фото на сайті</span>
                  ) : (
                    <span className="text-slate-500">Підберемо лот за запитом</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <Link href="/aukciony#lots" className="md:hidden h-12 rounded-xl bg-red-600 text-white font-bold flex items-center justify-center gap-2">
            Усі лоти з фото <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/aukciony#calendar" className="h-12 px-5 rounded-xl border border-slate-300 hover:border-red-300 font-bold flex items-center justify-center gap-2 text-slate-800">
            <CalendarDays className="w-4 h-4" /> Календар аукціонів
          </Link>
          <Link href="/rezultaty-aukcioniv" className="h-12 px-5 rounded-xl border border-terra-300 bg-terra-50 hover:bg-terra-100 font-bold flex items-center justify-center gap-2 text-terra-800">
            За скільки продали і ціна під ключ <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
