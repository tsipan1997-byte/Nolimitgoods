import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ChevronDown, ShieldCheck, Eye, FileText, Truck, Gavel } from 'lucide-react';
import Header from '../components/header';
import Footer from '../components/footer';
import FloatingContact from '../components/floating-contact';
import LandingLots, { LandingRequestButton } from '../components/landing-lots';
import { LANDINGS, LANDING_BY_SLUG, type Landing } from '@/lib/landings';
import { AUCTION_LOTS, FEE, pct, type AuctionLot } from '@/lib/auction-lots';
import { CONTACT } from '@/lib/site-config';
import { allResults } from '@/lib/auction-results';
import LotPhoto from '../components/lot-photo';

const BASE = 'https://www.nolimitgoods.com';

export const dynamicParams = false;

export function generateStaticParams() {
  return LANDINGS.map((l) => ({ landing: l.slug }));
}

function lotsFor(l: Landing): AuctionLot[] {
  return AUCTION_LOTS.filter((x) => x.img && l.filter(x)).sort(
    (a, b) => Number(a.inoperable) - Number(b.inoperable) || (b.year ?? 0) - (a.year ?? 0)
  );
}

export function generateMetadata({ params }: { params: { landing: string } }): Metadata {
  const l = LANDING_BY_SLUG[params.landing];
  if (!l) return {};
  const lots = lotsFor(l);
  const og = lots[0]?.img;
  return {
    title: l.title,
    description: l.description,
    keywords: l.keywords,
    alternates: { canonical: `/${l.slug}` },
    openGraph: {
      title: l.title,
      description: l.description,
      url: `${BASE}/${l.slug}`,
      type: 'website',
      locale: 'uk_UA',
      siteName: 'NoLimitGoods Ltd',
      images: og ? [{ url: og, alt: l.h1 }] : [{ url: '/ads/og_aukciony.jpg', width: 1200, height: 630 }],
    },
  };
}

