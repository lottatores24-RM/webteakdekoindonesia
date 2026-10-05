/**
 * Company facts from the official company profile.
 * Values in [BRACKETS] are placeholders the client still has to supply.
 */
export const site = {
  name: 'CV. Teak & Deko Indonesia',
  shortName: 'Teak & Deko',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.teakdekoindonesia.com').replace(/\/$/, ''),
  foundingDate: '2016-04-19',
  email: 'teakdekoindo@gmail.com',
  address: {
    street: 'Dsn. Gupak Warak Rt. 04, Sendangsari',
    district: 'Pajangan',
    regency: 'Bantul',
    region: 'Daerah Istimewa Yogyakarta',
    country: 'Indonesia',
    countryCode: 'ID',
    full: 'Dsn. Gupak Warak Rt. 04, Sendangsari, Pajangan, Bantul, Yogyakarta, Indonesia',
  },
  contacts: [
    { name: 'Agung Edi Dahono', phone: '+62 851 5744 8348', wa: '6285157448348' },
    { name: 'Ely Ratna Wulandari', phone: '+62 851 5644 2599', wa: '6285156442599' },
  ],
  /** Primary WhatsApp number used by the floating button and product links */
  whatsapp: '6285157448348',
  mapsQuery: 'Gupak Warak, Sendangsari, Pajangan, Bantul, Yogyakarta',
  operatingHours: '[OPERATING HOURS]',
} as const;

export const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(site.mapsQuery)}&output=embed`;
export const mapsLinkUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapsQuery)}`;

/** Main navigation, in display order. Labels live in messages under `nav`. */
export const mainNav = [
  { key: 'collections', href: '/collections' },
  { key: 'about', href: '/about' },
  { key: 'howToOrder', href: '/how-to-order' },
  { key: 'exportInfo', href: '/export-info' },
  { key: 'gallery', href: '/gallery' },
  { key: 'faq', href: '/faq' },
  { key: 'contact', href: '/contact' },
] as const;

/** Every static (non-product) route, used by the sitemap. */
export const staticRoutes = [
  '',
  '/about',
  '/collections',
  '/collections/tables-and-stools',
  '/collections/decoration',
  '/how-to-order',
  '/export-info',
  '/gallery',
  '/faq',
  '/contact',
  '/request-catalog',
] as const;
