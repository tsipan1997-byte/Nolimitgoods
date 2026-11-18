// Копії фото лотів у Vercel Blob: lots/<auction>-<item>.jpg.
// NEXT_PUBLIC_LOT_PHOTOS_BASE — публічна адреса сховища (https://<id>.public.blob.vercel-storage.com).
// Поки змінна не задана, сайт показує фото напряму з аукціону.
const BASE = (process.env.NEXT_PUBLIC_LOT_PHOTOS_BASE || '').replace(/\/$/, '');

export const lotPhotoPath = (auction: string, item: string) => `lots/${auction}-${item}.jpg`;

export function lotPhotoUrl(auction: string, item: string): string | null {
  return BASE ? `${BASE}/${lotPhotoPath(auction, item)}` : null;
}
