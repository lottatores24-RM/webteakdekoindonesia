import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';
import { categories, categoryImages, getAllProducts, getProductsByCategory, toCardData } from '@/lib/products';
import { PageHero } from '@/components/sections/PageHero';
import { CategoryCard } from '@/components/sections/CategoryCard';
import { ProductGrid } from '@/components/sections/ProductGrid';
import { CtaBand } from '@/components/sections/CtaBand';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';

type Props = { params: { locale: Locale } };

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta.collections' });
  return pageMetadata({
    locale,
    path: '/collections',
    title: t('title'),
    description: t('description'),
    image: categoryImages['tables-and-stools'].src,
  });
}

export default async function CollectionsPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const products = getAllProducts().map((p) => toCardData(p, locale));

  return (
    <>
      <PageHero
        label={t('collections.hero.label')}
        title={t('collections.hero.title')}
        subtitle={t('collections.hero.subtitle')}
        breadcrumb={<Breadcrumb locale={locale} items={[{ label: t('nav.collections') }]} />}
      />

      <Section tone="canvas">
        <SectionHeader label={t('collections.rangesLabel')} title={t('collections.rangesTitle')} />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {categories.map((c, i) => (
            <CategoryCard
              key={c}
              index={i}
              href={`/collections/${c}`}
              title={t(`categories.${c}.name`)}
              text={t(`categories.${c}.long`)}
              image={categoryImages[c].src}
              contain={categoryImages[c].contain}
              imageAlt={t(`categories.${c}.imageAlt`)}
              cta={t('common.viewCollection')}
              count={t('common.productsCount', { count: getProductsByCategory(c).length })}
            />
          ))}
        </div>
        <p className="mt-8 text-sm text-muted">{t('collections.moreSoon')}</p>
      </Section>

      <Section tone="canvas" className="!pt-0">
        <div className="border-t border-line pt-24 lg:pt-[120px]">
          <SectionHeader label={t('collections.allLabel')} title={t('collections.allTitle')} />
          <div className="mt-12">
            <ProductGrid products={products} mode="groups" />
          </div>
        </div>
      </Section>

      <CtaBand
        title={t('requestCatalog.hero.title')}
        text={t('category.help')}
        primaryLabel={t('common.requestCatalog')}
        whatsappLabel={t('common.chatWhatsApp')}
        whatsappMessage={t('whatsapp.defaultMessage')}
        location="collections-cta"
      />
    </>
  );
}
