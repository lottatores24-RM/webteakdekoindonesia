import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowRight, FileText } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link, locales, type Locale } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';
import { categories, categoryImages, getProductsByCategory, isCategory, toCardData } from '@/lib/products';
import { PageHero } from '@/components/sections/PageHero';
import { ProductGrid } from '@/components/sections/ProductGrid';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Section } from '@/components/ui/Section';
import { SmartImage } from '@/components/ui/SmartImage';
import { LinkButton } from '@/components/ui/Button';
import { WhatsAppLink } from '@/components/layout/WhatsAppLink';

type Props = { params: { locale: Locale; slug: string } };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => categories.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params: { locale, slug } }: Props): Promise<Metadata> {
  if (!isCategory(slug)) return {};
  const t = await getTranslations({ locale, namespace: `meta.category.${slug}` });
  return pageMetadata({
    locale,
    path: `/collections/${slug}`,
    title: t('title'),
    description: t('description'),
    image: categoryImages[slug].src,
  });
}

export default async function CollectionPage({ params: { locale, slug } }: Props) {
  if (!isCategory(slug)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const products = getProductsByCategory(slug).map((p) => toCardData(p, locale));
  const name = t(`categories.${slug}.name`);
  const other = categories.find((c) => c !== slug)!;

  return (
    <>
      <PageHero
        label={t('nav.collections')}
        title={name}
        subtitle={t(`categories.${slug}.long`)}
        breadcrumb={
          <Breadcrumb
            locale={locale}
            items={[{ label: t('nav.collections'), href: '/collections' }, { label: name }]}
          />
        }
      >
        <p className="mt-6 text-sm font-semibold text-muted">{t('common.productsCount', { count: products.length })}</p>
      </PageHero>

      <Section tone="canvas" className="!pt-16 lg:!pt-20">
        <h2 className="sr-only">{t('collections.allTitle')}</h2>
        <ProductGrid products={products} mode="types" showMaterials />
      </Section>

      {/* Request e-catalog for this range */}
      <Section tone="surface">
        <div className="grid items-center gap-10 overflow-hidden rounded-lg bg-canvas ring-1 ring-line lg:grid-cols-2">
          <div className="p-8 sm:p-12" data-reveal>
            <FileText className="h-9 w-9 text-accent-text" aria-hidden="true" />
            <h2 className="mt-6 font-display text-3xl font-bold text-ink">{t('category.catalogTitle')}</h2>
            <p className="mt-4 text-body text-muted">{t('category.catalogText', { category: name })}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/request-catalog">{t('category.catalogCta')}</LinkButton>
              <WhatsAppLink message={t('whatsapp.defaultMessage')} location={`collection-${slug}`}>
                {t('common.chatWhatsApp')}
              </WhatsAppLink>
            </div>
          </div>
          <div className="relative hidden aspect-[4/3] h-full lg:block">
            <SmartImage
              src={categoryImages[slug].src}
              alt={t(`categories.${slug}.imageAlt`)}
              fill
              sizes="640px"
              className={categoryImages[slug].contain ? 'bg-white object-contain p-8' : 'object-cover'}
            />
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-line pt-10 sm:flex-row sm:items-center">
          <p className="text-muted">{t('category.help')}</p>
          <Link
            href={`/collections/${other}`}
            className="inline-flex min-h-[44px] items-center gap-2 font-semibold text-accent-text hover:underline"
          >
            {t('category.otherRange')}: {t(`categories.${other}.name`)}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </Section>
    </>
  );
}
