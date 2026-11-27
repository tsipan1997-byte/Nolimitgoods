import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { LanguageProvider } from '@/lib/language-context';
import CookieConsent from './cookie-consent';
import MobileContactBar from './components/mobile-contact-bar';
import MetaTracking from './components/meta-tracking';
import { CONTACT, SOCIAL } from '@/lib/site-config';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

const SITE_TITLE = 'Запчастини для спецтехніки, сільгосптехніки та авто з Англії — NoLimitGoods';
const SITE_DESCRIPTION =
  'Знайдемо і привеземо запчастини для спецтехніки (JCB, Caterpillar, Komatsu, Volvo, Manitou), тракторів, вантажівок і авто: оригінал, якісний аналог або б/у. Підбір за VIN, номером чи фото. Хаб у Великій Британії, доставка в Україну 5–14 робочих днів.';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.nolimitgoods.com'),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: [
    'запчастини для спецтехніки',
    'запчастини JCB',
    'запчастини Caterpillar',
    'запчастини для тракторів',
    'запчастини з Англії',
    'оригінальні запчастини',
    'б/у запчастини',
    'аналоги запчастин',
    'NoLimitGoods',
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: 'website',
    url: 'https://www.nolimitgoods.com',
    siteName: 'NoLimitGoods Ltd',
    locale: 'uk_UA',
    images: [
      {
        url: '/og-nlg.png',
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
    images: ['/og-nlg.png'],
  },
};

const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'NoLimitGoods Ltd',
  legalName: 'NoLimitGoods Limited',
  url: 'https://www.nolimitgoods.com',
  logo: 'https://www.nolimitgoods.com/logo.png',
  email: CONTACT.email,
  telephone: CONTACT.phoneUk.replace(/\s/g, ''),
  contactPoint: [
    { '@type': 'ContactPoint', telephone: CONTACT.phoneUk.replace(/\s/g, ''), contactType: 'sales', areaServed: ['GB', 'UA'], availableLanguage: ['uk', 'en'] },
    ...(CONTACT.phoneUa
      ? [{ '@type': 'ContactPoint', telephone: CONTACT.phoneUa.replace(/\s/g, ''), contactType: 'customer service', areaServed: 'UA', availableLanguage: ['uk'] }]
      : []),
  ],
  sameAs: [SOCIAL.instagram, SOCIAL.facebook, SOCIAL.telegramChannel].filter(Boolean),
  areaServed: ['UA', 'GB'],
  vatID: 'GB372654187',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '374 Hipswell Highway',
    addressLocality: 'Coventry',
    postalCode: 'CV2 5FR',
    addressCountry: 'GB',
  },
  description:
    'Знайдемо і привеземо запчастини для спецтехніки, сільгосптехніки та авто: оригінал, аналог або б/у.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" className="scroll-smooth dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
        />
        {/* Google Tag AW-670192610 */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-670192610"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                analytics_storage: 'denied'
              });
              try {
                if (localStorage.getItem('nlg_cookie_consent') === 'granted') {
                  gtag('consent', 'update', {
                    ad_storage: 'granted',
                    ad_user_data: 'granted',
                    ad_personalization: 'granted',
                    analytics_storage: 'granted'
                  });
                }
              } catch (e) {}
              gtag('js', new Date());
              gtag('config', 'AW-670192610');
            `,
          }}
        />
      </head>
      <body className={`${inter.className} pb-14 md:pb-0 bg-slate-50 text-slate-900 antialiased selection:bg-red-600 selection:text-white`}>
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
            try {
              if (localStorage.getItem('nlg_cookie_consent') === 'granted') {
                fbq('consent', 'grant');
              } else {
                fbq('consent', 'revoke');
              }
            } catch (e) {
              fbq('consent', 'revoke');
            }
            fbq('init', '1667641475157850');
            fbq('track', 'PageView');
          `}
        </Script>

        {/* Кліки по контактах → Meta (піксель + сервер /api/track) */}
        <MetaTracking />

        <LanguageProvider>
          {children}
          <MobileContactBar />
          <CookieConsent />
        </LanguageProvider>
      </body>
    </html>
  );
}
