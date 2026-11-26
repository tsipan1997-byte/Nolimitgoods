export const dynamic = 'force-dynamic';

// Скидання кешу лотів після публікації нового фіду парсером:
// POST /api/lots/revalidate  з заголовком Authorization: Bearer <LOTS_REVALIDATE_SECRET>
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { LOTS_CACHE_TAG } from '@/lib/lots-data';

export async function POST(request: Request) {
  const secret = process.env.LOTS_REVALIDATE_SECRET;
  const auth = request.headers.get('authorization') || '';
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  revalidateTag(LOTS_CACHE_TAG);
  revalidatePath('/api/lots');
  return NextResponse.json({ ok: true, revalidated: LOTS_CACHE_TAG });
}
