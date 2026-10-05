import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';
import { categories, categoryImages, getAllProducts, getProductsByCategory, toCardData } from '@/lib/products';
import { Hero } from '@/components/sections/Hero';
import { TrustStrip } from '@/components/sections/TrustStrip';
import { CategoryCard } from '@/components/sections/CategoryCard';
import { CtaBand } from '@/components/sections/CtaBand';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SmartImage } from '@/components/ui/SmartImage';
import { LinkButton } from '@/components/ui/Button';
import { ProductCard } from '@/components/ui/ProductCard';

type Props = { params: { locale: Locale } };

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta.home' });
  return pageMetadata({ locale, path: '', title: t('title'), description: t('description'), absoluteTitle: true });
}

const storySteps = [
  { key: 'collect', image: '/images/gallery/teak-block-stock.jpg' },
  { key: 'workshop', image: '/images/hero/workshop-stock.jpg' },
  { key: 'create', image: '/images/products/tables/branch-console.jpg' },
  { key: 'ship', image: '/images/gallery/exhibition.jpg' },
] as const;

const stats = ['since', 'founded', 'markets', 'woods'] as const;

export default async function HomePage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const bestSellers = getAllProducts()
    .filter((p) => p.bestSeller)
    .slice(0, 4)
    .map((p) => toCardData(p, locale));

  return (
    <>
      <Hero
        label={t('home.hero.label')}
        title={t('home.hero.title')}
        subtitle={t('home.hero.subtitle')}
        image="/images/hero/workshop-yard.jpg"
        imageAlt={t('home.hero.imageAlt')}
        primary={{ label: t('home.hero.ctaPrimary'), href: '/collections' }}
        secondary={{ label: t('home.hero.ctaSecondary'), href: '/request-catalog' }}
        scrollLabel={t('home.hero.scroll')}
      />

      <TrustStrip locale={locale} />

      {/* About */}
      <Section tone="canvas">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="relative" data-reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg sm:aspect-[5/4] lg:aspect-[4/5]">
              <SmartImage
                src="/images/hero/workshop-stock.jpg"
                alt={t('home.about.workshopAlt')}
                fill
                sizes="(min-width: 1024px) 600px, 92vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-8 right-4 w-[46%] overflow-hidden rounded-lg border-[6px] border-canvas shadow-soft sm:right-8">
              <SmartImage
                src="/images/gallery/sign.jpg"
                alt={t('home.about.signAlt')}
                sizes="280px"
                className="h-auto w-full"
              />
            </div>
          </div>
          <div className="pt-6 lg:pt-0">
            <SectionHeader label={t('home.about.label')} title={t('home.about.title')} />
            <div className="prose-body mt-6 text-body text-muted" data-reveal>
              <p>{t('home.about.text1')}</p>
              <p>{t('home.about.text2')}</p>
            </div>
            <dl className="mt-8 flex gap-4 border-l-2 border-accent pl-5" data-reveal>
              <dt className="text-sm text-muted">{t('home.about.since')}</dt>
              <dd className="font-display text-lg font-bold text-ink">{t('home.about.sinceDate')}</dd>
            </dl>
            <div className="mt-10" data-reveal>
              <LinkButton href="/about" variant="outline">
                {t('home.about.cta')}
              </LinkButton>
            </div>
          </div>
        </div>
      </Section>

      {/* Collections */}
      <Section tone="surface">
        <SectionHeader
          label={t('home.collections.label')}
          title={t('home.collections.title')}
          intro={t('home.collections.intro')}
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {categories.map((c, i) => (
            <CategoryCard
              key={c}
              index={i}
              href={`/collections/${c}`}
              title={t(`categories.${c}.name`)}
              text={t(`categories.${c}.short`)}
              image={categoryImages[c].src}
              contain={categoryImages[c].contain}
              imageAlt={t(`categories.${c}.imageAlt`)}
              cta={t('common.viewCollection')}
              count={t('common.productsCount', { count: getProductsByCategory(c).length })}
            />
          ))}
        </div>
      </Section>

      {/* Story — scroll storytelling */}
      <Section tone="canvas">
        <SectionHeader label={t('home.story.label')} title={t('home.story.title')} align="center" />
        <ol className="mt-16 space-y-20 lg:space-y-28">
          {storySteps.map((step, i) => (
            <li key={step.key} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-20">
              <div className={i % 2 ? 'lg:order-2' : ''} data-reveal>
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                  <SmartImage
                    src={step.image}
                    alt={t(`home.story.steps.${step.key}.imageAlt`)}
                    fill
                    sizes="(min-width: 1024px) 600px, 92vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <div data-reveal>
                <span className="font-display text-6xl font-extrabold text-accent-text/25" aria-hidden="true">
                  0{i + 1}
                </span>
                <h3 className="mt-2 font-display text-3xl font-bold text-ink">
                  {t(`home.story.steps.${step.key}.title`)}
                </h3>
                <p className="mt-4 max-w-lg text-body text-muted">{t(`home.story.steps.${step.key}.text`)}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Markets / numbers */}
      <Section tone="dark">
        <SectionHeader label={t('home.markets.label')} title={t('home.markets.title')} tone="dark" />
        <dl className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s}
              className="flex flex-col-reverse justify-end border-t border-white/15 pt-6"
              data-reveal
              style={{ ['--reveal-delay' as string]: `${i * 100}ms` }}
            >
              <dt className="mt-3 text-[15px] text-oncream/80">{t(`home.markets.stats.${s}.label`)}</dt>
              <dd className="font-display text-6xl font-extrabold text-oncream">
                {t(`home.markets.stats.${s}.value`)}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Best sellers */}
      <Section tone="canvas">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader label={t('home.bestSellers.label')} title={t('home.bestSellers.title')} />
          <LinkButton href="/collections" variant="outline" className="self-start md:self-auto">
            {t('home.bestSellers.cta')}
          </LinkButton>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      </Section>

      <CtaBand
        title={t('home.ctaBand.title')}
        text={t('home.ctaBand.text')}
        primaryLabel={t('home.ctaBand.primary')}
        whatsappLabel={t('home.ctaBand.secondary')}
        whatsappMessage={t('whatsapp.defaultMessage')}
        location="home-cta"
      />
    </>
  );
}
