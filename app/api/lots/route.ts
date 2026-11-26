export const revalidate = 3600;

// Діагностика шару даних лотів: звідки зараз беруться лоти і скільки їх.
import { NextResponse } from 'next/server';
import { getLots } from '@/lib/lots-data';

export async function GET() {
  const r = await getLots();
  const byAuction: Record<string, number> = {};
  for (const l of r.lots) byAuction[l.auction] = (byAuction[l.auction] || 0) + 1;
  return NextResponse.json({ source: r.source, generatedAt: r.generatedAt, count: r.lots.length, auctions: r.auctions.length, byAuction });
}
