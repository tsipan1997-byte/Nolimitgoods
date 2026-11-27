// Шаблон довідкових сторінок (/dostavka, /nulove-myto, /komisiia …).
// Тексти — у lib/info-pages.ts. Сторінка: хлібні крихти, текст, FAQ, джерела, «Дивіться також», JSON-LD.
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ChevronDown, ExternalLink, MessageSquare, Tag, Gavel } from 'lucide-react';
import Header from './header';
import Footer from './footer';
import FloatingContact from './floating-contact';
import { INFO_BY_SLUG, linkLabel, type InfoPage } from '@/lib/info-pages';
import { CONTACT, COMPANY } from '@/lib/site-config';

const BASE = 'https://www.nolimitgoods.com';

export function infoMetadata(slug: string): Metadata {
  const p = INFO_BY_SLUG[slug];
  if (!p) return {};
  return {
    title: p.title,
    description: p.description,
    keywords: p.keywords,
    alternates: { canonical: `/${p.slug}` },
    openGraph: { title: p.title, description: p.description, url: `${BASE}/${p.slug}`, type: 'article', locale: 'uk_UA' },
  };
}

function crumbs(p: InfoPage) {
  const list = [{ name: 'Головна', href: '/' }];
  if (p.parent) list.push(p.parent);
  list.push({ name: p.kicker, href: `/${p.slug}` });
  return list;
}

export default function InfoPageView({ slug }: { slug: string }) {
  const p = INFO_BY_SLUG[slug];
  if (!p) notFound();
  const cr = crumbs(p);

  const jsonLd: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: cr.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: `${BASE}${c.href === '/' ? '' : c.href}` })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: p.h1,
      description: p.description,
      inLanguage: 'uk',
      dateModified: p.updated,
      mainEntityOfPage: `${BASE}/${p.slug}`,
      author: { '@type': 'Organization', name: COMPANY.legalName, url: BASE },
      publisher: { '@type': 'Organization', name: COMPANY.legalName, url: BASE, logo: { '@type': 'ImageObject', url: `${BASE}/icon.png` } },
    },
  ];
  if (p.faq?.length) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: p.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    });
  }

  const isAuction = p.cta === 'auction';

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-red-500 selection:text-white">
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}
      <Header />

      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <nav aria-label="Навігація" className="text-xs text-slate-500 flex flex-wrap gap-1">
            {cr.map((c, i) =>
              i < cr.length - 1 ? (
                <span key={c.href}>
                  <Link href={c.href} className="hover:text-slate-900">{c.name}</Link> /
                </span>
              ) : (
                <span key={c.href} className="text-slate-700">{c.name}</span>
              )
            )}
          </nav>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-wide">
            {p.kicker}
          </div>
          <h1 className="mt-3 text-[26px] leading-tight md:text-5xl font-black">{p.h1}</h1>
          <p className="mt-3 text-slate-600 text-[15px] md:text-lg">{p.intro}</p>
          {p.facts && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {p.facts.map(([k, v], i) => (
                <div key={k} className={i === 0 ? 'rounded-xl bg-red-600 p-3 text-white' : 'rounded-xl bg-white border border-slate-200 p-3'}>
                  <div className={`text-[11px] font-semibold uppercase ${i === 0 ? 'text-red-100' : 'text-slate-500'}`}>{k}</div>
                  <div className="text-[15px] leading-6 sm:text-xl font-black">{v}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <article className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 text-[15px] md:text-base text-slate-700 leading-relaxed">
        {p.blocks.map((b) => (
          <section key={b.h} className="mt-8 first:mt-0">
            <h2 className="text-xl md:text-2xl font-black text-slate-900">{b.h}</h2>
            {b.p?.map((t, i) => (
              <p key={i} className="mt-3">{t}</p>
            ))}
            {b.list && (
              <ul className="mt-3 space-y-2 list-disc pl-5 marker:text-red-600">
                {b.list.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            )}
            {b.links && (
              <div className="mt-3 flex flex-wrap gap-2">
                {b.links.map((l) => (
                  <Link key={l} href={`/${l}`} className="inline-flex items-center gap-1 text-sm font-bold text-red-600 hover:text-red-700">
                    {linkLabel(l)} <ArrowRight className="w-4 h-4" />
                  </Link>
                ))}
              </div>
            )}
          </section>
        ))}

        {/* Заклик до дії */}
        <div className="mt-10 rounded-2xl bg-slate-900 text-white p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div>
            <div className="font-black text-lg">{isAuction ? 'Підібрати техніку на аукціоні?' : 'Потрібна деталь або розрахунок?'}</div>
            <div className="text-sm text-slate-300">
              {isAuction
                ? 'Назвіть модель, рік і бюджет — покажемо лоти на найближчих торгах і порахуємо ціну під ключ.'
                : 'Надішліть номер деталі, VIN або фото — порахуємо оригінал, аналог і б/у з доставкою.'}{' '}
              {CONTACT.phoneUk} (UK, Telegram) · {CONTACT.phoneUa} (UA, WhatsApp / Viber)
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <Link
              href={isAuction ? '/aukciony#lots' : '/#parts-calculator'}
              className="h-12 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold inline-flex items-center justify-center gap-2"
            >
              {isAuction ? <Gavel className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
              {isAuction ? 'Лоти аукціонів' : 'Залишити запит'}
            </Link>
            <Link
              href={isAuction ? '/rezultaty-aukcioniv' : '/catalog'}
              className="h-12 px-5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold inline-flex items-center justify-center gap-2"
            >
              <Tag className="w-4 h-4" /> {isAuction ? 'Ціни продажу' : 'Каталог і ціни'}
            </Link>
          </div>
        </div>

        {p.faq && p.faq.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl md:text-2xl font-black text-slate-900">Питання та відповіді</h2>
            <div className="mt-4 space-y-2">
              {p.faq.map(([q, a]) => (
                <details key={q} className="group rounded-xl bg-white border border-slate-200 p-4">
                  <summary className="cursor-pointer font-bold text-slate-900 list-none flex items-center justify-between gap-3">
                    {q} <ChevronDown className="w-4 h-4 shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-2 text-sm text-slate-600">{a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {p.sources && p.sources.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-black text-slate-900">Офіційні джерела</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {p.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1.5 text-slate-700 hover:text-red-600 underline underline-offset-4 decoration-slate-300">
                    <ExternalLink className="w-4 h-4 mt-0.5 shrink-0" /> {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-10">
          <h2 className="font-black text-slate-900">Дивіться також</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {p.related.map((r) => (
              <Link key={r} href={`/${r}`} className="h-10 px-4 rounded-xl bg-white border border-slate-200 hover:border-red-300 text-sm font-bold inline-flex items-center">
                {linkLabel(r)}
              </Link>
            ))}
          </div>
        </section>

        <p className="mt-8 text-xs text-slate-500">
          Оновлено: {new Date(p.updated).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })}.
          {p.legalNote ? ' Інформація про мито, податки й розмитнення — довідкова і не є юридичною консультацією; ставки для вашого товару підтверджуйте з митним брокером до покупки.' : ''}
        </p>
      </article>

      <Footer />
      <FloatingContact />
    </div>
  );
}
