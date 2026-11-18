import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Gavel, TrendingUp } from 'lucide-react';
import Header from '../components/header';
import Footer from '../components/footer';
import FloatingContact from '../components/floating-contact';
import LotPhoto from '../components/lot-photo';
import { allResults, priceStats, type AuctionResult } from '@/lib/auction-results';
import { AUCTION_META, CATEGORY_LABELS, ourFee, rbFee, type AuctionCategory } from '@/lib/auction-lots';

export const metadata: Metadata = {
  title: 'Результати аукціонів техніки Англії — за скільки продали | NoLimitGoods',
  description:
    'Реальні ціни продажу техніки на аукціонах Великої Британії: трактори, екскаватори, телескопи, генератори, пікапи. Ціна молотка, рік, мотогодини, повна ціна з комісіями.',
  alternates: { canonical: '/rezultaty-aukcioniv' },
};

const gbp = (n: number) => `£${n.toLocaleString('en-GB')}`;
const dayFmt = new Intl.DateTimeFormat('uk-UA', { timeZone: 'Europe/Kyiv', day: 'numeric', month: 'long', year: 'numeric' });
const ORDER: AuctionCategory[] = ['excavators', 'telehandlers', 'agro', 'pickups', 'trucks', 'energy', 'breakers', 'attachments'];

// Орієнтовна ціна без доставки: молоток + збір аукціону + наша комісія + документи
function totalNoDelivery(r: AuctionResult): number | null {
  if (r.house !== 'Ritchie Bros') return null; // тарифи інших аукціонів рахує менеджер
  return r.bid + rbFee(r.bid) + ourFee(r.bid) + AUCTION_META.exportDocsGbp;
}

export default function ResultsPage() {
  const results = allResults();
  const stats = priceStats(results).filter((s) => s.count >= 2).slice(0, 24);
  const byCat = ORDER.map((c) => ({ c, rs: results.filter((r) => r.category === c) })).filter((g) => g.rs.length);
  const total = results.reduce((s, r) => s + r.bid, 0);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <Header />

      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <nav className="text-xs text-slate-500 flex gap-1">
            <Link href="/" className="hover:text-slate-900">Головна</Link> / <Link href="/aukciony" className="hover:text-slate-900">Аукціони</Link> / <span>Результати</span>
          </nav>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold uppercase">
            <TrendingUp className="w-4 h-4" /> Реальні ціни продажу
          </div>
          <h1 className="mt-3 text-[26px] md:text-5xl font-black leading-tight max-w-4xl">За скільки продають техніку на аукціонах Англії</h1>
          <p className="mt-3 text-slate-600 text-[15px] md:text-lg max-w-3xl">
            Остання ставка (ціна молотка) по лотах, які ми відстежували. Аукціони без резервної ціни — лот продано саме за цю суму. Орієнтир для вашого
            ліміту: скільки ставити, щоб виграти.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-2 max-w-xl">
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <div className="text-[11px] font-semibold uppercase text-slate-500">Лотів</div>
              <div className="font-mono text-xl md:text-2xl font-bold">{results.length}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <div className="text-[11px] font-semibold uppercase text-slate-500">Сума торгів</div>
              <div className="font-mono text-xl md:text-2xl font-bold">£{Math.round(total / 1000)}k</div>
            </div>
            <Link href="/aukciony#lots" className="rounded-2xl bg-red-600 p-3 text-white">
              <div className="text-[11px] font-semibold uppercase text-red-100">Нові лоти</div>
              <div className="font-bold inline-flex items-center gap-1">Дивитись <ArrowRight className="w-4 h-4" /></div>
            </Link>
          </div>
        </div>
      </section>

      {stats.length > 0 && (
        <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-xl md:text-2xl font-black">Ціни за моделями</h2>
          <p className="text-sm text-slate-500 mt-1">Мінімальна, середня (медіана) і максимальна ставка, без збору аукціону, нашої комісії й доставки.</p>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-2.5">Модель</th>
                  <th className="hidden sm:table-cell px-3 py-2.5">Роки</th>
                  <th className="hidden sm:table-cell px-3 py-2.5 text-right">Лотів</th>
                  <th className="hidden sm:table-cell px-3 py-2.5 text-right">Мін.</th>
                  <th className="px-3 py-2.5 text-right">Медіана</th>
                  <th className="px-3 py-2.5 text-right">Макс.</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((s) => (
                  <tr key={s.key} className="border-t border-slate-100">
                    <td className="px-3 py-2.5 font-bold">{s.key}<div className="sm:hidden text-[11px] font-normal text-slate-500">{s.years} · {s.count} лоти</div></td>
                    <td className="hidden sm:table-cell px-3 py-2.5 text-slate-500 whitespace-nowrap">{s.years}</td>
                    <td className="hidden sm:table-cell px-3 py-2.5 text-right">{s.count}</td>
                    <td className="hidden sm:table-cell px-3 py-2.5 text-right font-mono">{gbp(s.min)}</td>
                    <td className="px-3 py-2.5 text-right font-mono font-bold whitespace-nowrap">{gbp(s.median)}</td>
                    <td className="px-3 py-2.5 text-right font-mono whitespace-nowrap">{gbp(s.max)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {byCat.map(({ c, rs }) => (
        <section key={c} className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
          <h2 className="text-lg md:text-xl font-black">
            {CATEGORY_LABELS[c]} <span className="text-slate-400 font-semibold">· {rs.length}</span>
          </h2>
          <div className="mt-3 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {rs.map((r) => (
              <article key={r.auction + r.item} className="rounded-xl sm:rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
                <div className="relative aspect-[4/3] bg-slate-100">
                  <LotPhoto auction={r.auction} item={r.item} src={r.img} alt={`${r.title} ${r.year ?? ''} — продано на аукціоні ${r.house}`} />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[11px] font-bold">
                    {r.unreserved ? 'Продано' : 'Остання ставка'}
                  </span>
                </div>
                <div className="p-2.5 sm:p-4 flex flex-col flex-1">
                  <h3 className="font-black text-[13px] sm:text-base leading-snug line-clamp-2">{r.title}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {[r.year && `${r.year} р.`, r.hours && `${r.hours.toLocaleString('uk-UA')} мотогод.`, r.miles && `${r.miles.toLocaleString('uk-UA')} км`]
                      .filter(Boolean)
                      .join(' · ')}
                  </div>
                  <div className="mt-auto pt-2">
                    <div className="font-mono text-lg sm:text-2xl font-bold">{gbp(r.bid)}</div>
                    <div className="text-[11px] text-slate-500">
                      {totalNoDelivery(r) !== null ? `≈ ${gbp(totalNoDelivery(r)!)} з комісіями, без доставки · ` : '+ збір аукціону · '}
                      {r.bids} ставок
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 inline-flex items-center gap-1">
                      <Gavel className="w-3 h-3" /> {r.house}, {dayFmt.format(new Date(r.closedAt))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      <section className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div>
            <div className="font-black text-lg">Хочете таку саму техніку за таку ціну?</div>
            <div className="text-sm text-slate-600">Назвіть модель і ліміт — поставимо на найближчому аукціоні. Комісія 1,99–2,99%.</div>
          </div>
          <Link href="/aukciony#lots" className="h-12 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold inline-flex items-center justify-center gap-2 shrink-0">
            Обрати лот <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Дані — остання зафіксована ставка з публічних каталогів аукціонів. «≈ з комісіями» — орієнтир: збір Ritchie Bros за їхнім тарифом, наша комісія і експортні документи; доставка рахується окремо.
        </p>
      </section>

      <Footer />
      <FloatingContact />
    </div>
  );
}
