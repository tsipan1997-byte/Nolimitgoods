import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { MACHINE_BRANDS, MACHINE_GROUPS } from '@/lib/spectehnika';

// Компактна смуга брендів замість великого каталогу OEM-кодів (там були позиції без цін).
// Кожен бренд веде на свою сторінку /spectehnika/<бренд> з цінами й моделями.
export default function BrandsStrip() {
  return (
    <section id="catalog" className="scroll-mt-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-600">Бренди</p>
            <h2 className="mt-1 text-2xl md:text-3xl font-black text-slate-900">Запчастини до техніки цих марок</h2>
          </div>
          <Link href="/spectehnika" className="text-sm font-bold text-red-600 inline-flex items-center gap-1">
            Усі марки <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="mt-5 space-y-4">
          {MACHINE_GROUPS.map((g) => {
            const brands = MACHINE_BRANDS.filter((b) => b.group === g.id);
            if (!brands.length) return null;
            return (
              <div key={g.id}>
                <div className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">{g.uk}</div>
                <div className="flex flex-wrap gap-2">
                  {brands.map((b) => (
                    <Link
                      key={b.slug}
                      href={`/spectehnika/${b.slug}`}
                      className="h-10 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-red-300 text-sm font-bold text-slate-800 inline-flex items-center"
                    >
                      {b.name}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
