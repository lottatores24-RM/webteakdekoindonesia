import type { Metadata } from 'next';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n';
import { faqJsonLd, pageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/sections/PageHero';
import { FAQAccordion } from '@/components/sections/FAQAccordion';
import { CtaBand } from '@/components/sections/CtaBand';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Section } from '@/components/ui/Section';
import { JsonLd } from '@/components/ui/JsonLd';

type Props = { params: { locale: Locale } };

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta.faq' });
  return pageMetadata({ locale, path: '/faq', title: t('title'), description: t('description') });
}

const groups = ['products', 'ordering', 'shipping', 'company'] as const;

export default async function FaqPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const messages = await getMessages({ locale });
  // Questions are read from the messages file so new ones can be added without code changes
  const items = Object.values(messages.faq.items) as { group: string; q: string; a: string }[];

  return (
    <>
      <JsonLd data={faqJsonLd(items)} />
      <PageHero
        label={t('faq.hero.label')}
        title={t('faq.hero.title')}
        subtitle={t('faq.hero.subtitle')}
        breadcrumb={<Breadcrumb locale={locale} items={[{ label: t('nav.faq') }]} />}
      />

      <Section tone="canvas">
        <div className="grid gap-12 lg:grid-cols-[240px_1fr] lg:gap-20">
          <nav aria-label={t('faq.hero.label')} className="hidden lg:block">
            <ul className="sticky top-28 space-y-1">
              {groups.map((g) => (
                <li key={g}>
                  <a
                    href={`#faq-${g}`}
                    className="inline-flex min-h-[44px] items-center font-semibold text-muted hover:text-accent-text"
                  >
                    {t(`faq.groups.${g}`)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-16">
            {groups.map((g) => (
              <section key={g} id={`faq-${g}`} aria-labelledby={`faq-${g}-title`}>
                <h2 id={`faq-${g}-title`} className="mb-6 font-display text-3xl font-bold text-ink">
                  {t(`faq.groups.${g}`)}
                </h2>
                <FAQAccordion items={items.filter((i) => i.group === g)} />
              </section>
            ))}
          </div>
        </div>
      </Section>

      <CtaBand
        title={t('faq.ctaTitle')}
        text={t('faq.ctaText')}
        primaryLabel={t('common.contactUs')}
        primaryHref="/contact"
        whatsappLabel={t('common.chatWhatsApp')}
        whatsappMessage={t('whatsapp.defaultMessage')}
        location="faq-cta"
      />
    </>
  );
}
