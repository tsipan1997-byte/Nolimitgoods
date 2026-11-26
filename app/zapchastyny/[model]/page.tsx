import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MODEL_PAGES, itemsForModel } from '@/lib/catalog';
import ModelPageView from './view';
import { getTenant } from '@/lib/tenant-server';

// Статичні сторінки під популярні в Україні моделі: /zapchastyny/tesla-model-y тощо.
export function generateStaticParams() {
  return MODEL_PAGES.map((m) => ({ model: m.slug }));
}

export function generateMetadata({ params }: { params: { model: string } }): Metadata {
  const m = MODEL_PAGES.find((x) => x.slug === params.model);
  if (!m) return {};
  const t = getTenant();
  const title = `Запчастини ${m.name} з доставкою в Україну — ціни | ${t.brand.name}`;
  return {
    title,
    description: `${m.introUk} Ціни у фунтах і гривнях, доставка в Україну 5–14 робочих днів. Оригінал, аналог, б/у.`,
    alternates: { canonical: `/zapchastyny/${m.slug}` },
    openGraph: { title, description: m.introUk, type: 'website' },
  };
}

export default function Page({ params }: { params: { model: string } }) {
  const m = MODEL_PAGES.find((x) => x.slug === params.model);
  if (!m) notFound();
  const items = itemsForModel(m);
  const others = MODEL_PAGES.filter((x) => x.slug !== m.slug).map((x) => ({ slug: x.slug, name: x.name }));
  return <ModelPageView slug={m.slug} name={m.name} intro={m.introUk} itemIds={items.map((i) => i.id)} others={others} />;
}
