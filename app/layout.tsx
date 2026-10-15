import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/lib/language-context';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'NoLimitGoods Ltd | UK Hub & Machinery Parts Export',
  description: 'Офіційний експортний хаб Великобританії (Ковентрі). Поставки оригінальних фільтрів та вузлів спецтехніки JCB, Perkins, CAT, Donaldson. Прямий нульовий експортний ПДВ (0% UK VAT) та доставка вантажів.',
  keywords: 'NoLimitGoods, запчастини Великобританія, JCB Україна, експорт UK, 0% VAT, фільтри Donaldson, Perkins запчастини',
  openGraph: {
    title: 'NoLimitGoods Ltd | Поставки запчастин з Великобританії',
    description: 'Прямий експорт оригінальних вузлів та фільтрів з хабу в Ковентрі. 0% UK Export VAT, доставка вантажів.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" className="scroll-smooth dark">
      <head>
        {/* Пряме підключення Google Tag для гарантованого проходження валідації */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-670192610"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-670192610');
            `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-slate-950 text-slate-100 antialiased selection:bg-red-600 selection:text-white`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
