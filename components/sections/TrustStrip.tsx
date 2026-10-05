import { Leaf, Recycle, Ship, Warehouse } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/lib/i18n';

const items = [
  { key: 'export', Icon: Ship },
  { key: 'material', Icon: Recycle },
  { key: 'eco', Icon: Leaf },
  { key: 'visit', Icon: Warehouse },
] as const;

export async function TrustStrip({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'home.trust' });
  return (
    <section id="trust" aria-labelledby="trust-title" className="border-b border-line bg-canvas">
      <div className="container max-w-content py-14 lg:py-16">
        <h2 id="trust-title" className="sr-only">
          {t('label')}
        </h2>
        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ key, Icon }, i) => (
            <li key={key} className="flex gap-4" data-reveal style={{ ['--reveal-delay' as string]: `${i * 100}ms` }}>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface text-accent-text">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-bold text-ink">{t(`items.${key}.title`)}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{t(`items.${key}.text`)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
