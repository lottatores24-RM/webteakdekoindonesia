import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FileText, MessageSquareQuote } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link, locales, type Locale } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';
import { getAllProducts, getProduct, getRelatedProducts, toCardData } from '@/lib/products';
import { getImage } from '@/lib/images';
import { renderProductBody } from '@/lib/mdx';
import { absoluteUrl } from '@/lib/utils';
import { site } from '@/lib/site';
import { ProductGallery } from '@/components/sections/ProductGallery';
import { InquiryForm } from '@/components/sections/InquiryForm';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Badge } from '@/components/ui/Badge';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProductCard } from '@/components/ui/ProductCard';
import { JsonLd } from '@/components/ui/JsonLd';
import { buttonClass, LinkButton } from '@/components/ui/Button';
import { WhatsAppLink } from '@/components/layout/WhatsAppLink';

type Props = { params: { locale: Locale; slug: string } };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => getAllProducts().map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params: { locale, slug } }: Props): Promise<Metadata> {
  const product = getProduct(slug);
  if (!product) return {};
  const t = await getTranslations({ locale });
  const name = product.name[locale];
  return pageMetadata({
    locale,
    path: `/products/${slug}`,
    title: `${name} — ${t(`categories.${product.category}.name`)}`,
    description: t('meta.product.description', { name, summary: product.summary[locale] }),
    image: product.images[0],
    imageAlt: t('common.productAlt', { name }),
  });
}

export default async function ProductPage({ params: { locale, slug } }: Props) {
  const product = getProduct(slug);
  if (!product) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale });
  const name = product.name[locale];
  const categoryName = t(`categories.${product.category}.name`);
  const materials = product.materials.map((m) => t(`filters.materials.${m}`)).join(', ');
  const body = await renderProductBody(product.body, locale);
  const related = getRelatedProducts(product).map((p) => toCardData(p, locale));
  const images = product.images.map(getImage);

  const specs = [
    { label: t('product.itemCode'), value: product.code },
    { label: t('product.dimensions'), value: product.dimensions },
    { label: t('product.material'), value: materials },
    { label: t('product.category'), value: categoryName },
    { label: t('product.origin'), value: t('product.originValue') },
  ];

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: product.summary[locale],
    image: product.images.map((src) => absoluteUrl(src)),
    url: absoluteUrl(`/${locale}/products/${slug}`),
    category: categoryName,
    material: materials,
    brand: { '@type': 'Brand', name: site.name },
    manufacturer: { '@id': absoluteUrl('/#organization') },
    countryOfOrigin: 'ID',
    // Only expose the item code once the client has replaced the placeholder
    ...(product.code.startsWith('[') ? {} : { sku: product.code }),
  };

  return (
    <>
      <JsonLd data={productJsonLd} />
      <div className="container max-w-content pt-6">
        <Breadcrumb
          locale={locale}
          items={[
            { label: t('nav.collections'), href: '/collections' },
            { label: categoryName, href: `/collections/${product.category}` },
            { label: name },
          ]}
        />
      </div>

      <section className="container max-w-content pb-24 pt-8 lg:pb-[120px]">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={images} alt={t('common.productAlt', { name })} cutout={product.cutout} />

          <div className="lg:py-4">
            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/collections/${product.category}`}>
                <Badge>{categoryName}</Badge>
              </Link>
              {product.bestSeller && <Badge tone="gold">{t('common.bestSeller')}</Badge>}
            </div>
            <h1 className="mt-5 font-display text-[clamp(32px,4.5vw,48px)] font-extrabold leading-[1.1] tracking-[-0.02em] text-ink">
              {name}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted">{product.summary[locale]}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#inquiry" className={buttonClass('primary', 'lg')}>
                <MessageSquareQuote className="h-5 w-5" aria-hidden="true" />
                {t('product.askQuote')}
              </a>
              <WhatsAppLink
                message={t('whatsapp.productMessage', { product: name })}
                location={`product-${slug}`}
                size="lg"
              >
                {t('product.whatsapp')}
              </WhatsAppLink>
            </div>

            <div className="prose-body mt-10 space-y-5 text-body text-ink/85">{body}</div>

            <h2 className="mt-10 text-xs font-bold uppercase tracking-[0.12em] text-muted">{t('product.specs')}</h2>
            <dl className="mt-3 divide-y divide-line border-y border-line">
              {specs.map((s) => (
                <div key={s.label} className="grid grid-cols-[140px_1fr] gap-4 py-3.5 text-[15px]">
                  <dt className="text-muted">{s.label}</dt>
                  <dd className="font-medium text-ink">{s.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm text-muted">{t('product.uniqueNote')}</p>

            <div className="mt-8 flex items-center gap-4 rounded-lg bg-surface p-5">
              <FileText className="h-7 w-7 shrink-0 text-accent-text" aria-hidden="true" />
              <p className="flex-1 text-sm text-muted">{t('category.catalogText', { category: categoryName })}</p>
              <LinkButton href="/request-catalog" variant="outline" className="shrink-0">
                {t('common.requestCatalog')}
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry */}
      <Section tone="surface" id="inquiry">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <SectionHeader
            label={t('product.inquiryLabel')}
            title={t('product.inquiryTitle')}
            intro={t('product.inquiryText')}
          />
          <InquiryForm product={name} />
        </div>
      </Section>

      {related.length > 0 && (
        <Section tone="canvas">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeader label={t('product.relatedLabel')} title={t('product.related')} />
            <LinkButton href={`/collections/${product.category}`} variant="outline" className="self-start md:self-auto">
              {t('common.viewCollection')}
            </LinkButton>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
