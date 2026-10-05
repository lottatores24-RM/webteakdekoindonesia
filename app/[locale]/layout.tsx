import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { routing, type Locale } from '@/lib/i18n';
import { site } from '@/lib/site';
import { organizationJsonLd } from '@/lib/seo';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { Analytics, GtmNoScript } from '@/components/layout/Analytics';
import { themeInitScript } from '@/components/layout/ThemeToggle';
import { RevealObserver } from '@/components/ui/RevealObserver';
import { JsonLd } from '@/components/ui/JsonLd';
import '../globals.css';

const display = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '800'],
  display: 'swap',
  variable: '--font-display',
});

const sans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#111210' },
  ],
};

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'meta' });
  return {
    metadataBase: new URL(site.url),
    title: { default: t('siteName'), template: t('titleTemplate') },
    description: t('defaultDescription'),
    applicationName: site.name,
    formatDetection: { telephone: false },
    robots: { index: true, follow: true },
  };
}

/** Only the namespaces used by client components are sent to the browser */
const clientNamespaces = [
  'common',
  'nav',
  'whatsapp',
  'filters',
  'collections',
  'categories',
  'form',
  'gallery',
] as const;

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: { locale: string } }) {
  if (!hasLocale(routing.locales, params.locale)) notFound();
  const locale = params.locale;
  setRequestLocale(locale);

  const messages = await getMessages();
  const clientMessages = Object.fromEntries(clientNamespaces.map((ns) => [ns, messages[ns]]));
  const t = await getTranslations({ locale });

  return (
    <html lang={locale} className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <GtmNoScript />
        <NextIntlClientProvider locale={locale} messages={clientMessages}>
          <a
            href="#main"
            className="sr-only z-[60] rounded bg-accent px-4 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
          >
            {t('common.skipToContent')}
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer locale={locale} />
          <WhatsAppButton />
          <RevealObserver />
        </NextIntlClientProvider>
        <JsonLd data={organizationJsonLd(t('meta.defaultDescription'))} />
        <Analytics />
      </body>
    </html>
  );
}
