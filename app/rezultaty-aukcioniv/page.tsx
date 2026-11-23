import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Gavel, TrendingUp } from 'lucide-react';
import Header from '../components/header';
import Footer from '../components/footer';
import FloatingContact from '../components/floating-contact';
import LotPhoto from '../components/lot-photo';
import { allResults, priceStats } from '@/lib/auction-results';
import { CATEGORY_LABELS, type AuctionCategory } from '@/lib/auction-lots';
import { turnkeyGbp } from '@/lib/turnkey';

export const metadata: Metadata = {
  title: 'Результати аукціонів техніки Англії — за скільки продали | NoLimitGoods',
  description:
    'Реальні ціни продажу техніки на аукціонах Великої Британії: екскаватори, телескопи, трактори, генератори. За скільки продали і скільки коштує під ключ в Україні — у фунтах, євро і доларах.',
  alternates: { canonical: '/rezultaty-aukcioniv' },
};

const gbp = (n: number) => `£${n.toLocaleString('en-GB')}`;
const sp = (n: number) => n.toLocaleString('uk-UA').replace(/\u00a0/g, ' ');

// Курс НБУ (гривень за 1 £/$/€), оновлюється щогодини. Якщо НБУ недоступний — запасний курс.
type Rates = { date: string; gbpEur: number; gbpUsd: number };
const FALLBACK: Rates = { date: '', gbpEur: 1.17, gbpUsd: 1.3 };
async function getRates(): Promise<Rates> {
  try {
    const res = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json', { next: { revalidate: 3600 } });
    if (!res.ok) return FALLBACK;
    const rows = (await res.json()) as { cc: string; rate: number; exchangedate: string }[];
    const r = (cc: string) => rows.find((x) => x.cc === cc);
    const g = r('GBP'), e = r('EUR'), u = r('USD');
    if (!g || !e || !u) return FALLBACK;
    return { date: g.exchangedate, gbpEur: g.rate / e.rate, gbpUsd: g.rate / u.rate };
  } catch {
    return FALLBACK;
  }
}

// Округлення: до £/€/$ 100 для сум до 20 тис., далі до 500
const rnd = (n: number) => Math.round(n / (n > 20000 ? 500 : 100)) * (n > 20000 ? 500 : 100);
const money = (n: number, sym: string) => `${sym}${sp(rnd(n))}`;
const range = (r: [number, number], sym: string, k = 1) => `${sym}${sp(rnd(r[0] * k))}–${sp(Math.max(rnd(r[1] * k), rnd(r[0] * k)))}`;
const dayFmt = new Intl.DateTimeFormat('uk-UA', { timeZone: 'Europe/Kyiv', day: 'numeric', month: 'long', year: 'numeric' });
// Показуємо лише техніку: людям цікаво, за скільки пішли трактори й екскаватори, а не ковші, молоти чи генератори
const ORDER: AuctionCategory[] = ['agro', 'excavators', 'telehandlers', 'trucks', 'pickups'];

