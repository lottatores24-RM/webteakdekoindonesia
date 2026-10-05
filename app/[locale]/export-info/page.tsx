import type { Metadata } from 'next';
import { Container, Globe } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';
import { getProduct } from '@/lib/products';
import { PageHero } from '@/components/sections/PageHero';
import { CtaBand } from '@/components/sections/CtaBand';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SmartImage } from '@/components/ui/SmartImage';
import { LinkButton } from '@/components/ui/Button';

type Props = { params: { locale: Locale } };

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta.exportInfo' });
  return pageMetadata({ locale, path: '/export-info', title: t('title'), description: t('description') });
}

const markets = ['europe', 'usa', 'middleEast', 'indonesia'] as const;
const terms = ['moq', 'port', 'payment', 'incoterms', 'certificates', 'leadTime'] as const;
const containers = ['c20', 'c40', 'c40hc'] as const;

export default async function ExportInfoPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const te = await getTranslations({ locale, namespace: 'exportInfo' });
  const showcase = ['teak-block-stool', 'large-teak-bowl'].map((slug) => getProduct(slug)!);

  return (
    <>
      <PageHero
        label={te('hero.label')}
        title={te('hero.title')}
        subtitle={te('hero.subtitle')}
        image="/images/gallery/teak-block-stock.jpg"
        imageAlt={t('gallery.photos.blocks.alt')}
        breadcrumb={<Breadcrumb locale={locale} tone="light" items={[{ label: t('nav.exportInfo') }]} />}
      />

      {/* Markets */}
      <Section tone="canvas">
        <SectionHeader label={te('marketsLabel')} title={te('marketsTitle')} />
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {markets.map((m, i) => (
            <li
              key={m}
              className="rounded-lg bg-surface p-7"
              data-reveal
              style={{ ['--reveal-delay' as string]: `${i * 100}ms` }}
            >
              <Globe className="h-7 w-7 text-accent-text" aria-hidden="true" />
              <h3 className="mt-5 font-display text-2xl font-bold text-ink">{te(`markets.${m}.title`)}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{te(`markets.${m}.text`)}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Materials */}
      <Section tone="surface">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeader label={te('materialsLabel')} title={te('materialsTitle')} intro={te('materialsText')} />
            <div className="mt-8" data-reveal>
              <LinkButton href="/about" variant="outline">
                {t('common.learnMore')}
              </LinkButton>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4" data-reveal>
            {showcase.map((p) => (
              <div key={p.slug} className="relative aspect-square overflow-hidden rounded-lg bg-white ring-1 ring-line">
                <SmartImage
                  src={p.images[0]}
                  alt={t('common.productAlt', { name: p.name[locale] })}
                  fill
                  sizes="(min-width: 1024px) 300px, 46vw"
                  className="object-contain p-4"
                />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Trade terms — dark band */}
      <Section tone="dark">
        <SectionHeader label={te('termsLabel')} title={te('termsTitle')} tone="dark" />
        <dl className="mt-14 grid gap-px overflow-hidden rounded-lg bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {terms.map((k) => (
            <div key={k} className="bg-forest p-7" data-reveal>
              <dt className="text-xs font-bold uppercase tracking-[0.12em] text-[#E8A79F]">{te(`terms.${k}.label`)}</dt>
              <dd className="mt-3 font-display text-2xl font-bold text-oncream">{te(`terms.${k}.value`)}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Shipping */}
      <Section tone="canvas">
        <SectionHeader label={te('shippingLabel')} title={te('shippingTitle')} intro={te('shippingText')} />
        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {containers.map((c, i) => (
            <li
              key={c}
              className="rounded-lg p-7 ring-1 ring-line"
              data-reveal
              style={{ ['--reveal-delay' as string]: `${i * 100}ms` }}
            >
              <Container className="h-8 w-8 text-accent-text" aria-hidden="true" />
              <h3 className="mt-5 text-xl font-bold text-ink">{te(`containers.${c}.title`)}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{te(`containers.${c}.text`)}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted">{te('containerNote')}</p>
      </Section>

      <CtaBand
        title={te('ctaTitle')}
        text={te('ctaText')}
        primaryLabel={t('common.askQuote')}
        primaryHref="/contact"
        whatsappLabel={t('common.chatWhatsApp')}
        whatsappMessage={t('whatsapp.defaultMessage')}
        location="export-cta"
      />
    </>
  );
}
