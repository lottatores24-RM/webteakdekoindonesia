import type { Metadata } from 'next';
import { CircleCheck } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/sections/PageHero';
import { InquiryForm } from '@/components/sections/InquiryForm';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Section } from '@/components/ui/Section';
import { SmartImage } from '@/components/ui/SmartImage';
import { WhatsAppLink } from '@/components/layout/WhatsAppLink';

type Props = { params: { locale: Locale } };

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta.requestCatalog' });
  return pageMetadata({ locale, path: '/request-catalog', title: t('title'), description: t('description') });
}

const benefits = ['b1', 'b2', 'b3', 'b4'] as const;

export default async function RequestCatalogPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const tr = await getTranslations({ locale, namespace: 'requestCatalog' });

  return (
    <>
      <PageHero
        label={tr('hero.label')}
        title={tr('hero.title')}
        subtitle={tr('hero.subtitle')}
        breadcrumb={<Breadcrumb locale={locale} items={[{ label: t('nav.requestCatalog') }]} />}
      />
      <Section tone="surface" className="!pt-0">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-14">
          <aside>
            <div className="grid grid-cols-2 gap-3">
              {['/images/products/tables/root-bench.jpg', '/images/products/decoration/root-frame-mirror.jpg'].map(
                (src, i) => (
                  <div key={src} className="relative aspect-[4/5] overflow-hidden rounded-lg bg-white">
                    <SmartImage
                      src={src}
                      alt={i === 0 ? t('categories.tables-and-stools.name') : t('categories.decoration.name')}
                      fill
                      sizes="(min-width: 1024px) 220px, 46vw"
                      className={i === 0 ? 'object-contain p-3' : 'object-cover'}
                    />
                  </div>
                ),
              )}
            </div>
            <h2 className="mt-10 font-display text-2xl font-bold text-ink">{tr('benefitsTitle')}</h2>
            <ul className="mt-5 space-y-3">
              {benefits.map((b) => (
                <li key={b} className="flex gap-3 text-muted">
                  <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent-text" aria-hidden="true" />
                  {tr(`benefits.${b}`)}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-muted">{tr('orWhatsApp')}</p>
            <WhatsAppLink message={t('whatsapp.defaultMessage')} location="catalog-page" className="mt-3">
              {t('common.chatWhatsApp')}
            </WhatsAppLink>
          </aside>
          <InquiryForm defaultIntent="catalog" />
        </div>
      </Section>
    </>
  );
}
