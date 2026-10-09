import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { LanguageProvider } from '@/lib/language-context';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'NoLimitGoods Ltd | UK Heavy Machinery Spare Parts & Logistics',
  description: 'Direct supply of genuine JCB, Donaldson, CAT, Perkins parts from Coventry, UK to Ukraine. T1 transit, 0% UK export VAT, express delivery.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AutoPartsStore',
    'name': 'NoLimitGoods Limited',
    'legalName': 'NoLimitGoods Limited',
    'description': 'Direct UK exporter of heavy machinery and automotive spare parts to Ukraine.',
    'telephone': '+447426826595',
    'email': 'nolimitgoods@gmail.com',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '374 Hipsell Highway',
      'addressLocality': 'Coventry',
      'postalCode': 'CV2 5FR',
      'addressCountry': 'GB',
    },
    'vatID': 'GB372654187',
    'taxID': '13146899',
    'hasMerchantReturnPolicy': {
      '@type': 'MerchantReturnPolicy',
      'applicableCountry': 'UA',
    },
    'priceRange': '££',
  };

  return (
    <html lang="uk" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google Tag (gtag.js) */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=AW-CONVERSION_ID"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-CONVERSION_ID');
            `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-slate-950 text-slate-100 antialiased`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
