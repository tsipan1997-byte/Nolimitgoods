import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { LanguageProvider } from '@/lib/language-context';
import CookieConsent from './cookie-consent';
import MobileContactBar from './components/mobile-contact-bar';
import MetaTracking from './components/meta-tracking';
import { absUrl, toPublicTenant, type Tenant } from '@/lib/tenants';
import { getTenant } from '@/lib/tenant-server';
import { TenantProvider } from '@/lib/tenant-context';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

const SITE_TITLE = 'Запчастини для спецтехніки, сільгосптехніки та авто з Англії — NoLimitGoods';
const SITE_DESCRIPTION =
  'Знайдемо і привеземо запчастини для спецтехніки (JCB, Caterpillar, Komatsu, Volvo, Manitou), тракторів, вантажівок і авто: оригінал, якісний аналог або б/у. Підбір за VIN, номером чи фото. Хаб у Великій Британії, доставка в Україну 5–14 робочих днів.';

// Партнер (White Label) — аукціонний портал: свій заголовок і опис без NoLimitGoods
function siteTexts(t: Tenant) {
  if (t.isDefault) {
    return {
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      ogAlt: 'NoLimitGoods — запчастини до спецтехніки з Великобританії',
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
    };
  }
  return {
    title: `Техніка з аукціонів Великої Британії та Європи — ${t.brand.name}`,
    description:
      'Спецтехніка, трактори і вантажівки з аукціонів Великої Британії та Європи з доставкою в Україну: підбір лота, ставка за вас, викуп, експортні документи, доставка і розмитнення під ключ.',
    ogAlt: `${t.brand.name} — техніка з аукціонів Європи`,
    keywords: ['аукціони спецтехніки', 'техніка з Англії', 'трактор з аукціону', 'екскаватор з аукціону', t.brand.name],
  };
}

export function generateMetadata(): Metadata {
  const t = getTenant();
  const x = siteTexts(t);
  return {
    metadataBase: new URL(t.siteUrl),
    title: x.title,
    description: x.description,
    keywords: x.keywords,
    robots: t.seo.indexable ? { index: true, follow: true } : { index: false, follow: false },
    ...(t.brand.favicon ? { icons: { icon: t.brand.favicon, apple: t.brand.favicon } } : {}),
    openGraph: {
      title: x.title,
      description: x.description,
      type: 'website',
      url: t.siteUrl,
      siteName: t.brand.nameLegal,
      locale: 'uk_UA',
      images: [
        {
          url: t.brand.ogImage,
          width: 1200,
          height: 630,
          alt: x.ogAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: x.title,
      description: x.description,
      images: [t.brand.ogImage],
    },
  };
}

function organizationJsonLd(t: Tenant) {
  const c = t.contact;
  const co = t.company;
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: t.brand.nameLegal,
    legalName: co.legalNameFull,
    url: t.siteUrl,
    logo: absUrl(t, t.brand.logo),
    email: c.email,
    telephone: c.phoneUk.replace(/\s/g, ''),
    contactPoint: [
      { '@type': 'ContactPoint', telephone: c.phoneUk.replace(/\s/g, ''), contactType: 'sales', areaServed: t.isDefault ? ['GB', 'UA'] : 'UA', availableLanguage: t.isDefault ? ['uk', 'en'] : ['uk'] },
      ...(c.phoneUa && c.phoneUa !== c.phoneUk
        ? [{ '@type': 'ContactPoint', telephone: c.phoneUa.replace(/\s/g, ''), contactType: 'customer service', areaServed: 'UA', availableLanguage: ['uk'] }]
        : []),
    ],
    sameAs: [t.social.instagram, t.social.facebook, t.social.telegramChannel].filter(Boolean),
    areaServed: t.isDefault ? ['UA', 'GB'] : ['UA'],
    ...(co.vat ? { vatID: co.vat } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: co.street,
      addressLocality: co.city,
      postalCode: co.postalCode,
      addressCountry: co.countryCode,
    },
    description: t.isDefault
      ? 'Знайдемо і привеземо запчастини для спецтехніки, сільгосптехніки та авто: оригінал, аналог або б/у.'
      : 'Техніка з аукціонів Великої Британії та Європи з доставкою в Україну під ключ.',
  };
}

// Перевизначення фірмової палітри (--brand-*) для партнера
function paletteCss(t: Tenant): string | null {
  if (!t.brand.palette) return null;
  return `:root{${Object.entries(t.brand.palette).map(([k, v]) => `--brand-${k}:${v};`).join('')}}`;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = getTenant();
  const { metaPixelId, googleAdsId, ga4Id } = t.analytics;
  const gtagIds = [googleAdsId, ga4Id].filter(Boolean) as string[];
  const palette = paletteCss(t);
  return (
    <html lang="uk" className="scroll-smooth dark">
      <head>
        {palette && <style id="tenant-palette" dangerouslySetInnerHTML={{ __html: palette }} />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(t)) }}
        />
        {/* Google Tag (Google Ads / GA4 з конфігу партнера, lib/tenants.ts) */}
        {gtagIds.length > 0 && (
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${gtagIds[0]}`}
          />
        )}
        {gtagIds.length > 0 && (
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
              ${gtagIds.map((id) => `gtag('config', '${id}');`).join('\n              ')}
            `,
            }}
          />
        )}
      </head>
      <body className={`${inter.className} pb-14 md:pb-0 bg-white text-slate-900 antialiased selection:bg-red-600 selection:text-white`}>
        {/* Meta Pixel Code (ID з конфігу партнера) */}
        {metaPixelId && (
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
            fbq('init', '${metaPixelId}');
            fbq('track', 'PageView');
          `}
          </Script>
        )}

        {/* Кліки по контактах → Meta (піксель + сервер /api/track) */}
        <MetaTracking />

        <TenantProvider tenant={toPublicTenant(t)}>
          <LanguageProvider>
            {children}
            <MobileContactBar />
            <CookieConsent />
          </LanguageProvider>
        </TenantProvider>
      </body>
    </html>
  );
}
