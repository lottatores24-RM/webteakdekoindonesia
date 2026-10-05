import type { Metadata } from 'next';
import { locales, type Locale } from './i18n';
import { site } from './site';
import { absoluteUrl } from './utils';

const ogLocale: Record<Locale, string> = { en: 'en_US', id: 'id_ID' };

type PageMetaInput = {
  locale: Locale;
  /** Path without locale, e.g. "/about" or "" for home */
  path: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  absoluteTitle?: boolean;
};

export function languageAlternates(path: string) {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = absoluteUrl(`/${l}${path}`);
  languages['x-default'] = absoluteUrl(`/en${path}`);
  return languages;
}

/** Title, description, canonical, hreflang, Open Graph and Twitter tags for one page. */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  image = '/images/hero/workshop-yard.jpg',
  imageAlt,
  absoluteTitle,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(`/${locale}${path}`);
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: site.name,
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      images: [{ url: image, alt: imageAlt ?? title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export function organizationJsonLd(description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': absoluteUrl('/#organization'),
    name: site.name,
    url: site.url,
    logo: absoluteUrl('/images/logo/logo-full.png'),
    image: absoluteUrl('/images/hero/workshop-yard.jpg'),
    description,
    email: site.email,
    telephone: site.contacts[0].phone,
    foundingDate: site.foundingDate,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: `${site.address.district}, ${site.address.regency}`,
      addressRegion: site.address.region,
      addressCountry: site.address.countryCode,
    },
    contactPoint: site.contacts.map((c) => ({
      '@type': 'ContactPoint',
      contactType: 'sales',
      name: c.name,
      telephone: c.phone,
      email: site.email,
      availableLanguage: ['English', 'Indonesian'],
    })),
    areaServed: ['Europe', 'United States', 'Middle East', 'Indonesia'],
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
}