export default async function ResultsPage() {
  const rates = await getRates();
  const results = allResults().filter((r) => ORDER.includes(r.category));
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
            Фінальні ціни продажу, підтверджені аукціоном, і скільки така техніка коштувала б під ключ в Україні: з комісіями, доставкою і
            розмитненням. Аукціон без резервної ціни — лот продано саме за цю суму. Ціни у фунтах, євро і доларах за курсом НБУ
            {rates.date ? ` на ${rates.date}` : ''}.
          </p>
          <p className="mt-3 inline-block rounded-lg bg-amber-50 border border-amber-200 px-3 py-1.5 text-[13px] md:text-sm font-semibold text-amber-800">
            + ПДВ Англії 20% (від ціни молотка і збору аукціону) — повертається після експорту техніки, умови обговорюємо з кожним клієнтом індивідуально
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

      {results.length === 0 && (
        <section className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center">
            <p className="font-black text-lg">Перевірені результати торгів з'являться тут найближчим часом</p>
            <p className="text-sm text-slate-600 mt-1">
              Ми додаємо лише фінальні ціни, підтверджені аукціоном. Хочете знати, за скільки йде конкретна модель, — напишіть, підкажемо по останніх торгах.
            </p>
          </div>
        </section>
      )}

      {stats.length > 0 && (
        <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-xl md:text-2xl font-black">Ціни за моделями</h2>
          <p className="text-sm text-slate-500 mt-1">
            «Типова ціна» — середня з усіх проданих лотів моделі: половина пішла дешевше, половина дорожче. 1 £ = {rates.gbpEur.toFixed(2)} € = {rates.gbpUsd.toFixed(2)} $.
          </p>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-2.5" colSpan={2}>Модель</th>
                  <th className="hidden sm:table-cell px-3 py-2.5">Роки</th>
                  <th className="hidden sm:table-cell px-3 py-2.5 text-right">Лотів</th>
                  <th className="hidden sm:table-cell px-3 py-2.5 text-right">Мін.</th>
                  <th className="px-3 py-2.5 text-right">Ціна на аукціоні<div className="normal-case font-normal text-[10px]">(типова)</div></th>
                  <th className="hidden sm:table-cell px-3 py-2.5 text-right">Макс.</th>
                  <th className="px-3 py-2.5 text-right">Під ключ в Україні<div className="normal-case font-normal text-[10px]">(орієнтовно)</div></th>
                </tr>
              </thead>
              <tbody>
                {stats.map((s) => (
                  <tr key={s.key} className="border-t border-slate-100">
                    <td className="pl-3 py-2.5 w-16 sm:w-20">
                      <div className="relative w-14 h-11 sm:w-20 sm:h-14 rounded-lg overflow-hidden bg-slate-100">
                        <LotPhoto auction={s.sample.auction} item={s.sample.item} src={s.sample.img} alt={`${s.key} — продано на аукціоні`} />
                      </div>
                    </td>
                    <td className="px-3 py-2.5 font-bold">{s.key}<div className="sm:hidden text-[11px] font-normal text-slate-500">{[s.years, `${s.count} ${s.count < 5 ? 'лоти' : 'лотів'}`].filter(Boolean).join(' · ')}</div></td>
                    <td className="hidden sm:table-cell px-3 py-2.5 text-slate-500 whitespace-nowrap">{s.years}</td>
                    <td className="hidden sm:table-cell px-3 py-2.5 text-right">{s.count}</td>
                    <td className="hidden sm:table-cell px-3 py-2.5 text-right font-mono">{gbp(s.min)}</td>
                    <td className="px-3 py-2.5 text-right font-mono font-bold whitespace-nowrap">{gbp(s.median)}</td>
                    <td className="hidden sm:table-cell px-3 py-2.5 text-right font-mono whitespace-nowrap">{gbp(s.max)}</td>
                    <td className="px-3 py-2.5 text-right whitespace-nowrap">
                      {(() => {
                        const t = turnkeyGbp(s.sample, s.median);
                        const mid = (t[0] + t[1]) / 2;
                        return (
                          <>
                            <div className="font-mono font-bold">≈ {money(mid * rates.gbpEur, '€')}</div>
                            <div className="text-[11px] text-slate-500 font-mono">{money(mid * rates.gbpUsd, '$')} · {money(mid, '£')}</div>
                          </>
                        );
                      })()}
                    </td>
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
                    <div className="text-[11px] font-semibold uppercase text-slate-500">Продано за</div>
                    <div className="font-mono text-lg sm:text-2xl font-bold leading-tight">{gbp(r.bid)}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      ≈ {money(r.bid * rates.gbpEur, '€')} · {money(r.bid * rates.gbpUsd, '$')}
                    </div>
                    {(() => {
                      const t = turnkeyGbp(r, r.bid);
                      return (
                        <div className="mt-2 rounded-lg bg-emerald-50 border border-emerald-200 px-2 py-1.5">
                          <div className="text-[11px] font-semibold text-emerald-800">Під ключ в Україні ≈</div>
                          <div className="font-mono text-[13px] sm:text-base font-bold text-emerald-900">{range(t, '€', rates.gbpEur)}</div>
                          <div className="text-[11px] text-emerald-800/80 font-mono">
                            {range(t, '$', rates.gbpUsd)} · {range(t, '£')}
                          </div>
                        </div>
                      );
                    })()}
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
          «Продано за» — фінальна ціна молотка, підтверджена аукціоном. «Під ключ в Україні» — орієнтир: ціна молотка + збір аукціону за його
          тарифом + наша комісія 1,99–2,99% + експортні документи + доставка до України + розмитнення (ПДВ 20%, мито де воно є) + брокер. Окремо
          на аукціоні платиться ПДВ Англії 20% від ціни молотка і збору аукціону: це тимчасова сума, вона повертається після того, як
          техніка вивезена на експорт, тому в ціну під ключ не входить. Умови по ПДВ Англії обговорюємо з кожним клієнтом індивідуально. Точну суму під конкретний лот рахуємо перед торгами. Курс НБУ{rates.date ? ` на ${rates.date}` : ''}, суми округлені.
        </p>
      </section>

      <Footer />
      <FloatingContact />
    </div>
  );
}
