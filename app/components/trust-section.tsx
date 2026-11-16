'use client';

import React from 'react';
import Link from 'next/link';
import { ClipboardList, BadgePoundSterling, CreditCard, PackageCheck, Building2, ExternalLink, Star } from 'lucide-react';
import { COMPANY, CONTACT } from '@/lib/site-config';

// «Як ми працюємо» + «Перевірте нас»: тільки реальні факти, які клієнт може перевірити сам.
const STEPS = [
  { icon: ClipboardList, t: 'Заявка', d: 'Номер деталі, VIN або фото — через форму, Telegram чи WhatsApp.' },
  { icon: BadgePoundSterling, t: 'Ціна', d: 'Рахуємо оригінал, аналог і б/у з доставкою, зазвичай протягом дня.' },
  { icon: CreditCard, t: 'Оплата', d: 'Рахунок від британської компанії. Після оплати замовляємо деталь.' },
  { icon: PackageCheck, t: 'Фотозвіт і трек', d: 'Фото деталі й номера перед відправкою, трек-номер до України.' },
];

export default function TrustSection() {
  const facts = [
    { k: 'Компанія', v: `${COMPANY.legalName}, з ${COMPANY.since} року` },
    { k: 'Реєстраційний номер', v: COMPANY.number },
    { k: 'VAT', v: COMPANY.vat },
    { k: 'Адреса', v: COMPANY.address },
    { k: 'Телефон', v: CONTACT.phone },
  ];

  return (
    <section id="how" className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-600 mb-3">Як ми працюємо</p>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-slate-900">Від заявки до деталі в Україні</h2>

        <ol className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map((s, i) => (
            <li key={s.t} className="relative p-5 rounded-2xl bg-white border border-slate-200">
              <span className="absolute top-4 right-5 text-4xl font-black text-slate-100 select-none">{i + 1}</span>
              <s.icon className="w-7 h-7 text-red-600" />
              <div className="mt-3 text-lg font-black text-slate-900">{s.t}</div>
              <p className="mt-1 text-sm text-slate-600">{s.d}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 grid lg:grid-cols-[1.4fr_1fr] gap-4">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200">
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-red-600" />
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">Перевірте нас перед оплатою</h3>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Ми офіційно зареєстрована британська компанія. Дані відкриті — перевірте в державному реєстрі Великої Британії.
            </p>
            <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 text-sm">
              {facts.map((f) => (
                <React.Fragment key={f.k}>
                  <dt className="text-slate-500">{f.k}</dt>
                  <dd className="font-semibold text-slate-900">{f.v}</dd>
                </React.Fragment>
              ))}
            </dl>
            <a
              href={COMPANY.registryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-red-600 text-white text-sm font-extrabold uppercase"
            >
              Відкрити в Companies House <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-red-600 to-red-700 text-white flex flex-col justify-between">
            <div>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-white text-white" />
                ))}
              </div>
              <h3 className="mt-3 text-xl sm:text-2xl font-black">Вже замовляли у нас?</h3>
              <p className="mt-2 text-sm text-red-50/90">
                Розкажіть, як усе пройшло. Ваш відгук допоможе іншим покупцям — публікуємо тільки з вашої згоди.
              </p>
            </div>
            <Link
              href="/vidguk"
              className="mt-6 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-white text-red-700 text-sm font-extrabold uppercase hover:bg-red-50"
            >
              Залишити відгук
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
