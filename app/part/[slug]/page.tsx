import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CATEGORIES, GROUPS, TYPE_LABEL, partSlug } from '@/lib/catalog';
import { allParts, findPart, relatedParts } from '@/lib/parts-server';
import { clientPriceGbp, shippingGbp } from '@/lib/pricing';
import PartView from './view';

// Окрема сторінка на кожну деталь — щоб Google знаходив нас за запитом «номер + ціна».
export const dynamicParams = false;

export function generateStaticParams() {
  return allParts().map((i) => ({ slug: partSlug(i) }));
}

function describe(slug: string) {
  const item = findPart(slug);
  if (!item) return null;
  const price = clientPriceGbp(item, null);
  const cat = CATEGORIES.find((c) => c.id === item.category);
  const group = GROUPS.find((g) => g.id === item.group);
  return { item, price, cat, group };
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const d = describe(params.slug);
  if (!d) return {};
  const { item, price } = d;
  const type = TYPE_LABEL[item.type].uk.toLowerCase();
  const title = `${item.partNumber} ${item.brand} — ${item.titleUk}: ціна, доставка в Україну`;
  const description =
    `${item.titleUk} ${item.brand} ${item.partNumber}${item.alt ? ` (${item.alt})` : ''}, ${type}.` +
    (price !== null ? ` Ціна від £${price.toFixed(2)} з доставкою в Україну.` : ' Ціна під запит.') +
    ' Також підберемо аналог або б/у. Відправка з Великої Британії, 5–14 робочих днів.';
  return {
    title,
    description,
    alternates: { canonical: `/part/${params.slug}` },
    openGraph: { title, description, type: 'website' },
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  const d = describe(params.slug);
  if (!d) notFound();
  const { item, price, cat, group } = d;
  const related = relatedParts(item).map((r) => ({
    slug: partSlug(r),
    brand: r.brand,
    partNumber: r.partNumber,
    titleUk: r.titleUk,
    price: clientPriceGbp(r, null),
  }));

  const url = `https://www.nolimitgoods.com/part/${params.slug}`;
  const ship = shippingGbp(item.weightKg, item.oversized);
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${item.titleUk} ${item.brand} ${item.partNumber}`,
    sku: item.partNumber,
    mpn: item.partNumber,
    brand: { '@type': 'Brand', name: item.brand },
    description: `${item.titleEn}. ${item.fitsEn}`,
    url,
    image: `https://www.nolimitgoods.com${item.image ?? '/images/hero-collage.jpg'}`,
    itemCondition: item.type === 'used' ? 'https://schema.org/UsedCondition' : 'https://schema.org/NewCondition',
  };
  if (price !== null) {
    jsonLd.offers = {
      '@type': 'Offer',
      url,
      priceCurrency: 'GBP',
      price: price.toFixed(2),
      availability: 'https://schema.org/BackOrder',
      seller: { '@type': 'Organization', name: 'NoLimitGoods Ltd' },
      ...(ship !== null && {
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: { '@type': 'MonetaryAmount', value: ship, currency: 'GBP' },
          shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'UA' },
        },
      }),
    };
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PartView
        item={item}
        categoryName={cat?.uk ?? ''}
        groupName={group?.uk ?? ''}
        related={related}
      />
    </>
  );
}
