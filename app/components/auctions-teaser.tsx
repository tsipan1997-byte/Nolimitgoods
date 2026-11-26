'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Gavel, ArrowRight, Clock, Send } from 'lucide-react';
import { useTenant } from '@/lib/tenant-context';
import { feeLabels } from '@/lib/turnkey';
import { AUCTIONS, AUCTION_LOTS, FEE, pct, type AuctionLot } from '@/lib/auction-lots';
import { lotiv } from '@/lib/plural';

// Блок аукціонів на головній, світлий стиль:
// відлік до найближчих торгів + лічильники (варіант A), категорії з фото (B), чесна ціна (D).

const TILES: { href: string; label: string; pick: (l: AuctionLot) => boolean; count: (l: AuctionLot) => boolean }[] = [
  { href: '/pikapy-z-anglii', label: 'Пікапи', pick: (l) => /Hilux/.test(l.original) && (l.year ?? 0) >= 2022, count: (l) => l.category === 'pickups' },
  { href: '/samoskydy-z-anglii', label: 'Самоскиди', pick: (l) => l.category === 'trucks' && (l.year ?? 0) >= 2021, count: (l) => l.category === 'trucks' },
  { href: '/heneratory-z-anglii', label: 'Генератори', pick: (l) => l.category === 'energy' && !!l.year, count: (l) => l.category === 'energy' },
  { href: '/traktory-z-anglii', label: 'Трактори', pick: (l) => l.category === 'agro' && /Tractor/.test(l.original), count: (l) => l.category === 'agro' },
  { href: '/ekskavatory-z-anglii', label: 'Екскаватори', pick: (l) => l.category === 'excavators' && /Excavator/.test(l.original), count: (l) => l.category === 'excavators' },
  { href: '/teleskopichni-navantazhuvachi-z-anglii', label: 'Телескопи', pick: (l) => l.category === 'telehandlers', count: (l) => l.category === 'telehandlers' },
  { href: '/jcb-3cx-z-anglii', label: 'JCB 3CX', pick: (l) => /3CX/.test(l.original), count: (l) => /3CX|4CX|backhoe/i.test(l.original) },
  { href: '/gidromoloty-z-anglii', label: 'Гідромолоти', pick: (l) => l.category === 'breakers', count: (l) => l.category === 'breakers' },
];
const TILE_LOTS = TILES.map((t) => ({
  ...t,
  lot: AUCTION_LOTS.find((l) => l.img && t.pick(l)),
  n: AUCTION_LOTS.filter(t.count).length,
})).filter((t) => t.lot);

// Стрічка «скоро торги»: свіжі лоти з різних категорій
const FEED = (['pickups', 'trucks', 'excavators', 'telehandlers', 'agro', 'energy'] as const)
  .map((c) => AUCTION_LOTS.filter((l) => l.category === c && l.img && !l.inoperable).sort((a, b) => (b.year ?? 0) - (a.year ?? 0))[0])
  .filter(Boolean) as AuctionLot[];

const dayFmt = new Intl.DateTimeFormat('uk-UA', { timeZone: 'Europe/Kyiv', day: 'numeric', month: 'long' });

function left(ms: number, now: number) {
  const d = ms - now;
  if (d <= 0) return 'вже йдуть';
  const days = Math.floor(d / 86_400_000);
  const h = Math.floor((d % 86_400_000) / 3_600_000);
  const m = Math.floor((d % 3_600_000) / 60_000);
  return days > 0 ? `${days}д ${h}г` : `${h}г ${m}хв`;
}

