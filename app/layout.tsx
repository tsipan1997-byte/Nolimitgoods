import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { LanguageProvider } from '@/lib/language-context';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

const SITE_TITLE = 'Запчастини до спецтехніки з Великобританії • 0% VAT | NoLimitGoods';
const SITE_DESCRIPTION =
  'NoLimitGoods Limited — офіційний хаб з постачання запчастин та фільтрів з Великобританії. 0% UK Export VAT. Доставка в Україну 5–14 робочих днів.';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.nolimitgoods.co.uk'),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: 'website',
    url: 'https://www.nolimitgoods.co.uk',
    siteName: 'NoLimitGoods Ltd',
    locale: 'uk_UA',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'NoLimitGoods — запчастини до спецтехніки з Великобританії',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/og-image.jpg'],
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
        {/* Підключення Google Tag AW-670192610 */}
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
        {/* Meta Pixel Code */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '2306915906774402');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=2306915906774402&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}

        {/* Відстеження кліків по месенджерах / телефону / email -> подія Contact у Meta */}
        <Script id="meta-contact-tracking" strategy="afterInteractive">
          {`
            document.addEventListener('click', function (e) {
              var el = e.target && e.target.closest ? e.target.closest('a') : null;
              if (!el) return;
              var href = el.getAttribute('href') || '';
              var method = null;
              if (href.indexOf('wa.me') > -1 || href.indexOf('whatsapp') > -1) method = 'whatsapp';
              else if (href.indexOf('t.me') > -1) method = 'telegram';
              else if (href.indexOf('viber://') === 0) method = 'viber';
              else if (href.indexOf('tel:') === 0) method = 'phone';
              else if (href.indexOf('mailto:') === 0) method = 'email';
              if (method && window.fbq) {
                window.fbq('track', 'Contact', { contact_method: method });
              }
            }, true);
          `}
        </Script>

        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
