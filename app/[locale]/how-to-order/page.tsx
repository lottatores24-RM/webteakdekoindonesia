import type { Metadata } from 'next';
import { LayoutGrid, MessageCircle, Ship } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n';
import { faqJsonLd, pageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/sections/PageHero';
import { StepCard } from '@/components/sections/StepCard';
import { FAQAccordion } from '@/components/sections/FAQAccordion';
import { CtaBand } from '@/components/sections/CtaBand';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { JsonLd } from '@/components/ui/JsonLd';
import { LinkButton } from '@/components/ui/Button';

type Props = { params: { locale: Locale } };

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta.howToOrder' });
  return pageMetadata({ locale, path: '/how-to-order', title: t('title'), description: t('description') });
}

const steps = [
  { key: 'choose', Icon: LayoutGrid, href: '/collections' },
  { key: 'inquire', Icon: MessageCircle, href: '/contact' },
  { key: 'ship', Icon: Ship, href: '/export-info' },
] as const;

export default async function HowToOrderPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const faq = (['q1', 'q2', 'q3', 'q4'] as const).map((k) => ({
    q: t(`howToOrder.faq.${k}.q`),
    a: t(`howToOrder.faq.${k}.a`),
  }));

  return (
    <>
      <JsonLd data={faqJsonLd(faq)} />
      <PageHero
        label={t('howToOrder.hero.label')}
        title={t('howToOrder.hero.title')}
        subtitle={t('howToOrder.hero.subtitle')}
        breadcrumb={<Breadcrumb locale={locale} items={[{ label: t('nav.howToOrder') }]} />}
      />

      <Section tone="surface" className="!pt-0">
        <h2 className="sr-only">{t('howToOrder.stepsTitle')}</h2>
        <ol className="relative grid gap-6 lg:grid-cols-3">
          {/* connecting line between the numbered steps (desktop) */}
          <span
            aria-hidden="true"
            className="absolute left-[16%] right-[16%] top-[60px] hidden border-t-2 border-dashed border-accent/30 lg:block"
          />
          {steps.map(({ key, Icon, href }, i) => (
            <StepCard
              key={key}
              index={i}
              number={i + 1}
              title={t(`howToOrder.steps.${key}.title`)}
              text={t(`howToOrder.steps.${key}.text`)}
              icon={<Icon className="h-8 w-8" />}
              action={
                <LinkButton href={href} variant="ghost" className="px-0">
                  {t(`howToOrder.steps.${key}.cta`)} →
                </LinkButton>
              }
            />
          ))}
        </ol>
      </Section>

      <Section tone="canvas">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <SectionHeader label={t('howToOrder.faqLabel')} title={t('howToOrder.faqTitle')} />
          <FAQAccordion items={faq} />
        </div>
      </Section>

      <CtaBand
        title={t('howToOrder.ctaTitle')}
        text={t('howToOrder.ctaText')}
        primaryLabel={t('common.requestCatalog')}
        whatsappLabel={t('common.chatWhatsApp')}
        whatsappMessage={t('whatsapp.defaultMessage')}
        location="how-to-order-cta"
      />
    </>
  );
}
