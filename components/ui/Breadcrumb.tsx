import { ChevronRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import { absoluteUrl } from '@/lib/utils';
import { JsonLd } from './JsonLd';

type Crumb = { label: string; href?: string };

/** Visible breadcrumb trail plus BreadcrumbList structured data. Home is prepended automatically. */
export async function Breadcrumb({
  items,
  locale,
  tone = 'default',
}: {
  items: Crumb[];
  locale: Locale;
  tone?: 'default' | 'light';
}) {
  const t = await getTranslations({ locale, namespace: 'nav' });
  const tc = await getTranslations({ locale, namespace: 'common' });
  const all: Crumb[] = [{ label: t('home'), href: '/' }, ...items];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: all.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: absoluteUrl(`/${locale}${c.href === '/' ? '' : c.href}`) } : {}),
    })),
  };

  const muted = tone === 'light' ? 'text-white/75' : 'text-muted';
  const current = tone === 'light' ? 'text-white' : 'text-ink';

  return (
    <nav aria-label={tc('breadcrumb')}>
      <ol className={`flex flex-wrap items-center gap-1.5 text-sm ${muted}`}>
        {all.map((c, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />}
            {c.href && i < all.length - 1 ? (
              <Link
                href={c.href}
                className="inline-flex min-h-[44px] items-center hover:text-accent-text hover:underline"
              >
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className={`font-medium ${current}`}>
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
      <JsonLd data={jsonLd} />
    </nav>
  );
}
