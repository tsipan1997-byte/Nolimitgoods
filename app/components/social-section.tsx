'use client';

import React from 'react';
import { ArrowUpRight, Video, Camera, Truck } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { SOCIAL, REELS } from '@/lib/site-config';
import { InstagramIcon, FacebookIcon } from './social-icons';

export default function SocialSection() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';

  const points = isUk
    ? [
        { icon: Video, text: 'Відео відвантажень і розпаковок' },
        { icon: Camera, text: 'Фотозвіти по реальних замовленнях' },
        { icon: Truck, text: 'Що привезли цього тижня' },
      ]
    : [
        { icon: Video, text: 'Dispatch and unboxing videos' },
        { icon: Camera, text: 'Photo reports from real orders' },
        { icon: Truck, text: 'What we shipped this week' },
      ];

  return (
    <section id="social" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-[#1a0b14] p-6 sm:p-10 lg:p-12">
          <div
            className="pointer-events-none absolute -right-24 -top-24 w-80 h-80 rounded-full blur-3xl opacity-40"
            style={{ background: 'radial-gradient(circle, #e1306c 0%, #f77737 45%, transparent 70%)' }}
          />

          <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-pink-400 mb-3">
                {isUk ? 'Ми в соцмережах' : 'Follow us'}
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                {isUk ? 'Дивіться, що ми привозимо щодня' : 'See what we ship every day'}
              </h2>
              <p className="mt-4 text-slate-400 text-base">
                {isUk
                  ? 'Реальні деталі, реальні палети, реальні клієнти. Підписуйтесь — і пишіть нам у директ з будь-яким артикулом.'
                  : 'Real parts, real pallets, real customers. Follow us and DM any part number.'}
              </p>
              <ul className="mt-6 space-y-3">
                {points.map((p) => (
                  <li key={p.text} className="flex items-center gap-3 text-sm text-slate-300">
                    <p.icon className="w-4 h-4 text-pink-400 shrink-0" />
                    <span>{p.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-5 rounded-2xl text-white transition-transform hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #833ab4 0%, #e1306c 50%, #f77737 100%)' }}
              >
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <InstagramIcon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-lg font-black">Instagram</div>
                  <div className="text-sm text-white/85 truncate">{SOCIAL.instagramHandle}</div>
                </div>
                <span className="hidden sm:inline text-sm font-bold">{isUk ? 'Підписатися' : 'Follow'}</span>
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              {SOCIAL.facebook && (
                <a
                  href={SOCIAL.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-5 rounded-2xl bg-[#1877F2] text-white transition-transform hover:-translate-y-0.5"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <FacebookIcon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-lg font-black">Facebook</div>
                    <div className="text-sm text-white/85 truncate">NoLimitGoods Ltd</div>
                  </div>
                  <span className="hidden sm:inline text-sm font-bold">{isUk ? 'Перейти' : 'Visit'}</span>
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              )}
            </div>
          </div>
          {REELS.length > 0 && (
            <div className="relative mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3">
              {REELS.slice(0, 4).map((u) => (
                <iframe
                  key={u}
                  src={`${u.split('?')[0].replace(/\/?$/, '/')}embed`}
                  title="Instagram Reel"
                  loading="lazy"
                  className="w-full aspect-[9/16] rounded-2xl bg-white border-0"
                  allow="encrypted-media"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
