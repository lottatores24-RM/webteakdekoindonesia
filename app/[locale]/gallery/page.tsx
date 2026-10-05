import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';
import { galleryFilters, getGalleryItems } from '@/lib/gallery';
import { PageHero } from '@/components/sections/PageHero';
import { ImageGallery } from '@/components/sections/ImageGallery';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Section } from '@/components/ui/Section';

type Props = { params: { locale: Locale } };

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta.gallery' });
  return pageMetadata({
    locale,
    path: '/gallery',
    title: t('title'),
    description: t('description'),
    image: '/images/hero/garden-display.jpg',
  });
}

export default async function GalleryPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const items = getGalleryItems(
    locale,
    (key, field) => t(`gallery.photos.${key}.${field}`),
    (name) => t('common.productAlt', { name }),
  );

  return (
    <>
      <PageHero
        label={t('gallery.hero.label')}
        title={t('gallery.hero.title')}
        subtitle={t('gallery.hero.subtitle')}
        breadcrumb={<Breadcrumb locale={locale} items={[{ label: t('nav.gallery') }]} />}
      />
      <Section tone="canvas" className="!pt-16 lg:!pt-20">
        <ImageGallery images={items} filters={galleryFilters} />
      </Section>
    </>
  );
}