export default function AuctionsTeaser() {
  const { social: SOCIAL, pricing } = useTenant();
  const fee = feeLabels(pricing);
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);
  const next = useMemo(() => (now ? AUCTION_LOTS.filter((l) => l.endsAt > now).sort((a, b) => a.endsAt - b.endsAt)[0] : null), [now]);
  const nextHouse = next ? AUCTIONS.find((a) => a.id === next.auction) : null;

  return (
    <section className="bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Заголовок + відлік */}
        <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-wide">
              <Gavel className="w-4 h-4" /> Аукціони Великої Британії
            </div>
            <h2 className="mt-3 text-2xl md:text-4xl font-black leading-tight text-slate-900">Ставимо за вас на аукціонах Англії</h2>
            <p className="mt-2 text-slate-600 text-[15px] md:text-base max-w-2xl">
              Пікапи, самоскиди, екскаватори, трактори, генератори. Ви називаєте ліміт — ми торгуємось, викуповуємо й доставляємо в Україну.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-[11px] font-semibold uppercase text-slate-500">Лотів з фото</div>
              <div className="mt-0.5 font-mono text-xl md:text-2xl font-bold text-slate-900">{AUCTION_LOTS.length}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-[11px] font-semibold uppercase text-slate-500 inline-flex items-center gap-1">
                <Clock className="w-3 h-3" /> До торгів
              </div>
              <div className="mt-0.5 font-mono text-[15px] leading-7 md:text-2xl font-bold text-slate-900 whitespace-nowrap">{next && now ? left(next.endsAt, now) : '…'}</div>
              {nextHouse && next && (
                <div className="text-[10px] text-slate-500 truncate">
                  Торги {dayFmt.format(new Date(next.endsAt))}
                </div>
              )}
            </div>
            <div className="rounded-2xl bg-red-600 p-3 text-white">
              <div className="text-[11px] font-semibold uppercase text-red-100">Комісія від</div>
              <div className="mt-0.5 font-mono text-xl md:text-2xl font-bold">{fee.from}</div>
            </div>
          </div>
        </div>

        {/* Категорії з фото */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {TILE_LOTS.map((t) => (
            <Link key={t.href} href={t.href} className="group relative aspect-[4/3] sm:aspect-[4/5] rounded-2xl overflow-hidden bg-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.lot!.img} alt={`${t.label} з аукціонів Англії`} loading="lazy" referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-2.5 text-white">
                <div className="font-black text-sm leading-tight">{t.label}</div>
                <div className="text-[11px] text-slate-200">
                  {t.n} {lotiv(t.n)}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Скоро торги + чесна ціна */}
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <div className="flex items-baseline justify-between">
              <h3 className="font-black text-lg text-slate-900">Скоро торги</h3>
              <Link href="/aukciony#lots" className="text-sm font-bold text-red-600 inline-flex items-center gap-1">
                Усі {AUCTION_LOTS.length} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="mt-3 grid sm:grid-cols-2 gap-2.5">
              {FEED.map((l) => (
                <Link key={l.item} href="/aukciony#lots" className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-2.5 hover:border-red-300 transition-colors">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={l.img} alt={l.title} loading="lazy" referrerPolicy="no-referrer" className="w-24 h-[72px] rounded-xl object-cover shrink-0 bg-slate-100" />
                  <div className="min-w-0 flex flex-col">
                    <div className="font-bold text-sm leading-snug text-slate-900 line-clamp-2">{l.title}</div>
                    <div className="text-xs text-slate-500">
                      {l.year ? `${l.year} р.` : ''}
                      {l.miles ? ` · ${l.miles.toLocaleString('uk-UA')} км` : l.hours ? ` · ${l.hours.toLocaleString('uk-UA')} мотогод.` : ''}
                    </div>
                    <div className="mt-auto text-xs font-semibold text-red-600">{dayFmt.format(new Date(l.endsAt))}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
            <h3 className="font-black text-lg text-slate-900">Чесна ціна</h3>
            {fee.isPartner ? (
              <div className="mt-3 text-sm text-slate-600">
                <div className="font-mono text-2xl font-bold text-slate-900">{fee.range}</div>
                від ціни лота, мінімум <b className="text-slate-900">{fee.min}</b> за лот
              </div>
            ) : (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <div className="font-mono text-2xl font-bold text-slate-900">{pct(FEE.lowPct)}%</div>
                <div className="text-xs text-slate-500">лот до £{FEE.threshold.toLocaleString('en-GB')}</div>
              </div>
              <div>
                <div className="font-mono text-2xl font-bold text-slate-900">{pct(FEE.highPct)}%</div>
                <div className="text-xs text-slate-500">лот дорожче £{FEE.threshold.toLocaleString('en-GB')}</div>
              </div>
              <div className="col-span-2 text-xs text-slate-500">
                Мінімум за лот: <b className="text-slate-900">£150</b> до £5 000 · <b className="text-slate-900">£299</b> до £10 000 · <b className="text-slate-900">£799</b> від £10 000
              </div>
            </div>
            )}
            <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
              <li>Не виграли — повертаємо передоплату повністю</li>
              <li>Огляд перед ставкою: склад у Ковентрі</li>
              <li>Під ключ: доставка і розмитнення в Україні</li>
            </ul>
            <Link href="/aukciony" className="mt-4 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold inline-flex w-full items-center justify-center gap-2">
              Перейти до аукціонів <ArrowRight className="w-4 h-4" />
            </Link>
            {SOCIAL.telegramChannel && (
            <a href={SOCIAL.telegramChannel} target="_blank" rel="noopener noreferrer" className="mt-2 h-11 rounded-xl bg-[#229ED9] hover:bg-[#1d8fc4] text-white font-bold inline-flex w-full items-center justify-center gap-2 text-sm">
              <Send className="w-4 h-4" /> Нові лоти щодня в Telegram
            </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
