import { NextResponse } from 'next/server';

// Офіційний курс НБУ: скільки гривень за 1 фунт / долар / євро.
// Оновлюється щогодини (кеш Vercel), щоб не смикати НБУ на кожного відвідувача.
export const revalidate = 3600;

type NbuRow = { cc: string; rate: number; exchangedate: string };

export async function GET() {
  try {
    const res = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json', {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`NBU HTTP ${res.status}`);
    const rows = (await res.json()) as NbuRow[];

    const pick = (cc: string) => rows.find((r) => r.cc === cc);
    const gbp = pick('GBP');
    const usd = pick('USD');
    const eur = pick('EUR');
    if (!gbp || !usd || !eur) throw new Error('NBU: missing currency');

    return NextResponse.json(
      {
        source: 'НБУ',
        date: gbp.exchangedate, // формат НБУ: ДД.ММ.РРРР
        uah: { GBP: gbp.rate, USD: usd.rate, EUR: eur.rate },
      },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }
    );
  } catch (err) {
    console.error('NBU rates error:', err);
    return NextResponse.json({ error: 'rates_unavailable' }, { status: 503 });
  }
}