export default function LandingPage({ params }: { params: { landing: string } }) {
  const l = LANDING_BY_SLUG[params.landing];
  if (!l) notFound();
  const lots = lotsFor(l);
  const years = lots.map((x) => x.year).filter(Boolean) as number[];
  const related = l.related.map((s) => LANDING_BY_SLUG[s]).filter(Boolean);
  // Що вже продалось у цій категорії і за скільки
  const sold = allResults().filter((r) => l.filter(r as unknown as AuctionLot)).slice(0, 8);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Головна', item: BASE },
        { '@type': 'ListItem', position: 2, name: 'Аукціони', item: `${BASE}/aukciony` },
        { '@type': 'ListItem', position: 3, name: l.kicker, item: `${BASE}/${l.slug}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: l.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: l.h1,
      numberOfItems: lots.length,
      itemListElement: lots.slice(0, 30).map((x, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: { '@type': 'Thing', name: `${x.title}${x.year ? ` ${x.year}` : ''}`, image: x.img, description: x.specs },
      })),
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-red-500 selection:text-white">
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}
      <Header />

      {/* ГОЛОВНИЙ ЕКРАН */}
      <section className="bg-slate-50 text-slate-900 relative overflow-hidden border-b border-slate-200">
        {lots[0] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={lots[0].img} alt="" aria-hidden="true" referrerPolicy="no-referrer" className="absolute inset-y-0 right-0 w-full md:w-1/2 h-full object-cover opacity-30 md:opacity-100" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/95 to-slate-50/30 md:via-slate-50/90 md:to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14">
          <nav aria-label="Навігація" className="text-xs text-slate-500 flex flex-wrap gap-1">
            <Link href="/" className="hover:text-slate-900">Головна</Link> /
            <Link href="/aukciony" className="hover:text-slate-900">Аукціони</Link> /
            <span className="text-slate-700">{l.kicker}</span>
          </nav>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-wide">
            <Gavel className="w-4 h-4" /> {l.kicker}
          </div>
          <h1 className="mt-3 text-[26px] leading-tight md:text-5xl font-black max-w-3xl">{l.h1}</h1>
          <p className="mt-3 text-slate-600 text-[15px] md:text-lg max-w-2xl">{l.intro}</p>

          <div className="mt-6 grid grid-cols-3 gap-2 max-w-xl">
            <div className="rounded-xl bg-white border border-slate-200 p-3">
              <div className="text-[11px] text-slate-500 font-semibold uppercase">Лотів з фото</div>
              <div className="text-[15px] leading-6 sm:text-xl md:text-2xl font-black whitespace-nowrap">{lots.length || '—'}</div>
            </div>
            <div className="rounded-xl bg-white border border-slate-200 p-3">
              <div className="text-[11px] text-slate-500 font-semibold uppercase">Роки</div>
              <div className="text-[15px] leading-6 sm:text-xl md:text-2xl font-black whitespace-nowrap">{years.length ? `${Math.min(...years)}–${Math.max(...years)}` : '—'}</div>
            </div>
            <div className="rounded-xl bg-red-600 p-3">
              <div className="text-[11px] text-red-100 font-semibold uppercase">Комісія</div>
              <div className="text-[15px] leading-6 sm:text-xl md:text-2xl font-black whitespace-nowrap">{pct(FEE.highPct)}–{pct(FEE.lowPct)}%</div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a href="#lots" className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold">
              Дивитися лоти <ArrowRight className="w-4 h-4" />
            </a>
            <LandingRequestButton className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl border border-slate-300 bg-white hover:border-red-300 font-bold">
              Підібрати під мене
            </LandingRequestButton>
          </div>
        </div>
      </section>

      {/* ЛОТИ */}
      <section id="lots" className="scroll-mt-24 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-5">
          <div>
            <h2 className="text-xl md:text-2xl font-black">Лоти найближчих аукціонів</h2>
            <p className="text-sm text-slate-500 mt-1">Фото й описи — з каталогів аукціонів. Актуальну ставку назве менеджер.</p>
          </div>
          {l.cat && (
            <Link href={`/aukciony?cat=${l.cat}#lots`} className="text-sm font-bold text-red-600 inline-flex items-center gap-1">
              Усі лоти з фільтрами <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
        <LandingLots lots={lots} page={`/${l.slug}`} topic={l.topic} />
      </section>

      {/* ЗА СКІЛЬКИ ПРОДАВАЛИ */}
      {sold.length > 0 && (
        <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-8">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-xl md:text-2xl font-black">За скільки продавали нещодавно</h2>
            <Link href="/rezultaty-aukcioniv" className="text-sm font-bold text-red-600 inline-flex items-center gap-1 shrink-0">
              Усі результати <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-sm text-slate-500 mt-1">Остання ставка (ціна молотка) без збору аукціону, нашої комісії й доставки.</p>
          <div className="mt-3 grid sm:grid-cols-2 gap-2.5">
            {sold.map((r) => (
              <div key={r.auction + r.item} className="flex gap-3 rounded-2xl border border-slate-200 p-2.5">
                <div className="relative w-24 h-[72px] rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  <LotPhoto auction={r.auction} item={r.item} src={r.img} alt={`${r.title} — продано на аукціоні`} />
                </div>
                <div className="min-w-0 flex flex-col">
                  <div className="font-bold text-sm leading-snug line-clamp-2">{r.title}</div>
                  <div className="text-xs text-slate-500">
                    {[r.year && `${r.year} р.`, r.hours && `${r.hours.toLocaleString('uk-UA')} мотогод.`].filter(Boolean).join(' · ')}
                  </div>
                  <div className="mt-auto font-mono font-bold">£{r.bid.toLocaleString('en-GB')}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ЯК ЦЕ ПРАЦЮЄ */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <h2 className="text-xl md:text-2xl font-black">Як ми купуємо для вас</h2>
          <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {(
              [
                [ShieldCheck, 'Ставка до вашого ліміту', 'Максимум фіксуємо письмово. Не виграли — повертаємо передоплату.'],
                [Eye, 'Огляд перед торгами', 'Склад у Ковентрі, 1,5–2 год до Лідса й Мальтбі. Фото, відео, запуск.'],
                [FileText, 'Експорт і документи', 'Інвойс, експортна декларація, CMR — британський VAT не платите.'],
                [Truck, 'Доставка в Україну', 'Від палети до трала. До кордону — 5–10 днів.'],
              ] as const
            ).map(([Icon, t, d]) => (
              <div key={t} className="rounded-2xl bg-white border border-slate-200 p-4">
                <Icon className="w-6 h-6 text-red-600" />
                <div className="mt-2 font-bold text-sm md:text-base leading-snug">{t}</div>
                <p className="mt-1 text-xs md:text-sm text-slate-600">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ТЕКСТ */}
      <section className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-6 text-[15px] text-slate-700 leading-relaxed">
        {l.sections.map(([h, t]) => (
          <div key={h}>
            <h2 className="text-lg md:text-xl font-black text-slate-900">{h}</h2>
            <p className="mt-2">{t}</p>
          </div>
        ))}
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <h2 className="text-xl md:text-2xl font-black">Питання та відповіді</h2>
          <div className="mt-4 space-y-2">
            {l.faq.map(([q, a]) => (
              <details key={q} className="group rounded-xl bg-white border border-slate-200 p-4">
                <summary className="cursor-pointer font-bold list-none flex items-center justify-between gap-3">
                  {q} <ChevronDown className="w-4 h-4 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-2 text-sm text-slate-600">{a}</p>
              </details>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div>
              <div className="font-black text-lg">Не знайшли потрібне?</div>
              <div className="text-sm text-slate-600">
                Напишіть, що шукаєте, — підберемо на найближчих аукціонах. Телефон: {CONTACT.phoneUk} (UK) · {CONTACT.phoneUa} (UA)
              </div>
            </div>
            <LandingRequestButton className="h-12 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shrink-0">Залишити запит</LandingRequestButton>
          </div>

          {related.length > 0 && (
            <div className="mt-8">
              <h2 className="font-black">Дивіться також</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {related.map((r) => (
                  <Link key={r.slug} href={`/${r.slug}`} className="h-10 px-4 rounded-xl bg-white border border-slate-200 hover:border-red-300 text-sm font-bold inline-flex items-center">
                    {r.kicker}
                  </Link>
                ))}
                <Link href="/aukciony" className="h-10 px-4 rounded-xl bg-white border border-slate-200 hover:border-red-300 text-sm font-bold inline-flex items-center">
                  Усі аукціони
                </Link>
              </div>
            </div>
          )}

          <p className="mt-6 text-xs text-slate-500">
            Euro Auctions, Ritchie Bros, Cheffins — незалежні аукціонні доми. NoLimitGoods Ltd не є їхнім представником: ми купуємо лоти як
            покупець на ваше замовлення. Інформація про розмитнення — довідкова, не є юридичною консультацією.
          </p>
        </div>
      </section>

      <Footer />
      <FloatingContact />
    </div>
  );
}
