import type { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n';
import { staticRoutes } from '@/lib/site';
import { getAllProducts } from '@/lib/products';
import { languageAlternates } from '@/lib/seo';
import { absoluteUrl } from '@/lib/utils';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...staticRoutes, ...getAllProducts().map((p) => `/products/${p.slug}`)];
  const lastModified = new Date();

  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: absoluteUrl(`/${locale}${path}`),
      lastModified,
      changeFrequency: path.startsWith('/products') ? ('monthly' as const) : ('weekly' as const),
      priority: path === '' ? 1 : path.startsWith('/collections') ? 0.9 : 0.7,
      alternates: { languages: languageAlternates(path) },
    })),
  );
}
