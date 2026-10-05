import type { Metadata } from 'next';
import { Leaf, Scale, Target } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/sections/PageHero';
import { Timeline } from '@/components/sections/Timeline';
import { CtaBand } from '@/components/sections/CtaBand';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SmartImage } from '@/components/ui/SmartImage';
import { LinkButton } from '@/components/ui/Button';

type Props = { params: { locale: Locale } };

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta.about' });
  return pageMetadata({
    locale,
    path: '/about',
    title: t('title'),
    description: t('description'),
    image: '/images/hero/garden-display.jpg',
  });
}

const timelineKeys = ['y2010', 'y2016', 'y2016b', 'y2020', 'y2022'] as const;
const materialKeys = [
  { key: 'rest', image: '/images/products/decoration/driftwood-root-sculpture.jpg' },
  { key: 'recycled', image: '/images/products/tables/beam-coffee-table.jpg' },
  { key: 'teak', image: '/images/products/tables/teak-block-stool.jpg' },
  { key: 'trembesi', image: '/images/products/tables/hollow-slab-console.jpg' },
] as const;
const processPhotos = [
  { key: 'stock', image: '/images/gallery/teak-block-stock.jpg' },
  { key: 'yard', image: '/images/hero/workshop-stock.jpg' },
  { key: 'exhibition', image: '/images/gallery/exhibition.jpg' },
] as const;

export default async function AboutPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const ta = await getTranslations({ locale, namespace: 'about' });

  const pillars = [
    { key: 'mission', Icon: Target },
    { key: 'vision', Icon: Scale },
    { key: 'values', Icon: Leaf },
  ] as const;

  return (
    <>
      <PageHero
        label={ta('hero.label')}
        title={ta('hero.title')}
        subtitle={ta('hero.subtitle')}
        image="/images/hero/workshop-yard.jpg"
        imageAlt={ta('hero.imageAlt')}
        breadcrumb={<Breadcrumb locale={locale} tone="light" items={[{ label: t('nav.about') }]} />}
      />

      {/* Story */}
      <Section tone="canvas">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <SectionHeader label={ta('story.label')} title={ta('story.title')} />
            <div className="prose-body mt-8 text-body text-muted" data-reveal>
              <p>{ta('story.p1')}</p>
              <p>{ta('story.p2')}</p>
              <p>{ta('story.p3')}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 self-center" data-reveal>
            <div className="relative col-span-2 aspect-[16/9] overflow-hidden rounded-lg">
              <SmartImage
                src="/images/hero/garden-display.jpg"
                alt={ta('story.gardenAlt')}
                fill
                sizes="(min-width: 1024px) 640px, 92vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <SmartImage
                src="/images/gallery/sign.jpg"
                alt={t('home.about.signAlt')}
                fill
                sizes="(min-width: 1024px) 320px, 46vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <SmartImage
                src="/images/hero/workshop-stock.jpg"
                alt={t('home.about.workshopAlt')}
                fill
                sizes="(min-width: 1024px) 320px, 46vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Mission / vision / values */}
      <Section tone="dark">
        <SectionHeader label={ta('mission.label')} title={ta('mission.title')} tone="dark" />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {pillars.map(({ key, Icon }, i) => (
            <article
              key={key}
              className="rounded-lg bg-white/[0.06] p-8 ring-1 ring-white/10"
              data-reveal
              style={{ ['--reveal-delay' as string]: `${i * 100}ms` }}
            >
              <Icon className="h-8 w-8 text-[#E8A79F]" aria-hidden="true" />
              <h3 className="mt-6 font-display text-2xl font-bold text-oncream">{ta(`mission.${key}.title`)}</h3>
              <p className="mt-3 leading-relaxed text-oncream/85">{ta(`mission.${key}.text`)}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* Timeline */}
      <Section tone="canvas">
        <SectionHeader label={ta('timeline.label')} title={ta('timeline.title')} />
        <div className="mt-16">
          <Timeline
            items={timelineKeys.map((k) => ({
              year: ta(`timeline.items.${k}.year`),
              title: ta(`timeline.items.${k}.title`),
              text: ta(`timeline.items.${k}.text`),
            }))}
          />
        </div>
      </Section>

      {/* Materials */}
      <Section tone="surface">
        <SectionHeader label={ta('materials.label')} title={ta('materials.title')} intro={ta('materials.intro')} />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {materialKeys.map(({ key, image }, i) => (
            <article
              key={key}
              className="overflow-hidden rounded-lg bg-canvas ring-1 ring-line"
              data-reveal
              style={{ ['--reveal-delay' as string]: `${i * 100}ms` }}
            >
              <div className="relative aspect-[4/3] bg-white">
                <SmartImage
                  src={image}
                  alt={ta(`materials.items.${key}.title`)}
                  fill
                  sizes="(min-width: 1024px) 300px, 46vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-ink">{ta(`materials.items.${key}.title`)}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{ta(`materials.items.${key}.text`)}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* Production */}
      <Section tone="canvas">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:items-end">
          <div>
            <SectionHeader label={ta('process.label')} title={ta('process.title')} />
            <p className="mt-6 text-body text-muted" data-reveal>
              {ta('process.text')}
            </p>
            <div className="mt-8 flex flex-wrap gap-3" data-reveal>
              <LinkButton href="/gallery" variant="outline">
                {t('nav.gallery')}
              </LinkButton>
              <LinkButton href="/contact" variant="ghost">
                {t('common.contactUs')} →
              </LinkButton>
            </div>
          </div>
          <ul className="grid gap-4 sm:grid-cols-3">
            {processPhotos.map(({ key, image }, i) => (
              <li key={key} data-reveal style={{ ['--reveal-delay' as string]: `${i * 100}ms` }}>
                <figure>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                    <SmartImage
                      src={image}
                      alt={ta(`process.photos.${key}`)}
                      fill
                      sizes="(min-width: 1024px) 280px, (min-width: 640px) 30vw, 92vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 text-sm text-muted">{ta(`process.photos.${key}`)}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <CtaBand
        title={t('home.ctaBand.title')}
        text={t('home.ctaBand.text')}
        primaryLabel={t('home.ctaBand.primary')}
        whatsappLabel={t('home.ctaBand.secondary')}
        whatsappMessage={t('whatsapp.defaultMessage')}
        location="about-cta"
      />
    </>
  );
}
