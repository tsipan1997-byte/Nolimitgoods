'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowRight, Search, Camera, Truck } from 'lucide-react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import FloatingContact from '../../components/floating-contact';
import QuoteCart from '../../components/quote-cart';
import ProductCard from '../../components/product-card';
import RFQSection from '../../components/rfq-section';
import { CATALOG } from '@/lib/catalog';
import { loadRates, type Rates } from '@/lib/pricing';

export default function ModelPageView({
  slug,
  name,
  intro,
  itemIds,
  others,
}: {
  slug: string;
  name: string;
  intro: string;
  itemIds: string[];
  others: { slug: string; name: string }[];
}) {
  const [rates, setRates] = useState<Rates | null>(null);
  useEffect(() => {
    loadRates().then(setRates);
  }, []);
  const items = CATALOG.filter((i) => itemIds.includes(i.id));

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <Header />

      <section className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10">
          <nav className="flex items-center gap-1 text-xs text-slate-500 mb-4">
            <Link href="/" className="hover:text-slate-900">Головна</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/catalog?cat=cars" className="hover:text-slate-900">Легкові авто</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-700">{name}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">Запчастини {name} з доставкою в Україну</h1>
          <p className="mt-4 max-w-3xl text-slate-600 text-base sm:text-lg">{intro}</p>
          <div className="mt-6 grid sm:grid-cols-3 gap-3 max-w-3xl">
            {[
              { icon: Search, t: 'Підбір за VIN', d: 'Надішліть VIN — підберемо точно під вашу комплектацію' },
              { icon: Camera, t: 'Фотозвіт', d: 'Фото й відео деталі перед відправкою' },
              { icon: Truck, t: '5–14 робочих днів', d: 'Доставка зі складів UK, ЄС і США' },
            ].map((b) => (
              <div key={b.t} className="flex gap-3 p-4 rounded-2xl bg-white border border-slate-200">
                <b.icon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-black">{b.t}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{b.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl font-black mb-6">
          {items.length ? `Популярні запчастини ${name} з цінами` : `Запчастини ${name} — під замовлення`}
        </h2>
        {items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {items.map((item) => (
              <ProductCard key={item.id} item={item} rates={rates} isUk />
            ))}
          </div>
        )}
        <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-black">Потрібна інша деталь на {name}?</h3>
            <p className="text-slate-300 text-sm mt-1">Ходова, двигун, гальма, кузов, оптика, електроніка — знайдемо оригінал, аналог або б/у.</p>
          </div>
          <a href="#parts-calculator" className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 font-extrabold uppercase text-sm">
            Отримати ціну <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      <RFQSection />

      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-lg font-black mb-3">Запчастини для інших популярних моделей</h2>
        <div className="flex flex-wrap gap-2">
          {others.map((o) => (
            <Link key={o.slug} href={`/zapchastyny/${o.slug}`} className="px-4 py-2 rounded-full border border-slate-200 text-sm font-semibold text-slate-700 hover:border-red-500 hover:text-red-600">
              {o.name}
            </Link>
          ))}
        </div>
        <p className="sr-only">{slug}</p>
      </section>

      <Footer />
      <FloatingContact />
      <QuoteCart />
    </div>
  );
}
