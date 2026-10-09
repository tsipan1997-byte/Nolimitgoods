import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://nolimitgoods.co.uk'),
  title: {
    default: 'NoLimitGoods | Heavy Machinery & Automotive Spare Parts Sourcing',
    template: '%s | NoLimitGoods',
  },
  description:
    'Global sourcing and rapid delivery of genuine & OEM spare parts for heavy machinery, construction equipment, and commercial vehicles. Direct procurement from UK & Europe.',
  keywords: [
    'heavy machinery spare parts',
    'construction equipment parts',
    'JCB spare parts UK',
    'Caterpillar parts supplier',
    'Komatsu genuine parts',
    'Donaldson filters supply',
    'industrial equipment sourcing',
    'commercial vehicle parts export',
    'OEM parts procurement',
  ],
  authors: [{ name: 'NoLimitGoods Ltd' }],
  creator: 'NoLimitGoods',
  publisher: 'NoLimitGoods',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://nolimitgoods.co.uk',
    title: 'NoLimitGoods | Heavy Machinery & OEM Spare Parts Procurement',
    description:
      'Fast RFQ pricing, worldwide delivery, and sourcing of genuine equipment parts from top UK and EU distributors.',
    siteName: 'NoLimitGoods',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NoLimitGoods | Spare Parts Sourcing',
    description:
      'Request genuine and OEM parts for machinery & industrial vehicles with quick worldwide delivery.',
  },
  alternates: {
    canonical: 'https://nolimitgoods.co.uk',
  },
  verification: {
    google: 'gHruZQx_jM4aYST2XHYbUyCRpztaRf2N0YgkKGiQEsM',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-670192610"
          strategy="afterInteractive"
        />
        <Script id="google-tag-init" strategy="after
