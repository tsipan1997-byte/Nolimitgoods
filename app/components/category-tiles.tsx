'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Tractor, HardHat, Truck, Car } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { CATALOG, CATEGORIES, type CategoryId } from '@/lib/catalog';
import { KRAMP_COUNTS } from '@/lib/catalog-stats';
import { pozytsiy } from '@/lib/plural';

const ICONS: Record<CategoryId, React.ComponentType<{ className?: string }>> = {
  agro: Tractor,
  construction: HardHat,
  trucks: Truck,
  cars: Car,
};

export default function CategoryTiles() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';

  return (
    <section className="bg-white pt-5 pb-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg md:text-2xl font-black text-slate-900 mb-3">{isUk ? 'Запчастини з цінами' : 'Priced parts'}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {CATEGORIES.map((c) => {
            const Icon = ICONS[c.id];
            const n = CATALOG.filter((i) => i.category === c.id).length + (KRAMP_COUNTS[c.id] || 0);
            return (
              <Link
                key={c.id}
                href={`/catalog?cat=${c.id}`}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white hover:border-red-500/60 p-3 sm:p-5 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-xl bg-red-600/15 border border-red-600/30 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-red-600" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-slate-900 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="mt-3 text-[15px] sm:text-lg font-black text-slate-900">{isUk ? c.uk : c.en}</div>
                <div className="hidden sm:block text-xs text-slate-500 mt-1 leading-snug">{isUk ? c.hintUk : c.hintEn}</div>
                <div className="text-xs font-bold text-red-600 mt-3">
                  {isUk ? `${n} ${pozytsiy(n)} з цінами →` : `${n} priced items →`}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
