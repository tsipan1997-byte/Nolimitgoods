import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import { LanguageProvider } from '@/lib/language-context';

export const dynamic = 'force-dynamic';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const host = headersList.get('x-forwarded-host') || headersList.get('host') || '';
  const protocol = headersList.get('x-forwarded-proto') || 'https';
  const baseUrl = host ? `${protocol}://${host}` : process.env.NEXTAUTH_URL || 'http://localhost:3000';

  return {
    metadataBase: new URL(baseUrl),
    title: 'NOLIMITGOODS - Logistics & Heavy Equipment Parts Supplier UK | JCB, Caterpillar, Komatsu Parts',
    description: 'UK-based logistics company and heavy equipment parts supplier. Worldwide delivery services and genuine & aftermarket parts for JCB, Caterpillar, Komatsu, CNH and other industrial brands.',
    keywords: ['logistics UK', 'worldwide delivery', 'heavy equipment parts', 'JCB parts', 'Caterpillar parts', 'Komatsu parts', 'CNH parts', 'construction machinery parts', 'hydraulic filters', 'fuel filters', 'spare parts UK', 'industrial parts supplier', 'NOLIMITGOODS', 'логістика', 'доставка', 'запчастини для техніки', 'запчастини JCB'],
    icons: {
      icon: '/favicon.svg',
    },
    openGraph: {
      title: 'NOLIMITGOODS - Logistics & Heavy Equipment Parts Supplier UK',
      description: 'UK-based logistics company and heavy equipment parts supplier. Worldwide delivery and parts for JCB, Caterpillar, Komatsu, CNH and other industrial brands.',
      images: ['/og-image.png'],
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
