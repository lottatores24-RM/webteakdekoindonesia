import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Clock, ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';
import { mapsEmbedUrl, mapsLinkUrl, site } from '@/lib/site';
import { telHref } from '@/lib/utils';
import { PageHero } from '@/components/sections/PageHero';
import { InquiryForm } from '@/components/sections/InquiryForm';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Section } from '@/components/ui/Section';
import { SmartImage } from '@/components/ui/SmartImage';
import { WhatsAppLink } from '@/components/layout/WhatsAppLink';

type Props = { params: { locale: Locale } };

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta.contact' });
  return pageMetadata({ locale, path: '/contact', title: t('title'), description: t('description') });
}

export default async function ContactPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const tc = await getTranslations({ locale, namespace: 'contact' });

  return (
    <>
      <PageHero
        label={tc('hero.label')}
        title={tc('hero.title')}
        subtitle={tc('hero.subtitle')}
        breadcrumb={<Breadcrumb locale={locale} items={[{ label: t('nav.contact') }]} />}
      />

      <Section tone="surface" className="!pt-0" id="inquiry">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
          <div>
            <h2 className="sr-only">{tc('formTitle')}</h2>
            <Suspense>
              <InquiryForm readSearchParams />
            </Suspense>
          </div>

          <aside className="space-y-8">
            <div className="rounded-lg bg-canvas p-7 ring-1 ring-line">
              <h2 className="font-display text-2xl font-bold text-ink">{tc('infoTitle')}</h2>
              <dl className="mt-6 space-y-6 text-[15px]">
                <div className="flex gap-4">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent-text" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-ink">{tc('address')}</dt>
                    <dd className="mt-1 text-muted">{site.address.full}</dd>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-accent-text" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-ink">{tc('contactPersons')}</dt>
                    {site.contacts.map((c) => (
                      <dd key={c.wa} className="mt-1 text-muted">
                        {c.name} —{' '}
                        <a
                          href={telHref(c.phone)}
                          className="text-ink underline-offset-4 hover:text-accent-text hover:underline"
                        >
                          {c.phone}
                        </a>
                      </dd>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-accent-text" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-ink">{tc('email')}</dt>
                    <dd className="mt-1">
                      <a
                        href={`mailto:${site.email}`}
                        className="text-ink underline-offset-4 hover:text-accent-text hover:underline"
                      >
                        {site.email}
                      </a>
                    </dd>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-accent-text" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-ink">{tc('hours')}</dt>
                    <dd className="mt-1 text-muted">{site.operatingHours}</dd>
                  </div>
                </div>
              </dl>
              <div className="mt-8 space-y-3">
                {site.contacts.map((c) => (
                  <WhatsAppLink
                    key={c.wa}
                    number={c.wa}
                    message={t('whatsapp.defaultMessage')}
                    location="contact-sidebar"
                    className="w-full"
                  >
                    {tc('whatsapp')} — {c.name.split(' ')[0]}
                  </WhatsAppLink>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-lg bg-canvas ring-1 ring-line">
              <div className="relative aspect-[16/10]">
                <SmartImage
                  src="/images/hero/garden-display.jpg"
                  alt={t('gallery.photos.garden.alt')}
                  fill
                  sizes="(min-width: 1024px) 420px, 92vw"
                  className="object-cover"
                />
              </div>
              <div className="p-7">
                <h2 className="font-display text-xl font-bold text-ink">{tc('visitTitle')}</h2>
                <p className="mt-2 text-[15px] text-muted">{tc('visitText')}</p>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      <section aria-label={tc('mapTitle')} className="relative bg-canvas">
        <iframe
          src={mapsEmbedUrl}
          title={tc('mapTitle')}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block h-[420px] w-full border-0 grayscale-[30%] lg:h-[480px]"
          allowFullScreen
        />
        <a
          href={mapsLinkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-5 left-5 inline-flex min-h-[44px] items-center gap-2 rounded bg-white px-4 text-sm font-semibold text-[#1A1917] shadow-soft hover:bg-surface"
        >
          {tc('openMaps')}
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </section>
    </>
  );
}
