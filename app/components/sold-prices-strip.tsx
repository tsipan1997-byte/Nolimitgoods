'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';
import LotPhoto from './lot-photo';
import { allResults, type AuctionResult } from '@/lib/auction-results';
import type { AuctionCategory } from '@/lib/auction-lots';
import { turnkeyGbp } from '@/lib/turnkey';

// Блок на головній одразу під першим екраном: за скільки реально продали техніку на аукціоні
// і скільки вона коштувала б під ключ в Україні. Тільки техніка (без ковшів, молотів, генераторів).

const ORDER: AuctionCategory[] = ['agro', 'excavators', 'telehandlers', 'trucks', 'pickups'];

// По черзі з кожної категорії — найдорожчі лоти, щоб у стрічці були і трактори, і екскаватори, і телескопи
function pick(n: number): AuctionResult[] {
  const all = allResults().filter((r) => ORDER.includes(r.category) && r.img);
  const byCat = ORDER.map((c) => all.filter((r) => r.category === c).sort((a, b) => b.bid - a.bid));
  const out: AuctionResult[] = [];
  for (let i = 0; out.length < n && byCat.some((l) => l[i]); i++) for (const l of byCat) if (l[i] && out.length < n) out.push(l[i]);
  return out;
}
const RESULTS = pick(8);
const TOTAL = allResults().filter((r) => ORDER.includes(r.category)).length;

type Rates = { eur: number; usd: number };
const FALLBACK: Rates = { eur: 1.17, usd: 1.3 };

const sp = (n: number) => n.toLocaleString('uk-UA').replace(/ /g, ' ');
const rnd = (n: number) => Math.round(n / (n > 20000 ? 500 : 100)) * (n > 20000 ? 500 : 100);

export default function SoldPricesStrip() {
  const [rates, setRates] = useState<Rates>(FALLBACK);
  useEffect(() => {
    fetch('/api/rates')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d?.uah && setRates({ eur: d.uah.GBP / d.uah.EUR, usd: d.uah.GBP / d.uah.USD }))
      .catch(() => {});
  }, []);

  if (!RESULTS.length) return null;

  return (
    <section id="sold" className="scroll-mt-28 bg-emerald-50/60 border-y border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wide">
              <TrendingUp className="w-4 h-4" /> Реальні ціни продажу
            </div>
            <h2 className="mt-3 text-2xl md:text-4xl font-black leading-tight text-slate-900">За скільки пішла техніка на аукціоні — і скільки це під ключ в Україні</h2>
            <p className="mt-2 text-slate-600 text-[15px] md:text-base max-w-3xl">
              Фінальні ціни молотка, підтверджені аукціоном, і орієнтир під ключ: з комісіями, доставкою і розмитненням. Щоб ви знали, на яку суму
              розраховувати.
            </p>
            <p className="mt-2 inline-block rounded-lg bg-amber-50 border border-amber-200 px-3 py-1.5 text-[13px] md:text-sm font-semibold text-amber-800">
              + ПДВ Англії 20% на аукціоні — повертається після експорту техніки, умови обговорюємо з кожним клієнтом індивідуально
            </p>
          </div>
          <Link href="/rezultaty-aukcioniv" className="hidden md:inline-flex h-12 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold items-center gap-2 shrink-0">
            Усі {TOTAL} результатів <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-5 -mx-4 px-4 sm:mx-0 sm:px-0 flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 overflow-x-auto snap-x snap-mandatory pb-1">
          {RESULTS.map((r) => {
            const t = turnkeyGbp(r, r.bid);
            const lo = rnd(t[0]), hi = Math.max(rnd(t[1]), lo);
            return (
              <Link
                key={r.auction + r.item}
                href="/rezultaty-aukcioniv"
                className="snap-start shrink-0 w-[72%] sm:w-auto rounded-2xl border border-slate-200 bg-white overflow-hidden flex flex-col hover:border-emerald-300"
              >
                <div className="relative aspect-[4/3] bg-slate-100">
                  <LotPhoto auction={r.auction} item={r.item} src={r.img} alt={`${r.title} ${r.year ?? ''} — продано на аукціоні в Англії`} />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[11px] font-bold">Продано</span>
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <h3 className="font-black text-sm md:text-base leading-snug line-clamp-2 text-slate-900">{r.title}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {[r.year && `${r.year} р.`, r.hours && `${sp(r.hours)} мотогод.`].filter(Boolean).join(' · ')}
                  </div>
                  <div className="mt-auto pt-2 flex items-end justify-between gap-2">
                    <div>
                      <div className="text-[11px] font-semibold uppercase text-slate-500">Молоток</div>
                      <div className="font-mono text-lg font-bold leading-tight text-slate-900">£{sp(r.bid)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] font-semibold text-emerald-800">Під ключ ≈</div>
                      <div className="font-mono text-sm md:text-base font-bold text-emerald-900 whitespace-nowrap">
                        €{sp(rnd(lo * rates.eur))}–{sp(rnd(hi * rates.eur))}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono whitespace-nowrap">
                        ${sp(rnd(lo * rates.usd))}–{sp(rnd(hi * rates.usd))}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <Link href="/rezultaty-aukcioniv" className="md:hidden mt-4 h-12 rounded-xl bg-emerald-700 text-white font-bold flex items-center justify-center gap-2">
          Усі {TOTAL} результатів і ціни під ключ <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
