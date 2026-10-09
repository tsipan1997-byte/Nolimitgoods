import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NoLimitGoods | Запчастини до спецтехніки з Британії',
  description: 'Прямий експортер оригінальних запчастин Donaldson, JCB, CAT, Perkins з хабу в Ковентрі (UK) в Україну. Офіційний інвойс 0% VAT, швидка доставка.',
  icons: {
    icon: '/icon',
    apple: '/icon',
  },
  openGraph: {
    title: 'NoLimitGoods | Запчастини до спецтехніки з Великобританії',
    description: 'Оригінальні фільтри, мости, гідравліка та двигуни зі складу в Ковентрі (UK). Доставка 5–8 днів.',
    url: 'https://nolimitgoods.com',
    siteName: 'NoLimitGoods Limited',
    locale: 'uk_UA',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" className="dark">
      <head>
        <link rel="icon" href="/icon" sizes="any" />
      </head>
      <body className={`${inter.className} bg-slate-950 text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
