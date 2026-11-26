import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MACHINE_BRANDS, brandBySlug } from '@/lib/spectehnika';
import SpecView from '../view';
import { getTenant } from '@/lib/tenant-server';
import { absUrl } from '@/lib/tenants';

export function generateStaticParams() {
  return MACHINE_BRANDS.map((b) => ({ brand: b.slug }));
}

export function generateMetadata({ params }: { params: { brand: string } }): Metadata {
  const b = brandBySlug(params.brand);
  if (!b) return {};
  const t = getTenant();
  const title = `Запчастини ${b.name} з доставкою в Україну — оригінал, аналог, б/у | ${t.brand.name}`;
  const description = `${b.intro} Склади Великої Британії та ЄС, підбір за номером або серійним номером техніки, доставка в Україну 5–14 днів.`;
  return {
    title,
    description,
    alternates: { canonical: `/spectehnika/${b.slug}` },
    openGraph: { title, description, url: absUrl(t, `/spectehnika/${b.slug}`), type: 'website', locale: 'uk_UA' },
  };
}

export default function Page({ params }: { params: { brand: string } }) {
  const b = brandBySlug(params.brand);
  if (!b) notFound();
  return <SpecView brand={b} />;
}
